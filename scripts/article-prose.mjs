// 长文结构增强：可折叠块（::: 折叠）、小分页（::: 分页）、标题锚点与目录（TOC）。
// 公共模块，供 eleventy.config.js 与测试复用，不读写磁盘。
import markdownItContainer from 'markdown-it-container';

const FOLD_RE = /^折叠(\+?)(?:\s+(.*))?$/;
const TABS_RE = /^分页(?:\s+(.*))?$/;
const TAB_SEP_RE = /^={3,}\s+(.+?)\s*$/;
const TOC_DIRECTIVE_RE = /<!--\s*toc\s*:\s*(on|off|true|false)(?:\s+depth\s*=\s*(2|3))?\s*-->/gi;

const AUTO_MIN_CHARS = 2500;
const AUTO_MIN_ITEMS = 4;
const AUTO_MANY_ITEMS = 6;
const AUTO_COLLAPSE_TOTAL = 32;
const AUTO_COLLAPSE_H2 = 8;

const escapeAttr = s => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const decodeEntities = s => String(s ?? '')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

const stripTags = html => decodeEntities(String(html ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());

/** 注册 ::: 折叠 与 ::: 分页（内部以 === 标签名 切页）容器。 */
export function articleContainers(md) {
  md.use(markdownItContainer, '折叠', {
    validate: params => FOLD_RE.test(params.trim()),
    render: (tokens, idx) => {
      if (tokens[idx].nesting !== 1) return '</div>\n</details>\n';
      const m = tokens[idx].info.trim().match(FOLD_RE);
      const isOpen = m[1] === '+';
      const title = (m[2] ?? '').trim() || '展开详情';
      return `<details class="fold"${isOpen ? ' open' : ''}>\n<summary class="fold-summary"><span>${md.utils.escapeHtml(title)}</span></summary>\n<div class="fold-body">\n`;
    },
  });

  // 块级规则：识别 `=== 标签名` 切页行，可打断段落与列表；处于分页容器外时在 core 阶段还原为普通段落。
  md.block.ruler.before('paragraph', 'article_tab_sep', (state, startLine, _endLine, silent) => {
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    if (state.sCount[startLine] - state.blkIndent >= 4) return false;
    const line = state.src.slice(pos, max);
    const m = line.match(TAB_SEP_RE);
    if (!m) return false;
    if (silent) return true;
    const token = state.push('article_tab_sep', '', 0);
    token.markup = '===';
    token.content = m[1].trim();
    token.meta = { raw: line };
    token.map = [startLine, startLine + 1];
    state.line = startLine + 1;
    return true;
  }, { alt: ['paragraph', 'reference', 'blockquote', 'list'] });

  md.use(markdownItContainer, '分页', {
    validate: params => TABS_RE.test(params.trim()),
    render: () => '',
  });

  // 将容器内的 `article_tab_sep` 组装为完整的分页结构；容器外的还原为普通段落。
  md.core.ruler.after('block', 'article_tabs', state => {
    const src = state.tokens;
    const out = [];
    let groupSeq = 0;

    const makeHtml = html => {
      const t = new state.Token('html_block', '', 0);
      t.content = html;
      return t;
    };

    const restoreParagraph = sepToken => {
      const open = new state.Token('paragraph_open', 'p', 1);
      const inline = new state.Token('inline', '', 0);
      inline.content = sepToken.meta?.raw ?? `=== ${sepToken.content}`;
      inline.children = [];
      const close = new state.Token('paragraph_close', 'p', -1);
      return [open, inline, close];
    };

    for (let i = 0; i < src.length; i++) {
      const tok = src[i];
      if (tok.type === 'article_tab_sep') {
        out.push(...restoreParagraph(tok));
        continue;
      }
      if (tok.type !== 'container_分页_open') {
        out.push(tok);
        continue;
      }

      // 寻找配对的 container_分页_close
      let depth = 1;
      let end = i + 1;
      while (end < src.length && depth > 0) {
        if (src[end].type === 'container_分页_open') depth++;
        else if (src[end].type === 'container_分页_close') depth--;
        if (depth > 0) end++;
      }

      const caption = (tok.info.trim().match(TABS_RE)?.[1] ?? '').trim();
      const inner = src.slice(i + 1, end);
      const preamble = [];
      const panes = [];
      let current = null;
      let nestedDepth = 0;

      for (const t of inner) {
        if (t.type === 'container_折叠_open') nestedDepth++;
        else if (t.type === 'container_折叠_close') nestedDepth = Math.max(0, nestedDepth - 1);

        if (nestedDepth === 0 && t.type === 'article_tab_sep') {
          current = { label: t.content, tokens: [] };
          panes.push(current);
        } else if (t.type === 'article_tab_sep') {
          const restored = restoreParagraph(t);
          if (current) current.tokens.push(...restored);
          else preamble.push(...restored);
        } else if (current) {
          current.tokens.push(t);
        } else {
          preamble.push(t);
        }
      }

      if (panes.length === 0) {
        out.push(...preamble);
        i = end;
        continue;
      }

      groupSeq++;
      const ariaLabel = caption || '分页内容';
      const captionHtml = caption ? `<span class="tabs-caption">${md.utils.escapeHtml(caption)}</span>` : '';
      const buttonsHtml = panes.map((pane, idx) => {
        const active = idx === 0;
        const btnId = `tab-b-${groupSeq}-${idx}`;
        const panelId = `tab-p-${groupSeq}-${idx}`;
        return `<button type="button" class="tabs-tab${active ? ' is-active' : ''}" role="tab" aria-selected="${active ? 'true' : 'false'}" aria-controls="${panelId}" id="${btnId}" tabindex="${active ? '0' : '-1'}">${md.utils.escapeHtml(pane.label)}</button>`;
      }).join('');

      out.push(makeHtml(`<section class="tabs" data-tabs>\n<div class="tabs-bar">${captionHtml}<div class="tabs-list" role="tablist" aria-label="${escapeAttr(ariaLabel)}" data-pagefind-ignore>${buttonsHtml}</div></div>\n`));
      if (preamble.length) {
        out.push(makeHtml('<div class="tabs-preamble">\n'));
        out.push(...preamble);
        out.push(makeHtml('</div>\n'));
      }
      out.push(makeHtml('<div class="tabs-panels">\n'));
      panes.forEach((pane, idx) => {
        const active = idx === 0;
        const btnId = `tab-b-${groupSeq}-${idx}`;
        const panelId = `tab-p-${groupSeq}-${idx}`;
        out.push(makeHtml(`<div class="tabs-panel${active ? ' is-active' : ''}" role="tabpanel" id="${panelId}" aria-labelledby="${btnId}">\n<p class="tabs-panel-label" aria-hidden="true">${md.utils.escapeHtml(pane.label)}</p>\n`));
        out.push(...pane.tokens);
        out.push(makeHtml('</div>\n'));
      });
      out.push(makeHtml('</div>\n</section>\n'));
      i = end;
    }

    state.tokens = out;
  });
}

/** 从 HTML 正文中解析显式目录注释（`<!-- toc: on|off depth=2|3 -->`）并清除注释本身。 */
export function parseTocDirective(html) {
  let enabled;
  let depth;
  const cleaned = String(html ?? '').replace(TOC_DIRECTIVE_RE, (_, flag, d) => {
    const v = flag.toLowerCase();
    enabled = v === 'on' || v === 'true';
    if (d) depth = Number(d);
    return '';
  });
  return { html: cleaned, enabled, depth };
}

/**
 * 扫描正文顶层标题（跳过折叠块与分页块内部），补齐唯一锚点 id，并生成目录项与启用判断。
 * - news / corp：收录顶层 h2 与 h3；
 * - person：收录顶层 h2 与红/黑料标题（h3.liao-head）；
 * - battle：收录顶层 h2 与高潮标题（h3.liao-head）。
 */
export function prepareArticle(rawHtml, { kind = 'news', toc, tocDepth } = {}) {
  const directive = parseTocDirective(rawHtml);
  const src = directive.html;

  // 收集已有 id，避免冲突
  const usedIds = new Set();
  for (const m of src.matchAll(/\bid="([^"]+)"/g)) usedIds.add(m[1]);

  let seq = 0;
  const nextId = () => {
    do seq++;
    while (usedIds.has(`sec-${seq}`));
    const id = `sec-${seq}`;
    usedIds.add(id);
    return id;
  };

  // 单遍扫描容器开闭与 h2/h3 标题，准确跳过 fold / tabs / zhupi 内部标题，并记录红黑高潮块类型
  const tokenRe = /<(\/?)(details|section|aside)\b([^>]*)>|<h([23])\b([^>]*)>([\s\S]*?)<\/h\4>/gi;
  let skipDepth = 0;
  const skipStack = [];
  let currentLiao = null;
  const liaoStack = [];
  const candidates = [];

  const html = src.replace(tokenRe, (full, closing, blockTag, blockAttrs, hLevel, hAttrs, hInner) => {
    if (blockTag) {
      const tag = blockTag.toLowerCase();
      if (!closing) {
        const cls = (blockAttrs.match(/\bclass="([^"]*)"/i)?.[1] ?? '').split(/\s+/);
        const isSkip = (tag === 'details' && cls.includes('fold'))
          || (tag === 'section' && cls.includes('tabs'))
          || (tag === 'aside' && cls.includes('zhupi'));
        skipStack.push(isSkip);
        if (isSkip) skipDepth++;

        let liaoKind = null;
        if (tag === 'section' && cls.includes('liao')) {
          if (cls.includes('liao-hong')) liaoKind = 'hong';
          else if (cls.includes('liao-hei')) liaoKind = 'hei';
          else if (cls.includes('liao-gaochao')) liaoKind = 'gaochao';
        }
        liaoStack.push(liaoKind);
        if (liaoKind) currentLiao = liaoKind;
      } else {
        if (skipStack.pop()) skipDepth = Math.max(0, skipDepth - 1);
        liaoStack.pop();
        currentLiao = [...liaoStack].reverse().find(Boolean) ?? null;
      }
      return full;
    }

    if (skipDepth > 0) return full;

    const level = Number(hLevel);
    const cls = (hAttrs.match(/\bclass="([^"]*)"/i)?.[1] ?? '').split(/\s+/);
    const isLiaoHead = level === 3 && cls.includes('liao-head');

    if ((kind === 'person' || kind === 'battle') && level === 3 && !isLiaoHead) {
      return full;
    }

    // 红/黑/高潮标题去除徽记字样再取文本
    const cleanInner = isLiaoHead
      ? hInner.replace(/<span[^>]*class="[^"]*liao-badge[^"]*"[^>]*>[\s\S]*?<\/span>/gi, '')
      : hInner;
    const text = stripTags(cleanInner);
    if (!text) return full;

    const existingId = hAttrs.match(/\bid="([^"]+)"/i)?.[1];
    const id = existingId || nextId();
    const badge = isLiaoHead ? currentLiao : null;
    candidates.push({ id, level, text, badge });

    if (existingId) return full;
    return `<h${hLevel} id="${id}"${hAttrs}>${hInner}</h${hLevel}>`;
  });

  // 计算目录深度与最终列表
  const explicitDepth = tocDepth === 2 || tocDepth === 3 ? tocDepth : directive.depth;
  let items = candidates;
  if (kind === 'news' || kind === 'corp') {
    const h2Only = candidates.filter(c => c.level === 2);
    if (explicitDepth === 2) {
      items = h2Only;
    } else if (explicitDepth === 3) {
      items = candidates;
    } else if (candidates.length > AUTO_COLLAPSE_TOTAL && h2Only.length >= AUTO_COLLAPSE_H2) {
      items = h2Only;
    }
  } else if (explicitDepth === 2) {
    items = candidates.filter(c => c.level === 2);
  }

  // 仅 news / corp 的三级标题相对二级标题缩进；列传红黑料与战役高潮本身带圆点徽记且常独立于 h2，统一左对齐。
  const hasH2 = items.some(c => c.level === 2);
  const tocItems = items.map(c => ({
    ...c,
    indent: (kind === 'news' || kind === 'corp') && hasH2 && c.level === 3,
  }));

  const explicitToc = typeof toc === 'boolean' ? toc : directive.enabled;
  const textLen = stripTags(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '')).replace(/\s+/g, '').length;
  const autoEnabled = (textLen >= AUTO_MIN_CHARS && tocItems.length >= AUTO_MIN_ITEMS) || tocItems.length >= AUTO_MANY_ITEMS;
  const hasToc = tocItems.length >= 2 && (explicitToc !== undefined ? explicitToc : autoEnabled);
  const hasTabs = /<section\b[^>]*\bdata-tabs\b/.test(html);

  return {
    html,
    toc: hasToc ? tocItems : [],
    hasToc,
    hasTabs,
  };
}
