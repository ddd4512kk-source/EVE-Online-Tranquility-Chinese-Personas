import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(execFile);
const script = path.resolve('scripts/research/tieba-client-dump.mjs');

test('帮助不读取文件；空缓存保留错误，不能伪装成成功读取', async () => {
  assert.match((await exec(process.execPath, [script, '--help'])).stdout, /用法/);
  const root = await mkdtemp(path.join(tmpdir(), 'tieba-dump-'));
  try {
    const file = path.join(root, 'empty.json');
    await writeFile(file, JSON.stringify({pages:[],errors:[{message:'HTTP 429'}]}));
    await assert.rejects(exec(process.execPath, [script, file]), error => error.code === 2 && error.stderr.includes('没有取得主楼'));
  } finally { await rm(root, {recursive:true,force:true}); }
});

test('按楼层分段包含楼中楼、去重正倒序，复读缓存图片不联网', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'tieba-dump-'));
  try {
    const file = path.join(root, 'thread.json');
    const posts = [1,2,3].map(floor => ({id:floor,floor,time:1,author_id:1,
      content:[{text:`主楼${floor}`}],sub_post_list:{sub_post_list:[{id:floor+10,time:1,content:[{text:`回复${floor}`}]}]}}));
    posts[1].content.push({type:3, origin_src:'https://never-request.invalid/image'});
    const page = {thread:{title:'标题'},post_list:posts,user_list:[{id:1,name:'作者'}]};
    await writeFile(file, JSON.stringify({source:'公开来源',pages:[page],reverse_pages:[page]}));
    const imageName = url => path.join(root, `f2-0-${createHash('sha256').update(url).digest('hex').slice(0, 16)}.jpg`);
    await writeFile(imageName(posts[1].content[1].origin_src), 'cached');
    const result = await exec(process.execPath, [script, file, '--floors', '2:2', '--images', '3', root]);
    assert.match(result.stdout, /主楼2/); assert.match(result.stdout, /回复2/);
    assert.doesNotMatch(result.stdout, /主楼1|回复1|主楼3|回复3/);
    assert.equal(result.stdout.match(/pid=2/g).length, 1);
    assert.match(result.stderr, /图片已缓存/);
    await assert.rejects(exec(process.execPath, [script, file, '--floors', '3:2']), error => error.code === 1);
    // 同编号换成另一来源时不得使用旧图；用模拟 fetch 验证，不访问网络。
    posts[1].content[1].origin_src = 'https://never-request.invalid/changed';
    await writeFile(file, JSON.stringify({source:'公开来源',pages:[page],reverse_pages:[page]}));
    const preload = path.join(root, 'fetch-fixture.mjs');
    await writeFile(preload, `globalThis.fetch=async url=>{if(url!=='https://never-request.invalid/changed')throw new Error('unexpected URL');return new Response('replacement')};`);
    await exec(process.execPath, ['--import', preload, script, file, '--floors', '2:2', '--images', '3', root], {
      env:{...process.env,RESEARCH_STATE_FILE:path.join(root, 'cooldown.json')},
    });
    assert.equal(await readFile(imageName(posts[1].content[1].origin_src), 'utf8'), 'replacement');
  } finally { await rm(root, {recursive:true,force:true}); }
});
