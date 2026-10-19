import assert from "node:assert/strict";
import test from "node:test";
import { compactSnapshot, expandSnapshot, mergeNames } from "./character-snapshot.mjs";

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
