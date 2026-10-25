import assert from 'node:assert/strict';
import test from 'node:test';
import { validateCorporationTags } from './corporation-tags.mjs';

const corporation = { id: 42, name: 'Chaos arbiter', ticker: 'CACX' };
const other = { id: 43, name: 'Peoples Liberation Army', ticker: 'P.L.A' };
const frt = { id: 99003581, name: 'Fraternity.', ticker: 'FRT' };
const small = { id: 99015206, name: 'Celestial Palace.', ticker: 'CP.' };
const character = {
  current_corporation: { id: 42, npc: false },
  affiliation: { corporation, alliance: frt, left_at: null },
};
const check = (tags, c = character) => validateCorporationTags(tags, c, [corporation, other], [frt, small]);

test('当前主要联盟须带 ticker，军团名称及 ticker 全部停用', () => {
  assert.deepEqual(check(['FRT', '00区', '军团管理', 'CEO']), []);
  assert.match(check([])[0], /必须添加联盟标签/);
  for (const tag of ['CACX', '混沌仲裁', 'Chaos arbiter', 'P.L.A', 'Fraternity.']) {
    assert.ok(check(['FRT', tag]).length);
  }
});

test('小联盟和无联盟均不挂组织标签', () => {
  for (const alliance of [small, null]) {
    const c = { ...character, affiliation: { ...character.affiliation, alliance } };
    assert.deepEqual(check(['00区'], c), []);
    for (const tag of ['FRT', 'CP.', 'CACX']) assert.ok(check([tag], c).length);
  }
});

test('已出售角色不沿用买家当前主要联盟标签', () => {
  const sold = { ...character, id: 2120656041 };
  assert.deepEqual(check([], sold), []);
  assert.ok(check(['FRT'], sold).length);
});

test('退团、NPC 和不匹配的历史军团不能产生当前联盟标签', () => {
  for (const c of [
    { ...character, affiliation: { ...character.affiliation, left_at: '2026-01-01' } },
    { ...character, current_corporation: { id: 1000001, npc: true } },
    { ...character, current_corporation: { id: 43, npc: false } },
  ]) {
    assert.deepEqual(check([], c), []);
    assert.ok(check(['FRT'], c).length);
  }
});

test('主要联盟缺 ticker 时报错，军团缺 ticker 不影响联盟标签', () => {
  const missingAlliance = { ...character, affiliation: { ...character.affiliation, alliance: { ...frt, ticker: null } } };
  assert.match(check([], missingAlliance)[0], /缺少 ticker/);
  const missingCorp = { ...character, affiliation: { ...character.affiliation, corporation: { ...corporation, ticker: null } } };
  assert.deepEqual(check(['FRT'], missingCorp), []);
});

test('主要联盟缩写保留空格和标点，不接受俗称', () => {
  for (const alliance of [
    { id: 99004901, name: 'Snuffed Out', ticker: 'B B C' },
    { id: 1900696668, name: 'The Initiative.', ticker: 'INIT.' },
    { id: 1354830081, name: 'Goonswarm Federation', ticker: 'CONDI' },
  ]) {
    const c = { ...character, affiliation: { ...character.affiliation, alliance } };
    assert.deepEqual(check([alliance.ticker], c), []);
    assert.ok(check([alliance.name], c).length);
  }
  assert.ok(check(['FRT', '蜜蜂']).length);
});

test('军团与联盟同缩写时只允许有效的当前主要联盟', () => {
  const corp = { ...corporation, ticker: 'FRT' };
  const c = { ...character, affiliation: { ...character.affiliation, corporation: corp } };
  assert.deepEqual(validateCorporationTags(['FRT'], c, [corp], [frt]), []);
  const collision = { ...c, affiliation: { ...c.affiliation, alliance: { ...small, ticker: 'FRT' } } };
  assert.ok(validateCorporationTags(['FRT'], collision, [corp], [frt, small]).length);
});
