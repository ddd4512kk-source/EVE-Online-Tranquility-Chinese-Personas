// 天书（官方新闻译文）：分类、页面文件格式、校验，以及读取 eveonline.com 文章对象。
// 本模块不读写磁盘；抓取通过可注入的 fetcher，CLI 在 news-workbench.mjs。
import matter from 'gray-matter';

export const SITE = 'https://www.eveonline.com';
const NEWS_URL = /^https?:\/\/(?:www\.)?eveonline\.com\/(?:([a-z]{2})\/)?news\/view\/([A-Za-z0-9][A-Za-z0-9-]*)\/?(?:[?#].*)?$/;
const APOLLO = /window\.APOLLO_STATE=(\{.*?\});?\s*(?:window\.|<\/script>)/s;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
export const USER_AGENT = 'eve-news-reader/1.0';

// 目录展示顺序。官方标签按 match 的先后归类：同时带多个标签时，排在前面的分类优先。
export const NEWS_CATEGORIES = [
  { key: 'update', name: '更新', hint: '补丁说明、版本更新说明、平衡改动、测试服' },
  { key: 'preview', name: '前瞻', hint: '资料片宣传、开发日志、新功能预告' },
  { key: 'event', name: '活动', hint: '游戏内限时活动' },
  { key: 'offer', name: '促销', hint: '商城打折、礼包、涂装' },
  { key: 'misc', name: '杂报', hint: '赛事、CSM、经济与封号月报、社区动态' },
];
const CATEGORY_MATCH = [
  ['update', ['patch-notes', 'balance-changes', 'test-servers']],
  ['event', ['in-game-events']],
  ['offer', ['offers']],
  ['preview', ['expansion', 'development-updates', 'new-features', 'carbon', 'eve-vanguard']],
];
export const TRANSLATIONS = {
  official: '官方中文版',
  site: '本站译自英文原文',
};

const categoryByKey = new Map(NEWS_CATEGORIES.map(c => [c.key, c]));

/** 手工指定的 category 优先，否则按官方标签归类，都不中归“杂报”。 */
export function newsCategory({ category, officialTags } = {}) {
  if (category) return categoryByKey.get(category) ?? null;
  const tags = new Set(officialTags ?? []);
  const hit = CATEGORY_MATCH.find(([, list]) => list.some(t => tags.has(t)));
  return categoryByKey.get(hit ? hit[0] : 'misc');
}

/** 英文或中文新闻链接 → { slug, locale }；不是 eveonline.com 新闻链接时返回 null。 */
export function parseNewsUrl(url) {
  const m = String(url ?? '').trim().match(NEWS_URL);
  return m ? { slug: m[2], locale: m[1] ?? 'en' } : null;
}

export const newsPageUrl = (slug, locale = 'en') => `${SITE}${locale === 'en' ? '' : `/${locale}`}/news/view/${slug}`;

export function apolloState(html) {
  const m = String(html).match(APOLLO);
  if (!m) throw new Error('页面中没有 window.APOLLO_STATE，可能只返回了脚本外壳');
  return JSON.parse(m[1]);
}

const resolve = (state, v) => (v && typeof v === 'object' && Object.keys(v).length === 1 && v.__ref ? state[v.__ref] ?? v : v);

/** 在 ROOT_QUERY 里找参数同时匹配文章标识与语言的 articleCollection 结果。 */
export function findArticle(state, slug, locale) {
  for (const [key, value] of Object.entries(state.ROOT_QUERY ?? {})) {
    if (!key.startsWith('articleCollection(') || !key.endsWith(')')) continue;
    let args;
    try {
      args = JSON.parse(key.slice('articleCollection('.length, -1));
    } catch {
      continue;
    }
    if (args.locale !== locale || args.where?.slug !== slug) continue;
    const item = resolve(state, (resolve(state, value)?.items ?? [])[0]);
    if (item?.slug === slug) return item;
  }
  return null;
}

/** 视频、直播等嵌入统一写成一行外链，读者点开观看。 */
export const videoLink = (title, url) => `[▶ 视频：${String(title || '观看视频').replace(/[[\]]/g, '')}](${url})`;

/** Contentful 富文本 → Markdown。遇到未支持的节点报错，不静默丢内容。 */
export function richTextMarkdown(rich) {
  const links = rich.links ?? {};
  const groups = {
    entryBlock: links.entries?.block, entryInline: links.entries?.inline, entryLink: links.entries?.hyperlink,
    assetBlock: links.assets?.block, assetLink: links.assets?.hyperlink,
  };
  const byId = Object.fromEntries(Object.entries(groups).map(([g, list]) => [g, new Map((list ?? []).map(item => [item.sys?.id ?? String(item.sys?.__ref ?? '').replace(/^Sys:/, ''), item]))]));
  const target = (group, node) => {
    const item = byId[group].get(node.data.target.sys.id);
    if (!item) throw new Error(`富文本引用了缺失的对象 ${node.data.target.sys.id}`);
    return item;
  };
  const entryUrl = e => (e.__typename === 'Article' && e.slug ? newsPageUrl(e.slug) : e.url);

  const inline = node => {
    if (node.nodeType === 'text') {
      const text = node.value.replace(/\n/g, ' ');
      if (!text.trim()) return text;
      const marks = new Set((node.marks ?? []).map(m => m.type));
      let body = text.trim();
      if (marks.has('code')) body = `\`${body}\``;
      if (marks.has('bold')) body = `**${body}**`;
      if (marks.has('italic')) body = `*${body}*`;
      return text.match(/^\s*/)[0] + body + text.match(/\s*$/)[0];
    }
    const inner = (node.content ?? []).map(inline).join('');
    switch (node.nodeType) {
      case 'hyperlink': return `[${inner}](${node.data.uri})`;
      case 'entry-hyperlink': {
        const url = entryUrl(target('entryLink', node));
        return url ? `[${inner}](${url})` : inner;
      }
      case 'asset-hyperlink': return `[${inner}](${target('assetLink', node).url})`;
      case 'embedded-entry-inline': {
        const e = target('entryInline', node);
        if (e.__typename !== 'Article') throw new Error(`未支持的行内嵌入类型：${e.__typename}`);
        return `[${e.title}](${entryUrl(e)})`;
      }
      default: throw new Error(`未支持的行内节点：${node.nodeType}`);
    }
  };

  const block = (node, depth = 0) => {
    const kids = node.content ?? [];
    const kind = node.nodeType;
    if (kind === 'document') return kids.map(c => block(c)).filter(Boolean).join('\n\n');
    if (kind === 'paragraph') return kids.map(inline).join('').trim();
    if (kind.startsWith('heading-')) return `${'#'.repeat(Number(kind.at(-1)))} ${kids.map(inline).join('').trim()}`;
    if (kind === 'hr') return '---';
    if (kind === 'blockquote') return kids.map(c => block(c)).join('\n\n').split('\n').map(l => (l ? `> ${l}` : '>')).join('\n');
    if (kind === 'unordered-list' || kind === 'ordered-list') {
      return kids.map((item, i) => {
        const parts = item.content.map(c => block(c, depth + 1));
        const marker = kind === 'ordered-list' ? `${i + 1}.` : '-';
        return `${'  '.repeat(depth)}${marker} ${parts[0].trimStart()}${parts.slice(1).map(p => `\n${p}`).join('')}`;
      }).join('\n');
    }
    if (kind === 'table-cell' || kind === 'table-header-cell') return kids.map(c => block(c, depth + 1)).join(' ');
    if (kind === 'table') {
      const rows = kids.map(row => row.content.map(cell => block(cell, depth + 1).split(/\s+/).join(' ').replace(/\|/g, '\\|')));
      const width = Math.max(...rows.map(r => r.length));
      const lines = rows.map(r => `| ${[...r, ...Array(width - r.length).fill('')].join(' | ')} |`);
      return [lines[0], `|${' --- |'.repeat(width)}`, ...lines.slice(1)].join('\n');
    }
    if (kind === 'embedded-asset-block') {
      const a = target('assetBlock', node);
      return `![${a.description ?? ''}](${a.url})`;
    }
    if (kind === 'embedded-entry-block') return embedded(target('entryBlock', node));
    throw new Error(`未支持的块节点：${kind}`);
  };

  const embedded = e => {
    switch (e.__typename) {
      case 'Content':
        if (e.data?.type === 'table-of-contents') return '';
        break;
      case 'MediaEmbed': return videoLink(e.title, e.mediaUrl);
      case 'ImageGallery': {
        const { items, total } = e.imagesCollection;
        if (items.length !== total) throw new Error(`图集不完整：${e.title ?? ''}`);
        return items.map((it, i) => `![${i === 0 ? e.title ?? '' : ''}](${it.url})`).join('\n\n');
      }
      case 'Button': return `[${e.text}](${e.url})`;
      case 'Tabs': {
        const { items, total } = e.tabsCollection;
        if (items.length !== total) throw new Error(`标签页嵌入内容不完整：${e.title}`);
        const head = e.title ? `::: 分页 ${e.title}` : '::: 分页';
        return [head, ...items.map(t => `=== ${t.title}\n\n${block(t.content.json)}`), ':::'].join('\n\n');
      }
    }
    throw new Error(`未支持的嵌入类型：${e.__typename}`);
  };

  return block(rich.json);
}

/** 汉字在汉字与拉丁字母中的占比（不计链接地址），判断中文页是否其实返回了英文。 */
export function cjkShare(text) {
  const t = String(text).replace(/\]\([^)\s]*\)|https?:\/\/\S+/g, ' ');
  const cjk = (t.match(/[一-鿿]/g) ?? []).length;
  const latin = (t.match(/[A-Za-z]/g) ?? []).length;
  return cjk + latin ? cjk / (cjk + latin) : 0;
}

/** 抓一页并取出指定语言的文章对象；该语言不存在时返回 null。 */
export async function fetchArticle(slug, locale, fetcher = defaultFetcher) {
  const html = await fetcher(newsPageUrl(slug, locale));
  return html == null ? null : findArticle(apolloState(html), slug, locale);
}

export async function defaultFetcher(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(60_000) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${url} 返回 HTTP ${res.status}`);
  return res.text();
}

/** 英文文章对象 → 页面元数据。 */
export function articleMeta(slug, en) {
  return {
    titleEn: en.title?.trim() ?? '',
    source: newsPageUrl(slug),
    published: String(en.publishingDate ?? en.sys?.firstPublishedAt ?? '').slice(0, 10),
    officialTags: en.tags ?? [],
    ...(en.metaImageUrl?.url ? { cover: en.metaImageUrl.url } : {}),
  };
}

/**
 * 官方中文文章对象 → { title, body }；正文以英文为主或只有旧格式正文时返回 null（需另行翻译或导入）。
 */
export function officialChinese(zh) {
  if (!zh?.richText?.json) return null;
  const body = richTextMarkdown(zh.richText);
  return cjkShare(body) < 0.3 ? null : { title: zh.title.trim(), body };
}

/**
 * 统一正文：去掉开头的一级标题和译稿的“> 原文：”出处行（页头已有），嵌入占位改成视频外链，压缩多余空行。
 * “**小标题：**正文”这类加粗以标点收尾又紧贴文字时 Markdown 不认作加粗，把收尾标点移到加粗外。
 */
export function normalizeBody(markdown) {
  return String(markdown)
    .replace(/\r\n/g, '\n')
    .replace(/\*\*([^*\s](?:[^*\n]*?[^*\s：:，,。！!？?、；;])?)([：:，,。！!？?、；;]+)\*\*(?=[^\s*])/g, '**$1**$2')
    .replace(/^\s*# [^\n]*\n/, '')
    .replace(/^\s*> 原文：[^\n]*(\n|$)/, '')
    .replace(/\[未读取嵌入内容 [\w-]+: (.*?) ?(https?:\/\/\S+?)\]/g, (_, title, url) => videoLink(title, url))
    .replace(/\[未读取嵌入内容 [\w-]+: (.*?)\]/g, (_, title) => `（视频：${title}）`)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** 拆出 Markdown 开头的一级标题。 */
export function splitTitle(markdown) {
  const m = String(markdown).replace(/^﻿/, '').match(/^\s*# (.+)\n/);
  return m ? { title: m[1].trim(), body: normalizeBody(markdown) } : { title: '', body: normalizeBody(markdown) };
}

const FIELD_ORDER = ['title', 'titleEn', 'source', 'published', 'officialTags', 'category', 'cover', 'translation', 'toc', 'tocDepth'];

/** 生成页面文件文本，字段顺序固定。 */
export function newsDocument(data, body) {
  const ordered = Object.fromEntries(FIELD_ORDER.filter(k => data[k] !== undefined).map(k => [k, data[k]]));
  return matter.stringify(`\n${normalizeBody(body)}\n`, ordered).replace(/\n*$/, '\n');
}

// 官方把一段时间的每日补丁合成一篇，每天一个二级标题“YYYY-MM-DD.N补丁说明”。
const PATCH_NOTES_SLUG = /^patch-notes-version-(\d+(?:-\d+)+)$/;
const DAY_HEADING = /^## \**(\d{4}-\d{2}-\d{2})\.(\d+)补丁说明\**\s*$/;
const dayId = (date, n) => `d${date}-${n}`;

export function validateNews(data, body, slug) {
  const errors = [];
  const fail = m => errors.push(`${slug}：${m}`);
  if (!data.title?.trim()) fail('缺少中文标题 title');
  if (!data.titleEn?.trim()) fail('缺少英文标题 titleEn');
  const parsed = parseNewsUrl(data.source);
  if (!parsed || parsed.locale !== 'en' || parsed.slug !== slug) fail(`source 必须是本篇英文原文链接 ${newsPageUrl(slug)}`);
  if (!DATE.test(String(data.published ?? ''))) fail('published 必须是 YYYY-MM-DD');
  if (!Array.isArray(data.officialTags)) fail('officialTags 必须是官方标签数组（可为空）');
  if (data.category !== undefined && !categoryByKey.has(data.category)) fail(`category 只能是 ${[...categoryByKey.keys()].join('、')}`);
  if (data.toc !== undefined && typeof data.toc !== 'boolean') fail('toc 只能是 true 或 false');
  if (data.tocDepth !== undefined && data.tocDepth !== 2 && data.tocDepth !== 3) fail('tocDepth 只能是 2 或 3');
  if (!TRANSLATIONS[data.translation]) fail(`translation 只能是 ${Object.keys(TRANSLATIONS).join('、')}`);
  if (data.cover !== undefined && !/^https:\/\//.test(data.cover)) fail('cover 必须是 https 地址');
  if (!String(body ?? '').trim()) fail('正文为空');
  if (/^\s*# /m.test(body ?? '')) fail('正文不能有一级标题，标题写在 title');
  if (/\[未读取嵌入内容/.test(body ?? '')) fail('正文残留“未读取嵌入内容”占位');
  const patchMatch = String(slug ?? '').match(PATCH_NOTES_SLUG);
  if (patchMatch) {
    const expectedTitle = `补丁说明——${patchMatch[1].replace(/-/g, '.')}版本`;
    if (data.title?.trim() !== expectedTitle) fail(`合辑补丁说明标题必须为“${expectedTitle}”`);
    const seen = new Set();
    const badH2 = [];
    for (const line of String(body ?? '').replace(/\r\n/g, '\n').split('\n')) {
      if (!/^## /.test(line)) continue;
      const m = line.match(DAY_HEADING);
      if (!m) {
        badH2.push(line.trim());
        continue;
      }
      const key = `${m[1]}.${m[2]}`;
      if (seen.has(key)) fail(`合辑补丁说明存在重复日期小节 ${key}`);
      seen.add(key);
    }
    if (!seen.size) fail('合辑补丁说明缺少每日二级标题（格式：## **YYYY-MM-DD.N补丁说明**）');
    if (badH2.length) fail(`合辑补丁说明正文中除每日补丁标题外不能使用二级标题（请降级为 ### 及以下）：${badH2.slice(0, 3).join('、')}`);
  }
  return errors;
}

/** 官网图床（Contentful）图片按宽度缩小并转 WebP；动图和其他地址原样返回。 */
export function ctfImage(src, width = 1400) {
  const s = String(src ?? '');
  if (!/^https:\/\/images\.ctfassets\.net\//.test(s) || s.includes('?') || /\.gif$/i.test(s)) return s;
  return `${s}?w=${width}&fm=webp&q=80`;
}

const plainText = s => String(s).replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
const clip = (text, max) => (text.length > max ? `${text.slice(0, max)}…` : text);

/** 合辑式补丁说明 → 每日小节 [{ id, date, label, excerpt }]，按正文顺序；不是合辑时为空数组。摘要取当天前几条列表项。 */
export function newsDays(body, max = 90) {
  const days = [];
  let open = false;
  for (const line of String(body ?? '').replace(/\r\n/g, '\n').split('\n')) {
    const m = line.match(DAY_HEADING);
    if (m) {
      days.push({ id: dayId(m[1], m[2]), date: m[1], label: `${m[1]}.${m[2]}补丁说明`, items: [] });
      open = true;
    } else if (/^## /.test(line)) {
      open = false;
    } else if (open) {
      const item = line.match(/^\s*(?:-|\d+\.)\s+(.+)$/);
      if (item) days.at(-1).items.push(plainText(item[1]));
    }
  }
  return days.map(({ items, ...day }) => ({
    ...day,
    excerpt: clip(items.filter(Boolean).map(t => (/[。！？；：]$/.test(t) ? t : `${t}；`)).join('').replace(/；$/, ''), max),
  }));
}

/** 给渲染后的每日补丁标题加锚点，与 newsDays 的 id 一致。 */
export function newsDayAnchors(html) {
  return String(html ?? '').replace(/<h2>((?:<strong>)?(\d{4}-\d{2}-\d{2})\.(\d+)补丁说明(?:<\/strong>)?)<\/h2>/g, (_, inner, date, n) => `<h2 id="${dayId(date, n)}">${inner}</h2>`);
}

/**
 * 目录卡片：合辑式补丁说明每天一张（链到同页锚点），其余一篇一张；按日期倒序，同日按链接。
 * items 为 Eleventy 集合项（url、data、rawInput）。
 */
export function newsCards(items) {
  const cards = [];
  for (const { url, data, rawInput } of items ?? []) {
    const base = { cat: newsCategory(data), translation: data.translation };
    const days = newsDays(rawInput);
    if (days.length) {
      // 标题不重复日期：“24.01版本 · 第N次更新”，N 从最早一次数起
      const version = String(data.titleEn ?? '').match(/version\s+(\d+(?:\.\d+)*)/i)?.[1];
      const order = days.map(d => d.id).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
      for (const day of days) {
        const title = `${version ? `${version}版本 · ` : ''}第${order.indexOf(day.id) + 1}次更新`;
        cards.push({ ...base, day: true, url: `${url}#${day.id}`, date: day.date, title, titleEn: `${data.titleEn} · ${day.date}`, excerpt: day.excerpt, key: [day.label, data.title, data.titleEn, day.excerpt].join(' ').toLowerCase() });
      }
    } else {
      const excerpt = newsExcerpt(rawInput);
      cards.push({ ...base, url, date: String(data.published), title: data.title, titleEn: data.titleEn, excerpt, cover: data.cover, key: [data.title, data.titleEn, excerpt].join(' ').toLowerCase() });
    }
  }
  for (const c of cards) {
    c.year = c.date.slice(0, 4);
    c.month = c.date.slice(0, 7);
  }
  return cards.sort((a, b) => b.date.localeCompare(a.date) || a.url.localeCompare(b.url));
}

/** 卡片摘要：正文第一段纯文字，跳过“致克隆飞行员：”这类称呼和不足 15 字的短行。 */
export function newsExcerpt(body, max = 90) {
  const isGreeting = p => {
    const plain = p.replace(/[*_]/g, '');
    return plain.length < 15 || /^[^\n]{0,20}[：:，,！!]$/.test(plain);
  };
  const para = String(body ?? '')
    .split(/\n{2,}/)
    .map(p => p.trim())
    .find(p => p && !/^(#|!\[|\||>|-|\d+\.|\[▶|:::|===|<!--)/.test(p) && !/^\[[^\]]*\]\([^)]*\)$/.test(p) && !isGreeting(p));
  return para ? clip(plainText(para), max) : '';
}
