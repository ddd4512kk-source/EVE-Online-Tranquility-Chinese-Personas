// 百度搜索取料工具：用无头浏览器打开百度搜索结果，打印每条结果的标题、链接和摘要。
//
// 为什么需要它：贴吧、知乎、百家号对脚本直接访问会弹“安全验证”，
// 但百度搜索结果页本身能正常打开，而且摘要里常带着贴吧帖子的楼层原文。
//
// 首次使用（不写进 package.json，避免拖慢 CI）：
//   npm i --no-save playwright && node node_modules/playwright/cli.js install chromium
// 用法：
//   node scripts/research/baidu-search.mjs "夺米台风 eve欧服吧"
//   node scripts/research/baidu-search.mjs "夺米台风 eve欧服吧" 10   # 第二页（pn=10）
//   node scripts/research/baidu-search.mjs --page "<网址>"           # 打开单个页面取正文（百家号等可用）
//   node scripts/research/baidu-search.mjs --so "夺米台风 吧主"       # 改用 360 搜索（百度弹验证码时的备用）
//   node scripts/research/baidu-search.mjs --bing "MrDiao eve"        # 改用必应（百度、360 都被拦时；英文角色名效果较好）
//
// 按需选择单个引擎；遇验证码即停止，不因失败自动轮换或重试。
// 输出“【搜索失败】”表示被验证码拦截，不等于没有料；停止本轮请求，并记进取材记录。

import { chromium } from "playwright";

const args = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({
  locale: "zh-CN",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
});
const page = await ctx.newPage();

// 搜不到 ≠ 没有料。被验证码拦截时必须明说，不能静默输出空白，否则会被误当成“此人没料”。
async function report(items, engine) {
  const title = await page.title();
  const blocked = /验证|captcha|异常/i.test(title) || (await page.locator("text=安全验证").count()) > 0;
  if (blocked) {
    console.log(`【搜索失败】${engine}弹了验证码（页面标题：${title}）。这不是“没有结果”，本轮停止，不自动重试。`);
    process.exitCode = 2;
  } else if (!items.length) {
    console.log(`【零结果】${engine}没有返回结果（页面标题：${title}）。换关键词（外号/英文名/简称）再搜。`);
  }
  for (const it of items) console.log(`■ ${it.title}\n  ${it.url}\n  ${it.text.slice(0, 400)}\n`);
}

if (args[0] === "--so") {
  await page.goto(`https://www.so.com/s?q=${encodeURIComponent(args[1])}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  const items = await page.$$eval("ul.result > li", (ls) =>
    ls
      .map((l) => {
        const a = l.querySelector("h3 a");
        return a ? { title: a.innerText.trim(), url: a.href, text: l.innerText.replace(/\s+/g, " ") } : null;
      })
      .filter(Boolean),
  );
  await report(items, "360 搜索");
} else if (args[0] === "--bing") {
  await page.goto(`https://cn.bing.com/search?q=${encodeURIComponent(args[1])}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("li.b_algo", { timeout: 10000 }).catch(() => {}); // 必应结果是延迟加载的
  const items = await page.$$eval("#b_results > li.b_algo", (ls) =>
    ls
      .map((l) => {
        const a = l.querySelector("h2 a");
        return a ? { title: a.innerText.trim(), url: a.href, text: l.innerText.replace(/\s+/g, " ") } : null;
      })
      .filter(Boolean),
  );
  await report(items, "必应");
} else if (args[0] === "--page") {
  await page.goto(args[1], { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(3000);
  const title = await page.title();
  if (/验证|captcha|异常/i.test(title)) {
    console.log(`【打开失败】页面弹了验证码（${title}），正文没拿到。`);
    process.exitCode = 2;
  } else {
    console.log("标题：", title);
    console.log(await page.evaluate(() => document.body.innerText));
  }
} else {
  const [q, pn] = args;
  await page.goto(`https://www.baidu.com/s?wd=${encodeURIComponent(q)}${pn ? `&pn=${pn}` : ""}`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(2500);
  const items = await page.$$eval("#content_left > div", (ds) =>
    ds
      .map((d) => {
        const a = d.querySelector("h3 a");
        return a
          ? { title: a.innerText.trim(), url: d.getAttribute("mu") || a.href, text: d.innerText.replace(/\s+/g, " ") }
          : null;
      })
      .filter(Boolean),
  );
  await report(items, "百度");
}
await browser.close();
