import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { combatRoster, normalizeCombatStats, summarizePerson, distribution, collectCombat } from './person-combat-data.mjs';

const person = {
  slug: 'sample', name: '样本', characterId: 1, tier: 'A', birthday: '2020-01-01T00:00:00Z',
  characters: [{ id: 1, role: 'main' }, { id: 2, role: 'alt' }],
};
const record = (id, isk, solo) => ({
  id, observedAt: '2026-11-10T00:00:00Z',
  stats: { kills: 100, losses: 5, iskDestroyed: isk, soloKills: solo, lastActiveMonth: '2026-01' },
});

test('全仓名单包含没有雷达的列传和超过两个的全部确认小号', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'person-combat-'));
  try {
    for (const [slug, id, alts] of [['first', 1, [2, 3, 4]], ['second', 10, []]]) {
      const directory = path.join(root, 'src/people', slug);
      fs.mkdirSync(directory, { recursive: true });
      fs.writeFileSync(path.join(directory, slug + '.md'), '人物正文。\n');
      fs.writeFileSync(path.join(directory, 'materials.json'), '{}\n');
      fs.writeFileSync(path.join(directory, id + '-id.json'), JSON.stringify({ id, name: slug, person: { cn_name: slug }, identity: {
        version: 1, alts: alts.map(alt => ({ id: alt, name: 'alt' + alt, sources: ['materials.json'] })), accounts: {},
      } }));
    }
    const roster = combatRoster(root);
    assert.equal(roster.length, 2);
    assert.equal(roster[0].tier, null);
    assert.deepEqual(roster[0].characters.map(character => character.id), [1, 2, 3, 4]);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('stats 拒绝错号、错误响应和不可能的 Solo，不将失败当零', () => {
  assert.throws(() => normalizeCombatStats({ error: 'Invalid type or id' }, 1));
  assert.throws(() => normalizeCombatStats({ type: 'characterID', id: 2, months: {} }, 1));
  assert.throws(() => normalizeCombatStats({ type: 'characterID', id: 1, months: {}, shipsDestroyed: 1, soloKills: 2 }, 1));
  const stats = normalizeCombatStats({ type: 'characterID', id: 1, months: {}, soloKills: 0 }, 1);
  assert.equal(stats.kills, 0);
  assert.equal(stats.lastActiveMonth, null);
});

test('月度活跃、旗舰目标数与字段省略分别处理', () => {
  const stats = normalizeCombatStats({ type: 'characterID', id: 1, shipsDestroyed: 10, soloKills: 3, iskDestroyed: 200,
    months: { 202612: { shipsDestroyed: 0 }, 202601: { shipsLost: 1 }, 202602: { shipsDestroyed: 10 } },
    groups: { 30: { shipsDestroyed: 2 } } }, 1);
  assert.equal(stats.firstActiveMonth, '2026-01');
  assert.equal(stats.lastActiveMonth, '2026-02');
  assert.equal(stats.activeMonths, 2);
  assert.equal(stats.capitalKills.titan, 2);
});

test('全角色求和并标注重叠；年均复用站内起止月份与两年下限', () => {
  const result = summarizePerson(person, { 1: record(1, 60e12, 10), 2: record(2, 6e12, 5) });
  assert.equal(result.state, 'complete');
  assert.equal(result.kills, 200);
  assert.equal(result.soloKills, 15);
  assert.equal(result.yearlyIskDestroyed, 11e12);
  assert.equal(result.annualYears, 6);
  assert.equal(result.overlapPossible, true);
  const young = summarizePerson({ ...person, birthday: '2025-12-01T00:00:00Z' }, { 1: record(1, 60e12, 10), 2: record(2, 6e12, 5) });
  assert.equal(young.yearlyIskDestroyed, 33e12);
  assert.equal(young.annualYears, 2);
});

test('缺一个小号不得把小计当人物总数；缺生日不得伪造年均', () => {
  const result = summarizePerson(person, { 1: record(1, 60e12, 10) });
  assert.equal(result.state, 'partial');
  assert.equal(result.kills, null);
  assert.equal(result.soloKills, null);
  assert.equal(result.yearlyIskDestroyed, null);
  assert.deepEqual(result.missingCharacterIds, [2]);
  const zero = record(1, 0, null);
  zero.stats.kills = 0;
  const unknownSolo = summarizePerson({ ...person, characters: [{ id: 1 }] }, { 1: zero });
  assert.equal(unknownSolo.soloRatio, null);
  assert.equal(summarizePerson({ ...person, birthday: null }, { 1: record(1, 1, 1), 2: record(2, 1, 1) }).yearlyIskDestroyed, null);
});

test('分布保留零值，排除未知和负值', () => {
  assert.deepEqual(distribution([0, 10, null, -1, 20]), { count: 3, min: 0, p25: 5, median: 10, p75: 15, p90: 18, p95: 19, max: 20 });
});

test('采集复用完整记录；403 后保留已有数据并立即停止', async () => {
  const database = { characters: { 1: record(1, 100, 2) } };
  let calls = 0;
  let saves = 0;
  const result = await collectCombat('.', [person], database, {
    request: async () => { calls++; throw new Error('HTTP 403'); },
    save: async () => { saves++; },
  });
  assert.equal(calls, 1);
  assert.equal(saves, 1);
  assert.equal(result.stopped, true);
  assert.equal(database.characters[1].stats.iskDestroyed, 100);
  assert.equal(database.characters[2].lastError.message, 'HTTP 403');
});

test('无有效统计的角色保留未知，继续既定名单且续跑不重复请求', async () => {
  const database = { characters: {} };
  let calls = 0;
  const options = {
    request: async url => {
      calls++;
      return { ok: true, json: async () => url.includes('/1/') ? { error: 'Invalid type or id' }
        : { type: 'characterID', id: 2, shipsDestroyed: 5, soloKills: 1, months: {} } };
    },
    save: async () => {},
  };
  const result = await collectCombat('.', [person], database, options);
  assert.equal(result.stopped, false);
  assert.equal(calls, 2);
  assert.equal(database.characters[1].unavailable, true);
  assert.equal(database.characters[1].stats, undefined);
  assert.equal(database.characters[2].stats.kills, 5);
  assert.equal((await collectCombat('.', [person], database, options)).requested, 0);
  assert.equal(calls, 2);
});
