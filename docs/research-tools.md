# 取材工具细节

[取材手册](research-method.md)的附录：只收工具语法、B站细则、实现上的坑和少用的补查入口，用到才读；通用规则与流程仍以手册为准。

## 请求守卫与失败记录

- 请求上限、按站间隔和拦截冷却在 `scripts/research/request-guard.mjs` 实现。临时 HTTP 脚本也走 `researchFetch`，或按批次上限用 `createRequestGuard({limit})`，共享停止记录，不重置冷却文件续预算。
- 能否请求用 `researchHostStoppedUntil(站点)` 判断（兼容旧 `.cache/research-cooldown.json`，新事件写对应 `.json.d/`），不手读旧文件。
- HTTP 200 的挑战页记为挑战页，不改称 403；一次 403 不证明网页对正常浏览受限，更不证明功能不存在。

## 贴吧客户端

- 列表“最新”另有“回复／发布”选项；2026-10-25在已连接网页核对，“发布”请求为`sort_type=1`。不能仅凭旧脚本注释认定排序。匿名请求`rn=50`可能首屏只返十个普通主题，下一页却跳到偏移50；回查新帖须核对实际页间衔接，本次用`rn=10`补齐中段。历史扫描未留实际排序证据的，保留原记录，不据新观察重写旧覆盖。

- 客户端 `r=1` 只把当前页倒排，第一页仍是早期楼层：先取 `total_page` 再从末页读起，倒序 `has_more=0` 不等于整帖结束。`tieba-client-read.mjs --reverse`／`--both` 已按此处理，自写请求时照做。
- 主楼的 `sub_post_list` 往往只有两条预览，楼中楼按 `/c/f/pb/floor` 单独分页，用回复 ID 去重。

## 贴吧批量回查

| 要做什么 | 命令 |
| --- | --- |
| 建立回查清单 | `node scripts/research/tieba-review-inventory.mjs <临时目录>`；加 `--probe` 续跑首楼/末页抽查，初筛不算全文阅读 |
| 断点续跑全文 | 原命令加 `--resume`，按同一 JSON 的覆盖记录跳过已完成主楼页和楼中楼，保留旧错误历史；帖号与顺序须与原文件一致 |
| 更新取得范围 | `node scripts/tieba-archive.mjs sync-cache <帖号> <临时.json>`；批量用 `node scripts/research/tieba-review-status.mjs <临时目录>`，只同步取得范围，不修改人工阅读结论 |
| 按冻结清单补全文 | `node scripts/research/tieba-review-batch.mjs <临时目录> [本轮最多帖数]`，顺序跑，复用首尾与已完成全文，保留计数差，限流整批停止；抓取完成不代表人工通读 |

## B站细则

与贴吧同等重要，但大部分任务用不到：只有档案和素材缺本次需要的内容，才读本节并联网。

- **发现方向**：先用 `npm run materials -- "人物或账号名" --kind bilibili` 查正式档案，命中就复用 UID／BV，未命中在素材记“待板块扫描”。不按人名、外号或角色名搜 B站；素材已有确切 UP 名只缺 UID 时，可按该名用户搜索一次；已对应账号贴出的链接直接读。新增发现只走下方[B站扫描队列](#b站扫描队列)。
- **持久档案优先**：按查询结果读 UID 档案、`channel.prior_notes` 与作品 `reading.digest`／`scope`，取得与消化分开记（流程和字段见[档案说明](bilibili/README.md)）。缺精选、旧状态过期、换会话或缓存清理都不触发全频道重读，只定向补读实际缺失的作品。
- **图文必须单查**：调查已知 UP 时同查 `/upload/opus` 图文列表，先复用档案中的覆盖与 `posts[]`。单篇读正文、配图文字与相关作者回应，未加载、未翻页、未读图分别留缺口。重要事件、争议、复盘的关联图文优先，不套关注度粗筛，没有计数不当零。图文与旧专栏归同一 UP JSON（见[档案说明](bilibili/README.md#图文与旧专栏)），单篇消化内容归本篇 `reading.digest`，跨来源事件整合归相关素材。
- **读作品**：候选合并去重后，按预算读简介、选集、作者公开文字与评论。播放量只用来发现候选，不证明作品优秀；评论补作者故事、互动和争议，不能凭热评评价画面、剪辑或讲解。默认读文字，不为找角色名逐段播长视频；转载视角和标题战损不直接归本人。合作作品另核公开创作团队与本人署名，owner 只说明上传者，其中的具体事迹仍可归档、入文。
- **关注度筛选**：播放不足 1000 且评论不足 10 的作品不主动续读，只留标题、出处和当时计数；一项明显受关注的仍可候选。先用已有计数筛，不先批读再剔除；评论数别拿空间卡片上的弹幕数顶替（见[B站网页读取](#b站网页读取)）。粗筛只安排未读作品，不代表质量或收录门槛。
- **先验证读取方式**：新增或修复评论读取方法时，先用一个有评论的页面核对实际正文与覆盖，再扩批。拿到一次空评论结果先查加载状态，不把同一失败方式批量套到剩余作品。
- **登录复用**：已授权读取 B站 Cookie。API 通过 `bilibili-session.mjs` 从可连接的 Chrome B站标签取会话，只在请求内存中使用，不存文件、不进日志或 Git，不读其他网站凭据。日常窗口与独立窗口的登录状态可能不同。
- **失败处理**：API 遇 403／429／412／-352，停止该站 API 并冷却至少 30 分钟，不换接口或出口；同一条目立即改用 `bilibili-chrome-read.mjs` 或已连接的 Chrome 打开网页读取（封面等元数据取自页面 `__INITIAL_STATE__`），不空等冷却。Chrome 遇验证或拦截也停止并单独冷却。
- **覆盖边界**：等页面正常加载，不刷新加载壳。核对投稿总数、可见 BV 与页次；视频页最多取 20 个已加载主评论线程，不翻页、不展开楼中楼。合作账号注销不代表视频失效。

| 入口 | 命令与限额 |
| --- | --- |
| API | `node scripts/research/bilibili.mjs <命令>`：`user`、`search`、`videos <UID>`、`info <UID>`、`video <BV1,BV2,…> [评论页数]`、`capture <BV1,BV2,…> <输出目录>`、`dynamics <UID>`。每个关联UP／事件约15次请求，最多选5个有料视频批读；成功缓存位于 `.cache/bilibili/`。 |
| Chrome | `node scripts/research/bilibili-chrome-read.mjs <公开网址或清单.json> <.cache/输出目录> [最多页数]`。Windows Node≥22＋系统Chrome；清单为 `[{"url":"公开网址"}]`，支持投稿、视频、动态／专栏和搜索页。默认30页，单批上限60页；批量范围与总预算先写进唯一续查队列。 |

### B站扫描队列

只用 `EVE欧服`、`EVE`、`星战前夜`、`EVE国际服` 四词，按此顺序逐词独立搜索，不拼接限定词。固定**综合排序**，每词读第 1—30 页，不足 30 页读到实际末页并记录。结果按[增量归档](bilibili/README.md#增量归档)入档，再对照列传、素材和备忘录反查人物；零星投稿的作者同样保留。

覆盖、失败、下一页与旧排除记录在 `docs/bilibili/scans.json`，用 `node scripts/bilibili-archive.mjs scans` 离线查询。已有记录沿用，不补造页次，不因迁移重扫。开新一轮时记录每词实际页次、去重登记与下一页；遇 412／-352 整批停止记断点，不换词或排序绕过。

## B站网页读取

- 空间视频卡片播放旁的计数是弹幕，评论数以作品元数据 `stat.reply` 或评论区为准；只有空间计数时先核元数据，不能据弹幕少判评论少。
- 评论停在加载态时，用真实鼠标滚轮向下滚动窗口，等 2 秒再查正文；DOM 的 `scrollIntoView` 不保证窗口实际滚动或触发懒加载。
- 评论在 shadow DOM 里，正文没显示不代表无评论。

## 少用的补查入口

- **00 区战役视频补搜**：00 区史诗战役的相关视频仍不足 2 个时，可用 `bilibili.mjs search` 搜“EVE＋星系名前 4 个字符”（字母 O 与数字 0 易混，两种写法都试），再按[来源对战役](research-battle.md#来源对战役时区与战报)对应本场。
- **名册补漏**：CCP 各届 CSM 候选公告与竞选区、联盟锦标赛队伍名单、重大事件战报、军团管理名单可补漏，逐名对照列传、人物素材和待确认角色备忘录。公告里的 `Chinese`、`中文`、华人军团或联盟只是优先核对线索，不凭姓名、所在联盟或贴了中文版就认定与华人圈有关；参选和当选分开核。记下来源和覆盖的届次或事件，未逐项对照的届次列未查；发现人后仍回社区帖子找故事。

## 知乎

有当事人亲笔长答（本人解释被封、联盟史专栏）和“如何看待某某事件”的对线，贴吧没有的细节常在这里。按需用有头浏览器工具；遇验证码提示人工处理，最多等 10 分钟，无响应则停止：

| 要做什么 | 命令 |
| --- | --- |
| 搜索（经搜狗知乎站内，知乎自带搜索未登录无结果） | `node scripts/research/zhihu.mjs search "关键词1" "关键词2" [页数]` |
| 读问题 / 文章与评论（预算内） | `node scripts/research/zhihu.mjs read <网址>...` |
| 列某人文章与回答（预算内） | `node scripts/research/zhihu.mjs user <主页或url_token>` |

- 宽泛关键词（“eve欧服”）九成是萌新问答，还费验证码；搜事件词和人名：`eve FRT`、`如何看待 某联盟`、`某某 eve`。标题含“如何看待/如何评价”加事件的优先读。
- 评论区常有本人现身回复；“知乎用户”匿名答主可凭评论区署名或内容认人。

## 外网

外国联盟、华人被老外爆料的戏多在这里。结论按实际覆盖表述，未查渠道或被拦入口写缺口。

- **Reddit（r/Eve）**：代理自带网页抓取和浏览器扩展访问 reddit.com 均被拦，自带网页搜索也几乎搜不到具体帖；这些失败不算“读不到”。先用 `node scripts/research/reddit-thread.mjs <帖子ID或网址> <临时.json>`（走 pullpush.io 存档，预算内翻页，未完分页留缺口）。
  - pullpush 出错（5xx、429）或评论不全：改用仓库已装的 playwright 驱动有头 Chrome 直接打开帖子页（写法参照 `zhihu.mjs`、`zkill-chrome.mjs`）。这一步也失败才记覆盖缺口，写明失败的命令与状态。
  - 按关键词找帖：`node scripts/research/reddit-search.mjs "\"Army of Mango\"" [posts|comments] [subreddit=Eve] [条数]`。找不到时，先找引用过 r/Eve 的英文二手文章（Talking in Stations 节目页、tagn.wordpress.com、imperium.news、New Eden Post），其链接常给出原帖编号。
  - 脚本遇 429 立即退出；有新需要才评估恢复，不循环重试。网址里 `?c=…` 不是评论编号，直接读全帖。截图只有 `preview.redd.it` 链接，需要时另行下载。
  - 涉及华人的帖，评论区常贴贴吧或 B 站链接，顺着去读。帖中角色名常有出入：ESI `POST /universe/ids/` 查名字，再看相关军团的 `ceo_id`、`creator_id`，用 `npm run find` 确认。
- **官方论坛**：forums.eveonline.com 的 `search.json?q=关键词`，多试几组英文关键词（人名、联盟名、事件词）。
- **凛冬论坛**（forums.winterco.org，有 `.json` 接口）：常有 r/Eve 戏的中文转述。
- **帖中链接的 Google Docs**：`/export?format=txt` 取全文。
- **其他**：百家号“EVE领航员”、PLA 论坛 forum.pla-eve.com。

## 系统 Chrome 月榜读取

有明确浏览器读取需要时用已连接的浏览器工具；需要脚本保存正文、表格、角色 ID 及击杀链接时，运行 `node scripts/research/chrome-read.mjs <zkillboard网址> <.cache/输出前缀>`。月榜后加 `ship/45534/` 可查 Monitor，先核 Top Ships 确实只剩 Monitor。KM 的“List all pilots”展开后才是完整参战名单。导航计预算，验证未通过则停止并留缺口，打开窗口不等于取得数据。

## zKillboard 高级搜索（asearch）

stats 回答不了、又确实需要 KM 名单时才用，例如“某军团谁开过 Monitor”，或为某个说法找几张代表 KM；只问“多不多”先看 stats。一个问题一条精确筛选，默认 `--ids-only` 或 `--details` 十张以内；不按年、月、船型、小号循环跑，不全量补全：

`node scripts/research/zkill-asearch.mjs <asearch网址或#后的JSON> <.cache/输出前缀> [--details N] [--ids-only]`

脚本把 `#` 后的筛选条件译成查询参数，在独立 Chrome 里分页取全部击杀 ID（浏览器只用来过 Cloudflare），再用 zKB API 与 ESI 补全最新 N 张（默认 100），输出 `.json` 与 `.tsv`。tsv 的 `focus_side_ships` 列记录筛选点名者在每张 KM 上的身份与船型，用来核对查到的是不是想要的；提示“没找到筛选点名的参与者”时先查筛选写法。

**先想清楚要回答的问题，再写精确筛选。** 下面的写法和例子帮助理解工具，不是固定配方：只放回答问题必需的条件，不相干的条件（如查强暴时限定攻击方船型）会漏掉真实记录。服务器每页 100 张、最多 10 页；时间段满额时脚本对半拆段重查，这只是兜底——命中成百上千、要拆段，通常说明筛选写宽了。**零结果先用一个已知会命中的同类筛选对照**（同一人换一条常开的船），服务器超时也会回空列表。筛选 JSON 写法：

- **栏位**：`attackers`（攻击方）、`neutrals`（网页上的 Either，任一方）、`victims`（受害者）、`items`（掉落物品）。每项写 `{"type":…,"id":…}`，type 用 `characterID`、`corporationID`、`allianceID`、`shipID`（船型）、`groupID`（舰船分组）、`systemID`、`regionID`。
- **连接方式**（`buttons` 里的 `<栏位>-and`／`-aand`／`-or`，Either 栏写 `either-…`）：And 是每项各自匹配任意一名参与者；Or 是任一项匹配；**In（`aand`）要求同一名参与者同时满足全部项**。“某人开某船”必须把角色和船型放进同一栏并选 In；角色放攻击方、船型放 Either，查到的是“他在场且有人开这船”，舰队战里会混进大量别人开的船。
- **标签**（`buttons` 里写 `label-<标签>`；同组任一，跨组同时满足）：`ganked`（高安强暴：攻击方随后在同星系被 CONCORD 击毁；不含太空舱、战争、awox 与 100 万 ISK 以下，且只标 2018 年 2 月底以后的 KM，更早的强暴改用 `loc:highsec` 加时段另查）、`awox`、`solo`、`#:1`／`#:2+`…`#:1000+`（参与人数）、`loc:highsec`／`lowsec`／`nullsec`／`w-space`、`isk:1b+`／`10b+`／`100b+`／`1t+`、`capital`／`super`／`titan`／`capinv`（有旗舰参与）、`tz:au`、`cat:6`（只看舰船）、`pvp`、`npc`。
- **时间**：`buttons` 含 `custom` 并写 `dtstart`、`dtend`（UTC，`2020-01-01T00:00`）；全时段写 `alltime`。排序 `sort-date`、`sort-desc`。
- `victimsonly`／`attackersonly` 按钮与 `includeAssociates` 只影响网页侧栏的排行汇总，不改变击杀列表。
- 船型等 ID 用 ESI `POST /universe/ids/` 或 `/universe/names/` 核对，不凭记忆写。

例：

```text
某人开 Monitor 的全部 KM
{"buttons":["alltime","attackers-aand","sort-date","sort-desc"],"attackers":[{"type":"characterID","id":<角色ID>},{"type":"shipID","id":45534}]}
某人参与的高安强暴（不限攻击方船型）
{"buttons":["alltime","label-ganked","sort-date","sort-desc"],"attackers":[{"type":"characterID","id":<角色ID>}]}
某联盟谁开过 Monitor（tsv 的 focus_side_ships 即驾驶员名单）
{"buttons":["alltime","attackers-aand","sort-date","sort-desc"],"attackers":[{"type":"allianceID","id":<联盟ID>},{"type":"shipID","id":45534}]}
```

一次脚本运行计 1 次 zKillboard 搜索。拿到的 KM 与驾驶员仍按取材规则核对身份、归属与红黑分类；KM 上有名字只说明参与。
