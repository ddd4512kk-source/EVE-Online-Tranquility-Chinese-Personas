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
    // 红料 / 黑料 条数，显示在目录卡片上
    liao: (d) => {
      const raw = d.page?.rawInput ?? "";
      const count = (kind) => (raw.match(new RegExp(`^:::\\s*${kind}(?:\\s|$)`, "gm")) ?? []).length;
      return { hong: count("红料"), hei: count("黑料") };
    },
  },
};
