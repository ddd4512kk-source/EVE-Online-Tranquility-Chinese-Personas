import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { auditAll, EXCLUDED, gateReasons, isRosterParagraph, listCandidates, openCorp, run, slugFor } from './corp-workbench.mjs';

const snapshot = {
  esi: { name: 'Fictional Corp', ticker: 'FICT', member_count: 50, ceo: { id: 7, name: 'Ceo' }, date_founded: '2020-01-01', as_of: '2026-11-01' },
  zkb: { kills: 1, last_active: '2026-10', as_of: '2026-11-01' },
};

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'corp-workbench-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (file, value) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), typeof value === 'string' ? value : JSON.stringify(value));
  };
  put('src/_data/entityNames.json', { corporations: {
    98000001: { name: 'Fictional Corp', ticker: 'FICT', chinese: true },
    98000002: { name: 'Second Corp', ticker: 'SEC', chinese: true },
    98000003: { name: 'Foreign Corp', ticker: 'FOR' },
    98000004: { name: 'Banned Corp', ticker: 'BAN' },
  } });
  put('src/people/jia-pilot/42-id.json', { id: 42, name: 'Pilot', person: { cn_name: '甲' }, history: [
    { corporation_id: 98000001, start: '2020-01-01T00:00:00Z' },
    { corporation_id: 98000002, start: '2019-01-01T00:00:00Z', end: '2019-06-01T00:00:00Z' },
    { corporation_id: 98000003, start: '2018-01-01T00:00:00Z' },
    { corporation_id: 98000004, start: '2017-01-01T00:00:00Z' },
    { corporation_id: 1000167, start: '2016-01-01T00:00:00Z' },
  ] });
  put(EXCLUDED, { 98000004: { name: 'Banned Corp', reason: '外国军团' } });
  put('src/corps/fict/fict.json', { corp: { id: 98000001, cn_name: '虚构', epithet: '一句话' }, ...snapshot });
  put('src/corps/fict/fict.md', '虚构军团的正文，[甲](../../p/42/)。\n');
  put('src/corps/fict/materials-fict.md', '# 虚构\n');
  put('docs/sources/note.md', '无关的一行\nFictional Corp 2021 年搬进 00。\n别名那行：幻影团打过仗。\n');
  put('docs/tieba/1.json', { url: 'https://example.com/p/1', title: 'Fictional Corp 招新' });
  return { root, put };
}

test('门槛：招新帖、现任列传人物、活跃占一条即可，全无则不写', () => {
  const dormant = { zkb: { last_active: '2020-01', as_of: '2026-11-01' }, esi: { member_count: 50 } };
  assert.deepEqual(gateReasons(dormant, 0), []);
  assert.deepEqual(gateReasons(dormant, 1), ['现任列传人物']);
  assert.deepEqual(gateReasons({ ...dormant, recruitment: { last_seen: '2020-01-01' } }, 0), ['招新帖']);
  assert.deepEqual(gateReasons({ zkb: { last_active: '2026-10', as_of: '2026-11-01' }, esi: { member_count: 50 } }, 0), ['活跃']);
  assert.deepEqual(gateReasons({ zkb: { last_active: '2026-10', as_of: '2026-11-01' }, esi: { member_count: 20 } }, 1), []);
  assert.deepEqual(gateReasons({ ...dormant, esi: { member_count: 21 } }, 1), ['现任列传人物']);
});

test('候选只列未开页、未排除、有现任列传人物的非 NPC 军团，只有曾任的不列', t => {
  const { root } = fixture(t);
  assert.deepEqual(listCandidates(root).map(row => [row.id, row.current, row.chinese]), [[98000003, 1, false]]);
});

test('开页写骨架与华人标记，已有页面或已排除的拒绝', t => {
  const { root } = fixture(t);
  assert.match(openCorp(root, 98000003), /foreign-corp/);
  assert.ok(fs.existsSync(path.join(root, 'src/corps/foreign-corp/materials-foreign-corp.md')));
  const names = JSON.parse(fs.readFileSync(path.join(root, 'src/_data/entityNames.json'), 'utf8'));
  assert.equal(names.corporations[98000003].chinese, true);
  assert.throws(() => openCorp(root, 98000001), /已有页面/);
  assert.throws(() => openCorp(root, 98000004), /已排除/);
  assert.equal(slugFor('A&B Corp', 5, new Set()), 'a-and-b-corp');
  assert.equal(slugFor('Same', 5, new Set(['same'])), 'same-5');
  assert.equal(slugFor('中文团', 5, new Set()), 'corp-5');
});

test('线索汇总含列传履历、招新帖候选与全仓命中', t => {
  const { root } = fixture(t);
  const { output } = run(root, ['clues', 'fict']);
  assert.match(output, /甲\(42\) 2020-01~今/);
  assert.match(output, /https:\/\/example\.com\/p\/1 Fictional Corp 招新/);
  assert.match(output, /2021 年搬进 00/);
  assert.doesNotMatch(output, /无关的一行/);
  assert.doesNotMatch(output, /别名那行/);
  assert.match(run(root, ['clues', 'fict', '--also', '幻影团,别名', '--limit', '3']).output, /别名那行/);
  assert.throws(() => run(root, ['clues', 'fict', '--also']), /--also/);
  assert.throws(() => run(root, ['clues', 'nope']), /没有军团/);
  assert.throws(() => run(root, ['clues']), /需要短名/);
});

test('线索搜裸写的长代号和中文名，短代号不裸搜', t => {
  const { root, put } = fixture(t);
  put('src/corps/long/long.json', { corp: { id: 98000002, cn_name: '第二团', epithet: '一句' }, esi: { name: 'Second Corp', ticker: 'SECO' } });
  put('src/corps/long/long.md', '正文\n');
  put('docs/sources/tickers.md', 'SECO 的人来了\nDISECOUNT 不算\n第二团也来了\n');
  const long = run(root, ['clues', 'long']).output;
  assert.match(long, /SECO 的人来了/);
  assert.match(long, /第二团也来了/);
  assert.doesNotMatch(long, /DISECOUNT/);
  put('src/corps/short/short.json', { corp: { id: 98000003, cn_name: 'Short', epithet: '一句' }, esi: { name: 'Short Corp', ticker: 'SEC' } });
  put('src/corps/short/short.md', '正文\n');
  put('docs/sources/short.md', 'SEC 裸写\n');
  assert.doesNotMatch(run(root, ['clues', 'short']).output, /SEC 裸写/);
});

test('流水账：同段点名三人且挂三个年份才算', () => {
  const link = name => `[${name}](../../p/1/)`;
  assert.ok(isRosterParagraph(`${link('甲')} 2019 年进团，${link('乙')} 2020 年进团，${link('丙')} 2021 年进团。`));
  assert.ok(!isRosterParagraph(`${link('甲')} 2019 年带队打下星系，${link('乙')} 管后勤。`));
});

test('查缺口：干净的页面不报，占位、坏链、裸短名、缺标记都报', t => {
  const { root, put } = fixture(t);
  assert.deepEqual(auditAll(root), []);
  assert.equal(run(root, ['audit']).failed, false);
  put('src/corps/bad/bad.json', { corp: { id: 98000003, cn_name: '坏', epithet: '待定' }, zkb: { last_active: '2020-01', as_of: '2026-11-01' } });
  put('src/corps/bad/bad.md', '待写\n');
  put('src/corps/link/link.json', { corp: { id: 98000002, cn_name: '链', epithet: '一句' }, ...snapshot });
  put('src/corps/link/link.md', '[丢](../../p/99/) 和 [丢团](../gone/)，还有 stray-slug 与 {{p:乙}}，jia-pilot 和 some-other-word。\n');
  const rows = Object.fromEntries(auditAll(root).map(row => [row.slug, row.issues]));
  assert.ok(rows.bad.includes('待写'));
  assert.ok(rows.bad.includes('缺素材'));
  assert.ok(rows.bad.includes('缺华人标记'));
  assert.ok(rows.link.includes('坏人物链接 99'));
  assert.ok(rows.link.includes('坏军团链接 gone'));
  assert.ok(rows.link.includes('裸短名 jia-pilot'));
  assert.ok(!rows.link.some(issue => issue.includes('some-other-word')));
  assert.ok(rows.link.includes('未展开的写作占位'));
  assert.equal(run(root, ['audit']).failed, true);
});
