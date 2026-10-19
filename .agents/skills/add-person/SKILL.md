---
name: add-person
description: 为新伊甸野史添加或修订人物列传；批量发现人物和回查来源用 research-community。
---

# 添加／修订列传

按 AGENTS.md 的任务表读取内容规则第 2—4 节、第 5 节人物格式及第 6 节归档；写作前读 `docs/writing-review.md` 和 `docs/person-template.md`。已有上下文不重复加载。

1. 读已有列传、本人素材和共享来源。已有身份直接复用；新收录或身份冲突用 `npm run find -- "名字或链接"` 查 ID、查重。已有列传默认增补，重写须按明确范围，保留原有主线、职责及红黑料。
2. 先处理具体事件与作者链的缺口。需要联网时才读 `docs/research-method.md` 对应入口；普通修订不自动联网。批量调查转 `research-community`。
3. 按模板建立有效的同名列传与素材文件；收录时迁入旧线索，更新 `docs/materials.md`、备忘录及原队列。按写作验收完成正文。
4. 按 AGENTS.md 执行校验，通读 `_site/p/<ID>/index.html`；更换 ID 时清理旧生成页并核互链。
