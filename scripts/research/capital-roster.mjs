// 华人军团旗舰驾驶员备案：每团每种船一条 zKillboard 高级搜索侧栏排行，取全时段以本团身份开过该船的角色，
// 写入 docs/corporations/<军团ID>.json 的 <船>-all-time 名单，并为没有共享记录的角色建最简记录。
// node scripts/research/capital-roster.mjs --ship titan|super --all [--refresh]
// node scripts/research/capital-roster.mjs --ship titan|super <军团ID> [军团ID…] [--refresh]
// node scripts/research/capital-roster.mjs --ship titan|super --profiles   （只补标签与 ESI 头衔，不查 zKillboard）
// --all 覆盖军团档案与 src/corps 军团页的全部军团。筛过的军团（含空名单）记在 docs/corporations/capital-scans.json，
// 再跑一律跳过，--refresh 才重取。取完名单后，名单里的角色都加驾驶员标签；没有 ESI 当前名片的补取游戏内头衔与简介。
// 次数是该角色以本团身份开该船出现在攻击方的 KM 张数，不是击杀数，也不含损失。
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildFilters, queryTop } from './zkill-asearch.mjs';
import { createRequestGuard } from './request-guard.mjs';
import { connectZkillChrome, openZkillPage, waitZkillReady, cache, repo } from './zkill-chrome.mjs';
import { DIRECTORY, ROSTER_LIMIT, characterArchivePath } from '../corporation-archive.mjs';
import { resolve } from '../workspace.mjs';

export const SHIPS = {
  titan: { scope: 'titan-all-time', group: 30, label: '泰坦驾驶员', name: '泰坦' },
  super: { scope: 'super-all-time', group: 659, label: '超级航母驾驶员', name: '超级航母' },
};
export const SCAN_LEDGER = `${DIRECTORY}/capital-scans.json`;
const ID = /^[1-9]\d*$/;
const shipOf = key => {
  if (!SHIPS[key]) throw new Error(`船种须为 ${Object.keys(SHIPS).join(' / ')}：${key}`);
  return SHIPS[key];
};
const note = ship => `全时段以本团身份开${ship.name}（groupID ${ship.group}）出现在攻击方的角色；kills为命中KM张数，不是击杀数，不含${ship.name}损失；不带includeAssociates。`;

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
};

// 网页可直接打开的同一筛选；不带 includeAssociates，侧栏只数本团开该船的人。
export function rosterQuery(shipKey, corporationId) {
  const ship = shipOf(shipKey);
  if (!ID.test(String(corporationId))) throw new Error(`军团ID须为正整数：${corporationId}`);
  const hash = {
    buttons: ['togglefilters', 'alltime', 'attackers-aand', 'sort-date', 'sort-desc', 'page1', 'attackersonly'],
    attackers: [{ type: 'corporationID', id: String(corporationId) }, { type: 'groupID', id: String(ship.group) }],
  };
  return { filters: buildFilters(hash), source: 'https://zkillboard.com/asearch/#' + encodeURIComponent(JSON.stringify(hash)) };
}

export function rosterRanking(shipKey, { source, capturedOn, rows }) {
  const ship = shipOf(shipKey), truncated = rows.length >= ROSTER_LIMIT;
  return {
    scope: ship.scope, period: null, target: null, purpose: 'roster', refresh: 'on-demand', source, captured_on: capturedOn,
    acquisition: { state: truncated ? 'partial' : 'captured', available_count: truncated ? null : rows.length,
      note: truncated ? `${note(ship)}已到${ROSTER_LIMIT}行上限，名单不全。` : note(ship) },
    references: [],
    entries: rows.map(row => ({ rank: row.rank, character_id: String(row.id), kills: String(row.count), isk: null })),
  };
}

// 军团档案之外，src/corps 军团页也算本次范围；名称取自军团页的 ESI 快照。
export function targetCorporations(root) {
  const targets = new Map();
  const archive = resolve(root, DIRECTORY);
  for (const file of fs.existsSync(archive) ? fs.readdirSync(archive).filter(file => /^\d+\.json$/.test(file)).sort() : []) {
    targets.set(file.slice(0, -5), { id: file.slice(0, -5), names: null });
  }
  const corps = path.join(root, 'src/corps');
  for (const slug of fs.existsSync(corps) ? fs.readdirSync(corps).sort() : []) {
    const file = path.join(corps, slug, `${slug}.json`);
    if (!fs.existsSync(file)) continue;
    const page = readJson(file), id = String(page.corp?.id ?? '');
    if (!ID.test(id) || targets.has(id)) continue;
    targets.set(id, { id, names: [page.esi?.name, page.esi?.ticker, page.corp?.cn_name].filter((name, index, all) => name && all.indexOf(name) === index) });
  }
  return [...targets.values()];
}

// 筛过记录：{ version: 1, scans: { 船种: { 军团ID: { scanned_on, pilots } } } }；空名单也记，下次不再重筛。
export function readScans(root) {
  const file = resolve(root, SCAN_LEDGER);
  return fs.existsSync(file) ? readJson(file) : { version: 1, scans: {} };
}

export function recordScan(root, shipKey, id, { scannedOn, pilots }) {
  shipOf(shipKey);
  const ledger = readScans(root);
  const scans = { ...ledger.scans[shipKey], [String(id)]: { scanned_on: scannedOn, pilots } };
  ledger.scans[shipKey] = Object.fromEntries(Object.entries(scans).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })));
  writeJson(resolve(root, SCAN_LEDGER), ledger);
}

export const isScanned = (root, shipKey, id) => Boolean(readScans(root).scans[shipKey]?.[String(id)]);

// 名单写进军团档案（重取时原位替换），缺共享记录的角色建最简记录，名单角色加驾驶员标签。
// 空名单且尚无军团档案的不新建档案，返回 written: false。
export function applyRoster(root, shipKey, { id, names, ranking, rows }) {
  const ship = shipOf(shipKey);
  const file = resolve(root, `${DIRECTORY}/${id}.json`);
  let organization;
  if (fs.existsSync(file)) organization = readJson(file);
  else if (rows.length) {
    if (!names?.length) throw new Error(`军团 ${id} 尚无档案，也没有可用名称`);
    organization = { version: 1, kind: 'corporation', id: String(id), names, rankings: [], account_groups: [], observations: [], references: [] };
  } else return { written: false, added: [] };
  const index = organization.rankings.findIndex(item => item.scope === ship.scope);
  if (index < 0) organization.rankings.push(ranking); else organization.rankings[index] = ranking;
  const shards = new Map(), added = [], changed = new Set();
  for (const row of rows) {
    const characterId = String(row.id), shard = resolve(root, characterArchivePath(characterId));
    if (!shards.has(shard)) shards.set(shard, fs.existsSync(shard) ? readJson(shard) : { version: 1, records: {} });
    const records = shards.get(shard).records;
    if (!records[characterId]) {
      records[characterId] = { id: characterId, names: [row.name || characterId], labels: [], profiles: [], evidence: [ranking.source],
        review: { state: 'unread', findings: [], next_steps: [] } };
      added.push(characterId);
      changed.add(shard);
    }
    if (!records[characterId].labels.includes(ship.label)) { records[characterId].labels.push(ship.label); changed.add(shard); }
  }
  for (const shard of changed) writeJson(shard, shards.get(shard));
  writeJson(file, organization);
  return { written: true, added };
}

// 与既有 esi-current 名片同格式：缺字段记 absent，空串记 empty。
export function esiProfile(id, data, asOf) {
  const field = value => value === undefined || value === null ? [null, 'absent'] : value === '' ? ['', 'empty'] : [value, 'value'];
  const [title, title_state] = field(data.title), [description, description_state] = field(data.description);
  return { as_of: asOf, title, title_state, description, description_state, corporation_id: String(data.corporation_id),
    ...(data.alliance_id && { alliance_id: String(data.alliance_id) }),
    source: `https://esi.evetech.net/latest/characters/${id}/`, source_key: `esi-current:${asOf}` };
}

// 某船种全部名单里的角色。
export function rosterPilots(root, shipKey) {
  const ship = shipOf(shipKey), ids = new Set();
  for (const file of fs.readdirSync(resolve(root, DIRECTORY)).filter(file => /^\d+\.json$/.test(file))) {
    for (const ranking of readJson(resolve(root, `${DIRECTORY}/${file}`)).rankings.filter(ranking => ranking.scope === ship.scope)) {
      for (const entry of ranking.entries) ids.add(entry.character_id);
    }
  }
  return [...ids];
}

// 补标签，写入新取的名片，返回还没有 ESI 当前名片的角色。
export function annotatePilots(root, shipKey, ids, profiles = new Map()) {
  const { label } = shipOf(shipKey), shards = new Map(), missing = [];
  for (const id of ids) {
    const shard = resolve(root, characterArchivePath(id));
    if (!shards.has(shard)) shards.set(shard, { data: readJson(shard), changed: false });
    const entry = shards.get(shard), record = entry.data.records[id];
    if (!record) throw new Error(`角色 ${id} 在驾驶员名单里却无共享记录`);
    if (!record.labels.includes(label)) { record.labels.push(label); entry.changed = true; }
    if (profiles.has(id)) { record.profiles.push(profiles.get(id)); entry.changed = true; }
    else if (!record.profiles.some(profile => profile.source_key?.startsWith('esi-current:'))) missing.push(id);
  }
  for (const [shard, entry] of shards) if (entry.changed) writeJson(shard, entry.data);
  return missing;
}

async function fetchProfiles(root, shipKey) {
  const missing = annotatePilots(root, shipKey, rosterPilots(root, shipKey));
  console.log(`${SHIPS[shipKey].label}缺 ESI 头衔 ${missing.length} 人`);
  const request = createRequestGuard({ limit: missing.length }), asOf = new Date().toISOString().slice(0, 10);
  let profiles = new Map(), failed = 0;
  for (const [index, id] of missing.entries()) {
    try {
      const response = await request(`https://esi.evetech.net/latest/characters/${id}/`);
      if (!response.ok) { failed++; console.error(`${id}：ESI ${response.status}`); continue; }
      profiles.set(id, esiProfile(id, await response.json(), asOf));
    } catch (error) { console.error(error.message); failed += missing.length - index; break; }
    // 每 50 人落盘一次，中断后重跑只补剩下的。
    if (profiles.size >= 50) { annotatePilots(root, shipKey, [...profiles.keys()], profiles); profiles = new Map(); console.log(`已补 ${index + 1}/${missing.length}`); }
  }
  if (profiles.size) annotatePilots(root, shipKey, [...profiles.keys()], profiles);
  console.log(`ESI 头衔补完，失败 ${failed} 人`);
  if (failed) process.exitCode = 1;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main(argv) {
  argv = [...argv];
  const shipAt = argv.indexOf('--ship'), shipKey = shipAt < 0 ? undefined : argv.splice(shipAt, 2)[1];
  const refresh = argv.includes('--refresh'), all = argv.includes('--all'), profilesOnly = argv.includes('--profiles');
  const ids = argv.filter(arg => !arg.startsWith('--'));
  const usage = !SHIPS[shipKey] || (profilesOnly ? argv.length !== 1 : (all && ids.length) || (!all && !ids.length));
  if (usage || argv.some(arg => arg.startsWith('--') && !['--refresh', '--all', '--profiles'].includes(arg)) || ids.some(id => !ID.test(id))) {
    console.error('用法：node scripts/research/capital-roster.mjs --ship titan|super (--all | <军团ID> [军团ID…]) [--refresh]\n      node scripts/research/capital-roster.mjs --ship titan|super --profiles');
    process.exit(1);
  }
  const ship = SHIPS[shipKey];
  if (profilesOnly) return fetchProfiles(repo, shipKey);
  const known = new Map(targetCorporations(repo).map(target => [target.id, target]));
  const queue = (all ? [...known.values()] : ids.map(id => known.get(id) ?? { id, names: null }))
    .filter(target => refresh || !isScanned(repo, shipKey, target.id));
  console.log(`${ship.name}待筛 ${queue.length} 家${refresh ? '' : '（筛过的跳过）'}`);
  const log = { started_at: new Date().toISOString(), done: [], empty: [], timed_out: [], failed: [] };
  const { browser, context } = await connectZkillChrome('https://zkillboard.com/asearch/');
  let page;
  try {
    page = await openZkillPage(context, 'https://zkillboard.com/asearch/');
    if (!await waitZkillReady(page, page => page.evaluate(() => typeof $ === 'function' && typeof $.param === 'function'))) {
      console.error('浏览器验证尚未通过，停止；未取得结果。');
      process.exitCode = 2;
      return;
    }
    for (const [index, target] of queue.entries()) {
      const { filters, source } = rosterQuery(shipKey, target.id);
      let result;
      try { result = await queryTop(page, filters, 'character'); }
      catch (error) {
        // 非 200 多半是限流或拦截：停下，不重试绕过。
        log.failed.push({ id: target.id, error: error.message });
        console.error(`${target.id}：${error.message}；停止，已写入的不受影响，重跑会跳过。`);
        process.exitCode = 1;
        break;
      }
      // 超时不记入筛过记录，下次重跑会再筛。
      if (result.timedOut) { log.timed_out.push(target.id); console.log(`${index + 1}/${queue.length} ${target.id} 服务器超时`); }
      else {
        const capturedOn = new Date().toISOString().slice(0, 10);
        const ranking = rosterRanking(shipKey, { source, capturedOn, rows: result.rows });
        const { written, added } = applyRoster(repo, shipKey, { id: target.id, names: target.names, ranking, rows: result.rows });
        recordScan(repo, shipKey, target.id, { scannedOn: capturedOn, pilots: result.rows.length });
        (result.rows.length ? log.done : log.empty).push({ id: target.id, pilots: result.rows.length, new_characters: added.length, written });
        console.log(`${index + 1}/${queue.length} ${target.id} ${ship.label} ${result.rows.length} 人，新建角色记录 ${added.length}`);
      }
      await sleep(2000);
    }
  } finally {
    await page?.close().catch(() => {});
    await browser.close();
    fs.mkdirSync(path.join(cache, 'capital-roster'), { recursive: true });
    fs.writeFileSync(path.join(cache, 'capital-roster', `${shipKey}-last-run.json`), JSON.stringify({ ...log, finished_at: new Date().toISOString() }, null, 2));
  }
  const pilots = log.done.reduce((sum, item) => sum + item.pilots, 0);
  console.log(`完成：有${ship.name} ${log.done.length} 家共 ${pilots} 人次，空名单 ${log.empty.length} 家，超时 ${log.timed_out.length} 家；明细 .cache/capital-roster/${shipKey}-last-run.json`);
  if (!process.exitCode) await fetchProfiles(repo, shipKey);
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await main(process.argv.slice(2));
