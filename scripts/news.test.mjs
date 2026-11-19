import assert from 'node:assert/strict';
import test from 'node:test';
import matter from 'gray-matter';
import {
  apolloState, cjkShare, ctfImage, fetchArticle, newsCards, newsCategory, newsDayAnchors, newsDays, newsDocument, newsExcerpt, normalizeBody,
  officialChinese, parseNewsUrl, richTextMarkdown, splitTitle, validateNews,
} from './news.mjs';

const SOURCE = 'https://www.eveonline.com/news/view/sample-news';
const valid = () => ({
  title: '示例新闻', titleEn: 'Sample News', source: SOURCE, published: '2025-10-11',
  officialTags: ['offers'], translation: 'official',
});

test('newsCategory：按标签优先级归类，手工 category 覆盖', () => {
  assert.equal(newsCategory({ officialTags: ['patch-notes', 'offers'] }).key, 'update');
  assert.equal(newsCategory({ officialTags: ['expansion', 'offers'] }).key, 'offer');
  assert.equal(newsCategory({ officialTags: ['in-game-events', 'expansion'] }).key, 'event');
  assert.equal(newsCategory({ officialTags: ['new-features'] }).key, 'preview');
  assert.equal(newsCategory({ officialTags: ['esports'] }).key, 'misc');
  assert.equal(newsCategory({}).key, 'misc');
  assert.equal(newsCategory({ category: 'preview', officialTags: ['offers'] }).key, 'preview');
  assert.equal(newsCategory({ category: 'nope' }), null);
});

test('parseNewsUrl：识别英文与带语言前缀的链接，拒绝其他网址', () => {
  assert.deepEqual(parseNewsUrl(SOURCE), { slug: 'sample-news', locale: 'en' });
  assert.deepEqual(parseNewsUrl('https://eveonline.com/zh/news/view/sample-news/?a=1'), { slug: 'sample-news', locale: 'zh' });
  assert.equal(parseNewsUrl('https://example.com/news/view/sample-news'), null);
  assert.equal(parseNewsUrl(undefined), null);
});

test('normalizeBody：去标题与译稿出处行，嵌入占位改外链', () => {
  const md = '# 标题\n\n> 原文：[T](https://x) · 发布于2025年1月1日（UTC）\n\n正文\n\n\n\n[未读取嵌入内容 youtube: 预告片 https://youtu.be/abc]\n\n[未读取嵌入内容 spotify: 播客]';
  assert.equal(normalizeBody(md), '正文\n\n[▶ 视频：预告片](https://youtu.be/abc)\n\n（视频：播客）');
  assert.equal(normalizeBody('第一段\n\n> 原文：引用在中间不删'), '第一段\n\n> 原文：引用在中间不删');
  assert.equal(normalizeBody('**发布日期：**2026年 **更新:**今天'), '**发布日期**：2026年 **更新**:今天');
  assert.equal(normalizeBody('- **小标题：**\n- **完整。** 后有空格'), '- **小标题：**\n- **完整。** 后有空格');
});

test('splitTitle：取一级标题，去 BOM；没有标题返回空', () => {
  assert.deepEqual(splitTitle('﻿# 中文标题\n\n正文'), { title: '中文标题', body: '正文' });
  assert.equal(splitTitle('正文').title, '');
});

test('validateNews：合格无错，逐项报错', () => {
  assert.deepEqual(validateNews(valid(), '正文', 'sample-news'), []);
  const errors = validateNews(
    { ...valid(), title: '', source: 'https://www.eveonline.com/zh/news/view/sample-news', published: '2025/10/11', officialTags: 'offers', category: 'x', translation: 'ai', cover: 'http://a' },
    '# 标题\n[未读取嵌入内容 youtube: x]',
    'sample-news',
  );
  for (const word of ['title', 'source', 'published', 'officialTags', 'category', 'translation', 'cover', '一级标题', '占位']) {
    assert.ok(errors.some(e => e.includes(word)), word);
  }
  assert.deepEqual(validateNews({ ...valid(), toc: true, tocDepth: 2 }, '正文', 'sample-news'), []);
  const badToc = validateNews({ ...valid(), toc: 'yes', tocDepth: 4 }, '正文', 'sample-news');
  assert.ok(badToc.some(e => e.includes('toc 只能是')));
  assert.ok(badToc.some(e => e.includes('tocDepth 只能是')));
  assert.ok(validateNews(valid(), '  ', 'sample-news').some(e => e.includes('正文为空')));

  const patchSlug = 'patch-notes-version-24-02';
  const patchMeta = () => ({
    ...valid(),
    title: '补丁说明——24.02版本',
    titleEn: 'Patch Notes - Version 24.02',
    source: `https://www.eveonline.com/news/view/${patchSlug}`,
    officialTags: ['patch-notes'],
    translation: 'site',
  });
  assert.deepEqual(validateNews(patchMeta(), '前言\n\n## **2026-11-20.1补丁说明**\n\n### **缺陷修复：**\n\n- 修复项', patchSlug), []);
  const badPatch = validateNews(
    { ...patchMeta(), title: '补丁说明——24.02 版本' },
    '## **2026-11-20.1 补丁说明**\n\n## 缺陷修复：\n\n- 修复项',
    patchSlug,
  );
  assert.ok(badPatch.some(e => e.includes('补丁说明——24.02版本')));
  assert.ok(badPatch.some(e => e.includes('缺少每日二级标题')));
  assert.ok(badPatch.some(e => e.includes('不能使用二级标题')));
  const dupPatch = validateNews(
    patchMeta(),
    '## **2026-11-20.1补丁说明**\n\n- 一\n\n## **2026-11-20.1补丁说明**\n\n- 二',
    patchSlug,
  );
  assert.ok(dupPatch.some(e => e.includes('重复日期小节 2026-11-20.1')));
});

test('newsDays／newsDayAnchors／newsCards：合辑补丁按天拆卡并链到同页锚点', () => {
  const body = '版本说明\n\n## **2026-11-04.1补丁说明**\n\n### 游戏玩法\n\n- 修复了[某](https://a.example)问题。\n- 调整了**速度**\n\n## **2026-11-03.1补丁说明**\n\n- 新增涂装。\n\n## 附录\n\n- 不计入';
  const days = newsDays(body);
  assert.deepEqual(days.map(d => [d.id, d.date, d.label]), [
    ['d2026-11-04-1', '2026-11-04', '2026-11-04.1补丁说明'],
    ['d2026-11-03-1', '2026-11-03', '2026-11-03.1补丁说明'],
  ]);
  assert.equal(days[0].excerpt, '修复了某问题。调整了速度');
  assert.equal(days[1].excerpt, '新增涂装。');
  assert.deepEqual(newsDays('## 小节\n\n- 一'), []);

  assert.equal(newsDayAnchors('<h2><strong>2026-11-04.1补丁说明</strong></h2><h2>别的</h2>'), '<h2 id="d2026-11-04-1"><strong>2026-11-04.1补丁说明</strong></h2><h2>别的</h2>');

  const item = (url, data, rawInput) => ({ url, data: { titleEn: 'En', translation: 'site', ...data }, rawInput });
  const cards = newsCards([
    item('/news/a/', { title: '补丁合辑', published: '2026-06-09', officialTags: ['patch-notes'], cover: 'https://x' }, body),
    item('/news/b/', { title: '促销', published: '2026-11-03', officialTags: ['offers'] }, '这是一段足够长的促销正文，用来当卡片摘要。'),
  ]);
  assert.deepEqual(cards.map(c => [c.url, c.date, c.cat.key, c.year]), [
    ['/news/a/#d2026-11-04-1', '2026-11-04', 'update', '2026'],
    ['/news/a/#d2026-11-03-1', '2026-11-03', 'update', '2026'],
    ['/news/b/', '2026-11-03', 'offer', '2026'],
  ]);
  assert.equal(cards[0].cover, undefined);
  assert.deepEqual(cards.map(c => c.title), ['第2次更新', '第1次更新', '促销']);
  assert.equal(newsCards([item('/news/a/', { title: '补丁合辑', titleEn: 'Patch Notes - Version 24.01', published: '2026-06-09', officialTags: ['patch-notes'] }, body)])[0].title, '24.01版本 · 第2次更新');
  assert.deepEqual(cards.map(c => [c.day ?? false, c.month]), [[true, '2026-11'], [true, '2026-11'], [false, '2026-11']]);
  assert.ok(cards[0].key.includes('补丁合辑'));
});

test('newsDocument：字段顺序固定，可读回', () => {
  const text = newsDocument({ translation: 'site', title: '示例', titleEn: 'Sample', source: SOURCE, published: '2025-01-02', officialTags: [] }, '# 示例\n\n正文');
  const { data, content } = matter(text);
  assert.deepEqual(Object.keys(data), ['title', 'titleEn', 'source', 'published', 'officialTags', 'translation']);
  assert.equal(content.trim(), '正文');
});

test('richTextMarkdown：段落、标记、链接、列表、表格、图片与视频', () => {
  const t = (value, marks = []) => ({ nodeType: 'text', value, marks: marks.map(type => ({ type })) });
  const p = (...content) => ({ nodeType: 'paragraph', content });
  const rich = {
    json: {
      nodeType: 'document',
      content: [
        { nodeType: 'heading-2', content: [t('小节')] },
        p(t('加粗', ['bold']), t(' 与 '), { nodeType: 'hyperlink', data: { uri: 'https://a.example' }, content: [t('链接')] }),
        { nodeType: 'unordered-list', content: [{ nodeType: 'list-item', content: [p(t('一'))] }, { nodeType: 'list-item', content: [p(t('二'))] }] },
        { nodeType: 'table', content: [
          { nodeType: 'table-row', content: [{ nodeType: 'table-header-cell', content: [p(t('甲'))] }, { nodeType: 'table-header-cell', content: [p(t('乙'))] }] },
          { nodeType: 'table-row', content: [{ nodeType: 'table-cell', content: [p(t('1'))] }, { nodeType: 'table-cell', content: [p(t('a|b'))] }] },
        ] },
        { nodeType: 'embedded-asset-block', data: { target: { sys: { id: 'img' } } }, content: [] },
        { nodeType: 'embedded-entry-block', data: { target: { sys: { id: 'vid' } } }, content: [] },
      ],
    },
    links: {
      assets: { block: [{ sys: { id: 'img' }, url: 'https://images.ctfassets.net/x/a.png', description: '图' }] },
      entries: { block: [{ sys: { id: 'vid' }, __typename: 'MediaEmbed', title: '预告', mediaUrl: 'https://youtu.be/v' }] },
    },
  };
  assert.equal(richTextMarkdown(rich), [
    '## 小节',
    '**加粗** 与 [链接](https://a.example)',
    '- 一\n- 二',
    '| 甲 | 乙 |\n| --- | --- |\n| 1 | a\\|b |',
    '![图](https://images.ctfassets.net/x/a.png)',
    '[▶ 视频：预告](https://youtu.be/v)',
  ].join('\n\n'));
  assert.throws(() => richTextMarkdown({ json: { nodeType: 'document', content: [{ nodeType: 'mystery', content: [] }] } }), /未支持的块节点/);
});

test('fetchArticle 与 officialChinese：从页面状态取文章，英文冒充的中文页判为无中文版', async () => {
  const article = (title, text) => ({
    __typename: 'Article', slug: 'sample-news', title,
    richText: { json: { nodeType: 'document', content: [{ nodeType: 'paragraph', content: [{ nodeType: 'text', value: text, marks: [] }] }] } },
  });
  const page = item => `<script>window.APOLLO_STATE=${JSON.stringify({
    ROOT_QUERY: { [`articleCollection(${JSON.stringify({ locale: 'zh', where: { slug: 'sample-news' } })})`]: { items: [{ __ref: 'A' }] } },
    A: item,
  })};</script>`;
  const zh = await fetchArticle('sample-news', 'zh', async () => page(article(' 中文标题 ', '这是一段中文正文')));
  assert.deepEqual(officialChinese(zh), { title: '中文标题', body: '这是一段中文正文' });
  const english = await fetchArticle('sample-news', 'zh', async () => page(article('Title', 'This page is still in English')));
  assert.equal(officialChinese(english), null);
  assert.equal(await fetchArticle('sample-news', 'zh', async () => null), null);
  assert.throws(() => apolloState('<html></html>'), /APOLLO_STATE/);
  assert.equal(cjkShare('中文正文 [链接](https://example.com/abcdef)'), 1);
});

test('ctfImage：只给官网图床的静态图加缩图参数', () => {
  assert.equal(ctfImage('https://images.ctfassets.net/s/a.jpg', 480), 'https://images.ctfassets.net/s/a.jpg?w=480&fm=webp&q=80');
  assert.equal(ctfImage('https://images.ctfassets.net/s/a.gif'), 'https://images.ctfassets.net/s/a.gif');
  assert.equal(ctfImage('https://images.ctfassets.net/s/a.jpg?w=1'), 'https://images.ctfassets.net/s/a.jpg?w=1');
  assert.equal(ctfImage('https://other.example/a.jpg'), 'https://other.example/a.jpg');
});

test('newsExcerpt：跳过图片、标题、列表、容器指令与视频行，去掉链接标记并截断', () => {
  const body = '<!-- toc: on -->\n\n::: 分页 属性\n\n=== 护盾\n\n:::\n\n![](https://a/b.png)\n\n## 小节\n\n[▶ 视频：x](https://y)\n\n- 列表\n\n**致克隆飞行员：**\n\n省流版\n\n各位克隆飞行员请注意！\n\n这是**第一段**，含[链接](https://z)，足够长的正文。';
  assert.equal(newsExcerpt(body), '这是第一段，含链接，足够长的正文。');
  assert.equal(newsExcerpt('甲'.repeat(100), 10), `${'甲'.repeat(10)}…`);
  assert.equal(newsExcerpt(''), '');
});

test('richTextMarkdown：Tabs 嵌入转为 ::: 分页 容器', () => {
  const doc = text => ({ json: { nodeType: 'document', content: [{ nodeType: 'paragraph', content: [{ nodeType: 'text', value: text, marks: [] }] }] } });
  const rich = {
    json: { nodeType: 'document', content: [{ nodeType: 'embedded-entry-block', data: { target: { sys: { id: 'tabs-1' } } }, content: [] }] },
    links: {
      entries: {
        block: [{
          sys: { id: 'tabs-1' }, __typename: 'Tabs', title: '属性',
          tabsCollection: { total: 2, items: [{ title: '护盾', content: doc('2,000 HP') }, { title: '装甲', content: doc('2,700 HP') }] },
        }],
      },
    },
  };
  assert.equal(richTextMarkdown(rich), '::: 分页 属性\n\n=== 护盾\n\n2,000 HP\n\n=== 装甲\n\n2,700 HP\n\n:::');
});
