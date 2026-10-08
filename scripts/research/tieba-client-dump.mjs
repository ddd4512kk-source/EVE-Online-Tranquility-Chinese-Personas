// 把 tieba-client-read.mjs 保存的帖子 JSON 整理成可读文本：楼层、作者、日期、正文、楼中楼。
// node scripts/research/tieba-client-dump.mjs <帖子.json> [每层最多字数，默认 600]
// 加 --images <最多楼层> <输出目录> 时，同时下载前若干楼的原图，供人工看截图（截图常有角色名、聊天记录和雇佣记录）。
// 输出可能含现实隐私，只在临时目录使用，整理后再归档。
import { mkdir, readFile, writeFile } from "node:fs/promises";

const args = process.argv.slice(2);
const file = args[0];
const maxChars = Number(args[1] && !args[1].startsWith("--") ? args[1] : 600);
const imageIndex = args.indexOf("--images");
if (!file) {
  console.error("用法：node scripts/research/tieba-client-dump.mjs <帖子.json> [每层最多字数] [--images <最多楼层> <输出目录>]");
  process.exit(1);
}

const data = JSON.parse(await readFile(file, "utf8"));
const text = (content) =>
  (content || []).map((part) => part.text || (String(part.type) === "3" ? "[图]" : part.c || "")).join("").replace(/\s+/g, " ");

console.log(`## ${data.pages[0].thread?.title} ${data.source}`);
for (const page of data.pages) {
  const users = Object.fromEntries((page.user_list || []).map((user) => [user.id, user.name_show || user.name]));
  for (const post of page.post_list) {
    const date = new Date(Number(post.time) * 1000).toISOString().slice(0, 10);
    console.log(`#${post.floor} [${users[post.author_id] || post.author?.name_show || post.author_id}] ${date}: ${text(post.content).slice(0, maxChars)}`);
    for (const sub of post.sub_post_list?.sub_post_list || []) {
      console.log(`   ↳ [${sub.author?.name_show || users[sub.author_id] || sub.author_id}] ${text(sub.content).slice(0, 250)}`);
    }
  }
}

if (imageIndex >= 0) {
  const maxFloor = Number(args[imageIndex + 1]);
  const outDir = args[imageIndex + 2];
  if (!Number.isInteger(maxFloor) || !outDir) {
    console.error("--images 需要 <最多楼层> <输出目录>");
    process.exit(1);
  }
  await mkdir(outDir, { recursive: true });
  for (const page of data.pages) {
    for (const post of page.post_list) {
      if (Number(post.floor) > maxFloor) continue;
      let index = 0;
      for (const part of post.content || []) {
        const url = part.origin_src || part.big_cdn_src || part.cdn_src;
        if (!url) continue;
        const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(30000) });
        const name = `${outDir}/f${post.floor}-${index++}.jpg`;
        await writeFile(name, Buffer.from(await response.arrayBuffer()));
        console.error(`图片 ${name}（HTTP ${response.status}）`);
      }
    }
  }
}
