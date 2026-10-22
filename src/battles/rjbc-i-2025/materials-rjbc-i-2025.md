# RJBC-I 自由港末战材料

## 事件与来源边界

- 战报：br.evetools `6924cac37c65360013f7f59a`，本地原始 API 回包 `/tmp/eve-battle-next/6924cac37c65360013f7f59a.json`；正式精简快照由 `scripts/battle-report.mjs` 的 `buildSnapshot` / `stringifySnapshot` 生成，归档为 `rjbc-i-2025.json` 的 `br`，生成原件备份 `/tmp/eve-battle-next/rjbc-i-2025-rjbc-i-2025.json的br`。
- 2025-11-14 Reddit 帖 [`The last stand - 2025.11.17 02:14:15`](https://www.reddit.com/r/Eve/comments/1ox5bng/)：帖子称 RJBC-I 自由港星城的强化计时在 2025-11-17 02:14:15 UTC 结束；称 Imperium 提前到场，并说若守方损失旗舰，将在次日获补一艘海军莫洛，数量受库存限制。帖子与评论原文及元数据保存在 `/tmp/eve-battle-next/rjbc-1ox5bng.json`、可读文本 `/tmp/eve-battle-next/rjbc-1ox5bng-read.txt`。
- 2025-11-11 Reddit 帖 [`We Shall Have That Brawl...22 November`](https://www.reddit.com/r/Eve/comments/1ougv1o/) 是原定 11 月 22 日 20:00 EVE 时间的约战预告；称自由港对 Imperium 以外开放，并宣称储备 220 艘海军莫洛，旗舰损失可依库存补船。它只证明预告与承诺，不证明兑现或库存规模经独立核验。原帖另明确这220艘船体位于帝国区资产安全处，守方没有足够流动ISK一口气赎回；拟以交换合同让接船者承担赎船费，并估计旧舰保险款大约够用。此为承诺机制与资金约束，不写成免费现船已发。回包、可读文本分别存于 `/tmp/eve-battle-next/rjbc-1ougv1o.json`、`/tmp/eve-battle-next/rjbc-1ougv1o-read.txt`。
- EVE Online 论坛战报帖第 68 楼于 2025-11-24 发布，只链接本场 Final Stand 战报及视频，没有可供核验的书面战后叙述；第 69–70 楼文字谈到 Defiant Few 重建与索取录像。仅读了帖子文字和评论，没有打开或读取视频、字幕、音频或转录。抓取页面回包留在 `/tmp/eve-battle-next/forum-483151-68.json`。

## 快照窗口与总数

- 星系：RJBC-I，星系 ID 30003260。
- 战报报告窗口：2025-11-17 01:00–04:00 UTC；实际快照击杀从 01:08:42 到 02:42:14 UTC。战报中 75 个不同 KM，按 KM ID 去重后损失合计 231,858,357,271 ISK（231.858357271B），173 个角色。快照金额与 BR 页面总损失吻合。
- Keepstar KM `131285241` 于 02:42:14 UTC 记录，受害方为 The Industrial Supremacy（corp 98791891），联盟 99014521 Autonomous Droneland Collective；估值 229,698,913,243 ISK。由该建筑 KM 可确认自由港星城被击毁。损失占全场约 99.1%。
- 受害船只中没有旗舰船体记录；因此本场战报不能证明海军莫洛补船承诺实际触发或已有支付，也不能用战报证明 220 艘库存真实存在。全体星城武器/攻击记录不等于有大量个人船体损失。
- 评论里“Caracals fighting the Nyxes”有 KM 支持：KM `131284949`（02:21:37 UTC）是一艘 STAYD/ACD Caracal 被击毁，攻击名单含 Goonswarm Nyx 与 Aeon。作为战场笑谈可用，不应夸大成整场主要战况。

## 实际阵营与快照统计

BR 没有预分队，故按 front matter 点名联盟后依仓库规则，以组织交火关系归属未点名者；阵营判断也参考 11 月 14 日参战方帖子明确称 Imperium 提前到场、以及星城受害联盟归守方。Shadow Cartel（`495729389`）18 名参战角色的交火指向守方：对 Goonswarm 的交火计 36 次、对 STAYD 计 13 次，达到仓库的三分之二归方阈值，故明确列入守方以便页面显示。阵营种子：

| 阵营 | 种子 | 统计 |
| --- | --- | --- |
| STAYD / Autonomous Droneland Collective 与 SHDWC / Shadow Cartel 守方 | alliances `99014521`, `495729389` | 31 人；231.246728594B；60 条受害 KM |
| Imperium / Goonswarm Federation 攻方 | alliance `1354830081` | 140 人；0.611628677B；15 条受害 KM |
| 未归方第三方 | 交火规则剩余 | 2 人；0 ISK；0 条受害 KM |

全场合计 173 人、231.858357271B、75 条 KM。按名称表当前标记，守方华人军团 Late night poets (`98710383`) 4 人，攻方 Peoples Liberation Army / PLA (`98190062`) 4 人。快照角色身份只证明这些军团在相应一方参战，不代表现实身份判断。

## 已收录人物与身份边界

- 小洋，角色 `2114834014`，已收录于 `src/people/6666666-6/`。快照显示其军团 Peoples Liberation Army、联盟 Goonswarm Federation，属攻方；在 KM `131285111` 受害记录中损失的是 Velator（type `606`），估值约 1,809 ISK，不是胶囊。该角色也出现在星城攻击 KM 中。原始类型查表在 `/tmp/eve-battle-next/rjbc-type-names.json`。
- `Blooming hope`（角色 `2113244892`）驾驶 Keres（type `11178`），快照组织为 De Vliegende Hollander（DVH，corp `98749162`）/ Dracarys.（DC，alliance `99009163`），在 7 条星城相关攻击 KM 上出现，包括最终 Keepstar KM。它是攻方参与证据；未确认可映射到已收录自然人，也不得仅凭 DC/DVH 军团身份推断其现实国籍。当前 `entityNames.json` 中 DVH corp 条目没有 `chinese: true`；Late night poets 与 PLA 才有该标记。

## 本地研究文件

- 正式快照：`src/battles/rjbc-i-2025/rjbc-i-2025.json的br`
- 完整战报 API 原文：`/tmp/eve-battle-next/6924cac37c65360013f7f59a.json`
- 正式快照生成副本：`/tmp/eve-battle-next/rjbc-i-2025-rjbc-i-2025.json的br`
- ESI 组织及船型查询回包：`/tmp/eve-battle-next/rjbc-entity-names.json`、`/tmp/eve-battle-next/rjbc-type-names.json`、`/tmp/eve-battle-next/rjbc-attacker-types.json`
