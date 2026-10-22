import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { battleArchiveFile, readBattleArchive, readBattleDocument, stringifyBattleArchive, writeBattleSnapshot } from "./battle-archive.mjs";

const snapshot = { sources: ["https://br.evetools.org/related/30003086/202601131300"], systems: ["Sahtogas"], systemIds: [30003086], window: null, teams: [["1"], ["2"]], pilots: { 10: [500, 1] }, losses: [[1, 10, 500, 1, 1e11]], hits: [] };
function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), "battle-archive-")), dir = path.join(root, "example");
  mkdirSync(dir);
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const battle = { title: "测试之战", sides: [{ name: "甲方", organizations: [1, 500], emblem: 1 }, { name: "乙方", organizations: [2], emblem: 2 }] };
  writeFileSync(battleArchiveFile(dir), stringifyBattleArchive({ battle, br: snapshot }));
  writeFileSync(path.join(dir, "example.md"), "正文保持原样。\n");
  return { dir, battle };
}

test("同名 JSON 同时读取人工配置和快照，正文无需 front matter", t => {
  const { dir, battle } = fixture(t);
  const doc = readBattleDocument(path.join(dir, "example.md"));
  assert.deepEqual(doc.data, battle);
  assert.deepEqual(doc.archive.br, snapshot);
  assert.equal(doc.content, "正文保持原样。\n");
  assert.deepEqual(JSON.parse(stringifyBattleArchive({ battle, br: null })), { battle, br: null });
});

test("快照刷新保留最近修改的人工分方、主标与配置，且不新建 br.json", t => {
  const { dir } = fixture(t);
  const latest = readBattleArchive(dir);
  latest.battle.sides[0].organizations = [500];
  latest.battle.sides[0].emblem = 500;
  latest.battle.sides[0].note = "军团单独归方，依据见素材";
  writeFileSync(battleArchiveFile(dir), stringifyBattleArchive(latest));
  const updated = { ...snapshot, losses: [[2, 10, 500, 1, 2e11]] };
  writeBattleSnapshot(dir, updated);
  assert.deepEqual(readBattleArchive(dir), { battle: latest.battle, br: updated });
  assert.throws(() => readFileSync(path.join(dir, "br.json")), /ENOENT/);
});

test("拒绝重复 front matter、旧归方数组、错误包结构和损坏 JSON", t => {
  const { dir, battle } = fixture(t), file = battleArchiveFile(dir);
  writeFileSync(path.join(dir, "example.md"), "---\ntitle: 重复标题\n---\n正文\n");
  assert.throws(() => readBattleDocument(path.join(dir, "example.md")), /front matter 重复维护/);
  writeFileSync(file, JSON.stringify({ battle: { ...battle, sides: [{ alliances: [1] }] }, br: snapshot }));
  assert.throws(() => readBattleArchive(dir), /统一为 organizations/);
  for (const value of [{ battle }, { battle, br: [] }, { battle, br: null, unrelated: true }, []]) {
    writeFileSync(file, JSON.stringify(value));
    assert.throws(() => readBattleArchive(dir), /必须是/);
  }
  writeFileSync(file, "{bad");
  assert.throws(() => readBattleArchive(dir), /example.json/);
});
