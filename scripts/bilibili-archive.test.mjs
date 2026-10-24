import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { postFromCapture, mergePost, battleReportLinks, battleVideoCandidates, cleanDescription, videoFromCapture, mergeVideo, validateProfile, syncProfile, run } from './bilibili-archive.mjs';

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

test('清理联系方式仍保留同一行BR，识别旧站、中文标点和HTML链接', () => {
  const report = 'https://br.evetools.org/br/64717b91543bb54ab3337066';
  const legacy = 'https://br.inyour.space/?s=4807&b=8176440';
  assert.equal(cleanDescription(`QQ群：12345678 战报：${report}。`), report);
  assert.deepEqual(battleReportLinks(`原报（${report}），旧报：${legacy.replace('&', '&amp;')}\n${report}`), [report, legacy]);
  assert.deepEqual(battleReportLinks('https://br.evetools.org.evil.test/br/123 https://user:secret@killmail.app/br/abcdef https://example.com/contact'), []);
  assert.equal(cleanDescription('QQ群：12345678，无公开战报'), '');
});

test('战报查询包含旧简介、分页及独立的主报匹配与素材提及，不冒充已核', async t => {
  const { root, p } = await fixture(t);
  const report = 'https://br.evetools.org/br/64717b91543bb54ab3337066';
  const other = 'https://warbeacon.net/br/report/another-report';
  p.videos[0].description = `战报：${report}/。补充：${other}`;
  p.videos[0].description_history = [{ captured_at: null, text: 'https://br.inyour.space/?s=4807&b=8176440' }];
  await fs.writeFile(path.join(root, 'docs/bilibili/123.json'), JSON.stringify(p));
  await fs.mkdir(path.join(root, 'src/battles/demo'), { recursive: true });
  await fs.writeFile(path.join(root, 'src/battles/demo/demo.json'), JSON.stringify({ battle: { loss_source: report }, br: null }));
  await fs.writeFile(path.join(root, 'src/battles/demo/materials-demo.md'), `候选报：${other}`);
  const result = JSON.parse((await run(root, 'reports', '0', '2'))[0]);
  assert.equal(result.total, 3);
  assert.equal(result.rows.length, 2);
  assert.deepEqual(result.rows[0].source_matches, ['src/battles/demo/demo.json']);
  assert.deepEqual(result.rows[0].material_mentions, []);
  assert.deepEqual(result.rows[1].source_matches, []);
  assert.deepEqual(result.rows[1].material_mentions, ['src/battles/demo/materials-demo.md']);
  const last = JSON.parse((await run(root, 'reports', '2', '2'))[0]);
  assert.equal(last.rows[0].versions[0].current, false);
  assert.equal(last.rows[0].versions[0].captured_at, null);
  assert.equal(JSON.parse(await fs.readFile(path.join(root, 'docs/bilibili/123.json'))).videos[0].reading.state, 'captured');
  await assert.rejects(run(root, 'reports', '-1'), /偏移/);
  await assert.rejects(run(root, 'reports', '0', '21'), /条数/);
});

test('近5日候选读简介与多日窗口，不要求标题写星系，不按播放筛选', () => {
  const video = videoFromCapture(capture());
  const battle = { start: '2026-04-06', end: '2026-04-08', systems: ['Atioth'], loss_source: [] };
  const p = { uid: '123', name: '小UP', videos: [
    { ...video, bvid: 'BV1aaaaaaaab', title: '那一晚', description: '节点崩溃前的万人超旗战', published_at: '2026-04-12T23:59:00Z', stats: { views: 20, replies: 0 } },
    { ...video, bvid: 'BV1aaaaaaaac', title: '万人会战', description: '', published_at: '2026-04-13T00:00:00Z' },
    { ...video, bvid: 'BV1aaaaaaaad', title: 'Atioth | EVE Online', description: '', published_at: '2026-04-08T00:00:00Z' },
    { ...video, bvid: 'BV1aaaaaaaae', title: '普通教学', description: '', published_at: '2026-04-08T00:00:00Z' },
  ] };
  const rows = battleVideoCandidates([p], battle);
  assert.deepEqual(rows.map(v => v.bvid), ['BV1aaaaaaaad', 'BV1aaaaaaaae', 'BV1aaaaaaaab']);
  assert.equal(rows[1].association, 'nearby-needs-description');
  assert.equal(rows[2].days_from_battle, 4);
  assert.equal(rows[2].association, 'nearby-battle-topic');
});

test('北京时间跨日先转UTC，只有中文日期的卡片保留两种UTC日期可能', () => {
  const video = videoFromCapture(capture());
  const battle = { start: '2026-04-08', systems: ['Atioth'], loss_source: [] };
  const profile = { uid: '123', name: '作者', videos: [
    { ...video, bvid: 'BV1aaaaaaaab', title: '凌晨无畏战', published_at: '2026-04-13T02:00:00+08:00' },
    { ...video, bvid: 'BV1aaaaaaaac', title: '同一时刻', published_at: '2026-04-12T18:00:00Z' },
    { ...video, bvid: 'BV1aaaaaaaad', title: '仅有中文日期', published_at: '2026-04-13' },
    { ...video, bvid: 'BV1aaaaaaaae', title: '确知UTC已过窗口', published_at: '2026-04-13T00:00:00Z' },
    { ...video, bvid: 'BV1aaaaaaaaf', title: '无时区的时刻仅作为日期范围保留', published_at: '2026-04-13T02:00:00' },
  ] };
  const rows = battleVideoCandidates([profile], battle);
  assert.deepEqual(rows.map(v => v.bvid).sort(), ['BV1aaaaaaaab', 'BV1aaaaaaaac', 'BV1aaaaaaaad', 'BV1aaaaaaaaf']);
  assert.ok(rows.every(v => v.days_from_battle === 4));
  assert.equal(rows.find(v => v.bvid === 'BV1aaaaaaaab').published_at, '2026-04-13T02:00:00+08:00');
});

test('简介旧版本同主报可发现迟发作品；联合投稿卡片去重，不认频道为原作者', () => {
  const report = 'https://br.evetools.org/br/64717b91543bb54ab3337066';
  const video = { ...videoFromCapture(capture()), title: '回忆', description: '', published_at: '2026-10-01',
    description_history: [{ text: report, captured_at: null }] };
  const battle = { start: '2023-05-27', systems: ['Old Man Star'], loss_source: report };
  const rows = battleVideoCandidates([{ uid: '123', name: '作者', videos: [video] }], battle);
  assert.equal(rows[0].association, 'same-report-source');
  const listing = { candidates: [{ bvid: bv, title: '千人会战', published: '2023-05-28' }] };
  const joint = battleVideoCandidates([
    { uid: '100', name: '合作方', channel: { listings: [listing] }, videos: [] },
    { uid: '123', name: '作者', channel: { listings: [listing] }, videos: [video] },
  ], battle);
  assert.equal(joint.length, 1);
  assert.equal(joint[0].uid, '123');
  assert.equal(joint[0].author, '作者');
  assert.equal(joint[0].listed_by.length, 2);
  const onlyCard = battleVideoCandidates([{ uid: '100', name: '合作方', channel: { listings: [listing] } }], battle);
  assert.equal(onlyCard[0].uid, null);
  assert.equal(onlyCard[0].page_captured, false);
});

test('全站盘点保留没有战役关键词的日期候选，不把未读当不存在', async t => {
  const { root } = await fixture(t);
  await fs.mkdir(path.join(root, 'src/battles/demo'), { recursive: true });
  await fs.writeFile(path.join(root, 'src/battles/demo/demo.json'), JSON.stringify({
    battle: { start: '2020-09-13', systems: ['4-HWWF'], videos: [] },
  }));
  const summary = JSON.parse((await run(root, 'candidates', 'all', '0'))[0]);
  assert.equal(summary.total, 1);
  assert.equal(summary.rows[0].needs_description, 1);
  assert.equal(summary.rows[0].not_selected, 1);
  const detail = JSON.parse((await run(root, 'candidates', 'demo', '0'))[0]);
  assert.equal(detail.rows[0].association, 'nearby-needs-description');
  assert.equal(detail.rows[0].selected, false);
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

function postCapture(kind = 'opus') {
  const id = '1182987654321098765';
  return { source: `https://www.bilibili.com/${kind === 'opus' ? 'opus/' : 'read/cv'}${id}`,
    at: '2026-10-24T00:00:00Z', status: 'read', coverage: '公开正文文字；图片、评论未读',
    metadata: { kind, id, owner: { mid: '123' }, title: '一篇图文', text: '公开的具体事件经过\nQQ群：12345678\n保留的上下文' } };
}

test('图文按字符串ID归档，拒绝列表、摘要壳、错配URL和失败页', () => {
  const data = postCapture(), post = postFromCapture(data);
  assert.equal(post.key, 'opus:1182987654321098765');
  assert.equal(post.text, '公开的具体事件经过\n保留的上下文');
  assert.equal(post.reading.state, 'captured');
  assert.equal(postFromCapture(postCapture('article')).kind, 'article');
  for (const bad of [
    { ...data, source: 'https://space.bilibili.com/123/upload/opus' },
    { ...data, source: data.source.replace('www.bilibili.com', 'evil.example') },
    { ...data, source: data.source.replace('https:', 'http:') },
    { ...data, status: 'partial' }, { ...data, status: 'blocked' }, { ...data, coverage: '' },
    { ...data, metadata: { ...data.metadata, id: Number(data.metadata.id) } },
    { ...data, metadata: { ...data.metadata, owner: {} } },
    { ...data, metadata: { ...data.metadata, text: '' } },
  ]) assert.throws(() => postFromCapture(bad));
});

test('图文再导入保留旧文字与范围、署名及已消化状态', () => {
  const data = postCapture(), original = postFromCapture(data);
  original.reading = { state: 'digested', material_refs: ['materials.md#post'], scope: '正文已摘要，评论未读' };
  original.credit = { state: 'repost', note: '须区别译者和原作者' };
  const newer = postFromCapture({ ...data, at: '2026-10-25T00:00:00Z', coverage: '只读正文前半', metadata: { ...data.metadata, text: '更新的正文' } });
  const result = mergePost(original, newer);
  assert.equal(result.text, '更新的正文');
  assert.equal(result.reading.state, 'digested');
  assert.equal(result.credit.state, 'repost');
  assert.equal(result.text_history[0].text, original.text);
  assert.equal(result.text_history[0].capture_scope, data.coverage);
  assert.deepEqual(mergePost(result, original), result);
  assert.throws(() => mergePost(original, { ...newer, owner_uid: '999' }), /冲突/);
});

test('同一UID导入图文、同步、查询摘要与校验，不改视频状态或推定图文已消化', async t => {
  const { root } = await fixture(t), data = postCapture();
  const input = path.join(root, 'capture.json');
  await fs.writeFile(input, JSON.stringify(data));
  await run(root, 'import', input);
  await run(root, 'import', input);
  let p = JSON.parse(await fs.readFile(path.join(root, 'docs/bilibili/123.json')));
  assert.equal(p.posts.length, 1);
  assert.equal(p.videos.length, 1);
  await fs.appendFile(path.join(root, 'src/people/demo/materials-demo.md'), `\n## 图文\n\n只读正文，未读图片及评论。\n${p.posts[0].url}：事件摘记。\n`);
  await run(root, 'sync');
  await run(root, 'check');
  const summary = JSON.parse((await run(root, 'show', '123'))[0]);
  assert.equal(summary.coverage.opus.state, 'unknown');
  assert.equal(summary.posts[0].reading.state, 'material_linked');
  const detail = JSON.parse((await run(root, 'show', '123', p.posts[0].key))[0]);
  assert.match(detail.material_evidence[0].text, /事件摘记/);
  assert.equal(detail.usage.body, false);
  p = JSON.parse(await fs.readFile(path.join(root, 'docs/bilibili/123.json')));
  p.posts[0].reading = { state: 'digested', scope: '仅正文', material_refs: ['src/people/demo/materials-demo.md#missing'] };
  p.posts.push(structuredClone(p.posts[0]));
  p.channel.coverage.opus = { state: 'reviewed', scope: '图文首页' };
  const errors = await validateProfile(root, 'docs/bilibili/123.json', p);
  assert.ok(errors.some(e => e.includes('opus已取得状态缺少依据')));
  assert.ok(errors.some(e => e.includes('锚点未落档')));
  assert.ok(errors.some(e => e.includes('无效或重复')));
});
