# 分层指令维护

## 职责与读取

根目录 `AGENTS.md` 保留全局底线、执行与验收要求及任务路由。目录中的 `AGENTS.md` 只补充本目录的职责、规则入口、风险点和验收；适用于本目录及其子目录。子目录可以细化约定，不能取消全局底线或与统一标准冲突。

每个 `AGENTS.md` 都有同目录、逐字相同的 `CLAUDE.md`；前者是维护源。技能维护源在 `.agents/skills/`，`.claude/skills/` 是对应副本，包含技能的引用文件。使用 `npm run instructions:sync` 从维护源更新副本，`npm run instructions:check` 只核对，不修改。

修改文件前，沿“仓库根目录 → 文件所在目录”逐级查找并读取适用指令；只读本任务涉及的分支。跨目录任务分别读取。不要认为从根目录启动后，所有子目录规则都会自动进入上下文。

| 范围 | 入口与职责 |
| --- | --- |
| `src/` | [站点源码](../src/AGENTS.md)：构建数据、页面和公共约定 |
| `src/people/` | [列传](../src/people/AGENTS.md)：人物档案与写作入口 |
| `src/battles/` | [战役](../src/battles/AGENTS.md)：战役归档与分方入口 |
| `src/_data/` | [公共数据](../src/_data/AGENTS.md)：名称、身份与全局计算 |
| `src/_includes/` | [模板](../src/_includes/AGENTS.md)：共享呈现与互链 |
| `src/assets/` | [前端资源](../src/assets/AGENTS.md)：样式、交互与生成资产 |
| `scripts/` | [脚本](../scripts/AGENTS.md)：公共解析、校验、命令行与测试 |
| `scripts/research/` | [取材工具](../scripts/research/AGENTS.md)：网络预算与可恢复调查 |
| `docs/` | [文档](AGENTS.md)：规范、模板、来源与调查状态 |

技能目录不另复制领域规范；修改技能时按本页和根目录规则维护。`.claude/rules/` 不再保留重复的领域指令，以免只有一种代理读到额外规则。

## 新增或修改规则

1. 判断归属：全仓底线放根目录，目录职责放目录指令，详细标准放专题文档，多步操作放技能，已取得事实放对应素材或来源。
2. 查找原有表述与调用点，先修改唯一权威段落，再更新入口引用；不把一次任务经历、机器路径或完成日志写入长期指令。
3. 用下面模板建立有独立职责的目录入口，不给每个人物或战役目录批量建指令。每份指令最多 100 行；同一路径指令合计不超过 32 KiB，避免不断增加常驻上下文。模板字段要换成实际、存在的路径和命令。
4. 运行 `npm run instructions:sync`，再运行 `npm run instructions:check` 和相应验收。同步不删除多余副本：孤立副本会报错，须确认其来源后处理，不能静默覆盖另一会话的内容。

```markdown
# <目录>代理约定

适用于本目录及子目录，继承上级指令。共同标准见 <相对链接>。

## 职责与入口

- 本目录负责……；详细规则只在 <专题文档链接> 维护。
- 开始此类改动前，读取 <技能或规则入口>。

## 局部约定

- 写清本目录独有、不能从代码直接推断的约束。

## 验收

- 写清实际可用的检查命令和需通读的生成结果。
```

## 方案依据与边界

以下来源于 2026-10-24 核读，作为设计依据，不要求每次任务重新联网：

- [OpenAI：AGENTS.md](https://developers.openai.com/codex/guides/agents-md/) 说明按根目录到当前工作目录合并指令，默认总量上限 32 KiB。不能把此机制理解成自动加载所有待编辑子目录；本仓库显式要求沿目标路径读取。
- [Claude Code：项目记忆](https://code.claude.com/docs/en/memory) 支持目录层级与按需读取子目录，并建议文件简短、具体、无矛盾。保留成对入口兼容现有用法，不依赖某个客户端版本或本机配置。
- [GitHub：自定义指令](https://docs.github.com/en/copilot/concepts/prompting-and-context/custom-instructions) 区分仓库、路径与组织范围，也明确不同客户端支持有差异。当前只为实际使用的 Codex、Claude 维护入口，不预建无人使用的第三套规则。
- [微软 VS Code 的入口](https://github.com/microsoft/vscode/blob/main/AGENTS.md)将详细指导指向[共同指南](https://github.com/microsoft/vscode/blob/main/.github/copilot-instructions.md)。本仓库采用“短入口引用权威规范”的组织方式，代码格式沿用本项目技术栈与现有习惯。
- [ESLint：批量抑制](https://eslint.org/docs/latest/use/suppressions)提供既有差异逐步收敛的机制。局限与本仓库采用方式见[统一标准](repository-standards.md#自动检查与历史差异)。

这是一套结合官方机制和成熟项目实践制定的仓库约定，不宣称存在适用于所有企业的统一模板。静态检查证明文件与配置符合已检查条件；尚未在独立 Codex、Claude Code 新会话中实测全部目录加载行为。
