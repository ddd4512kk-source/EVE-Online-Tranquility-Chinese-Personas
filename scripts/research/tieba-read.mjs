// 贴吧读帖工具（有头浏览器）：打开一个看得见的浏览器窗口，逐个读取贴吧帖子全部楼层。
//
// 为什么需要它：脚本直接访问贴吧、百度会弹“安全验证”。本工具不破解验证码——
// 遇到验证时暂停，由维护者在弹出的窗口里手动完成验证，之后自动继续。
// 浏览器资料保存在 ~/.cache/personas-browser，验证通过后的登录态可在下次复用。
//
// 用法：
//   node scripts/research/tieba-read.mjs <输出目录> <帖子ID或网址>... [--search "百度关键词"]...
//   node scripts/research/tieba-read.mjs out 11003073829 6282295426 --search "拉面林 eve欧服吧"
// 每个帖子写一个 <ID>.txt（每页最多读 5 页），每个搜索写一个 search-<序号>.txt。

import { chromium } from "playwright";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [outDir, ...rest] = process.argv.slice(2);
if (!outDir || !rest.length) {
  console.log("用法：node scripts/research/tieba-read.mjs <输出目录> <帖子ID或网址>... [--search \"关键词\"]");
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const jobs = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i] === "--search") jobs.push({ search: rest[++i] });
  else jobs.push({ id: (rest[i].match(/(\d{6,})/) || [])[1] });
}

const ctx = await chromium.launchPersistentContext(path.join(os.homedir(), ".cache", "personas-browser"), {
  headless: false,
  locale: "zh-CN",
  viewport: { width: 1200, height: 900 },
});
const page = ctx.pages()[0] || (await ctx.newPage());

async function isBlocked() {
  const title = await page.title().catch(() => "");
  return /验证|captcha|异常/i.test(title) || (await page.locator("text=安全验证").count().catch(() => 0)) > 0;
}

// 遇到验证码：提示维护者手动完成，最多等 10 分钟。
async function waitHuman() {
  if (!(await isBlocked())) return true;
  console.log("【请手动验证】浏览器窗口里出现了百度安全验证，请完成验证，完成后会自动继续……");
  const until = Date.now() + 10 * 60 * 1000;
  while (Date.now() < until) {
    await page.waitForTimeout(2000);
    if (!(await isBlocked())) {
      console.log("验证已通过，继续。");
      await page.waitForTimeout(1500);
      return true;
    }
  }
  console.log("【搜索失败】等待验证超时。");
  return false;
}

async function open(url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 }).catch((e) => console.log("打开失败", e.message));
  await page.waitForTimeout(2500);
  return waitHuman();
}

async function readPage() {
  return page.evaluate(() => {
    const posts = [...document.querySelectorAll(".l_post")];
    if (!posts.length) return document.body.innerText;
    return posts
      .map((p) => {
        const name = p.querySelector(".d_name, .p_author_name")?.innerText.trim() || "";
        const tail = [...p.querySelectorAll(".tail-info, .post-tail-wrap span")].map((x) => x.innerText.trim()).join(" ");
        const body = p.querySelector(".d_post_content")?.innerText.trim() || "";
        const subs = [...p.querySelectorAll(".lzl_single_post")].map((c) => "    ↳ " + c.innerText.replace(/\s+/g, " ").trim()).join("\n");
        return `【${name}】${tail}\n${body}${subs ? "\n" + subs : ""}`;
      })
      .join("\n\n");
  });
}

let n = 0;
for (const job of jobs) {
  if (job.search) {
    n++;
    const file = path.join(outDir, `search-${n}.txt`);
    if (!(await open(`https://www.baidu.com/s?wd=${encodeURIComponent(job.search)}`))) break;
    const items = await page.$$eval("#content_left > div", (ds) =>
      ds.map((d) => ({ title: d.querySelector("h3")?.innerText || "", url: d.querySelector("h3 a")?.href || "", text: d.innerText.replace(/\s+/g, " ") })).filter((x) => x.title),
    );
    fs.writeFileSync(file, `# 百度：${job.search}\n\n` + items.map((x) => `■ ${x.title}\n  ${x.url}\n  ${x.text.slice(0, 500)}\n`).join("\n"));
    console.log(`搜索完成：${job.search} → ${file}（${items.length} 条）`);
    continue;
  }
  if (!job.id) continue;
  const file = path.join(outDir, `${job.id}.txt`);
  if (!(await open(`https://tieba.baidu.com/p/${job.id}`))) break;
  const title = await page.title();
  let text = `# ${title}\nhttps://tieba.baidu.com/p/${job.id}\n\n## 第 1 页\n` + (await readPage());
  const pages = await page.evaluate(() => {
    const m = document.body.innerText.match(/共\s*(\d+)\s*页/);
    return m ? +m[1] : 1;
  });
  for (let pn = 2; pn <= Math.min(pages, 5); pn++) {
    if (!(await open(`https://tieba.baidu.com/p/${job.id}?pn=${pn}`))) break;
    text += `\n\n## 第 ${pn} 页\n` + (await readPage());
  }
  fs.writeFileSync(file, text);
  console.log(`读完：${title}（${Math.min(pages, 5)}/${pages} 页）→ ${file}`);
  await page.waitForTimeout(3000);
}
await ctx.close();
