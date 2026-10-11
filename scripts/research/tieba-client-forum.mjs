import { researchFetch } from "./request-guard.mjs";
// 取材用的贴吧帖子列表（匿名客户端接口，不弹验证码）：按最新回复顺序翻吧内主题，输出 TSV。
// node scripts/research/tieba-client-forum.mjs <吧名> <起始页> <结束页> <输出.tsv>
// 例：node scripts/research/tieba-client-forum.mjs eve欧服 1 110 temp/frs.tsv
// 每行：主题ID<TAB>创建日期<TAB>回复数<TAB>标题<TAB>浏览数<TAB>楼主展示名<TAB>首楼摘要（前 600 字）<TAB>楼主 uid<TAB>楼主原用户名。
// 不要只按标题里的名人名字或回复数筛：标题常是文学化的（“飞鸟尽良弓藏”），当事人也常是无名小号。
// 要连同首楼摘要按叙事词打分，并按楼主聚合找连载和高产发帖人，见 research-method.md“发现新人物”。
// 限制：翻到约第 110 页（约 2024 年中）后接口返回空页；更早的帖子用 tieba-client-search.mjs 站内搜索。
import { createHash } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const [forum, fromArg, toArg, output] = process.argv.slice(2);
const from = Number(fromArg);
const to = Number(toArg);
if (!forum || !output || !Number.isInteger(from) || !Number.isInteger(to) || from < 1 || to < from) {
  console.error("用法：node scripts/research/tieba-client-forum.mjs <吧名> <起始页> <结束页> <输出.tsv>");
  process.exit(1);
}
await mkdir(path.dirname(output), { recursive: true });

function sign(params) {
  params.sign = createHash("md5")
    .update(Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join("") + "tiebaclient!!!")
    .digest("hex").toUpperCase();
  return params;
}

for (let pn = from; pn <= to; pn++) {
  const params = sign({ _client_type: "2", _client_version: "12.1.1.0", kw: forum, pn: String(pn), rn: "50", sort_type: "1" });
  try {
    const response = await researchFetch("https://c.tieba.baidu.com/c/f/frs/page", {
      method: "POST",
      body: new URLSearchParams(params),
      signal: AbortSignal.timeout(30000),
    });
    if (response.ok === false) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (Number(data.error_code) !== 0) {
      console.error(`第 ${pn} 页失败：${data.error_code} ${data.error_msg}`);
      process.exitCode = 2;
      break;
    }
    const threads = data.thread_list || [];
    if (!threads.length) {
      console.log(`第 ${pn} 页为空，停止。`);
      break;
    }
    const users = new Map((data.user_list || []).map((user) => [String(user.id), user]));
    const lines = threads.map((thread) => {
      const author = users.get(String(thread.author_id)) || {};
      const firstPost = thread.first_post_content?.length ? thread.first_post_content : thread.abstract || [];
      return [
        thread.id || thread.tid,
        new Date(Number(thread.create_time) * 1000).toISOString().slice(0, 10),
        thread.reply_num,
        (thread.title || "").replace(/\s+/g, " "),
        thread.view_num ?? "",
        (author.name_show || author.name || "").replace(/\s+/g, " "),
        firstPost.map((part) => part.text || "").join("").replace(/\s+/g, " ").slice(0, 600),
        thread.author_id || "",
        (author.name || "").replace(/\s+/g, " "),
      ].join("\t");
    });
    await appendFile(output, lines.join("\n") + "\n");
    console.log(`第 ${pn} 页：${threads.length} 个主题`);
  } catch (error) {
    console.error(`第 ${pn} 页出错：${error.message}`);
    process.exitCode = 2;
  }
  await new Promise((resolve) => setTimeout(resolve, 800));
}
