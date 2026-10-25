import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkArchive, run, characterDetails, rankingMembers, findOrganizations, readCharacters, characterArchivePath } from './corporation-archive.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'corporations-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (file, data) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), typeof data === 'string' ? data : JSON.stringify(data));
  };
  const source = 'docs/corporations/notes/example.md';
  put(source, '# 原始范围\n旧403后已经取得；只读50名，51—100名仍待查。');
  const characters = { version: 1, records: {
    '42': { id: '42', names: ['Pilot A'], labels: ['林先登'], profiles: [],
      review: { state: 'legacy', findings: [{ note: '旧表称未收录；搜索失败，不代表没有故事', source }], next_steps: ['复用已有原帖'] }, evidence: [source] },
    '43': { id: '43', names: ['Pilot B'], labels: [], profiles: [{ as_of: null, title: '', corporation_id: null, source }],
      review: { state: 'legacy', findings: [], next_steps: [] }, evidence: [source] },
  } };
  const ranking = (scope, period, entries, note = '') => ({ scope, period, target: 100, purpose: 'hint', refresh: 'never',
    source: 'https://zkillboard.com/corporation/123/', captured_on: null,
    acquisition: { state: 'captured', available_count: null, note }, references: [source], entries });
  const organization = { version: 1, kind: 'corporation', id: '123', names: ['Kuan.Dai.Shan', '宽带山'], observations: [], references: [source],
    account_groups: [{ label: '林先登', as_of: null, source, scope: '公开分组，不是现役名册', character_ids: ['42', '43'] }],
    rankings: [ranking('all-time', null, [{ rank: 1, character_id: '42', kills: '1', isk: null }]),
      ranking('monthly', '2025-09', [{ rank: 1, character_id: '43', kills: '9', isk: null }, { rank: 2, character_id: '42', kills: '8', isk: null }]),
      ranking('monthly', '2025-10', [], '来源已取，返回空榜')] };
  put('docs/corporations/123.json', organization);
  for (const [id, record] of Object.entries(characters.records)) put(characterArchivePath(id), { version: 1, records: { [id]: record } });
  return { root, put, organization, characters, source };
}

test('按历史月份分页，空榜仍有取得记录，不把查询分页当Top范围', t => {
  const { root } = fixture(t);
  const result = rankingMembers(root, '123', { scope: 'monthly', period: '2025-09', limit: 1, offset: 1 });
  assert.equal(result.total, 2);
  assert.equal(result.records[0].character_id, '42');
  assert.equal(result.rankings[0].target, 100);
  const empty = run(root, ['members', '123', '--scope', 'monthly', '--period', '2025-10']);
  assert.equal(empty.total, 0);
  assert.equal(empty.rankings.length, 1);
  assert.match(empty.rankings[0].acquisition.note, /空榜/);
  const absent = run(root, ['members', '123', '--period', '2025-11']);
  assert.equal(absent.rankings.length, 0);
  assert.equal(run(root, ['show', '123']).rankings[0].entries, undefined);
});

test('跨军团复用一份角色调查，当前人物身份从正式档案读取而不采信旧状态', t => {
  const { root, put, organization } = fixture(t);
  put('src/people/demo/demo.md', '正文。');
  put('src/people/demo/42-id.json', { id: 42, name: 'Pilot A', person: { cn_name: '甲' }, identity: { version: 1, alts: [], accounts: {} } });
  put('src/people/demo/materials-demo.md', '# 本人素材');
  put('docs/corporations/122.json', { ...organization, id: '122', names: ['Other Corp'] });
  const character = characterDetails(root, '42');
  assert.equal(character.current_identity.person, 'demo');
  assert.match(character.review.findings[0].note, /旧表称未收录/);
  assert.equal(character.review.state, 'legacy');
  assert.equal(character.appearances.length, 4);
  assert.equal(character.groups.length, 2);
  for (const query of ['123', '宽带山', '林先登', 'pilot a']) assert.ok(findOrganizations(root, query).length > 0);
  assert.equal(findOrganizations(root, '宽带山')[0].id, '123');
});

test('历史原表保留未定实体、候选ID、重复疑似行与原始精度，不强制归团', t => {
  const { root, put, source } = fixture(t);
  const records = [{ table_order: '1', corporation_name: 'Unknown', resolved_corp_id: '', same_name_corp_id_candidate: '999', score_raw: '1.234567890123456789' },
    { table_order: '2', corporation_name: 'Unknown typo', resolved_corp_id: '', same_name_corp_id_candidate: '', score_raw: '1.234567890123456789' }];
  put('docs/corporations/sources/activity-2022-01.json', { version: 1, key: 'activity-2022-01', material: source, records });
  assert.equal(checkArchive(root).valid, true);
  const result = run(root, ['source', 'activity-2022-01', '--limit', '1', '--offset', '1']);
  assert.equal(result.total, 2);
  assert.deepEqual(result.records[0], records[1]);
});

test('结构校验拒绝重复榜、重复角色、假Top50、缺角色和失效引用', t => {
  const { root, put, organization } = fixture(t);
  assert.equal(checkArchive(root).ranking_entries, 3);
  const invalid = change => {
    const copy = structuredClone(organization); change(copy);
    put('docs/corporations/123.json', copy);
  };
  invalid(copy => copy.rankings.push(copy.rankings[0]));
  assert.throws(() => checkArchive(root), /榜单重复/);
  invalid(copy => copy.rankings[0].entries.push({ rank: 2, character_id: '42' }));
  assert.throws(() => checkArchive(root), /重复/);
  invalid(copy => copy.rankings[0].target = 50);
  assert.throws(() => checkArchive(root), /Top 100/);
  invalid(copy => copy.rankings[0].refresh = 'yearly');
  assert.throws(() => checkArchive(root), /固定hint/);
  invalid(copy => copy.rankings[0].entries[0].character_id = '999');
  assert.throws(() => checkArchive(root), /无共享记录/);
  invalid(copy => copy.references.push('docs/missing.md'));
  assert.throws(() => checkArchive(root), /引用不存在/);
  invalid(copy => copy.rankings[0].period = '2026-09');
  assert.throws(() => checkArchive(root), /月份口径/);
  invalid(copy => copy.rankings[1].period = '2026-13');
  assert.throws(() => checkArchive(root), /月份口径/);
  invalid(copy => copy.kind = 'alliance');
  assert.throws(() => checkArchive(root), /类型错误/);
  invalid(copy => copy.rankings[1].acquisition.available_count = 1);
  assert.throws(() => checkArchive(root), /来源数量错误/);
  invalid(copy => copy.rankings[0].entries[0].kills = 9007199254740992);
  assert.throws(() => checkArchive(root), /原始字符串/);
  put('docs/corporations/123.json', organization);
  put('docs/corporations/characters/42.json', { version: 2, records: {} });
  assert.throws(() => checkArchive(root), /42.json.*版本/);
});

test('单人和榜单当页只读取所需分片，组织精确查询不读角色全集', t => {
  const { root, put, characters } = fixture(t);
  const sameShard = { ...characters.records['42'], id: '142', names: ['Same shard'] };
  put('docs/corporations/characters/42.json', { version: 1, records: { '42': characters.records['42'], '142': sameShard } });
  put('docs/corporations/characters/43.json', '{broken');
  put('docs/corporations/characters/99.json', '{unrelated');
  assert.equal(characterArchivePath('7'), 'docs/corporations/characters/07.json');
  assert.equal(characterArchivePath('2120638286'), 'docs/corporations/characters/86.json');
  assert.deepEqual(Object.keys(readCharacters(root, ['42'])), ['42']);
  assert.equal(characterDetails(root, '42').id, '42');
  assert.equal(run(root, ['list', '宽带山']).records[0].id, '123');
  assert.equal(run(root, ['list']).total, 1);
  assert.equal(run(root, ['show', '123']).id, '123');
  const page = rankingMembers(root, '123', { scope: 'monthly', period: '2025-09', limit: 1, offset: 1 });
  assert.equal(page.records[0].character.id, '42');
  assert.throws(() => rankingMembers(root, '123', { scope: 'monthly', period: '2025-09', limit: 1 }), /43.json/);
  assert.throws(() => readCharacters(root), /43.json/);
});

test('分片校验拒绝放错位置的角色和旧全员总表', t => {
  const { root, put, characters } = fixture(t);
  put('docs/corporations/characters/43.json', { version: 1, records: { '42': characters.records['42'] } });
  assert.throws(() => checkArchive(root), /43.json.*42.*归属错误/);
  put('docs/corporations/characters/43.json', { version: 1, records: { '43': characters.records['43'] } });
  put('docs/corporations/characters.json', characters);
  assert.throws(() => checkArchive(root), /旧角色总表.*已停用/);
});

test('帮助不读取档案，无刷新入口，参数错误和损坏数据明确失败', t => {
  const { root, put } = fixture(t);
  put('docs/corporations/123.json', '{broken');
  assert.equal(typeof run(root, ['--help']), 'string');
  assert.throws(() => run(root, ['refresh', '123']), /请指定/);
  assert.throws(() => run(root, ['list', '--refresh']), /未知选项/);
  assert.throws(() => run(root, ['list', '--limit', '0']), /limit/);
  assert.throws(() => run(root, ['list', '--limit', '101']), /limit/);
  assert.throws(() => run(root, ['list', '--period', '2026-09']), /不支持/);
  assert.throws(() => run(root, ['members', '123', '--scope', 'unknown']), /scope/);
  assert.throws(() => run(root, ['source', '../characters']), /来源key/);
  assert.throws(() => run(root, ['check']), /123.json/);
});
