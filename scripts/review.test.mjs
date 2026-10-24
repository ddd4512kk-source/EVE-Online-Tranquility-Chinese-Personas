import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { run, ruleText, inventory, parseAdditionLog } from './review.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'review-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (file, value) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), typeof value === 'string' ? value : JSON.stringify(value));
  };
  put('docs/rules.md', '# 规则\n## 战斗\n战斗规范\n## 样式\n颜色');
  put('docs/review-features.json', { combat: { kinds: ['person'], pattern: '指挥|战斗', rules: [{ file: 'docs/rules.md', heading: '## 战斗' }] }, battle: { kinds: ['battle'], pattern: '军团', rules: [{ file: 'docs/rules.md', heading: '## 样式' }] } });
  put('src/people/demo/demo.md', '工业人物。\n::: 红料 工业\n做工业。\n:::\n');
  put('src/people/demo/42-id.json', { id: 42, name: '甲', person: {}, identity: { alts: [{ id: 43, name: '小号' }] } });
  put('src/people/demo/materials-demo.md', '# 素材\n## 画像\n[共享](../../../docs/sources/shared.md)');
  put('docs/sources/shared.md', '# 共享\n[同源](shared.md)\n事件');
  put('src/people/other/other.md', '另一人。');
  put('src/people/other/44-id.json', { id: 44, person: {} });
  put('src/battles/test/test.md', '甲的朋友在指挥。[/p/44/](/p/44/)');
  put('src/battles/test/test.json', { battle: { title: '甲战', start: '2026-01-01', sides: [] }, br: { pilots: { 43: [99, 88] }, losses: [[123, 43, 99, 88, 100]] } });
  const call = (...args) => run(root, args);
  const mark = (status = 'reviewed') => call('mark', 'person:demo', '--status', status, '--note', '人工核读后的结论', '--evidence', 'src/people/demo/materials-demo.md');
  return { root, put, call, mark };
}

test('help does not read a repository; CLI fails closed', () => {
  assert.match(run('/missing', ['--help']), /离线增量/);
  assert.throws(() => run('/missing', ['--help', 'x']));
  assert.throws(() => run('/missing', ['list', '--wat', 'x']), /无效参数/);
});
test('shortlist finds alt participation, keeps mentions distinct, never infers reviewed', t => {
  const { call } = fixture(t);
  assert.deepEqual(call().counts, { person: 2, battle: 1 });
  const result = call('list', '--signal', 'battle-without-narrative');
  assert.equal(result.total, 1);
  assert.equal(result.records[0].key, 'person:demo');
  assert.equal(result.records[0].state, 'unreviewed');
  const card = call('card', 'person:demo');
  assert.deepEqual(card.battles.records[0].characters, [{ id: 43, via: ['pilot', 'loss'] }]);
  assert.deepEqual(card.sharedSources, ['docs/sources/shared.md']);
  assert.equal(call('card', 'person:other').battles.records[0].characters[0].via[0], 'mention');
  assert.equal(call('list', '--feature', 'battle').records[0].key, 'battle:test');
});
test('receipts become stale on own prose, alts, shared evidence and newly linked battles', t => {
  for (const change of ['body', 'identity', 'source', 'battle']) {
    const { put, call, mark } = fixture(t);
    mark();
    assert.equal(call('card', 'person:demo').state, 'reviewed');
    if (change === 'body') put('src/people/demo/demo.md', '增加指挥画像。');
    if (change === 'identity') put('src/people/demo/42-id.json', { id: 42, person: {}, identity: { alts: [] } });
    if (change === 'source') put('docs/sources/shared.md', '# 共享\n新证据');
    if (change === 'battle') {
      put('src/battles/new/new.md', '新战役');
      put('src/battles/new/new.json', { battle: { title: '新战役' }, br: { pilots: { 42: [99, 88] }, losses: [] } });
    }
    assert.equal(call('card', 'person:demo').state, 'stale', change);
  }
});
test('unrelated prose and rule sections do not invalidate a review; selected rule edits do', t => {
  const { put, call, mark } = fixture(t);
  mark();
  put('src/people/other/other.md', '改了另一人。');
  put('docs/rules.md', '# 规则\n## 战斗\n战斗规范\n## 样式\n改颜色');
  assert.equal(call('card', 'person:demo').state, 'reviewed');
  assert.equal(call('impact', '--files', 'docs/rules.md').records.some(r => r.key === 'person:demo'), false);
  put('docs/rules.md', '# 规则\n## 战斗\n新的战斗规范\n## 样式\n改颜色');
  assert.equal(call('card', 'person:demo').state, 'stale');
  assert.equal(call('impact', '--files', 'docs/rules.md').records.some(r => r.key === 'person:demo'), true);
});
test('impact finds shared sources, alts, and deleted formerly associated battles', t => {
  const { root, call, mark } = fixture(t);
  mark('needs-work');
  assert.equal(call('impact', '--files', 'docs/sources/shared.md').total, 1);
  assert.equal(call('impact', '--files', 'src/people/demo/42-id.json').total, 1);
  fs.rmSync(path.join(root, 'src/battles/test'), { recursive: true });
  assert.equal(call('impact', '--files', 'src/battles/test/test.json').records[0].state, 'stale');
});
test('paging and excerpts are bounded; invalid/escaped paths and fake evidence are rejected', t => {
  const { call, put, mark } = fixture(t);
  assert.equal(call('list', '--limit', '1', '--offset', '1').records.length, 1);
  assert.throws(() => call('list', '--limit', '100'));
  assert.throws(() => call('read', 'person:demo', '--file', 'body', '--lines', '81'));
  assert.throws(() => call('mark', 'person:demo', '--status', 'reviewed', '--note', '没证据'));
  assert.throws(() => call('mark', 'person:demo', '--status', 'reviewed', '--note', '假证据', '--evidence', '../outside'));
  assert.throws(() => call('mark', 'person:demo', '--status', 'reviewed', '--note', '假证据', '--evidence', 'missing'));
  put('src/people/demo/demo.md', Array.from({ length: 100 }, () => '战斗' + '字'.repeat(3000)).join('\n'));
  assert.equal(call('read', 'person:demo', '--file', 'body', '--from', '50', '--lines', '2').lines[0].line, 50);
  assert.equal(call('card', 'person:demo').bodyMatches.length, 6);
  assert.ok(call('card', 'person:demo').bodyMatches.every(m => m.excerpt.length <= 320));
  mark();
});
test('new additions sort first; addition parser preserves original date, missing history is explicit', t => {
  const { root, call } = fixture(t);
  assert.throws(() => call('list', '--recent', '1'), /无 Git/);
  const dates = parseAdditionLog('@2026-02-01\nsrc/people/demo/demo.md\n@2026-01-01\nsrc/people/demo/demo.md\n');
  assert.equal(dates.get('src/people/demo/demo.md'), '2026-01-01');
  const records = inventory(root);
  for (const record of records) { record.historyAvailable = true; record.added = record.slug === 'other' ? null : '2026-01-01'; }
  const result = run(root, ['list', '--recent', '1'], records);
  assert.equal(result.records[0].key, 'person:other');
  assert.equal(result.records[0].added, null);
});
test('rule selectors fail if missing or ambiguous', t => {
  const { root, put } = fixture(t);
  assert.throws(() => ruleText(root, { file: 'docs/rules.md', heading: '## 缺失' }));
  put('docs/rules.md', '重复\n重复');
  assert.throws(() => ruleText(root, { file: 'docs/rules.md', contains: '重复' }));
});
test('FC self-description is a candidate, not a pass; malformed receipts are rejected', t => {
  const { call, put } = fixture(t);
  put('src/people/demo/materials-demo.md', 'ESI简介：FLEET COMMANDER');
  assert.equal(call('list', '--signal', 'command-without-tag').records[0].state, 'unreviewed');
  put('docs/reviews/combat.json', { 'person:demo': { status: 'reviewed', note: '缺少证据和指纹' } });
  assert.throws(() => call('list'), /复查记录不完整/);
  assert.throws(() => call('list', '--feature', '../escape'), /feature 须为/);
});
test('another pilot KM does not invalidate a person; participant removal does', t => {
  const { put, call, mark } = fixture(t);
  mark();
  const battle = { battle: { title: '甲战', start: '2026-01-01', sides: [] }, br: { pilots: { 43: [99, 88], 1234: [99, 88] }, losses: [[123, 43, 99, 88, 100], [124, 1234, 99, 88, 999]] } };
  put('src/battles/test/test.json', battle);
  assert.equal(call('card', 'person:demo').state, 'reviewed');
  battle.br = { pilots: {}, losses: [] };
  put('src/battles/test/test.json', battle);
  assert.equal(call('card', 'person:demo').state, 'stale');
});
test('feature implementation edits invalidate only their own feature and impact can filter stale', t => {
  const { root, put, call, mark } = fixture(t);
  const registry = JSON.parse(fs.readFileSync(path.join(root, 'docs/review-features.json')));
  registry.combat.implementation = ['scripts/combat-engine.mjs'];
  put('scripts/combat-engine.mjs', 'export const version = 1;');
  put('docs/review-features.json', registry);
  mark();
  put('scripts/style.mjs', 'unrelated');
  assert.equal(call('card', 'person:demo').state, 'reviewed');
  put('scripts/combat-engine.mjs', 'export const version = 2;');
  assert.equal(call('impact', '--files', 'scripts/combat-engine.mjs', '--state', 'stale').records[0].key, 'person:demo');
  assert.equal(call('impact', '--feature', 'battle', '--files', 'scripts/combat-engine.mjs').total, 0);
});
test('battle name dependencies are scoped to participating organizations', t => {
  const { put, call } = fixture(t);
  put('src/_data/entityNames.json', { corporations: { 99: { name: '参战团', chinese: true } }, alliances: { 88: { name: '参战盟' } } });
  call('mark', 'battle:test', '--feature', 'battle', '--status', 'reviewed', '--note', '已核双方', '--evidence', 'src/battles/test/test.md');
  put('src/_data/entityNames.json', { corporations: { 99: { name: '参战团', chinese: true }, 12345: { name: '别团' } }, alliances: { 88: { name: '参战盟' } } });
  assert.equal(call('card', 'battle:test', '--feature', 'battle').state, 'reviewed');
  put('src/_data/entityNames.json', { corporations: { 99: { name: '参战团', chinese: false } }, alliances: { 88: { name: '参战盟' } } });
  assert.equal(call('card', 'battle:test', '--feature', 'battle').state, 'stale');
});
test('JSON formatting, key order and fetch date alone do not trigger another review', t => {
  const { put, call, mark } = fixture(t);
  mark();
  put('src/people/demo/42-id.json', JSON.stringify({ fetched_at: '2026-10-24', identity: { alts: [{ name: '小号', id: 43 }] }, person: {}, name: '甲', id: 42 }, null, 4));
  assert.equal(call('card', 'person:demo').state, 'reviewed');
});
