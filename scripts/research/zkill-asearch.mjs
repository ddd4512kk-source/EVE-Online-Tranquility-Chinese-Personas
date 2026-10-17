// 跑一条 zKillboard 高级搜索（asearch），取全部击杀 ID，再用 zKB API + ESI 补全最新 N 张 KM。
// node scripts/research/zkill-asearch.mjs <asearch URL 或 # 后的 JSON> <.cache/输出前缀> [--details N=100] [--ids-only] [--pages N]
// 网页上调好的链接可原样使用：脚本按站点 asearch.js 的规则把 # 后的 JSON 直接译成查询参数，
// 浏览器只用来通过 Cloudflare（页面自身异步载入筛选项，读它的状态会漏项）。
// 输出 <前缀>.json（筛选条件、ID、逐张 KM）与 <前缀>.tsv（一行一张，含筛选点名者当时所开船）。
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { zkillUrl, cachePrefix, relayToWindows, connectZkillChrome, openZkillPage, waitZkillReady } from './zkill-chrome.mjs';

// 把网址 # 后的 JSON 译成 /asearchquery/ 参数；时间预设换算成 UTC 起止。
export function buildFilters(hash, now = new Date()) {
  const buttons = hash.buttons || [];
  const labels = buttons.filter(button => button.startsWith('label-')).map(button => button.slice(6))
    .concat(buttons.filter(button => /^(attackers|either|victims|items)-(and|aand|or)$/.test(button)));
  const sortBy = buttons.find(button => /^sort-(date|isk|involved|damage|points)$/.test(button))?.slice(5) || 'date';
  const sortDir = buttons.includes('sort-asc') ? 'asc' : 'desc';
  const presets = ['custom', 'alltime', 'week', 'recent', 'last year', 'prior month', 'current month', 'previous year', 'current year'];
  let epochbtn = presets.find(preset => buttons.includes(preset)) || 'week';
  const fmt = date => date.toISOString().slice(0, 16);
  const utc = (year, month) => new Date(Date.UTC(year, month, 1));
  const [y, m] = [now.getUTCFullYear(), now.getUTCMonth()];
  const ranges = {
    'last year': [new Date(now - 365 * 86400000), now],
    'current month': [utc(y, m), now],
    'prior month': [utc(y, m - 1), new Date(utc(y, m) - 60000)],
    'current year': [utc(y, 0), now],
    'previous year': [utc(y - 1, 0), new Date(utc(y, 0) - 60000)],
  };
  let epoch = { start: hash.dtstart || '', end: hash.dtend || '' };
  if (ranges[epochbtn]) { epoch = { start: fmt(ranges[epochbtn][0]), end: fmt(ranges[epochbtn][1]) }; epochbtn = 'custom'; }
  const list = key => (hash[key] || []).map(({ type, id }) => ({ type, id: Number(id) }));
  return {
    location: list('location'), attackers: list('attackers'), neutrals: list('neutrals'), victims: list('victims'), items: list('items'),
    labels, epochbtn, epoch, radios: { sort: { sortBy, sortDir } }, includeAssociates: hash.includeAssociates === true,
  };
}

export function parseInput(input) {
  // 也可直接传网址 # 后那段 JSON（未编码），免去在网页上点选。
  if (input.trim().startsWith('{')) return JSON.parse(input);
  const url = zkillUrl(input);
  if (url.pathname !== '/asearch/' || !url.hash) throw new Error('需要带 # 筛选条件的 https://zkillboard.com/asearch/ 链接');
  return JSON.parse(decodeURIComponent(url.hash.slice(1)));
}

// 筛选点名的参与者：In（aand）栏须同一人满足该栏全部项，其余栏只要角色／军团／联盟任一项对上。
export function focusMatcher(filters) {
  const fields = { characterID: 'character_id', corporationID: 'corporation_id', allianceID: 'alliance_id', shipID: 'ship_type_id', shipTypeID: 'ship_type_id' };
  const columns = [['attackers', 'attackers', [false]], ['neutrals', 'either', [true, false]], ['victims', 'victims', [true]]]
    .map(([key, button, sides]) => ({ sides, all: filters.labels.includes(`${button}-aand`), entries: filters[key].filter(row => fields[row.type]) }))
    .filter(column => column.entries.some(row => /^(character|corporation|alliance)ID$/.test(row.type)));
  const hit = (party, row) => party[fields[row.type]] === row.id;
  return (party, isVictim) => columns.some(column => column.sides.includes(isVictim) && (column.all
    ? column.entries.every(row => hit(party, row))
    : column.entries.some(row => !/^ship/.test(row.type) && hit(party, row))));
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function getJson(href, init) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(href, { ...init, headers: { 'User-Agent': 'EVE-Online-Tranquility-Chinese-Personas research', 'Accept-Encoding': 'gzip', ...init?.headers }, signal: AbortSignal.timeout(30000) });
    if (response.ok) return response.json();
    if (response.status !== 429 && response.status < 500) throw new Error(`${href} ${response.status}`);
    await sleep(2000 * (attempt + 1));
  }
  throw new Error(`${href} 重试失败`);
}

async function loadKill(id) {
  const [zkb] = await getJson(`https://zkillboard.com/api/killID/${id}/`);
  if (!zkb?.zkb?.hash) throw new Error(`zKB 无 ${id} 的 hash`);
  const km = await getJson(`https://esi.evetech.net/latest/killmails/${id}/${zkb.zkb.hash}/?datasource=tranquility`);
  return { ...km, zkb: zkb.zkb };
}

async function resolveNames(ids) {
  const names = new Map(), list = [...ids].filter(id => id > 0);
  const post = chunk => getJson('https://esi.evetech.net/latest/universe/names/?datasource=tranquility', { method: 'POST', body: JSON.stringify(chunk), headers: { 'Content-Type': 'application/json' } });
  for (let i = 0; i < list.length; i += 900) {
    const chunk = list.slice(i, i + 900);
    try { for (const row of await post(chunk)) names.set(row.id, row.name); }
    catch { for (const id of chunk) try { const [row] = await post([id]); names.set(row.id, row.name); } catch {} } // 有删档 ID 时整批 404，逐个兜底。
  }
  return names;
}

// 服务器每页 100 张、最多 10 页。时间段满额就对半拆开重查（兜底，筛选应先写精确），1 小时仍满才记截断。
async function queryKills(page, filters, pages) {
  const ids = new Set(), truncatedWindows = [];
  let requests = 0;
  const fmt = ms => new Date(ms).toISOString().slice(0, 16);
  async function paged(overrides) {
    const found = [];
    for (let n = 1; n <= pages; n++) {
      const data = { ...filters, ...overrides, radios: { ...filters.radios, page: n }, queryType: 'kills' };
      let kills;
      for (let attempt = 0; attempt < 40 && !kills; attempt++) {
        requests++;
        const result = await page.evaluate(async data => {
          const response = await fetch('/asearchquery/?' + $.param(data));
          return { status: response.status, body: response.status === 200 ? await response.json() : null };
        }, data, 90000);
        if (result.status === 202) await sleep(3000);
        else if (result.status !== 200) throw new Error(`asearchquery ${result.status}`);
        else kills = result.body.kills;
      }
      if (!kills) throw new Error('asearchquery 排队超时');
      found.push(...kills);
      if (kills.length < 100) return { found, full: false };
    }
    return { found, full: true };
  }
  async function window(from, to) {
    const { found, full } = await paged({ epochbtn: 'custom', epoch: { start: fmt(from), end: fmt(to) } });
    if (full && to - from > 3600000) {
      console.log(`${fmt(from)}～${fmt(to)} 满 ${found.length} 张，对半拆开`);
      const middle = from + Math.floor((to - from) / 2 / 60000) * 60000;
      await window(from, middle);
      await window(middle, to);
      return;
    }
    found.forEach(id => ids.add(id));
    if (full) truncatedWindows.push([fmt(from), fmt(to)]);
  }
  if (['week', 'recent'].includes(filters.epochbtn)) { // 服务器按固定集合取，不拆时间段。
    const { found, full } = await paged({});
    found.forEach(id => ids.add(id));
    if (full) truncatedWindows.push([filters.epochbtn, '']);
  } else {
    const all = filters.epochbtn === 'alltime' || !filters.epoch.start;
    await window(all ? Date.parse('2007-12-01T00:00Z') : Date.parse(filters.epoch.start + 'Z'),
      !all && filters.epoch.end ? Date.parse(filters.epoch.end + 'Z') : Date.now());
  }
  return { ids: [...ids].sort((a, b) => b - a), truncatedWindows, requests };
}

async function main(argv) {
  const args = [...argv];
  const flag = name => { const i = args.indexOf(name); return i < 0 ? undefined : args.splice(i, 2)[1]; };
  const idsOnly = args.includes('--ids-only') && args.splice(args.indexOf('--ids-only'), 1);
  const maxPages = Math.max(1, Math.min(10, Number(flag('--pages') || 10)));
  // 每张 KM 补全要两次请求；命中太多说明筛选不够精确，先收紧筛选，而不是全量补全。
  const maxDetails = Math.max(0, Number(flag('--details') ?? 100));
  const [input, output] = args;
  if (!input || !output) {
    console.error('用法：node scripts/research/zkill-asearch.mjs <asearch URL 或 # 后的 JSON> <.cache/输出前缀> [--details N=100] [--ids-only] [--pages N]');
    process.exit(1);
  }
  const hash = parseInput(input);
  const filters = buildFilters(hash);
  const source = 'https://zkillboard.com/asearch/#' + encodeURIComponent(JSON.stringify(hash));
  const prefix = cachePrefix(output);
  if (relayToWindows(import.meta.url, argv)) return;

  const { browser, context } = await connectZkillChrome('https://zkillboard.com/asearch/');
  let query, page;
  try {
    page = await openZkillPage(context, 'https://zkillboard.com/asearch/');
    if (await waitZkillReady(page, page => page.evaluate(() => typeof $ === 'function' && typeof $.param === 'function'))) query = await queryKills(page, filters, maxPages);
    else await page.screenshot({ path: `${prefix}-blocked.png` }).catch(() => {});
  } finally {
    // 关掉本次标签并断开 CDP，保留独立 Chrome 窗口及 profile。
    await page?.close().catch(() => {});
    await browser.close();
  }
  if (!query) {
    console.error('浏览器验证尚未通过，停止；未取得结果，不刷新或切换出口。');
    process.exitCode = 2;
    return;
  }
  const result = { source, fetched_at: new Date().toISOString(), filters, truncated_windows: query.truncatedWindows, ids: query.ids, kills: [], failed: [] };
  console.log(`命中 ${query.ids.length} 张（查询 ${query.requests} 次）${query.truncatedWindows.length ? `；${query.truncatedWindows.length} 个时段仍满额，结果不全` : ''}`);
  if (!idsOnly) {
    const detailIds = query.ids.slice(0, maxDetails);
    if (detailIds.length < query.ids.length) console.log(`只补全最新 ${detailIds.length} 张；其余仅存 ID。命中过多先收紧筛选，或加 --details N`);
    for (const [index, id] of detailIds.entries()) {
      try { result.kills.push(await loadKill(id)); } catch (error) { result.failed.push({ id, error: error.message }); }
      if ((index + 1) % 50 === 0) console.log(`已补全 ${index + 1}/${detailIds.length}`);
      await sleep(250);
    }
    const ids = new Set();
    for (const km of result.kills) {
      ids.add(km.solar_system_id);
      for (const party of [km.victim, ...km.attackers]) for (const key of ['character_id', 'corporation_id', 'alliance_id', 'ship_type_id']) if (party[key]) ids.add(party[key]);
    }
    const names = await resolveNames(ids);
    const name = id => (id ? names.get(id) || String(id) : '');
    const matches = focusMatcher(filters);
    const rows = [['killID', 'time', 'system', 'value', 'labels', 'victim', 'victim_corp', 'victim_alliance', 'victim_ship', 'attackers', 'focus_side_ships', 'url']];
    let unmatched = 0;
    for (const km of result.kills) {
      const focus = [...(matches(km.victim, true) ? [['victim', km.victim]] : []), ...km.attackers.filter(party => matches(party, false)).map(party => ['attacker', party])];
      if (!focus.length) unmatched++;
      rows.push([km.killmail_id, km.killmail_time, name(km.solar_system_id), Math.round(km.zkb.totalValue || 0), (km.zkb.labels || []).join(','),
        name(km.victim.character_id), name(km.victim.corporation_id), name(km.victim.alliance_id), name(km.victim.ship_type_id), km.attackers.length,
        focus.map(([side, party]) => `${side}:${name(party.character_id)}/${name(party.ship_type_id)}${party.final_blow ? '(final)' : ''}`).join('; '),
        `https://zkillboard.com/kill/${km.killmail_id}/`]);
    }
    result.names = Object.fromEntries(names);
    fs.writeFileSync(`${prefix}.tsv`, rows.map(row => row.join('\t')).join('\n') + '\n');
    console.log(`补全 ${result.kills.length} 张，失败 ${result.failed.length} 张；保存 ${output}.tsv`);
    // 军团／联盟成员的小号、或筛选写在 Either 栏时，这里对不上属正常；角色 In 筛选仍对不上则说明筛选有误。
    if (unmatched) console.log(`注意：${unmatched} 张 KM 上没找到筛选点名的参与者，核对筛选写法`);
  }
  fs.writeFileSync(`${prefix}.json`, JSON.stringify(result, null, 2));
  console.log(`保存 ${output}.json`);
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await main(process.argv.slice(2));
