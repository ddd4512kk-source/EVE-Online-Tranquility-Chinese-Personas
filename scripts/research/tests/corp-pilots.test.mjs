import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { busiestMonths, corpPilotsOn, largestMails, localMonthlyPeak } from '../corp-pilots.mjs';

test('只挑今年击杀加损失最多的几个月', () => {
  const months = {
    202512: { shipsDestroyed: 999 },
    202601: { shipsDestroyed: 1 },
    202602: { shipsDestroyed: 5, shipsLost: 5 },
    202603: { shipsLost: 3 },
    202604: { shipsDestroyed: 2 },
  };
  assert.deepEqual(busiestMonths(months, 2026), ['202602']);
  assert.deepEqual(busiestMonths(undefined, 2026), []);
});

test('按参与人数标签先看大场面，并限制条数', () => {
  const mail = (id, labels) => ({ killmail_id: id, zkb: { labels } });
  const sorted = largestMails([mail(1, ['#:1', 'solo']), mail(2, ['#:10+']), mail(3, []), mail(4, ['pvp', '#:5+'])], 3);
  assert.deepEqual(sorted.map(item => item.killmail_id), [2, 4, 1]);
});

test('本地月榜取今年人数最多的一个月，没有档案记 0', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'corp-pilots-'));
  try {
    const entries = count => Array.from({ length: count }, (_, index) => ({ rank: index + 1 }));
    const rankings = [
      { scope: 'monthly', period: '2025-12', entries: entries(40) },
      { scope: 'monthly', period: '2026-03', entries: entries(4) },
      { scope: 'monthly', period: '2026-09', entries: entries(12) },
      { scope: 'all-time', period: null, entries: entries(100) },
    ];
    fs.writeFileSync(path.join(dir, '7.json'), JSON.stringify({ rankings }));
    assert.deepEqual(localMonthlyPeak(dir, 7, 2026), { peak: 12, month: '2026-09' });
    assert.deepEqual(localMonthlyPeak(dir, 8, 2026), { peak: 0, month: '' });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('只数本军团的驾驶员，受害人也算，没有角色的建筑不算', () => {
  const killmail = {
    victim: { corporation_id: 1, character_id: 10 },
    attackers: [{ corporation_id: 1, character_id: 11 }, { corporation_id: 2, character_id: 12 }, { corporation_id: 1 }],
  };
  assert.deepEqual(corpPilotsOn(killmail, 1), [10, 11]);
});
