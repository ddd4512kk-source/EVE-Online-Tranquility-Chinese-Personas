// 取材用：列出某贴吧账号的全部公开主题或回帖（匿名客户端接口，不弹验证码）。
// node scripts/research/tieba-client-user.mjs <帖子.json> <用户名片段> [1=主题（默认）|0=回帖]
// 先用 tieba-client-read.mjs 读一个该账号发过言的帖子存成 JSON，本脚本从其中的 user_list 找到 uid 再查此人的发帖。
// 输出每行：主题ID | 日期 | 吧名 | 标题 | 正文片段。适合做“本人发帖全量”检查：自述、辩解、旧帖往往就是最好的料。
// 限制：回帖列表接口常返回 hide_post=1（用户隐藏），此时只能靠站内搜索（tieba-client-search.mjs）补；主题通常能全部列出。
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const [file, who, isThread = "1"] = process.argv.slice(2);
if (!file || !who) {
  console.error("用法：node scripts/research/tieba-client-user.mjs <帖子.json> <用户名片段> [1|0]");
  process.exit(1);
}

const data = JSON.parse(await readFile(file, "utf8"));
const users = data.pages.flatMap((page) => page.user_list || []);
// 贴吧可能把展示名改成“贴吧用户_...”，但原用户名仍留在 name。
const user = users.find((item) => [item.name_show, item.name].some((name) => String(name || "").includes(who)));
if (!user) {
  console.error(`帖子里没有名字含“${who}”的账号。已有账号：${users.map((item) => item.name_show).join("、")}`);
  process.exit(1);
}
console.log(`用户 ${user.name_show || user.name}（原用户名 ${user.name || "未提供"}，uid ${user.id}）`);

function sign(params) {
  params.sign = createHash("md5")
    .update(Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join("") + "tiebaclient!!!")
    .digest("hex").toUpperCase();
  return params;
}

for (let pn = 1; pn <= 10; pn++) {
  const params = sign({ _client_type: "2", _client_version: "12.1.1.0", uid: String(user.id), pn: String(pn), rn: "50", is_thread: isThread, need_content: "1" });
  const response = await fetch("https://c.tieba.baidu.com/c/u/feed/userpost", {
    method: "POST",
    body: new URLSearchParams(params),
    signal: AbortSignal.timeout(30000),
  });
  const result = await response.json();
  if (Number(result.error_code)) {
    console.error(`第 ${pn} 页失败：${result.error_code} ${result.error_msg}`);
    process.exitCode = 2;
    break;
  }
  const list = result.post_list || [];
  if (!list.length) {
    if (pn === 1 && String(result.hide_post) === "1") console.error("【受限】该用户隐藏了发帖列表（hide_post=1）。");
    break;
  }
  for (const item of list) {
    const parts = Array.isArray(item.content)
      ? item.content.map((entry) => (entry.post_content || []).map((part) => part.text || "").join("")).join(" ")
      : String(item.content || "");
    const clean = parts.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").slice(0, 200);
    const date = new Date(Number(item.create_time) * 1000).toISOString().slice(0, 10);
    console.log([item.thread_id, date, item.forum_name, item.title, clean].join(" | "));
  }
  await new Promise((resolve) => setTimeout(resolve, 800));
}
