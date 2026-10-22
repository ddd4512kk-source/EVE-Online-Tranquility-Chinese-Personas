# 艾萨凯，一条泰坦误跳，三千人赶来结账：素材

战日 2013-01-27 UTC，低安 Asakai（30045332，ESI 中文名“艾萨凯”）。

## 文字来源

- [CCP Manifest，A Weekend of Epic Destruction in EVE Online](https://www.eveonline.com/news/view/a-weekend-of-epic-destruction-in-eve-online)，2013-01-29：泰坦飞行员原想把舰队送去插手两支小舰队的交火，却把自己送进了低安的敌方位置；增援与外交协调随后让战斗升级。
- [CCP Quant，The Battle of Asakai and Poinen Must Burn by the numbers](https://www.eveonline.com/news/view/the-battle-of-asakai-and-poinen-must-burn-by-the-numbers)，2013-01-29：服务器日志统计被毁舰船价值 717,033,768,274 ISK（717.03B）；3 条泰坦、7 条超级航母、36 条航母、53 条无畏、845 艘常规舰。同一时刻本地峰值 2754；时间膨胀压到 10%；节点事前未加强。伤害分析重点时段 02:00—08:00。
- [The Mittani，Sins of a Solar Spymaster #86: The Asakai Meltdown](https://www.tentonhammer.com/columns/sins-of-a-solar-spymaster-86-the-asakai-meltdown)，2013-02-05，CFC 领袖署名的败方复盘：原计划涉及 Black Rise 一座退出强化的 POS；情报没核到当地势力与 PL 的旧交，行动沟通范围又窄；Dabigredboat 误跳了自己的 Leviathan，向 CFC 广播求援；低安不能开拦截泡，抓超旗要靠重拦，CFC 准备不足；敌方集结的情报不断传来，仍未及时撤退。作者认为当初放弃那条泰坦，损失可控制在 90B；后文点名一条 Ragnarok 及另两条泰坦与超航损失，没有把原误跳的 Leviathan 对应到哪张 KM。
- [Destructoid 同期新闻](https://www.destructoid.com/one-pilots-mistake-leads-to-massive-battle-in-eve-online/)，2013-01-30：CFC 救援、PL／HBC 动员及各组织加入的经过；转引社区汇总 3161 名玩家、262 个联盟、715 个军团。
- [PC Gamer](https://www.pcgamer.com/eve-online-battle-asakai/)与[维基百科](https://en.wikipedia.org/wiki/Battle_of_Asakai)：对阵为 CFC 与 HoneyBadger Coalition（HBC，TEST 领头，PL 在其中）；维基记 CFC 一方损失 3 泰坦、5 超航、29 航母，另一方 1 超航、11 航母、6 无畏。
- [EVE-KILL 当前聚合 95752](https://eve-kill.com/battle/95752)：窗口 01:45—10:05，2793 角色、1062 艘船，按现价约 3.00T（两队约 2.77T／230.22B），与 CCP 同期 717B 口径不同，金额不采用。

## 公开 KM 重算（2026-10-22）

原始数据为 EVE Ref [2013-01-27 日包](https://data.everef.net/killmails/2013/killmails-2013-01-27.tar.bz2)（全日 37095 张，正文来自 CCP ESI），下载后离线读取。取 Asakai、01:45—10:05 UTC，共 1062 张 KM、3063 个去重角色（受害者与攻击者 character_id 并集）。存档不含 ISK 金额，分方金额保持空缺；全场金额用 CCP 717.03B。

分方种子：Goonswarm Federation 归 CFC；Test Alliance Please Ignore、Pandemic Legion、Northern Coalition.、Pangu Coalition 归 HBC；Tactical Narcotics Team（131511956）当时是 CFC 成员，归 CFC。未点名组织先按每张 KM 每对组织计一次交火，至少 3 次、三分之二以上冲着某方即归对面，最多 4 轮；再按旗舰伤害复核：组织在无畏、航母及以上 KM 上造成的 damage_done 合计至少 1000、且对一方的伤害达另一方两倍以上，即归该方的对面，17 个组织因此改归。

| 阵营 | 去重角色 | 损失记录 |
| --- | ---: | ---: |
| CFC及友军 | 1014 | 519 |
| HBC：TEST、PL及友军 | 1910 | 427 |
| 第三方 | 139 | 116 |

主要组织（至少 10 名角色，按角色数）：

- CFC：Goonswarm Federation 264 角色／67 损失，Fatal Ascension 106／30，RAZOR Alliance 94／16，Fidelas Constans 79／16，Get Off My Lawn 63／8，Gentlemen's Agreement 58／18，SpaceMonkey's Alliance 57／7，Tactical Narcotics Team 47／2，Liandri Covenant 33／71。
- HBC：Test Alliance Please Ignore 518／53，Pandemic Legion 198／15，Tribal Band 111／10，Black Legion. 105／13，Northern Coalition. 90／17，Scrap Iron Flotilla. 51／2，Nulli Secunda 46／9，The Initiative. 21／6，Pangu Coalition 16／5，另有二十余个小联盟。
- 第三方：Ishuk-Raata Enforcement Directive 15，Sev3rance 10，其余均不足 10 人。

旗舰伤害核对：Tactical Narcotics Team 在 CFC 目标上的 KM 署名多于 HBC（51 对 16），但对 HBC 旗舰造成约 60.6 万伤害（PL 的 Nyx 28070344 一张 12.3 万，PL、NC. 的航母数张各数万），对 CFC 旗舰合计约 8.7 万，多为每张几百点的署名；Liandri Covenant 对 HBC 旗舰约 21.2 万、对 CFC 旗舰不足一千。两者均归 CFC。Liandri 的旗舰伤害几乎全来自 09:54 一张 Nulli Secunda 的 Archon（28081162，约 21.0 万）；其余时段对两方旗舰都只有几十到一千多点。该联盟角色全部挂 Caldari 民兵（faction 500001），71 条损失中 57 条的主要伤害来自 HBC、14 条来自 CFC。

zKillboard [related 06:00—09:00 窗口](https://zkillboard.com/related/30045332/201301270700/)（2026-10-22 读取）自动分队：Team A 1619 人，含 Test Alliance Please Ignore、Pangu Coalition、Liandri Covenant；Team B 782 人，含 Goonswarm Federation、Tactical Narcotics Team。TNT 与 Goonswarm 同队，与旗舰伤害结论一致；Liandri 的归队与旗舰伤害结论相反，以旗舰伤害为准，归 CFC。

## 分方金额估算

zKillboard 逐张 KM 的 totalValue 按现价估值（API 取 1062 张，无缺）：全场 2683.1B，为 CCP 同期 717.03B 的约 3.7 倍；三条泰坦各约 374—389B，七条超航各约 172—175B。按本页归方，现价合计 CFC 2447.5B、HBC 233.0B、第三方 2.6B。页面各方金额按此占比摊分 CCP 的 717.03B：CFC 654.07B、HBC 62.27B、第三方 0.69B。旗舰涨价幅度大于小船，CFC 一方的摊分偏高。

核对：TEST 对 CFC 目标开火 82 次、对 HBC 目标 2 次，与 PC Gamer、维基所记 TEST 领头 HBC 一致。

旗舰损失（存档与 CCP 的 3 泰坦、7 超航相合）：

- 泰坦：28071656 Ragnarok，03:21，Bad Poison（CONDI），339 名攻击者；28073252 Leviathan，04:23，Oleena Natiras（CONDI），415 名攻击者；28076566 Avatar，06:36，Shakar（RAZOR），954 名攻击者，最后一击 Black Legion.。
- 超航：Hel 28069880（02:17，Nimrodel，CONDI）、Nyx 28073528（Lhey，CONDI）、Nyx 28073658（Ilsea，CONDI）、Nyx 28073938（Grybeard，FCON）、Wyvern 28074522（Famine Fatale，FA）、Aeon 28075058（05:33，Mr McNasty，CONDI，1070 名攻击者）；HBC 一方 Nyx 28070344（02:34，Manjulia，PL）。

## 华人军团与人物

Pangu Coalition（99002084）全窗口 16 个角色、出现在 15 张 KM 上；名称表标记的华人军团 Light of the moon（1097611545）4 角色、Thunders Claw Fleet（98108175）2 角色。

- [Water Brother](../../src/people/water-brother/water-brother.md)（91282906，Thunders Claw Fleet）：Stiletto，上了 Aeon 28075058 与 Avatar 28076566 两张 KM。
- [D manson](../../src/people/d-manson/d-manson.md)（690534767，Thunders Claw Fleet）：Ibis，上了 Avatar 28076566。
- [Wind Spirits](../../src/people/wind-spirits/wind-spirits.md)（1901851878，Requiem of Hades）：Republic Fleet Firetail，上了 Avatar 28076566。
- [roseattack](../../src/people/roseattack/roseattack.md)（224870524，Requiem of Hades）：Manticore，上了 Avatar 28076566。
- 盘古本窗口 5 条损失：28075762 Velator（06:04）、28076123 Ibis（06:19）、28076295 Nemesis（06:26，Requiem of Hades）、28076822 Hound（06:45，Light of the moon）、28078230 Velator（07:31）。

Alasker（848736312，0utLaw.／Northern Coalition.）在窗口内有记录（含 [KM28071325](https://eve-kill.com/kill/28071325) 03:09 Thanatos 损失），该 ID 与大林当前主号相同；大林 CSM17 自述 2009 晨曦入坑、2017 来宁静，未列入本场人物。

The Mittani（443630591）在窗口内无 KM 记录。

## 本地视频对应（2026-10-22）

- [EVE ONLINE  Battle of Asakai](https://www.bilibili.com/video/BV1hx411H7mc/)：Dmanson（UID 2874813）2017-08-02 投稿，18:46，播放约 1264。简介（频道列表缓存）：“这是一个纪念意义的老视频。欧服低安Asakai会战，事出goons与tri正在转移TT，不巧一艘TT在转移中被抓住了，引来了PL的cyno小号，然后整个宇宙都知道这里发生了啥；瞬间15分钟集结2700人峰值。拉开了EVE历史上旗舰规模第二的一场战斗，简称ASAKAI之战。goons为首的CFC联盟群损失3条TT、44条无畏、5艘大航、29艘航母；对阵的HBC联盟群损失1条大航，6条无畏和10条航母”。作品页未读。
- EVE老头乐（UID 31544583）《EVE-艾萨凯遭遇战实录》BV174bHzjEvu，2025-08-15 投稿，仅标题，未对应本场。
- 白杉《爆肝长文：EVE万人宇宙大战为何会爆发？<1>》[BV1o14y1v7tK](https://www.bilibili.com/video/BV1o14y1v7tK/)：作者在评论里说明引用了 Asakai 录像；主题为 B-R5RB 前史，未收入本页。
