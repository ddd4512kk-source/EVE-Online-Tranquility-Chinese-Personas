#!/usr/bin/env node
// B 站取材工具（只用于取材，不接入构建）。匿名访问公开接口，不需要登录。
//
// 用法：
//   node scripts/research/bilibili.mjs user <关键词> [页]    搜 UP 主（mid、昵称、粉丝、签名）
//   node scripts/research/bilibili.mjs search <关键词> [页]  搜视频（标题、UP、日期、BV 号）
//   node scripts/research/bilibili.mjs videos <mid> [页]     列 UP 主的全部投稿（每页 50 条）
//   node scripts/research/bilibili.mjs info <mid>            UP 主资料（昵称、签名、粉丝）
//   node scripts/research/bilibili.mjs video <BV号> [评论页数] 视频简介、分 P、热门评论
//   node scripts/research/bilibili.mjs dynamics <mid>        UP 主近期动态（含专栏/图文）
//
// 接口被风控（-352、-412、412）时脚本会报【搜索失败】，隔一阵再试；不能当成零结果。

import crypto from 'node:crypto';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
let cookie = '';

async function initCookie() {
  const r = await fetch('https://www.bilibili.com/', { headers: { 'User-Agent': UA } });
  const set = r.headers.getSetCookie?.() ?? [];
  cookie = set.map(c => c.split(';')[0]).join('; ');
  if (!/buvid3=/.test(cookie)) {
    const s = await (await fetch('https://api.bilibili.com/x/frontend/finger/spi', { headers: { 'User-Agent': UA } })).json();
    if (s?.data?.b_3) cookie += `; buvid3=${s.data.b_3}; buvid4=${s.data.b_4}`;
  }
}

// 风控（412 / -352 / -412）时冷却后重试，三次仍失败才报【搜索失败】
async function api(url, referer = 'https://www.bilibili.com/') {
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA, Cookie: cookie, Referer: referer } });
    const j = r.ok ? await r.json() : null;
    if (j?.code === 0) return j.data;
    const why = j ? `接口返回 ${j.code} ${j.message ?? ''}` : `HTTP ${r.status}`;
    const limited = r.status === 412 || j?.code === -352 || j?.code === -412;
    if (!limited || attempt >= 3) fail(why);
    await new Promise(res => setTimeout(res, 15000 * (attempt + 1)));
  }
}

function fail(msg) {
  console.log(`【搜索失败】${msg}`);
  process.exit(2);
}

// WBI 签名（投稿列表、动态等接口需要）
const MIXIN = [46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52];
let mixinKey;
async function wbi(params) {
  if (!mixinKey) {
    const nav = await (await fetch('https://api.bilibili.com/x/web-interface/nav', { headers: { 'User-Agent': UA, Cookie: cookie } })).json();
    const key = f => f.slice(f.lastIndexOf('/') + 1).split('.')[0];
    const raw = key(nav.data.wbi_img.img_url) + key(nav.data.wbi_img.sub_url);
    mixinKey = MIXIN.map(i => raw[i]).join('').slice(0, 32);
  }
  const p = { ...params, wts: Math.floor(Date.now() / 1000) };
  const q = Object.keys(p).sort()
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(String(p[k]).replace(/[!'()*]/g, ''))}`).join('&');
  return `${q}&w_rid=${crypto.createHash('md5').update(q + mixinKey).digest('hex')}`;
}

const strip = s => String(s ?? '').replace(/<[^>]+>/g, '');
const day = t => new Date(t * 1000).toISOString().slice(0, 10);

const [cmd, arg, extra] = process.argv.slice(2);
if (!cmd || !arg) {
  console.log('用法见文件头注释：user | search | videos | info | video | dynamics');
  process.exit(1);
}
await initCookie();

if (cmd === 'user') {
  const d = await api(`https://api.bilibili.com/x/web-interface/search/type?search_type=bili_user&page=${extra ?? 1}&keyword=${encodeURIComponent(arg)}`, 'https://search.bilibili.com/');
  const list = d.result ?? [];
  if (!list.length) console.log('【零结果】');
  for (const u of list) console.log(`${u.mid}\t${u.uname}\t粉丝 ${u.fans}\t投稿 ${u.videos}\t${u.usign}\thttps://space.bilibili.com/${u.mid}`);
} else if (cmd === 'search') {
  const d = await api(`https://api.bilibili.com/x/web-interface/search/type?search_type=video&page=${extra ?? 1}&keyword=${encodeURIComponent(arg)}`, 'https://search.bilibili.com/');
  const list = d.result ?? [];
  if (!list.length) console.log('【零结果】');
  for (const v of list) console.log(`${day(v.pubdate)}\t${v.bvid}\t${strip(v.title)}\tUP：${v.author}(${v.mid})\t播放 ${v.play}`);
} else if (cmd === 'videos') {
  const q = await wbi({ mid: arg, ps: 50, pn: extra ?? 1, order: 'pubdate' });
  const d = await api(`https://api.bilibili.com/x/space/wbi/arc/search?${q}`, `https://space.bilibili.com/${arg}`);
  console.log(`共 ${d.page.count} 条，本页 ${d.page.pn}`);
  for (const v of d.list.vlist) console.log(`${day(v.created)}\t${v.bvid}\t${v.title}\t播放 ${v.play}\t${(v.description || '').replace(/\s+/g, ' ').slice(0, 120)}`);
} else if (cmd === 'info') {
  const d = await api(`https://api.bilibili.com/x/web-interface/card?mid=${arg}`);
  console.log(`${d.card.name}（${arg}）粉丝 ${d.card.fans}，投稿 ${d.archive_count}\n签名：${d.card.sign}`);
} else if (cmd === 'video') {
  const d = await api(`https://api.bilibili.com/x/web-interface/view?bvid=${arg}`);
  console.log(`# ${d.title}\nUP：${d.owner.name}(${d.owner.mid})　发布：${day(d.pubdate)}　播放 ${d.stat.view}　评论 ${d.stat.reply}\nhttps://www.bilibili.com/video/${arg}/\n\n简介：\n${d.desc}\n`);
  if (d.pages?.length > 1) console.log('分P：' + d.pages.map(p => `P${p.page} ${p.part}`).join(' / ') + '\n');
  const pages = Number(extra ?? 1);
  for (let pn = 1; pn <= pages; pn++) {
    const r = await api(`https://api.bilibili.com/x/v2/reply?type=1&oid=${d.aid}&sort=1&ps=20&pn=${pn}`, `https://www.bilibili.com/video/${arg}/`);
    for (const c of r.replies ?? []) {
      console.log(`- ${c.member.uname}（${day(c.ctime)}，赞 ${c.like}）：${c.content.message.replace(/\s+/g, ' ')}`);
      for (const s of c.replies ?? []) console.log(`  - ${s.member.uname}：${s.content.message.replace(/\s+/g, ' ')}`);
    }
  }
} else if (cmd === 'dynamics') {
  const q = await wbi({ host_mid: arg, features: 'itemOpusStyle' });
  const d = await api(`https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?${q}`, `https://space.bilibili.com/${arg}/dynamic`);
  for (const it of d.items ?? []) {
    const m = it.modules;
    const text = m.module_dynamic?.major?.opus?.summary?.text ?? m.module_dynamic?.desc?.text ?? m.module_dynamic?.major?.archive?.title ?? '';
    console.log(`${m.module_author?.pub_time}\thttps://t.bilibili.com/${it.id_str}\t${text.replace(/\s+/g, ' ').slice(0, 300)}`);
  }
} else {
  console.log(`未知命令：${cmd}`);
  process.exit(1);
}
