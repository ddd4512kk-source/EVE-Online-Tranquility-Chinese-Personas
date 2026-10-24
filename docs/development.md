# 开发与验证

代码规范见[仓库统一标准](repository-standards.md)，目录指令维护见[分层指令](agent-instructions.md)。

## 开工与收尾

- Node 版本按 `package.json`，最低兼容 20.19+、22.13+ 或 24+，不支持 21.x、23.x；`.nvmrc` 与 CI 沿用 Node 22。升级依赖时核对最低要求、运行时预检和版本边界测试。
- 开工先 `git status --short`、`npm run doctor`；内容或构建改动另跑 `npm run check`，记录离线基线。其他会话及暂存区的改动保留，不用删目录或跳过检查掩盖基线问题。
- 以 Windows 原生环境为准。工具缺失、平台包不对或版本过旧时，先在 Windows 下修复安装（依赖用 `npm ci`），不改用 WSL 或其他系统绕过，也不在别的系统里装依赖覆盖本机 `node_modules`。
- 环境错误先修环境，沿用正确 PATH；Python 先确认可用的 Python 3 命令，不假设第三方库已安装。大输出落临时文件分段读，截断不算读完。
- 最终运行 `git diff --check`、`npm run check`、`npm run build`；改脚本或公共计算逻辑另跑 `npm test`。只在相关输入发生变化时重跑已成功的检查。
- 构建后通读受影响的 `_site/` 页面，核对内容、数字、链接和资源。共享变更检查各调用页面；视觉或交互变更按[网站设计](site-design.md)做浏览器验证。
- 指令文件必须被 Eleventy 排除，资源透传也不能复制它们；确认生成页与 Pagefind 索引无内部指令。临时目录成功不能代替全仓通过。
- 审核 PR 时 CI 自动构建；缺数据缓存的合并后由代理运行 `npm run fetch` 补齐，后续提交仍须当前任务明确授权。内容审核底线按内容规则，只拦现实隐私、毫无出处的编造和纯人身攻击。

## 维护命令

| 命令 | 作用 |
| --- | --- |
| `npm run instructions:check` | 递归核对目录指令、技能副本、本地引用和体积 |
| `npm run instructions:sync` | 从 AGENTS 与 .agents 技能源生成对应副本，不删除多余文件 |
| `npm run lint` | 全仓 JavaScript 检查，冻结的旧格式差异按基线处理 |

刷新全部数据耗时较长，执行前先说明；定点刷新用 `npm run fetch -- --refresh <ID>`。

## 技术结构

Eleventy 3（Nunjucks + Markdown）+ Pagefind 全文搜索，GitHub Actions 部署（PR 只构建）。

```
src/people/<短名>/           列传、素材、快照、头像
src/people/people.11tydata.js 列传计算字段
src/battles/<短名>/          战役正文、素材、同名 JSON（battle 配置 + br 快照）
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
scripts/research/           取材工具（不接入构建）
eleventy.config.js          集合、红黑评块、过滤器
docs/                       模板、术语表、找料方法、结构化档案、备忘录、线索
```

| 命令 | 作用 |
| --- | --- |
| `npm run doctor` | 离线检查 Node、依赖与指令副本 |
| `npm test` | 离线脚本回归验证 |
| `npm run find -- "名字"` | 查角色 ID |
| `npm run materials -- "关键词"` | 离线定位材料；无关键词时只报数量 |
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
