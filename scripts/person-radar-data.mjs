import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const MONITOR_TYPE_ID = 45534;
export const MONITOR_QUERY_VERSION = 2;
export const CAPITAL_GROUPS = {
  dreadnought: 485,
  carrier: 547,
  forceAuxiliary: 1538,
  supercarrier: 659,
  titan: 30,
};

const API_ROOT = 'https://zkillboard.com/api';
const USER_AGENT = 'EVE-Online-Tranquility-Chinese-Personas/1.0 (https://github.com/ddd4512kk-source/EVE-Online-Tranquility-Chinese-Personas)';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_CACHE = path.join(ROOT, '.cache', 'person-radar');
const PAGE_SIZE = 200;
const MAX_PAGES = 100;

const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
const writeJson = (file, value) => {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

function tierOf(person, axis) {
  const entry = person?.radar?.axes?.[axis];
  return entry?.tier ?? entry?.score ?? null;
}

function topConfirmedAlts(identity, limit = 2) {
  return [...(identity?.alts ?? [])]
    .filter(alt => Number.isSafeInteger(Number(alt.id)) && Number(alt.id) > 0)
    .sort((a, b) => (b.zkb?.kills ?? -1) - (a.zkb?.kills ?? -1)
      || (b.zkb?.isk_destroyed ?? -1) - (a.zkb?.isk_destroyed ?? -1)
      || Number(a.id) - Number(b.id))
    .slice(0, limit)
    .map(alt => ({
      id: Number(alt.id),
      name: alt.name ?? String(alt.id),
      priorKills: alt.zkb?.kills ?? null,
      priorIskDestroyed: alt.zkb?.isk_destroyed ?? null,
    }));
}

export function buildRadarRoster({ peopleDirectory, phase = 'all' }) {
  if (!['all', 'fc', 'mentioned'].includes(phase)) throw new Error(`不支持的名单阶段：${phase}`);
  const entries = [];
  for (const directory of readdirSync(peopleDirectory, { withFileTypes: true }).filter(item => item.isDirectory())) {
    const folder = path.join(peopleDirectory, directory.name);
    const idFile = readdirSync(folder).find(name => /^\d+-id\.json$/.test(name));
    if (!idFile) continue;
    const markdownFile = path.join(folder, `${directory.name}.md`);
    let body = '';
    try {
      body = readFileSync(markdownFile, 'utf8');
    } catch {
      continue;
    }
    const archive = readJson(path.join(folder, idFile));
    const person = archive.person ?? {};
    if (!person.radar || !Number.isSafeInteger(Number(archive.id))) continue;
    const tags = Array.isArray(person.tags) ? person.tags : [];
    const fcTagged = tags.some(tag => /(?:^|\b)FC(?:\b|$)|著名FC/i.test(tag));
    const prose = body.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '');
    const commandMentioned = /指挥/.test(prose);
    if ((phase === 'fc' && !fcTagged) || (phase === 'mentioned' && !commandMentioned)) continue;
    const alts = topConfirmedAlts(archive.identity);
    entries.push({
      slug: directory.name,
      name: person.cn_name ?? archive.name,
      characterId: Number(archive.id),
      tags,
      fcTagged,
      famousFCTag: tags.some(tag => /著名FC/i.test(tag)),
      commandMentioned,
      currentCombatTier: tierOf(person, 'combat'),
      currentCommandTier: tierOf(person, 'command'),
      confirmedAlts: alts,
      unselectedConfirmedAltCount: Math.max(0, (archive.identity?.alts?.length ?? 0) - alts.length),
      selectionBasis: '身份档案中已确认小号，按已有 zKB 击杀数、ISK 顺序取前两名；同分按 ID。',
      radarFile: path.relative(ROOT, path.join(folder, idFile)).replaceAll(path.sep, '/'),
    });
  }
  return entries.sort((a, b) => a.slug.localeCompare(b.slug, 'en'));
}

export function summarizeZkillStats(stats) {
  if (!stats || typeof stats !== 'object' || !stats.groups || !stats.months) {
    throw new Error('zKillboard stats 响应缺少 groups 或 months');
  }
  const months = Object.entries(stats.months)
    .filter(([, value]) => (value.shipsDestroyed ?? 0) > 0 || (value.shipsLost ?? 0) > 0)
    .map(([month]) => month)
    .sort();
  const capitalKills = Object.fromEntries(Object.entries(CAPITAL_GROUPS).map(([key, groupId]) => [
    key,
    stats.groups[String(groupId)]?.shipsDestroyed ?? 0,
  ]));
  return {
    kills: stats.shipsDestroyed ?? 0,
    losses: stats.shipsLost ?? 0,
    iskDestroyed: stats.iskDestroyed ?? 0,
    soloKills: stats.soloKills ?? 0,
    capitalKills,
    lastActiveMonth: months.at(-1) ?? null,
    firstActiveMonth: months[0] ?? null,
  };
}

export function summarizeRecentActivity(records) {
  return Array.isArray(records) && typeof records[0]?.killmail_time === 'string'
    ? records[0].killmail_time
    : null;
}

export function summarizeMonitorKillmails(records) {
  const byId = new Map();
  for (const record of records) {
    const killmailId = Number(record?.killmail_id ?? record?.killmailId);
    const time = record?.killmail_time ?? record?.time;
    if (!record || !Number.isSafeInteger(killmailId) || typeof time !== 'string') continue;
    const date = time.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    byId.set(killmailId, {
      killmailId,
      time,
      date,
      systemId: Number(record.solar_system_id ?? record.systemId),
      victimShipTypeId: Number(record.victim?.ship_type_id ?? record.victimShipTypeId),
    });
  }
  const killmails = [...byId.values()].sort((a, b) => a.time.localeCompare(b.time) || a.killmailId - b.killmailId);
  const days = [...new Set(killmails.map(item => item.date))].sort();
  return {
    killmails,
    monitorKillmailCount: killmails.length,
    monitorDays: days.length,
    firstMonitorAt: killmails[0]?.time ?? null,
    lastMonitorAt: killmails.at(-1)?.time ?? null,
  };
}

export function matchMonitorDaysToBattles(monitor, battles, systemIdByName = new Map()) {
  const byDateAndSystem = new Map();
  for (const battle of battles) {
    const start = battle.start;
    const systems = Array.isArray(battle.systems) ? battle.systems : [];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(start ?? '') || !systems.length) continue;
    const systemIds = systems.map(system => Number.isSafeInteger(Number(system))
      ? Number(system)
      : systemIdByName.get(system)).filter(Number.isSafeInteger);
    for (const systemId of systemIds) {
      const key = `${start}:${systemId}`;
      byDateAndSystem.set(key, [...(byDateAndSystem.get(key) ?? []), battle]);
    }
  }
  const found = new Map();
  for (const record of monitor.killmails ?? []) {
    const hits = byDateAndSystem.get(`${record.date}:${record.systemId}`) ?? [];
    for (const battle of hits) {
      found.set(battle.id, {
        id: battle.id,
        title: battle.title,
        date: battle.start,
        matchedMonitorKillmails: (found.get(battle.id)?.matchedMonitorKillmails ?? 0) + 1,
      });
    }
  }
  return [...found.values()].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}

export async function resolveBattleSystemIds(battles, { fetchImpl = fetch } = {}) {
  const names = [...new Set(battles.flatMap(battle => battle.systems ?? []).filter(name => typeof name === 'string'))];
  if (!names.length) return new Map();
  const response = await fetchImpl('https://esi.evetech.net/latest/universe/ids/?datasource=tranquility', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(names),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`ESI 星系 ID 查询返回 HTTP ${response.status}`);
  const data = await response.json();
  return new Map((data.systems ?? []).map(system => [system.name, system.id]));
}

export async function fetchZkillJson(url, { fetchImpl = fetch, timeoutMs = 30000 } = {}) {
  const response = await fetchImpl(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept-Encoding': 'gzip' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`zKillboard 返回 HTTP ${response.status}：${url}`);
  const body = await response.json();
  if (!Array.isArray(body) && body?.error) throw new Error(`zKillboard API 错误：${body.error}`);
  return body;
}

async function waitForRateLimit(lastRequestAt, minimumIntervalMs) {
  const remaining = minimumIntervalMs - (Date.now() - lastRequestAt);
  if (remaining > 0) await new Promise(resolve => setTimeout(resolve, remaining));
}

export async function collectMonitorKillmails(characterId, {
  fetchJson = fetchZkillJson,
  minimumIntervalMs = 1100,
  onRequest = async () => {},
} = {}) {
  const records = [];
  let lastRequestAt = 0;
  let capped = false;
  for (const side of ['kills', 'losses']) {
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      await waitForRateLimit(lastRequestAt, minimumIntervalMs);
      const url = `${API_ROOT}/${side}/characterID/${characterId}/shipTypeID/${MONITOR_TYPE_ID}/page/${page}/`;
      await onRequest(url);
      lastRequestAt = Date.now();
      const response = await fetchJson(url);
      if (!Array.isArray(response)) throw new Error(`zKillboard Monitor 查询返回非列表：${url}`);
      records.push(...response.filter(record => side === 'kills'
        ? record.attackers?.some(attacker => Number(attacker.character_id) === Number(characterId)
          && Number(attacker.ship_type_id) === MONITOR_TYPE_ID)
        : Number(record.victim?.character_id) === Number(characterId)
          && Number(record.victim?.ship_type_id) === MONITOR_TYPE_ID));
      if (response.length < PAGE_SIZE) break;
      if (page === MAX_PAGES) capped = true;
    }
  }
  return { ...summarizeMonitorKillmails(records), capped };
}

async function fetchWithRetry(fetchJson, url, retries = 3) {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      return await fetchJson(url);
    } catch (error) {
      lastError = error;
      if (attempt + 1 < retries) await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1)));
    }
  }
  throw lastError;
}

async function collectCharacter(characterId, cacheDir, { fetchJson, minimumIntervalMs, includeStats = true }) {
  const file = path.join(cacheDir, 'characters', `${characterId}.json`);
  const result = exists(file) ? readJson(file) : { version: 1, characterId, sources: {} };
  if (!result.monitor || result.monitorQueryVersion !== MONITOR_QUERY_VERSION) {
    result.monitor = await collectMonitorKillmails(characterId, {
      fetchJson: async url => {
        await waitForRateLimit(globalThis.__personRadarLastRequestAt ?? 0, minimumIntervalMs);
        const value = await fetchWithRetry(fetchJson, url);
        globalThis.__personRadarLastRequestAt = Date.now();
        return value;
      },
      minimumIntervalMs: 0,
    });
    result.monitorQueryVersion = MONITOR_QUERY_VERSION;
    result.sources.monitorKills = `${API_ROOT}/kills/characterID/${characterId}/shipTypeID/${MONITOR_TYPE_ID}/`;
    result.fetchedAt = new Date().toISOString();
    writeJson(file, result);
  }
  if (includeStats && !result.zkill) {
    const statsUrl = `${API_ROOT}/stats/characterID/${characterId}/kills/`;
    await waitForRateLimit(globalThis.__personRadarLastRequestAt ?? 0, minimumIntervalMs);
    const stats = await fetchWithRetry(fetchJson, statsUrl);
    globalThis.__personRadarLastRequestAt = Date.now();
    result.zkill = summarizeZkillStats(stats);
    result.sources.stats = statsUrl;
    result.fetchedAt = new Date().toISOString();
    writeJson(file, result);
  }
  if (includeStats && !Object.hasOwn(result.zkill ?? {}, 'lastActiveAt')) {
    const recentUrl = `${API_ROOT}/characterID/${characterId}/`;
    await waitForRateLimit(globalThis.__personRadarLastRequestAt ?? 0, minimumIntervalMs);
    const recent = await fetchWithRetry(fetchJson, recentUrl);
    globalThis.__personRadarLastRequestAt = Date.now();
    result.zkill = {
      ...(result.zkill ?? {}),
      lastActiveAt: summarizeRecentActivity(recent),
    };
    result.sources.recentActivity = recentUrl;
    result.fetchedAt = new Date().toISOString();
    writeJson(file, result);
  }
  writeJson(file, result);
  return result;
}

function exists(file) {
  try {
    readFileSync(file);
    return true;
  } catch {
    return false;
  }
}

function sumStats(characters) {
  const total = { kills: 0, losses: 0, iskDestroyed: 0, soloKills: 0, capitalKills: Object.fromEntries(Object.keys(CAPITAL_GROUPS).map(key => [key, 0])) };
  for (const character of characters) {
    for (const key of ['kills', 'losses', 'iskDestroyed', 'soloKills']) total[key] += character.zkill?.[key] ?? 0;
    for (const key of Object.keys(CAPITAL_GROUPS)) total.capitalKills[key] += character.zkill?.capitalKills?.[key] ?? 0;
  }
  return total;
}

export function buildFacts(roster, characterData, battleList = []) {
  return roster.map(person => {
    const ids = [person.characterId, ...person.confirmedAlts.map(alt => alt.id)];
    const characters = ids.map(id => characterData.get(id)).filter(Boolean);
    const monitor = summarizeMonitorKillmails(characters.flatMap(character => character.monitor?.killmails ?? []));
    return {
      ...person,
      characters: characters.map(character => ({
        id: character.characterId,
        zkill: character.zkill,
        monitor: character.monitor,
        monitorQueryVersion: character.monitorQueryVersion ?? null,
        sources: character.sources ?? {},
        fetchedAt: character.fetchedAt ?? null,
      })),
      characterIdsFetched: characters.map(character => character.characterId),
      perCharacterTotalsMayOverlap: true,
      zkillTotals: sumStats(characters),
      monitor: {
        ...monitor,
        capped: characters.some(character => character.monitor?.capped),
        battles: matchMonitorDaysToBattles(monitor, battleList),
      },
      dataState: characters.length === ids.length && characters.every(character => character.zkill
        && Object.hasOwn(character.zkill, 'lastActiveAt') && character.monitor
        && character.monitorQueryVersion === MONITOR_QUERY_VERSION)
        ? 'complete'
        : 'partial',
    };
  });
}
export function buildFactsComparisonTsv(phaseCaches, currentRatings = new Map()) {
  const merged = new Map();
  const latestFetch = fact => (fact.characters ?? [])
    .map(character => character.fetchedAt ?? '')
    .sort()
    .at(-1) ?? '';
  for (const cache of phaseCaches) {
    for (const fact of cache.facts ?? []) {
      const row = merged.get(fact.slug) ?? { phases: new Set(), fact };
      row.phases.add(cache.phase);
      if (latestFetch(fact) >= latestFetch(row.fact)) row.fact = fact;
      merged.set(fact.slug, row);
    }
  }
  const headers = [
    '姓名', '短名', '主号ID', '名单阶段', 'FC标签', '著名FC', '正文提及指挥', '数据状态', '数据最新抓取UTC',
    '当前战斗力', '当前统御力', '纳入角色', '其他已确认小号数', '有stats角色数', '缺失stats角色ID',
    '击杀合计或已取小计', '损失合计或已取小计', '击毁ISK合计或已取小计', 'Solo合计或已取小计',
    '无畏', '航母', '战斗后勤旗舰', '超旗', '泰坦',
    'zKB首月', 'zKB末月', 'Monitor UTC日期', 'Monitor首次UTC', 'Monitor最近UTC',
    '匹配战役篇数', '匹配Monitor KM条数', '匹配战役明细', 'Monitor查询封顶',
  ];
  const rows = [...merged.values()].map(({ phases, fact }) => {
    const characters = fact.characters ?? [];
    const withStats = characters.filter(character => character.zkill && Object.keys(character.zkill).length > 0);
    const expectedIds = [fact.characterId, ...(fact.confirmedAlts ?? []).map(alt => Number(alt.id))];
    const statsIds = new Set(withStats.map(character => character.id));
    const missingStats = expectedIds.filter(id => !statsIds.has(id));
    const values = fact.dataState === 'complete'
      ? (fact.zkillTotals ?? {})
      : withStats.reduce((sum, character) => {
        const stats = character.zkill;
        for (const key of ['kills', 'losses', 'iskDestroyed', 'soloKills']) {
          if (stats[key] !== undefined) sum[key] = (sum[key] ?? 0) + stats[key];
        }
        sum.capitalKills ??= {};
        for (const key of Object.keys(CAPITAL_GROUPS)) {
          if (stats.capitalKills?.[key] !== undefined) {
            sum.capitalKills[key] = (sum.capitalKills[key] ?? 0) + stats.capitalKills[key];
          }
        }
        return sum;
      }, {});
    const phasesLabel = [
      phases.has('fc') ? 'FC标签' : '',
      phases.has('mentioned') ? '正文提指挥' : '',
    ].filter(Boolean).join('、');
    const battleMatches = fact.monitor?.battles ?? [];
    const battleKillmailCount = battleMatches.reduce((sum, battle) => sum + (battle.matchedMonitorKillmails ?? 0), 0);
    const months = withStats.map(character => character.zkill.firstActiveMonth).filter(Boolean).sort();
    const endMonths = withStats.map(character => character.zkill.lastActiveMonth).filter(Boolean).sort();
    const includedNames = [
      fact.name,
      ...(fact.confirmedAlts ?? []).map(alt => `${alt.name}（${alt.id}）`),
    ].join('、');
    const cells = [
      fact.name,
      fact.slug,
      fact.characterId,
      phasesLabel,
      fact.fcTagged ? '是' : '否',
      fact.famousFCTag ? '是' : '否',
      fact.commandMentioned ? '是' : '否',
      fact.dataState,
      latestFetch(fact),
      currentRatings.get(fact.slug)?.currentCombatTier ?? fact.currentCombatTier ?? '',
      currentRatings.get(fact.slug)?.currentCommandTier ?? fact.currentCommandTier ?? '',
      includedNames,
      fact.unselectedConfirmedAltCount ?? 0,
      `${withStats.length}/${expectedIds.length}`,
      missingStats.join('、'),
      values.kills,
      values.losses,
      values.iskDestroyed,
      values.soloKills,
      ...Object.keys(CAPITAL_GROUPS).map(key => values.capitalKills?.[key]),
      months[0] ?? '',
      endMonths.at(-1) ?? '',
      fact.monitor?.monitorDays,
      fact.monitor?.firstMonitorAt ?? '',
      fact.monitor?.lastMonitorAt ?? '',
      battleMatches.length,
      battleKillmailCount,
      battleMatches.map(battle => `${battle.id}@${battle.date}#${battle.matchedMonitorKillmails}`).join('；'),
      fact.monitor?.capped ? '是' : '否',
    ];
    return cells.map(value => String(value ?? '').replace(/[\t\r\n]+/g, ' ')).join('\t');
  }).sort((a, b) => a.localeCompare(b, 'zh'));
  return [headers.join('\t'), ...rows].join('\n') + '\n';
}


function loadBattleList(battlesDirectory) {
  const battles = [];
  for (const directory of readdirSync(battlesDirectory, { withFileTypes: true }).filter(item => item.isDirectory())) {
    for (const file of readdirSync(path.join(battlesDirectory, directory.name)).filter(name => name.endsWith('.json') && !name.startsWith('materials-'))) {
      const data = readJson(path.join(battlesDirectory, directory.name, file)).battle;
      if (!data) continue;
      battles.push({ id: directory.name, title: data.title ?? directory.name, start: data.start, systems: data.systems ?? [] });
      break;
    }
  }
  return battles;
}

function readCharacterCache(cacheDir) {
  const directory = path.join(cacheDir, 'characters');
  let files = [];
  try {
    files = readdirSync(directory).filter(name => /^\d+\.json$/.test(name));
  } catch {
    return new Map();
  }
  return new Map(files.map(file => {
    const value = readJson(path.join(directory, file));
    return [Number(value.characterId), value];
  }));
}

async function runCli(args) {
  const command = args[0] ?? 'help';
  const peopleDirectory = path.join(ROOT, 'src', 'people');
  const cacheDir = DEFAULT_CACHE;
  const phase = args.find(arg => arg.startsWith('--phase='))?.slice('--phase='.length) ?? 'fc';
  if (command === 'help' || command === '--help') {
    console.log('用法：node scripts/person-radar-data.mjs roster [--phase=fc|mentioned|all] | collect [--phase=fc|mentioned|all] | report [--phase=fc|mentioned] | compare');
    return;
  }
  if (command === 'roster') {
    const roster = buildRadarRoster({ peopleDirectory, phase });
    writeJson(path.join(cacheDir, `roster-${phase}.json`), { version: 1, generatedAt: new Date().toISOString(), phase, count: roster.length, entries: roster });
    console.log(`本地名单已写入 ${path.join(cacheDir, `roster-${phase}.json`)}（${roster.length} 人）`);
    return;
  }
  if (command === 'collect') {
    const rosterFile = path.join(cacheDir, `roster-${phase}.json`);
    const roster = readJson(rosterFile).entries;
    const errorFile = path.join(cacheDir, 'errors.json');
    const errors = exists(errorFile) ? readJson(errorFile) : [];
    let done = 0;
    for (const person of roster) {
      const ids = [person.characterId, ...person.confirmedAlts.map(alt => alt.id)];
      if (phase === 'mentioned') {
        const monitorRows = [];
        for (const id of ids) {
          try {
            monitorRows.push(await collectCharacter(id, cacheDir, { fetchJson: fetchZkillJson, minimumIntervalMs: 1100, includeStats: false }));
          } catch (error) {
            errors.push({ phase, personId: person.characterId, characterId: id, part: 'monitor', at: new Date().toISOString(), error: error.message });
            writeJson(errorFile, errors);
          }
        }
        if (!monitorRows.some(row => row.monitor.monitorDays > 0)) {
          done += ids.length;
          process.stderr.write(`\r已核 Monitor ${done} 个角色；无记录，略过：${person.name}（${person.characterId}）`);
          continue;
        }
      }
      for (const id of ids) {
        try {
          await collectCharacter(id, cacheDir, { fetchJson: fetchZkillJson, minimumIntervalMs: 1100, includeStats: true });
        } catch (error) {
          errors.push({ phase, personId: person.characterId, characterId: id, part: 'stats-or-monitor', at: new Date().toISOString(), error: error.message });
          writeJson(errorFile, errors);
        }
        done += 1;
      }
      process.stderr.write(`\r已完成 ${done} 个角色快照；当前：${person.name}（${person.characterId}）`);
    }
    process.stderr.write('\n');
    return;
  }
  if (command === 'report') {
    const rosterFile = path.join(cacheDir, `roster-${phase}.json`);
    const roster = readJson(rosterFile).entries;
    const battleList = loadBattleList(path.join(ROOT, 'src', 'battles'));
    let systemIdByName = new Map();
    try {
      const systemCache = path.join(cacheDir, 'battle-system-ids.json');
      if (exists(systemCache)) systemIdByName = new Map(Object.entries(readJson(systemCache)));
      else {
        systemIdByName = await resolveBattleSystemIds(battleList);
        writeJson(systemCache, Object.fromEntries(systemIdByName));
      }
    } catch (error) {
      process.stderr.write(`星系 ID 对照未能更新，Monitor 记录暂不关联战役：${error.message}\n`);
    }
    let facts = buildFacts(roster, readCharacterCache(cacheDir), battleList.map(battle => ({
      ...battle,
      systems: battle.systems.map(system => systemIdByName.get(system)).filter(Number.isSafeInteger),
    })));
    if (phase === 'mentioned') facts = facts.filter(person => person.monitor.monitorDays > 0);
    writeJson(path.join(cacheDir, `facts-${phase}.json`), { version: 1, generatedAt: new Date().toISOString(), phase, count: facts.length, facts });
    console.log(`本地事实表已写入 ${path.join(cacheDir, `facts-${phase}.json`)}（${facts.length} 人）`);
    return;
  }
  if (command === 'compare') {
    const phaseCaches = ['fc', 'mentioned'].map(currentPhase => readJson(path.join(cacheDir, `facts-${currentPhase}.json`)));
    const currentRoster = buildRadarRoster({ peopleDirectory, phase: 'all' });
    const currentRatings = new Map(currentRoster.map(person => [person.slug, {
      currentCombatTier: person.currentCombatTier,
      currentCommandTier: person.currentCommandTier,
    }]));
    const outputFile = path.join(cacheDir, 'facts-comparison.tsv');
    writeFileSync(outputFile, buildFactsComparisonTsv(phaseCaches, currentRatings), 'utf8');
    console.log(`横向事实表已写入 ${outputFile}`);
    return;
  }
  throw new Error(`不支持的命令：${command}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli(process.argv.slice(2)).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
