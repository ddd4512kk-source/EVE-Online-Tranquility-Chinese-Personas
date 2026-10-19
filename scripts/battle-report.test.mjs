import assert from "node:assert/strict";
import test from "node:test";
import {
  battleOrgs,
  brApiUrl,
  compactReport,
  entityKey,
  parseWindow,
  snapshotStale,
  stringifySnapshot,
} from "./battle-report.mjs";

test("只认 br.evetools、killmail.app 战报网址，转成接口地址", () => {
  assert.equal(brApiUrl("https://killmail.app/br/GxhFDiNEWB-atioth-2026-04-06"), "https://killmail.app/api/battle-reports/GxhFDiNEWB");
  assert.equal(brApiUrl("https://killmail.app/br/GxhFDiNEWB"), "https://killmail.app/api/battle-reports/GxhFDiNEWB");
  assert.equal(brApiUrl("https://killmail.app/kill/134540670"), null);
  assert.equal(brApiUrl("https://br.evetools.org/br/6851ec3687003700128d432f"), "https://br.evetools.org/newapi/br/composition/6851ec3687003700128d432f");
  assert.equal(brApiUrl("https://br.evetools.org/related/30004759/202010060300/"), "https://br.evetools.org/newapi/br/related/30004759/202010060300");
  assert.equal(brApiUrl("https://zkillboard.com/related/30004759/202010060300/"), null);
  assert.equal(brApiUrl("https://br.evetools.org/br/xyz"), null);
});

test("时间窗按 UTC 解析，格式不对或起晚于止返回 null", () => {
  assert.deepEqual(parseWindow(["2020-10-06 02:59", "2020-10-07 06:00"]), [Date.UTC(2020, 9, 6, 2, 59), Date.UTC(2020, 9, 7, 6, 0)]);
  assert.equal(parseWindow(["2020-10-07 06:00", "2020-10-06 02:59"]), null);
  assert.equal(parseWindow(["2020-10-06", "2020-10-07"]), null);
  assert.equal(parseWindow("2020-10-06 02:59"), null);
});

test("NPC 军团角色按人分开，联盟与无联盟军团按组织记", () => {
  assert.equal(entityKey(98000001, 99000001, 5), "a:99000001");
  assert.equal(entityKey(98000001, 0, 5), "c:98000001");
  assert.equal(entityKey(1000125, 0, 5), "p:5");
  assert.equal(entityKey(1000125, 0), "c:1000125");
});

const km = (id, system, time, victim, attackers, totalValue) => ({ id, system, time, victim, attackers, totalValue });
const raw = {
  status: "success",
  teams: [[1, "corp:7"], [2]],
  relateds: [{ kms: [
    km(2, 30000001, 2000, { char: 11, corp: 600, ally: 2 }, [{ char: 10, corp: 500, ally: 1 }, { char: 12, corp: 500, ally: 1 }], 2e11),
    km(1, 30000001, 1000, { char: 10, corp: 500, ally: 1 }, [{ char: 11, corp: 600, ally: 2 }, { char: -1 }], 1e9),
    km(3, 30000002, 1500, { char: 13, corp: 700, ally: 3 }, [{ char: 11, corp: 600, ally: 2 }], 5e9),
    km(4, 30000001, 9000, { char: 14, corp: 700, ally: 3 }, [{ char: 11, corp: 600, ally: 2 }], 7e9),
  ] }],
};

test("精简战报：按星系、时间窗筛，人、损失、交火、分队都留", () => {
  const r = compactReport([raw, raw], [30000001], [0, 5000]);
  assert.deepEqual(r.teams, [["1", "corp:7"], ["2"], ["1", "corp:7"], ["2"]]);
  assert.deepEqual(r.pilots, { 10: [500, 1], 11: [600, 2], 12: [500, 1] });
  assert.deepEqual(r.losses, [[1, 10, 500, 1, 1e9], [2, 11, 600, 2, 2e11]]);
  // 同一 KM 同一组织的多名攻击者只记一次
  assert.deepEqual(r.hits, [["a:2", "a:1", 1], ["a:1", "a:2", 1]]);
  assert.equal(compactReport([raw]).losses.length, 4);
  assert.throws(() => compactReport([{ result: "error" }]), /战报接口返回 error/);
});

test("killmail.app 战报换成同一写法，时间窗按 UTC 时间", () => {
  const kmapp = { killmails: [
    { id: 5, solar_system_id: 30000001, created_at: "2026-04-06T14:01:23Z", character_id: 11, corporation_id: 600, alliance_id: 2, isk_value: 3e9,
      attackers: [{ character_id: 10, corporation_id: 500, alliance_id: 1 }, { corporation_id: 500, alliance_id: 1 }] },
    { id: 6, solar_system_id: 30000001, created_at: "2026-04-09T00:00:00Z", character_id: 12, corporation_id: 500, alliance_id: 1, isk_value: 1e9, attackers: [] },
  ], side_overrides: [] };
  const r = compactReport([kmapp], [30000001], parseWindow(["2026-04-06 14:00", "2026-04-08 15:00"]));
  assert.deepEqual(r.pilots, { 10: [500, 1], 11: [600, 2] });
  assert.deepEqual(r.losses, [[5, 11, 600, 2, 3e9]]);
  assert.deepEqual(r.hits, [["a:1", "a:2", 1]]);
  assert.deepEqual(r.teams, []);
});

const data = {
  systems: ["X"],
  loss_source: "https://br.evetools.org/br/6851ec3687003700128d432f",
  sides: [{ name: "甲方", alliances: ["A"] }, { name: "乙方", alliances: ["B"] }],
  corps: ["华人军团"],
};
const snap = { sources: [data.loss_source], systems: ["X"], systemIds: [1], window: null };

test("来源、星系、时间窗改了就算过期", () => {
  assert.equal(snapshotStale(data, null), "缺少战报快照");
  assert.equal(snapshotStale(data, snap), null);
  assert.equal(snapshotStale({ ...data, loss_source: [data.loss_source, data.loss_source] }, snap), "loss_source 改过");
  assert.equal(snapshotStale({ ...data, systems: ["Y"] }, snap), "systems 改过");
  assert.equal(snapshotStale({ ...data, window: ["2020-01-01 00:00", "2020-01-02 00:00"] }, snap), "window 改过");
});

test("本场出场的组织：参战与损失里的军团、联盟，不含无联盟的 0", () => {
  const s = { pilots: { 10: [500, 1], 11: [600, 0] }, losses: [[1, 12, 700, 2, 1]] };
  assert.deepEqual([...battleOrgs(s)].sort((a, b) => a - b), [1, 2, 500, 600, 700]);
});

test("快照序列化可读回", () => {
  const s = { ...snap, ...compactReport([raw]) };
  assert.deepEqual(JSON.parse(stringifySnapshot(s)), s);
});
