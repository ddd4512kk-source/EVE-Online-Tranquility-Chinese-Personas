import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { compactSnapshot, expandSnapshot, mergeCharacterRecord, mergeNames, readStoredCharacters, snapshotsOf } from "./character-snapshot.mjs";

const full = {
  id: 1,
  name: "Pilot",
  birthday: "2019-01-04T05:58:50Z",
  current_corporation: { id: 1000168, name: "Federal Navy Academy", npc: true },
  affiliation: {
    corporation: { id: 98190062, name: "Peoples Liberation Army", ticker: "P.L.A" },
    alliance: { id: 1354830081, name: "Goonswarm Federation", ticker: "CONDI" },
    left_at: "2022-01-27T09:16:00Z",
  },
  history: [
    { corporation_id: 98190062, name: "Peoples Liberation Army", npc: false, start: "2021-08-08T00:52:00Z", end: "2022-01-27T09:16:00Z" },
    { corporation_id: 1000168, name: "Federal Navy Academy", npc: true, start: "2022-01-27T09:16:00Z", end: null },
  ],
  fetched_at: "2026-10-19",
};

test("快照只存 ID，名称进全站表，展开后与原结构一致", () => {
  const { snapshot, names } = compactSnapshot(full);
  assert.ok(!JSON.stringify(snapshot).includes("Peoples Liberation Army"));
  const table = mergeNames({ corporations: {}, alliances: {} }, names);
  assert.deepEqual(expandSnapshot(snapshot, table), full);
});

test("只知道名称时不冲掉已有 ticker；名称表缺项直接报错", () => {
  const table = { corporations: { 98190062: { name: "Old", ticker: "P.L.A" } }, alliances: {} };
  mergeNames(table, { corporations: { 98190062: { name: "Peoples Liberation Army" } }, alliances: {} });
  assert.deepEqual(table.corporations[98190062], { name: "Peoples Liberation Army", ticker: "P.L.A" });
  const { snapshot } = compactSnapshot(full);
  assert.throws(() => expandSnapshot(snapshot, table), /entityNames\.json/);
});

test("刷新替换游戏字段，完整保留人工关系与旧号快照，禁止跨 ID 刷新", () => {
  const { snapshot, names } = compactSnapshot(full);
  const identity = { version: 1, alts: [{ id: 42, sources: ["materials.md"] }], accounts: { tieba: [{ uid: "123", name: "账号" }] } };
  const previous = { ...snapshot, person: { cn_name: "人物名", aliases: ["别称"], tags: ["00区"], epithet: "锐评" }, identity, related_snapshots: [{ ...snapshot, id: 42 }] };
  const fresh = { ...snapshot, name: "新名字", fetched_at: "2026-10-21" };
  const saved = mergeCharacterRecord(previous, fresh);
  assert.deepEqual(saved.identity, identity);
  assert.deepEqual(saved.person, previous.person);
  assert.deepEqual(saved.related_snapshots, previous.related_snapshots);
  assert.equal(saved.name, "新名字");
  assert.equal(saved.fetched_at, "2026-10-21");
  assert.deepEqual(expandSnapshot(saved, names), { ...full, name: "新名字", fetched_at: "2026-10-21" });
  assert.deepEqual(snapshotsOf(saved).map(s => s.id), [full.id, 42]);
  assert.throws(() => mergeCharacterRecord(previous, { ...fresh, id: 99 }), /ID.*不一致/);
  assert.deepEqual(mergeCharacterRecord(null, fresh).identity, { version: 1, alts: [], accounts: {} });
});

test("从合并档案读取逐号缓存，旧号历史不丢失且重复 ID 报错", (t) => {
  const directory = mkdtempSync(path.join(tmpdir(), "character-record-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const person = path.join(directory, "a");
  mkdirSync(person);
  const { snapshot } = compactSnapshot(full);
  const record = { ...snapshot, identity: { version: 1 }, related_snapshots: [{ ...snapshot, id: 42 }] };
  const file = path.join(person, `${full.id}-id.json`);
  writeFileSync(file, JSON.stringify(record));
  const stored = readStoredCharacters(directory);
  assert.equal(stored.size, 2);
  assert.equal(stored.get(42).name, full.name);
  assert.equal(stored.get(full.id).identity, undefined);
  record.related_snapshots.push({ ...snapshot });
  writeFileSync(file, JSON.stringify(record));
  assert.throws(() => readStoredCharacters(directory), /缓存文件重复/);
});
