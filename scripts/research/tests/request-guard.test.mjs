import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequestGuard, createCooldownStore, researchSite } from '../request-guard.mjs';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
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

test('规范站点仅合并真正的子域；抓取错误保留真实状态及请求入口', async () => {
  assert.equal(researchSite('www.zkillboard.com'), 'zkillboard.com');
  assert.equal(researchSite('c.tieba.baidu.com'), 'tieba.baidu.com');
  assert.equal(researchSite('www.zkillboard.com.'), 'zkillboard.com');
  assert.equal(researchSite('evilbilibili.com'), 'evilbilibili.com');
  const f = fixture({responses:[new Response('', {status:403})]});
  await assert.rejects(f.request('https://zkillboard.com/corporation/123/top/', {method:'GET'}), /HTTP 403：GET https:\/\/zkillboard.com\/corporation\/123\/top\//);
  await assert.rejects(f.request('https://www.zkillboard.com/other'), /停止/);
  assert.equal(f.calls(), 1);
});

test('挑战页保留服务器真实状态码', async () => {
  const f = fixture({responses:[new Response('Just a moment cf-chl-', {status:503,headers:{'content-type':'text/html'}})]});
  await assert.rejects(f.request('https://evewho.com/a'), /HTTP 503 挑战页/);
  await assert.rejects(f.request('https://evewho.com/b'), /停止/);
  assert.equal(f.calls(), 1);
});

test('等待间隔中另一会话被拦时，当前请求不再发送', async () => {
  let blocked = false, calls = 0;
  const request = createRequestGuard({now:()=>0, isBlocked:()=>blocked,
    sleep:async()=>{blocked = true;}, fetchImpl:async()=>{calls++; return new Response('{}');}});
  await request('https://zkillboard.com/first');
  await assert.rejects(request('https://zkillboard.com/second'), /本次未发送/);
  assert.equal(calls, 1);
});

test('多个会话的停止事件互不覆盖；兼容旧记录、子域及冷却截止时间', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'eve-cooldown-'));
  const file = path.join(root, 'state.json');
  try {
    await writeFile(file, JSON.stringify({'api.bilibili.com':9000000}));
    const first = createCooldownStore(file, ()=>1000);
    const second = createCooldownStore(file, ()=>2000);
    first.stop('c.tieba.baidu.com'); second.stop('zkillboard.com'); first.stop('zkillboard.com');
    const resumed = createCooldownStore(file);
    assert.equal(resumed.until('tieba.baidu.com'), 1801000);
    assert.equal(resumed.until('www.zkillboard.com'), 1802000);
    assert.equal(resumed.until('www.bilibili.com'), 9000000);
    assert.equal(resumed.until('evewho.com'), 0);
    assert.equal(resumed.until('zkillboard.com') > 1802000, false);
  } finally { await rm(root, {recursive:true,force:true}); }
});

test('临时脚本创建默认 guard 也沿用跨进程停止记录，不重置冷却', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'eve-guard-process-'));
  const file = path.join(root, 'state.json');
  const module = new URL('../request-guard.mjs', import.meta.url).href;
  const run = promisify(execFile);
  try {
    const env = {...process.env, RESEARCH_STATE_FILE:file};
    await run(process.execPath, ['--input-type=module', '-e', `import {markResearchHostStopped} from ${JSON.stringify(module)};markResearchHostStopped('zkillboard.com');`], {env});
    const result = await run(process.execPath, ['--input-type=module', '-e', `import {createRequestGuard} from ${JSON.stringify(module)};const request=createRequestGuard({fetchImpl:async()=>{throw new Error('unexpected fetch')}});try{await request('https://www.zkillboard.com/test');process.exit(1)}catch(e){if(!e.message.includes('停止'))throw e;console.log('blocked before fetch')}`], {env});
    assert.match(result.stdout, /blocked before fetch/);
  } finally { await rm(root, {recursive:true,force:true}); }
});
