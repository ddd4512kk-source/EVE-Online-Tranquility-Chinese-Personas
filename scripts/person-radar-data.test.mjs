import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  MONITOR_QUERY_VERSION,
  buildFacts,
  buildRadarRoster,
  collectMonitorKillmails,
  matchMonitorDaysToBattles,
  summarizeMonitorKillmails,
  summarizeRecentActivity,
  summarizeZkillStats,
  buildFactsComparisonTsv,
} from './person-radar-data.mjs';

function personArchive({ id, tags = [], alts = [], command = 'B' }) {
  return {
    id,
    name: `Pilot ${id}`,
    identity: { alts },
    person: {
      cn_name: `人物${id}`,
      tags,
      radar: { axes: { command: { tier: command }, combat: { tier: 'A' } } },
    },
  };
}

function monitorKillmail(killmailId, time, systemId = 30000142) {
  return {
    killmail_id: killmailId,
    killmail_time: time,
    solar_system_id: systemId,
    victim: { ship_type_id: 587 },
  };
}

function characterMonitorKillmail(killmailId, time, side, characterId = 42) {
  return side === 'kills'
    ? {
      ...monitorKillmail(killmailId, time),
      attackers: [{ character_id: characterId, ship_type_id: 45534 }],
    }
    : {
      ...monitorKillmail(killmailId, time),
      victim: { character_id: characterId, ship_type_id: 45534 },
    };
}

test('名单按 FC 标签与正文提及分两阶段，副号只取已确认且战斗活跃度最高的两名', t => {
  const directory = mkdtempSync(path.join(tmpdir(), 'person-radar-roster-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const makePerson = (slug, archive, body) => {
    const folder = path.join(directory, slug);
    mkdirSync(folder);
    writeFileSync(path.join(folder, `${archive.id}-id.json`), JSON.stringify(archive));
    writeFileSync(path.join(folder, `${slug}.md`), body);
  };
  makePerson('fc-pilot', personArchive({
    id: 10,
    tags: ['著名FC'],
    alts: [
      { id: 12, name: '次号', zkb: { kills: 10 } },
      { id: 11, name: '主力小号', zkb: { kills: 80 } },
      { id: 13, name: '另一小号', zkb: { kills: 30 } },
    ],
  }), '此人长期担任舰队指挥。');
  makePerson('mentioned-pilot', personArchive({ id: 20, tags: [] }), '他在大战中实际指挥一支舰队。');
  makePerson('ordinary-pilot', personArchive({ id: 30, tags: [] }), '---\ntags: [指挥]\n---\n他只在舰队中担任后勤支援。');

  const fc = buildRadarRoster({ peopleDirectory: directory, phase: 'fc' });
  const mentioned = buildRadarRoster({ peopleDirectory: directory, phase: 'mentioned' });
  assert.deepEqual(fc.map(person => person.characterId), [10]);
  assert.deepEqual(fc[0].confirmedAlts.map(alt => alt.id), [11, 13]);
  assert.equal(fc[0].unselectedConfirmedAltCount, 1);
  assert.deepEqual(mentioned.map(person => person.characterId), [10, 20]);
});

test('从 stats 快照提取全量击杀、solo、ISK、指定旗舰类别和最近活跃月', () => {
  const stats = {
    shipsDestroyed: 1234,
    shipsLost: 78,
    iskDestroyed: 987654321,
    soloKills: 34,
    groups: {
      485: { shipsDestroyed: 4 },
      547: { shipsDestroyed: 3 },
      1538: { shipsDestroyed: 2 },
      659: { shipsDestroyed: 1 },
      30: { shipsDestroyed: 5 },
    },
    months: {
      202001: { shipsLost: 2 },
      202504: { shipsDestroyed: 4 },
    },
  };
  assert.deepEqual(summarizeZkillStats(stats), {
    kills: 1234,
    losses: 78,
    iskDestroyed: 987654321,
    soloKills: 34,
    capitalKills: { dreadnought: 4, carrier: 3, forceAuxiliary: 2, supercarrier: 1, titan: 5 },
    lastActiveMonth: '202504',
    firstActiveMonth: '202001',
  });
  assert.throws(() => summarizeZkillStats({}), /缺少 groups 或 months/);
});

test('从 zKillboard 最新在场记录提取精确最近活跃时间', () => {
  assert.equal(summarizeRecentActivity([
    { killmail_time: '2026-11-09T12:34:56Z' },
    { killmail_time: '2026-11-08T12:34:56Z' },
  ]), '2026-11-09T12:34:56Z');
  assert.equal(summarizeRecentActivity([]), null);
});

test('Monitor 记录去重、按 UTC 日期计天并保留首次与最近时间', () => {
  const summary = summarizeMonitorKillmails([
    monitorKillmail(2, '2021-03-11T23:59:59Z'),
    monitorKillmail(1, '2020-01-05T00:10:00Z'),
    monitorKillmail(2, '2021-03-11T23:59:59Z'),
    monitorKillmail(3, '2021-03-12T00:00:01Z'),
  ]);
  assert.equal(summary.monitorKillmailCount, 3);
  assert.equal(summary.monitorDays, 3);
  assert.equal(summary.firstMonitorAt, '2020-01-05T00:10:00Z');
  assert.equal(summary.lastMonitorAt, '2021-03-12T00:00:01Z');
  assert.equal(summarizeMonitorKillmails([{
    killmailId: 4,
    time: '2022-04-05T06:07:08Z',
    systemId: 30000142,
    victimShipTypeId: 587,
  }]).monitorDays, 1);
});

test('Monitor 页面分页持续读取到末页，保留可续跑时的页数上限状态', async () => {
  const requested = [];
  const fetchJson = async url => {
    requested.push(url);
    if (url.includes('/kills/') && url.endsWith('/page/1/')) return [
      ...Array.from({ length: 199 }, (_, index) => characterMonitorKillmail(index + 1, '2020-01-01T00:00:00Z', 'kills')),
      { ...monitorKillmail(200, '2020-01-01T00:00:00Z'), victim: { ship_type_id: 45534 }, attackers: [{ character_id: 42, ship_type_id: 587 }] },
    ];
    if (url.includes('/kills/')) return [characterMonitorKillmail(201, '2020-01-02T00:00:00Z', 'kills')];
    return [
      characterMonitorKillmail(202, '2020-01-02T00:00:00Z', 'losses'),
      { ...monitorKillmail(203, '2020-01-02T00:00:00Z'), victim: { character_id: 42, ship_type_id: 587 }, attackers: [{ ship_type_id: 45534 }] },
    ];
  };
  const result = await collectMonitorKillmails(42, { fetchJson, minimumIntervalMs: 0 });
  assert.equal(requested.length, 3);
  assert.equal(result.monitorKillmailCount, 201);
  assert.equal(result.monitorDays, 2);
  assert.equal(result.capped, false);
  assert.match(requested[0], /characterID\/42\/shipTypeID\/45534\/page\/1/);
  assert.match(requested[2], /losses\/characterID\/42\/shipTypeID\/45534\/page\/1/);
});

test('Monitor 记录只在日期和已解析星系 ID 同时一致时关联站内战役', () => {
  const monitor = summarizeMonitorKillmails([monitorKillmail(9, '2020-01-01T05:00:00Z', 30000142)]);
  const battles = [
    { id: 'same-date-other-system', title: '同日另一星系', start: '2020-01-01', systems: [30000143] },
    { id: 'match', title: '对应战役', start: '2020-01-01', systems: ['Jita'] },
    { id: 'other-date', title: '另一日', start: '2020-01-02', systems: [30000142] },
  ];
  assert.deepEqual(matchMonitorDaysToBattles(monitor, battles, new Map([['Jita', 30000142]])), [
    { id: 'match', title: '对应战役', date: '2020-01-01', matchedMonitorKillmails: 1 },
  ]);
});

test('事实表保留每个角色的数字、来源、抓取时间和口径版本', () => {
  const person = {
    characterId: 42,
    confirmedAlts: [],
  };
  const zkill = { kills: 123, lastActiveAt: '2026-11-09T12:00:00Z' };
  const monitor = {
    monitorDays: 1,
    killmails: [{ killmailId: 11, time: '2026-11-09T12:00:00Z', systemId: 30000142, victimShipTypeId: 587 }],
    capped: false,
  };
  const facts = buildFacts([person], new Map([[42, {
    characterId: 42,
    zkill,
    monitor,
    monitorQueryVersion: MONITOR_QUERY_VERSION,
    sources: { stats: 'stats-source', recentActivity: 'recent-source' },
    fetchedAt: '2026-11-10T00:00:00Z',
  }]]));
  assert.equal(facts[0].dataState, 'complete');
  assert.equal(facts[0].characters[0].zkill, zkill);
  assert.equal(facts[0].characters[0].monitor, monitor);
  assert.equal(facts[0].monitor.monitorDays, 1);
  assert.equal(facts[0].characters[0].monitorQueryVersion, MONITOR_QUERY_VERSION);
  assert.deepEqual(facts[0].characters[0].sources, { stats: 'stats-source', recentActivity: 'recent-source' });
  assert.equal(facts[0].characters[0].fetchedAt, '2026-11-10T00:00:00Z');
});
test('横向 TSV 合并两阶段名单、保留最新记录并将部分统计标为已取小计', () => {
  const older = {
    slug: 'pilot',
    name: '试飞员',
    characterId: 10,
    fcTagged: true,
    famousFCTag: true,
    commandMentioned: false,
    currentCombatTier: 'B',
    currentCommandTier: 'C',
    confirmedAlts: [{ id: 11, name: '小号' }],
    unselectedConfirmedAltCount: 1,
    dataState: 'partial',
    characters: [{ id: 10, fetchedAt: '2026-11-09T00:00:00Z', zkill: { kills: 1 } }],
    monitor: { monitorDays: 1, firstMonitorAt: '2026-01-01T00:00:00Z', lastMonitorAt: '2026-01-01T00:00:00Z', battles: [] },
  };
  const latest = {
    ...older,
    commandMentioned: true,
    currentCommandTier: 'A',
    characters: [
      {
        id: 10,
        fetchedAt: '2026-11-10T00:00:00Z',
        zkill: {
          kills: 123, losses: 4, iskDestroyed: 500, soloKills: 7,
          capitalKills: { dreadnought: 2, carrier: 0, forceAuxiliary: 0, supercarrier: 0, titan: 0 },
          firstActiveMonth: '202001', lastActiveMonth: '202611',
        },
      },
      { id: 11, fetchedAt: '2026-11-10T00:00:00Z', zkill: undefined },
    ],
    monitor: {
      monitorDays: 8,
      firstMonitorAt: '2022-01-01T00:00:00Z',
      lastMonitorAt: '2026-01-01T00:00:00Z',
      battles: [{ id: 'battle', date: '2026-01-01', matchedMonitorKillmails: 3 }],
    },
  };
  const tsv = buildFactsComparisonTsv([
    { phase: 'fc', facts: [older] },
    { phase: 'mentioned', facts: [latest] },
  ], new Map([['pilot', { currentCombatTier: 'S', currentCommandTier: 'B' }]]));
  const [header, row] = tsv.trimEnd().split('\n');
  const headers = header.split('\t');
  const cells = row.split('\t');
  const at = key => cells[headers.indexOf(key)];
  assert.equal(cells.length, headers.length);
  assert.equal(at('名单阶段'), 'FC标签、正文提指挥');
  assert.equal(at('当前战斗力'), 'S');
  assert.equal(at('当前统御力'), 'B');
  assert.equal(at('有stats角色数'), '1/2');
  assert.equal(at('缺失stats角色ID'), '11');
  assert.equal(at('击杀合计或已取小计'), '123');
  assert.equal(at('Monitor UTC日期'), '8');
  assert.equal(at('匹配Monitor KM条数'), '3');
  assert.equal(at('匹配战役明细'), 'battle@2026-01-01#3');
  assert.equal(at('其他已确认小号数'), '1');
});

