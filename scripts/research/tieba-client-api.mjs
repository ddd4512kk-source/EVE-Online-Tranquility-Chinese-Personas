import { researchFetch } from "./request-guard.mjs";
// 匿名公开客户端接口；只供取材，不接入构建，不使用登录凭据。
import { createHash } from "node:crypto";

export const pause = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export function threadId(input) {
  return /^\d+$/.test(input || "") ? input : input?.match(/^https?:\/\/(?:[\w-]+\.)?tieba\.baidu\.com\/p\/(\d+)/)?.[1];
}

export async function request(endpoint, fields) {
  const params = { _client_type: "2", _client_version: "12.1.1.0", ...fields };
  params.sign = createHash("md5")
    .update(Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join("") + "tiebaclient!!!")
    .digest("hex").toUpperCase();
  const response = await researchFetch(`https://c.tieba.baidu.com/c/f/pb/${endpoint}`, {
    method: "POST", body: new URLSearchParams(params), signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (Number(data.error_code) !== 0) throw new Error(`${data.error_code}: ${data.error_msg || "接口错误"}`);
  return data;
}

export async function mainPage(tid, pn, reverse = false) {
  const data = await request("page", { kz: String(tid), pn: String(pn), rn: "30", r: reverse ? "1" : "0", with_floor: "1" });
  const totalPages = Number(data.page?.total_page);
  // 部分整页评论被过滤时，接口仍返回对应页元数据，却省略 post_list。
  // 标记空页并继续翻页，不把这些不可见评论当成已取得。
  const omittedList = data.post_list === undefined && data.page?.total_num !== undefined && Number.isInteger(Number(data.page.total_num)) && Number(data.page.total_num) >= 0;
  if (omittedList) { data.post_list = []; data.main_list_omitted = true; }
  if (String(data.thread?.id) !== String(tid) || Number(data.page?.current_page) !== pn || !Number.isInteger(totalPages) || totalPages < pn || !Array.isArray(data.post_list) || (!data.post_list.length && !omittedList)) {
    throw new Error(`主楼 ${reverse ? "倒序" : "正序"}第 ${pn} 页不对应或为空`);
  }
  return data;
}

export const contentText = (content = []) => content.map((part) => part.text || (String(part.type) === "3" ? "[图]" : part.c || "")).join("");
