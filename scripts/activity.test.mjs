import assert from 'node:assert/strict';
import { test } from 'node:test';
import { activityText, combatText, corpAllianceChips, corpBattles, corpKey, corpMembers, corpStatus, corpZoneChips, corpZones, corpsOfPerson, decodeCorpDescription, describesInviteOnly, qqGroupFromDescription, describesRecruiting, groupCorps, killCount, personActivity, personCombat, personStatusTags, personUpzhu, statusChips, upzhuText, zoneKeysFromLabels } from './activity.mjs';

const zkb = (last_active, as_of = '2026-11-05') => ({ kills: 1, lost: 1, isk_destroyed: 1, last_active, as_of });

test('人物活跃看收录号与小号里最晚的记录，十二个月为界', () => {
  assert.equal(personActivity({ zkb: zkb('2025-11') }).state, 'active');
  assert.equal(personActivity({ zkb: zkb('2025-10') }).state, 'dormant');
  const viaAlt = personActivity({ zkb: zkb('2019-03'), alts: [{ zkb: zkb('2026-10') }] });
  assert.deepEqual(viaAlt, { state: 'active', lastActive: '2026-10', asOf: '2026-11-05' });
});

test('跨年按月份差计算', () => {
  assert.equal(personActivity({ zkb: zkb('2025-02', '2026-02-01') }).state, 'active');
  assert.equal(personActivity({ zkb: zkb('2025-01', '2026-02-01') }).state, 'dormant');
});

test('有快照但从无击杀算沉寂，没有快照不下判断', () => {
  assert.equal(personActivity({ zkb: zkb('') }).state, 'dormant');
  assert.equal(personActivity({ zkb: undefined, alts: [] }).state, 'unknown');
  assert.equal(personActivity(undefined).state, 'unknown');
});

test('战神按主号与小号合计击杀总值满 10 万亿或年均满 1.5 万亿判定，至少按两年折算', () => {
  const highTotal = personCombat({
    zkb: { isk_destroyed: 6e12, last_active: '2026-10', as_of: '2026-11-05' },
    alts: [{ zkb: { isk_destroyed: 4.5e12, last_active: '2026-11', as_of: '2026-11-05' } }],
  }, '2016-11-01T00:00:00Z');
  assert.equal(highTotal.wargod, true);
  assert.equal(combatText(highTotal), '战神：参与击杀 10.5 万亿 ISK（年均 1.1 万亿）');

  const highYearly = personCombat({
    zkb: { isk_destroyed: 4.5e12, last_active: '2026-11', as_of: '2026-11-05' },
  }, '2023-11-01T00:00:00Z');
  assert.equal(highYearly.wargod, true);
  assert.equal(combatText(highYearly), '战神：参与击杀 4.5 万亿 ISK（年均 1.5 万亿）');

  const shortSpan = personCombat({
    zkb: { isk_destroyed: 2.4e12, last_active: '2026-11', as_of: '2026-11-05' },
  }, '2026-05-01T00:00:00Z');
  assert.equal(shortSpan.wargod, false);
  assert.equal(combatText(shortSpan), '');
});

test('UP 主看已确认账号下按 BV 去重后播放满 3000 的 EVE 视频是否满 10 条', () => {
  const videos = Array.from({ length: 10 }, (_, i) => ({ bvid: `BV100000000${i}`, views: 3200, owner_uid: 100 }));
  const profile = {
    uid: 100,
    identity: { state: 'confirmed', person: 'eve-creator' },
    videos: [...videos.slice(0, 8), { bvid: 'BVother', views: 99999, owner_uid: 999 }],
    channel: { listings: [{ candidates: [...videos.slice(5), { bvid: 'BVlow', views: 2999 }] }] },
  };
  const up = personUpzhu([profile], 'eve-creator');
  assert.deepEqual(up, { upzhu: true, count: 10 });
  assert.equal(upzhuText(up), 'UP主：B 站高播 EVE 视频 10 条');
  assert.deepEqual(personUpzhu([profile], 'other-person'), { upzhu: false, count: 0 });
  assert.deepEqual(personUpzhu([{ ...profile, identity: { state: 'confirmed', person: 'ozen-wand' } }], 'ozen-wand'), { upzhu: false, count: 0 });
});

test('筛选标签组合各独立身份标记', () => {
  assert.deepEqual(
    personStatusTags({ state: 'active' }, { famous: true, wargod: true, tycoon: true, shenren: true, upzhu: true }),
    ['活跃', '名人', '战神', '大亨', '神人', 'UP主'],
  );
  assert.deepEqual(personStatusTags({ state: 'dormant' }, { wargod: true }), ['沉寂', '战神']);
  assert.deepEqual(personStatusTags({ state: 'dormant' }), ['沉寂']);
  assert.deepEqual(personStatusTags({ state: 'unknown' }, { famous: true }), ['名人']);
});

test('状态文字与筛选计数', () => {
  assert.equal(activityText({ state: 'active', lastActive: '2026-10' }), '活跃：最近击杀 2026-10');
  assert.equal(activityText({ state: 'dormant', lastActive: '' }), '沉寂：没有击杀记录');
  assert.equal(activityText({ state: 'unknown' }), '');
  const people = [
    { data: { statusTags: ['活跃', '名人', '战神'] } },
    { data: { statusTags: ['沉寂', '大亨', '神人', 'UP主'] } },
    { data: {} },
  ];
  assert.deepEqual(statusChips(people).map(chip => chip.count), [1, 1, 1, 1, 1, 1, 1]);
});

test('招新要有群号；一年内的帖子直接算，更老的帖子还要今年某月超过 10 人上 KB，帖子最多算三年', () => {
  const live = zkb('2026-11');
  const pilots = { year: 2026, peak: 11 };
  const post = last_seen => ({ last_seen, qq: '123456' });
  assert.equal(corpStatus({ zkb: live, recruitment: post('2023-11-01'), pilots }).group, 'recruiting');
  assert.equal(corpStatus({ zkb: live, recruitment: post('2023-10-31'), pilots }).group, 'active');
  assert.equal(corpStatus({ zkb: live, recruitment: { last_seen: '2026-10-01' }, pilots }).group, 'active');
  assert.equal(corpStatus({ zkb: live, esi: { qq: '123456' }, pilots }).group, 'recruiting');
  assert.equal(corpStatus({ zkb: live, recruitment: post('2026-10-01'), esi: { invite_only: true }, pilots }).group, 'recruiting');
  assert.equal(corpStatus({ zkb: live, recruitment: post('2026-10-01'), pilots: { year: 2026, peak: 2 } }).group, 'recruiting');
  assert.equal(corpStatus({ zkb: live, recruitment: post('2026-10-01') }).group, 'recruiting');
  assert.equal(corpStatus({ zkb: live, recruitment: post('2025-11-01') }).group, 'recruiting');
  assert.equal(corpStatus({ zkb: live, recruitment: post('2025-10-01'), pilots: { year: 2026, peak: 10 } }).group, 'active');
  assert.equal(corpStatus({ zkb: live, recruitment: post('2025-10-01'), pilots: { year: 2025, peak: 50 } }).group, 'active');
  assert.equal(corpStatus({ zkb: live, esi: { qq: '123456' } }).group, 'active');
  assert.equal(corpStatus({ zkb: live, esi: { open_recruiting: true } }).group, 'active');
  assert.equal(corpStatus({ zkb: zkb('2026-01'), recruitment: post('2025-10-01'), pilots }).state, 'active');
  assert.equal(qqGroupFromDescription('招新 QQ群：123456789 欢迎'), '123456789');
  assert.equal(qqGroupFromDescription('招募状态：关闭 QQ群 123456789'), '');
  assert.equal(qqGroupFromDescription('成立于 2020 年，击杀 123456789'), '');
  assert.equal(qqGroupFromDescription('招新Q123456789'), '123456789');
  assert.equal(qqGroupFromDescription('诱导：    123456789   CEO 寄语'), '123456789');
  assert.equal(describesInviteOnly('招募状态：仅限邀请'), true);
  assert.equal(describesInviteOnly('Recruitment: Vouch Only'), true);
  assert.equal(describesInviteOnly('[CN OPEN] | [EN Vouch only]'), false);
  assert.equal(describesInviteOnly('常年招新'), false);
});

test('没有招新条件时按 KB 与新帖判断活跃', () => {
  const post = { last_seen: '2026-02-04' };
  assert.equal(corpStatus({ zkb: zkb('2026-11'), recruitment: post }).group, 'active');
  assert.equal(corpStatus({ zkb: zkb('2026-11') }).group, 'active');
  assert.equal(corpStatus({ zkb: zkb('2023-08'), esi: { open_recruiting: true } }).group, 'dormant');
  assert.equal(corpStatus({ zkb: zkb('2023-08'), recruitment: post }).group, 'dormant');
  assert.equal(corpStatus({ zkb: zkb('2023-08'), recruitment: { last_seen: '2026-10-01' } }).group, 'active');
});

test('简介招新只认写明开放的', () => {
  assert.equal(describesRecruiting('本团常年招新，入团联系某某'), true);
  assert.equal(describesRecruiting('Now recruiting pilots'), true);
  assert.equal(describesRecruiting('暂停招新，老友自便'), false);
  assert.equal(describesRecruiting('剑与群星，永不止步'), false);
  assert.equal(describesRecruiting(undefined), false);
  assert.equal(describesRecruiting('招募状态：开放/OPEN'), true);
  assert.equal(describesRecruiting('招募状态 Recruitment: [Closed]'), false);
  assert.equal(describesRecruiting('Recruitment: Vouch Only'), false);
  assert.equal(describesRecruiting('Application is OPEN'), true);
  assert.equal(describesRecruiting(decodeCorpDescription(String.raw`u'招新中'`)), true);
});

test('军团简介还原转义与标签', () => {
  assert.equal(decodeCorpDescription(String.raw`u'Dawn\'s <br>公司'`), "Dawn's  公司");
  assert.equal(decodeCorpDescription('&lt;b&gt;plain&lt;/b&gt;'), ' plain ');
  assert.equal(decodeCorpDescription(undefined), '');
});

test('区域手工优先，否则按近期击杀分布取占比够的', () => {
  const keys = d => corpZones(d).map(z => z.key);
  const zones_recent = { high: 1, low: 30, null: 100, wh: 3, pochven: 0 };
  assert.deepEqual(keys({ zkb: { zones_recent } }), ['null']);
  assert.deepEqual(keys({ zkb: { zones_recent: { wh: 60, null: 30, low: 10 } } }), ['wh', 'null']);
  assert.deepEqual(keys({ corp: { zones: ['high', 'null'] }, zkb: { zones_recent } }), ['high', 'null']);
  assert.deepEqual(keys({ zkb: { zones_recent: { low: 2 }, zones: { high: 500, low: 2 } } }), ['high']);
  assert.deepEqual(keys({ zkb: { zones: { high: 1, low: 1, null: 1, wh: 1, pochven: 1 } } }), ['high']);
  assert.deepEqual(keys({}), []);
  assert.deepEqual(zoneKeysFromLabels({ 'loc:w-space': { shipsDestroyed: 5, shipsLost: 2 }, 'loc:nullsec': { shipsLost: 2 } }), { high: 0, low: 0, null: 2, wh: 7, pochven: 0 });
  const corp = list => ({ data: { zones: list.map(key => ({ key })) } });
  assert.deepEqual(corpZoneChips([corp(['null']), corp(['null', 'wh'])]).map(c => [c.name, c.count]), [['00', 2], ['虫洞', 1]]);
});

test('击杀数上万写万', () => {
  assert.equal(killCount(162243), '16.2 万');
  assert.equal(killCount(3512), '3512');
  assert.equal(killCount(undefined), '0');
});

test('军团战绩与招新都停摆才算沉寂', () => {
  assert.equal(corpStatus({ zkb: zkb('2023-08') }).group, 'dormant');
  assert.equal(corpStatus({}).group, 'dormant');
  assert.equal(corpStatus({ zkb: zkb('2026-11'), esi: { member_count: 20 } }).group, 'dormant');
  assert.equal(corpStatus({ zkb: zkb('2026-11'), esi: { member_count: 21 } }).group, 'active');
});

test('军团分组按固定次序，空组不出现', () => {
  const corp = group => ({ data: { status: { group } } });
  const groups = groupCorps([corp('dormant'), corp('recruiting')]);
  assert.deepEqual(groups.map(g => g.key), ['recruiting', 'dormant']);
});

test('联盟筛选按家数排序，无联盟垫底，筛选词含军团与联盟名', () => {
  const corp = alliance => ({ data: { esi: { alliance } } });
  const dc = { name: 'Dead Coalition', ticker: 'D.C' };
  const chips = corpAllianceChips([corp(null), corp({ name: 'Frat', ticker: 'FRT' }), corp(dc), corp(dc)]);
  assert.deepEqual(chips.map(c => [c.name, c.count]), [['D.C', 2], ['FRT', 1], ['无联盟', 1]]);
  assert.equal(chips[0].title, 'Dead Coalition');
  const key = corpKey({ displayName: '虚构军团', esi: { name: 'Fake Corp', ticker: 'FAKE', alliance: dc } });
  for (const term of ['虚构军团', 'fake corp', 'fake', 'dead coalition', 'd.c']) assert.ok(key.includes(term));
});

test('军团人物分主事、现属、曾属与正文点名，名人排前', () => {
  const person = (history, extra = {}) => ({ data: { char: { history }, ...extra } });
  const now = person([{ corporation_id: 5, end: null }]);
  const star = person([{ corporation_id: 5, end: null }], { famous: true });
  const back = person([{ corporation_id: 5, end: '2020-01-01' }, { corporation_id: 5, end: null }]);
  const old = person([{ corporation_id: 5, end: '2020-01-01' }]);
  const other = person([{ corporation_id: 6, end: null }]);
  const boss = person([], { character_id: 1, identity: { alts: [{ id: 99 }] } });
  const named = person([], { character_id: 2 });
  const { ceo, current, former, mentioned } = corpMembers([now, star, back, old, other, boss, named], 5, { ceoId: 99, linkedIds: [2] });
  assert.deepEqual(ceo, [boss]);
  assert.deepEqual(current, [star, now, back]);
  assert.deepEqual(former, [old]);
  assert.deepEqual(mentioned, [named]);
});

test('参战录按本团出场人数过滤', () => {
  const battle = corpPilots => ({ data: { corpPilots } });
  const big = battle({ 5: 40 });
  const few = battle({ 5: 2 });
  assert.deepEqual(corpBattles([big, few, battle({ 6: 9 })], 5), [{ battle: big, pilots: 40 }]);
  assert.deepEqual(corpBattles(undefined, 5), []);
});

test('人物只反查现属军团，不列过去呆过的军团', () => {
  const corps = [{ data: { corp: { id: 5 } } }, { data: { corp: { id: 6 } } }];
  // 历史上待过 5，当前在 6：只返回 6，不返回 5
  assert.deepEqual(
    corpsOfPerson(corps, {
      history: [
        { corporation_id: 5, end: '2020-01-01' },
        { corporation_id: 6, end: null },
      ],
    }),
    [corps[1]],
  );
  // 已离开玩家军团（left_at 有值）：即便在军团志收录列表中，也不列出
  assert.deepEqual(
    corpsOfPerson(corps, {
      affiliation: { corporation: { id: 6 }, left_at: '2026-01-01' },
      history: [{ corporation_id: 6, end: '2026-01-01' }],
    }),
    [],
  );
  // 活跃在 6（left_at 为空）：返回 6
  assert.deepEqual(
    corpsOfPerson(corps, {
      affiliation: { corporation: { id: 6 }, left_at: null },
    }),
    [corps[1]],
  );
  assert.deepEqual(corpsOfPerson(corps, undefined), []);
});
