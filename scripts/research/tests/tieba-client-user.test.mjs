import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(execFile);
const reader = path.resolve('scripts/research/tieba-client-user.mjs');
async function run(who) {
 const dir = await mkdtemp(path.join(tmpdir(), 'tieba-user-test-'));
 try {
  const data = {pages:[], reverse_pages:[{user_list:[],post_list:[{sub_post_list:{sub_post_list:[
   {author:{id:11,name:'original-a',name_show:'老熊甲'}},
   {author:{id:22,name:'original-b',name_show:'老熊乙'}},
  ]}}]}]};
  const input = path.join(dir,'thread.json'), preload = path.join(dir,'fetch.mjs');
  await writeFile(input,JSON.stringify(data));
  await writeFile(preload,`globalThis.fetch=async(url,init)=>{if(new URLSearchParams(init.body).get('uid')!=='22')throw new Error('查错 UID');return {json:async()=>({error_code:0,post_list:[]})};};`);
  try {return await exec(process.execPath,['--import',preload,reader,input,who]);}
  catch(error){return error;}
 } finally {await rm(dir,{recursive:true,force:true});}
}
test('楼中楼独有作者可用 UID 查询，展示名相近不串号',async()=>{
 const result=await run('22');assert.equal(result.code,undefined);assert.match(result.stdout,/uid 22/);
});
test('相近展示名匹配到两个 UID 时停止，不能挑第一个人',async()=>{
 const result=await run('老熊');assert.equal(result.code,1);assert.match(result.stderr,/多个不同 UID/);assert.match(result.stderr,/11/);assert.match(result.stderr,/22/);
});
test('用原用户名精确定位展示名已改变的账号',async()=>{
 const result=await run('original-b');assert.equal(result.code,undefined);assert.match(result.stdout,/uid 22/);
});
