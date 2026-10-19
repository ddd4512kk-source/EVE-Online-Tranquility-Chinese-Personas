// 战役板块：规模分档与战役文件校验。构建（eleventy.config.js）与 check-battles.mjs 共用。
import fs from "node:fs/promises";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { bodyLineOffset, validateBlocks } from "./blocks.mjs";
import systemNames from "../src/_data/systemNames.js";
import {
  SNAPSHOT_FILE,
  battleOrgs,
  brApiUrl,
  entityKey,
  parseWindow,
  snapshotStale,
  stringifySnapshot,
} from "./battle-report.mjs";
import { NAMES_FILE, readNames, writeNames } from "./character-snapshot.mjs";

// 来源全是 br.evetools／killmail.app 战报 → 数字由战报快照算；混有官方报道、论坛自报等别的来源 → 手填
export const usesSnapshot = (data) => {
  const sources = [data.loss_source].flat();
  return sources.length > 0 && sources.every((u) => brApiUrl(u));
};

// 战役目录 dir 下的 br.json；没有返回 null
export function readSnapshot(dir) {
  try {
    return JSON.parse(readFileSync(path.join(dir, SNAPSHOT_FILE), "utf8"));
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw new Error(`${path.join(dir, SNAPSHOT_FILE)} 格式错误：${e.message}`);
  }
}

// 已收录人物：角色 ID（收录号与 front matter alts 里的小号）→ 收录号
export function peopleIndex(peopleDir) {
  const people = new Map();
  for (const e of readdirSync(peopleDir, { withFileTypes: true })) {
    if (!e.isDirectory() || e.name.startsWith("_")) continue;
    let data;
    try {
      data = matter(readFileSync(path.join(peopleDir, e.name, `${e.name}.md`), "utf8")).data;
    } catch {
      continue; // 缺文件、格式错误由 fetch-characters 报
    }
    const id = Number(data.character_id);
    if (!Number.isInteger(id) || id <= 0) continue;
    people.set(id, id);
    for (const alt of Array.isArray(data.alts) ? data.alts : []) if (Number.isInteger(alt) && !people.has(alt)) people.set(alt, id);
  }
  return people;
}

// 联盟、军团 ID 全站唯一，在全站名称表（character-snapshot.mjs 的 NAMES_FILE）里看是哪一类；不在表里返回 null
export const kindOf = (table, id) => (table.alliances[id] ? "alliances" : table.corporations[id] ? "corporations" : null);

// 页面用的组织：{ id, kind: alliance|corporation（EveWho 网址用）, name }
const orgOf = (table, id) => {
  const kind = kindOf(table, id);
  return { id, kind: kind === "alliances" ? "alliance" : "corporation", name: table[kind]?.[id]?.name ?? String(id) };
};

// 页面用的数字：有快照从快照算，否则照 front matter 手填；联盟、军团 ID 换成带名字的组织
// table：全站名称表
export function statsOf(data, snap, table, people) {
  let st;
  if (usesSnapshot(data)) st = battleStats(data, snap, people, table);
  else {
    const sides = data.sides ?? [];
    st = {
      total_loss: data.total_loss,
      // 来源给了总数就用总数，否则各方人数齐全时相加
      pilots: data.pilots ?? (sides.length && sides.every((s) => s.pilots) ? sides.reduce((n, s) => n + s.pilots, 0) : null),
      sides,
    };
  }
  return {
    ...st,
    sides: st.sides.map((s) => ({
      ...s,
      alliances: (s.alliances ?? []).map((id) => orgOf(table, id)),
      ...(s.corps && { corps: s.corps.map((c) => ({ ...orgOf(table, c.id), pilots: c.pilots })) }),
    })),
  };
}

// 按各方总损失分档（单位 B = 十亿 ISK），与列传里的战役分档同一标准；从高到低排列
export const TIERS = [
  { key: "epic", name: "史诗", min: 1000 },
  { key: "large", name: "大型", min: 400 },
  { key: "medium", name: "中型", min: 100 },
];
export const tierOf = (b) => TIERS.find((t) => b >= t.min) ?? null;

// 6640 → 6.64T，969.12 → 969.12B
export const formatIsk = (b) => (b >= 1000 ? `${+(b / 1000).toFixed(2)}T` : `${Math.round(b)}B`);

// 目录与详情共用，缺项仍保留标签；0 损失是有效数字。
export function sideStats(s) {
  return [
    s.pilots == null ? "参战人数待补" : `参战 ${s.pilots} 人`,
    s.loss == null ? "损失金额待补" : `损失 ${formatIsk(s.loss)}`,
    s.loss_count == null ? "损失计数待补" : `损失记录 ${s.loss_count} 条`,
    s.note,
  ].filter(Boolean).join(" · ");
}

// 有战报快照的战役：按阵营算人数、损失、条数、华人军团人数与已收录人物。
// 归方顺序：front matter 各方 alliances 点名的联盟（或无联盟的军团）→ 战报作者分的队伍 → 交火推断（没分队或分队与点名冲突时）→ “第三方”。
// 华人军团：名称表里标了 chinese 的军团。
// people：角色 ID（收录号与小号）→ 收录号，见 peopleIndex；table：全站名称表
export const CATCH_ALL = "第三方";
export function battleStats(data, snap, people, table) {
  const keyOf = (id) => ({ alliances: `a:${id}`, corporations: `c:${id}` })[kindOf(table, id)];
  const sides = data.sides ?? [];
  const sideOf = new Map();
  sides.forEach((s, i) => (s.alliances ?? []).forEach((id) => keyOf(id) && sideOf.set(keyOf(id), i)));
  let catchAll = sides.findIndex((s) => s.name === CATCH_ALL);
  // 战报作者分了队就照分队：队里点名的联盟都在同一方，没点名的队友跟着归这一方；
  // 点名在“第三方”的联盟只把自己摘出来，不影响整队。
  // 队里一个都没点名的，没点名的队友算第三方；队里点名联盟分属几方（分队与点名冲突，或多份战报分队不一致）的，
  // 不信这份分队，没点名的队友按交火推断。没分队也按交火推断
  const teamed = [];
  let conflict = false;
  for (const team of snap.teams ?? []) {
    const keys = team.map((t) => (t.startsWith("corp:") ? `c:${t.slice(5)}` : `a:${t}`));
    const listed = new Set(keys.filter((k) => sideOf.has(k) && sideOf.get(k) !== catchAll).map((k) => sideOf.get(k)));
    if (listed.size === 1) teamed.push([keys, [...listed][0]]);
    else if (listed.size > 1) conflict = true;
  }
  for (const [keys, best] of teamed) for (const k of keys) if (!sideOf.has(k)) sideOf.set(k, best);
  if (!snap.teams?.length || conflict) inferSides(snap, sides, sideOf);
  // 剩下归不了方的并成“第三方”；front matter 没写这一方就自动补上
  // NPC 军团角色先按本人看，再看战报分队里整个 NPC 军团归哪
  const sideIdx = (corp, ally, char) => sideOf.get(entityKey(corp, ally, char)) ?? sideOf.get(entityKey(corp, ally));
  const unsorted = [
    ...Object.entries(snap.pilots).map(([char, [corp, ally]]) => sideIdx(corp, ally, Number(char))),
    ...snap.losses.map(([, char, corp, ally]) => sideIdx(corp, ally, char)),
  ].some((i) => i == null);
  const allSides = catchAll < 0 && unsorted ? [...sides, { name: CATCH_ALL }] : sides;
  if (catchAll < 0) catchAll = allSides.length - 1;
  const side = (corp, ally, char) => sideIdx(corp, ally, char) ?? catchAll;

  const out = allSides.map(() => ({ pilots: 0, loss: 0, loss_count: 0, corps: new Map(), people: new Set() }));
  for (const [char, [corp, ally]] of Object.entries(snap.pilots)) {
    const o = out[side(corp, ally, Number(char))];
    o.pilots++;
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
  }
  return {
    total_loss: total / 1e9,
    pilots: Object.keys(snap.pilots).length,
    sides: allSides.map((s, i) => ({
      ...s,
      pilots: out[i].pilots,
      loss: out[i].loss / 1e9,
      loss_count: out[i].loss_count,
      // 按出场人数排
      corps: [...out[i].corps].sort((a, b) => b[1] - a[1]).map(([id, pilots]) => ({ id, pilots })),
      people: [...out[i].people],
    })),
  };
}

// 战报没分队、front matter 也没点名的组织：以点名联盟为种子看交火（打人或被打，每张 KM 每对组织记一次）。
// 与两个主阵营交火至少 3 次、且至少三分之二冲着同一方，就归到那一方的对手；
// 各轮同时扩展，最多四轮；仍看不出倾向的留给第三方。只在恰好两个主阵营时推断。
function inferSides(snap, sides, sideOf) {
  const fronts = sides.map((_, i) => i).filter((i) => sides[i].name !== CATCH_ALL);
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
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))) return v;
  return null;
}

export const FIELDS = {
  title: "必填，战役名",
  aliases: "可选，别名列表",
  epithet: "可选，一句话锐评",
  start: "必填，开打日期（UTC），YYYY-MM-DD",
  end: "可选，结束日期（UTC），跨日才写",
  systems: "必填，星系列表",
  tags: "可选，标签列表，供目录筛选（规模档位自动加，不必写）",
  sides: "必填，交战各方（2–4 方），每方见 SIDE_FIELDS",
  loss_source: "必填，总损失口径的来源网址；多场编组时写各场来源的列表。全是 br.evetools／killmail.app 战报时数字由快照 br.json 自动算",
  window: "快照战役可选，只算这段时间的击杀，UTC，如 ['2020-10-06 02:59', '2020-10-07 06:00']",
  loss_is_lower_bound: "可选，true 表示已核损失下限，页面显示至少；分档与排序采用该下限",
  total_loss: "手填战役必填，各方总损失，单位 B（数字）",
  pilots: "手填战役可选，参战角色总数（来源给的总数；不写则在各方人数齐全时相加）",
  pilots_peak: "可选，同一时刻同一星系的角色人数峰值；不充作全程去重总人数",
};
export const SIDE_FIELDS = {
  name: "必填，阵营名，如 FRT 及友军；快照里归不了方的自动并入“第三方”",
  alliances: "可选，主要联盟的 ID 列表（无联盟的军团写军团 ID），按出场人数从多到少；名字取自全站名称表；快照战役据此把战报里的队伍归方",
  note: "可选，一句补充，如 折损泰坦 122 条",
  people: "手填战役可选，本方参战的已收录人物角色 ID（收录号）；快照战役按收录号与列传 alts 自动认",
  pilots: "手填战役必填，该方参战角色数；缺数据显式写 null 并说明 stats_note",
  loss: "手填战役必填，该方损失，单位 B；缺数据显式写 null 并说明 stats_note",
  loss_count: "手填战役必填，该方损失记录条数（含来源统计的胶囊、建筑）；缺数据写 null",
  stats_note: "手填战役分方数字缺失时必填，说明来源缺口与续查入口，只留素材口径不展示",
  corps: "手填战役可选，华人军团列表，每项 { id, pilots }（军团 ID）；快照战役按名称表的 chinese 标记自动算",
};
// 快照战役不手填的字段：数字都从 br.json 算
const SNAPSHOT_ONLY = ["window"];
const MANUAL_ONLY = ["total_loss", "pilots"];
const MANUAL_SIDE_ONLY = ["pilots", "loss", "loss_count", "stats_note", "corps", "people"];
const isPosInt = (v) => Number.isInteger(v) && v > 0;
const isLoss = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0;
const isStrList = (v) => Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === "string" && x.trim());

// people：peopleIndex 的结果（角色 ID → 收录号）
export function validateBattle(data, body, lineOffset, people) {
  const errs = [];
  for (const k of Object.keys(data)) {
    if (k === "corps") errs.push(`顶层 corps 已取消：华人军团在 ${NAMES_FILE} 里给该军团加 "chinese": true；手填战役写进各方 corps`);
    else if (!(k in FIELDS)) errs.push(`未知字段 "${k}"（允许的字段：${Object.keys(FIELDS).join(", ")}）`);
  }
  if (typeof data.title !== "string" || !data.title.trim()) errs.push("缺少 title（战役名）");
  if (typeof data.title === "string") {
    for (const [english, chinese] of Object.entries(systemNames)) {
      const escaped = english.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(`\\b${escaped}\\b`, "i").test(data.title)) {
        errs.push(`title 中的星系 ${english} 须使用中文名「${chinese}」`);
      }
    }
  }
  if (data.epithet != null && typeof data.epithet !== "string") errs.push("epithet 必须是字符串");
  if (data.aliases != null && !isStrList(data.aliases)) errs.push("aliases 必须是字符串列表");
  if (!isStrList(data.systems)) errs.push("systems 必须是星系列表，如 [M2-XFE]");
  if (data.tags != null && !isStrList(data.tags)) errs.push("tags 必须是字符串列表");

  const start = toYmd(data.start);
  if (!start) errs.push("start 必须是日期 YYYY-MM-DD");
  if (data.end != null) {
    const end = toYmd(data.end);
    if (!end) errs.push("end 必须是日期 YYYY-MM-DD");
    else if (start && end < start) errs.push("end 早于 start");
  }

  if (data.loss_is_lower_bound != null && typeof data.loss_is_lower_bound !== "boolean") errs.push("loss_is_lower_bound 必须是布尔值");
  const sources = Array.isArray(data.loss_source) ? data.loss_source : [data.loss_source];
  if (!sources.length || !sources.every((u) => typeof u === "string" && /^https?:\/\//.test(u))) {
    errs.push("loss_source 必须是总损失口径的来源网址（多场编组写网址列表）");
  }
  const snapshot = usesSnapshot(data);
  if (snapshot) {
    for (const k of MANUAL_ONLY) if (k in data) errs.push(`${k} 由战报快照算出，不用手填（loss_source 全是 br.evetools／killmail.app 战报）`);
    if (data.window != null && !parseWindow(data.window)) errs.push("window 必须是 ['YYYY-MM-DD HH:MM', 'YYYY-MM-DD HH:MM']（UTC，起早于止）");
  } else {
    for (const k of SNAPSHOT_ONLY) if (k in data) errs.push(`${k} 只用于 loss_source 全是 br.evetools／killmail.app 战报的战役；手填战役把军团写进各方 corps`);
    if (typeof data.total_loss !== "number" || !Number.isFinite(data.total_loss)) {
      errs.push("total_loss 必须是数字，单位 B（如 6.64T 写 6640）");
    } else if (!tierOf(data.total_loss)) {
      errs.push(`total_loss ${data.total_loss}B 不足 ${TIERS.at(-1).min}B，不收入战役板块`);
    }
    if (data.pilots != null && !isPosInt(data.pilots)) errs.push("pilots 必须是正整数");
  }
  if (data.pilots_peak != null && !isPosInt(data.pilots_peak)) errs.push("pilots_peak 必须是正整数");
  errs.push(...validateSides(data.sides, people, snapshot));
  errs.push(...validateBlocks(body, lineOffset));
  return errs;
}

function validateSides(sides, people, snapshot) {
  if (!Array.isArray(sides) || sides.length < 2 || sides.length > 4) {
    return ["sides 必须列出 2–4 个交战方，每方至少写 name"];
  }
  const errs = [];
  const seen = new Map();
  sides.forEach((side, i) => {
    const at = `sides 第 ${i + 1} 方`;
    if (side == null || typeof side !== "object" || Array.isArray(side)) {
      errs.push(`${at}必须是 { name, alliances, … } 结构`);
      return;
    }
    for (const k of Object.keys(side)) {
      if (!(k in SIDE_FIELDS)) errs.push(`${at}：未知字段 "${k}"（允许的字段：${Object.keys(SIDE_FIELDS).join(", ")}）`);
    }
    const label = typeof side.name === "string" && side.name.trim() ? `sides「${side.name}」` : at;
    if (label === at) errs.push(`${at}缺少 name（阵营名）`);
    if (snapshot) {
      for (const k of MANUAL_SIDE_ONLY) if (k in side) errs.push(`${label}：${k} 由战报快照算出，不用手填${{ corps: `（华人军团在 ${NAMES_FILE} 里加 "chinese": true）`, people: "（小号写进本人列传 alts）" }[k] ?? ""}`);
    } else {
      for (const key of ["pilots", "loss", "loss_count"]) {
        if (!Object.hasOwn(side, key)) errs.push(`${label}：缺少 ${key}，须填写分方数字；来源缺失写 null 并在 stats_note 说明`);
      }
      if (["pilots", "loss", "loss_count"].some((key) => side[key] == null) &&
          (typeof side.stats_note !== "string" || !side.stats_note.trim())) {
        errs.push(`${label}：分方数据缺失时必须填写 stats_note，说明来源缺口与续查入口`);
      }
    }
    if (side.stats_note != null && (typeof side.stats_note !== "string" || !side.stats_note.trim())) errs.push(`${label}：stats_note 必须是非空字符串`);
    if (side.alliances != null && !(Array.isArray(side.alliances) && side.alliances.length && side.alliances.every(isPosInt))) {
      errs.push(`${label}：alliances 必须是联盟 ID 列表（无联盟的军团写军团 ID），如 [99003581, 1411711376]；查 ID 用 npm run find`);
    }
    if (side.pilots != null && !isPosInt(side.pilots)) errs.push(`${label}：pilots 必须是正整数`);
    if (side.loss != null && !isLoss(side.loss)) errs.push(`${label}：loss 必须是数字，单位 B`);
    if (side.loss_count != null && (!Number.isInteger(side.loss_count) || side.loss_count < 0)) errs.push(`${label}：loss_count 必须是非负整数`);
    if (side.note != null && (typeof side.note !== "string" || !side.note.trim())) errs.push(`${label}：note 必须是一句话`);
    if (side.corps != null) {
      if (!Array.isArray(side.corps)) errs.push(`${label}：corps 必须是军团列表`);
      else
        for (const c of side.corps) {
          if (c == null || typeof c !== "object" || !isPosInt(c.id)) {
            errs.push(`${label}：corps 每项必须写 id（军团 ID），如 { id: 98190062, pilots: 20 }`);
            continue;
          }
          for (const k of Object.keys(c)) if (k !== "id" && k !== "pilots") errs.push(`${label}：军团 ${c.id} 未知字段 "${k}"（只允许 id, pilots）`);
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
  return errs;
}

async function frontMatters(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (e) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
  const out = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    const file = `${entry.name}/${entry.name}.md`;
    let raw = null;
    try {
      raw = await fs.readFile(path.join(dir, file), "utf8");
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
    out.push({ slug: entry.name, file, raw });
  }
  return out;
}

// 一场战役点名的联盟、军团 ID（各方 alliances 与手填 corps）
export const orgIds = (data) => (data.sides ?? []).flatMap((s) => [...(s.alliances ?? []), ...(s.corps ?? []).map((c) => c.id)]);

// 同一星系、日期相交的两场算重复：连打几天的编组只收一页，组内单场不另立页
export function findOverlaps(battles) {
  const errs = [];
  const span = (b) => [toYmd(b.data.start), toYmd(b.data.end ?? b.data.start)];
  for (let i = 0; i < battles.length; i++) {
    for (let j = i + 1; j < battles.length; j++) {
      const [a, b] = [battles[i], battles[j]];
      const [as, ae] = span(a);
      const [bs, be] = span(b);
      const shared = a.data.systems.filter((s) => b.data.systems.includes(s));
      if (shared.length && as <= be && bs <= ae) {
        errs.push(`${b.file}：与 ${a.file} 同在 ${shared.join("、")}、日期重叠（${as}—${ae} / ${bs}—${be}）；同一星系连打几天的编组只收一页，组内单场不另立页`);
      }
    }
  }
  return errs;
}

// 快照战役：快照与 front matter 对得上，点名的联盟、军团都在战报里，算出来够分档
export function checkSnapshot(data, snap, people, table) {
  const stale = snapshotStale(data, snap);
  if (stale) return [`${stale}，请运行 npm run fetch 更新战报快照 ${SNAPSHOT_FILE}`];
  const errs = [];
  const st = battleStats(data, snap, people, table);
  if (!tierOf(st.total_loss)) errs.push(`战报快照算出总损失 ${formatIsk(st.total_loss)}，不足 ${TIERS.at(-1).min}B，不收入战役板块`);
  const present = battleOrgs(snap);
  for (const s of data.sides) {
    for (const id of s.alliances ?? []) {
      if (!present.has(id)) errs.push(`sides「${s.name}」：${table.alliances[id]?.name ?? table.corporations[id]?.name ?? ""}（${id}）不在战报里，检查 ID 或删掉`);
    }
  }
  return errs;
}

// fetchSnapshot(data) → 快照对象；lookupNames(ids) → ESI universe/names 结果 [{ id, name, category }]。
// 不传则只读缓存、不联网：快照缺失或过期、点名的 ID 不在名称表里时报错。查到的名字写进全站名称表 NAMES_FILE
export async function checkBattles(root, { fetchSnapshot, lookupNames } = {}) {
  const people = peopleIndex(path.join(root, "src/people"));
  const table = readNames(root);
  const before = JSON.stringify(table);
  const errors = [];
  const battles = await frontMatters(path.join(root, "src/battles"));
  const valid = [];
  for (const b of battles) {
    if (!/^[a-z0-9-]+$/.test(b.slug)) errors.push(`${b.file}：目录名只能用小写字母、数字、连字符`);
    if (b.raw == null) {
      errors.push(`${b.file}：缺少战役 Markdown 文件`);
      continue;
    }
    let parsed;
    try {
      parsed = matter(b.raw);
    } catch (e) {
      errors.push(`${b.file}：front matter 格式错误（YAML）：${e.message}`);
      continue;
    }
    const lineOffset = bodyLineOffset(b.raw, parsed.content);
    const errs = validateBattle(parsed.data, parsed.content, lineOffset, people);
    errors.push(...errs.map((e) => `${b.file}：${e}`));
    if (errs.length) continue;
    valid.push({ ...b, data: parsed.data });
  }
  errors.push(...findOverlaps(valid));
  for (const b of valid) errors.push(...checkAllianceTags(b.data.tags, table).map((e) => `${b.file}：${e}`));
  errors.push(...(await checkIds(table, valid.map((b) => b.data), lookupNames)));
  for (const b of valid.filter((b) => usesSnapshot(b.data))) {
    const dir = path.join(root, "src/battles", b.slug);
    let snap = readSnapshot(dir);
    if (snapshotStale(b.data, snap) && fetchSnapshot) {
      snap = await fetchSnapshot(b.data);
      await fs.writeFile(path.join(dir, SNAPSHOT_FILE), stringifySnapshot(snap));
    }
    errors.push(...checkSnapshot(b.data, snap, people, table).map((e) => `${b.file}：${e}`));
  }
  if (JSON.stringify(table) !== before) writeNames(root, table);
  return { count: battles.length, errors };
}

// 含中文的是地带、战型等普通标签；其余都当联盟标签，必须是名称表里某个联盟的游戏内 ticker（不用俗称、简称）
export function checkAllianceTags(tags, table) {
  const tickers = new Set(Object.values(table.alliances ?? {}).map((a) => a.ticker).filter(Boolean));
  return (tags ?? [])
    .filter((t) => !/[一-鿿]/.test(t) && !tickers.has(t))
    .map((t) => `标签 "${t}" 不是已知联盟的游戏内 ticker，联盟标签统一用 ticker`);
}

// 点名的联盟、军团 ID 不在名称表里就向 ESI 查名字，查到的写进 table
async function checkIds(table, datas, lookupNames) {
  const missingOf = () => [...new Set(datas.flatMap(orgIds))].filter((id) => !kindOf(table, id));
  let missing = missingOf();
  if (missing.length && lookupNames) {
    const kinds = { alliance: "alliances", corporation: "corporations" };
    for (const { id, name, category } of await lookupNames(missing)) {
      if (kinds[category]) table[kinds[category]][id] = { ...table[kinds[category]][id], name };
    }
    missing = missingOf();
    if (missing.length) return [`ESI 查不到这些联盟／军团 ID：${missing.join("、")}，检查 ID（查 ID 用 npm run find）`];
  }
  if (missing.length) return [`${NAMES_FILE} 缺少 ${missing.length} 个联盟／军团（${missing.join("、")}），请运行 npm run fetch`];
  return [];
}
