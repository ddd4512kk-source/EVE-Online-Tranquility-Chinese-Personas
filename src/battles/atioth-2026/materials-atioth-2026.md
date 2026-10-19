# 艾蒂斯，桥头堡还没开门，服务器先倒了：素材

标题据帝国桥头堡、凛冬攻堡与CCP记录的节点崩溃拟定。原先total_loss10000B为CCP“近10T”的整数近似；现以官方附带完整BR的9235477547242 ISK（9235.477547242B）替代。39条高值样本7.241T继续作为人物对应来源，不再拿样本当总账。CCP明确10253为同系统人数峰值（maximum population），front matter以 pilots_peak: 10253 单独登记，显示“最高同屏”。

## 完整战报与人数

CCP《Clash at Atioth》文末的 Full Atioth Battlereport 指向 https://killmail.app/br/GxhFDiNEWB-atioth-2026-04-06 （公开接口 https://killmail.app/api/battle-reports/GxhFDiNEWB ）：Atioth 单星系（30002489），UTC 2026-04-06 14:00:00 至 04-08 14:49:27，9901 条不重复 KM，损失 9235477547242 ISK，无分队（side_overrides 为空）。本页结束日期据此延长至 04-08；人物高值样本仍只有 04-07 00:34:15—10:55:13。

另有 br.evetools 战报 https://br.evetools.org/br/69d501e59b9dad00121d4c62 ，只收 6851 条 KM，且都在 killmail.app 那份里，参战角色 9761，损失约 9108B；它带作者分的两队。

两份一起写进 loss_source，快照 br.json 按 KM ID 去重合并：KM 与金额即 killmail.app 全量（12002 角色、9901 条、9235.5B），分队取 br.evetools。参战角色是 KM 上正数角色 ID 的并集，不是自然人数，也不是最高同时在线；后者是 CCP 给的 10253，记为 pilots_peak。

br.evetools 的分队把 TEST、Northern Coalition.、Pandemic Legion 与 Goons 分进同一队，但交火对不上：TEST 打 Goons 297 次、被 Goons 打 502 次，打 FRT 只 59 次；NC 打 Goons 446、打 FRT 61；PL 打 Goons 307、打 FRT 17。三家主要在打 Goons，故在凛冬一方点名。点名与这份分队冲突，按脚本规则不采信该队，没点名的组织按交火推断（以点名联盟为种子，每张 KM 每对组织记一次，至少 3 次且三分之二指向同一方即归其对手，最多四轮），仍看不出倾向的进第三方。这是本场交战聚类，不据此宣称各组织存在永久结盟关系。

Noraus 自述 33 泰坦与约 1T 己方损失只按其说法；不据部分 KM 把全局战略责任归到某 FC。人物按共享表与人物材料核收录主号及已有小号（列传 `alts`），极冰小号 jibing779-G2、慕容旗舰小号 Garveen Doomsday 合并本人。

## 来源与口径

- https://www.eveonline.com/news/view/clash-at-atioth
- https://killmail.app/br/GxhFDiNEWB-atioth-2026-04-06
- https://br.evetools.org/br/69d501e59b9dad00121d4c62

## 已核人物

人物对应复用已归档的 KM；收录状态按当前人物目录核对。军团取战时 KM 或覆盖当日的历史雇佣段，不用当前归属倒推。

| 人物／收录角色 | 参战角色 | 战时联盟 | 军团 | 代表 KM |
| --- | --- | --- | --- | --- |
| 艾若／2114798437 | 2114798437 | Fraternity. | Stardust-Guardian | [134556788](https://zkillboard.com/kill/134556788/) |
| QQT／2112891500 | 2112891500 | Fraternity. | Chi Gua | [134556788](https://zkillboard.com/kill/134556788/) |
| 星星／2114362964 | 2114362964 | Fraternity. | Chaos arbiter | [134564723](https://zkillboard.com/kill/134564723/) |
| 乌鸦王／2113213717 | 2113213717 | Fraternity. | Descendants of Shen Nong | [134558146](https://zkillboard.com/kill/134558146/) |
| 奥托／97259613 | 97259613 | Fraternity. | STARCHASER Inc | [134564723](https://zkillboard.com/kill/134564723/) |
| 小麦／2120434064 | 2120434064 | Fraternity. | Fuxi Legion | [134564876](https://zkillboard.com/kill/134564876/) |
| 袖笼／2122617868 | 2122617868 | Fraternity. | Descendants of Shen Nong | [134556788](https://zkillboard.com/kill/134556788/) |
| 建军／96280212 | 96280212 | Fraternity. | KheshigFleet | [134564723](https://zkillboard.com/kill/134564723/) |
| 厚黑／93252593 | 93252593 | Fraternity. | Light of the moon | [134563816](https://zkillboard.com/kill/134563816/) |
| 汉兰达／2115597604 | 2115597604 | Fraternity. | Arknights. | [134564723](https://zkillboard.com/kill/134564723/) |
| 小绿特／2112612580 | 2112612580 | Fraternity. | Chi Gua | [134564723](https://zkillboard.com/kill/134564723/) |
| 噩梦／2113222901 | 2113222901 | Fraternity. | Arknights. | [134564723](https://zkillboard.com/kill/134564723/) |
| Maria／2114299824 | 2114299824 | Fraternity. | Adrestia Co. | [134563816](https://zkillboard.com/kill/134563816/) |
| 银色汤勺／2114949006 | 2114949006 | Fraternity. | STARCHASER Inc | [134563816](https://zkillboard.com/kill/134563816/) |
| 筱橘／2121532056 | 2121532056 | Fraternity. | Special law enforcement department | [134562370](https://zkillboard.com/kill/134562370/) |
| 瞑衍／2118776119 | 2118776119 | Fraternity. | Fuxi Legion | [134557132](https://zkillboard.com/kill/134557132/) |
| 大黑／2122641476 | 2122641476 | Fraternity. | Red Scarf Humpback | [134556788](https://zkillboard.com/kill/134556788/) |
| 叼爷／1387156123 | 1387156123 | Fraternity. | Fuxi Legion | [134557132](https://zkillboard.com/kill/134557132/) |
| 小妖／2112603797 | 2112603797 | Fraternity. | Navigators' Union | [134562370](https://zkillboard.com/kill/134562370/) |
| 东梧／2113461373 | 2113461373 | Fraternity. | Fuxi Legion | [134564723](https://zkillboard.com/kill/134564723/) |
| 污龟／2113450798 | 2113450798 | Fraternity. | Chi Gua | [134556788](https://zkillboard.com/kill/134556788/) |
| 文华／2113716167 | 2113716167 | Fraternity. | Setcreasea Pallida Corporation | [134562370](https://zkillboard.com/kill/134562370/) |
| 超级大汉堡／2122530222 | 2122530222 | Fraternity. | KheshigFleet | [134564723](https://zkillboard.com/kill/134564723/) |
| 左手／93209504 | 93209504 | Fraternity. | Chi Gua | [134559939](https://zkillboard.com/kill/134559939/) |
| 此方／2122857798 | 2122857798 | Fraternity. | Special law enforcement department | [134562370](https://zkillboard.com/kill/134562370/) |
| 连山／94321893 | 94321893 | Fraternity. | Phoenix City | [134564723](https://zkillboard.com/kill/134564723/) |
| 嗜血／2113483277 | 2113483277 | Fraternity. | Special law enforcement department | [134564723](https://zkillboard.com/kill/134564723/) |
| 老杨／2112979015 | 2112979015 | Fraternity. | Thunders Claw Fleet | [134556788](https://zkillboard.com/kill/134556788/) |
| 艾玛将军／2119837654 | 2119837654 | Fraternity. | Asian Neutral Industries | [134564075](https://zkillboard.com/kill/134564075/) |
| Zark Chastot／2114228690 | 2114228690 | Fraternity. | Noobs Collecttion | [134556788](https://zkillboard.com/kill/134556788/) |
| 极冰／2116540192 | 2118269183 | Fraternity. | 待补 | [134556788](https://zkillboard.com/kill/134556788/) |
| 慕容／2114279817 | 2114883792 | Fraternity. | 待补 | [134566163](https://zkillboard.com/kill/134566163/) |

## 分方统计（快照计算，2026-10-19）

页面数字由 br.json 计算。当时算得：

| 阵营 | 参战角色 | 损失 B | 损失记录条数 |
| --- | --- | --- | --- |
| 凛冬 | 6963 | 1297.1 | 7393 |
| 帝国 | 4980 | 7934.1 | 2423 |
| 第三方 | 59 | 4.3 | 85 |

此前手工交火聚类（同一种子与规则、只用 killmail.app）得 6924／1295.96／7367、4992／7934.29／2414、87／5.23／120，差异来自 TEST、NC、PL 改为点名及两份战报合并。若只照 br.evetools 分队，凛冬只剩 5610 人、1042.3B，帝国 6336 人、8187.7B。

## 本地视频对应（2026-10-20）

本轮仅复用本地缓存的公开元数据、简介与既有素材中已归档的评论；未联网取材，未读取影像、音轨或字幕。下列介绍不包含视听质量评价。

- [【EVE中文】万人会战——凛冬狂怒，帝国之泪下的新世界纪录](https://www.bilibili.com/video/BV1CQDvBwEBN/)：简介明记2026-04-06、艾蒂斯星城上线。简介称全面碾压、关押三支满编舰队，属于作者立场，既有评论与本场素材保存了反驳；不把该说法或10500人数替换为本站统计。
- [【EVE欧服】艾蒂斯超旗战FRT泰坦视角（4K）](https://www.bilibili.com/video/BV1E5DkBrEuh/)：2026-04-08发布，标题与简介指向本轮艾蒂斯超旗战；简介明确录像起点为星城被毁后，不能当作整场完整记录。
- [【EVE】全程录像：艾蒂斯会战，1.1万名玩家参与，创造吉尼斯世界纪录（中字解说）](https://www.bilibili.com/video/BV1SHDBBJEB9/)：2026-04-07发布，标题明确艾蒂斯会战与万人规模；简介注明素材来源。按公开署名保留投稿剪辑与素材来源，不认定投稿者驾驶了录像中的舰船；原题人数是来源表述，不替代本页统计。
- 候选BV1ncD7BVEzj《Atioth | EVE Online》（Murphy_eve）发布于4月8日，但本地简介为空，未读到具体视角介绍，暂不入选。BV1hgX2B2Ede明指3月28日，BV19N9EBgEUm为4月1日前线部署背景，均不作为本轮会战录像。
