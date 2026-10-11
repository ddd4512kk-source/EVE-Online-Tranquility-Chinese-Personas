// 知乎取料工具（有头浏览器）：搜索、读文章/回答/问题（含评论区）、列某用户的全部文章与回答。
//
// 为什么需要它：脚本或无头浏览器访问知乎一律 403/40362，搜索页还会弹“安全验证”。
// 本工具用本机 Edge 打开看得见的窗口；遇到验证时暂停，由维护者手动完成，之后自动继续。
// 浏览器资料保存在 ~/.cache/personas-zhihu，验证或登录后的状态下次复用。
//
// 用法：
//   node scripts/research/zhihu.mjs search "关键词1" "关键词2"... [页数=3]    经搜狗“知乎站内”搜索（知乎自带搜索未登录无结果）
//   node scripts/research/zhihu.mjs read <网址>... [--no-comments]    文章 / 回答 / 问题（问题会读全部回答）
//   node scripts/research/zhihu.mjs user <用户主页网址或url_token> [posts|answers|both=both]
// 输出到标准输出；用 > 文件 保存。原始输出可能含现实隐私，只放临时目录。

import { chromium } from "playwright";
import os from "node:os";
import path from "node:path";

const [cmd, ...rest] = process.argv.slice(2);
if (!["search", "read", "user"].includes(cmd) || !rest.length) {
  console.log('用法：node scripts/research/zhihu.mjs search "关键词" [页数] | read <网址>... [--no-comments] | user <主页或url_token> [posts|answers|both]');
  process.exit(1);
}

const ctx = await chromium.launchPersistentContext(path.join(os.homedir(), ".cache", "personas-zhihu"), {
  channel: "msedge",
  headless: false,
  locale: "zh-CN",
  viewport: { width: 1200, height: 900 },
  args: ["--disable-blink-features=AutomationControlled"],
});
await ctx.addInitScript(() => Object.defineProperty(navigator, "webdriver", { get: () => undefined }));
const page = ctx.pages()[0] || (await ctx.newPage());
const sleep = (ms) => page.waitForTimeout(ms);

async function isBlocked() {
  const title = await page.title().catch(() => "");
  if (/安全验证|验证码/.test(title) || /antispider/.test(page.url())) return true;
  const body = await page.evaluate(() => document.body?.innerText.slice(0, 300) || "").catch(() => "");
  return /"code":\s*40362|系统监测到您的网络环境存在异常|请输入验证码/.test(body);
}

const stoppedHosts = new Set();
let opened = 0;
async function waitHuman() {
  if (!(await isBlocked())) return true;
  console.error("【请手动验证】浏览器窗口里出现了安全验证（知乎或搜狗），请完成验证，完成后会自动继续……");
  const until = Date.now() + 10 * 60 * 1000;
  while (Date.now() < until) {
    await sleep(2000);
    if (!(await isBlocked())) {
      console.error("验证已通过，继续。");
      await sleep(2000);
      return true;
    }
  }
  console.log("【搜索失败】等待验证超时。");
  return false;
}

async function open(url) {
  const host = new URL(url).hostname;
  if (stoppedHosts.has(host) || opened >= 10) return false;
  opened++;
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => null);
  if (!response || [403, 429, 412].includes(response.status()) && !(await isBlocked())) { stoppedHosts.add(host); return false; }
  await sleep(2500);
  if (await isBlocked()) {
    if (!(await waitHuman())) { stoppedHosts.add(host); return false; }
    // 验证后知乎常跳回首页，重开一次目标页。
    if (!page.url().startsWith(url.split("?")[0])) {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
      await sleep(2500);
    }
  }
  // 关掉登录弹窗。
  await page.locator(".Modal-closeButton").first().click({ timeout: 1500 }).catch(() => {});
  return true;
}

// 滚动到底，直到条目数不再增长。
async function scrollAll(selector, maxRounds = 40) {
  let last = -1, still = 0;
  for (let i = 0; i < maxRounds && still < 3; i++) {
    await page.mouse.wheel(0, 4000);
    await sleep(1200);
    await page.locator(".Modal-closeButton").first().click({ timeout: 300 }).catch(() => {});
    const n = await page.locator(selector).count();
    still = n === last ? still + 1 : 0;
    last = n;
  }
}

// 展开所有“阅读全文”。
async function expandAll() {
  for (const b of await page.locator("button.ContentItem-more, .RichContent--unescapable button:has-text('阅读全文')").all()) {
    await b.click({ timeout: 800 }).catch(() => {});
  }
  await sleep(800);
}

// 评论区走站内接口（浏览器里带着 cookie，不需签名）。type: articles | answers
async function comments(type, id) {
  return page.evaluate(async ({ type, id }) => {
    const out = [];
    const fmt = (c, indent) => {
      const who = c.author?.name || c.author?.member?.name || "匿名";
      const to = c.reply_to_author?.name || c.reply_to_author?.member?.name;
      const t = new Date((c.created_time || 0) * 1000).toISOString().slice(0, 10);
      const text = (c.content || "").replace(/<[^>]+>/g, "").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
      out.push(`${indent}【${who}${to ? " 回复 " + to : ""}｜${t}｜赞${c.like_count ?? c.vote_count ?? 0}】${text}`);
    };
    let requested = 0;
    const pages = async (url, cb) => {
      for (; url && requested < 10; requested++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const r = await fetch(url, { credentials: "include" });
        if (!r.ok) throw new Error(`评论接口 HTTP ${r.status}，停止本轮读取`);
        const j = await r.json();
        for (const c of j.data || []) await cb(c);
        if (j.paging?.is_end) return;
        url = j.paging?.next;
      }
    };
    await pages(`https://www.zhihu.com/api/v4/comment_v5/${type}/${id}/root_comment?order_by=ts&limit=20`, async (c) => {
      fmt(c, "");
      if ((c.child_comment_count || 0) > (c.child_comments?.length || 0)) {
        await pages(`https://www.zhihu.com/api/v4/comment_v5/comment/${c.id}/child_comment?order_by=ts&limit=20`, async (cc) => fmt(cc, "    "));
      } else for (const cc of c.child_comments || []) fmt(cc, "    ");
    });
    return out;
  }, { type, id });
}

async function readArticle(url, withComments) {
  if (!(await open(url))) return;
  const d = await page.evaluate(() => ({
    title: document.querySelector(".Post-Title")?.innerText || document.title,
    author: document.querySelector(".AuthorInfo-name, .Post-Author .UserLink-link")?.innerText?.trim(),
    authorUrl: document.querySelector(".AuthorInfo a.UserLink-link, .Post-Author a")?.href,
    body: document.querySelector(".Post-RichText, .RichText")?.innerText || document.body.innerText,
    time: document.querySelector(".ContentItem-time")?.innerText,
    topics: [...document.querySelectorAll(".Post-topicsAndReviewer .Tag, .TopicLink")].map((e) => e.innerText).join("、"),
  }));
  console.log(`==== 文章 ${url}\n标题：${d.title}\n作者：${d.author || "?"} ${d.authorUrl || ""}\n${d.time || ""}　话题：${d.topics}\n\n${d.body}\n`);
  const id = url.match(/\/p\/(\d+)/)?.[1];
  if (withComments && id) console.log(`---- 评论\n${(await comments("articles", id)).join("\n")}\n`);
}

async function dumpAnswers(withComments) {
  await expandAll();
  const items = await page.evaluate(() =>
    [...document.querySelectorAll(".AnswerItem, .ContentItem.AnswerItem")].map((a) => {
      const meta = JSON.parse(a.getAttribute("data-zop") || "{}");
      return {
        id: meta.itemId || a.getAttribute("name"),
        author: meta.authorName || a.querySelector(".AuthorInfo-name")?.innerText,
        authorUrl: a.querySelector("a.UserLink-link")?.href,
        time: a.querySelector(".ContentItem-time")?.innerText,
        body: a.querySelector(".RichContent-inner")?.innerText || "",
      };
    })
  );
  const seen = new Set();
  for (const it of items) {
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    console.log(`---- 回答 ${it.id}　作者：${it.author} ${it.authorUrl || ""}　${it.time || ""}\n${it.body}\n`);
    if (withComments && it.id) console.log(`（评论）\n${(await comments("answers", it.id)).join("\n")}\n`);
  }
}

async function readQuestion(url, withComments) {
  const qid = url.match(/question\/(\d+)/)[1];
  // 给的是单个回答也读整个问题：同题其他回答常有互相揭短。
  const target = `https://www.zhihu.com/question/${qid}`;
  if (!(await open(target))) return;
  // 问题描述
  await page.locator("button.QuestionRichText-more").first().click({ timeout: 1000 }).catch(() => {});
  const q = await page.evaluate(() => ({
    title: document.querySelector(".QuestionHeader-title")?.innerText || document.title,
    detail: document.querySelector(".QuestionRichText")?.innerText || "",
    topics: [...document.querySelectorAll(".QuestionHeader-topics .Tag")].map((e) => e.innerText).join("、"),
  }));
  console.log(`==== 问题 ${target}\n标题：${q.title}\n话题：${q.topics}\n${q.detail}\n`);
  await scrollAll(".AnswerItem");
  await dumpAnswers(withComments);
}

// 知乎站内搜索未登录一律“未搜索到相关内容”，改用搜狗的知乎站内搜索；搜狗跳转链接解析成知乎原址。
async function search(q, pages) {
  const all = [];
  for (let p = 1; p <= pages; p++) {
    console.error(`搜狗：${q} 第 ${p} 页`);
    if (!(await open(`https://www.sogou.com/web?query=${encodeURIComponent(q)}&insite=zhihu.com&page=${p}`))) break;
    const items = await page.evaluate(() =>
      [...document.querySelectorAll(".vrwrap, .rb")].map((c) => {
        const a = c.querySelector("h3 a");
        return { title: a?.innerText?.trim(), url: a?.href, text: c.innerText.replace(/\s+/g, " ").trim() };
      }).filter((x) => x.url)
    );
    if (!items.length) break;
    all.push(...items);
    await sleep(2000 + Math.random() * 2000);
  }
  // 请求跳转页，从 meta refresh / location.replace 里取真实网址，不必打开知乎。
  for (const it of all) {
    if (!/sogou\.com\/link/.test(it.url)) continue;
    const html = await page
      .evaluate((u) => fetch(u, { credentials: "include", signal: AbortSignal.timeout(8000) }).then((r) => r.text()).catch(() => ""), it.url)
      .catch(() => "");
    it.url = html.match(/(?:URL='|replace\(")([^'"]+)/)?.[1] || it.url;
  }
  if (!all.length) {
    const body = await page.evaluate(() => document.body.innerText.slice(0, 300)).catch(() => "");
    console.log(`【零结果】搜狗知乎站内搜索“${q}”没有结果（或页面结构变了）。当前页 ${page.url()}\n${body}`);
  }
  for (const it of all) console.log(`■ ${it.title}\n  ${it.url}\n  ${it.text.slice(0, 300)}\n`);
}

async function user(who, which) {
  const token = who.match(/people\/([^/?#]+)/)?.[1] || who;
  for (const tab of which === "both" ? ["posts", "answers"] : [which]) {
    if (!(await open(`https://www.zhihu.com/people/${token}/${tab}`))) continue;
    await scrollAll(".List-item, .ContentItem", 60);
    const items = await page.evaluate(() =>
      [...document.querySelectorAll(".List-item .ContentItem, .ContentItem")].map((c) => {
        const a = c.querySelector(".ContentItem-title a");
        return { title: a?.innerText?.trim(), url: a?.href, text: c.querySelector(".RichContent-inner")?.innerText?.replace(/\s+/g, " ").slice(0, 200) };
      }).filter((x) => x.url)
    );
    console.log(`==== ${token} 的${tab === "posts" ? "文章" : "回答"}（${items.length} 条）`);
    for (const it of items) console.log(`■ ${it.title}\n  ${it.url}\n  ${it.text || ""}\n`);
  }
}

try {
  if (cmd === "search") {
    // 可一次给多个关键词（同一窗口跑完，少弹验证）；最后一个参数是数字时作页数。
    const pages = /^\d+$/.test(rest.at(-1)) ? Number(rest.pop()) : 3;
    for (const q of rest) {
      console.log(`\n######## ${q}`);
      await search(q, pages);
    }
  }
  else if (cmd === "user") await user(rest[0], rest[1] || "both");
  else {
    const withComments = !rest.includes("--no-comments");
    for (const u of rest.filter((x) => !x.startsWith("--"))) {
      if (/zhuanlan\.zhihu\.com\/p\/|\/p\/\d+/.test(u)) await readArticle(u, withComments);
      else if (/question\/\d+/.test(u)) await readQuestion(u, withComments);
      else console.log(`不认识的网址：${u}`);
      await sleep(3000 + Math.random() * 3000);
    }
  }
} finally {
  await ctx.close();
}
