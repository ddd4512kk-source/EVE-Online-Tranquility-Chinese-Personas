import assert from 'node:assert/strict';
import test from 'node:test';
import { applyExceptions, findEnglishNames, gameNames, maskQuoted, validateExceptions } from './game-names.mjs';

const names = { Keepstar: '星城', Nyx: '夜神', Turnur: '图尔鲁尔', Tar: '塔尔', 'Moros Navy Issue': '莫洛级海军型', Moros: '莫洛' };
const terms = text => findEnglishNames(text, names).map(item => item.term);

test('gameNames 收舰船、建筑和星系，不收其他术语', () => {
  const entries = [
    { term: 'Nyx', meaning: '夜神', kind: 'ship' },
    { term: 'Keepstar', meaning: '星城', kind: 'structure' },
    { term: 'Cyno', meaning: '诱导', kind: 'term' },
    { term: '黑隐', meaning: '隐形', kind: 'ship' },
  ];
  assert.deepEqual(gameNames(entries, { Turnur: '图尔鲁尔' }), { Turnur: '图尔鲁尔', Nyx: '夜神', Keepstar: '星城' });
});

test('gameNames 收星域；舰船与星域同名时两个中文都给', () => {
  const entries = [{ term: 'Curse', meaning: '诅咒', kind: 'ship' }];
  assert.deepEqual(gameNames(entries, {}, { Curse: '柯尔斯', Delve: '绝地' }), { Curse: '诅咒／柯尔斯', Delve: '绝地' });
});

test('报出正文的英文专名，附行号和中文', () => {
  assert.deepEqual(findEnglishNames('开头\n他在 Turnur 拆了 Keepstar。', names), [
    { line: 2, term: 'Turnur', zh: '图尔鲁尔' },
    { line: 2, term: 'Keepstar', zh: '星城' },
  ]);
});

test('链接文字要查，链接地址不查', () => {
  assert.deepEqual(terms('[Nyx](https://example.com/Keepstar/)'), ['Nyx']);
  assert.deepEqual(terms('[夜神](https://example.com/Nyx/) https://example.com/Turnur'), []);
});

test('紧贴数字的专名也要查', () => {
  assert.deepEqual(terms('Turnur 2026'), ['Turnur']);
  assert.deepEqual(terms('Keepstar3'), []);
});

test('多词专名按最长匹配', () => {
  assert.deepEqual(terms('一条 Moros Navy Issue'), ['Moros Navy Issue']);
});

test('引用、引号、书名号、代码和引用块保留原文', () => {
  assert.deepEqual(terms('他说“Nyx 炸了”，《Keepstar 之死》，`Turnur`。\n> 某人 > Keepstar 没了'), []);
  assert.equal(maskQuoted('“Nyx”').length, 5);
});

test('front matter 不查', () => {
  assert.deepEqual(terms('---\ntitle: Nyx\n---\n正文 Nyx'), ['Nyx']);
});

test('紧邻英文词的是角色名或军团名，紧邻全大写缩写的不算', () => {
  assert.deepEqual(terms('Nyx Pilot 和 Black Nyx，还有 El’Tar'), []);
  assert.deepEqual(terms('TEST Nyx'), ['Nyx']);
});

test('例外只放过登记的文件和词，失效即报', () => {
  const found = [{ line: 1, term: 'Nyx', zh: '夜神' }, { line: 2, term: 'Turnur', zh: '图尔鲁尔' }];
  const exceptions = { files: { 'a.md': { Nyx: '外号', Keepstar: '已删' } } };
  assert.deepEqual(applyExceptions('a.md', found, exceptions), { kept: [found[1]], stale: ['Keepstar'] });
  assert.deepEqual(applyExceptions('b.md', found, exceptions), { kept: found, stale: [] });
});

test('例外缺原因报错', () => {
  assert.deepEqual(validateExceptions({ files: { 'a.md': { Nyx: '外号' } } }), []);
  assert.equal(validateExceptions({ files: { 'a.md': { Nyx: ' ' } } }).length, 1);
});
