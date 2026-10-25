---
name: add-person
description: 为新伊甸野史添加或修订人物列传；批量发现人物和回查来源用 research-community。
---

# 添加／修订列传

按 AGENTS.md 的任务表读取内容规则第 2—4 节、第 5 节人物格式及第 6 节归档；写作前读 `docs/writing-review.md` 和 `docs/person-template.md`。已有上下文不重复加载。

1. 用 `npm run materials -- "人名或角色ID"` 定位已有列传、本人素材和共享来源，再按需读正文。已有身份先查 `node scripts/person-identity.mjs <短名或角色ID>` 统一档案（字段见 `docs/person-identity.md`），直接复用；新收录或身份冲突用 `npm run find -- "名字或链接"` 查 ID、查重。已有列传默认增补，重写须按明确范围，保留原有主线、职责及红黑料。
2. 先处理具体事件与作者链的缺口。按功能修订先用[增量复查](../../../docs/review-workflow.md)读取对象卡片、相关段落与失效结论；新收录和战斗补漏按写作验收核调查覆盖，不以已有独立故事代替游戏画像。需要联网时才读 `docs/research-method.md` 对应入口；普通修订不自动联网。批量调查转 `research-community`。
3. 按模板建立只含正文的同名列传、`<ID>-id.json` 档案与素材文件；收录时迁入旧线索，更新备忘录及原队列；材料目录按需生成，不再维护全员索引。按写作验收完成正文。
4. 新收录、重写及实质补写，按[增量复查](../../../docs/review-workflow.md)分别登记并 `verify` 本人的 `combat`、`writing-depth`；缺项、待补或失效不得交付。链接、错字等轻微修订可复用有效结论。再按 AGENTS.md 校验，通读 `_site/p/<ID>/index.html`；换 ID 时核旧页与互链。
