import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFilters, parseInput, focusMatcher } from '../zkill-asearch.mjs';

test('网址 # 后的筛选原样译成查询参数，不漏船型项', () => {
  const hash = parseInput('https://zkillboard.com/asearch/#' + encodeURIComponent(JSON.stringify({
    buttons: ['togglefilters', 'custom', 'label-ganked', 'attackers-aand', 'items-and', 'sort-isk', 'sort-asc', 'page1', 'victimsonly'],
    dtstart: '2020-01-01T21:19', dtend: '2023-09-08T21:19', includeAssociates: true,
    attackers: [{ type: 'characterID', id: '1387156123' }, { type: 'shipID', id: 45534, pip: 'pip_tech2.png' }],
  })));
  const filters = buildFilters(hash);
  assert.deepEqual(filters.attackers, [{ type: 'characterID', id: 1387156123 }, { type: 'shipID', id: 45534 }]);
  assert.deepEqual(filters.labels, ['ganked', 'attackers-aand', 'items-and']);
  assert.equal(filters.epochbtn, 'custom');
  assert.deepEqual(filters.epoch, { start: '2020-01-01T21:19', end: '2023-09-08T21:19' });
  assert.deepEqual(filters.radios, { sort: { sortBy: 'isk', sortDir: 'asc' } });
  assert.equal(filters.includeAssociates, true);
});

test('时间预设换算成 UTC 起止，未选时同网页默认 7 天', () => {
  const now = new Date('2026-03-15T12:00:00Z');
  assert.deepEqual(buildFilters({ buttons: ['prior month'] }, now).epoch, { start: '2026-02-01T00:00', end: '2026-02-28T23:59' });
  assert.deepEqual(buildFilters({ buttons: ['previous year'] }, now).epoch, { start: '2025-01-01T00:00', end: '2025-12-31T23:59' });
  assert.equal(buildFilters({ buttons: ['alltime'] }, now).epochbtn, 'alltime');
  assert.equal(buildFilters({}, now).epochbtn, 'week');
});

test('In 栏只认同时满足全部项的同一人，And 栏认点名的角色', () => {
  const monitor = { character_id: 1, ship_type_id: 45534 }, other = { character_id: 1, ship_type_id: 11567 }, fc = { character_id: 2, ship_type_id: 45534 };
  const inMatch = focusMatcher(buildFilters({ buttons: ['attackers-aand'], attackers: [{ type: 'characterID', id: 1 }, { type: 'shipID', id: 45534 }] }));
  assert.deepEqual([monitor, other, fc].map(party => inMatch(party, false)), [true, false, false]);
  assert.equal(inMatch(monitor, true), false);
  const andMatch = focusMatcher(buildFilters({ buttons: ['attackers-and'], attackers: [{ type: 'characterID', id: 1 }], neutrals: [{ type: 'shipID', id: 45534 }] }));
  assert.deepEqual([monitor, other, fc].map(party => andMatch(party, false)), [true, true, false]);
});
