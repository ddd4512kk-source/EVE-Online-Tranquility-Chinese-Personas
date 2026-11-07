# 文档与材料代理约定

适用于本目录及子目录，继承根目录指令。共同标准见[仓库统一标准](repository-standards.md)，分层维护见[指令治理](agent-instructions.md)。

- 列传、战役、军团各有一套规则、模板和验收：`rules-person.md`／`person-template.md`／`person-review.md`，`rules-battle.md`／`battle-template.md`／`battle-review.md`，`rules-corp.md`／`corp-template.md`／`corp-review.md`，互不引用写作标准，也不合并。三类唯一共用的规则文件是 `terminology.md`（专名写中文）；列传与线索的归档在 `materials-person.md`，战役、军团的素材要求写在各自规则里，联网方法在 `research-method.md`（人物、战役专项在 `research-person.md`、`research-battle.md`，工具语法、B站细则与少用入口在附录 `research-tools.md`），视觉在 `site-design.md`；其他入口引用，不再复制整段。
- 技术文档用中文，先说明目的与实际行为，再写必要步骤；正文历史来源可以保留原文。不在长期规范中混入本机配置、任务日志或臆测的验证结果。
- `sources/` 存共享来源，`leads/` 存待查线索，`bilibili/` 与 `corporations/` 按自身 README 维护结构化档案，`reviews/` 按[增量复查](review-workflow.md)保存功能结论。已归人的素材进本人目录；改人物／战役文件须另读对应技能与目录指令。
- 接收、迁移与清理材料按所属类型的规则，列传与线索遵守[列传素材归档](materials-person.md)；用 `npm run materials` 定位已有档案，不另维护可推导的全员总表。完成状态必须与实际读过的范围一致。
- 改规则先找相应技能、模板、引用入口和调用代码，只维护权威段落；需要复查时登记候选与失效依据，不能声称所有旧内容已自动符合新规。
- Markdown 使用相对链接，叙事段落不硬折行；模板示例必须反映当前字段结构。验收检查本地引用、指令副本和根目录构建；改工具另跑测试。
