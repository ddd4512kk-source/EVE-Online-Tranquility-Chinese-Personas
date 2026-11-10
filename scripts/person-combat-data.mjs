// 全仓战绩事实与按需比较表；不改人物档案、评分或列传。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readIdentityDirectory } from './person-identity.mjs';
import { readPersonDocument } from './person-document.mjs';
import { personCombat } from './activity.mjs';
import { CAPITAL_GROUPS } from './person-radar-data.mjs';
import { createRequestGuard } from './research/request-guard.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const API = 'https://zkillboard.com/api/stats/characterID/';
const DATA = 'docs/combat-statistics/characters.json';
const OUTPUT = '.cache/person-combat';
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = file + '.tmp';
  fs.writeFileSync(temporary, JSON.stringify(data, null, 2) + '\n', 'utf8');
  fs.renameSync(temporary, file);
};
const number = value => Number.isFinite(value) && value >= 0;
const month = value => typeof value === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
const monthOf = value => /^\d{6}$/.test(value ?? '') ? value.slice(0, 4) + '-' + value.slice(4) : month(value) ? value : null;

export function combatRoster(root) {
  return [...readIdentityDirectory(path.join(root, 'src/people')).values()].map(identity => {
    const file = path.join(root, 'src/people', identity.slug, identity.slug + '.md');
    const { archive } = readPersonDocument(file);
    return {
      slug: identity.slug,
      name: archive.person.cn_name ?? identity.name,
      characterId: identity.character_id,
      birthday: archive.birthday ?? null,
      tier: archive.person.radar?.axes?.combat?.tier ?? null,
      characters: [{ id: identity.character_id, name: identity.name, role: 'main', prior: identity.zkb ?? null },
        ...identity.alts.map(alt => ({ id: alt.id, name: alt.name, role: 'alt', basis: alt.basis ?? null, prior: alt.zkb ?? null }))],
    };
  }).sort((a, b) => a.slug.localeCompare(b.slug, 'en'));
}

export function normalizeCombatStats(raw, id) {
  if (!raw || raw.error || raw.type !== 'characterID' || Number(raw.id) !== id
    || !raw.months || typeof raw.months !== 'object' || Array.isArray(raw.months)) {
    const error = new Error(`角色 ${id} 的 stats 响应无效或身份不符：${JSON.stringify({ type: raw?.type, id: raw?.id, error: raw?.error })}`);
    error.code = 'INVALID_STATS';
    throw error;
  }
  const fields = { kills: 'shipsDestroyed', losses: 'shipsLost', iskDestroyed: 'iskDestroyed', iskLost: 'iskLost', soloKills: 'soloKills' };
  const stats = {};
  for (const [key, field] of Object.entries(fields)) {
    // 完整 stats 文档的无战果字段可省略；未知响应不得走此处变成零。
    const value = raw[field] ?? 0;
    if (!number(value)) throw new Error(`角色 ${id} 的 ${field} 不是非负数`);
    stats[key] = value;
  }
  if (stats.soloKills > stats.kills) throw new Error(`角色 ${id} 的 solo 数大于参与击杀数`);
  const months = Object.entries(raw.months).filter(([key, value]) => monthOf(key)
    && ((value.shipsDestroyed ?? 0) > 0 || (value.shipsLost ?? 0) > 0)).sort(([a], [b]) => a.localeCompare(b));
  stats.firstActiveMonth = monthOf(months[0]?.[0]);
  stats.lastActiveMonth = monthOf(months.at(-1)?.[0]);
  stats.activeMonths = months.length;
  stats.capitalKills = Object.fromEntries(Object.entries(CAPITAL_GROUPS).map(([key, group]) => [key, raw.groups?.[group]?.shipsDestroyed ?? 0]));
  return stats;
}

function partialStats(prior) {
  if (!prior) return null;
  return {
    kills: number(prior.kills) ? prior.kills : null,
    losses: number(prior.lost) ? prior.lost : null,
    iskDestroyed: number(prior.isk_destroyed) ? prior.isk_destroyed : null,
    soloKills: null,
    iskLost: null,
    firstActiveMonth: null,
    lastActiveMonth: month(prior.last_active) ? prior.last_active : null,
    activeMonths: null,
    capitalKills: null,
  };
}

export const coreComplete = record => ['kills', 'losses', 'iskDestroyed', 'soloKills'].every(key => number(record?.stats?.[key]));

export function summarizePerson(person, records) {
  const characters = person.characters.map(character => ({ ...character, record: records[character.id] ?? null }));
  const complete = characters.every(character => coreComplete(character.record));
  const sum = key => {
    const values = characters.map(character => character.record?.stats?.[key]);
    return values.every(number) ? values.reduce((a, b) => a + b, 0) : null;
  };
  const totals = Object.fromEntries(['kills', 'losses', 'iskDestroyed', 'soloKills', 'iskLost'].map(key => [key, sum(key)]));
  const snapshots = characters.map(character => {
    const record = character.record;
    return record?.stats ? {
      isk_destroyed: record.stats.iskDestroyed,
      last_active: record.stats.lastActiveMonth ?? '',
      as_of: record.observedAt?.slice(0, 10) ?? '',
    } : null;
  });
  const mainSnapshot = snapshots[0];
  const annualInputComplete = snapshots.every(snapshot => snapshot && number(snapshot.isk_destroyed)
    && (month(snapshot.last_active) || /^\d{4}-\d{2}-\d{2}$/.test(snapshot.as_of)));
  const hasBirthday = /^\d{4}-\d{2}-\d{2}T/.test(person.birthday ?? '');
  const identity = { zkb: mainSnapshot, alts: snapshots.slice(1).map(zkb => ({ zkb })) };
  const annual = annualInputComplete && hasBirthday ? personCombat(identity, person.birthday) : null;
  const annualEnd = snapshots.map(snapshot => snapshot?.last_active || snapshot?.as_of?.slice(0, 7)).filter(Boolean).sort().at(-1) ?? null;
  const birth = person.birthday?.slice(0, 7) ?? null;
  const mainYears = birth && annualEnd ? Math.max(2, ((Number(annualEnd.slice(0, 4)) - Number(birth.slice(0, 4))) * 12
    + Number(annualEnd.slice(5)) - Number(birth.slice(5))) / 12) : null;
  return {
    slug: person.slug, name: person.name, characterId: person.characterId, tier: person.tier,
    characterCount: characters.length, completeCharacterCount: characters.filter(character => coreComplete(character.record)).length,
    state: complete ? 'complete' : 'partial', ...totals,
    soloRatio: totals.kills === null || totals.soloKills === null ? null : totals.kills > 0 ? totals.soloKills / totals.kills : 0,
    yearlyIskDestroyed: annual?.yearlyIsk ?? null,
    annualStartMonth: birth, annualEndMonth: annualEnd, annualYears: annual ? mainYears : null,
    observedFrom: characters.map(character => character.record?.observedAt).filter(Boolean).sort()[0] ?? null,
    observedTo: characters.map(character => character.record?.observedAt).filter(Boolean).sort().at(-1) ?? null,
    missingCharacterIds: characters.filter(character => !coreComplete(character.record)).map(character => character.id),
    overlapPossible: characters.length > 1,
  };
}

export function distribution(values) {
  const sorted = values.filter(number).sort((a, b) => a - b);
  const percentile = p => {
    if (!sorted.length) return null;
    const index = (sorted.length - 1) * p;
    const lower = Math.floor(index);
    return sorted[lower] + (sorted[Math.ceil(index)] - sorted[lower]) * (index - lower);
  };
  return { count: sorted.length, min: sorted[0] ?? null, p25: percentile(0.25), median: percentile(0.5), p75: percentile(0.75), p90: percentile(0.9), p95: percentile(0.95), max: sorted.at(-1) ?? null };
}

const tsv = (headers, rows) => [headers, ...rows].map(row => row.map(value => String(value ?? '').replace(/[\t\r\n]/g, ' ')).join('\t')).join('\n') + '\n';

export function reportCombat(root, roster, database) {
  const output = path.join(root, OUTPUT);
  fs.mkdirSync(output, { recursive: true });
  const people = roster.map(person => summarizePerson(person, database.characters));
  const complete = people.filter(person => person.state === 'complete');
  const metrics = ['kills', 'iskDestroyed', 'soloKills', 'yearlyIskDestroyed'];
  const summary = {
    generatedAt: new Date().toISOString(), people: people.length, completePeople: complete.length,
    characters: roster.reduce((sum, person) => sum + person.characters.length, 0),
    completeCharacters: people.reduce((sum, person) => sum + person.completeCharacterCount, 0),
    distributions: Object.fromEntries(metrics.map(key => [key, distribution(complete.map(person => person[key]))])),
    byCombatTier: Object.fromEntries(['EX', 'S', 'A', 'B', 'C', 'D', 'E', null].map(tier => [tier ?? 'unrated', {
      people: complete.filter(person => person.tier === tier).length,
      ...Object.fromEntries(metrics.map(key => [key, distribution(complete.filter(person => person.tier === tier).map(person => person[key]))])),
    }])),
  };
  writeJson(path.join(output, 'summary.json'), summary);
  writeJson(path.join(output, 'people.json'), people);
  const personKeys = ['name', 'slug', 'characterId', 'tier', 'state', 'characterCount', 'completeCharacterCount', 'kills', 'losses', 'iskDestroyed', 'soloKills', 'soloRatio', 'yearlyIskDestroyed', 'annualStartMonth', 'annualEndMonth', 'annualYears', 'observedFrom', 'observedTo', 'overlapPossible', 'missingCharacterIds'];
  fs.writeFileSync(path.join(output, 'people.tsv'), tsv(['姓名', '短名', '主号ID', '现战斗档', '数据状态', '确认角色数', '完整角色数', '参与击杀合计', '损失合计', '参与击杀ISK合计', 'Solo合计', 'Solo占比', '年均参与击杀ISK', '年均起月', '年均止月', '年均年数_至少2', '最早取数UTC', '最晚取数UTC', '多号可能重复', '缺Solo等字段的角色ID'], people.map(person => personKeys.map(key => Array.isArray(person[key]) ? person[key].join(',') : person[key]))));
  const characters = roster.flatMap(person => person.characters.map(character => {
    const record = database.characters[character.id];
    const stats = record?.stats;
    return [person.name, person.slug, character.role, character.name, character.id, coreComplete(record) ? 'complete' : 'partial',
      stats?.kills, stats?.losses, stats?.iskDestroyed, stats?.soloKills, stats?.iskLost, stats?.firstActiveMonth, stats?.lastActiveMonth,
      record?.observedAt, record?.sourceKind, record?.sourceFile, record?.sourceUrl, record?.lastError?.message];
  }));
  fs.writeFileSync(path.join(output, 'characters.tsv'), tsv(['姓名', '短名', '主小号', '角色名', '角色ID', '数据状态', '参与击杀', '损失', '参与击杀ISK', 'Solo', '损失ISK', '首次活跃月', '最后活跃月', '取数UTC_未知留空', '来源类型', '本地来源', '公开来源', '取数错误'], characters));
  return summary;
}

export function seedCombatDatabase(root, roster, database, inventory = []) {
  const rawById = new Map(inventory);
  for (const person of roster) {
    for (const character of person.characters) {
      const old = database.characters[character.id];
      if (coreComplete(old)) continue;
      let candidate = null;
      const radarFile = path.join(root, '.cache/person-radar/characters', character.id + '.json');
      if (fs.existsSync(radarFile)) {
        const radar = readJson(radarFile);
        if (Number(radar.characterId) === character.id && radar.zkill) {
          candidate = {
            id: character.id, sourceKind: 'radar-cache', sourceFile: path.relative(root, radarFile).replaceAll(path.sep, '/'),
            sourceUrl: radar.sources?.stats ?? `${API}${character.id}/`, observedAt: radar.fetchedAt ?? null,
            stats: { ...radar.zkill, firstActiveMonth: monthOf(radar.zkill.firstActiveMonth), lastActiveMonth: monthOf(radar.zkill.lastActiveMonth), iskLost: null },
          };
        }
      }
      const rawEntry = rawById.get(character.id);
      if (!coreComplete(candidate) && rawEntry && fs.existsSync(path.join(root, rawEntry.path))) {
        const raw = readJson(path.join(root, rawEntry.path));
        candidate = {
          id: character.id, sourceKind: 'raw-cache', sourceFile: rawEntry.path, sourceUrl: `${API}${character.id}/`,
          observedAt: null, fileModifiedAt: rawEntry.fileModifiedAt,
          stats: normalizeCombatStats(raw, character.id),
        };
      }
      database.characters[character.id] = candidate ?? old ?? {
        id: character.id, sourceKind: 'identity-summary', sourceFile: `src/people/${person.slug}/${person.characterId}-id.json`,
        sourceUrl: `${API}${character.id}/`, observedAt: character.prior?.as_of ?? null, stats: partialStats(character.prior),
      };
    }
  }
}

export async function collectCombat(root, roster, database, { request, save, now = () => new Date().toISOString(), onProgress = () => {} }) {
  let requested = 0;
  const ids = [...new Set(roster.flatMap(person => person.characters.map(character => character.id)))];
  for (const id of ids) {
    if (coreComplete(database.characters[id]) || database.characters[id]?.unavailable) continue;
    const url = `${API}${id}/`;
    try {
      requested++;
      const response = await request(url, { headers: { 'User-Agent': 'EVE-Online-Tranquility-Chinese-Personas/1.0 research', 'Accept-Encoding': 'gzip' }, signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}：${url}`);
      const raw = await response.json();
      const stats = normalizeCombatStats(raw, id);
      database.characters[id] = { id, sourceKind: 'api', sourceUrl: url, observedAt: now(), stats };
      await save(database);
      if (requested % 20 === 0) onProgress({ requested, completed: ids.filter(key => coreComplete(database.characters[key])).length, total: ids.length });
    } catch (error) {
      const unavailable = error.code === 'INVALID_STATS';
      database.characters[id] = { ...database.characters[id], id, unavailable, lastError: { at: now(), url, message: error.message } };
      await save(database);
      // 无此角色统计只标记本号未知，继续既定名单；平台拦截、超时与预算立即停站。
      if (unavailable) continue;
      return { requested, stopped: true, failedCharacterId: id, error: error.message };
    }
  }
  return { requested, stopped: false };
}

async function main(args) {
  const command = args[0];
  if (!['seed', 'collect', 'report'].includes(command) || args.length > 1) {
    throw new Error('用法：node scripts/person-combat-data.mjs seed|collect|report');
  }
  const file = path.join(ROOT, DATA);
  const roster = combatRoster(ROOT);
  const database = fs.existsSync(file) ? readJson(file) : { version: 1, characters: {} };
  if (command === 'seed') {
    const inventoryFile = path.join(ROOT, '.cache/combat-inventory.json');
    seedCombatDatabase(ROOT, roster, database, fs.existsSync(inventoryFile) ? readJson(inventoryFile) : []);
    writeJson(file, database);
  }
  if (command === 'collect') {
    const lock = path.join(ROOT, OUTPUT, 'collect.lock');
    fs.mkdirSync(path.dirname(lock), { recursive: true });
    const descriptor = fs.openSync(lock, 'wx');
    try {
      writeJson(path.join(ROOT, OUTPUT, 'roster.json'), { frozenAt: new Date().toISOString(), people: roster });
      const request = createRequestGuard({ limit: roster.reduce((sum, person) => sum + person.characters.length, 0) });
      const result = await collectCombat(ROOT, roster, database, {
        request, save: value => writeJson(file, value), onProgress: value => console.log(JSON.stringify(value)),
      });
      writeJson(path.join(ROOT, OUTPUT, 'collection.json'), { at: new Date().toISOString(), ...result });
      console.log(JSON.stringify(result));
      if (result.stopped) process.exitCode = 1;
    } finally {
      fs.closeSync(descriptor);
      fs.unlinkSync(lock);
    }
  }
  const summary = reportCombat(ROOT, roster, database);
  console.log(JSON.stringify({ people: summary.people, completePeople: summary.completePeople, characters: summary.characters, completeCharacters: summary.completeCharacters, output: OUTPUT }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
}
