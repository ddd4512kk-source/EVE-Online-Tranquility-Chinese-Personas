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

function combatChecks(setup) {
  const registry = JSON.parse(fs.readFileSync(path.join(setup.root, 'docs/review-features.json')));
  registry.combat.checks = Object.fromEntries(['profile', 'alts', 'peaks', 'battles', 'narrative'].map(key => [key, key]));
  setup.put('docs/review-features.json', registry);
  const assessment = Object.fromEntries(Object.keys(registry.combat.checks).map(key => [key, {
    status: 'reviewed', note: '人工对照角色、来源和正文后的采用判断',
    evidence: [key === 'narrative' ? { file: 'src/people/demo/demo.md', contains: '工业人物' } : { file: 'src/people/demo/materials-demo.md', heading: '## 画像' }],
  }]));
  setup.put('.cache/assessment.json', assessment);
  return assessment;
}

test('故事多且出现别人的战斗词、没有已知战役，仍须逐项复查', t => {
  const setup = fixture(t);
  setup.put('src/people/demo/demo.md', '朋友在战斗。\n' + '::: 红料 故事\n教学。\n:::\n'.repeat(8));
  setup.put('src/people/demo/42-id.json', { id: 42, person: {}, identity: { zkb: { kills: 352 } } });
  fs.rmSync(path.join(setup.root, 'src/battles'), { recursive: true });
  combatChecks(setup);
  const rows = setup.call('list', '--signal', 'review-incomplete').records;
  assert.ok(rows.some(row => row.key === 'person:demo'));
  assert.equal(setup.call('list', '--signal', 'battle-without-narrative').total, 0);
  assert.throws(() => setup.mark(), /缺少已完成的复查项/);
  assert.throws(() => setup.call('verify', 'person:demo'), /复查验收未通过/);
});

test('完整五项须定位正文；缺项、待查和失效不能验收，失败标记不覆盖原结论', t => {
  const setup = fixture(t), assessment = combatChecks(setup);
  const mark = () => setup.call('mark', 'person:demo', '--status', 'reviewed', '--note', '逐项核读完成', '--evidence', 'src/people/demo/materials-demo.md', '--assessment', '.cache/assessment.json');
  mark();
  assert.equal(setup.call('verify', 'person:demo').verified[0].state, 'reviewed');
  const before = fs.readFileSync(path.join(setup.root, 'docs/reviews/combat.json'), 'utf8');
  delete assessment.peaks;
  setup.put('.cache/assessment.json', assessment);
  assert.throws(mark, /peaks/);
  assert.equal(fs.readFileSync(path.join(setup.root, 'docs/reviews/combat.json'), 'utf8'), before);
  assessment.peaks = { ...assessment.profile, status: 'pending' };
  setup.put('.cache/assessment.json', assessment);
  assert.throws(mark, /peaks/);
  assessment.peaks.status = 'not-applicable';
  assessment.peaks.note = '已核统计无高值月份可作代表，保留如实画像';
  assessment.narrative.evidence = assessment.profile.evidence;
  setup.put('.cache/assessment.json', assessment);
  assert.throws(mark, /本人的正文/);
  assessment.narrative.evidence = [{ file: 'src/people/demo/demo.md', contains: '不存在的采用段落' }];
  setup.put('.cache/assessment.json', assessment);
  assert.throws(mark, /规则定位必须唯一/);
  assessment.narrative.evidence[0].contains = '工业人物';
  setup.put('.cache/assessment.json', assessment);
  mark();
  setup.put('src/people/demo/demo.md', '工业人物。新增会影响画像的经历。');
  assert.throws(() => setup.call('verify', 'person:demo'), /stale/);
});

test('旧版总说明不能冒充逐项完成；verify逐个核对象和功能，证据禁止越界', t => {
  const setup = fixture(t);
  setup.mark();
  const assessment = combatChecks(setup);
  assert.throws(() => setup.call('verify', 'person:demo'), /缺profile、alts、peaks、battles、narrative/);
  const mark = () => setup.call('mark', 'person:demo', '--status', 'reviewed', '--note', '逐项核读完成', '--evidence', 'src/people/demo/materials-demo.md', '--assessment', '.cache/assessment.json');
  assessment.profile.evidence = [{ file: '../outside.md', contains: '越界' }];
  setup.put('.cache/assessment.json', assessment);
  assert.throws(mark, /仓库内/);
  assessment.profile.evidence = [{ file: 'src/people/demo/materials-demo.md', heading: '## 画像' }];
  setup.put('.cache/assessment.json', assessment);
  mark();
  assert.throws(() => setup.call('verify', 'person:demo', 'person:other'), /person:other=unreviewed/);
  assert.throws(() => setup.call('verify', 'person:missing'), /对象不存在/);
  assert.throws(() => setup.call('verify', 'battle:test'), /不适用于/);
  assert.throws(() => setup.call('verify'), /须指定/);
  setup.mark('needs-work');
  assert.throws(() => setup.call('verify', 'person:demo'), /needs-work/);
});

function writingChecks(t) {
  const setup = fixture(t), body = 'src/people/demo/demo.md', material = 'src/people/demo/materials-demo.md';
  const registry = JSON.parse(fs.readFileSync(path.join(setup.root, 'docs/review-features.json')));
  registry['writing-depth'] = { kinds: ['person'], eventReview: true, pattern: '封号', rules: [{ file: 'docs/rules.md', heading: '## 样式' }], checks: { coverage: '素材覆盖', events: '事件发挥', balance: '全文分量' } };
  setup.put('docs/review-features.json', registry);
  setup.put(body, '::: 黑料 封号\n原本带队的总监宣布活动取消。\n好战的名片对上进不去游戏的账号。\n群员追问军团未来。\n:::\n');
  setup.put(material, '# 素材\n## 封号\n本人宣布被封并取消活动。');
  setup.put('docs/sources/extra.md', '# 原图摘录\n## 通知\n今晚活动取消，我号被封了。');
  const assessment = {
    coverage: { status: 'reviewed', note: '核过素材和全文，封号是唯一重事件', evidence: [{ file: material, heading: '## 封号' }] },
    events: { status: 'reviewed', note: '逐事件对照', evidence: [{ file: body, contains: '原本带队' }], items: [{
      title: '封号取消活动', weight: 'heavy', reason: '改变总监带队能力', source: { file: 'docs/sources/extra.md', heading: '## 通知' }, treatment: 'expanded', body: { file: body, contains: '原本带队' },
      development: [['处境', '原本带队'], ['反差', '好战的名片'], ['反应与后果', '群员追问']].map(([angle, contains]) => ({ angle, note: `展开${angle}`, evidence: { file: body, contains } })),
      verdict: 'sufficient', note: '通知到反差再到群员反应，各段有推进，无剩余关键情节',
    }] },
    balance: { status: 'reviewed', note: '重事成为正文主线', evidence: [{ file: body, contains: '好战的名片' }] },
  };
  const mark = () => {
    setup.put('.cache/writing.json', assessment);
    return setup.call('mark', 'person:demo', '--feature', 'writing-depth', '--status', 'reviewed', '--note', '逐件核完', '--evidence', material, '--assessment', '.cache/writing.json');
  };
  return { ...setup, body, material, assessment, mark };
}

test('writing review is independent of combat and cannot pass on word count or a general note', t => {
  const s = writingChecks(t);
  s.call('mark', 'person:demo', '--status', 'reviewed', '--note', '战斗通过', '--evidence', s.material);
  assert.throws(() => s.call('verify', 'person:demo', '--feature', 'writing-depth'), /unreviewed/);
  s.put(s.body, '很长的文章。'.repeat(2000));
  assert.throws(() => s.call('mark', 'person:demo', '--feature', 'writing-depth', '--status', 'reviewed', '--note', '写了很多字', '--evidence', s.material), /缺少已完成的复查项/);
  assert.equal(s.call('list', '--feature', 'writing-depth', '--signal', 'heavy-story-candidate').records[0].key, 'person:demo');
});

test('writing review rejects missing inventory, brief or omitted heavy events, and repeated development', t => {
  const s = writingChecks(t), event = s.assessment.events.items[0];
  const items = s.assessment.events.items;
  delete s.assessment.events.items;
  assert.throws(s.mark, /events.items/);
  s.assessment.events.items = items;
  for (const treatment of ['brief', 'omitted']) {
    event.treatment = treatment;
    assert.throws(s.mark, /重料未充分展开/);
  }
  event.treatment = 'expanded';
  const development = event.development;
  event.development = development.slice(0, 2);
  assert.throws(s.mark, /至少三个/);
  event.development = [development[0], development[0], development[2]];
  assert.throws(s.mark, /不重复/);
  event.development = development;
  event.verdict = 'needs-work';
  assert.throws(s.mark, /重料未充分展开/);
});

test('writing review rejects self-citation, title-only anchors and exempting the material check', t => {
  const s = writingChecks(t), event = s.assessment.events.items[0];
  const source = event.source;
  event.source = event.body;
  assert.throws(s.mark, /正文自证/);
  event.source = source;
  const evidence = event.development[0].evidence;
  event.development[0].evidence = { file: s.body, contains: '::: 黑料' };
  assert.throws(s.mark, /只有标题/);
  event.development[0].evidence = evidence;
  s.assessment.coverage.status = 'not-applicable';
  assert.throws(s.mark, /不接受不适用/);
});

test('writing review tracks nested external sources and changed rules; rejected marks preserve the receipt', t => {
  const s = writingChecks(t);
  s.mark();
  assert.equal(s.call('verify', 'person:demo', '--feature', 'writing-depth').verified[0].state, 'reviewed');
  const receiptFile = path.join(s.root, 'docs/reviews/writing-depth.json'), before = fs.readFileSync(receiptFile, 'utf8');
  s.assessment.events.items[0].development = [];
  assert.throws(s.mark, /至少三个/);
  assert.equal(fs.readFileSync(receiptFile, 'utf8'), before);
  s.put('docs/sources/extra.md', '# 原图摘录\n## 通知\n更正发言人。');
  assert.throws(() => s.call('verify', 'person:demo', '--feature', 'writing-depth'), /stale/);
  s.put('docs/rules.md', '# 规则\n## 战斗\n战斗规范\n## 样式\n新的写作要求');
  assert.equal(s.call('card', 'person:demo', '--feature', 'writing-depth').state, 'stale');
});

test('absence of heavy events requires an explicit reason, without forcing black material', t => {
  const s = writingChecks(t);
  s.assessment.events.items = [];
  assert.throws(s.mark, /noHeavyReason/);
  s.assessment.events.noHeavyReason = '已核素材中的封号是别人的遭遇，本人只有普通工业活动，无独立重事件';
  s.mark();
  assert.equal(s.call('verify', 'person:demo', '--feature', 'writing-depth').verified[0].state, 'reviewed');
});
