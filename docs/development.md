# 开发与验证

代码规范见[仓库统一标准](repository-standards.md)，目录指令维护见[分层指令](agent-instructions.md)。

## 开工与收尾

- Node 版本按 `package.json`，最低兼容 20.19+、22.13+ 或 24+，不支持 21.x、23.x；`.nvmrc` 与 CI 沿用 Node 22。升级依赖时核对最低要求、运行时预检和版本边界测试。
- 开工检查工作区状态与本次涉及文件；环境异常时再运行 `npm run doctor`。保留其他会话及暂存区改动，不例行运行全仓检查。
- 以 Windows 原生环境为准。工具缺失、平台包不对或版本过旧时，先在 Windows 下修复安装（依赖用 `npm ci`），不在别的系统里装依赖覆盖本机 `node_modules`。
- 环境错误先修环境，沿用正确 PATH；Python 先确认可用的 Python 3 命令，不假设第三方库已安装。大输出落临时文件分段读，截断不算读完。
- 收尾检查本次文件的差异空白，按影响选择对象级校验和相关测试；人物正文的新收录、重写或实质补写才按 add-person 登记对应复审。独立组件、展示字段和样式不触发 `combat`、`writing-depth`。脚本或公共计算逻辑运行相关测试，涉及公共行为时扩大覆盖。全仓 `check`、`build` 和 `finish` 留给明确的集成验收任务，不在每个并行任务开工或收尾自动运行。
- 页面有与现稿一致的生成结果时通读受影响页，核对内容、数字、链接和资源；没有则审正文并报告生成页未验证，不读取旧页冒充新页。视觉或交互变更按[网站设计](site-design.md)验证；若需构建，避免覆盖其他代理正在使用的输出。
- 指令文件必须被 Eleventy 排除，资源透传也不能复制它们；涉及此行为的改动核对生成页与 Pagefind 索引。定向验证、隔离构建与全仓集成结果分别报告，互不冒充。
- 审核 PR 时 CI 自动构建；缺数据缓存的合并后由代理运行 `npm run fetch` 补齐，后续提交仍须当前任务明确授权。内容审核底线按各类型的规则文件，只拦现实隐私、毫无出处的编造和纯人身攻击。

## 展示、组件与样例的执行边界

- 趣味评分是基于已有故事的主观品评，不是历史考证或能力测量。复用现有正文与材料即可，不为每一分新增证据链、联网调查或数字精度。不得编造新的事件来支撑评分。
- 雷达图与九宫格阵营是独立组件：数据存在人物档案的 `person.radar`、`person.alignment`，不写入主列传正文、身份或游戏快照；`scripts/review.mjs` 的 `PERSON_DISPLAY_FIELDS` 让复审指纹跳过这两个字段。增加、删除、调整评分、维度或阵营，只验组件的数据、渲染和必要交互，不触发主列传复审。
- “做一个例子看效果”只做一个代表样例。先给可见结果，不自行扩批、补齐旧人物资料或追求全部维度都有精确证据。旧资料问题只有直接妨碍本次展示时才处理；其余不另开调查、复审或子代理。
- 检查发现无关复审状态、指纹或工具故障时，不为获得全绿而补跑复审、修改其声明或追查内部实现。记录与本次交付的关系后继续交付可用结果；不能把未通过说成通过。
- 同一问题只做一次必要验证；通过后停止，不反复截图、重登、扩大测试或召回评审代理。只有新改动、实际失败或明确未解决的问题才追加验证。指令修订只做同步与指令检查，不附带产品重构或全站验收。


## 维护命令

| 命令 | 作用 |
| --- | --- |
| `npm run instructions:check` | 递归核对目录指令、技能副本、本地引用和体积 |
| `npm run instructions:sync` | 从 AGENTS 与 .agents 技能源生成对应副本，不删除多余文件 |
| `npm run lint` | 全仓 JavaScript 检查，冻结的旧格式差异按基线处理 |
| `npm run news -- <official\|add\|import\|check>` | 天书：照录官网中文版、写入本站译文、批量导入或校验 `src/news/`；流程见 `add-news` 技能 |
| GitHub Actions「天书每小时收录」 | 订阅新闻、增量翻译补丁说明并发布，配置见[天书自动收录](news-automation.md) |

刷新全部数据耗时较长，执行前先说明；定点刷新用 `npm run fetch -- --refresh <ID>`。

## 技术结构

Eleventy 3（Nunjucks + Markdown）+ Pagefind 全文搜索，GitHub Actions 部署（PR 只构建）。

### 私有资料库 `kb/`

写作用的原始资料存放在私有库，克隆到本仓库根目录下被忽略的 `kb/` 中，目录平放（去掉开头的 `docs/`、`src/`）：各对象旁的 `materials-*`，以及 `docs/` 下的 `leads/`、`sources/`、`tieba/`、`bilibili/`、`corporations/`、`reviews/`、`combat-statistics/` 和待查名单、排除表、复审登记等。清单以 `scripts/workspace.mjs` 的 `PRIVATE_DIRS`、`PRIVATE_FILES`、`PRIVATE_PATTERN` 为准；`.gitignore` 只忽略整个 `kb/`，不再逐项列私有路径。

- 工具通过 `scripts/workspace.mjs` 的 `resolve`／`readdir` 读写，私有路径自动落到 `kb/`；文档和命令里写的仍是原相对路径，如 `docs/leads/`，实际文件在 `kb/leads/`；`src/people/a/materials-a.json` 在 `kb/people/a/`。新脚本读写私有路径时也走这个模块，不拼 `kb/`。
- 网站构建与 CI 不读私有资料。网站要展示的 B站账号与 UP 主统计由 `npm run bilibili:public` 生成到 `src/_data/bilibili-public.json`，与公开仓库一起提交；`bilibili:sync` 会自动重新生成。
- 两个仓库分别查看状态、分别提交，授权规则相同。私有文件不得进入公开仓库，`doctor` 发现公开仓库跟踪了私有路径会报错。
- 新机器先克隆公开仓库，再把私有库克隆到 `kb/`；缺少 `kb/` 时资料类命令会报错退出，构建不受影响。

```
src/people/<短名>/           列传、快照、头像（素材在 kb/people/<短名>/）
src/people/people.11tydata.js 列传计算字段
src/battles/<短名>/          战役正文、同名 JSON（battle 配置 + br 快照）；素材在 kb/battles/<短名>/
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
scripts/battle-archive.mjs  同名战役 JSON 的读取、校验与快照更新
scripts/find-character.mjs  查 ID
scripts/glossary.mjs        术语蓝字
scripts/make-fonts.mjs      重新生成衬线字体切片（一次性，不接入构建）
scripts/make-battle-covers.mjs 把视频封面裁成战役头图（npm run covers，不接入构建）
scripts/research/           取材工具（不接入构建）
eleventy.config.js          集合、红黑评块、过滤器
scripts/workspace.mjs       私有路径清单与 kb/ 定位
docs/                       规则、模板、术语表、找料方法（线索、来源、档案平放在 kb/）
kb/                         私有资料库克隆（不进公开仓库）
```

| 命令 | 作用 |
| --- | --- |
| `npm run doctor` | 离线检查 Node、依赖与指令副本 |
| `npm test` | 离线脚本回归验证 |
| `npm run find -- "名字"` | 查角色 ID |
| `npm run materials -- "关键词"` | 离线定位材料；无关键词时只报数量 |
| `npm run materials:check` | 校验内部叙述材料 JSON（`kb:check` 的一部分） |
| `npm run kb:check` | 校验私有库：材料、B站、贴吧、军团档案、复审登记，并核对公开 B站派生文件是否最新；`check` 末尾调用，构建不调用 |
| `npm run bilibili:public` | 从私有库 B站档案重新生成网站用的 `src/_data/bilibili-public.json` |
| `npm run corporations -- --help` | 离线查询军团、历史Top 100与跨团角色调查，不刷新榜单 |
| `npm run corporations:check` | 校验军团档案、共享角色、来源与本地引用 |
| `npm run corps -- --help` | 军团篇工作台：列候选、开页、汇全仓线索、查门槛与流水账 |
| `npm run names:check` | 校验正文舰船、建筑、星系、星域名写中文；例外在 `docs/game-name-exceptions.json` |
| `npm run finish -- person:短名` | 依次跑差异空白、check、build 及本人两项 `verify`，通过只报一行，首个失败打印末尾输出后停止 |
| `npm run review -- --help` | 按功能筛复查候选、读对象卡片和段落、查变更影响；无参数只报数量 |
| `npm run glossary -- "词语"` | 按词查询术语 JSON；可筛类别、确认状态 |
| `npm run research:query -- <TSV路径> --where 列=值` | 分页读取调查表，不倾倒全表 |
| `npm run fetch` | 校验并抓缺失数据 |
| `npm run check` | 只校验，不联网 |
| `npm run build` | 构建到 `_site/` |
| `npm run serve` | 本地预览 `http://localhost:8080/` |

- 数据来源：EveWho（雇佣记录）、CCP ESI（创号时间、军团联盟）、images.evetech.net（头像）。删号角色 ESI 404 时自动用 EveWho。
- 模拟子路径构建：将环境变量 `PATH_PREFIX` 设为部署子路径后运行 `npx @11ty/eleventy`，完成后清除该变量。
- 新增本地 CSS/JS 引用带 `?v={{ site.build }}`。Markdown 正文不经模板引擎，写 `{{ }}` 无妨。
