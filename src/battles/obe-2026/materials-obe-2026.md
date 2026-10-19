# 欧贝钓出三百泰坦（Obe，2026-10-10）素材

- 标题：Obe 中文作欧贝；回目取 Snuff 摆征服者作饵、钓上 FRT 及友军三百来条泰坦（见口径与正文开篇）。

## 口径

- 总损失、人数、分组：WarBeacon 战报 <https://warbeacon.net/br/report/cd8b4c3e-5e83-46ad-a424-382b5fdd134a#stats>，快照存于 `src/people/remeleen/warbeacon-obe-2026-10-10.json.gz`（`data.teams`、`teamsMetadata`、`killmails`）。
  - 全场 3312 角色，约 6.64T（6643B）。
  - 组 0（FRT 及友军）：2255 角色，损失 378 艘，1309.6B。联盟出场角色数：Fraternity. 1653、Northern Coalition. 152、TEST 72、PL 69、Fraternity Auxiliary 52、Goonswarm Federation 34、Solyaris Chtonium 31、Synergy of Steel 13，余为个位数。
  - 组 1（Snuffed Out 及友军）：802 角色，损失 675 艘，5316.0B。Snuffed Out 451、Dracarys. 35、Wings Freedom. 13、Invidia Gloriae Comes 11、Weapons Of Mass Production. 6、People's Liberation Alliance 6、Fairy Express Commercial Union 6；另有若干 NPC 军团与小军团。
  - 组 2（INIT）：255 角色（The Initiative. 247），损失 105 艘，17.9B。
- 本页阵营与原报的差别：
  - INIT（组 2）本场属 Snuff 一方，并入“Snuffed Out 及友军”：802 + 255 = 1057 角色，5316.0 + 17.9 = 5333.9B，损失 675 + 105 = 780 艘。
  - Goons 原报放在组 0，本场实为两头都打的第三方，拆出来与卡戎合为“第三方”一组（没有明确倾向的第三方合为一组）。
  - 依据：快照里 Goons 的 51 次损失，攻击者记录中 Fraternity. 224 次、TEST 31、Solyaris Chtonium 18、NC. 16、PL 9，Snuffed Out 只有 5 次；Goons 参与的 KM 既有征服者（139046684，GoonWaffe 等 4 人）和 Snuff 两条泰坦（139047530 约 152.0B、139047358 约 147.4B），也有 FRT 系的执法队、Foredawn、Glory Navy、FA 等小船。
  - Goons：47 角色（与 WarBeacon `topFactions` 的 47 一致；`teams` 计数为 34），损失 51 艘，约 4.914B。
  - FRT 及友军改为 2255 − 47 = 2208 角色，1309.598 − 4.914 ≈ 1304.7B，损失 378 − 51 = 327 艘。
  - 第三方：Goons 47 + 卡戎 1 = 48 角色，约 4.9B。卡戎不在原报三组内，全场总数仍按原报 3312、6643B，三方人数相加为 3313。

## 收录人物的归组方法

- 用全部收录角色 ID（含 `aliases` 已对应的小号）逐张比对快照 KM 的受害者与攻击者，按所在联盟／军团映射到原报分组。
- 收录号直接命中 50 位，另经小号命中瞑衍（2118776119）、云曦（2122641296）、冷剑；本页 `sides.people` 共 53 人（FRT 44、Snuff 及友军 6〔含 INIT 的 bink〕、第三方 3）。
- 第三方（Goons）：小洋（2114834014）寡妇、青春（2114969276）救世，同在 Peoples Liberation Army，与 GoonWaffe 等成员同队参与击杀 FRT 系小船：KM 139048117（执法队，约 0.24B）、139048107（执法队，约 0.41B）、139048096（Glory Navy，约 0.23B）、139048088（执法队，约 0.40B）、139047952（Foredawn，约 0.32B）、139047828（FA，约 0.74B）；青春另见 139049549（Weapons Of Mass Production.）、139047976（PL）。
- PLA 本场损失 25 艘，合计约 0.48B，单条最高约 0.21B；super blackman、autofei time1 各 4 次。
- 小洋在 PLA 群里曾把“init frt osy 深水”称为可能联手背刺帝国的敌人（见本人列传“预防背刺”）。
- 原报未分组的两人：
  - 冷剑（homura-hikari）：归 FRT 及友军。KM 139048623（受害者 Dracarys.，约 5.89B）上以小号 HikariHomura 驾驶阿扎里尔，与执法队、混沌、伏羲等 FRT 系成员同列攻击者；小号当时在军团 AKINA mountain family、联盟 Average camping enjoyer，该小号军团不列入 `corps`。
  - 卡戎（mordiggianking）：归第三方。唯一一张 KM 139049410（12:15 UTC，约 0.013B）上是受害者，军团 Red Caribbean skull 不挂联盟，攻击者为 Tr0pa de elite.、You Are Painted 两家无联盟军团，不属原报任何一组。
- 汉堡（hanbo-han）主号丢伏波斯（KM 139046920）、小号 never left 开海军神示；均在组 1。
- 少侠（l-nex）主号 L-Nex 神示级海军型、小号 L-Zarek 俄洛巴斯（KM 139046897，约 149.7B）；均在组 1。
- 折纸（cheryl-astelir）主号执政官、小号 Fujed Cericy 勒维亚坦（KM 139047145，10:32 UTC，约 149.38B）；均在组 1。

## 华人军团

- 取法：收录人物在本场 KM 上所属的军团，即视为参战华人军团；人数为该军团在本场快照 KM 上出现的不同角色数（不是军团总人数）。没有收录人物的华人军团暂未列入，待以后按军团名单补查。
- 组 0：Chaos arbiter 231、Special law enforcement department 172、Fuxi Legion 116、Stardust-Guardian 89、Arknights. 74、STARCHASER Inc 67、Chi Gua 40、Descendants of Shen Nong 40、YeLuo-XingHai 39、Foredawn Business Corporation 30、Fox of Resistance 27、KheshigFleet 21、Nuwa Foundation 18、Beng beng Begn 11、Advanced Weapon Supplement League 7。
- Snuff 及友军：Infinity Avenger 61（sayler、方小明、汉堡）、The Skies Descend 56（少侠、折纸）、Alkaid Broken Army 5（bink，INIT）。
- 第三方：Peoples Liberation Army 15（小洋、青春，Goons）、Red Caribbean skull 1（卡戎）。

## 叙事料

- 起因：云曦视频[《值得载入EVE历史的一天——Obe战役》](https://www.bilibili.com/video/BV1nip36oEnr/)置顶。Snuff 备征服者诱敌，以为对面会进无畏或少量泰坦，撞上玩家多有空的时段，十多分钟整备出三百多条泰坦。回复里 D哥哥懊恼错过，云曦说自己看到消息“百米冲刺”回去开电脑。此为一方说法。
- 征服者：KM 139046684，约 766B。
- 费娜希雅：KM 上九条泰坦（神使 1、俄洛巴斯 5、勒维亚坦 2、拉格纳洛克 1），约 1.35T，苦主多为 Snuff。
- 动员：拉面林“Fleet 1 mumble WC 乌鸦 无畏小号”“MAX 泰坦 大航 全旗帜…”；嗜血“简易的舰队 泰坦队 FLEET 02”。详见 `src/people/remeleen/materials-remeleen.md`、`src/people/trumps-bloodthirst-feynman/`。
- 带队：战歌、此方、猫娘（各本人列传与素材）。
- 兔斯基简介挂征服者 KM，配“帝国可以在一瞬间倒下”。
- 瑾 KM 安等 1.0 → 0.9，两天后 CUT-0V 为 -0.5（本人列传）。

## 待补

- 各方泰坦／超旗损失数未统计，可从快照按船型汇总后写入 `sides.note`。
- 没有收录人物的华人军团（组 1 的 Dracarys. 内华人团等）尚未逐团排查。

## 分方损失计数（2026-10-19）

沿上文已归档计数：FRT 及友军 327 条、Snuff 及友军 780 条；第三方 Goons 51 条加卡戎 1 条，共 52 条。计数指损失记录，可含胶囊，不改称纯船体。三方合计 1159 条，卡戎原不在原报三组中；金额与全场人数仍保留既有来源口径。

## 本地视频对应（2026-10-20）

本轮仅复用本地缓存的公开元数据、简介与既有素材中已归档的评论；未联网取材，未读取影像、音轨或字幕。下列介绍不包含视听质量评价。

- [值得载入EVE历史的一天——Obe战役](https://www.bilibili.com/video/BV1nip36oEnr/)：投稿日期为2026-10-10；标题指名Obe，置顶讲Snuff征服者诱饵与FRT泰坦集结，与本场相符。已归档的置顶及评论见云曦素材，介绍沿用作者说法。
- 待补候选：Zero煌BV1LCpu65EC7、曼努尔BV1PNpg6FEHH在既有材料中指向10月10日欧贝交战；本轮未找到可完整复用的标题、简介与具体内容记录，暂不补入。
