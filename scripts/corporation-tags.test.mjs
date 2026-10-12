import assert from "node:assert/strict";
import test from "node:test";
import { validateCorporationTags } from "./corporation-tags.mjs";

const corporation = { id: 42, name: "Chaos arbiter", ticker: "CACX" };
const other = { id: 43, name: "Peoples Liberation Army", ticker: "P.L.A" };
const character = {
  current_corporation: { id: 42, npc: false },
  affiliation: { corporation, alliance: { ticker: "FRT" }, left_at: null },
};
const check = (tags, c = character) => validateCorporationTags(tags, c, [corporation, other]);

test("有联盟必须同时带当前军团 ticker，不接受旧称或其他军团", () => {
  assert.deepEqual(check(["FRT", "CACX", "00区"]), []);
  assert.match(check(["FRT"])[0], /必须添加/);
  for (const tag of ["混沌仲裁", "Chaos arbiter", "P.L.A"]) {
    assert.ok(check(["CACX", tag]).length);
  }
});

test("ticker 的空格与标点原样保留", () => {
  const corp = { id: 42, name: "Thunders Claw Fleet", ticker: "T C F" };
  const c = { ...character, affiliation: { ...character.affiliation, corporation: corp } };
  assert.deepEqual(validateCorporationTags(["T C F"], c, [corp]), []);
  assert.ok(validateCorporationTags(["TCF"], c, [corp]).length);
  const numeric = { ...corp, ticker: "7959" };
  assert.deepEqual(validateCorporationTags(["7959"], {
    ...c, affiliation: { ...c.affiliation, corporation: numeric },
  }, [numeric]), []);
});

test("退团、NPC 和不匹配的历史展示军团不能产生当前军团标签", () => {
  for (const c of [
    { ...character, affiliation: { ...character.affiliation, left_at: "2026-01-01" } },
    { ...character, current_corporation: { id: 1000001, npc: true } },
    { ...character, current_corporation: { id: 43, npc: false } },
  ]) {
    assert.deepEqual(check([], c), []);
    assert.ok(check(["CACX"], c).length);
  }
});

test("无联盟可带当前军团，有联盟缺 ticker 时明确报错", () => {
  const c = { ...character, affiliation: { ...character.affiliation, alliance: null } };
  assert.deepEqual(check([], c), []);
  assert.deepEqual(check(["CACX"], c), []);
  const missing = { ...character, affiliation: {
    ...character.affiliation, corporation: { ...corporation, ticker: null },
  } };
  assert.match(check([], missing)[0], /缺少 ticker/);
});

test("军团与联盟同缩写时不误删当前联盟标签", () => {
  const c = { ...character, affiliation: { ...character.affiliation, alliance: { ticker: "P.L.A" } } };
  assert.deepEqual(check(["CACX", "P.L.A"], c), []);
});
