import { execFileSync } from "node:child_process";

// 列传最后更新时间 = 该 .md 最后一次提交的时间（只看列传本身，素材、快照不算）。
// 未提交的新文件按构建时间算。CI 需完整历史（checkout fetch-depth: 0）。
const lastCommit = new Map();
try {
  const log = execFileSync("git", ["log", "--format=@%cI", "--name-only", "--", "src/people"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  let date = null;
  for (const line of log.split("\n")) {
    if (line.startsWith("@")) date = line.slice(1);
    else if (line && !lastCommit.has(line)) lastCommit.set(line, date);
  }
} catch {
  // 没有 git 时不显示真实日期，退回构建时间
}
const buildTime = new Date().toISOString();

export default {
  layout: "person.njk",
  eleventyComputed: {
    // 网址用角色 ID，文件改名不影响链接
    permalink: (d) => `/p/${d.character_id}/`,
    char: (d) => d.characters?.[String(d.character_id)],
    // 中文名优先，没有则用游戏角色名
    displayName: (d) => d.cn_name || d.characters?.[String(d.character_id)]?.name || String(d.character_id),
    pageTitle: (d) => `${d.displayName}列传`,
    pageDescription: (d) => d.epithet || `${d.displayName}列传`,
    // 模板里统一用 labels 引用作者写的 tags
    labels: (d) => d.tags ?? [],
    updated: (d) => lastCommit.get(d.page?.inputPath?.replace(/^\.\//, "")) ?? buildTime,
    // 红料 / 黑料 条数，显示在目录卡片上
    liao: (d) => {
      const raw = d.page?.rawInput ?? "";
      const count = (kind) => (raw.match(new RegExp(`^:::\\s*${kind}(?:\\s|$)`, "gm")) ?? []).length;
      return { hong: count("红料"), hei: count("黑料") };
    },
  },
};
