import fs from "node:fs";

// 文档是唯一词条来源；构建时同时供术语页和列传蓝字使用。
const source = fs.readFileSync(new URL("../docs/glossary.md", import.meta.url), "utf8");
export const glossaryEntries = source.split("\n")
  .filter((line) => line.startsWith("| ") && !line.startsWith("| 英文") && !line.startsWith("| ---"))
  .map((line) => {
    const [term, meaning, avoid, note, status] = line.slice(1, -1).split("|").map((cell) => cell.trim());
    if (!term || !meaning || !note || !["已确认", "待复核"].includes(status)) {
      throw new Error(`术语表词条格式错误：${line}`);
    }
    const id = `term-${[...term].map((c) => c.codePointAt(0).toString(16)).join("-")}`;
    return { term, meaning, avoid: avoid === "—" ? "" : avoid, note: note.replaceAll("`", ""), status, id };
  });

const byTerm = new Map(glossaryEntries.map((entry) => [entry.term, entry]));
// 这些舰船中文名同时是人物外号（台风、乌鸦王、黑鸦……）或日常词（复仇、灵感、实践……），
// 自动蓝字会把人名、普通话误标成舰船；术语页词条保留，只是正文不自动加蓝。
const ambiguousShipNames = new Set([
  "台风", "乌鸦", "黑鸦", "塞纳波", "娜迦",
  "复仇", "流浪", "幽灵", "分裂", "实践", "预言", "灵感", "挑战", "星空", "爆发", "回声", "激进",
  "破天", "守卫", "先驱", "异端", "恶意", "罪恶", "恶魔", "启示", "奉献", "磨难", "警惕", "促进",
  "神示", "仇恨", "使徒", "教皇", "先知", "猛烈", "黑夜", "猎获", "唤风", "暴君", "富豪",
]);
// 舰船名后面跟这些字时其实是军团/联盟名（凤凰城、银鹰骑士团……），不加蓝。
const wordFollowedByName = {
  "凤凰": /^(城|联盟群)/,
  "银鹰": /^(骑士团|军团)/,
  "冥府": /^之/,
};
const linkedTerms = [
  ["auth", "auth"], ["seat", "seat"], ["ping", "ping"], ["awox", "awox"], ["打蓝", "awox"],
  ["Monitor", "Monitor"], ["监视者", "Monitor"], ["泡泡", "bubble / warp disruption bubble"],
  ["solo", "solo / Solo"], ["Solo", "solo / Solo"],
  ["打进增强", "增强"], ["被增强", "增强"],
  ["AFK", "AFK"], ["CSM", "CSM"], ["SRP", "SRP"], ["cyno", "cyno"],
  ["FAX", "FAX / fax"], ["fax", "FAX / fax"], ["ESS", "ESS"],
  ["POS", "POS"], ["MTU", "MTU"], ["ADM", "ADM"], ["BPC", "BPC"], ["BBC", "BBC"],
  ["NBSI", "NBSI"], ["YST", "YST"], ["WWB2", "WWB / WWB2"],
  ["脑浆", "脑浆"], ["电鱼", "电鱼"], ["黑隐", "黑隐"], ["超旗", "超旗"],
  ["浮木", "浮木"],
  ["卖水果", "水果 / 卖水果"], ["水果", "水果 / 卖水果"],
  ["投人", "投人"], ["大鱼", "大鱼"], ["TFI", "TFI"],
  ["轻拦", "轻拦 / 重拦"], ["重拦", "轻拦 / 重拦"], ["跳刀", "跳刀"],
  ["铁壁", "星城 / 铁壁"], ["星城", "星城 / 铁壁"], ["反诱导", "反诱导"],
  ...glossaryEntries
    .filter((entry) => entry.note.startsWith("舰船名；") && !ambiguousShipNames.has(entry.meaning))
    .map((entry) => [entry.meaning, entry.term]),
];

export function glossaryLinks(md) {
  const patterns = linkedTerms.map(([word, term]) => {
    const entry = byTerm.get(term);
    if (!entry) throw new Error(`自动蓝字缺少术语词条：${term}`);
    return { word, entry };
  }).sort((a, b) => b.word.length - a.word.length);

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
            const found = patterns.find(({ word }) => value.startsWith(word, i) &&
              (!/^[A-Za-z]/.test(word) || !/[A-Za-z0-9]/.test(value[i - 1] ?? "")) &&
              (!/[A-Za-z]$/.test(word) || !/[A-Za-z0-9]/.test(value[i + word.length] ?? "")) &&
              !(word === "泡泡" && /^(船|手|仙人|金仙)/.test(value.slice(i + 2))) &&
              !(wordFollowedByName[word] && wordFollowedByName[word].test(value.slice(i + word.length))));
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
