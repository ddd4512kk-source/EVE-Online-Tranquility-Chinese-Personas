import test from 'node:test';
import assert from 'node:assert/strict';
import { validBilibiliUrl, pageStatus, revealCommentSection } from '../bilibili-chrome-read.mjs';
import { runInNewContext } from 'node:vm';

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
  for (const url of ['https://space.bilibili.com/53247199/upload/video', 'https://www.bilibili.com/video/BV14s411F7Hh/', 'https://search.bilibili.com/all?keyword=EVE']) assert.equal(validBilibiliUrl(url), url);
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
