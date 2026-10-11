// 读正序、倒序主楼并逐层分页补楼中楼；原始材料可能含隐私，只存临时目录。
// node scripts/research/tieba-client-read.mjs <帖子ID或网址> <临时.json> [最多主楼页数|all] [--reverse|--both] [--no-subposts] [--resume]
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { mainPage, request, threadId, pause } from "./tieba-client-api.mjs";

const [input, output, ...args] = process.argv.slice(2);
const tid = threadId(input);
const limitArg = args.find((arg) => !arg.startsWith("--"));
const limit = limitArg === "all" ? Infinity : Number(limitArg || 1);
if (!tid || !output || !(limit === Infinity || Number.isInteger(limit) && limit >= 1) || args.some((arg) => arg.startsWith("--") && !["--reverse", "--both", "--no-subposts", "--resume"].includes(arg))) {
  console.error("用法：node scripts/research/tieba-client-read.mjs <帖子ID或网址> <临时.json> [最多页数|all] [--reverse|--both] [--no-subposts] [--resume]");
  process.exit(1);
}
let saved;
if (args.includes("--resume")) {
  saved = JSON.parse(await readFile(output, "utf8"));
  if (threadId(saved.source) !== tid || !saved.coverage?.orders || !Array.isArray(saved.pages)) throw new Error("续跑文件与帖号不符或没有覆盖记录");
  const hadReversePages = Array.isArray(saved.reverse_pages);
  if (!hadReversePages && saved.coverage.orders.reverse) throw new Error("旧格式不支持续跑，请另存重新抓取");
  // 单独倒序抓取时 pages 存倒序；不要混进 --both 的正序数组。
  if (args.includes("--both") && saved.coverage.orders.reverse && !saved.coverage.orders.forward && saved.pages.length) throw new Error("单独倒序文件请按原顺序续跑");
  if (args.includes("--reverse") && !args.includes("--both") && saved.coverage.orders.forward) throw new Error("正序或双序文件请按原顺序续跑");
}
const pages = saved?.pages || [], reversePages = saved?.reverse_pages || [], errors = [], coverage = saved?.coverage || { orders: {}, subposts: [] };
const oldSubstates = new Map(coverage.subposts.map((state) => [state.pid, state]));
coverage.subposts = [];
let rateLimited = false;
const data = { source: `https://tieba.baidu.com/p/${tid}`, fetched_at: saved?.fetched_at || new Date().toISOString(), resumed_at: saved ? new Date().toISOString() : undefined, complete: false, pages, reverse_pages: reversePages, coverage, errors, previous_errors: [...(saved?.previous_errors || []), ...(saved?.errors || [])] };
async function save() {
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(data, null, 2));
}
const orders = args.includes("--both") ? [false, true] : [args.includes("--reverse")];
for (const reverse of orders) {
  const name = reverse ? "reverse" : "forward";
  const list = reverse && args.includes("--both") ? reversePages : pages;
  const state = coverage.orders[name] ||= { pages: 0, complete: false };
  if (state.complete) continue;
  delete state.error;
  if (rateLimited) { state.error = "限流后未请求"; continue; }
  try {
    // 客户端 r=1 只倒排页内；倒序应从末页开始走到第一页。
    let bootstrap;
    if (reverse && !coverage.orders.forward?.total_pages && !state.total_pages) bootstrap = await mainPage(tid, 1, true);
    let totalPages = Number(state.total_pages || coverage.orders.forward?.total_pages || bootstrap?.page.total_page || Infinity);
    state.page_numbers ||= [];
    for (let count = 1; count <= limit; count++) {
      const pn = reverse ? totalPages - count + 1 : count;
      if (state.page_numbers.includes(pn)) continue;
      const page = reverse && pn === 1 && bootstrap ? bootstrap : await mainPage(tid, pn, reverse);
      list.push(page);
      state.page_numbers.push(pn);
      state.pages = state.page_numbers.length;
      state.total_pages = totalPages = Number(page.page.total_page);
      if (page.main_list_omitted) (state.empty_pages ||= []).push(pn);
      const floors = page.post_list.map((post) => Number(post.floor));
      console.log(`${name} ${pn}/${state.total_pages}：${page.post_list.length} 条主楼，${floors.length ? `${Math.min(...floors)}—${Math.max(...floors)} 楼` : "接口省略列表，保留缺口"}`);
      await save();
      if (state.pages >= state.total_pages) { state.complete = true; break; }
      await pause();
    }
  } catch (error) {
    errors.push({ order: name, message: error.message });
    if (/HTTP (429|403|412)|请求预算/.test(error.message)) rateLimited = true;
  }
}
// 正倒序以 post ID 去重；每层单独记覆盖，不能以预览代替全文。
const posts = new Map();
for (const page of [...pages, ...reversePages]) {
  for (const post of page.post_list) {
    const key = String(post.id), prior = posts.get(key);
    if (prior) {
      prior.sub_post_number = Math.max(Number(prior.sub_post_number || 0), Number(post.sub_post_number || 0));
      const subs = new Map([...(prior.sub_post_list?.sub_post_list || []), ...(post.sub_post_list?.sub_post_list || [])].map((sub) => [String(sub.id), sub]));
      prior.sub_post_list = { ...prior.sub_post_list, sub_post_list: [...subs.values()] };
    } else posts.set(key, post);
  }
}
// 每次中途保存也保留完整楼中楼；避免倒序副本的两条预览盖掉已补全的正序副本。
for (const page of [...pages, ...reversePages]) page.post_list = page.post_list.map((post) => posts.get(String(post.id)));
for (const post of posts.values()) {
  const expected = Number(post.sub_post_number || 0);
  if (!expected) continue;
  const subs = new Map((post.sub_post_list?.sub_post_list || []).map((sub) => [String(sub.id), sub]));
  const state = { pid: String(post.id), floor: post.floor, expected, preview: subs.size, fetched: subs.size, pages: 0, complete: false };
  coverage.subposts.push(state);
  const oldState = oldSubstates.get(state.pid);
  // 已走到可见末页的计数差不是待重试页面；续跑只补真正中断/失败的楼层。
  if (oldState && !oldState.error && oldState.pages >= oldState.total_pages && subs.size >= oldState.fetched && Number(oldState.expected) >= expected) {
    Object.assign(state, oldState, { fetched: subs.size }); continue;
  }
  if (!args.includes("--no-subposts") && !rateLimited) {
    try {
      let totalPages = 1;
      for (let pn = 1; pn <= totalPages; pn++) {
        await pause();
        const result = await request("floor", { kz: tid, pid: String(post.id), pn: String(pn), rn: "30" });
        // 已过滤/不可见的一页可能省略重复列表字段，但仍返回完整的对应页码和计数。
        // 只接受这种有元数据的空页；错帖、错楼、错页或非数组字段仍报错。
        const omittedList = result.subpost_list === undefined && result.page?.total_count !== undefined && Number.isInteger(Number(result.page.total_count)) && Number(result.page.total_count) >= 0;
        const visibleSubs = omittedList ? [] : result.subpost_list;
        const isZero = value => value === 0 || value === "0";
        // 老帖也会返回四项全零的分页元数据，却带着真实回复；保留列表，不能宣称完整。
        const zeroPageMetadata = pn === 1 && isZero(result.page?.current_page) && isZero(result.page?.total_page) && isZero(result.page?.total_count) && isZero(result.subpost_num) && Array.isArray(visibleSubs);
        const noVisiblePages = zeroPageMetadata && visibleSubs.length === 0;
        if (String(result.thread?.id) !== tid || String(result.post?.id) !== String(post.id) || (Number(result.page?.current_page) !== pn && !zeroPageMetadata) || !Array.isArray(visibleSubs)) throw new Error(`楼中楼 #${post.floor} 第 ${pn} 页不对应或缺少列表`);
        totalPages = Number(result.page.total_page);
        if (!Number.isInteger(totalPages) || (totalPages < pn && !zeroPageMetadata)) throw new Error("楼中楼页数无效");
        state.expected = Math.max(state.expected, Number(result.page.total_count || result.subpost_num || 0));
        if (omittedList || noVisiblePages) (state.empty_pages ||= []).push(pn);
        if (noVisiblePages) state.no_visible_pages = true;
        if (zeroPageMetadata) state.zero_page_metadata = true;
        for (const sub of visibleSubs) subs.set(String(sub.id), sub);
        state.pages = pn; state.total_pages = totalPages; state.fetched = subs.size;
        state.complete = !zeroPageMetadata && pn >= totalPages && subs.size >= state.expected;
        post.sub_post_list = { ...post.sub_post_list, sub_post_list: [...subs.values()] };
        console.log(`楼中楼 #${post.floor} ${zeroPageMetadata ? "接口分页元数据全零，保留可见回复" : `${pn}/${totalPages}`}：${subs.size}/${state.expected}`);
        await save();
      }
    } catch (error) {
      state.error = error.message; errors.push({ pid: state.pid, message: error.message });
      if (/HTTP (429|403|412)|请求预算/.test(error.message)) rateLimited = true;
    }
  }
}
for (const page of [...pages, ...reversePages]) page.post_list = page.post_list.map((post) => posts.get(String(post.id)));
coverage.main_posts = posts.size;
coverage.subposts_fetched = coverage.subposts.reduce((sum, state) => sum + state.fetched, 0);
coverage.main_complete = Object.values(coverage.orders).every((state) => state.complete);
coverage.subposts_complete = coverage.subposts.every((state) => state.complete);
coverage.main_empty_pages = Object.values(coverage.orders).some(state => state.empty_pages?.length);
data.complete = !errors.length && coverage.main_complete && !coverage.main_empty_pages && coverage.subposts_complete;
await save();
console.log(`已保存 ${posts.size} 条主楼、${coverage.subposts_fetched} 条楼中楼；${data.complete ? "请求的顺序及可见楼中楼分页完成（不包含已删内容）" : "仍有缺口，见 coverage/errors"}：${output}`);
if (errors.length) { console.error(errors); process.exitCode = 2; }
