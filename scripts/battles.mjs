// 战役板块：规模分档与战役文件校验。构建（eleventy.config.js）与 check-battles.mjs 共用。
import fs from 'node:fs/promises';
import path from 'node:path';
import { bodyLineOffset, validateBlocks } from './blocks.mjs';
import systemNames from '../src/_data/systemNames.js';
import {
  battleOrgs,
  brApiUrl,
  entityKey,
  parseWindow,
  snapshotStale,
} from './battle-report.mjs';
import { NAMES_FILE, readNames, writeNames } from './character-snapshot.mjs';
import { characterOwners, readIdentityDirectory } from './person-identity.mjs';
import { readBattleArchive, readBattleDocument, writeBattleSnapshot } from './battle-archive.mjs';

// 来源全是 br.evetools／killmail.app 战报 → 数字由战报快照算；混有官方报道、论坛自报等别的来源 → 手填
export const usesSnapshot = data => {
  const sources = [data.loss_source].flat();
  return sources.length > 0 && sources.every(u => brApiUrl(u));
};

// 同名战役 JSON 中的原始快照；手填战役为 null。
export const readSnapshot = dir => readBattleArchive(dir).br;

// 已收录人物：角色 ID（收录号与 <ID>-id.json 的 identity.alts 里的小号）→ 收录号
export function peopleIndex(peopleDir) {
  return characterOwners(readIdentityDirectory(peopleDir));
}

// 联盟、军团 ID 全站唯一，在全站名称表（character-snapshot.mjs 的 NAMES_FILE）里看是哪一类；不在表里返回 null
export const kindOf = (table, id) => (table.alliances[id] ? 'alliances' : table.corporations[id] ? 'corporations' : null);

// 页面用的组织：{ id, kind: alliance|corporation（EveWho 网址用）, name, ticker? }
const orgOf = (table, id, historicalAlliance = false) => {
  const kind = historicalAlliance ? 'alliances' : kindOf(table, id);
  return { id, kind: kind === 'alliances' ? 'alliance' : 'corporation', name: table[kind]?.[id]?.name ?? (historicalAlliance ? `联盟 #${id}` : String(id)), ...(table[kind]?.[id]?.ticker && { ticker: table[kind][id].ticker }) };
};

// 页面用的数字：有快照从快照算，否则照 battle 配置 手填；联盟、军团 ID 换成带名字的组织
// table：全站名称表
export function statsOf(data, snap, table, people) {
  let st;
  if (usesSnapshot(data)) st = battleStats(data, snap, people, table);
  else {
    const sides = data.sides ?? [];
    st = {
      total_loss: data.total_loss,
      // 来源给了总数就用总数，否则各方人数齐全时相加
      pilots: data.pilots ?? (sides.length && sides.every(s => s.pilots) ? sides.reduce((n, s) => n + s.pilots, 0) : null),
      sides,
    };
  }
  return {
    ...st,
    sides: st.sides.map(s => ({
      ...s,
      // 点名负责归方和主标；参战名单来自本场历史记录，两者不能共用手写列表。
      emblemOrganization: s.emblem ? orgOf(table, s.emblem) : null,
      hasIndependentCorporations: participationRoster(s, table).some(id => kindOf(table, id) === 'corporations'),
      alliances: participationRoster(s, table).map(id => orgOf(table, id, s.alliance_participation?.some(a => a.id === id) || s.corps?.some(c => c.alliance_id === id))),
      ...(s.corps && { corps: s.corps.map(c => ({ ...orgOf(table, c.id), pilots: c.pilots })) }),
    })),
  };
}

// 展示与补名共用同一门槛；底层完整统计不受影响。
export const listedAllianceParticipation = (side, table) => (side.alliance_participation ?? []).filter(
  a => a.pilots >= 10 || a.corps.some(id => table.corporations[id]?.chinese === true),
);

function participationRoster(side, table) {
  if (!side.alliance_participation) {
    // 手填战役只接受有来源的历史归属，不查询军团当前所属联盟。
    return [...new Set([...assignedOrgs(side), ...(side.corps ?? []).map(c => c.alliance_id).filter(id => id > 0)])];
  }
  const ids = listedAllianceParticipation(side, table).map(a => a.id);
  // 归方里的 NPC 军团和零散独立军团不当作主要组织展示。
  for (const c of side.independent_participation ?? []) {
    if (!assignedOrgs(side).includes(c.id)) continue;
    if (c.id >= 1000000 && c.id < 2000000) continue;
    if (c.pilots >= 10 || table.corporations[c.id]?.chinese === true) ids.push(c.id);
  }
  return [...new Set(ids)];
}

// 按各方总损失分档（单位 B = 十亿 ISK），与列传里的战役分档同一标准；从高到低排列
export const TIERS = [
  { key: 'epic', name: '史诗', min: 1000 },
  { key: 'large', name: '大型', min: 400 },
  { key: 'medium', name: '中型', min: 100 },
];
export const tierOf = b => TIERS.find(t => b >= t.min) ?? null;

// 6640 → 6.64T，969.12 → 969.12B
export const formatIsk = b => (b >= 1000 ? `${+(b / 1000).toFixed(2)}T` : `${Math.round(b)}B`);

// 目录与详情共用，缺项仍保留标签；0 损失是有效数字。
export function sideStats(s) {
  return [
    s.pilots == null ? '参战人数待补' : `参战 ${s.pilots} 人`,
    s.loss == null ? '损失金额待补' : `损失 ${formatIsk(s.loss)}`,
    s.loss_count == null ? '损失计数待补' : `损失记录 ${s.loss_count} 条`,
    s.note,
  ].filter(Boolean).join(' · ');
}

// 有战报快照的战役：按阵营算人数、损失、条数、华人军团人数与已收录人物。
// 归方顺序：battle.sides 各方 organizations 点名的联盟（或无联盟的军团）→ 战报作者分的队伍 → 交火推断（没分队或分队与点名冲突时）→ “第三方”。
// 华人军团：名称表里标了 chinese 的军团。
// people：角色 ID（收录号与小号）→ 收录号，见 peopleIndex；table：全站名称表
export const CATCH_ALL = '第三方';

// 只过滤展示，保留全场统计和人物参战反链。未知人数仍显示。
export const visibleSides = sides => sides.filter(s => s.name !== CATCH_ALL || s.pilots == null || s.pilots >= 30);
const assignedOrgs = side => [...new Set(side.organizations ?? [])];
export function battleStats(data, snap, people, table) {
  const keyOf = id => ({ alliances: `a:${id}`, corporations: `c:${id}` })[kindOf(table, id)];
  const sides = data.sides ?? [];
  const sideOf = new Map();
  sides.forEach((s, i) => assignedOrgs(s).forEach(id => keyOf(id) && sideOf.set(keyOf(id), i)));
  let catchAll = sides.findIndex(s => s.name === CATCH_ALL);
  // 战报作者分了队就照分队：队里点名的联盟都在同一方，没点名的队友跟着归这一方；
  // 点名在“第三方”的联盟只把自己摘出来，不影响整队。
  // 队里一个都没点名的，没点名的队友算第三方；队里点名联盟分属几方（分队与点名冲突，或多份战报分队不一致）的，
  // 无法唯一映射时，未点名组织暂按交火推断；没分队也走此后备计算。是否真实同边须另据资料复核
  // 先汇总所有战报的归属候选，再落方；同一组织被不同阵营认领时不能先到先得。
  const claims = new Map();
  let conflict = false;
  for (const team of snap.teams ?? []) {
    const keys = team.map(t => (t.startsWith('corp:') ? `c:${t.slice(5)}` : `a:${t}`));
    const listed = new Set(keys.filter(k => sideOf.has(k) && sideOf.get(k) !== catchAll).map(k => sideOf.get(k)));
    if (listed.size === 1) {
      const best = [...listed][0];
      for (const k of keys) {
        if (sideOf.has(k)) continue; // 明确点名的归属优先，包含手动列出的第三方
        if (!claims.has(k)) claims.set(k, new Set());
        claims.get(k).add(best);
      }
    }
    else if (listed.size > 1) conflict = true;
  }
  for (const [k, candidates] of claims) {
    if (candidates.size === 1) sideOf.set(k, [...candidates][0]);
    else conflict = true; // 留空让交火推断处理；证据不足时归第三方
  }
  if (!snap.teams?.length || conflict) inferSides(snap, sides, sideOf);
  // 剩下归不了方的并成“第三方”；battle 配置 没写这一方就自动补上
  // NPC 军团角色先按本人看，再看战报分队里整个 NPC 军团归哪
  // 军团点名须与历史联盟同方；checkSnapshot 拦截冲突，不能将计算结果解释成独立站队。
  const explicitCorps = new Map(sides.flatMap((s, i) => assignedOrgs(s).filter(id => kindOf(table, id) === 'corporations').map(id => [id, i])));
  const sideIdx = (corp, ally, char) => explicitCorps.get(corp) ?? sideOf.get(entityKey(corp, ally, char)) ?? sideOf.get(entityKey(corp, ally));
  const unsorted = [
    ...Object.entries(snap.pilots).map(([char, [corp, ally]]) => sideIdx(corp, ally, Number(char))),
    ...snap.losses.map(([, char, corp, ally]) => sideIdx(corp, ally, char)),
  ].some(i => i == null);
  const allSides = catchAll < 0 && unsorted ? [...sides, { name: CATCH_ALL }] : sides;
  if (catchAll < 0) catchAll = allSides.length - 1;
  const side = (corp, ally, char) => sideIdx(corp, ally, char) ?? catchAll;

  const out = allSides.map(() => ({ pilots: 0, loss: 0, loss_count: 0, corps: new Map(), people: new Set(), alliances: new Map(), affiliations: new Map(), independents: new Map() }));
  const affiliation = (o, corp, ally) => {
    if (corp > 0) {
      if (!o.affiliations.has(corp)) o.affiliations.set(corp, new Set());
      o.affiliations.get(corp).add(ally || 0);
    }
    if (!(ally > 0)) {
      if (!(corp > 0)) return null;
      if (!o.independents.has(corp)) o.independents.set(corp, { id: corp, pilots: 0, loss: 0, loss_count: 0 });
      return o.independents.get(corp);
    }
    if (!o.alliances.has(ally)) o.alliances.set(ally, { id: ally, pilots: 0, loss: 0, loss_count: 0, corps: new Set() });
    const a = o.alliances.get(ally);
    if (corp > 0) a.corps.add(corp);
    return a;
  };
  for (const [char, [corp, ally]] of Object.entries(snap.pilots)) {
    const o = out[side(corp, ally, Number(char))];
    o.pilots++;
    const a = affiliation(o, corp, ally);
    if (a) a.pilots++;
    if (table.corporations[corp]?.chinese) o.corps.set(corp, (o.corps.get(corp) ?? 0) + 1);
    // 主号、小号出场都认到本人
    if (people.has(Number(char))) o.people.add(people.get(Number(char)));
  }
  let total = 0;
  for (const [, char, corp, ally, isk] of snap.losses) {
    total += isk;
    const o = out[side(corp, ally, char)];
    o.loss += isk;
    o.loss_count++;
    const a = affiliation(o, corp, ally);
    if (a) { a.loss += isk; a.loss_count++; }
  }
  return {
    total_loss: total / 1e9,
    pilots: Object.keys(snap.pilots).length,
    sides: allSides.map((s, i) => ({
      ...s,
      pilots: out[i].pilots,
      loss: out[i].loss / 1e9,
      loss_count: out[i].loss_count,
      alliance_participation: [...out[i].alliances.values()]
        .sort((a, b) => b.pilots - a.pilots || b.loss - a.loss || a.id - b.id)
        .map(a => ({ ...a, loss: a.loss / 1e9, corps: [...a.corps].sort((a, b) => a - b) })),
      independent_participation: [...out[i].independents.values()]
        .sort((a, b) => b.pilots - a.pilots || a.id - b.id).map(c => ({ ...c, loss: c.loss / 1e9 })),
      corporation_affiliations: [...out[i].affiliations].sort((a, b) => a[0] - b[0])
        .map(([id, alliances]) => ({ id, alliance_ids: [...alliances].sort((a, b) => a - b) })),
      // 按出场人数排
      corps: [...out[i].corps].sort((a, b) => b[1] - a[1]).map(([id, pilots]) => ({ id, pilots })),
      people: [...out[i].people],
    })),
  };
}

// 战报没分队、battle 配置 也没点名的组织：以点名联盟为种子看交火（打人或被打，每张 KM 每对组织记一次）。
// 与两个主阵营交火至少 3 次、且至少三分之二冲着同一方，就归到那一方的对手；
// 各轮同时扩展，最多四轮；仍看不出倾向的留给第三方。只在恰好两个主阵营时推断。
function inferSides(snap, sides, sideOf) {
  const fronts = sides.map((_, i) => i).filter(i => sides[i].name !== CATCH_ALL);
  if (fronts.length !== 2 || !snap.hits?.length) return;
  for (let round = 0; round < 4; round++) {
    const heat = new Map();
    const add = (k, other, n) => {
      const i = sideOf.get(other);
      if (sideOf.has(k) || !fronts.includes(i)) return;
      const h = heat.get(k) ?? heat.set(k, [0, 0]).get(k);
      h[fronts.indexOf(i)] += n;
    };
    for (const [a, v, n] of snap.hits) {
      add(a, v, n);
      add(v, a, n);
    }
    const next = [];
    for (const [k, [x, y]] of heat) {
      if (x + y < 3) continue;
      if (x * 3 >= (x + y) * 2) next.push([k, fronts[1]]);
      else if (y * 3 >= (x + y) * 2) next.push([k, fronts[0]]);
    }
    if (!next.length) return;
    for (const [k, i] of next) sideOf.set(k, i);
  }
}

// YAML 会把不加引号的 2020-12-30 解析成日期对象，统一成 YYYY-MM-DD（UTC）
export function toYmd(v) {
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v.toISOString().slice(0, 10);
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))) return v;
  return null;
}

export const FIELDS = {
  title: '必填，战役名',
  aliases: '可选，别名列表',
  videos: '可选，最多 8 个相关 B站／YouTube 视频，每项 { title, url, author, description }',
  epithet: '可选，一句话锐评',
  start: '必填，开打日期（UTC），YYYY-MM-DD',
  end: '可选，结束日期（UTC），跨日才写',
  systems: '必填，星系列表',
  tags: '可选，标签列表，供目录筛选（规模档位自动加，不必写）',
  sides: '必填，交战各方（2–4 方），每方见 SIDE_FIELDS',
  loss_source: '必填，总损失口径的来源网址；多场编组时写各场来源的列表。全是 br.evetools／killmail.app 战报时数字由快照 同名战役 JSON 的 br 自动算',
  window: "快照战役可选，只算这段时间的击杀，UTC，如 ['2020-10-06 02:59', '2020-10-07 06:00']",
  loss_is_lower_bound: '可选，true 表示已核损失下限，页面显示至少；分档与排序采用该下限',
  total_loss: '手填战役必填，各方总损失，单位 B（数字）',
  pilots: '手填战役可选，参战角色总数（来源给的总数；不写则在各方人数齐全时相加）',
  pilots_peak: '可选，同一时刻同一星系的角色人数峰值；不充作全程去重总人数',
};
export const SIDE_FIELDS = {
  name: '必填，阵营名，如 FRT 及友军；快照里归不了方的自动并入“第三方”',
  organizations: '可选，已核归方的联盟或军团 ID 列表；唯一组织归方入口，名字取自全站名称表，依据留素材',
  emblem: '可选，战徽使用的单个组织 ID，必须在本方 organizations 中',
  note: '可选，一句补充，如 折损泰坦 122 条',
  people: '手填战役可选，本方参战的已收录人物角色 ID（收录号）；快照战役按收录号与本人档案 identity.alts 自动认',
  pilots: '手填战役必填，该方参战角色数；缺数据显式写 null 并说明 stats_note',
  loss: '手填战役必填，该方损失，单位 B；缺数据显式写 null 并说明 stats_note',
  loss_count: '手填战役必填，该方损失记录条数（含来源统计的太空舱、建筑）；缺数据写 null',
  stats_note: '手填战役分方数字缺失时必填，说明来源缺口与续查入口，只留素材口径不展示',
  corps: '手填战役可选，华人军团列表，每项 { id, pilots }（军团 ID）；快照战役按名称表的 chinese 标记自动算',
};
// 快照战役不手填的字段：数字都从 同名战役 JSON 的 br 算
const SNAPSHOT_ONLY = ['window'];
const MANUAL_ONLY = ['total_loss', 'pilots'];
const MANUAL_SIDE_ONLY = ['pilots', 'loss', 'loss_count', 'stats_note', 'corps', 'people'];
const isPosInt = v => Number.isInteger(v) && v > 0;
const isLoss = v => typeof v === 'number' && Number.isFinite(v) && v >= 0;
const isStrList = v => Array.isArray(v) && v.length > 0 && v.every(x => typeof x === 'string' && x.trim());

// people：peopleIndex 的结果（角色 ID → 收录号）
export function validateBattle(data, body, lineOffset, people) {
  const errs = [];
  for (const k of Object.keys(data)) {
    if (k === 'corps') errs.push(`顶层 corps 已取消：华人军团在 ${NAMES_FILE} 里给该军团加 "chinese": true；手填战役写进各方 corps`);
    else if (!(k in FIELDS)) errs.push(`未知字段 "${k}"（允许的字段：${Object.keys(FIELDS).join(', ')}）`);
  }
  if (typeof data.title !== 'string' || !data.title.trim()) errs.push('缺少 title（战役名）');
  if (typeof data.title === 'string') {
    for (const [english, chinese] of Object.entries(systemNames)) {
      const escaped = english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp(`\\b${escaped}\\b`, 'i').test(data.title)) {
        errs.push(`title 中的星系 ${english} 须使用中文名「${chinese}」`);
      }
    }
  }
  if (data.epithet != null && typeof data.epithet !== 'string') errs.push('epithet 必须是字符串');
  if (data.aliases != null && !isStrList(data.aliases)) errs.push('aliases 必须是字符串列表');
  if (!isStrList(data.systems)) errs.push('systems 必须是星系列表，如 [M2-XFE]');
  if (data.tags != null && !isStrList(data.tags)) errs.push('tags 必须是字符串列表');

  if (data.videos != null) {
    if (!Array.isArray(data.videos) || data.videos.length > 8) errs.push('videos 必须是最多 8 项的视频列表');
    else {
      const seen = new Set();
      for (const [i, video] of data.videos.entries()) {
        const at = `videos 第 ${i + 1} 项`;
        if (!video || typeof video !== 'object' || Array.isArray(video)) {
          errs.push(`${at}必须是 { title, url, author, description } 结构`);
          continue;
        }
        for (const key of Object.keys(video)) if (!['title', 'url', 'author', 'description'].includes(key)) errs.push(`${at}：未知字段 "${key}"`);
        for (const key of ['title', 'author', 'description']) if (typeof video[key] !== 'string' || !video[key].trim()) errs.push(`${at}：${key} 必须是非空字符串`);
        let bv;
        try {
          const url = new URL(video.url);
          if (url.protocol === 'https:' && !url.username && !url.password && !url.port) {
            if (['www.bilibili.com', 'bilibili.com'].includes(url.hostname)) bv = url.pathname.match(/^\/video\/(BV[0-9A-Za-z]{10})\/?$/)?.[1];
            else if (url.hostname === 'www.youtube.com' && url.pathname === '/watch') bv = url.searchParams.get('v')?.match(/^[0-9A-Za-z_-]{11}$/)?.[0];
          }
        } catch { /* 无效链接统一在下方报错 */ }
        if (!bv) errs.push(`${at}：url 必须是 https://www.bilibili.com/video/BV… 或 https://www.youtube.com/watch?v=… 完整视频链接`);
        else if (seen.has(bv)) errs.push(`${at}：视频 ${bv} 重复`);
        else seen.add(bv);
      }
    }
  }

  const start = toYmd(data.start);
  if (!start) errs.push('start 必须是日期 YYYY-MM-DD');
  if (data.end != null) {
    const end = toYmd(data.end);
    if (!end) errs.push('end 必须是日期 YYYY-MM-DD');
    else if (start && end < start) errs.push('end 早于 start');
  }

  if (data.loss_is_lower_bound != null && typeof data.loss_is_lower_bound !== 'boolean') errs.push('loss_is_lower_bound 必须是布尔值');
  const sources = Array.isArray(data.loss_source) ? data.loss_source : [data.loss_source];
  if (!sources.length || !sources.every(u => typeof u === 'string' && /^https?:\/\//.test(u))) {
    errs.push('loss_source 必须是总损失口径的来源网址（多场编组写网址列表）');
  }
  const snapshot = usesSnapshot(data);
  if (snapshot) {
    for (const k of MANUAL_ONLY) if (k in data) errs.push(`${k} 由战报快照算出，不用手填（loss_source 全是 br.evetools／killmail.app 战报）`);
    if (data.window != null && !parseWindow(data.window)) errs.push("window 必须是 ['YYYY-MM-DD HH:MM', 'YYYY-MM-DD HH:MM']（UTC，起早于止）");
  } else {
    for (const k of SNAPSHOT_ONLY) if (k in data) errs.push(`${k} 只用于 loss_source 全是 br.evetools／killmail.app 战报的战役；手填战役把军团写进各方 corps`);
    if (typeof data.total_loss !== 'number' || !Number.isFinite(data.total_loss)) {
      errs.push('total_loss 必须是数字，单位 B（如 6.64T 写 6640）');
    } else if (!tierOf(data.total_loss)) {
      errs.push(`total_loss ${data.total_loss}B 不足 ${TIERS.at(-1).min}B，不收入战役板块`);
    }
    if (data.pilots != null && !isPosInt(data.pilots)) errs.push('pilots 必须是正整数');
  }
  if (data.pilots_peak != null && !isPosInt(data.pilots_peak)) errs.push('pilots_peak 必须是正整数');
  errs.push(...validateSides(data.sides, people, snapshot));
  errs.push(...validateBlocks(body, lineOffset));
  return errs;
}

function validateSides(sides, people, snapshot) {
  if (!Array.isArray(sides) || sides.length < 2 || sides.length > 4) {
    return ['sides 必须列出 2–4 个交战方，每方至少写 name'];
  }
  const errs = [];
  const seen = new Map();
  sides.forEach((side, i) => {
    const at = `sides 第 ${i + 1} 方`;
    if (side == null || typeof side !== 'object' || Array.isArray(side)) {
      errs.push(`${at}必须是 { name, organizations, … } 结构`);
      return;
    }
    for (const k of Object.keys(side)) {
      if (!(k in SIDE_FIELDS)) errs.push(`${at}：未知字段 "${k}"（允许的字段：${Object.keys(SIDE_FIELDS).join(', ')}）`);
    }
    const label = typeof side.name === 'string' && side.name.trim() ? `sides「${side.name}」` : at;
    if (label === at) errs.push(`${at}缺少 name（阵营名）`);
    if (snapshot) {
      for (const k of MANUAL_SIDE_ONLY) if (k in side) errs.push(`${label}：${k} 由战报快照算出，不用手填${{ corps: `（华人军团在 ${NAMES_FILE} 里加 "chinese": true）`, people: '（小号写进本人 <ID>-id.json 的 identity.alts）' }[k] ?? ''}`);
    } else {
      for (const key of ['pilots', 'loss', 'loss_count']) {
        if (!Object.hasOwn(side, key)) errs.push(`${label}：缺少 ${key}，须填写分方数字；来源缺失写 null 并在 stats_note 说明`);
      }
      if (['pilots', 'loss', 'loss_count'].some(key => side[key] == null) &&
          (typeof side.stats_note !== 'string' || !side.stats_note.trim())) {
        errs.push(`${label}：分方数据缺失时必须填写 stats_note，说明来源缺口与续查入口`);
      }
    }
    if (side.stats_note != null && (typeof side.stats_note !== 'string' || !side.stats_note.trim())) errs.push(`${label}：stats_note 必须是非空字符串`);
    if (side.organizations != null && !(Array.isArray(side.organizations) && side.organizations.length && side.organizations.every(isPosInt))) {
      errs.push(`${label}：organizations 必须是非空组织 ID 列表`);
    }
    if (Array.isArray(side.organizations) && new Set(side.organizations).size !== side.organizations.length) errs.push(`${label}：organizations 不得重复登记同一组织`);
    if (side.emblem != null && (!isPosInt(side.emblem) || !Array.isArray(side.organizations) || !side.organizations.includes(side.emblem))) errs.push(`${label}：emblem 必须是本方 organizations 中的一个组织 ID`);
    if (side.pilots != null && !isPosInt(side.pilots)) errs.push(`${label}：pilots 必须是正整数`);
    if (side.loss != null && !isLoss(side.loss)) errs.push(`${label}：loss 必须是数字，单位 B`);
    if (side.loss_count != null && (!Number.isInteger(side.loss_count) || side.loss_count < 0)) errs.push(`${label}：loss_count 必须是非负整数`);
    if (side.note != null && (typeof side.note !== 'string' || !side.note.trim())) errs.push(`${label}：note 必须是一句话`);
    if (side.corps != null) {
      if (!Array.isArray(side.corps)) errs.push(`${label}：corps 必须是军团列表`);
      else
        for (const c of side.corps) {
          if (c == null || typeof c !== 'object' || !isPosInt(c.id)) {
            errs.push(`${label}：corps 每项必须写 id（军团 ID），如 { id: 98190062, pilots: 20 }`);
            continue;
          }
          for (const k of Object.keys(c)) if (!['id', 'pilots', 'alliance_id'].includes(k)) errs.push(`${label}：军团 ${c.id} 未知字段 "${k}"（只允许 id, pilots, alliance_id）`);
          if (c.alliance_id != null && (!Number.isInteger(c.alliance_id) || c.alliance_id < 0)) errs.push(`${label}：军团 ${c.id} 的 alliance_id 必须是历史联盟 ID，0 表示当时无联盟`);
          if (c.pilots != null && !isPosInt(c.pilots)) errs.push(`${label}：军团 ${c.id} 的 pilots 必须是正整数`);
        }
    }
    if (side.people != null) {
      if (!Array.isArray(side.people)) errs.push(`${label}：people 必须是角色 ID 列表`);
      else
        for (const id of side.people) {
          if (!isPosInt(id)) errs.push(`${label}：people 里的 "${id}" 不是角色 ID`);
          else if (seen.has(id)) errs.push(`${label}：people 里的 ${id} 重复（已列在${seen.get(id)}）`);
          else if (people.get(id) !== id) errs.push(`${label}：people 里的 ${id} 没有对应列传（只列已收录人物的 character_id）`);
          if (isPosInt(id) && !seen.has(id)) seen.set(id, label);
        }
    }
  });
  if (sides.some(s => Array.isArray(s?.organizations))) {
    const assigned = new Map();
    for (const side of sides) {
      if (!side || typeof side !== 'object' || !Array.isArray(side.organizations ?? [])) continue;
      for (const id of assignedOrgs(side)) {
        if (assigned.has(id)) errs.push(`组织 ${id} 同时归于「${assigned.get(id)}」与「${side.name}」，请核对分方`);
        else assigned.set(id, side.name);
      }
    }
  }
  return errs;
}

async function frontMatters(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
  const out = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('_')) continue;
    const file = `${entry.name}/${entry.name}.md`;
    let raw = null;
    try {
      raw = await fs.readFile(path.join(dir, file), 'utf8');
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
    out.push({ slug: entry.name, file, raw });
  }
  return out;
}

// 一场战役点名的联盟、军团 ID（展示、完整归方与手填 corps）
export const orgIds = data => (data.sides ?? []).flatMap(s => [...assignedOrgs(s), ...(s.corps ?? []).flatMap(c => [c.id, ...(c.alliance_id > 0 ? [c.alliance_id] : [])])]);

// 同一星系、日期相交的两场算重复：连打几天的编组只收一页，组内单场不另立页
export function findOverlaps(battles) {
  const errs = [];
  const span = b => [toYmd(b.data.start), toYmd(b.data.end ?? b.data.start)];
  for (let i = 0; i < battles.length; i++) {
    for (let j = i + 1; j < battles.length; j++) {
      const [a, b] = [battles[i], battles[j]];
      const [as, ae] = span(a);
      const [bs, be] = span(b);
      const shared = a.data.systems.filter(s => b.data.systems.includes(s));
      if (shared.length && as <= be && bs <= ae) {
        errs.push(`${b.file}：与 ${a.file} 同在 ${shared.join('、')}、日期重叠（${as}—${ae} / ${bs}—${be}）；同一星系连打几天的编组只收一页，组内单场不另立页`);
      }
    }
  }
  return errs;
}

// 附属联盟 → 主联盟：同场出现时必须同方，没有例外。FAX（Fraternity Auxiliary）、FRT-U（Fraternity University）随 FRT。
export const SISTER_ALLIANCES = new Map([[99013541, 99003581], [99006406, 99003581]]);

// 快照战役：快照与 battle 配置 对得上，点名的联盟、军团都在战报里，算出来够分档
export function checkSnapshot(data, snap, people, table) {
  const stale = snapshotStale(data, snap);
  if (stale) return [`${stale}，请运行 npm run fetch 更新同名战役 JSON 的 br`];
  const errs = [];
  const st = battleStats(data, snap, people, table);
  const allianceSides = new Map();
  for (const s of st.sides) {
    for (const a of s.alliance_participation) {
      const previous = allianceSides.get(a.id);
      if (previous != null && previous !== s.name) errs.push(`联盟 ${a.id}（${table.alliances[a.id]?.name ?? '名称待补'}）及所属军团跨方：${previous} / ${s.name}，请修正归方`);
      else allianceSides.set(a.id, s.name);
    }
  }
  for (const [id, main] of SISTER_ALLIANCES) {
    const own = allianceSides.get(id), mainSide = allianceSides.get(main);
    if (own != null && mainSide != null && own !== mainSide) errs.push(`附属联盟 ${id}（${table.alliances[id]?.name ?? '名称待补'}）须与主联盟 ${main}（${table.alliances[main]?.name ?? '名称待补'}）同方：${own} / ${mainSide}，请修正归方`);
  }
  for (const s of data.sides) {
    for (const id of assignedOrgs(s)) {
      if (table.alliances[id] && allianceSides.has(id) && allianceSides.get(id) !== s.name) errs.push(`联盟 ${id} 的点名归方「${s.name}」与所属军团归方「${allianceSides.get(id)}」冲突，请修正归方`);
    }
  }
  if (!tierOf(st.total_loss)) errs.push(`战报快照算出总损失 ${formatIsk(st.total_loss)}，不足 ${TIERS.at(-1).min}B，不收入战役板块`);
  const present = battleOrgs(snap);
  for (const s of data.sides) {
    for (const id of assignedOrgs(s)) {
      if (!present.has(id)) errs.push(`sides「${s.name}」：${table.alliances[id]?.name ?? table.corporations[id]?.name ?? ''}（${id}）不在战报里，检查 ID 或删掉`);
    }
  }
  return errs;
}

// fetchSnapshot(data) → 快照对象；lookupNames(ids) → ESI universe/names 结果 [{ id, name, category }]。
// 不传则只读缓存、不联网：快照缺失或过期、点名的 ID 不在名称表里时报错。查到的名字写进全站名称表 NAMES_FILE
export async function checkBattles(root, { fetchSnapshot, lookupNames, lookupAllianceDetails } = {}) {
  const people = peopleIndex(path.join(root, 'src/people'));
  const table = readNames(root);
  const before = JSON.stringify(table);
  const errors = [];
  const battles = await frontMatters(path.join(root, 'src/battles'));
  const valid = [];
  for (const b of battles) {
    if (!/^[a-z0-9-]+$/.test(b.slug)) errors.push(`${b.file}：目录名只能用小写字母、数字、连字符`);
    if (b.raw == null) {
      errors.push(`${b.file}：缺少战役 Markdown 文件`);
      continue;
    }
    let parsed;
    try {
      parsed = readBattleDocument(path.join(root, 'src/battles', b.file));
    } catch (e) {
      errors.push(`${b.file}：战役档案读取失败：${e.message}`);
      continue;
    }
    const lineOffset = bodyLineOffset(b.raw, parsed.content);
    const errs = validateBattle(parsed.data, parsed.content, lineOffset, people);
    errors.push(...errs.map(e => `${b.file}：${e}`));
    if (errs.length) continue;
    valid.push({ ...b, data: parsed.data });
  }
  errors.push(...findOverlaps(valid));
  for (const b of valid) errors.push(...checkAllianceTags(b.data.tags, table).map(e => `${b.file}：${e}`));
  errors.push(...(await checkIds(table, valid.map(b => b.data), lookupNames)));
  const snapshotOrganizations = new Set();
  for (const b of valid.filter(b => usesSnapshot(b.data))) {
    const dir = path.join(root, 'src/battles', b.slug);
    let snap = readSnapshot(dir);
    if (snapshotStale(b.data, snap) && fetchSnapshot) {
      snap = await fetchSnapshot(b.data);
      writeBattleSnapshot(dir, snap);
    }
    errors.push(...checkSnapshot(b.data, snap, people, table).map(e => `${b.file}：${e}`));
    if (snap) {
      for (const side of battleStats(b.data, snap, people, table).sides) {
        for (const alliance of listedAllianceParticipation(side, table)) snapshotOrganizations.add(alliance.id);
      }
    }
  }
  // 快照的联盟字段已证明组织类型。名称缺失保留类型和 ID，不能漏掉参战记录；
  // 手填归方种子的 ID 仍由上面的 checkIds 严格校验。
  const warnings = [];
  const missing = [...snapshotOrganizations].filter(id => !table.alliances[id]);
  try {
    if (missing.length && lookupNames) {
      for (const { id, name, category } of await lookupNames(missing)) {
        if (snapshotOrganizations.has(id) && category === 'alliance') table.alliances[id] = { ...table.alliances[id], name };
      }
    }
    if (lookupAllianceDetails) {
      const incomplete = [...snapshotOrganizations].filter(id => !table.alliances[id]?.ticker && !table.alliances[id]?.metadata_unavailable);
      for (const { id, ...details } of incomplete.length ? await lookupAllianceDetails(incomplete) : []) {
        if (details.name || table.alliances[id]) table.alliances[id] = { ...table.alliances[id], ...details };
      }
    }
  } catch (error) {
    warnings.push(`参战联盟名称／缩写暂未补齐：${error.message}；保留历史联盟 ID，稍后运行 npm run fetch 重试。`);
  }
  const pendingAllianceIds = [...snapshotOrganizations].filter(id => !table.alliances[id]?.name).sort((a, b) => a - b);
  if (pendingAllianceIds.length) warnings.push(`${pendingAllianceIds.length} 个历史参战联盟缺少名称缓存，页面暂显示联盟 ID。`);
  if (JSON.stringify(table) !== before) writeNames(root, table);
  return { count: battles.length, errors, warnings, pendingAllianceIds };
}

// 含中文的是地带、战型等普通标签；其余都当联盟标签，必须是名称表里某个联盟的游戏内 ticker（不用俗称、简称）
export function checkAllianceTags(tags, table) {
  const tickers = new Set(Object.values(table.alliances ?? {}).map(a => a.ticker).filter(Boolean));
  return (tags ?? [])
    .filter(t => !/[一-鿿]/.test(t) && !tickers.has(t))
    .map(t => `标签 "${t}" 不是已知联盟的游戏内 ticker，联盟标签统一用 ticker`);
}

// 点名的联盟、军团 ID 不在名称表里就向 ESI 查名字，查到的写进 table
async function checkIds(table, datas, lookupNames) {
  const missingOf = () => [...new Set(datas.flatMap(orgIds))].filter(id => !kindOf(table, id));
  let missing = missingOf();
  if (missing.length && lookupNames) {
    const kinds = { alliance: 'alliances', corporation: 'corporations' };
    for (const { id, name, category } of await lookupNames(missing)) {
      if (kinds[category]) table[kinds[category]][id] = { ...table[kinds[category]][id], name };
    }
    missing = missingOf();
    if (missing.length) return [`ESI 查不到这些联盟／军团 ID：${missing.join('、')}，检查 ID（查 ID 用 npm run find）`];
  }
  if (missing.length) return [`${NAMES_FILE} 缺少 ${missing.length} 个联盟／军团（${missing.join('、')}），请运行 npm run fetch`];
  return [];
}
