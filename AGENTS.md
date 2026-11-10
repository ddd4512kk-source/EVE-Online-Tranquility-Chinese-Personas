# AGENTS.md — 新伊甸野史 · 全局约定

本文件只维护全仓约束与任务入口。目录指令补充局部约定，详细规则只维护一处；每份 `CLAUDE.md` 都是同目录 `AGENTS.md` 的逐字副本。

## 0. 底线

1. **维护者不写代码，也不直接阅读内部数据文件。** 代理完成所有操作，用中文简短汇报；只提不明确、待核或需要拿主意的部分，不复述已无争议的主线，维护者提交前不给网址。少讲技术细节；需要拿主意时出选择题。
2. **按用户要看的交付物划定范围**。趣味评分、人物面板、独立组件与样例展示任务不扩成历史考据、整篇列传复审或旧资料补齐；“先看一个效果”就先交付一个可看的样例。按本次改动范围验证，不因并行工作的无关改动反复跑全仓检查或构建；不得删目录、弱化校验或扩大豁免掩盖本次故障。执行边界见[开发与验证](docs/development.md)。
3. **未经当前任务明确要求，不提交、不推送，也不问要不要提交。** 修改、修复或完成任务不代表提交授权；只授权提交时不推送，不扩大到其他改动。
4. 列传、战役、军团是三个独立板块，规则、模板、流程和验收各有一套，互不通用：列传读[列传规则](docs/rules-person.md)，战役读[战役规则](docs/rules-battle.md)，军团读[军团规则](docs/rules-corp.md)。全站共用的规则：不收现实隐私、歧视内容和未成年人；舰船、建筑、星系、星域写中文，见[术语用法](docs/terminology.md)；任何导向外部的链接一律以新窗口或新标签页打开（带 `target="_blank" rel="noopener noreferrer"`），不得顶掉当前页面。
5. 改 `src/people/` 下任何文件先读 `add-person`；改 `src/battles/` 下任何文件先读 `add-battle`，含只登记小号、补一行素材；改 `src/corps/` 下任何文件先读 `add-corp`。批量找人、战役／贴吧查漏用 `research-community`。Codex 读 `.agents/skills/<技能>/SKILL.md`，Claude Code 读对应 `.claude/skills/` 副本。

## 1. 项目与共同标准

“新伊甸野史”是 EVE Online 宁静服华人社区的戏谑群像静态站，Eleventy 3 + Nunjucks + Markdown + Pagefind，GitHub Pages 托管。

- 列传是主体：一人一篇，收录击杀最多的主号，不重复收录同一人。写有故事的人，以讥讽、黑历史、锐评为核心，游戏数据作陪衬；不按年代名气筛选，规模约千人。外国领头人与华人圈交集多的也收，以交集为主线。
- 战役门槛与规模按[战役规则](docs/rules-battle.md)判断；新增板块沿用站点框架，入口见 `src/` 指令。
- 本仓库只使用 Claude Code 和 Codex，指令、配置和工具不考虑其他客户端或模型供应商。
- **所有代理遵守[仓库统一标准](docs/repository-standards.md)**：代码格式、命名、中文技术文档、模块边界、UTC、测试与历史差异处理不按代理区分。
- 修改文件前，沿根目录到目标文件目录逐级读取适用的 `AGENTS.md`／`CLAUDE.md`，跨目录分别读取；不依赖客户端自动发现全部子目录。子级只能补充，不能取消全局底线。
- 指令、技能与专题规则的归属和维护模板见[分层指令维护](docs/agent-instructions.md)。不把领域细则、机器配置或任务日志继续堆到根文件。

## 2. 按任务读取

| 任务／范围 | 入口与必读内容 |
| --- | --- |
| 人物收录、身份、素材与正文 | [列传指令](src/people/AGENTS.md)；[列传规则](docs/rules-person.md)、[术语用法](docs/terminology.md)、[列传素材归档](docs/materials-person.md)；[人物模板](docs/person-template.md)、[列传验收](docs/person-review.md) |
| 战役收录、分方、统计与正文 | [战役指令](src/battles/AGENTS.md)；[战役规则](docs/rules-battle.md)、[术语用法](docs/terminology.md)；[战役模板](docs/battle-template.md)、[战役验收](docs/battle-review.md) |
| 军团收录与正文 | `add-corp` 技能；[军团指令](src/corps/AGENTS.md)；[军团规则](docs/rules-corp.md)、[术语用法](docs/terminology.md)；[军团志模板](docs/corp-template.md)、[军团验收](docs/corp-review.md) |
| 批量调查、联网取材 | `research-community` 技能；[取材手册](docs/research-method.md)对应入口，含联网条件、预算和停止规则；查人另读[人物取材](docs/research-person.md)，查战役另读[战役取材](docs/research-battle.md)；已有材料先用 `npm run materials` 查询 |
| 跨人物／战役查漏与规则变更复查 | [增量复查](docs/review-workflow.md)，先筛候选，再读相关段落，保存人工结论和失效依据 |
| 站点、布局、样式、交互 | [源码指令](src/AGENTS.md)及对应下级指令；可见变化必读[网站设计](docs/site-design.md) |
| 脚本、校验、抓取与测试 | [脚本指令](scripts/AGENTS.md)；取材工具另读其下级指令 |
| 文档、模板、材料归档 | [文档指令](docs/AGENTS.md)；材料按所属类型的规则归档，列传与线索读[列传素材归档](docs/materials-person.md) |
| 技术结构、命令与环境排障 | [开发与验证](docs/development.md) |

## 3. 执行与验收

- 开工先检查工作区状态及本次范围，保留其他会话与暂存区改动；按需检查环境，不例行运行全仓检查。大输出分段读，被截断不算已读。
- 浏览器操作优先使用已连接工具，复用现有会话；连接失败先排查工具与授权，避免反复启动新浏览器。
- 批量写作先完成少量代表，按所属类型的验收通读后再扩批；脚本只整理事实，不批量生成套话。修正一种问题不能删掉另一条已认可要求。
- 内部数据以查询与校验效率为准，可推导结果按需生成，人工判断只维护一处。长任务沿冻结清单续跑，区分取得、读过、归档、入文及下一步；复用失败和排除记录，有可继续的授权工作就推进。
- 收尾检查本次差异和受影响对象，按改动选择定向校验、测试及页面核读；不自动运行 `npm run check`、`npm run build` 或 `npm run finish`。共享逻辑变更按影响范围测试；全站检查由集成任务执行。未生成或未核读页面时如实报告，不把旧生成页当现稿。具体见开发文档。
- 指令源改完运行 `npm run instructions:sync`；`doctor` 递归核对副本，`lint` 与构建、CI 共用代码规则。构建成功、测试成功、人工复核和真实客户端验证分别汇报，不混作已完成。
