import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const GLOSSARY = new URL("../docs/glossary.json", import.meta.url);
const STATUSES = ["已确认", "待复核"];
const KINDS = ["ship", "term"];
const HELP = `术语查询与校验；docs/glossary.json 是词条与蓝字匹配配置的唯一来源。

用法：npm run glossary -- [关键词] [选项]
  --kind <类别>   ship（舰船）/ term（其他术语）
  --status <状态> 已确认 / 待复核
  --limit <数量>  每页最多返回条数，默认 20，必须为正整数
  --offset <数量> 跳过的命中数，默认 0，必须为非负整数
  --check         只校验并报告词条、蓝字数量；须单独使用
  --help          显示本帮助；须单独使用

关键词匹配原词、释义、误译提醒、备注、匹配取舍说明与蓝字写法，忽略英文大小写。
多个关键词参数合成一个含空格的短语。无条件时只报数量，不输出全表。
输出 JSON：count 为词条总数，total 为命中数，records 为当前页。
需纯 JSON 时用 npm run --silent glossary -- ...。

示例：
  npm run glossary -- "Monitor"
  npm run glossary -- "泡泡"
  npm run glossary -- --status 待复核 --limit 10
  npm run glossary -- --kind ship --limit 10 --offset 10
  npm run glossary:check

数据维护：顶层 version:1、非空 entries 列表，不另同步 Markdown 词表。
  term：唯一原词／黑话；沿原词生成网站锚点，改名会改变链接，不随意改名。
  meaning、avoid、note：中文释义、误译提醒、上下文说明；无提醒时 avoid 用空字符串。
    说明可直接含竖线，无需表格转义；旧备注的反引号保留在 JSON 中，显示时去除。
  status：已确认 / 待复核；格式迁移不升级状态。
  kind：ship / term，显式填写，不从备注措辞猜类别。
  links：自动蓝字配置列表，每项 { "word": "实际匹配文字" }；[] 表示只展示词条。
    匹配区分英文大小写，不同写法逐项登记；多个词条不得争用同一匹配文字。
  links[].exclude_suffixes：可选排除后缀；如“泡泡”接“船”、“凤凰”接“城”时不标注。
  link_note：可选匹配取舍说明，记录同名冲突或刻意不标注的理由，不作事件依据。

最长匹配优先，英文词保留边界检查；标题、引用、已有链接与代码不加蓝。
不从“舰船名；”等备注前缀推定匹配。既有同名匹配保留实际生效的一项，
其余保留释义并记 link_note，不擅自裁定译名；写作用语约定见 docs/content-rules.md 的“术语用法”。
修改后运行校验与构建；npm run check 和 npm run build 均先校验版本、字段、
重复词条、重复蓝字和排除后缀，失败即停止，不跳过坏词条。
`;
const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
const text = value => typeof value === "string" && value.trim().length > 0;
export const termId = term => `term-${[...term].map(c => c.codePointAt(0).toString(16)).join("-")}`;

// JSON is the only data source. Return the existing template fields and stable anchors.
export function parseGlossary(data) {
  const fail = message => { throw new Error(`术语档案：${message}`); };
  const keys = (value, allowed, label) => {
    for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`${label}未知字段 ${key}`);
  };
  if (!object(data)) fail("必须是 JSON 对象");
  keys(data, ["version", "entries"], "档案 ");
  if (data.version !== 1 || !Array.isArray(data.entries) || !data.entries.length) fail("必须有 version:1 和非空 entries 列表");
  const terms = new Set(), words = new Map();
  return data.entries.map((entry, index) => {
    const label = `第 ${index + 1} 项 `;
    if (!object(entry)) fail(`${label}必须是对象`);
    keys(entry, ["term", "meaning", "avoid", "note", "status", "kind", "links", "link_note"], label);
    for (const field of ["term", "meaning", "note"]) if (!text(entry[field])) fail(`${label}${field} 必须是非空字符串`);
    if (entry.term !== entry.term.trim()) fail(`${label}term 不能有首尾空白`);
    if (terms.has(entry.term)) fail(`${label}重复词条 ${entry.term}`);
    terms.add(entry.term);
    if (typeof entry.avoid !== "string") fail(`${entry.term} avoid 必须是字符串，无内容用空字符串`);
    if (!STATUSES.includes(entry.status)) fail(`${entry.term} status 必须是 ${STATUSES.join(" / ")}`);
    if (!KINDS.includes(entry.kind)) fail(`${entry.term} kind 必须是 ${KINDS.join(" / ")}`);
    if (entry.link_note !== undefined && !text(entry.link_note)) fail(`${entry.term} link_note 必须是非空字符串`);
    if (!Array.isArray(entry.links)) fail(`${entry.term} links 必须是列表，不自动加蓝用 []`);
    for (const link of entry.links) {
      if (!object(link)) fail(`${entry.term} links 每项必须是对象`);
      keys(link, ["word", "exclude_suffixes"], `${entry.term} links `);
      if (!text(link.word) || link.word !== link.word.trim()) fail(`${entry.term} 蓝字 word 必须非空且无首尾空白`);
      if (words.has(link.word)) fail(`蓝字 ${link.word} 重复归属：${words.get(link.word)} / ${entry.term}`);
      words.set(link.word, entry.term);
      if (link.exclude_suffixes !== undefined && (!Array.isArray(link.exclude_suffixes)
        || !link.exclude_suffixes.every(text) || new Set(link.exclude_suffixes).size !== link.exclude_suffixes.length)) fail(`${entry.term} exclude_suffixes 必须是不重复的非空字符串列表`);
    }
    return { ...entry, note: entry.note.replaceAll("`", ""), id: termId(entry.term) };
  });
}

export function readGlossary(file = GLOSSARY) {
  try { return parseGlossary(JSON.parse(fs.readFileSync(file, "utf8"))); }
  catch (error) { throw new Error(`${file instanceof URL ? fileURLToPath(file) : file}：${error.message}`); }
}

export const glossaryEntries = readGlossary();

export function glossaryLinks(md, { entries = glossaryEntries } = {}) {
  const patterns = entries.flatMap(entry => entry.links.map(link => ({ ...link, entry })))
    .sort((a, b) => b.word.length - a.word.length);

  md.core.ruler.after("inline", "glossary-links", (state) => {
    let inQuote = 0;
    let inHeading = 0;
    for (const block of state.tokens) {
      if (block.type === "blockquote_open") inQuote++;
      if (block.type === "blockquote_close") inQuote--;
      if (block.type === "heading_open") inHeading++;
      if (block.type === "heading_close") inHeading--;
      if (block.type !== "inline" || inQuote || inHeading || !block.children) continue;
      const result = [];
      let inLink = 0;
      for (const token of block.children) {
        if (token.type === "link_open") inLink++;
        if (token.type !== "text" || inLink) {
          result.push(token);
        } else {
          const value = token.content;
          let start = 0;
          for (let i = 0; i < value.length;) {
            const found = patterns.find(({ word, exclude_suffixes = [] }) => value.startsWith(word, i) &&
              (!/^[A-Za-z]/.test(word) || !/[A-Za-z0-9]/.test(value[i - 1] ?? "")) &&
              (!/[A-Za-z]$/.test(word) || !/[A-Za-z0-9]/.test(value[i + word.length] ?? "")) &&
              !exclude_suffixes.some(suffix => value.startsWith(suffix, i + word.length)));
            if (!found) { i++; continue; }
            if (i > start) {
              const plain = new state.Token("text", "", 0);
              plain.content = value.slice(start, i);
              result.push(plain);
            }
            const link = new state.Token("html_inline", "", 0);
            link.content = `<a class="term-link" href="../../glossary/#${found.entry.id}" data-glossary-id="${found.entry.id}" title="查看术语解释">${md.utils.escapeHtml(found.word)}</a>`;
            result.push(link);
            i += found.word.length;
            start = i;
          }
          if (start < value.length) {
            const plain = new state.Token("text", "", 0);
            plain.content = value.slice(start);
            result.push(plain);
          }
        }
        if (token.type === "link_close") inLink--;
      }
      block.children = result;
    }
  });
}

export function queryGlossary(entries, { query = "", kind, status, limit = 20, offset = 0 } = {}) {
  if (kind && !KINDS.includes(kind)) throw new Error(`kind 必须是 ${KINDS.join(" / ")}`);
  if (status && !STATUSES.includes(status)) throw new Error(`status 必须是 ${STATUSES.join(" / ")}`);
  if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isSafeInteger(offset) || offset < 0) throw new Error("limit 必须为正整数，offset 必须为非负整数");
  const needle = query.trim().toLowerCase();
  const matches = entries.filter(entry => (!kind || entry.kind === kind) && (!status || entry.status === status)
    && (!needle || [entry.term, entry.meaning, entry.avoid, entry.note, entry.link_note ?? "", ...entry.links.map(link => link.word)].some(value => value.toLowerCase().includes(needle))));
  return { count: entries.length, total: matches.length, offset, limit,
    records: needle || kind || status ? matches.slice(offset, offset + limit) : [] };
}

export function run(args, entries = glossaryEntries) {
  if (args.includes("--help")) {
    if (args.length !== 1) throw new Error("--help 须单独使用");
    return HELP;
  }
  if (args.includes("--check")) {
    if (args.length !== 1) throw new Error("--check 不与其他参数混用");
    return { valid: true, entries: entries.length, links: entries.reduce((n, entry) => n + entry.links.length, 0) };
  }
  const options = {}, query = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (["--kind", "--status", "--limit", "--offset"].includes(arg)) {
      const value = args[++i];
      if (value === undefined || value.startsWith("--")) throw new Error(`${arg} 缺少值`);
      options[arg.slice(2)] = ["--limit", "--offset"].includes(arg) ? Number(value) : value;
    } else if (arg.startsWith("--")) throw new Error(`未知选项：${arg}`);
    else query.push(arg);
  }
  return queryGlossary(entries, { ...options, query: query.join(" ") });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = run(process.argv.slice(2));
    console.log(typeof result === "string" ? result : JSON.stringify(result, null, 2));
  }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
