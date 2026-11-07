import assert from 'node:assert/strict';
import test from 'node:test';
import { battleAllianceIds, battleLabels, checkBattleTaxonomy, groupBattleTags } from './battle-tags.mjs';

test('战役分类拒绝旧同义词、任意中文、手填联盟及多选战型', () => {
  assert.deepEqual(checkBattleTaxonomy(['低安', '超旗战']), []);
  for (const tags of [undefined, [], ['低安'], ['低安', '泰坦战'], ['00区', '旗舰战', 'FRT'], ['低安', '混战'], ['低安', '旗舰战', '超旗战'], ['低安', '低安', '常规战']]) {
    assert.ok(checkBattleTaxonomy(tags).length, JSON.stringify(tags));
  }
});

const table = { alliances: { 1: { ticker: 'FRT' }, 2: { ticker: '配角' }, 3: { ticker: 'LOSS' }, 4: { ticker: 'OLD' } }, corporations: { 50: { ticker: 'CORP' } } };

test('联盟标签只给占本方参战角色30%以上的联盟，未到场种子不充作参战', () => {
  const stats = { sides: [
    { name: '主力', pilots: 140, organizations: [4], alliance_participation: [{ id: 1, pilots: 100 }, { id: 2, pilots: 42 }, { id: 3, pilots: 41 }, { id: 4, pilots: 1 }] },
    { name: '第三方', pilots: 3, alliance_participation: [{ id: 2, pilots: 1 }, { id: 3, pilots: 0, loss_count: 1 }, { id: 99, pilots: 2 }] },
  ] };
  assert.deepEqual(battleAllianceIds(stats, table), [1, 2, 99]);
  assert.deepEqual(battleLabels({ tags: ['低安', '常规战'] }, stats, table, { name: '大型' }), ['大型', '常规战', '低安', 'FRT', '配角', '联盟 #99']);
});

test('手填战役沿用历史联盟归属，独立军团不变成联盟标签', () => {
  const stats = { sides: [{ organizations: [1, 50], corps: [{ id: 60, alliance_id: 4 }, { id: 61, alliance_id: 0 }, { id: 62 }] }] };
  assert.deepEqual(battleAllianceIds(stats, table), [1, 4]);
});

test('目录分类顺序固定，中文ticker归联盟，同场重复标签只计一次', () => {
  const groups = groupBattleTags([
    { data: { labels: ['大型', '超旗战', '低安', 'FRT', '配角', 'FRT'] } },
    { data: { labels: ['中型', '常规战', '虫洞', 'FRT'] } },
  ]);
  assert.deepEqual(groups.map(group => group.name), ['规模', '战斗类型', '地带', '参战联盟']);
  assert.deepEqual(groups[0].tags.map(tag => tag.name), ['大型', '中型']);
  assert.deepEqual(groups[3].tags, [{ name: 'FRT', count: 2 }]);
});
