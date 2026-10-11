import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequestGuard } from '../request-guard.mjs';
function fixture({ limit = 30, responses = [], shared = new Set() } = {}) {
  let clock = 0, calls = 0;
  const waits = [];
  const request = createRequestGuard({ limit, now: () => clock,
    sleep: async ms => { waits.push(ms); clock += ms; },
    isBlocked: host => shared.has(host), stop: host => shared.add(host),
    fetchImpl: async () => { calls++; return responses.shift() || new Response('{}'); },
  });
  return { request, waits, calls: () => calls, shared };
}
test('并发提交也串行，EveWho 限额及六秒间隔生效', async () => {
  const f = fixture();
  const result = await Promise.allSettled(Array.from({length:10},(_,i)=>f.request(`https://evewho.com/${i}`)));
  assert.equal(f.calls(),8);
  assert.equal(result.filter(x=>x.status==='rejected').length,2);
  assert.deepEqual(f.waits,Array(7).fill(6000));
});
test('失败请求计入总预算，不自动重试', async () => {
  const f = fixture({limit:2,responses:[new Response('',{status:500})]});
  assert.equal((await f.request('https://zkillboard.com/a')).status,500);
  await f.request('https://esi.evetech.net/a');
  await assert.rejects(f.request('https://another.example/a'),/预算/);
  assert.equal(f.calls(),2);
});
test('403、429、412 后换路径或 B 站子域也不发送请求', async () => {
  for (const status of [403,429,412]) {
    const f = fixture({responses:[new Response('',{status})]});
    await assert.rejects(f.request('https://api.bilibili.com/a'),new RegExp(`HTTP ${status}`));
    await assert.rejects(f.request('https://www.bilibili.com/b'),/停止/);
    assert.equal(f.calls(),1);
    const other = fixture({shared:f.shared});
    await assert.rejects(other.request('https://api.bilibili.com/c'),/停止/);
    assert.equal(other.calls(),0);
  }
});
test('200 挑战页也停止；普通 HTML 可以正常读取', async () => {
  const f=fixture({responses:[new Response('Just a moment cf-chl-', {headers:{'content-type':'text/html'}})]});
  await assert.rejects(f.request('https://evewho.com/a'),/挑战/);
  await assert.rejects(f.request('https://evewho.com/b'),/停止/);
  assert.equal(f.calls(),1);
  const normal=fixture({responses:[new Response('<html>正常页面</html>',{headers:{'content-type':'text/html'}})]});
  assert.match(await (await normal.request('https://www.bilibili.com/')).text(),/正常页面/);
});
