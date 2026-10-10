// 取材用的贴吧站内搜索（匿名客户端接口，不走百度、不弹验证码）；不登录、不接入网站构建。
// node scripts/research/tieba-client-search.mjs "<关键词>" [页数，默认 3] [吧名片段，默认 eve；传空串 "" 不过滤]
// 例：node scripts/research/tieba-client-search.mjs "eve欧服 洗机库" 4 eve
// 输出每行：帖子ID | 日期 | 标题 | 命中正文片段。标题以“回复：”开头的是命中某个回帖，ID 仍是主题帖 ID，可交给 tieba-client-read.mjs。
// 限制：单页约 30 条；接口结果不带吧名，所以“吧名片段”过滤基本无效——关键词必须带“eve欧服”且足够具体（撞词的人名如“凯森”会搜出驾校、牙科），搜不到时换外号、联盟名或事件词。
import { createHash } from "node:crypto";

const [kw, pagesArg = "3", forum = "eve"] = process.argv.slice(2);
const pages = Number(pagesArg);
if (!kw || !Number.isInteger(pages) || pages < 1 || pages > 20) {
  console.error('用法：node scripts/research/tieba-client-search.mjs "<关键词>" [页数 1—20] [吧名片段]');
  process.exit(1);
}

// 公开客户端协议签名，不是用户凭据。
function sign(params) {
  params.sign = createHash("md5")
    .update(Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join("") + "tiebaclient!!!")
    .digest("hex").toUpperCase();
  return params;
}

const seen = new Set();
for (let pn = 1; pn <= pages; pn++) {
  const params = sign({ _client_type: "2", _client_version: "12.1.1.0", word: kw, pn: String(pn), rn: "30" });
  const response = await fetch("https://c.tieba.baidu.com/c/s/searchpost", {
    method: "POST",
    body: new URLSearchParams(params),
    signal: AbortSignal.timeout(30000),
  });
  const data = await response.json().catch(() => null);
  if (!data || Number(data.error_code)) {
    console.error(`【搜索失败】第 ${pn} 页：${data ? `${data.error_code} ${data.error_msg}` : "返回不是 JSON"}。失败不等于没有结果。`);
    process.exitCode = 2;
    break;
  }
  const list = data.post_list || [];
  if (!list.length) {
    if (pn === 1) console.error("【零结果】换关键词（外号、英文名、带上“eve欧服”）再搜。");
    break;
  }
  for (const item of list) {
    if (forum && !(item.forum_name || item.fname || "").includes(forum.replace(/吧$/, ""))) continue;
    const id = item.tid || item.thread_id || item.pid;
    if (seen.has(id)) continue;
    seen.add(id);
    const date = new Date(Number(item.time || item.create_time) * 1000).toISOString().slice(0, 10);
    const text = (value) => String(value || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ");
    console.log([id, date, text(item.title), text(item.content).slice(0, 120)].join(" | "));
  }
  if (pn < pages) await new Promise((resolve) => setTimeout(resolve, 800));
}
