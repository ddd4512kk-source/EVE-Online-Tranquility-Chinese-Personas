// 贴吧读帖工具（有头浏览器）：打开一个看得见的浏览器窗口，逐个读取贴吧帖子全部楼层。
//
// 为什么需要它：脚本直接访问贴吧、百度会弹“安全验证”。本工具不破解验证码——
const stoppedHosts = new Set();
let opened = 0;
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
  const host = new URL(url).hostname;
  if (stoppedHosts.has(host) || opened >= 10) return false;
  opened++;
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => null);
  if (!response || [403, 429, 412].includes(response.status()) && !(await isBlocked())) { stoppedHosts.add(host); return false; }
  await page.waitForTimeout(2500);
  const ok = await waitHuman();
  if (!ok) stoppedHosts.add(host);
  return ok;
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
