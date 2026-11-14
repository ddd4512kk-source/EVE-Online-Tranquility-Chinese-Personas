// 华人军团泰坦驾驶员备案：每团一条 zKillboard 高级搜索侧栏排行，取全时段开过泰坦的本团角色，
// 写入 docs/corporations/<军团ID>.json 的 titan-all-time 名单，并为没有共享记录的角色建最简记录。
// node scripts/research/titan-roster.mjs --all [--refresh]
// node scripts/research/titan-roster.mjs <军团ID> [军团ID…] [--refresh]
// node scripts/research/titan-roster.mjs --profiles   （只补标签与 ESI 头衔，不查 zKillboard）
// --all 覆盖军团档案与 src/corps 军团页的全部军团；已有名单的跳过，--refresh 重取。
// 取完名单后，名单里的角色都加“泰坦驾驶员”标签；没有 ESI 当前名片的，补取游戏内头衔与简介。
// 次数是该角色以本团身份开泰坦出现在攻击方的 KM 张数，不是击杀数，也不含泰坦损失。
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildFilters, queryTop } from './zkill-asearch.mjs';
import { createRequestGuard } from './request-guard.mjs';
import { connectZkillChrome, openZkillPage, waitZkillReady, cache, repo } from './zkill-chrome.mjs';
import { DIRECTORY, ROSTER_LIMIT, characterArchivePath } from '../corporation-archive.mjs';

export const SCOPE = 'titan-all-time';
export const TITAN_GROUP_ID = 30;
export const TITAN_LABEL = '泰坦驾驶员';
const ID = /^[1-9]\d*$/;
const NOTE = '全时段以本团身份开泰坦（groupID 30）出现在攻击方的角色；kills为命中KM张数，不是击杀数，不含泰坦损失；不带includeAssociates。';

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
};

// 网页可直接打开的同一筛选；不带 includeAssociates，侧栏只数本团开泰坦的人。
export function titanQuery(corporationId) {
  if (!ID.test(String(corporationId))) throw new Error(`军团ID须为正整数：${corporationId}`);
  const hash = {
    buttons: ['togglefilters', 'alltime', 'attackers-aand', 'sort-date', 'sort-desc', 'page1', 'attackersonly'],
    attackers: [{ type: 'corporationID', id: String(corporationId) }, { type: 'groupID', id: String(TITAN_GROUP_ID) }],
  };
  return { filters: buildFilters(hash), source: 'https://zkillboard.com/asearch/#' + encodeURIComponent(JSON.stringify(hash)) };
}

export function rosterRanking({ source, capturedOn, rows }) {
  const truncated = rows.length >= ROSTER_LIMIT;
  return {
    scope: SCOPE, period: null, target: null, purpose: 'roster', refresh: 'on-demand', source, captured_on: capturedOn,
    acquisition: { state: truncated ? 'partial' : 'captured', available_count: truncated ? null : rows.length,
      note: truncated ? `${NOTE}已到${ROSTER_LIMIT}行上限，名单不全。` : NOTE },
    references: [],
    entries: rows.map(row => ({ rank: row.rank, character_id: String(row.id), kills: String(row.count), isk: null })),
  };
}

// 军团档案之外，src/corps 军团页也算本次范围；名称取自军团页的 ESI 快照。
export function targetCorporations(root) {
  const targets = new Map();
  const archive = path.join(root, DIRECTORY);
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

export function hasRoster(root, id) {
  const file = path.join(root, DIRECTORY, `${id}.json`);
  return fs.existsSync(file) && readJson(file).rankings.some(ranking => ranking.scope === SCOPE);
}

// 名单写进军团档案（重取时原位替换），缺共享记录的角色建最简记录；已有记录不改。
// 空名单且尚无军团档案的不新建档案，返回 created: false。
export function applyRoster(root, { id, names, ranking, rows }) {
  const file = path.join(root, DIRECTORY, `${id}.json`);
  let organization;
  if (fs.existsSync(file)) organization = readJson(file);
  else if (rows.length) {
    if (!names?.length) throw new Error(`军团 ${id} 尚无档案，也没有可用名称`);
    organization = { version: 1, kind: 'corporation', id: String(id), names, rankings: [], account_groups: [], observations: [], references: [] };
  } else return { written: false, added: [] };
  const index = organization.rankings.findIndex(item => item.scope === SCOPE);
  if (index < 0) organization.rankings.push(ranking); else organization.rankings[index] = ranking;
  const shards = new Map(), added = [], changed = new Set();
  for (const row of rows) {
    const characterId = String(row.id), shard = path.join(root, characterArchivePath(characterId));
    if (!shards.has(shard)) shards.set(shard, fs.existsSync(shard) ? readJson(shard) : { version: 1, records: {} });
    const records = shards.get(shard).records;
    if (!records[characterId]) {
      records[characterId] = { id: characterId, names: [row.name || characterId], labels: [], profiles: [], evidence: [ranking.source],
        review: { state: 'unread', findings: [], next_steps: [] } };
      added.push(characterId);
    }
    if (!records[characterId].labels.includes(TITAN_LABEL)) { records[characterId].labels.push(TITAN_LABEL); changed.add(shard); }
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

// 全部泰坦名单里的角色：补标签，列出还没有 ESI 当前名片的。
export function rosterPilots(root) {
  const ids = new Set();
  for (const file of fs.readdirSync(path.join(root, DIRECTORY)).filter(file => /^\d+\.json$/.test(file))) {
    for (const ranking of readJson(path.join(root, DIRECTORY, file)).rankings.filter(ranking => ranking.scope === SCOPE)) {
      for (const entry of ranking.entries) ids.add(entry.character_id);
    }
  }
  return [...ids];
}

export function annotatePilots(root, ids, profiles = new Map()) {
  const shards = new Map(), missing = [];
  for (const id of ids) {
    const shard = path.join(root, characterArchivePath(id));
    if (!shards.has(shard)) shards.set(shard, { data: readJson(shard), changed: false });
    const entry = shards.get(shard), record = entry.data.records[id];
    if (!record) throw new Error(`角色 ${id} 在泰坦名单里却无共享记录`);
    if (!record.labels.includes(TITAN_LABEL)) { record.labels.push(TITAN_LABEL); entry.changed = true; }
    if (profiles.has(id)) { record.profiles.push(profiles.get(id)); entry.changed = true; }
    else if (!record.profiles.some(profile => profile.source_key?.startsWith('esi-current:'))) missing.push(id);
  }
  for (const [shard, entry] of shards) if (entry.changed) writeJson(shard, entry.data);
  return missing;
}

async function fetchProfiles(root) {
  const missing = annotatePilots(root, rosterPilots(root));
  console.log(`泰坦驾驶员缺 ESI 头衔 ${missing.length} 人`);
  const request = createRequestGuard({ limit: missing.length }), asOf = new Date().toISOString().slice(0, 10);
  let profiles = new Map(), failed = 0;
  for (const [index, id] of missing.entries()) {
    try {
      const response = await request(`https://esi.evetech.net/latest/characters/${id}/`);
      if (!response.ok) { failed++; console.error(`${id}：ESI ${response.status}`); continue; }
      profiles.set(id, esiProfile(id, await response.json(), asOf));
    } catch (error) { console.error(error.message); failed += missing.length - index; break; }
    // 每 50 人落盘一次，中断后重跑只补剩下的。
    if (profiles.size >= 50) { annotatePilots(root, [...profiles.keys()], profiles); profiles = new Map(); console.log(`已补 ${index + 1}/${missing.length}`); }
  }
  if (profiles.size) annotatePilots(root, [...profiles.keys()], profiles);
  console.log(`ESI 头衔补完，失败 ${failed} 人`);
  if (failed) process.exitCode = 1;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main(argv) {
  const refresh = argv.includes('--refresh'), all = argv.includes('--all'), profilesOnly = argv.includes('--profiles');
  const ids = argv.filter(arg => !arg.startsWith('--'));
  const usage = profilesOnly ? argv.length !== 1 : (all && ids.length) || (!all && !ids.length);
  if (usage || argv.some(arg => arg.startsWith('--') && !['--refresh', '--all', '--profiles'].includes(arg)) || ids.some(id => !ID.test(id))) {
    console.error('用法：node scripts/research/titan-roster.mjs --all | <军团ID> [军团ID…] [--refresh] | --profiles');
    process.exit(1);
  }
  if (profilesOnly) return fetchProfiles(repo);
  const known = new Map(targetCorporations(repo).map(target => [target.id, target]));
  const queue = (all ? [...known.values()] : ids.map(id => known.get(id) ?? { id, names: null }))
    .filter(target => refresh || !hasRoster(repo, target.id));
  console.log(`待取 ${queue.length} 家${all && !refresh ? '（已有名单的跳过）' : ''}`);
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
      const { filters, source } = titanQuery(target.id);
      let result;
      try { result = await queryTop(page, filters, 'character'); }
      catch (error) {
        // 非 200 多半是限流或拦截：停下，不重试绕过。
        log.failed.push({ id: target.id, error: error.message });
        console.error(`${target.id}：${error.message}；停止，已写入的不受影响，重跑会跳过。`);
        process.exitCode = 1;
        break;
      }
      if (result.timedOut) { log.timed_out.push(target.id); console.log(`${index + 1}/${queue.length} ${target.id} 服务器超时`); }
      else {
        const ranking = rosterRanking({ source, capturedOn: new Date().toISOString().slice(0, 10), rows: result.rows });
        const { written, added } = applyRoster(repo, { id: target.id, names: target.names, ranking, rows: result.rows });
        (result.rows.length ? log.done : log.empty).push({ id: target.id, pilots: result.rows.length, new_characters: added.length, written });
        console.log(`${index + 1}/${queue.length} ${target.id} 泰坦驾驶员 ${result.rows.length} 人，新建角色记录 ${added.length}`);
      }
      await sleep(2000);
    }
  } finally {
    await page?.close().catch(() => {});
    await browser.close();
    fs.mkdirSync(path.join(cache, 'titan-roster'), { recursive: true });
    fs.writeFileSync(path.join(cache, 'titan-roster', 'last-run.json'), JSON.stringify({ ...log, finished_at: new Date().toISOString() }, null, 2));
  }
  const pilots = log.done.reduce((sum, item) => sum + item.pilots, 0);
  console.log(`完成：有泰坦 ${log.done.length} 家共 ${pilots} 人次，空名单 ${log.empty.length} 家，超时 ${log.timed_out.length} 家；明细 .cache/titan-roster/last-run.json`);
  if (!process.exitCode) await fetchProfiles(repo);
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await main(process.argv.slice(2));
