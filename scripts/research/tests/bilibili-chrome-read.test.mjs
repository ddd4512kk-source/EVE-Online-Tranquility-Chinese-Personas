import test from 'node:test';
import assert from 'node:assert/strict';
import { validBilibiliUrl, sanitizeMetadataDescription, pageStatus, revealCommentSection, loadCommentSection, archivedBvids } from '../bilibili-chrome-read.mjs';
import { runInNewContext } from 'node:vm';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

test('定位未触发懒加载时，仍执行真实下滚并等两秒后读评论', async () => {
  let scrolled = false;
  await loadCommentSection({
    async evaluate(fn) {assert.equal(fn, revealCommentSection);},
    mouse: {async wheel(x, y) {assert.equal(x, 0); assert.ok(y > 0); scrolled = true;}},
    async waitForTimeout(ms) {assert.ok(scrolled); assert.equal(ms, 2000);},
  });
  assert.ok(scrolled);
});

test('滚动到真实评论区，避免固定滚动越过懒加载入口', () => {
  let paused = false, revealed = false;
  runInNewContext(`(${revealCommentSection.toString()})()`, {
    document: {querySelector(selector) {
      if (selector === 'video') return {pause() {paused = true;}};
      return {scrollIntoView(options) {assert.equal(options.block, 'start'); revealed = true;}};
    }},
    window: {scrollTo() {assert.fail('评论区存在时不应使用固定滚动距离');}},
  });
  assert.equal(paused, true);
  assert.equal(revealed, true);
});

test('仅读取公开页，拒绝账户页面、凭据和伪造域名', () => {
  for (const url of ['https://space.bilibili.com/13329368/upload/opus', 'https://www.bilibili.com/opus/1182987654321098765', 'https://www.bilibili.com/read/cv123', 'https://space.bilibili.com/53247199/upload/video', 'https://www.bilibili.com/video/BV14s411F7Hh/', 'https://search.bilibili.com/all?keyword=EVE']) assert.equal(validBilibiliUrl(url), url);
  for (const url of ['http://space.bilibili.com/1', 'https://space.bilibili.com.evil.test/1', 'https://name:password@space.bilibili.com/1', 'https://space.bilibili.com:9222/1', 'https://www.bilibili.com/account/security', 'https://space.bilibili.com/1/setting']) assert.throws(() => validBilibiliUrl(url));
});
test('加载壳和登录导航不算已读，验证码优先于元数据', () => {
  assert.equal(pageStatus('首页 番剧 登录', null, 'space'), 'partial');
  assert.equal(pageStatus('安全验证', {title:'缓存视频标题'}, 'video'), 'blocked');
  assert.equal(pageStatus('视频已被删除', null, 'video'), 'unavailable');
  assert.equal(pageStatus('视频正文', {title:'视频标题'}, 'video'), 'read');
  assert.equal(pageStatus('创作团队 账号已注销', {title:'合作视频'}, 'video'), 'read');
});

import {bilibiliCookieHeader} from '../bilibili-session.mjs';
test('Cookie仅限B站并拒绝请求头注入，不带其他网站会话', () => {
  assert.equal(bilibiliCookieHeader([{domain:'.bilibili.com',name:'SESSDATA',value:'fake-session'},{domain:'.example.com',name:'secret',value:'other'},{domain:'.bilibili.com.evil.test',name:'secret',value:'other'},{domain:'.bilibili.com',name:'bad',value:'x\r\nAuthorization: injected'}]),'SESSDATA=fake-session');
});

test('已入作品档案的视频收进跳过集合，频道列表候选不算', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bili-archive-'));
  fs.writeFileSync(path.join(dir, '1.json'), JSON.stringify({channel:{listings:[{candidates:[{bvid:'BV1listed'}]}]}, videos:[{bvid:'BV1read'}]}));
  fs.writeFileSync(path.join(dir, 'note.txt'), 'x');
  assert.deepEqual([...archivedBvids(dir)], ['BV1read']);
  assert.equal(archivedBvids(path.join(dir, 'missing')).size, 0);
});

test('Chrome取得简介时清联系方式，保留同一行BR供后续归档', () => {
  const report = 'https://br.evetools.org/br/64717b91543bb54ab3337066';
  const description = sanitizeMetadataDescription(`QQ群12345678 战报：${report}。`);
  assert.equal(description, `[联系方式略]\n${report}`);
  assert.equal(description.includes('12345678'), false);
});
