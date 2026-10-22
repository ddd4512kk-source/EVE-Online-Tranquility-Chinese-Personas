import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { videoFromCapture, mergeVideo, validateProfile, syncProfile, run } from './bilibili-archive.mjs';

const bv = 'BV1abcdefghJ';
function capture(overrides = {}) {
  return { source: `https://www.bilibili.com/video/${bv}/`, at: '2026-10-17T10:00:00Z', status: 'read',
    metadata: { bvid: bv, title: '一个有出处的教学作品', desc: '署名与玩法说明\n招新群：12345678\n另一个需要保留的公开细节', owner: { mid: 123, name: '测试UP' }, pubdate: 1600000000, stat: { view: 1200, reply: 3 } }, ...overrides };
}
async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'bili-archive-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, 'docs/bilibili'), { recursive: true });
  await fs.mkdir(path.join(root, 'src/people/demo'), { recursive: true });
  await fs.writeFile(path.join(root, 'src/people/demo/2000000001-id.json'), JSON.stringify({ id: 2000000001, person: {}, identity: { version: 1, alts: [], accounts: {} } }));
  await fs.writeFile(path.join(root, 'src/people/demo/demo.md'), `::: 红料 旧故事\n[原作](https://www.bilibili.com/video/${bv}/)\n:::\n`);
  await fs.writeFile(path.join(root, 'src/people/demo/materials-demo.md'), `<a id="bili-test"></a>\n${bv}：简介与作者答疑的摘要。`);
  const p = { version: 1, uid: '123', name: '测试UP', url: 'https://space.bilibili.com/123/',
    identity: { state: 'confirmed', person: 'demo', material: 'src/people/demo/materials-demo.md', label: '测试人物', evidence: ['公开署名'], related: [] },
    channel: { coverage: Object.fromEntries(['latest', 'popular', 'series'].map(key => [key, { state: 'unknown', scope: '尚未核读' }])) },
    videos: [videoFromCapture(capture())] };
  await fs.writeFile(path.join(root, 'docs/bilibili/123.json'), JSON.stringify(p));
  return { root, p };
}

test('只取作品页对应作者，不把侧栏或失败页升级为已读；隐去联系号码', () => {
  const v = videoFromCapture(capture());
  assert.equal(v.owner_uid, '123');
  assert.equal(v.reading.state, 'captured');
  assert.equal(v.description, '署名与玩法说明\n另一个需要保留的公开细节');
  assert.throws(() => videoFromCapture(capture({ source: 'https://space.bilibili.com/123/' })), /BV不符/);
  assert.throws(() => videoFromCapture(capture({ source: `https://evil.example/video/${bv}/` })), /BV不符/);
  assert.throws(() => videoFromCapture(capture({ status: 'blocked' })), /失败页面/);
});

test('旧API缓存没有取得日期，不能凭文件mtime声称已读', () => {
  const v = videoFromCapture(capture().metadata);
  assert.equal(v.captured_at, null);
  assert.equal(v.reading.state, 'captured');
});

test('再导入保留消化、署名、旧简介，不回退人工状态', () => {
  const original = videoFromCapture(capture());
  original.reading = { state: 'digested', material_refs: ['materials.md#bili-test'], scope: '简介与2主评论' };
  original.credit = { state: 'repost', note: '原作者另有其人' };
  const newer = videoFromCapture(capture({ at: '2026-10-22T10:00:00Z', metadata: { ...capture().metadata, desc: '新版简介' } }));
  const merged = mergeVideo(original, newer);
  assert.equal(merged.description, '新版简介');
  assert.equal(merged.reading.state, 'digested');
  assert.equal(merged.credit.state, 'repost');
  assert.equal(merged.description_history[0].text, original.description);
  assert.throws(() => mergeVideo(original, { ...newer, owner_uid: '999' }), /UID\/BV冲突/);
});

test('使用新版人物JSON；同步幂等，读取与入文不混为同一状态', async t => {
  const { root } = await fixture(t);
  await run(root, 'sync');
  const first = await fs.readFile(path.join(root, 'docs/bilibili/123.json'), 'utf8');
  // No generated directory is needed, even in a new checkout/fixture.
  assert.deepEqual((await fs.readdir(path.join(root, 'docs'))).sort(), ['bilibili']);
  assert.equal(JSON.parse(first).videos[0].reading.state, 'material_linked');
  assert.deepEqual(JSON.parse(first).videos[0].usage, { body: true, selected: false });
  await run(root, 'sync');
  assert.equal(await fs.readFile(path.join(root, 'docs/bilibili/123.json'), 'utf8'), first);
  await run(root, 'check');
});

test('检查正文与精选重叠，以及丢失的消化锚点和临时缓存链接', async t => {
  const { root, p } = await fixture(t);
  await fs.appendFile(path.join(root, 'src/people/demo/demo.md'), `\n::: 红料 B站作品精选\n- [重复](https://www.bilibili.com/video/${bv}/)\n:::\n`);
  const synced = await syncProfile(root, p);
  synced.videos[0].reading = { state: 'digested', scope: '简介', material_refs: ['src/people/demo/materials-demo.md#missing', '.cache/temporary.md'] };
  const errors = await validateProfile(root, 'docs/bilibili/123.json', synced);
  assert.ok(errors.some(s => s.includes('正文与精选重复')));
  assert.ok(errors.some(s => s.includes('锚点未落档')));
  assert.ok(errors.some(s => s.includes('素材路径无效')));
});

test('按BV直接读既有摘记与范围，不把阅读表当作已消化', async t => {
  const { root } = await fixture(t);
  await fs.writeFile(path.join(root, 'src/people/demo/materials-demo.md'),
    `# 素材\n\n## 旧阅读范围\n\n只读简介与2主线程，未看影像。\n\n| [作品](${bv}) | 取得20线程 |\n\n- ${bv}：作者补充原作出处，驾驶者另有其人。\n`);
  await run(root, 'sync');
  const v = JSON.parse((await run(root, 'show', '123', bv))[0]);
  assert.equal(v.reading.state, 'material_linked');
  assert.equal(v.material_evidence[0].kind, 'table_row');
  assert.match(v.material_evidence[0].context, /只读简介与2主线程/);
  assert.match(v.material_evidence[1].text, /驾驶者另有其人/);
});

test('旧搜索候选直接关联扫描记录，缺失批次或依据路径会报错', async t => {
  const { root, p } = await fixture(t);
  const scans = { version: 1, runs: [{ id: 'legacy', state: 'historical', scope: '旧综合前三页，不算新扫描覆盖' }] };
  await fs.writeFile(path.join(root, 'docs/bilibili/scans.json'), JSON.stringify(scans));
  p.discovery = { source: 'docs/bilibili/scans.json', run: 'legacy', scope: '只见标题', next: '按已知UID补缺口' };
  assert.deepEqual(await validateProfile(root, 'docs/bilibili/123.json', p), []);
  assert.deepEqual(JSON.parse((await run(root, 'scans'))[0]), scans);
  p.discovery.run = 'missing';
  p.channel.coverage.latest = { state: 'legacy_record', scope: '旧读记录', evidence: 'docs/missing.md' };
  const errors = await validateProfile(root, 'docs/bilibili/123.json', p);
  assert.ok(errors.some(s => s.includes('原扫描批次')));
  assert.ok(errors.some(s => s.includes('覆盖依据路径无效')));
});
