// 角色快照的存储格式与读取展开。
//
// 军团、联盟的名称与 ticker 全站只存一份（NAMES_FILE，按 ID 索引）；
// 每人的快照只存 ID 与时间。读取时用名称表展开成页面、校验用的完整结构：
// current_corporation、history 带 name、npc，affiliation 的军团、联盟带 name、ticker。

import fs from "node:fs";
import path from "node:path";

export const NAMES_FILE = "src/_data/entityNames.json";
export const characterFile = (id) => `${id}-id.json`;

// 刷新只替换游戏快照，人工身份与旧收录号快照原样保留。
export function mergeCharacterRecord(previous, snapshot) {
  if (previous && previous.id !== snapshot.id) throw new Error("刷新角色 ID 与原档案不一致，禁止转移身份关系");
  return {
    ...snapshot,
    ...(previous?.person ? { person: previous.person } : {}),
    identity: previous?.identity ?? { version: 1, alts: [], accounts: {} },
    ...(previous?.related_snapshots ? { related_snapshots: previous.related_snapshots } : {}),
  };
}

export function snapshotsOf(record) {
  const { person, identity, related_snapshots = [], ...main } = record;
  return [main, ...related_snapshots];
}

// 包括更换收录号前已保存的逐号历史；档案归并不丢掉旧快照。
export function readStoredCharacters(peopleDir) {
  const characters = new Map();
  for (const entry of fs.readdirSync(peopleDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    const directory = path.join(peopleDir, entry.name);
    for (const file of fs.readdirSync(directory)) {
      if (!/^\d+-id\.json$/.test(file)) continue;
      const record = JSON.parse(fs.readFileSync(path.join(directory, file), "utf8"));
      if (file !== characterFile(record.id)) throw new Error(`${file}：文件名与角色 ID 不一致`);
      for (const character of snapshotsOf(record)) {
        if (!Number.isSafeInteger(character.id) || character.id <= 0) throw new Error(`${file}：快照角色 ID 无效`);
        if (characters.has(character.id)) throw new Error(`角色 ${character.id} 的缓存文件重复`);
        characters.set(character.id, character);
      }
    }
  }
  return characters;
}

// NPC 军团的 ID 落在 1000000–1999999 区间
export const isNpcCorp = (id) => id >= 1_000_000 && id < 2_000_000;

export function readNames(root) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, NAMES_FILE), "utf8"));
  } catch (e) {
    if (e.code === "ENOENT") return { corporations: {}, alliances: {} };
    throw e;
  }
}

export function writeNames(root, names) {
  fs.writeFileSync(path.join(root, NAMES_FILE), JSON.stringify(names, null, 2) + "\n");
}

// 后来的覆盖先前的；只知道名称时保留已有的 ticker
export function mergeNames(table, names) {
  for (const kind of ["corporations", "alliances"]) {
    for (const [id, entry] of Object.entries(names[kind])) table[kind][id] = { ...table[kind][id], ...entry };
  }
  return table;
}

// 完整结构 → { snapshot（存盘用）, names（本人涉及的名称） }
export function compactSnapshot(full) {
  const names = { corporations: {}, alliances: {} };
  const corp = (id, name, ticker) => {
    const entry = (names.corporations[id] ??= {});
    entry.name = name;
    if (ticker !== undefined) entry.ticker = ticker;
  };
  corp(full.current_corporation.id, full.current_corporation.name);
  for (const h of full.history) corp(h.corporation_id, h.name);
  const aff = full.affiliation;
  if (aff) {
    corp(aff.corporation.id, aff.corporation.name, aff.corporation.ticker);
    if (aff.alliance) names.alliances[aff.alliance.id] = { name: aff.alliance.name, ticker: aff.alliance.ticker };
  }
  const snapshot = {
    id: full.id,
    name: full.name,
    birthday: full.birthday,
    corporation_id: full.current_corporation.id,
    affiliation: aff && {
      corporation_id: aff.corporation.id,
      alliance_id: aff.alliance?.id ?? null,
      left_at: aff.left_at,
    },
    history: full.history.map(({ corporation_id, start, end }) => ({ corporation_id, start, end })),
    fetched_at: full.fetched_at,
  };
  return { snapshot, names };
}

const pick = ({ name, ticker }) => ({ name, ticker: ticker ?? null });

export function expandSnapshot(snapshot, names) {
  const lookup = (kind, id) => {
    const entry = names[kind][id];
    if (!entry) throw new Error(`角色 ${snapshot.id} 的快照引用了 ${NAMES_FILE} 里没有的 ${kind} ${id}，请运行 npm run fetch -- --refresh ${snapshot.id}`);
    return entry;
  };
  const corp = (id) => ({ name: lookup("corporations", id).name, npc: isNpcCorp(id) });
  const { corporation_id, affiliation: aff, history, person, identity, related_snapshots, ...rest } = snapshot;
  return {
    ...rest,
    current_corporation: { id: corporation_id, ...corp(corporation_id) },
    affiliation: aff && {
      corporation: { id: aff.corporation_id, ...pick(lookup("corporations", aff.corporation_id)) },
      alliance: aff.alliance_id ? { id: aff.alliance_id, ...pick(lookup("alliances", aff.alliance_id)) } : null,
      left_at: aff.left_at,
    },
    history: history.map((h) => ({ corporation_id: h.corporation_id, ...corp(h.corporation_id), start: h.start, end: h.end })),
  };
}
