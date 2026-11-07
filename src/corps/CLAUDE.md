# 军团篇代理约定

适用于本目录及子目录，继承上级指令。共同标准见[仓库统一标准](../../docs/repository-standards.md)，门槛与内容边界见[军团规则](../../docs/rules-corp.md)。

- 改本目录任何文件先读 `add-corp` 技能。军团正文走浮夸、商业化的自吹自擂招商风，绝口不提丑事（丑事归列传，靠卡片上的“含神量”横条形成反差）。写法独立，先读[军团志模板](../../docs/corp-template.md)，不套列传和战役的料块、口吻与验收。
- 每家一个目录 `src/corps/<短名>/`：同名 `.md` 为正文，同名 `.json` 为档案，`materials-<短名>.md` 为素材，不生成页面。
- JSON 的人工字段是 `corp`（`id`、`cn_name`、商业口号 `epithet`、六选一视觉主题 `style`：`tycoon`／`warlord`／`syndicate`／`neon`／`dynasty`／`phantom`，三项 0–100 整数印象指数 `ratings`：`pvp` 武德［由快照按 zKB 最近排名换算，不手填］、`shenren` 含神量［只计现任成员且对标列传神人高标准］、`influence` 声望，可选 `zones`：`high`、`low`、`null`、`wh`、`pochven`，招新帖写明驻地而 KB 分布看不出时才填）与可选的 `recruitment`（`last_seen`、`source`、帖子里的招新群号 `qq`）。`esi`、`zkb` 与武德由 `npm run corps:snapshot -- <短名…|--all>` 写入，`--esi-only` 不请求 zKillboard；`pilots` 由 `npm run corps:pilots -- <短名…|--qq>` 写入，只查有群号的军团；都不手改。
- 活跃、招新、区域由 `scripts/activity.mjs` 按快照计算，不手写状态。找到更晚的招新帖就更新 `recruitment`，再刷新快照。
- 新军团要进战役页和参战录，在 `src/_data/entityNames.json` 标 `chinese: true`。
- 互链：人物用 `../../p/<角色ID>/`，战役用 `../../battles/<短名>/`。
- 不收的军团记入 `docs/corps-excluded.json` 并写明原因，候选清单不再列出。
- 校验用 `npm run corps -- audit` 与 `npm run corps:check`；成稿按[军团验收](../../docs/corp-review.md)通读，收尾按根目录要求。
