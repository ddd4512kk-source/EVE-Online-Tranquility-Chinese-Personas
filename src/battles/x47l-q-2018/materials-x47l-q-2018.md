# X47L-Q，泰坦给星城拆了一层皮：素材

标题据星城装甲计时被推进、未在本场拆毁拟定。ISD新闻记投入约6270人、738泰坦和585超航，损失估计最高10T；论坛可见9T／10T说法不一。

## 口径（2026-10-19 重算）

- 原始KM：EVE Ref 每日全量击杀邮件存档 [2018-08-01](https://data.everef.net/killmails/2018/killmails-2018-08-01.tar.bz2)、[2018-08-02](https://data.everef.net/killmails/2018/killmails-2018-08-02.tar.bz2)，筛 solar_system_id 30001967（X47L-Q），两天共6579张。
- 估值：zKill API `systemID/30001967/year/2018/month/8` 分页取 zkb.totalValue，6579张全部取到值。
- 时间窗：2018-08-01T18:00—08-02T07:00 UTC。首张KM 18:21:28，末张 06:59:42；18点前每小时个位数，07点后每小时回落到五六十张的零星清扫，不计入。窗口内5684张，合计8744.9B，取整8745B。不再是下限（不设 loss_is_lower_bound）；旧版6124B是57张高值KM样本。
- 若取08-01、08-02全天：6579张、8837.6B，分方 4571.7B／4263.8B。
- 人数：窗口内攻击方与受害者角色ID去重共5770；分方并集 2740／2914／117（相加5771，有一个角色两方都出现）。ISD的6270含未上KM者。
- 条数按受害方计，含胶囊（攻方407、守方761、第三方15）与建筑。

| 方 | 角色 | 损失B | KM条数 | 泰坦 | 超航 | 航母／战力辅助 |
| --- | --- | --- | --- | --- | --- | --- |
| 帝国与 Legacy | 2740 | 4486.3 | 2729 | 26 | 17 | 135 |
| 北方联军 | 2914 | 4251.1 | 2869 | 29 | 4 | 189 |
| 第三方 | 117 | 7.5 | 86 | 0 | 0 | 1 |

泰坦26／29与 [TAGN 战后记](https://tagn.wordpress.com/2018/08/02/clash-of-titans-in-x47l-q/) 的27／29基本吻合，可作口径旁证。

## 阵营映射

无BR分队，按交火推断：以 Goonswarm Federation、Northern Coalition.、Fraternity. 为种子，统计各组织对两方的开火与被开火次数，偏向一方1.5倍以上即归对方之敌，迭代6轮。Fraternity. 窗口内仅十个上下号，交火不足以推断，按FRT与NC.同盟人工归北方。

- 帝国与 Legacy（按人数）：Goonswarm Federation 1704、The Initiative. 281、Test Alliance Please Ignore 262、The Bastion 164、Tactical Narcotics Team 127、Initiative Mercenaries 102、Get Off My Lawn 44，另有 Federation Uprising、Brave Collective 等零星。
- 北方联军：Pandemic Horde 752、Northern Coalition. 720、DARKNESS. 309、Circle-Of-Two 249、Solyaris Chtonium 181、Mercenary Coalition 178、ChaosTheory. 105、Pandemic Legion 102、French ConneXion. 69、Ranger Regiment 66、Siberian Squads 39、Caladrius Alliance 28 等。
- 第三方：Snuffed Out 71，另有零星小组织。

## 名场面KM

- [71597946](https://zkillboard.com/kill/71597946/)：2018-08-01 19:22，征服者，Hal Drogo（Kenshin.／DARKNESS.），726.2B，全场最贵。
- [71605015](https://zkillboard.com/kill/71605015/)：08-02 01:02，摩洛克，r0nnie Kray（Shadow State／Goonswarm Federation），558.3B。
- 其后为攻方两条仇恨级（Vendetta）各约132B、一条神使级约104B。

## 华人军团（窗口内去重角色数）

据ESI简介确认为中文军团。

- 帝国与 Legacy：Peoples Liberation Army 17（P.L.A，2013-03建，简介“欧服小蜜蜂”）、NINE Continent 13（NC-T，九州）、Country House 8（CHOUS）、Eternity Pavilion 3（EN-PL，TEST）。
- 北方：Sing Hua 26、Tai-Chi 18、Special law enforcement department 14、North Eastern Swat 7（拉面林战时军团，PL）、Beng beng Begn 4、Knavish Knight Kingdom 3（PH中文公司）、Electronic Industry Club 3、Rainbow Pegasus Squadron 3、Sacred Order Empire 3、B.O.P Supplication For Glorious 2、Hongqi 1、T.P.C Central Committee 1、Firmiana Platanifolia 1、Jian Sheng 1、Formosa Research Center 1、Fuxi Legion 1。
- Ranger Regiment 名下另有 Ranger Warrior 3、Unfied Intelligence Taskforce 1，简介无中文，未列。哥布林战时军团 A Blessed Bean（PH，247人）是西方新人团，未列入华人军团。
- Ranger Regiment 窗口内损失40张、21.6B，最贵为凤凰 [71603530](https://zkillboard.com/kill/71603530/) 2.9B、神示 [71604128](https://zkillboard.com/kill/71604128/) 2.3B。Fraternity. 损失8张、0.2B。

## 已核人物

用全站收录号与 `alts` 比对窗口内KM，共5人，全在北方。九州的方小明（2113415433）2018-08-03才入团，不在本场。

| 人物／收录角色 | 战时联盟 | 军团 | 船与KM | 代表 KM |
| --- | --- | --- | --- | --- |
| 哥布林／342545170 | Pandemic Horde | A Blessed Bean | 仅作受害者：惩罚者 08-02 03:22、胶囊 04:21 | [71607660](https://zkillboard.com/kill/71607660/)、[71608666](https://zkillboard.com/kill/71608666/) |
| 令狐聪／624049117 | Fraternity. | Jian Sheng | 35张；短剑22、胶囊5、审判者6；丢短剑2条 | [71608136](https://zkillboard.com/kill/71608136/)、[71604407](https://zkillboard.com/kill/71604407/) |
| 拉面林／91309503 | Pandemic Legion | North Eastern Swat | 希尔博拉斯2张 | [71603265](https://zkillboard.com/kill/71603265/) |
| 嗜血／2113483277 | Ranger Regiment | Special law enforcement department | 黑鸟7张，末张 08-02 05:51 | [71611021](https://zkillboard.com/kill/71611021/) |
| 储葛亮／96170679 | Northern Coalition. | Tai-Chi | 万王宝座10张 | [71602801](https://zkillboard.com/kill/71602801/) |

## 原始复盘及旧BR入口

- [ISD 战地报道](https://community.eveonline.com/news/news-channels/interstellar-correspondents/battle-of-x47l-q-120-08-01/)：全文叙事来源。
- [Clash of Titans in X47L-Q，2018-08-02](https://tagn.wordpress.com/2018/08/02/clash-of-titans-in-x47l-q/)：作者驾驶无畏参战，后记泰坦损失攻方27、守方29。
- [INN战后24小时复盘，2018-08-03](https://imperium.news/x47l-q-keepstar-fight-24-hours-later/)：2.6T（帝国）／1.6T（北方）是zKB跟不上时的阶段战报，随后仍有泰坦被毁，不作终值。197／229、286／252为当时在场泰坦数。旧BR：https://br.inyour.space/?s=1967&b=8195880&e=690&t=urqarrvvvvvvvvvvvvvvvvvvvvvvvvb
- [Talking in Stations当期页面](https://www.talkinginstations.com/2018/08/tis-08-05-18-imperium-strikes-nc-in-x47l-q/)：只读公开文字，未读音频。其旧BR现无法恢复。
- br.evetools related 在 08-01 20:00、23:00 及 08-02 02:00、05:00 四入口均返回空KM列表，无法做快照战役。

不把8月8日星城最终拆毁一战并入本页；同月08-08单日X47L-Q有3570张KM，可另立页。

## 本地视频对应（2026-10-22）

本轮仅按本地B站档案（`docs/bilibili/`）中的标题、投稿日与简介，以及YouTube搜索页公开的标题与频道名对应本场；未读取影像、音轨或字幕，介绍只转述标题与简介。

- [[EVE] 黑渊星城决战 BL无畏外围捕鱼泰坦大航](https://www.bilibili.com/video/BV1is41137wB/)：标题指黑渊星城决战（黑渊即X47L-Q），投稿日2018-08-03。
- [EVE Online - At The Gates of Oblivion - The X47L-Q armour Keepstar timer](https://www.youtube.com/watch?v=ZO4AiS6g-LU)：YouTube标题指名X47L-Q装甲计时。
