import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CORP_RATING_DIMENSIONS, CORP_STYLES, validateCorpArchive, validateCorpBody } from './corps.mjs';

const archive = () => ({
  corp: {
    id: 98000001,
    cn_name: '虚构军团',
    epithet: '一句话',
    style: 'tycoon',
    ratings: { pvp: 80, shenren: 15, influence: 70 },
  },
  esi: { name: 'Fictional Corp', ticker: 'FICT', as_of: '2026-11-05' },
  zkb: { kills: 1, lost: 1, isk_destroyed: 1, last_active: '2026-11', as_of: '2026-11-05' },
  recruitment: { last_seen: '2026-10-01', source: 'https://example.com/recruit' },
});

test('合法档案没有错误，招新记录可省略', () => {
  assert.deepEqual(validateCorpArchive(archive(), 'fict'), []);
  const none = archive();
  delete none.recruitment;
  assert.deepEqual(validateCorpArchive(none, 'fict'), []);
});

test('缺快照或招新出处时报错并指出短名', () => {
  const bad = archive();
  delete bad.esi;
  bad.recruitment = { last_seen: '2026-10', source: '没有链接' };
  const errors = validateCorpArchive(bad, 'fict');
  assert.equal(errors.length, 4);
  assert.ok(errors.every(error => error.startsWith('fict：')));
});

test('军团志不用列传的料块与朱批，不能空着，公开招新群可写', () => {
  assert.deepEqual(validateCorpBody('## 来历\n\n一段往事\n\n招新 QQ 群 123456', 'fict'), []);
  for (const block of ['::: 红料 甲\n正文\n:::', '::: 黑料 乙\n正文\n:::', '::: 评\n正文\n:::']) {
    assert.equal(validateCorpBody(block, 'fict').length, 1);
  }
  assert.equal(validateCorpBody('   ', 'fict').length, 1);
});

test('手工区域只收已知键', () => {
  const zoned = archive();
  zoned.corp.zones = ['high', 'null'];
  assert.deepEqual(validateCorpArchive(zoned, 'fict'), []);
  zoned.corp.zones = ['火星'];
  assert.equal(validateCorpArchive(zoned, 'fict').length, 1);
});

test('军团视觉风格与三维评价指数须合法', () => {
  assert.equal(CORP_STYLES.length, 6);
  assert.deepEqual(CORP_RATING_DIMENSIONS.map(d => d.label), ['武德', '含神量', '声望']);

  const edge = archive();
  edge.corp.style = 'phantom';
  edge.corp.ratings = { pvp: 0, shenren: 100, influence: 0 };
  assert.deepEqual(validateCorpArchive(edge, 'fict'), []);

  const badStyle = archive();
  badStyle.corp.style = 'cyberpunk';
  assert.equal(validateCorpArchive(badStyle, 'fict').length, 1);

  for (const badRatings of [
    undefined,
    { pvp: -1, shenren: 50, influence: 50 },
    { pvp: 50, shenren: 101, influence: 50 },
    { pvp: 50, shenren: 50, influence: 55.5 },
  ]) {
    const item = archive();
    item.corp.ratings = badRatings;
    assert.ok(validateCorpArchive(item, 'fict').length >= 1);
  }
});
