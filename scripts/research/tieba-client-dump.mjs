import { researchFetch } from "./request-guard.mjs";
// 把 tieba-client-read.mjs 保存的帖子 JSON 整理成可读文本：楼层、作者、日期、正文、楼中楼。
// node scripts/research/tieba-client-dump.mjs <帖子.json> [每层最多字数，默认 0 = 不截断]
// 加 --images <最多楼层> <输出目录> 时，同时下载前若干楼的原图，供人工看截图（截图常有角色名、聊天记录和雇佣记录）。
// 文末汇总正文里贴出的游戏聊天记录（[ 2025.02.28 13:44:48 ] 某某 > ……）的发言人，作者自己的角色名常在其中。
// 输出可能含现实隐私，只在临时目录使用，整理后再归档。
import { mkdir, readFile, writeFile } from "node:fs/promises";

const args = process.argv.slice(2);
const file = args[0];
const maxChars = Number(args[1] && !args[1].startsWith("--") ? args[1] : 0) || Infinity;
const imageIndex = args.indexOf("--images");
if (!file) {
  console.error("用法：node scripts/research/tieba-client-dump.mjs <帖子.json> [每层最多字数] [--images <最多楼层> <输出目录>]");
  process.exit(1);
}

const data = JSON.parse(await readFile(file, "utf8"));
const text = (content) =>
  (content || []).map((part) => part.text || (String(part.type) === "3" ? "[图]" : part.c || "")).join("").replace(/\s+/g, " ");

const chatLine = /\[\s*\d{4}[./-]\d{2}[./-]\d{2}[^\]]*\]\s*([^\[\]>]{2,40}?)\s*>/g;
const speakers = new Map();

console.log(`## ${data.pages[0].thread?.title} ${data.source}`);
if (data.coverage) console.log(`覆盖：${JSON.stringify(data.coverage.orders)}；主楼 ${data.coverage.main_posts}；楼中楼 ${data.coverage.subposts_fetched}；完整 ${data.complete}`);
const pages = [...data.pages, ...(data.reverse_pages || [])];
const users = Object.fromEntries(pages.flatMap((page) => (page.user_list || []).map((user) => [user.id, `${user.name_show || user.name}（uid ${user.id}，原名 ${user.name || "未提供"}）`])));
const posts = [...new Map(pages.flatMap((page) => page.post_list).map((post) => [String(post.id), post])).values()].sort((a, b) => Number(a.floor) - Number(b.floor));
for (const post of posts) {
    const date = new Date(Number(post.time) * 1000).toISOString().slice(0, 10);
    const author = users[post.author_id] || post.author?.name_show || post.author_id;
    const body = text(post.content);
    console.log(`#${post.floor} pid=${post.id} [${author}] ${date}: ${body.slice(0, maxChars)}`);
    for (const sub of post.sub_post_list?.sub_post_list || []) {
      const subAuthor = sub.author ? `${sub.author.name_show || sub.author.name}（uid ${sub.author.id}，原名 ${sub.author.name || "未提供"}）` : users[sub.author_id] || sub.author_id;
      const subDate = sub.time ? new Date(Number(sub.time) * 1000).toISOString().slice(0, 10) : "日期未提供";
      console.log(`   ↳ id=${sub.id} [${subAuthor}] ${subDate}: ${text(sub.content).slice(0, maxChars)}`);
    }
    for (const [, name] of body.matchAll(chatLine)) {
      const key = `${name}（贴者 ${author}）`;
      speakers.set(key, [...new Set([...(speakers.get(key) || []), post.floor])]);
    }
}
if (speakers.size) {
  console.log("\n## 正文贴出的聊天记录发言人（核对作者角色名）");
  for (const [name, floors] of speakers) console.log(`- ${name}：${floors.map((floor) => `#${floor}`).join(" ")}`);
}

if (imageIndex >= 0) {
  const maxFloor = Number(args[imageIndex + 1]);
  const outDir = args[imageIndex + 2];
  if (!Number.isInteger(maxFloor) || !outDir) {
    console.error("--images 需要 <最多楼层> <输出目录>");
    process.exit(1);
  }
  await mkdir(outDir, { recursive: true });
  for (const post of posts) {
    if (Number(post.floor) > maxFloor) continue;
    const items = [{ content: post.content, prefix: `f${post.floor}` },
      ...(post.sub_post_list?.sub_post_list || []).map((sub) => ({ content: sub.content, prefix: `f${post.floor}-s${sub.id}` }))];
    for (const item of items) {
      let index = 0;
      for (const part of item.content || []) {
        const url = part.origin_src || part.big_cdn_src || part.cdn_src;
        if (!url) continue;
        const response = await researchFetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(30000) });
        if (!response.ok) { console.error(`图片 HTTP ${response.status}：${url}`); process.exitCode = 2; continue; }
        const name = `${outDir}/${item.prefix}-${index++}.jpg`;
        await writeFile(name, Buffer.from(await response.arrayBuffer()));
        console.error(`图片 ${name}`);
      }
    }
  }
}
