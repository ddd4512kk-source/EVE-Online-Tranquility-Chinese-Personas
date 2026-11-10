import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { collectMaterials, searchMaterials, run, HISTORY } from './materials.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'materials-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (file, value) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), typeof value === 'string' ? value : JSON.stringify(value));
  };
  put('src/people/demo/demo.md', '只有列传正文。');
  put('src/people/demo/42-id.json', { id: 42, name: 'Test Pilot', person: { cn_name: '甲', aliases: ['旧称'] },
    identity: { alts: [{ id: 43, name: 'Other Pilot', sources: ['materials-demo.md'] }] } });
  put('src/people/demo/materials-demo.md', '# 甲的素材\n独有的欠账事件，来源双方说法仍待核对。');
  put('src/battles/test/test.md', '战役正文');
  put('src/battles/test/test.json', { battle: { title: '测试战役', aliases: ['旧战役名'], start: '2020-01-01', systems: ['ABC-1'] } });
  put('docs/sources/event.md', '# 共用事件\n独有的欠账事件');
  put('docs/leads/not-admitted.md', '# 待核角色\n只有未核线索。');
  put('docs/bilibili/123.json', { uid: '123', name: 'UP甲', identity: { state: 'candidate', material: 'docs/leads/not-admitted.md' } });
  put(HISTORY, JSON.stringify({ text: '旧称已经成文（历史记录）', refs: ['src/people/demo/materials-demo.md'] }) + '\n');
  return { root, put };
}

test('帮助不读取损坏档案，命令行输出可直接阅读的文本', t => {
  const { root, put } = fixture(t);
  put('src/people/demo/42-id.json', '{bad');
  assert.equal(typeof run(root, ['--help']), 'string');
  assert.throws(() => run(root, ['甲', '--help']), /单独使用/);
  const output = execFileSync(process.execPath, [fileURLToPath(new URL('./materials.mjs', import.meta.url)), '--help'], { cwd: root, encoding: 'utf8' });
  assert.ok(output.includes('npm run materials --'));
  assert.throws(() => JSON.parse(output), SyntaxError);
});

test('从正式文件取得当前字段、小号和路径；缺素材不编路径，默认只报数量', t => {
  const { root, put } = fixture(t);
  assert.equal(collectMaterials(root).length, 5);
  const summary = searchMaterials(root);
  assert.deepEqual(summary.counts, { person: 1, battle: 1, source: 1, lead: 1, bilibili: 1, corporation: 0, character: 0 });
  assert.deepEqual(summary.records, []);
  for (const query of ['甲', 'test pilot', '旧称', '43', 'other pilot']) {
    assert.equal(searchMaterials(root, { query, kind: 'person' }).records[0].character_id, 42);
  }
  const battle = searchMaterials(root, { query: 'ABC-1' }).records[0];
  assert.equal(battle.kind, 'battle');
  assert.equal(battle.material, null);
  put('src/battles/test/materials-test.md', '# 新素材');
  assert.equal(searchMaterials(root, { query: '旧战役名' }).records[0].material, 'src/battles/test/materials-test.md');
  const account = searchMaterials(root, { query: '123' }).records[0];
  assert.equal(account.identity_state, 'candidate');
  assert.equal(account.person, undefined);
  assert.equal(account.character_id, undefined);
  put('docs/bilibili/123.json', { uid: '123', name: 'Different Name', identity: { state: 'confirmed', person: 'demo', material: 'src/people/demo/materials-demo.md' } });
  const confirmed = searchMaterials(root, { query: '旧称', kind: 'bilibili' }).records[0];
  assert.equal(confirmed.uid, '123');
  assert.equal(confirmed.person_title, '甲');
  assert.equal(confirmed.character_id, 42);
});

test('全文按需搜索并分页，不让旧备注充当当前状态', t => {
  const { root } = fixture(t);
  assert.equal(searchMaterials(root, { query: '欠账' }).total, 0);
  const full = run(root, ['欠账', '--full-text', '--limit', '1', '--offset', '1']);
  assert.equal(full.total, 2);
  assert.equal(full.records.length, 1);
  assert.equal(full.records[0].match.line, 2);
  assert.match(full.records[0].match.excerpt, /欠账/);
  assert.equal(searchMaterials(root, { query: '已经成文' }).total, 0);
  const old = run(root, ['旧称', '--history']);
  assert.equal(old.historical, true);
  assert.equal(old.records.length, 1);
  assert.match(old.warning, /当前.*须核/);
  assert.throws(() => run(root, ['--history']), /指定关键词/);
  assert.throws(() => run(root, ['--full-text']), /指定关键词/);
  assert.throws(() => run(root, ['旧称', '--history', '--kind', 'person']), /不与/);
});

test('无效查询和损坏的正式档案明确报错，不静默当成没有材料', t => {
  const { root, put } = fixture(t);
  assert.throws(() => run(root, ['--kind', 'unknown']), /kind/);
  assert.throws(() => run(root, ['--limit', '0']), /正整数/);
  assert.throws(() => run(root, ['--offset', '-1']), /非负整数/);
  assert.throws(() => run(root, ['--limit']), /缺少值/);
  assert.throws(() => run(root, ['--limt', '1']), /未知选项/);
  put('src/people/demo/42-id.json', '{bad');
  assert.throws(() => searchMaterials(root), /42-id.json/);
});

test('B站作品摘要迁入JSON后，按标题和BV定位，全文保留人物及战役召回与分页', t => {
  const { root, put } = fixture(t);
  const bvid = 'BV1abcdefghJ';
  put('docs/bilibili/123.json', { uid: '123', name: 'UP甲', identity: { state: 'confirmed', person: 'demo', material: 'src/people/demo/materials-demo.md' },
    videos: [{ bvid, title: '关于舰队的公开复盘', url: `https://www.bilibili.com/video/${bvid}/`, reading: {
      state: 'digested', digest: '上下文。'.repeat(150) + '独有的调度争议，作者回应仍待战报核对。', scope: '简介与作者两条回复，未看影像',
    } }],
    posts: [{ key: 'opus:456', url: 'https://www.bilibili.com/opus/456', title: '图文补记', reading: { digest: '图文里的不同说法', scope: '只读正文' } }] });
  put('src/people/demo/materials-demo.md', `# 人物事件整合\n作品摘记见 docs/bilibili/123.json，${bvid}。`);
  put('src/battles/test/materials-test.md', `# 战役判断\n同场来源：${bvid}。`);
  assert.equal(searchMaterials(root, { query: '公开复盘', kind: 'bilibili' }).records[0].match.key, bvid);
  assert.equal(searchMaterials(root, { query: bvid, kind: 'bilibili' }).total, 1);
  assert.equal(searchMaterials(root, { query: '调度争议' }).total, 0);
  const results = searchMaterials(root, { query: '调度争议', fullText: true });
  assert.deepEqual(results.records.map(record => record.kind), ['person', 'battle', 'bilibili']);
  for (const record of results.records) {
    assert.equal(record.match.archive, 'docs/bilibili/123.json');
    assert.equal(record.match.key, bvid);
    assert.equal(record.match.field, 'reading.digest');
    assert.match(record.match.excerpt, /调度争议/);
    assert.ok(record.match.excerpt.length <= 280);
  }
  assert.equal(searchMaterials(root, { query: '调度争议', fullText: true, offset: 1, limit: 1 }).records[0].kind, 'battle');
  assert.equal(searchMaterials(root, { query: '未看影像', fullText: true, kind: 'person' }).total, 1);
  assert.equal(searchMaterials(root, { query: '不同说法', fullText: true, kind: 'bilibili' }).records[0].match.key, 'opus:456');
  assert.equal(searchMaterials(root, { query: '不同说法', fullText: true, kind: 'person' }).total, 0);
  put('src/people/demo/materials-demo.md', '# 图文关联\nhttps://www.bilibili.com/opus/456');
  assert.equal(searchMaterials(root, { query: '不同说法', fullText: true, kind: 'person' }).total, 1);
});

test('军团ID、角色名与账号组昵称可直接定位结构化档案，不需要全文搜索', t => {
  const { root, put } = fixture(t);
  put('docs/corporations/123.json', { id: '123', names: ['Kuan.Dai.Shan', '宽带山'], rankings: [],
    account_groups: [{ label: '林先登', character_ids: ['43'] }], references: ['docs/leads/not-admitted.md'] });
  put('docs/corporations/characters/43.json', { version: 1, records: {
    '43': { id: '43', names: ['Other Pilot'], labels: ['林先登'], profiles: [{ title: '中文头衔' }], evidence: ['docs/leads/not-admitted.md#范围'] },
  } });
  assert.equal(searchMaterials(root, { query: '123', kind: 'corporation' }).total, 1);
  assert.equal(searchMaterials(root, { query: '宽带山', kind: 'corporation' }).total, 1);
  assert.equal(searchMaterials(root, { query: '林先登', kind: 'character' }).records[0].person, 'demo');
  assert.equal(searchMaterials(root, { query: '中文头衔', kind: 'character' }).total, 1);
  assert.equal(searchMaterials(root, { query: 'other pilot', kind: 'character' }).records[0].material, 'src/people/demo/materials-demo.md');
  assert.equal(searchMaterials(root, { query: 'other pilot', kind: 'character' }).records[0].archive, 'docs/corporations/characters/43.json');
  put('docs/corporations/notes/members/123.md', '### 宽带山成员核读\n独有的旧搜索失败边界。');
  const excerpt = searchMaterials(root, { query: '旧搜索失败', fullText: true, kind: 'source' });
  assert.equal(excerpt.total, 1);
  assert.equal(excerpt.records[0].material, 'docs/corporations/notes/members/123.md');
  assert.equal(excerpt.records[0].title, '宽带山成员核读');
  assert.equal(excerpt.records[0].match.line, 2);
});

test('材料 JSON 投影参与标题、正文、作品引用全文召回并保留行号', t => {
  const { root, put } = fixture(t);
  fs.rmSync(path.join(root, 'src/people/demo/materials-demo.md'));
  put('docs/sources/shared.json', { version: 1, type: 'material', title: '共享来源标题', sections: [
    { id: 'source', heading: '共享来源标题', level: 1, content: '来源正文独有词。\n' },
  ] });
  put('docs/bilibili/123.json', { uid: '123', name: 'UP甲', videos: [{ bvid: 'BV1abcdefghJ', title: '视频标题', reading: { digest: '作者回应中的独有异议词。' } }] });
  put('src/people/demo/materials-demo.json', { version: 1, type: 'material', title: '人物素材标题', sections: [
    { id: 'overview', heading: '人物素材标题', level: 1, content: '' },
    { id: 'evidence', heading: '作品回查', level: 2, content: '摘要异议词，详见 [共享来源](../../../docs/sources/shared.json) 与 [作品](../../../docs/bilibili/123.json)，BV1abcdefghJ。\n' },
  ] });
  const titleHit = searchMaterials(root, { query: '人物素材标题', kind: 'person' }).records[0];
  assert.equal(titleHit.material, 'src/people/demo/materials-demo.json');
  const proseHit = searchMaterials(root, { query: '来源正文独有词', fullText: true, kind: 'source' });
  assert.equal(proseHit.records[0].title, '共享来源标题');
  const excerpt = searchMaterials(root, { query: '摘要异议词', fullText: true, kind: 'person' });
  assert.equal(excerpt.records[0].match.line, 3);
  assert.match(excerpt.records[0].match.excerpt, /摘要异议词/);
  const linkedWork = searchMaterials(root, { query: '作者回应中的独有异议词', fullText: true, kind: 'person' });
  assert.equal(linkedWork.records[0].match.key, 'BV1abcdefghJ');
});
