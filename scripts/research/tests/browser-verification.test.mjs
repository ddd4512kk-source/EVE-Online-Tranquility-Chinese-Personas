import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
for (const name of ['zhihu','tieba-read']) {
  const source=await readFile(new URL(`../${name}.mjs`,import.meta.url),'utf8');
  const body=source.slice(source.indexOf('async function waitHuman()'),source.indexOf('async function open(url)'));
  function verification(answered) {
    let clock=0, probes=0;
    const sleep=async ms=>{clock+=ms;};
    const isBlocked=async()=>{probes++;return !answered || probes<3;};
    const fakeConsole={log(){},error(){}};
    return new Function('page','isBlocked','sleep','Date','console',body+';return waitHuman;')(
      {waitForTimeout:sleep},isBlocked,sleep,{now:()=>clock},fakeConsole);
  }
  test(`${name}：人工通过验证码后继续`, async()=>assert.equal(await verification(true)(),true));
  test(`${name}：人工无响应，等待超时才停止`, async()=>assert.equal(await verification(false)(),false));
}
