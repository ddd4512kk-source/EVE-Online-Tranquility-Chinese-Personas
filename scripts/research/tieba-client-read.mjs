// 取材用的匿名客户端读帖入口；不登录、不提供账号凭据，不接入网站构建。
// node scripts/research/tieba-client-read.mjs <帖子ID或网址> <临时输出.json> [最多页数]
// 输出为原始公开材料，可能含现实隐私；整理后才可写进素材库。
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const [input, output, limitArg] = process.argv.slice(2);
const tid = /^\d+$/.test(input || "")
  ? input
  : input?.match(/^https?:\/\/(?:[\w-]+\.)?baidu\.com\/p\/(\d+)/)?.[1];
const limit = limitArg === undefined ? 100 : Number(limitArg);
if (!tid || !output || !Number.isInteger(limit) || limit < 1 || limit > 100) {
  console.error("用法：node scripts/research/tieba-client-read.mjs <帖子ID或网址> <临时输出.json> [最多页数：1—100]");
  process.exit(1);
}

const pages = [];
try {
  for (let pn = 1; pn <= limit; pn++) {
    const params = {
      _client_type: "2",
      _client_version: "12.1.1.0",
      kz: tid,
      pn: String(pn),
      rn: "30",
      with_floor: "1",
    };
    // 公开客户端协议签名，不是用户凭据。
    params.sign = createHash("md5")
      .update(Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join("") + "tiebaclient!!!")
      .digest("hex").toUpperCase();
    const response = await fetch("https://c.tieba.baidu.com/c/f/pb/page", {
      method: "POST",
      body: new URLSearchParams(params),
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`第 ${pn} 页 HTTP ${response.status}`);
    const data = await response.json();
    if (Number(data.error_code) !== 0 || !Array.isArray(data.post_list) || !data.post_list.length) {
      throw new Error(`第 ${pn} 页没有取得正文：${data.error_msg || data.error_code || "空页"}`);
    }
    if (String(data.thread?.id) !== tid || Number(data.page?.current_page) !== pn) {
      throw new Error(`第 ${pn} 页返回了不对应的帖子或页码`);
    }
    pages.push(data);
    const floors = data.post_list.map((post) => Number(post.floor));
    console.log(`第 ${pn}/${data.page.total_page} 页：${data.post_list.length} 条主楼（${Math.min(...floors)}—${Math.max(...floors)} 楼）`);
    if (!Number(data.page.has_more) || pn >= Number(data.page.total_page)) break;
    if (pn < limit) await new Promise((resolve) => setTimeout(resolve, 1000));
  }
} catch (error) {
  console.error(`【读帖失败】${error.message}；已取 ${pages.length} 页。失败不等于原帖无内容。`);
  process.exitCode = 2;
}

if (pages.length) {
  const complete = !process.exitCode && !Number(pages.at(-1).page.has_more);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify({
    source: `https://tieba.baidu.com/p/${tid}`,
    fetched_at: new Date().toISOString(),
    complete,
    // 主楼分页结束不保证楼中楼、已删楼、折叠楼全部返回。
    pages,
  }, null, 2));
  console.log(`已保存 ${pages.length} 页到 ${output}（${complete ? "主楼分页结束" : "部分读取"}；楼中楼可能不全）。`);
}
