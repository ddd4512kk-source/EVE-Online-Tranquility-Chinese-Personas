import { researchFetch } from "./request-guard.mjs";
// 取材用的 Reddit 搜索入口：走 pullpush.io 存档，不访问 reddit.com，不接入网站构建。
// node scripts/research/reddit-search.mjs "关键词" [posts|comments] [subreddit=Eve] [最多条数=300]
// 关键词支持引号短语，如 "\"Army of Mango\""。结果按时间倒序打印；读全帖用 reddit-thread.mjs。
const [q, kind = "posts", sub = "Eve", maxArg = "300"] = process.argv.slice(2);
const max = Number(maxArg);
if (!q || !["posts", "comments"].includes(kind) || !Number.isInteger(max) || max < 1) {
  console.error('用法：node scripts/research/reddit-search.mjs "关键词" [posts|comments] [subreddit=Eve] [最多条数=300]');
  process.exit(1);
}

const endpoint = `https://api.pullpush.io/reddit/search/${kind === "posts" ? "submission" : "comment"}/`;
const get = async (url) => {
  const res = await researchFetch(url, { headers: { "User-Agent": "eve-yeshi-research" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}：请求失败，不自动重试`);
  return (await res.json()).data || [];
};

// 每页最多 100 条，按时间往前翻页。
const rows = [];
const seen = new Set();
let before = "";
while (rows.length < max) {
  const params = new URLSearchParams({ q, size: "100", sort: "desc", sort_type: "created_utc" });
  if (sub) params.set("subreddit", sub);
  if (before) params.set("before", before);
  const page = await get(`${endpoint}?${params}`);
  const fresh = page.filter((r) => !seen.has(r.id));
  if (!fresh.length) break;
  for (const r of fresh) seen.add(r.id), rows.push(r);
  before = String(Math.min(...page.map((r) => r.created_utc)));
  if (page.length < 100) break;
}

const date = (t) => new Date(t * 1000).toISOString().slice(0, 10);
for (const r of rows.slice(0, max)) {
  if (kind === "posts") {
    console.log(`[${date(r.created_utc)}] ${r.id} ${r.num_comments}评 ${r.author} | ${r.title}`);
  } else {
    const body = r.body.replace(/\s+/g, " ").slice(0, 300);
    console.log(`[${date(r.created_utc)}] ${r.link_id?.replace("t3_", "")}/${r.id} ${r.author}: ${body}`);
  }
}
console.log(`\n共 ${Math.min(rows.length, max)} 条`);
