import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { markRead, mergeCache, queryArchive, validateThread, run } from './tieba-archive.mjs';

function record() {
  return { schema_version: 1, thread_id: '123', url: 'https://tieba.baidu.com/p/123', title: '旧帖', references: [], legacy_records: [{ note: '图片未读' }], review: { status: 'read', notes: ['只读首尾'] } };
}

test('读帖登记：未建档的按缓存建档，已有档案保留引用与说明', () => {
  const data = { source: 'https://tieba.baidu.com/p/789', fetched_at: '2026-11-15T00:00:00Z', pages: [{ thread: { title: '新帖', create_time: '1609637494' }, post_list: [] }] };
  const created = markRead(null, '789', data, '.cache/789.json', '2026-11-15');
  assert.equal(created.title, '新帖');
  assert.equal(created.published_date, '2021-01-03');
  assert.deepEqual(created.review, { status: 'read', notes: [], read_at: '2026-11-15' });
  assert.equal(validateThread(created, '789.json').thread_id, '789');
  const prior = { ...record(), review: { status: 'unread', notes: ['旧说明'] }, references: ['src/people/x.md'] };
  const updated = markRead(prior, '123', { ...data, source: prior.url }, '.cache/123.json', '2026-11-15');
  assert.equal(updated.title, '旧帖');
  assert.deepEqual(updated.references, prior.references);
  assert.deepEqual(updated.review.notes, ['旧说明']);
  assert.equal(updated.review.status, 'read');
});

test('刷新缓存保留人工结论、旧缺口与计数差，不把成功取得升级为已读', () => {
  const prior = record();
  const data = { source: prior.url, fetched_at: '2026-10-25T00:00:00Z', complete: true, pages: [{ post_list: [{ id: 1, floor: 1, sub_post_list: { sub_post_list: [{ id: 2 }] } }] }], coverage: { subposts: [{ floor: 1, expected: 4, fetched: 1 }] } };
  const result = mergeCache(prior, data, '.cache/123.json');
  assert.deepEqual(result.review, prior.review);
  assert.deepEqual(result.legacy_records, prior.legacy_records);
  assert.equal(result.acquisition.main_posts, 1);
  assert.equal(result.acquisition.subpost_gaps[0].expected, 4);
  assert.equal(prior.acquisition, undefined);
  assert.throws(() => mergeCache(prior, { ...data, source: 'https://tieba.baidu.com/p/1234' }, 'bad.json'), /帖号不符/);
  const duplicate = structuredClone(data);
  duplicate.reverse_pages = [{ post_list: [{ id: 1, floor: 1, sub_post_list: { sub_post_list: [{ id: 2 }, { id: 3 }] } }] }];
  assert.equal(mergeCache(prior, duplicate, 'both.json').acquisition.subposts, 2);
});

test('旧缓存不能覆盖新取得范围，筛选分页不改变阅读状态', () => {
  const prior = { ...record(), acquisition: { fetched_at: '2026-10-25T00:00:00Z', main_posts: 20 } };
  assert.deepEqual(mergeCache(prior, { source: prior.url, fetched_at: '2026-10-24T00:00:00Z' }, 'old.json'), prior);
  assert.deepEqual(mergeCache(prior, { source: prior.url, fetched_at: '2026-10-25T07:00:00+08:00' }, 'offset.json'), prior);
  const unread = { ...record(), thread_id: '456', review: { status: 'unread', notes: [] } };
  assert.equal(queryArchive([prior, unread], { status: 'unread' }).records[0].thread_id, '456');
  assert.equal(queryArchive([prior, unread], { query: '图片未读', limit: 1, offset: 1 }).total, 2);
  assert.throws(() => queryArchive([prior], { status: 'partial' }), /未知阅读状态/);
  assert.throws(() => queryArchive([prior], { limit: 0 }), /limit/);
});

test('拒绝错帖号、旧多级状态和不合法档案', () => {
  assert.equal(validateThread(record(), '123.json').thread_id, '123');
  assert.throws(() => validateThread(record(), '456.json'), /文件名/);
  assert.throws(() => validateThread({ ...record(), review: { status: 'reviewed', notes: [] } }, '123.json'), /unread或read/);
});

test('正式目录离线校验与同步，拒绝引用不存在的帖号并保留磁盘人工状态', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'tieba-archive-'));
  try {
    await writeFile(path.join(directory, '123.json'), JSON.stringify(record()));
    const scans = { schema_version: 1, scans: [{ id: 'test', thread_ids: ['123'] }] };
    await writeFile(path.join(directory, 'scans.json'), JSON.stringify(scans));
    const context = { root: directory, directory };
    assert.equal((await run(['check'], context)).threads, 1);
    await writeFile(path.join(directory, 'cache.json'), JSON.stringify({ source: record().url, fetched_at: '2026-10-25T00:00:00Z', pages: [] }));
    await run(['sync-cache', '123', 'cache.json'], context);
    const saved = JSON.parse(await readFile(path.join(directory, '123.json'), 'utf8'));
    assert.deepEqual(saved.review, record().review);
    assert.deepEqual(saved.legacy_records, record().legacy_records);
    await writeFile(path.join(directory, 'new.json'), JSON.stringify({ source: 'https://tieba.baidu.com/p/456', fetched_at: '2026-11-15T00:00:00Z', pages: [] }));
    assert.equal((await run(['mark-read', 'new.json'], context)).created, true);
    assert.equal(JSON.parse(await readFile(path.join(directory, '456.json'), 'utf8')).review.status, 'read');
    scans.scans[0].thread_ids.push('999');
    await writeFile(path.join(directory, 'scans.json'), JSON.stringify(scans));
    await assert.rejects(run(['check'], context), /缺少帖子档案999/);
    await assert.rejects(run(['list', '--limit'], context), /缺少参数/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
