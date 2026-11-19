import assert from 'node:assert/strict';
import test from 'node:test';
import MarkdownIt from 'markdown-it';
import markdownItContainer from 'markdown-it-container';
import { articleContainers, parseTocDirective, prepareArticle } from './article-prose.mjs';

function createMd() {
  const md = new MarkdownIt({ html: true, breaks: true });
  for (const [kind, cls, badge] of [['红料', 'liao-hong', '红'], ['黑料', 'liao-hei', '黑'], ['高潮', 'liao-gaochao', '高潮']]) {
    const re = new RegExp(`^${kind}(?:\\s+(.*))?$`);
    md.use(markdownItContainer, kind, {
      validate: params => re.test(params.trim()),
      render: (tokens, idx) => {
        if (tokens[idx].nesting !== 1) return '</section>\n';
        const title = tokens[idx].info.trim().match(re)[1];
        return `<section class="liao ${cls}"><h3 class="liao-head"><span class="liao-badge" data-pagefind-ignore>${badge}</span>${title ? md.utils.escapeHtml(title) : kind}</h3>\n`;
      },
    });
  }
  md.use(articleContainers);
  return md;
}

test('articleContainers：折叠块默认收起，折叠+ 默认展开，内部支持表格和列表', () => {
  const md = createMd();
  const html = md.render([
    '::: 折叠 查看完整名单',
    '- 第一项',
    '- 第二项',
    ':::',
    '',
    '::: 折叠+ 默认展开项',
    '段落正文',
    ':::',
  ].join('\n'));
  assert.match(html, /<details class="fold">\s*<summary class="fold-summary"><span>查看完整名单<\/span><\/summary>/);
  assert.match(html, /<details class="fold" open>\s*<summary class="fold-summary"><span>默认展开项<\/span><\/summary>/);
  assert.match(html, /<li>第一项<\/li>/);
});

test('articleContainers：分页块按 === 切页，可紧接列表，容器外 === 保持普通段落', () => {
  const md = createMd();
  const html = md.render([
    '=== 容器外普通行',
    '',
    '::: 分页 属性',
    '=== 护盾',
    '- 护盾容量：2,000 HP',
    '=== 装甲',
    '- 装甲值：2,700 HP',
    ':::',
  ].join('\n'));
  assert.match(html, /<p>=== 容器外普通行<\/p>/);
  assert.match(html, /<section class="tabs" data-tabs>/);
  assert.match(html, /<span class="tabs-caption">属性<\/span>/);
  assert.match(html, /role="tab" aria-selected="true" aria-controls="tab-p-1-0" id="tab-b-1-0" tabindex="0">护盾<\/button>/);
  assert.match(html, /role="tab" aria-selected="false" aria-controls="tab-p-1-1" id="tab-b-1-1" tabindex="-1">装甲<\/button>/);
  assert.match(html, /护盾容量：2,000 HP/);
  assert.match(html, /装甲值：2,700 HP/);
});

test('parseTocDirective：识别开关与深度并清理注释', () => {
  assert.deepEqual(parseTocDirective('<!-- toc: on depth=2 -->\n<h2>标题</h2>'), {
    html: '\n<h2>标题</h2>',
    enabled: true,
    depth: 2,
  });
  assert.deepEqual(parseTocDirective('<!-- toc: off -->\n<p>正文</p>'), {
    html: '\n<p>正文</p>',
    enabled: false,
    depth: undefined,
  });
});

test('prepareArticle：保留已有锚点、跳过折叠与分页内部标题、按门槛与显式开关决定 TOC', () => {
  const md = createMd();
  const body = md.render([
    '<!-- toc: on -->',
    '## 一章',
    '### 小节甲',
    '::: 折叠 附表',
    '### 折叠内标题不进目录',
    ':::',
    '::: 分页 属性',
    '=== 护盾',
    '### 分页内标题不进目录',
    ':::',
    '## 二章',
  ].join('\n')).replace('<h2>一章</h2>', '<h2 id="d2026-11-10-1">一章</h2>');

  const res = prepareArticle(body, { kind: 'news' });
  assert.equal(res.hasToc, true);
  assert.equal(res.hasTabs, true);
  assert.deepEqual(res.toc.map(x => [x.id, x.text, x.indent]), [
    ['d2026-11-10-1', '一章', false],
    ['sec-1', '小节甲', true],
    ['sec-2', '二章', false],
  ]);
  assert.ok(!res.html.includes('<!-- toc:'));

  // front matter toc: false 优先覆盖注释
  const off = prepareArticle(body, { kind: 'news', toc: false });
  assert.equal(off.hasToc, false);
  assert.deepEqual(off.toc, []);
});

test('prepareArticle：列传收录 h2 及红黑料标题并标记徽记，均左对齐不缩进', () => {
  const md = createMd();
  const blocks = [
    '::: 红料 战绩不错', '事迹一', ':::',
    '## 档案',
    '::: 黑料 翻车现场', '事迹二', ':::',
    '::: 黑料 第二次翻车', '事迹三', ':::',
    '::: 黑料 第三次翻车', '事迹四', ':::',
    '::: 黑料 第四次翻车', '事迹五', ':::',
  ].join('\n\n');
  const res = prepareArticle(md.render(blocks), { kind: 'person' });
  assert.equal(res.hasToc, true);
  assert.equal(res.toc.length, 6);
  assert.deepEqual(res.toc.slice(0, 3).map(x => [x.text, x.badge, x.indent]), [
    ['战绩不错', 'hong', false],
    ['档案', null, false],
    ['翻车现场', 'hei', false],
  ]);
});

test('prepareArticle：大量 H2+H3 时自动收敛为只列 H2，短文不自动出 TOC', () => {
  const md = createMd();
  const shortRes = prepareArticle(md.render('## 甲\n\n短段落\n\n## 乙\n\n短段落'), { kind: 'news' });
  assert.equal(shortRes.hasToc, false);

  const many = Array.from({ length: 10 }, (_, i) => `## 第${i + 1}章\n\n### 子${i}-1\n\n### 子${i}-2\n\n### 子${i}-3`).join('\n\n');
  const collapsed = prepareArticle(md.render(many), { kind: 'news' });
  assert.equal(collapsed.hasToc, true);
  assert.equal(collapsed.toc.length, 10);
  assert.ok(collapsed.toc.every(x => x.level === 2));

  const forcedDepth3 = prepareArticle(md.render(many), { kind: 'news', tocDepth: 3 });
  assert.equal(forcedDepth3.toc.length, 40);
});
