import markdownItContainer from "markdown-it-container";
import fs from "node:fs";
import path from "node:path";
import { glossaryEntries, glossaryLinks } from "./scripts/glossary.mjs";

// 所有日期按 EVE 时间（UTC）显示
const pad = (n) => String(n).padStart(2, "0");
const utc = (iso) => (iso ? new Date(iso) : null);

export default function (eleventyConfig) {
  eleventyConfig.addGlobalData("glossaryEntries", glossaryEntries);
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  for (const person of fs.readdirSync("src/people", { withFileTypes: true })) {
    if (!person.isDirectory()) continue;
    for (const file of fs.readdirSync(path.join("src/people", person.name))) {
      const match = file.match(/^portrait-(\d+)\.jpg$/);
      if (match) {
        eleventyConfig.addPassthroughCopy({
          [`src/people/${person.name}/${file}`]: `portraits/${match[1]}.jpg`,
        });
      }
    }
  }
  eleventyConfig.ignores.add("src/people/*/materials-*.md");
  eleventyConfig.ignores.add("src/people/_*.md");

  eleventyConfig.amendLibrary("md", (md) => {
    // 中文写作不手动折行：单个换行即换行（聊天记录可逐行书写）
    md.set({ breaks: true });
    // ::: 评 … ::: —— 锐评块，渲染为“朱批”
    md.use(markdownItContainer, "评", {
      render: (tokens, idx) =>
        tokens[idx].nesting === 1
          ? '<aside class="zhupi"><span class="zhupi-mark" data-pagefind-ignore>评曰</span>\n'
          : "</aside>\n",
    });
    // ::: 红料 [标题] … :::（正面）与 ::: 黑料 [标题] … :::（负面），每块一条
    for (const [kind, cls] of [["红料", "liao-hong"], ["黑料", "liao-hei"]]) {
      const re = new RegExp(`^${kind}(?:\\s+(.*))?$`);
      md.use(markdownItContainer, kind, {
        validate: (params) => re.test(params.trim()),
        render: (tokens, idx) => {
          if (tokens[idx].nesting !== 1) return "</section>\n";
          const title = tokens[idx].info.trim().match(re)[1];
          return (
            `<section class="liao ${cls}"><h3 class="liao-head"><span class="liao-badge" data-pagefind-ignore>${kind[0]}</span>` +
            (title ? md.utils.escapeHtml(title) : kind) +
            "</h3>\n"
          );
        },
      });
    }
    md.use(glossaryLinks);
  });

  // 列传集合：按主角色创号时间升序
  eleventyConfig.addCollection("people", (api) => {
    const people = api.getFilteredByGlob("src/people/*/*.md");
    for (const p of people) {
      if (!p.data.char) {
        throw new Error(
          `${p.inputPath}：没有角色 ${p.data.character_id} 的缓存数据，请先运行 npm run fetch`,
        );
      }
    }
    return people.sort(
      (a, b) =>
        Date.parse(a.data.char.birthday) - Date.parse(b.data.char.birthday) ||
        a.data.character_id - b.data.character_id,
    );
  });

  // 标签 → 人物列表（保持创号时间顺序）
  eleventyConfig.addCollection("tagMap", (api) => {
    const map = new Map();
    const people = api
      .getFilteredByGlob("src/people/*/*.md")
      .filter((p) => p.data.char)
      .sort((a, b) => Date.parse(a.data.char.birthday) - Date.parse(b.data.char.birthday));
    for (const p of people) {
      for (const t of p.data.labels ?? []) {
        if (!map.has(t)) map.set(t, []);
        map.get(t).push(p);
      }
    }
    return [...map]
      .map(([name, items]) => ({ name, items }))
      .sort((a, b) => b.items.length - a.items.length || a.name.localeCompare(b.name, "zh"));
  });

  eleventyConfig.addFilter("ymd", (iso) => {
    const d = utc(iso);
    return d ? `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` : "";
  });
  eleventyConfig.addFilter("ym", (iso) => {
    const d = utc(iso);
    return d ? `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}` : "";
  });
  // 按创号年份分组（输入已按创号时间排序）
  eleventyConfig.addFilter("groupByYear", (people) => {
    const groups = [];
    for (const p of people) {
      const year = utc(p.data.char.birthday).getUTCFullYear();
      if (groups.at(-1)?.year !== year) groups.push({ year, items: [] });
      groups.at(-1).items.push(p);
    }
    return groups;
  });
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v));
  eleventyConfig.addFilter("glossaryUsed", (content) =>
    glossaryEntries.filter((entry) => String(content).includes(`data-glossary-id="${entry.id}"`)),
  );
  // 供首页即时筛选用的检索串
  eleventyConfig.addFilter("searchKey", (d) =>
    [d.cn_name, d.char?.name, ...(d.aliases ?? []), ...(d.labels ?? []), d.epithet]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  );

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    // GitHub Pages 项目站点挂在 /<仓库名>/ 下，由 CI 通过环境变量传入
    pathPrefix: process.env.PATH_PREFIX || "/",
    // Markdown 正文不经过模板引擎，作者写 {{ }} 之类字符不会出错
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
