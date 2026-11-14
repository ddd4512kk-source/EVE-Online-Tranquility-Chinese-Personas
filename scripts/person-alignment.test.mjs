import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import nunjucks from 'nunjucks';
import { readPersonDocument } from './person-document.mjs';
import { ALIGNMENTS, alignmentCounts, alignmentMatches, alignmentSelection, personAlignment, selectionLabel, validatePersonAlignment } from './person-alignment.mjs';

const includes = path.resolve(import.meta.dirname, '../src/_includes');
const render = (name, al) => new nunjucks.Environment(new nunjucks.FileSystemLoader(includes), { autoescape: true })
  .renderString(`{% from "person-alignment.njk" import ${name} %}{{ ${name}(al) }}`, { al });

test('九格代码、全称与短名按善恶分行、守序／混乱分列', () => {
  assert.deepEqual(ALIGNMENTS.map(a => a.code), ['LG', 'NG', 'CG', 'LN', 'NN', 'CN', 'LE', 'NE', 'CE']);
  assert.deepEqual(ALIGNMENTS.map(a => a.label), ['守序善良', '中立善良', '混乱善良', '守序中立', '绝对中立', '混乱中立', '守序邪恶', '中立邪恶', '混乱邪恶']);
  assert.deepEqual(ALIGNMENTS.map(a => a.short), ['守善', '中善', '混善', '守中', '绝中', '混中', '守恶', '中恶', '混恶']);
});

test('合法记录通过；非法代码、空判词、超长判词与未知字段被拒绝', () => {
  assert.deepEqual(validatePersonAlignment(undefined), []);
  assert.deepEqual(validatePersonAlignment({ code: 'LN' }), []);
  assert.deepEqual(validatePersonAlignment({ code: 'CE', note: '三十字以内的判词。' }), []);
  assert.match(validatePersonAlignment({ code: 'ce' }).join(), /alignment\.code/);
  assert.match(validatePersonAlignment({ code: 'XG' }).join(), /"XG"/);
  assert.match(validatePersonAlignment({ code: 'CE', note: ' ' }).join(), /不能为空/);
  assert.match(validatePersonAlignment({ code: 'CE', note: '字'.repeat(41) }).join(), /41 字/);
  assert.equal(validatePersonAlignment({ code: 'CE', note: '字'.repeat(40) }).length, 0);
  assert.match(validatePersonAlignment({ code: 'CE', why: '多余' }).join(), /未知字段 why/);
  assert.match(validatePersonAlignment('CE').join(), /必须是对象/);
});

test('展示模型高亮本格；没有阵营为 null', () => {
  assert.equal(personAlignment(undefined), null);
  const al = personAlignment({ code: 'CE', note: '判词' });
  assert.equal(al.label, '混乱邪恶');
  assert.equal(al.title, '阵营：混乱邪恶。判词');
  assert.deepEqual(al.cells.map(c => c.on), [false, false, false, false, false, false, false, false, true]);
  assert.equal(personAlignment({ code: 'LN' }).title, '阵营：守序中立');
  assert.throws(() => personAlignment({ code: 'XX' }));
});

test('筛选值支持单格、整列与整行，计数按同一规则', () => {
  for (const ok of ['CE', 'L*', '*E']) assert.equal(alignmentSelection(ok), true);
  for (const bad of ['**', 'ce', 'X*', 'LGG', '']) assert.equal(alignmentSelection(bad), false);
  assert.equal(alignmentMatches('CE', 'C*'), true);
  assert.equal(alignmentMatches('CE', '*G'), false);
  assert.equal(alignmentMatches(undefined, '*E'), false);
  assert.equal(alignmentMatches(undefined, ''), true);
  assert.deepEqual(['CE', 'L*', '*E', 'oops'].map(selectionLabel), ['混乱邪恶', '守序', '邪恶', '']);
  const counts = alignmentCounts(['CE', 'CE', 'LG', undefined]);
  assert.equal(counts.total, 3);
  assert.equal(counts.cells.find(c => c.code === 'CE').count, 2);
  assert.deepEqual(counts.laws.map(l => l.count), [1, 0, 2]);
  assert.deepEqual(counts.morals.map(m => m.count), [1, 0, 2]);
  assert.equal(alignmentCounts([]).total, 0);
});

test('挂牌与资料行：悬停文字、读屏文字、搜索忽略', () => {
  const al = personAlignment({ code: 'LG', note: '规矩人。' });
  const tab = render('alignTab', al);
  assert.match(tab, /class="align-tab" title="阵营：守序善良。规矩人。" data-pagefind-ignore/);
  assert.equal((tab.match(/<rect /g) ?? []).length, 9);
  assert.equal((tab.match(/class="on"/g) ?? []).length, 1);
  assert.match(tab, /<span>守序善良<\/span>/);
  const fact = render('alignFact', al);
  assert.match(fact, /data-align="LG"/);
  assert.match(fact, /role="img" aria-label="九宫格阵营：守序善良"/);
  assert.match(fact, /<span data-m="G" class="on">守善<\/span>/);
  assert.match(fact, /align-note">规矩人。/);
  assert.doesNotMatch(render('alignFact', personAlignment({ code: 'NN' })), /align-note/);
});

test('人物档案校验阵营并指出档案', t => {
  const dir = mkdtempSync(path.join(tmpdir(), 'alignment-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const person = path.join(dir, 'demo');
  mkdirSync(person);
  writeFileSync(path.join(person, 'demo.md'), '正文\n');
  const put = alignment => writeFileSync(path.join(person, '42-id.json'), JSON.stringify({ id: 42, name: '甲', person: { alignment } }));
  put({ code: 'NE' });
  assert.deepEqual(readPersonDocument(path.join(person, 'demo.md')).data.alignment, { code: 'NE' });
  put({ code: 'ne' });
  assert.throws(() => readPersonDocument(path.join(person, 'demo.md')), /42-id\.json：alignment\.code/);
});
