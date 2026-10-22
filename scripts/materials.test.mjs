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
  assert.deepEqual(summary.counts, { person: 1, battle: 1, source: 1, lead: 1, bilibili: 1 });
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
