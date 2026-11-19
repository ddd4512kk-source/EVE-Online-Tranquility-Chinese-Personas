---
name: add-news
description: 为新伊甸野史的“天书”板块收录一篇 EVE Online 官方新闻：官网有中文版就照录并订正明显错误，没有就用 translator 翻译，再写成站内页面。收到 eveonline.com 新闻链接、要求“收录／翻译这篇官方新闻”时使用。
---

# 收录官方新闻

字段与边界见 `src/news/AGENTS.md`。链接须是 `https://www.eveonline.com/news/view/<短名>`（带语言前缀的也行，工具会换回英文原文）。

1. **先找官方中文版。** `npm run news -- official <链接>`。
   - 退出码 0：已写成 `src/news/<短名>.md`（`translation: official`），跳到第 3 步。
   - 返回 `status: skipped`：页面已存在；确需按官网新版重写时加 `--force`（保留手工 `category`）。
   - 退出码 3：官网没有中文版，走第 2 步。
2. **翻译。** 在 `translator/` 目录里按 `translator/.agents/skills/translate-article/SKILL.md` 全流程走（prepare → 草稿 → save → check → 独立复核 → render），不跳步，不改 `jobs/` 以外的文件。拿到 `translator/jobs/<任务>/translation.md` 后回仓库根目录：
   `npm run news -- add <链接> --file translator/jobs/<任务>/translation.md`
   默认 `translation: site`。译稿首行须是“# 中文标题”；译稿开头的“> 原文：”出处行会自动去掉。交付标记为“待复核”或“待修订”时，在汇报里写明。
3. **通读订正与长文排版。** 读一遍生成的正文：官方中文版只订正明显错字、漏译、名称前后不一和排版错误，不改写措辞；本站译文按译者交付说明处理“待核对”名称。
   - **合辑式补丁说明（`patch-notes-version-*`）专项核对**：严格按 `src/news/AGENTS.md` 检查——`title` 须为 `补丁说明——<版本号>版本`；全篇仅每日补丁标题用 `##` 且写成 `## **YYYY-MM-DD.N补丁说明**`（无空格、不重号），官网原文误标为 H2 的“功能与改动／缺陷修复”等当日内部标题一律降为 `###` 及以下；版本已有页面时只按日增量补译新增或改动小节，不整篇推倒重来（每小时自动收录见 `docs/news-automation.md`）。
   - 官方中文版逐张打开正文图片亲眼看：图里有没译的英文（图表标题、图例、条目名、海报字等）时，在该图下补“图中文字”引用块，格式同 translator 成稿——首行 `> **图中文字**`，空引用行后逐行 `> - 中文（英文）`，名称按 SDE 与官方译文，纯数字照抄；装饰图和标志不加。图打不开或看不清时在汇报里列出。看分类是否合适，不合适加 `category:` 覆盖。
   - **长文排版判断（必查）**：正文超过约 2,000 字或含多组结构化参数／清单时，按 `docs/article-layout.md` 逐项判断，不必拘泥官网原文形式——① 决定是否用 `toc`／`tocDepth` 显式控制目录；② 将并列同构的舰船属性、多势力装备／改装件、多组简报等重组为 `::: 分页`；③ 将 15 行以上的冗长清单、大表格或与正文重复的长段图中文字收进自解释标题的 `::: 折叠`。不删改任何原文事实、数字与图片。
4. **收尾。** `npm run news:check`。生成页与现稿一致时核读 `/news/` 卡片和详情页；没生成就如实报告未核读。

批量导入一批已下载的官方中文 Markdown 用 `npm run news -- import <目录> --registry <登记.jsonl>`，登记表每行有 `local_path` 与中文页 `url`。
