import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import { parseGlossary, glossaryEntries, glossaryLinks, queryGlossary, run, termId } from './glossary.mjs';

const record = (patch = {}) => ({ term: 'Test', meaning: '测试', avoid: '', note: '说明文字', status: '待复核', kind: 'term', links: [], ...patch });
const parse = entries => parseGlossary({ version: 1, entries });
const md = new MarkdownIt().use(glossaryLinks);
const links = html => [...html.matchAll(/data-glossary-id="([^"]+)"[^>]*>(.*?)<\/a>/g)].map(m => ({ id: m[1], word: m[2] }));

test('命令行帮助直接输出文本，帮助参数不能掩盖查询或校验参数', () => {
  assert.equal(typeof run(['--help']), 'string');
  assert.throws(() => run(['Monitor', '--help']), /单独使用/);
  assert.throws(() => run(['--help', '--check']), /单独使用/);
  const output = execFileSync(process.execPath, [fileURLToPath(new URL('./glossary.mjs', import.meta.url)), '--help'], { encoding: 'utf8' });
  assert.ok(output.includes('npm run glossary --'));
  assert.throws(() => JSON.parse(output), SyntaxError);
});

test('JSON保留竖线和上下文；类别与是否标注不由备注或确认状态推定，锚点沿用原算法', () => {
  const input = record({ term: 'Test🚀', note: '引用 `a|b`，不是表格字段', kind: 'ship', links: [{ word: '测试船' }] });
  const [entry] = parse([input]);
  assert.equal(entry.note, '引用 a|b，不是表格字段');
  assert.equal(input.note, '引用 `a|b`，不是表格字段');
  assert.equal(entry.id, 'term-54-65-73-74-1f680');
  const html = new MarkdownIt().use(glossaryLinks, { entries: [entry] }).render('测试船 Test🚀');
  assert.deepEqual(links(html), [{ id: entry.id, word: '测试船' }]);
  assert.equal(links(new MarkdownIt().use(glossaryLinks, { entries: parse([record({ note: '舰船名；旧说明', kind: 'ship' })]) }).render('测试')).length, 0);
});

test('拒绝重复词条、争用匹配文字和无效字段，保留明确错误', () => {
  assert.throws(() => parseGlossary({ version: 2, entries: [record()] }), /version/);
  assert.throws(() => parse([record(), record()]), /重复词条/);
  assert.throws(() => parse([record({ links: [{ word: '相同' }] }), record({ term: 'Other', links: [{ word: '相同' }] })]), /重复归属/);
  for (const patch of [{ status: '已读' }, { kind: 'guessed' }, { meaning: '' }, { avoid: null }, { links: null }, { link_note: '' }, { typo: true }]) {
    assert.throws(() => parse([record(patch)]), /术语档案/);
  }
  for (const link of [{ word: '' }, { word: ' word' }, { word: 'word', exclude_suffixes: [''] }, { word: 'word', exclude_suffixes: ['船', '船'] }, { word: 'word', typo: true }]) {
    assert.throws(() => parse([record({ links: [link] })]), /术语档案/);
  }
});

test('保留最长匹配、英文边界，以及原有词条目标', () => {
  const actual = links(md.render('卖水果 水果 大鱼 Monitor 监视者 solo Solo xMonitor Monitor2'));
  assert.deepEqual(actual.map(l => l.word), ['卖水果', '水果', '大鱼', 'Monitor', '监视者', 'solo', 'Solo']);
  assert.equal(actual.find(l => l.word === '大鱼').id, termId('大鱼'));
  assert.equal(actual.find(l => l.word === '监视者').id, termId('Monitor'));
  assert.deepEqual(links(md.render('救赎')), [{ id: termId('Absolution'), word: '救赎' }]);
});

test('人物外号、组织名后缀和泡泡船不误标；船名独立出现仍可标注', () => {
  const html = md.render('台风 黑鸦 黑鸟 万古 复仇 凤凰城 凤凰联盟群 银鹰骑士团 银鹰军团 冥府之光 泡泡船 泡泡手 泡泡仙人 泡泡金仙\n\n凤凰 银鹰 冥府 泡泡');
  assert.deepEqual(links(html).map(l => l.word), ['凤凰', '银鹰', '泡泡']);
  // Hel's existing entry is displayed without automatic linking, even on its own.
  assert.equal(glossaryEntries.find(e => e.term === 'Hel').links.length, 0);
});

test('不改标题、引用、已有链接或代码，不把原文术语换成中文', () => {
  const input = '# Monitor\n\n> Monitor\n\n[Monitor](https://example.com) `Monitor`\n\n```\nMonitor\n```\n\nMonitor';
  const html = md.render(input);
  assert.equal(links(html).length, 1);
  assert.match(html, /<h1>Monitor<\/h1>/);
  assert.match(html, /<code>Monitor<\/code>/);
  assert.match(html, /href="https:\/\/example.com">Monitor<\/a>/);
  assert.equal(links(html)[0].word, 'Monitor');
});

test('查询支持中文、原词和匹配写法，按类别／状态筛选分页，无条件不输出全表', () => {
  assert.deepEqual(run([]).records, []);
  assert.equal(run(['monitor', '--kind', 'ship']).records[0].term, 'Monitor');
  assert.equal(run(['泡泡']).records.some(e => e.term === 'bubble / warp disruption bubble'), true);
  const first = run(['--status', '待复核', '--limit', '1']);
  const second = run(['--status', '待复核', '--limit', '1', '--offset', '1']);
  assert.equal(first.total, second.total);
  assert.notEqual(first.records[0].term, second.records[0].term);
  assert.equal(run(['--check']).valid, true);
  assert.equal(run(['--check']).entries, glossaryEntries.length);
  assert.throws(() => run(['--check', 'Monitor']), /不与/);
  assert.throws(() => run(['--status']), /缺少值/);
  assert.throws(() => run(['--unknown']), /未知选项/);
  assert.throws(() => queryGlossary(glossaryEntries, { status: '已读' }), /status/);
  assert.throws(() => run(['--limit', '0']), /正整数/);
  assert.throws(() => run(['--offset', '-1']), /非负整数/);
});
