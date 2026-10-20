# AGENTS.md — 新伊甸野史 · 代理说明

> 本仓库的权威入口；详细规则按第 2 节分工维护。`CLAUDE.md` 是本文件的逐字副本：改一处，必须把另一处改成一模一样。

## 0. 底线

1. **维护者不写代码。** 所有操作由你完成，完成后用中文简短汇报：只提不明确、待核或需要拿主意的部分；不复述已无争议的主线，维护者提交前不给网址。少讲技术细节；需要维护者拿主意时出选择题。
2. **每次改动后 `npm run build` 必须成功**，否则不算完成。
3. 添加或修订列传用 `add-person`；添加或修订战役页用 `add-battle`；批量找人、战役／贴吧查漏用 `research-community`。Codex 读 `.agents/skills/<技能>/SKILL.md`，Claude Code 读 `.claude/skills/<技能>/SKILL.md`；对应副本必须逐字相同。
4. **不提交、不推送，也不问要不要提交。** 改完留在工作区，维护者攒够一批后自己 commit、push。
5. 内容必须有出处，不编事件、时间、战果，不把想象的话当本人原话；不收现实隐私、歧视内容和未成年人。写作须显著发挥，口吻不保守，改写只能变长；动笔前先读写作验收里的标杆范文，具体边界与验收按第 2 节入口读取。

## 1. 这是什么

“新伊甸野史”：EVE Online 宁静服（欧服）华人社区名人群像列传，纯静态站，托管在 GitHub Pages。
线上：`https://ddd4512kk-source.github.io/EVE-Online-Tranquility-Chinese-Personas/`

全站分板块：**列传**是主体，**战役**收各方总损失 100B 以上的战斗（见内容规则第 5 节“战役”）。以后的板块照同一框架加，登记在 `src/_data/sections.js`。以下规则未注明板块的，都指列传。

- 一人一篇，对应一个收录角色：主号优先，找不到就用属于本人的小号。不重复收录同一人。
- 内容核心是**讥讽、黑历史、锐评**——戏谑群像，不是档案库。游戏数据只是陪衬。
- 收录欧服华人圈**所有有故事的人**，不按年代、名气筛，上限约千人。外国大联盟领头人与华人圈交集多的也收（如 The Mittani），以交集为主线。

## 2. 按任务读取

本文件维护全局约束与操作约定；技能只维护流程，详细规则与示例放在下列文档。修改规则时只改其归属文件，其他入口用引用，不重复抄写。下列文档是本说明的组成部分，按任务读取相关节，不要求每次全部加载。

| 任务 | 必读内容 |
| --- | --- |
| 人物收录、身份对应、素材归因 | [内容规则](docs/content-rules.md) 第 2、3 节 |
| 正文写作 | 内容规则第 4 节与 [写作验收](docs/writing-review.md) |
| 人物文件与字段 | 内容规则第 5 节“目录／front matter／正文”与 [人物模板](docs/person-template.md) |
| 战役收录、分方与统计 | 内容规则第 5 节“战役”与 [战役模板](docs/battle-template.md)；涉及人物归因再读第 3 节 |
| 接收素材、归档与清理队列 | 内容规则第 6 节 |
| 联网取材 | [取材手册](docs/research-method.md) 对应入口，含联网条件、预算与停止规则 |
| 布局、样式、前端交互 | [网站设计](docs/site-design.md) |

## 3. 操作流程

### 执行约定

- 开工先 `git status --short`、`npm run doctor`；内容或构建改动再用 `npm run check` 查离线基线。保留其他会话与暂存区的改动；基线故障不能靠删目录、跳过校验来“通过”。
- 环境错误先修环境，再沿用正确 PATH；Python 用 `python3`，不临时假设装有第三方库。只读相关文件／段落，大输出落临时文件分段读；被截断的内容不算已读。
- 批量写作先完成少量代表人物，核对原有主线、综合 KB、战役与红黑料是否保留，再扩批；脚本只整理事实，不批量生成套话。修正一种问题时不能删掉另一条已认可要求。
- 长任务沿冻结清单续跑，分别记录取得、读过、归档、入文及下一步；有可继续的授权工作就推进，不靠反复问“是否继续”。失败与排除记录也复用。
- 最终修改后 `git diff --check`、`npm run build`，通读受影响的生成页；改脚本另跑 `npm test`。环境与副本预检已接入 build，测试也接入 CI。临时副本验证不能替代全仓通过。

### 其他

- 刷新数据：`npm run fetch -- --refresh <ID>`；全部刷新耗时较长，先说明。
- 审核 PR：CI 自动构建；缺数据缓存的合并后本地 `npm run fetch` 补交。只拦现实隐私、毫无出处的编造和纯人身攻击。

## 4. 网站设计约束（改网站时才需要）

改布局、样式、前端交互时必须读 [docs/site-design.md](docs/site-design.md)；内容与取材任务无需加载设计细则。

## 5. 技术结构

Eleventy 3（Nunjucks + Markdown）+ Pagefind 全文搜索，GitHub Actions 部署（PR 只构建）。

```
src/people/<短名>/           列传、素材、快照、头像
src/people/people.11tydata.js 列传计算字段
src/battles/<短名>/          战役篇、素材、战报快照 br.json
src/battles/battles.11tydata.js 战役计算字段（网址、分档、标签、分方统计）
src/_data/site.js           站名等
src/_data/sections.js       板块登记与导航
src/_data/systemNames.js    星系中文名（战役页显示）
src/_data/entityNames.json  全站共用的军团、联盟名称与 ticker（按 ID；角色快照、战役显示都用，npm run fetch 写入；只手改华人军团的 "chinese": true 标记）
src/_includes/              布局与组件
src/assets/css/site.css     全站样式
src/assets/js/              首页筛选、战役排序筛选、术语弹窗
src/assets/fonts/serif/     衬线字体切片（Noto Serif SC，OFL；fonts.css 引用）
src/sw.js                   Service Worker：头像、战徽、字体存读者本地（构建时放到站点根目录）
scripts/fetch-characters.mjs 校验 + 抓数据
scripts/character-snapshot.mjs 角色快照存盘格式与展开
scripts/battles.mjs         战役分档、分方统计与校验（check-battles.mjs 调用）
scripts/battle-report.mjs   br.evetools／killmail.app 战报快照
scripts/find-character.mjs  查 ID
scripts/glossary.mjs        术语蓝字
scripts/make-fonts.mjs      重新生成衬线字体切片（一次性，不接入构建）
scripts/research/           取材工具（不接入构建）
eleventy.config.js          集合、红黑评块、过滤器
docs/                       模板、术语表、找料方法、素材索引、备忘录、线索
```

| 命令 | 作用 |
| --- | --- |
| `npm run doctor` | 离线检查 Node、依赖与指令副本 |
| `npm test` | 离线脚本回归验证 |
| `npm run find -- "名字"` | 查角色 ID |
| `npm run fetch` | 校验并抓缺失数据 |
| `npm run check` | 只校验，不联网 |
| `npm run build` | 构建到 `_site/` |
| `npm run serve` | 本地预览 `http://localhost:8080/` |

- 数据来源：EveWho（雇佣记录）、CCP ESI（创号时间、军团联盟）、images.evetech.net（头像）。删号角色 ESI 404 时自动用 EveWho。
- Git Bash 会改写以 `/` 开头的参数，模拟子路径构建要加 `MSYS_NO_PATHCONV=1 PATH_PREFIX=/EVE-Online-Tranquility-Chinese-Personas/ npx @11ty/eleventy`。
- 新增本地 CSS/JS 引用带 `?v={{ site.build }}`。Markdown 正文不经模板引擎，写 `{{ }}` 无妨。
