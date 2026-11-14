import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { titanQuery, rosterRanking, applyRoster, targetCorporations, hasRoster, esiProfile, rosterPilots, annotatePilots } from '../titan-roster.mjs';
import { checkArchive, characterArchivePath } from '../../corporation-archive.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'titan-roster-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (file, data) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), JSON.stringify(data, null, 2) + '\n');
  };
  const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  put('docs/corporations/123.json', { version: 1, kind: 'corporation', id: '123', names: ['Archived Corp'], rankings: [], account_groups: [], observations: [], references: [] });
  put(characterArchivePath('42'), { version: 1, records: { 42: { id: '42', names: ['Old Name'], labels: ['头衔'], profiles: [], evidence: [],
    review: { state: 'reviewed', findings: [], next_steps: [] } } } });
  put('src/corps/demo/demo.json', { corp: { id: 456, cn_name: '演示' }, esi: { name: 'Demo Corp', ticker: 'DEMO' } });
  put('src/corps/same/same.json', { corp: { id: 123, cn_name: '重复' }, esi: { name: 'Archived Corp' } });
  return { root, put, read };
}

test('查询只点名本团与泰坦船组，不带关联者', () => {
  const { filters, source } = titanQuery(98626718);
  assert.deepEqual(filters.attackers, [{ type: 'corporationID', id: 98626718 }, { type: 'groupID', id: 30 }]);
  assert.equal(filters.includeAssociates, false);
  assert.equal(filters.radios['group-agg-type'], 'attackers only');
  assert.equal(filters.epochbtn, 'alltime');
  assert.match(decodeURIComponent(source), /"attackersonly"/);
  assert.doesNotMatch(decodeURIComponent(source), /includeAssociates/);
  assert.throws(() => titanQuery('12a'), /正整数/);
});

test('名单写进档案并通过校验；已有角色记录不改，缺的建最简记录', t => {
  const { root, read } = fixture(t);
  const rows = [{ rank: 1, id: 42, name: 'New Name', count: 30 }, { rank: 2, id: 7, name: 'Fresh', count: 2 }];
  const ranking = rosterRanking({ source: titanQuery(123).source, capturedOn: '2026-11-15', rows });
  assert.deepEqual(applyRoster(root, { id: '123', names: null, ranking, rows }), { written: true, added: ['7'] });
  const stored = read('docs/corporations/123.json').rankings[0];
  assert.deepEqual(stored.entries[0], { rank: 1, character_id: '42', kills: '30', isk: null });
  assert.equal(stored.acquisition.available_count, 2);
  assert.deepEqual(read(characterArchivePath('42')).records['42'].names, ['Old Name']);
  assert.deepEqual(read(characterArchivePath('42')).records['42'].labels, ['头衔', '泰坦驾驶员']);
  assert.deepEqual(read(characterArchivePath('7')).records['7'].labels, ['泰坦驾驶员']);
  assert.equal(read(characterArchivePath('7')).records['7'].review.state, 'unread');
  assert.equal(checkArchive(root).ranking_entries, 2);
  assert.equal(hasRoster(root, '123'), true);
  // 重取原位替换，不叠第二份。
  applyRoster(root, { id: '123', names: null, ranking: rosterRanking({ source: ranking.source, capturedOn: '2026-12-01', rows: rows.slice(0, 1) }), rows: rows.slice(0, 1) });
  assert.equal(read('docs/corporations/123.json').rankings.length, 1);
  assert.equal(checkArchive(root).ranking_entries, 1);
  const tampered = read('docs/corporations/123.json');
  tampered.rankings[0].target = 100;
  fs.writeFileSync(path.join(root, 'docs/corporations/123.json'), JSON.stringify(tampered));
  assert.throws(() => checkArchive(root), /全名单/);
});

test('无档案军团有泰坦才建档，空名单不建；满500行记作部分取得', t => {
  const { root, read } = fixture(t);
  assert.deepEqual(targetCorporations(root), [{ id: '123', names: null }, { id: '456', names: ['Demo Corp', 'DEMO', '演示'] }]);
  const empty = rosterRanking({ source: titanQuery(456).source, capturedOn: '2026-11-15', rows: [] });
  assert.deepEqual(applyRoster(root, { id: '456', names: ['Demo Corp'], ranking: empty, rows: [] }), { written: false, added: [] });
  assert.equal(fs.existsSync(path.join(root, 'docs/corporations/456.json')), false);
  const rows = [{ rank: 1, id: 9, name: 'Pilot', count: 1 }];
  applyRoster(root, { id: '456', names: ['Demo Corp', 'DEMO'], ranking: rosterRanking({ source: empty.source, capturedOn: '2026-11-15', rows }), rows });
  assert.deepEqual(read('docs/corporations/456.json').names, ['Demo Corp', 'DEMO']);
  checkArchive(root);
  const full = rosterRanking({ source: empty.source, capturedOn: null, rows: Array.from({ length: 500 }, (_, i) => ({ rank: i + 1, id: i + 1, name: 'P', count: 1 })) });
  assert.equal(full.acquisition.state, 'partial');
  assert.equal(full.acquisition.available_count, null);
});

test('ESI 名片同既有格式，只给缺当前名片的驾驶员补，补过不再列出', t => {
  const { root, read } = fixture(t);
  assert.deepEqual(esiProfile('7', { title: '', corporation_id: 123, alliance_id: 99 }, '2026-11-15'), {
    as_of: '2026-11-15', title: '', title_state: 'empty', description: null, description_state: 'absent', corporation_id: '123', alliance_id: '99',
    source: 'https://esi.evetech.net/latest/characters/7/', source_key: 'esi-current:2026-11-15' });
  const rows = [{ rank: 1, id: 42, name: 'Old', count: 3 }, { rank: 2, id: 7, name: 'Fresh', count: 1 }];
  applyRoster(root, { id: '123', names: null, ranking: rosterRanking({ source: titanQuery(123).source, capturedOn: '2026-11-15', rows }), rows });
  assert.deepEqual(rosterPilots(root).sort(), ['42', '7']);
  assert.deepEqual(annotatePilots(root, rosterPilots(root)).sort(), ['42', '7']);
  const profile = esiProfile('7', { title: '舰长', description: '简介', corporation_id: 123 }, '2026-11-15');
  annotatePilots(root, ['7'], new Map([['7', profile]]));
  assert.equal(read(characterArchivePath('7')).records['7'].profiles[0].title, '舰长');
  assert.deepEqual(annotatePilots(root, rosterPilots(root)), ['42']);
  checkArchive(root);
});
