import { researchFetch } from "./request-guard.mjs";
// 取材用的 Reddit 帖子读取入口：走 pullpush.io 存档，不访问 reddit.com（会被拦），不接入网站构建。
// node scripts/research/reddit-thread.mjs <帖子ID或网址> <临时输出.json>
// 输出原始公开材料并在终端打印正文与全部评论；截图链接（preview.redd.it）需另行下载查看。
import { writeFile } from "node:fs/promises";

const [input, output] = process.argv.slice(2);
const id = /^[a-z0-9]{5,10}$/i.test(input || "")
  ? input
  : input?.match(/\/comments\/([a-z0-9]+)/i)?.[1];
if (!id || !output) {
  console.error("用法：node scripts/research/reddit-thread.mjs <帖子ID或网址> <临时输出.json>");
  process.exit(1);
}

const api = "https://api.pullpush.io/reddit/search";
const get = async (url) => {
  const res = await researchFetch(url, { headers: { "User-Agent": "eve-yeshi-research" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}：请求失败，不自动重试`);
  return (await res.json()).data || [];
};

const [post] = await get(`${api}/submission/?ids=${id}`);
if (!post) {
  console.error(`存档里找不到帖子 ${id}`);
  process.exit(1);
}

// 评论每页最多 100 条，按时间往后翻页直到取完。
const comments = [];
const seen = new Set();
let after = 0, complete = false, error;
try { for (;;) {
  const page = await get(`${api}/comment/?link_id=${id}&size=100&sort=asc&sort_type=created_utc&after=${after}`);
  const fresh = page.filter((c) => !seen.has(c.id));
  if (!fresh.length) { complete = true; break; }
  for (const c of fresh) seen.add(c.id), comments.push(c);
  after = Math.max(...page.map((c) => c.created_utc));
  if (page.length < 100) { complete = true; break; }
} } catch (failure) { error = failure.message; console.error(error); process.exitCode = 2; }

await writeFile(output, JSON.stringify({ source: `https://www.reddit.com/r/${post.subreddit}/comments/${id}/`, fetched_at: new Date().toISOString(), post, comments, complete, error }, null, 2));

const date = (t) => new Date(t * 1000).toISOString().slice(0, 10);
console.log(`[${date(post.created_utc)}] ${post.author} | ${post.title}\n${post.selftext || post.url}\n`);
for (const c of comments) console.log(`--- ${c.id} ← ${c.parent_id} ${c.author} [${date(c.created_utc)}]\n${c.body}`);
console.log(`\n共 ${comments.length} 条评论，已保存到 ${output}`);
