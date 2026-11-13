import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import nunjucks from 'nunjucks';
import { readPersonDocument } from './person-document.mjs';
import { personRadar, RADAR_AXES, RADAR_TIERS, validatePersonRadar } from './person-radar.mjs';

function fixture() {
  return {
    version: 1,
    reviewedAt: '2026-11-09T02:44:45Z',
    verdict: '史官评语。',
    axes: Object.fromEntries(RADAR_AXES.map(({ key }) => [key, {
      tier: 'C',
      reason: '已核对的具体事迹。',
      sources: [{ label: '出处', url: 'https://example.com/event' }],
    }])),
  };
}

test('旧人物不显示六维；六维齐全时提供阶位信息与等价元数据', () => {
  assert.equal(personRadar(undefined), null);
  const rating = fixture();
  const before = structuredClone(rating);
  const result = personRadar(rating);
  assert.equal(result.axes.length, 6);
  assert.equal(result.complete, true);
  assert.equal(result.axes[0].label, '神力');
  assert.ok(result.axes.every(axis => axis.tierLabel === 'C'));
  assert.deepEqual(rating, before);
});

test('支持 EX/S/A/B/C/D/E 七档天梯，待考轴明确标记', () => {
  const rating = fixture();
  rating.axes.command = { tier: null, reason: '未找到具体指挥事迹。', sources: [] };
  rating.axes.shenren.tier = 'EX';
  rating.axes.combat.tier = 'S';
  rating.axes.charisma.tier = 'A';
  rating.axes.wealth.tier = 'B';
  rating.axes.politics.tier = 'E';
  const result = personRadar(rating);
  assert.equal(result.complete, false);
  assert.equal(result.axes[2].tier, null);
  assert.equal(result.axes[2].tierLabel, '待考');
  assert.equal(result.axes[0].tier, 'EX');
  assert.equal(result.axes[1].tier, 'S');
  assert.equal(result.axes[4].tier, 'E');
  assert.equal(result.axes[5].tier, 'B');
});

test('阶位只能是 EX/S/A/B/C/D/E 或 null，漏写维度不能悄悄豁免', () => {
  for (const tier of ['F', 'Z', 0, 5, 3.5, 'A+', undefined, NaN]) {
    const rating = fixture();
    rating.axes.combat.tier = tier;
    assert.match(validatePersonRadar(rating).join('\n'), /tier/);
    assert.throws(() => personRadar(rating));
  }
  const rating = fixture();
  delete rating.axes.politics;
  assert.match(validatePersonRadar(rating).join('\n'), /politics.*缺失/);
});

test('有阶位必须有理由与安全公开出处，拒绝脚本链接与字段拼错', () => {
  const mutations = [
    r => { r.axes.combat.reason = ' '; },
    r => { r.axes.combat.sources = []; },
    r => { r.axes.combat.sources = [{ label: '出处', url: 'javascript:alert(1)' }]; },
    r => { r.axes.combat.sources = [{ label: '出处', url: '//example.com' }]; },
    r => { r.axes.combat.sources = [{ label: '出处', url: 'https://user:password@example.com' }]; },
    r => { r.axes.combat.sources = [{ label: '', url: 'https://example.com' }]; },
    r => { r.axes.combat.teir = 'C'; },
    r => { r.axes.typo = {}; },
    r => { r.version = 2; },
    r => { r.reviewedAt = '2026-02-30T02:00:00Z'; },
    r => { r.reviewedAt = '2026-11-09T02:00:00+08:00'; },
  ];
  for (const mutate of mutations) {
    const rating = fixture();
    mutate(rating);
    assert.ok(validatePersonRadar(rating).length > 0);
  }
  assert.ok(validatePersonRadar(null).length > 0);
});

test('正式人物读取器接入阶位校验，错误保留档案路径', t => {
  const directory = mkdtempSync(path.join(tmpdir(), 'person-radar-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, 'person.md');
  const archive = path.join(directory, '42-id.json');
  writeFileSync(file, '正文保持不变。\n');
  const radar = fixture();
  writeFileSync(archive, JSON.stringify({ id: 42, person: { radar } }));
  assert.deepEqual(readPersonDocument(file).data.radar, radar);
  radar.axes.wealth.tier = 'INVALID';
  writeFileSync(archive, JSON.stringify({ id: 42, person: { radar } }));
  assert.throws(() => readPersonDocument(file), /42-id.json.*wealth.tier/);
});

test('实际阶位雷达图渲染六维与考据，外部文字转义且出处在新标签打开', () => {
  const environment = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.resolve(import.meta.dirname, '../src/_includes')), { autoescape: true });
  const rating = fixture();
  rating.axes.politics.reason = '<script>不能执行</script>';
  const html = environment.render('person-radar.njk', { displayName: '样例', radarPanel: personRadar(rating) });
  assert.match(html, /bio-radar-bay/);
  assert.match(html, /class="radar-area"/);
  assert.equal((html.match(/class="radar-dimension/g) ?? []).length, 6);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.equal((html.match(/target="_blank" rel="noopener noreferrer"/g) ?? []).length, 6);
  assert.match(html, /史官曰/);
  rating.axes.command.tier = null;
  const partial = environment.render('person-radar.njk', { displayName: '样例', radarPanel: personRadar(rating) });
  assert.doesNotMatch(partial, /class="radar-area"/);
  assert.match(partial, /统御力：待考/);
});
