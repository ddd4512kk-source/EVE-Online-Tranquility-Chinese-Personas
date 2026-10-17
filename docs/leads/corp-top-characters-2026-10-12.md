# 前50军团成员榜反查（2026-10-12）

当前收录状态见[待撰备忘录](../pending-characters.md)与各人素材；下文取得、核读范围保留，旧成文记录不代表当前仍收录。

## 范围与实际覆盖

名单沿用[九月前50军团](top50-corp-ceos-2026-10-11.md)。本轮在共享冷却结束后补齐余下46家历史榜：**50家all-time人物榜均已取得，共4996条历史名次记录**；49家各前100，Deadspace Spearhead返回96个角色，不把返回不足100记成分页失败。另保存接口近期榜490条，范围不是九月。

合计5486条榜单记录，去重4834个角色；全部名字已经ESI批量解析，按当前收录号、aliases及明确同人素材对照。247个不同角色在TSV明确标为已对应当前列传（对应319条榜单记录），4587个未标为已对应当前列传；这些是角色数，不是去重后真人数。名字对照不等于个人调查完成，逐人结果见[清单](corp-top-characters-2026-10-12.tsv)。

**首次HTTP批次九月monthly为0/50**：确认公开源码支持`/corporation/<ID>/top/year/2026/month/9/`后，第一张混沌页面即HTTP403；立即停止本轮zKillboard全部请求，没有切换出口、镜像或接口继续取同一数据。此次403不影响此前已经取完的历史响应，但月榜和后续Monitor查询仍有缺口。

历史榜使用统计响应`topAllTime`的character子榜；按返回顺序保留击杀数排名与其军团范围内的参与击杀价值。历史榜不是现役名册，不证明当前军团或管理／指挥职责；不同军团、主小号统计均不直接相加。`topLists`角色榜单独标为`recent`，不冒充2026-09。

口径依据：[API实体统计文档](https://zkillboard.com/api/docs/)；[公开页面控制器](https://github.com/zKillboard/zKillboard/blob/master/view/overview.php)的top分支设角色榜limit=100，并读取year、month。只核对路线，不以源码替代实际月榜数据。

本轮明确续查50团历史榜与九月榜，联网总上限140次，个体核对首批10名；另补已收录人物的3个近名小号与莫凡3条原始KM。历史缺口46请求、月榜1次即403；其余请求为ESI批量认名、角色／KM核对、源码口径与新人物快照。没有继续获取被拦站点的个人KB或Monitor。

后续系统Chrome缓存已取得50家2026-09角色榜；本轮按缓存URL、页面标题及榜单结构回填取得状态。历史TSV仍保留all-time／recent口径，不把月榜条数掺入历史统计；取得页面不等于逐人故事调查完成。 月榜4403行已另存[正式名单](corp-monthly-characters-2026-09.tsv)，保留返回的全部名次、角色ID、名字与击杀条数，前十以外也可续查，不依赖临时缓存。


## 当前续查重点

大团逐人核读范围扩至前50，优先读取公开头衔、完整简介中的中文称呼、职责和角色互链，再对照已有列传与同人材料。历史榜与月榜各自保留，不混合排名；头衔取得、身份对应和故事入文分别记录。个人船型统计降为有具体指挥或战役线索时的辅助核对，不作为人人必跑项目。

AOM历史人物先沿[2021年9月前100固定名单](aom-monthly-2021-09.md)核读前50的身份线索，海哥哥仍需角色对应桥；不把某个单月的缺席当排除。

## 50团覆盖清单

这是本轮50团成员榜的主 ledger。**榜单取得**与**逐人核读**分栏维护；身份对应不等于已找到故事或已入文。

- 50家历史榜与九月榜均已取得，正式名单保留全部返回名次；不是只存前十。
- 混沌、PLA、伏羲、特执、昆仑、创世、KZU、星尘、瑶光、宽带山、帝皇之镰、Dusk、BOP、Fox、叶落星海、红楼、图万神殿、吃瓜、咸鱼、神农：历史榜前50的头衔／简介已核读。
- 采星者与PLA Fleet前50各已读49份名片，分别第33、37名ESI404缺头衔／简介；吃瓜前50、神农前50、Family Guy前50已读；LP两人及创建者兼CEO Cyan nomi已成文，Cosmic-Wanderers前50已读，核弹、花花已成文；GECL前50已读、daoyan yin成文；创世学院前50已读、白给大师补四号，Navigators Union前50已读、老实成文、小妖补newcat；兔飞前50已读、京介颂词补身份；Faceless前50已读49份、第24名ESI404；Dawn’s LightP前50已读，白凝七号归组；Attack On CALDARI前20已读，夜灵按自报FC成文，续21—30；两B站实际最多排序与合集目录已核，操作者待对应，教程评论补王答答／台风，银光／建军互相提名已归档；Fox其他候选继续补教学、赞助与人物事件；其余军团显示实际已登记名次，未核定连续范围的不冒称前十或前50完成。
- 月榜个人调查与历史榜另分范围；本栏不把历史榜前50核读改称九月前50完成。AOM另用[2021年9月ledger](aom-monthly-2021-09.md)，前100名单已存、前50名片已核读。

表中“有名片记录”仅表示正式TSV有头衔／简介核读记录；空头衔已读也计入，已有列传但未登记名片的号不自动计入。逐号的成文、待核身份和待补故事见[正式清单](corp-top-characters-2026-10-12.tsv)所指原队列／人物素材。


| 九月名次 | 军团 / ID | all-time角色榜取得 | 九月monthly角色榜取得 | 历史榜个人核读范围 / 下一步 | 身份对应进度 |
| --- | --- | --- | --- | --- | --- |
| 1 | Chaos arbiter（混沌） / 98598862 | [前100](https://zkillboard.com/api/stats/corporationID/98598862/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98598862/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#混沌前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；9个明确对上当前列传 |
| 2 | Peoples Liberation Army（PLA） / 98190062 | [前100](https://zkillboard.com/api/stats/corporationID/98190062/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98190062/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#pla前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；7个明确对上当前列传 |
| 3 | Fuxi Legion（伏羲） / 98185110 | [前100](https://zkillboard.com/api/stats/corporationID/98185110/kills/)，2026-10-11 | [已取得前100](https://zkillboard.com/corporation/98185110/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#伏羲前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；13个明确对上当前列传 |
| 4 | Special law enforcement department（特执／SARD） / 98540583 | [前100](https://zkillboard.com/api/stats/corporationID/98540583/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98540583/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#特执前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；10个明确对上当前列传 |
| 5 | Kun-Lun（昆仑） / 98825941 | [前100](https://zkillboard.com/api/stats/corporationID/98825941/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98825941/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#昆仑前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；14个明确对上当前列传 |
| 6 | ChuangShi（创世） / 98535868 | [前100](https://zkillboard.com/api/stats/corporationID/98535868/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98535868/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#创世前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；10个明确对上当前列传 |
| 7 | Knight of Zero Ultra（KZU） / 98808817 | [前100](https://zkillboard.com/api/stats/corporationID/98808817/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98808817/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#kzu前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；6个明确对上当前列传 |
| 8 | Stardust-Guardian（星尘） / 98550682 | [前100](https://zkillboard.com/api/stats/corporationID/98550682/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98550682/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#星尘前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；10个明确对上当前列传 |
| 9 | Alkaid Broken Army（瑶光） / 98725234 | [前100](https://zkillboard.com/api/stats/corporationID/98725234/kills/)，2026-10-11 | [已取得前100](https://zkillboard.com/corporation/98725234/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#瑶光前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；11个明确对上当前列传 |
| 10 | Kuan.Dai.Shan（宽带山） / 98626718 | [前100](https://zkillboard.com/api/stats/corporationID/98626718/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98626718/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#宽带山前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；2个明确对上当前列传 |
| 11 | Emperor Scythes / 98715582 | [前100](https://zkillboard.com/api/stats/corporationID/98715582/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98715582/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#帝皇之镰前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；6个明确对上当前列传 |
| 12 | STARCHASER Inc / 98626494 | [前100](https://zkillboard.com/api/stats/corporationID/98626494/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98626494/top/year/2026/month/9/)，系统Chrome缓存 | [前50已读49份](#采星者前50头衔增量2026-10-14)；第33名ESI404，头衔／简介缺口保留 | 100个名字已对照；4个明确对上当前列传 |
| 13 | Dusk dreadnought. / 98817310 | [前100](https://zkillboard.com/api/stats/corporationID/98817310/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98817310/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#dusk前50头衔增量2026-10-14)；优先补总监／社区主持实际事务 | 100个名字已对照；5个明确对上当前列传 |
| 14 | B.O.P Supplication For Glorious / 98547771 | [前100](https://zkillboard.com/api/stats/corporationID/98547771/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98547771/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#bop前50头衔增量2026-10-14)；优先补参谋长实际职责与人物故事 | 100个名字已对照；13个明确对上当前列传 |
| 15 | Fox of Resistance / 98755298 | [前100](https://zkillboard.com/api/stats/corporationID/98755298/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98755298/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#fox前50头衔增量2026-10-15)；明确管理职责已写短篇；其他候选待补故事／教学 | 100个名字已对照；16个明确对上当前列传 |
| 16 | YeLuo-XingHai / 98588384 | [前100](https://zkillboard.com/api/stats/corporationID/98588384/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98588384/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#叶落星海前50头衔增量2026-10-15)；补总监分工、任务交易与人物事件 | 100个名字已对照；6个明确对上当前列传 |
| 17 | HongLou / 98642382 | [前100](https://zkillboard.com/api/stats/corporationID/98642382/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98642382/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#红楼前50头衔增量2026-10-15)；补实际职责与独立事件 | 100个名字已对照；3个明确对上当前列传 |
| 18 | PLA Fleet / 98576141 | [前100](https://zkillboard.com/api/stats/corporationID/98576141/kills/)，2026-10-12 | [已取得前0](https://zkillboard.com/corporation/98576141/top/year/2026/month/9/)，系统Chrome缓存 | [前50已读49份](#pla-fleet前50头衔增量2026-10-15)；第37名ESI404；老鹰双号归本人 | 100个名字已对照；5个明确对上当前列传 |
| 19 | Temple of Tuvan Orth / 98652614 | [前100](https://zkillboard.com/api/stats/corporationID/98652614/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98652614/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#图万神殿前50头衔增量2026-10-15)；茅台FC已立传，其他实际职责／故事待补 | 100个名字已对照；6个明确对上当前列传 |
| 20 | Chi Gua / 98524084 | [前100](https://zkillboard.com/api/stats/corporationID/98524084/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98524084/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#吃瓜第31至50名增量)；喵爷虫洞邀请、天鹅ALT及鹊桥直播继续补故事 | 100个名字已对照；14个明确对上当前列传 |
| 21 | Salted Fish Inc / 98640194 | [前100](https://zkillboard.com/api/stats/corporationID/98640194/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98640194/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#咸鱼第31至50名增量)；saber CEO已立传，kk七号归一组，其他职责／故事继续 | 100个名字已对照；7个明确对上当前列传 |
| 22 | Descendants of Shen Nong / 98702890 | [前100](https://zkillboard.com/api/stats/corporationID/98702890/kills/)，2026-10-12 | [已取得前95](https://zkillboard.com/corporation/98702890/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#神农第41至50名与leo成文)；Leo总监已立传，其他实际职责／故事继续 | 100个名字已对照；7个明确对上当前列传 |
| 23 | Family Guy. / 98798876 | [前100](https://zkillboard.com/api/stats/corporationID/98798876/kills/)，2026-10-11 | [已取得前86](https://zkillboard.com/corporation/98798876/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#family-guy第31至50名增量2026-10-16)；酒云教学入口、P子和686等继续补故事 | 100个名字已对照；5个明确对上当前列传 |
| 24 | Cosmic-Wanderers / 98769610 | [前100](https://zkillboard.com/api/stats/corporationID/98769610/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98769610/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#cosmic-wanderers第36至50名及gecl前两名2026-10-16)；豆芽／老哥／星光归组，具体人物故事继续补 | 100个名字已对照；9个明确对上当前列传 |
| 25 | Galactic Empire Co LTD / 98537981 | [前100](https://zkillboard.com/api/stats/corporationID/98537981/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98537981/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#gecl第26至50名与创世学院前六名2026-10-16)；同人组及B站直链等后续故事待补 | 100个名字已对照；5个明确对上当前列传 |
| 26 | Chuangshi College / 98705642 | [前100](https://zkillboard.com/api/stats/corporationID/98705642/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98705642/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#创世学院第39至50名及navigators-union前23名2026-10-17)；具体人物故事继续补 | 100个名字已对照；0个明确对上当前列传 |
| 27 | Navigators' Union / 98825044 | [前100](https://zkillboard.com/api/stats/corporationID/98825044/kills/)，2026-10-12 | [已取得前98](https://zkillboard.com/corporation/98825044/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#navigators-union收尾与兔飞前26名2026-10-17)；房子小双号，职责／故事续查 | 100个名字已对照；4个明确对上当前列传 |
| 28 | Tu Zi Fei Corporation / 98648061 | [前100](https://zkillboard.com/api/stats/corporationID/98648061/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98648061/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#兔飞第27至50名与faceless前十2026-10-17)；梦／京介归双号，小燕子三号，颂词补飞飞 | 100个名字已对照；6个明确对上当前列传 |
| 29 | Faceless. / 98645589 | [前100](https://zkillboard.com/api/stats/corporationID/98645589/kills/)，2026-10-12 | [已取得前95](https://zkillboard.com/corporation/98645589/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核49份](#faceless收尾与dawns-lightp前十2026-10-17)，第24名ESI404；木木三补Crea1ure | 100个名字已对照；14个明确对上当前列传 |
| 30 | Dawn's LightP / 98781311 | [前100](https://zkillboard.com/api/stats/corporationID/98781311/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98781311/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#dawns-lightp收尾与aocal前十2026-10-17)；白凝七号，具体故事／职责续查 | 100个名字已对照；2个明确对上当前列传 |
| 31 | Attack On CALDARI / 98599181 | [前100](https://zkillboard.com/api/stats/corporationID/98599181/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98599181/top/year/2026/month/9/)，系统Chrome缓存 | [前20已核读](#aocal第11至20名与牧星评论入文2026-10-17)；夜灵成文，天堂角落双号；续21—30 | 100个名字已对照；2个明确对上当前列传 |
| 32 | Serenity Moe University / 98707431 | [前100](https://zkillboard.com/api/stats/corporationID/98707431/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98707431/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：8,49；连续范围待验收 | 100个名字已对照；1个明确对上当前列传 |
| 33 | Stars Corporate Group / 98598483 | [前100](https://zkillboard.com/api/stats/corporationID/98598483/kills/)，2026-10-12 | [已取得前93](https://zkillboard.com/corporation/98598483/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：1,2,6,9,20；连续范围待验收 | 100个名字已对照；3个明确对上当前列传 |
| 34 | Silver Fog Dragon Ride / 98613748 | [前100](https://zkillboard.com/api/stats/corporationID/98613748/kills/)，2026-10-12 | [已取得前89](https://zkillboard.com/corporation/98613748/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：37；连续范围待验收 | 100个名字已对照；4个明确对上当前列传 |
| 35 | Baby-Bus / 98777401 | [前100](https://zkillboard.com/api/stats/corporationID/98777401/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98777401/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：11；连续范围待验收 | 100个名字已对照；3个明确对上当前列传 |
| 36 | New Eden Light Point College / 98772842 | [前100](https://zkillboard.com/api/stats/corporationID/98772842/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98772842/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；2个明确对上当前列传 |
| 37 | Foredawn Business Corporation / 98538918 | [前100](https://zkillboard.com/api/stats/corporationID/98538918/kills/)，2026-10-12 | [已取得前49](https://zkillboard.com/corporation/98538918/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；6个明确对上当前列传 |
| 38 | Deadspace Spearhead / 98841123 | [前96](https://zkillboard.com/api/stats/corporationID/98841123/kills/)，2026-10-12 | [已取得前72](https://zkillboard.com/corporation/98841123/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 96个名字已对照；1个明确对上当前列传 |
| 39 | Arknights. / 98725089 | [前100](https://zkillboard.com/api/stats/corporationID/98725089/kills/)，2026-10-12 | [已取得前76](https://zkillboard.com/corporation/98725089/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：7,13,15,19,22,26,27,29,31,33,43；连续范围待验收 | 100个名字已对照；9个明确对上当前列传 |
| 40 | Silent Sojourner / 98817783 | [前100](https://zkillboard.com/api/stats/corporationID/98817783/kills/)，2026-10-12 | [已取得前61](https://zkillboard.com/corporation/98817783/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：1；连续范围待验收 | 100个名字已对照；0个明确对上当前列传 |
| 41 | Formosa Research Center / 98049623 | [前100](https://zkillboard.com/api/stats/corporationID/98049623/kills/)，2026-10-12 | [已取得前49](https://zkillboard.com/corporation/98049623/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；3个明确对上当前列传 |
| 42 | Texas of Requiem / 98806126 | [前100](https://zkillboard.com/api/stats/corporationID/98806126/kills/)，2026-10-12 | [已取得前83](https://zkillboard.com/corporation/98806126/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；2个明确对上当前列传 |
| 43 | Forever Stardust Navy Combined Fleet / 98804833 | [前100](https://zkillboard.com/api/stats/corporationID/98804833/kills/)，2026-10-12 | [已取得前56](https://zkillboard.com/corporation/98804833/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；0个明确对上当前列传 |
| 44 | Red Scarf Humpback / 98632030 | [前100](https://zkillboard.com/api/stats/corporationID/98632030/kills/)，2026-10-12 | [已取得前85](https://zkillboard.com/corporation/98632030/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；3个明确对上当前列传 |
| 45 | Glory Navy / 98530802 | [前100](https://zkillboard.com/api/stats/corporationID/98530802/kills/)，2026-10-12 | [已取得前81](https://zkillboard.com/corporation/98530802/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：41；连续范围待验收 | 100个名字已对照；2个明确对上当前列传 |
| 46 | Infinity Avenger / 98556933 | [前100](https://zkillboard.com/api/stats/corporationID/98556933/kills/)，2026-10-12 | [已取得前28](https://zkillboard.com/corporation/98556933/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：29；连续范围待验收 | 100个名字已对照；9个明确对上当前列传 |
| 47 | Phoenix City / 98575144 | [前100](https://zkillboard.com/api/stats/corporationID/98575144/kills/)，2026-10-12 | [已取得前56](https://zkillboard.com/corporation/98575144/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；2个明确对上当前列传 |
| 48 | Zhuque squad / 98742946 | [前100](https://zkillboard.com/api/stats/corporationID/98742946/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98742946/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：1,8,42；连续范围待验收 | 100个名字已对照；4个明确对上当前列传 |
| 49 | Black.King.Bar / 98599315 | [前100](https://zkillboard.com/api/stats/corporationID/98599315/kills/)，2026-10-12 | [已取得前74](https://zkillboard.com/corporation/98599315/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；1个明确对上当前列传 |
| 50 | Dam Scientific Research / 98606029 | [前100](https://zkillboard.com/api/stats/corporationID/98606029/kills/)，2026-10-12 | [已取得前77](https://zkillboard.com/corporation/98606029/top/year/2026/month/9/)，系统Chrome缓存 | [前20已核读](#aocal第11至20名与牧星评论入文2026-10-17)；夜灵成文，天堂角落双号；续21—30 | 100个名字已对照；0个明确对上当前列传 |
## 本轮已吸收的故事与同人号

- **黑山羊、小白菜**：已凭指挥依据收录；导演、默、奈何后因仅有参赛／战果退回线索，旧取得记录保留，不再记为当前收录。Thunder ebon已补同场ATXXI经历与互链。
- **幽竹／LS-Somber（2118767266）**：本人招募承诺作战船军团包揽、每月单浪补损2B，现保留[单人线索](ls-somber.md)；LS-Somber5／2119292222同词根同瑶光并入本人。
- **久／xie jiu（2120047333）**：长剑、神示、长须鲸三条KM确认本人参战并取最后一击，“红烧猪头／夜宵／吃鱼”菜单归[本人线索](xie-jiu.md)，简介菜单与KM不足立传。贝斯特拉那条无本号，只写挂军团战果与自夸，不认本人击杀。
- **丁大炮／dingdapao001（2118510270）**：完整读取本人BR，六窗口213条去重KM、总损失66.83B；两条本人永灭记录保留[单人线索](dingdapao001.md)。未达到大型战役门槛。
- **乔布／qiaobu123、剑穿天下／Contingency-JCTX**：后续已立传，分别见[乔布素材](../../src/people/qiaobu123/materials-qiaobu123.md)、[剑穿天下素材](../../src/people/contingency-jctx/materials-contingency-jctx.md)；此次回填状态，不计为本轮新写。
- **莫凡／MOVAN（2115166285）**：创世历史榜第1，本人头衔对应；简介留下归魂者、泽尼塔KM及“忘记换蛋的下场”。原始KM核对材料归[本人线索](movan.md)，简介自嘲与KM不足立传。泽尼塔为无畏，未写成超旗；未取战损估值，不冒充已核大型战役。
- **乐章／PS Rogen（2113093205）**：SCG历史榜第1，本人中文头衔与工程项目材料里的管理乐章对应。ES清退风波中被请离一方称其“公正且明辨是非”，归[本人线索](ps-rogen.md)，仅管理身份与一句好评不足立传；不编接收结果或顶住禁令的动作。
- **污龟：peter li peter1（2113882039）**。头衔“污龟 ALT”，同当前Chi Gua，归[污龟](../../src/people/peter-li-peter/materials-peter-li-peter.md)。
- **白菜：CaiGou CabbageTimil（2116264387）**。头衔“白菜”，与收录号同当前军团Steel Feather Special Air Corps（98617103），归[白菜](../../src/people/cabbagetimil/materials-cabbagetimil.md)。
- **水哥：Captain shikongsa（2115281834）**。头衔“水哥”，同当前KZU，归[水哥](../../src/people/shikongsa/materials-shikongsa.md)。
- TaiBaiJinXIng（2119449883）在榜内显示(recycled)后缀；此前已有[胡汉三素材](../../src/people/taishang-laojun/materials-taishang-laojun.md)明确归属，复用原对应而非新认号。其是否换操作人未重查，不以历史榜证明当今仍由本人操作。

## 本轮首批其余角色

| 角色 / ID | 当前公开头衔 | 已有线索与待查 |
| --- | --- | --- |
| xie jiu / 2120047333 | #4380 久，『 混沌卧龙』修津高手 | 混沌历史榜第1，简介“带队使用”预设及“我们cacx真的太强啦”；三条本人参战KM与贝斯特拉宣传已核，已退回[久线索](xie-jiu.md)；仍不凭设置名认FC。 |
| Leela Sirene / 1212703823 | Hito#872747 | PLA历史榜第1；Hito只是头衔片段，不并到HiToMinG／所思；本人事件与账号待查。 |
| Pstark Adoulin / 2114017643 | 乌黑的手 | RR历史榜第1；头衔“乌黑的手”，简介空，中文外号／管理身份未展开。 |
| CMFF / 2117820367 | 【默(Chilmore)】 | 暂留[默的线索](cmff.md)，三号同头衔同团归本人；MCX-CMFF的航母KM已核。不是乐章或刚子。 |
| SkyEagleMilize / 2120306116 | 天鹰 金色镰刀 | ES历史榜第1；本人链接总览与“天鹰流浪洞 Drifter”，是工具入口，不当本人战役或新B站账号。 |
| qiaobu123 / 2121450438 | #乔布 | 朱雀历史榜第1，军团简介Head-FC指向本号，中文头衔“乔布”；刀哥、GM Nito与Zelus三条KM已核，已立[乔布短传](../../src/people/qiaobu123/materials-qiaobu123.md)；其余入口留本人素材。 |
| La Rusa / 2118160416 | 奈何 | 暂留[奈何线索](la-rusa.md)，Obe泰坦击杀与2024虫洞拆迁入文；登记CEO号关系仍待核。 |
| Dema1 / 2115768319 | 德玛 | 红楼历史榜第1；DEMA 119为红楼创建者兼创团CEO（2020-05—2025-02），已立[德玛列传](../../src/people/dema1/materials-dema1.md)。 |

## 上一批明确同人及候选



- **晓天：Guifangq（2115482062）**。Family Guy历史榜第25，1136条、约1.714T；ESI头衔“晓天”，当前Infinity Avenger（98556933），与收录Guifangq Hate同词根、同中文头衔、同当前军团。归回[晓天](guifangq-hate.md)，不另立传。
- **炽天：chitian hehehe（2113788113）**。Family Guy历史榜第27，994条、约414.40B；ESI完整头衔“炽天 清风不语，明月自来”，当前KZU（98808817），与收录号同词根、同头衔和同当前军团。**chitian xiao（2114917439）**也在同一Family Guy历史榜第40，729条、约275.08B，与已认号hehehe同词根、同历史军团，按同词根同军团规则合并；xiao当前头衔与KZU团籍已补核，不将历史榜当今日归属。两号归回[炽天](../../src/people/chitian/materials-chitian.md)。huhuhu仍缺对应记录。

## 优先候选与首批头衔

不凭军团高榜名次认定管理或FC；先保存外号与直接职责，再追事件、Monitor记录和社区账号。职位或普通参战统计单独不足以造个人故事。

| 角色 / ID | 人物线索 | 已有依据与下一步 |
| --- | --- | --- |
| Lemmily / 272243056 | 瑶光导演／Lemmily | 暂留[导演线索](lemmily.md)，ATXXI夜鹰出场已核；本人仍为简介列出的主要负责人，具体任期与社区故事待查。 |
| Ox00FFFFFFF BIS / 2114035946 | 奎恩 | 瑶光历史榜第4；本人头衔“奎恩”，简介为古文；中文社区事件与同人关系待查。 |
| LS-Somber / 2118767266 | 幽竹 | 瑶光历史榜第10；本人头衔“幽竹(主号)”，简介招新人并称作战船只军团包揽、每月单浪额外补损2B；招募承诺留[幽竹线索](ls-somber.md)，LS-Somber5／2119292222并入本人；PH文字是旧简介口径。 |
| Arthur Hemanseh / 96724929 | MasterChief／顶级猎手 | 伏羲历史榜第1；本人头衔“MasterChief - 顶级猎手”，简介空；客户端顶级猎手及公开伏羲组合各1页未有效命中，转事件／Monitor入口，不据常用词认人。 |
| Zamira Mtskhetashi / 92761884 | 扎米拉 | 伏羲第2；本人头衔“扎米拉”、简介F1 Monkey；公开精确中文查询无人物命中，尚无独立事件。 |
| No Fung / 2112427316 | 老馮 | 伏羲第3；本人头衔“老馮”、简介F1 Monkey；不按常见姓氏合并已有角色。 |
| ForAeon / 2121683065 | 不回 | 伏羲第4；本人简介“呜呜呜，要被揍了（咬牙）”及番剧链接；属于游戏号自述，不能据番剧作者认本人B站账号。 |
| Medusa Serenity / 2114912504 | 代行天威 | 伏羲第5；头衔“代行天威”、简介空；已与同头衔同团的Hydra hzy归一人，社区故事／职责待查。 |
| Cavick / 2112541174 | Cavick | 伏羲第6；头衔同英文名、简介空；中文外号与故事待查。 |
| Zack Raines / 2113144878 | 后天 | 伏羲第7；本人头衔“后天”、简介空；不把其他帖子中的普通时间词当本人。 |
| SamNeko / 2117340398 | SamNeko | 伏羲第9；头衔同角色名、简介空；身份待查。 |

星尘前十的剑穿天下、3V、911、那年、QY、逐风、楠哥、丁大炮已有[逐人入口](sg-cn-fc-followup-2026-10-12.md)，后续剑穿天下已凭具体Monitor记录立传；丁大炮已核本人BR，现退回线索，3V、911、那年、QY、逐风、楠哥仍缺个人事件。Family Guy前十旧调查见[Cyan nomi素材](../../src/people/cyan-nomi/materials-cyan-nomi.md)。

## 剩余覆盖缺口

- 九月monthly后续50家均已取得，见覆盖表；下一步使用已有月榜与历史榜追具体人物，不重复抓同一成功榜单。
- 大多数角色目前只解析名字、查收录号与aliases，尚未读头衔、个人简介、Monitor、任期、代表战役或社区帖子；不把4834角色的名册保存当全部调查完成。上方“已对应”按不同角色ID计数，不按跨团／历史与近期重复行数计人。
- 乔布、久已立传；奈何、默、导演退回线索；德玛已作创团CEO立传；有故事则立传，已收录人物小号并回本人。
- 近名四号已补ESI：yilifaerrrrrrr同头衔、同Your Ex's归伊利法尔；NanJing-9头衔老曲，Weightless01头衔苍墨，ai weiyang头衔雨季，继续留线索，不按英文片段合并南京、想想或未央。
- 首次榜单批次未新增大范围社区检索；乐章故事复用本地来源，莫凡事迹来自本人简介与原始KM。六人续查的社区搜索覆盖另列下方，不把重复搜索当增量。

## 六人取得记录（2026-10-12，现收录状态以上表为准）

冻结首批：幽竹、久、丁大炮、导演、奈何、默。首轮前三人已归档并入文；本轮后续已补导演、奈何、默三人，原有查漏记录保留，具体增量见下方续查。名字对照已按当前收录号与明确aliases回填TSV；已收录不代表此人的全部号与经历调查完成。

- **导演／Lemmily（当时收录，现退回线索）**：重新读取本人ESI，中文头衔“导演 Director”，简介仅两份“九”总览及Esaeel地点链接。瑶光公开军团简介已有Director①／主要负责人对应；九月普通榜本号第3、199条，九月Monitor榜只有War martyrdom Freedom、Cabbage66。客户端“eve欧服 瑶光 导演”一页无结果；网页组合查询只找到瑶光官网／wiki背景，没有本人事件。后续ATXXI名单已直接对上角色ID，参赛素材仍保留；因没有指挥或独立故事，现归导演线索，继续补具体带队、任内故事与社区账号。
- **奈何／La Rusa（现退回线索）**：本人中文头衔及简介CEO关系沿用，简介仍为广播与虫洞书签。沉默旅人九月Monitor页Top Characters与Top Ships为空，只限定该团该月份；不排除其他号或月份。“eve欧服 奈何 沉默旅人”一页命中[2023-08-10招新帖](https://tieba.baidu.com/p/8544703566)，正倒序各1页、3条主楼、无楼中楼，可见全文已读。楼主Miss幻º／原名fjlove6598／UID634182519称每晚收割、挺针、过洞及多种PVE活动；没有角色署名，旧帖同名组织与当前军团ID的承接未核，不归奈何，不保留通讯号码。下一步用该楼主的其他游戏主题找角色署名，再核对同名组织年代。
- **默／CMFF（现退回线索）**：中文头衔“默(Chilmore)”，SCG九月普通榜已有MCX-CMFF／2117820398（第10、34条）、MJ CMFF／2119866050（第28、10条），同词根同团按本人小号对应；Chilmore／2122002957（第26、11条）与本人头衔英文名相同且同团，归同一候选人。不能当成刚子。SCG九月Monitor页角色、船型榜均空；客户端“eve欧服 Chilmore”一页无结果，网页仅取得同名角色榜入口，尚无本人事件。后续三号中文头衔同为默，MCX-CMFF的绝念航母击杀已核；同人依据与战果均归默的线索，待独立故事或指挥依据。
- **新增Monitor候选**：War martyrdom Freedom／2115488091、Cabbage66／2116339735，瑶光／INIT九月Monitor榜各27条、合计54条，Top Ships仅Monitor。复用既有完整KM缓存，[138807390](https://zkillboard.com/kill/138807390/)中War martyrdom Freedom驾驶Monitor45534、瑶光98725234／INIT1900696668、伤害0，2026-09-30 13:43 UTC、Y-C3EQ，目标为红领鲸／FRT的Metenox Moon Drill；可据此记参与指挥，不认总指挥。该KM未找到Cabbage66，代表KM仍待读；其余高值入口138764476、138545187、138807210、138764462、138764450未在本轮逐条核读。后续两人中文头衔已对上黑山羊、小白菜，小白菜代表KM已核，两人已收录；同人和社区复盘缺口归本人素材，不并入本站白菜。
- **失败与阅读边界**：丁大炮BR在网页工具中不可访问，后以独立公开HTTP入口读取HTML及实际前端接口，完整响应已核；幽竹个人stats在Chrome的CDP连接阶段超时，目标页未导航，未重复尝试。三个Monitor榜读取均成功；奈何、默空榜不是终身零记录。公开搜索出现无关同名结果，不归人物。必要角色快照和头像由fetch脚本生成。

## 五人旧入文记录（2026-10-13，导演／默／奈何现退回线索）

- **[导演／Lemmily](lemmily.md)**：角色ID直接对上EVE_NT ATXXI名单，驾驶夜鹰代表PMA出场；同队Thunder ebon已对上本站166847438，追加其参赛经历并互链。比赛日期、具体轮次、指挥身份未取得，普通竞技落败不记黑料；其他队员保留在[共享赛事摘要](../sources/atxxi-pma-3816.md)，未完成逐人社区调查。
- **[默／CMFF](cmff.md)**：MCX-CMFF、MJ CMFF、Chilmore三号均同中文头衔、同SCG，合写一人。MCX-CMFF简介挂出的90444413已核，2021-02-03、2R-CRW、16名攻击者中记录本人太空舱船型；目标Thanatos／绝念为普通航母，不是超旗。个人KB与挂墙行为已入文，不编太空舱攻击航母的操作或指挥。
- **[黑山羊／War martyrdom Freedom](../../src/people/black-goat/materials-black-goat.md)**：ESI中文头衔明确，简介是月矿、矿物与虫洞资料。既有138807390确认2026-09-30、Y-C3EQ驾驶Monitor参与指挥；新读138764476则开灾难级海军型，两种船型分别叙述。个人KB已补，不因工具列表认矿业管理职责。
- **[小白菜／Cabbage66](../../src/people/cabbage66/materials-cabbage66.md)**：ESI头衔“小白菜”，与本站白菜无同人依据。完整138764476原始名单确认2026-09-28、Y-C3EQ、瑶光／INIT、Monitor船型，已立短传并与黑山羊互链。空简介与两个搜索分支未给出新社区账号，不认终身无发言。
- **[奈何／La Rusa](la-rusa.md)**：旧招新帖作者主题列表仅一条EVE帖，吧名为eve；当前98817783军团成立于2025-11-11，不能直接将2023同名帖接为此团史，服务器及组织承接仍待核。改查本人KB与原始名单，取得Obe冥府击杀及2024年Lazerhawks六条虫洞结构拆迁经历，战果保留在奈何线索，现缺独立故事或指挥依据；旧帖认号不是前置条件。公开简介CEO与登记CEO号2123893786的同人关系仍缺，不合并。
- 本轮五号个人KB分别取得，按收录号范围表述；各小号统计不相加。九月50团缓存与旧历史榜复用，仅新增角色、事件和账号分支；每份名单取得、个体认号与入文继续分别记录。
- 浏览器在本机CDP连接阶段超时，未导航到138764476；随后公开zKB API及对应ESI均200，原始记录完整可读，没有因站点拦截切换出口。EVE_NT两个人物页超时，比赛页完整且链接ID已对上，不反复读取人物页。奈何的常用词搜索命中普通连词与无关小说内容，不归人物。

2026-10-13已消化条目：BOP历史榜akissone（2113411990）以招新联系名单、Akiss回复账号及2018起同团雇佣期对应，招新玩笑已入[本人素材](../../src/people/akissone/materials-akissone.md)。历史榜数字保持原口径，不拿本次个人stats覆盖榜单。

## 2026-10-13续查：D.OK与近名号

本批固定十个对象：钟离尘风、神奇黑旗、Rainight kurumi、酱油、系欧欧、老曲、伊利法尔近名号、苍墨、雨季、乌黑的手。前九个已补ESI，乌黑的手复用旧头衔与本轮公开搜索；请求首轮上限30，两个访谈另按关联UP上限15，快照补齐沿构建流程，不扩成逐团全量刷新。榜单与成功缓存复用，取得、核读、归属与成文分开。

| 对象／ID | 核读与归档 | 当前下一步 |
| --- | --- | --- |
| 钟离尘风／Ventus ZhongLi，2119086999 | 中文头衔、无面者归属、首星捐赠自述、动员译稿点名已读；[本人素材](../../src/people/ventus-zhongli/materials-ventus-zhongli.md)，已立传 | 管理具体分工、任期、小号与代表战役 |
| 神奇黑旗／Qiya Hei，2115982590 | 中文头衔直接自报联盟FC，公开招新福利及个人KB已读；[本人素材](../../src/people/qiya-hei/materials-qiya-hei.md)，保留FC短传 | 具体指挥事件、Monitor与贴吧账号；高安Blackflag同名不归他 |
| Rainight kurumi，2117046673 | 两条泰坦及一条莫洛原始KM已核，本人均为攻击者；简介“TT没了”不归本人损失，详见[本人线索](rainight-kurumi.md) | 中文账号、本人具体故事与指挥依据；不重复三条成功KM |
| 酱油／Soy sauce No，2118118124 | 中文头衔酱油、当前无面者；九月本团第3、150条，历史第2、5274条；简介只有默认文案 | 本人事件与小号；不因高榜名次认管理 |
| 系欧欧／coo en Cedoulain，2114463130 | 中文头衔与当前无面者已读；简介为总览和广播 | 社区事件与同人；工具分享不立传 |
| 老曲／NanJing-9，2117364874 | 头衔老曲、当前咸鱼团98640194；简介广播设置 | 查本人社区账号，不因NanJing词根归南京 |
| yilifaerrrrrrr，2121295606 | 头衔#Eli-Yilifaer、同Your Ex's，按同词根同团合并；[伊利法尔素材](../../src/people/yilifaer/materials-yilifaer.md) | 简介多个FC与CCP角色的KM、Twitch片段待读；不据收藏链接编战果 |
| 苍墨／Weightless01，2121209822 | 头衔#苍墨、朱雀军团98742946；简介挂Nyth Hinken巴盖斯KM | 本人与想想同人依据未得，不合并；KM及社区账号待查 |
| 雨季／ai weiyang，2116008826 | 头衔雨季、当前98642939／FRT；简介主要为总览 | 未对应未央，不归卡商九卡事件；具体故事待查 |
| 乌黑的手／Pstark Adoulin，2114017643 | 复用旧ESI中文头衔与军团98540583；本轮公开检索只见战绩页，没有社区事件 | 继续事件、Monitor与主小号，KB本身不立传 |

本批归入当前列传新增3个角色ID（两位新人、伊利法尔一号），同时按当前文件回填旧撤回人物的线索路径。两期宁静访谈补白杉、NoNo、大林与斑鸠的具体言行；未对应小派留[视频身份入口](ningjing-interview-guests-2022.md)。2022年一月98行军团表另归[历史榜事实](../sources/corp-activity-2022-01.md)，不混入本页2026年九月统计。

2026-10-13后续核读：Rainight的三条原始记录支持泰坦／无畏参与击杀，不支持本人“土路丢泰坦”，已按人物归档。2022历史团分支定位七个团与六个登记号的角色头衔，内森并回旧传；夜叉糖按既有完整帖子写新传。取得军团ID与现任CEO不等于2022任期已核，不改变本页4834角色逐人故事覆盖。

社区续查本轮从角色转原事件：We Love Cody在2025年CEO声明中出现的Code Earth已核角色2112856066并立传，声明实际由Nan Li Leo代发，两人身份在材料中拆清；与今日“寇德”Zerg Lemon暂不合并。这是2022旧团表分支的新人物，不将其加入本页4834名历史／近期榜角色计数。伏羲顶级猎手、扎米拉及红楼德玛的本轮关键词分支未取得人物事件，分别更新原候选行，下一步改沿同队事件与Monitor，不重复同一零命中搜索。

2026-10-14九月榜首批十号已核头衔／简介，待故事者集中在[无面者人物入口](dok-monthly-people-2026-10-14.md)。糖果猫两号已按同头衔同团归一；JiaShen Yangg与SummerHall外交官珅同词根、同头衔、同DC，归[本人素材](../../src/people/jiashen-yang/materials-jiashen-yang.md)，具体自嘲与D哥哥猎獒记录留存，珅已按核心管理恢复短传，具体外交事件继续补料。原TSV只更新身份字段，不将九月记录加进历史／近期统计。顶部对应数现只统计明确已对应状态且有当前列传的行；“待故事／待认号”行即使指向某人的取材文件，也不能当作同人已成。

2026-10-14旧团表续查：奥术飞弹创建人／CEO DA已据任职依据留短传，AUG SE同词根同DC并回本人；2022招新帖完整文字与评论区钱包玩笑归[本人素材](../../src/people/aug-ss/materials-aug-ss.md)。这是2022历史团分支人物，不加入本页4834角色的已对应计数；2022具体任期继续核，不把登记创建人当连续任职证明。

## 混沌前十续查（2026-10-14）

固定读取历史榜尚未核过的七号，再核MrWPRG近名号，共八份ESI头衔／简介；榜单未重抓。哈威以同名同团同时间对应贴吧哈威s，在2025退团争议中解释末球清蹭LP的安排、与楼主争论等待成本，归[本人素材](../../src/people/husky-weoo/materials-husky-weoo.md)并立传。其余六个人物方向保持候选；“FC总览”“诱导高手”和高排名不作指挥职务。

| 角色／ID | 已读内容与同人 | 下一步 |
| --- | --- | --- |
| yy yy／2121128360 | 头衔#4608yy；简介挂贝斯特拉与鹏鲲，向人讨钱、分享总览。旧121521650名单确有本号；论坛名牌CACX-yy／yy yy另有单句游戏梗 | 具体社区事件或职务；不以“天空纸条常规FC总览”认其为FC，不把普通口嗨当独立故事 |
| CA I／2116263612 | 头衔CA，混沌仲裁；简介引随风“最近好多新人啊”，挂Jie Wu归魂者 | 公开职务、账号与本人事件；引别人话不认其为随风 |
| Mr Lightt／1299744592 | 头衔艾佛里，三项属性式自嘲；自称carebear、开昂贵装备，见他local是幸运日 | 本人事件与账号；没有损失记录不写成遭围猎 |
| MrPW／2122394319、MrWPRG／2122394239 | 分别头衔#5019零度、#5019零度小号；同当前混沌／FRT，同词根与编号，直接归本人两号；简介均默认文案 | 独立故事或指挥依据；“诱导高手”不等于FC，不分成两人 |
| JvHuaxia Lee／2113667626 | 头衔菊花侠1C，混沌铁直男、小航高手；简介直接自报菊花侠，挂多条击杀及本人穿梭机损失 | 原始KM、本人事件、近名小号；昵称不当现实身份，联系号码不保存 |
| Losschyve Thellere／2121495206 | 头衔#4693吴磊磊；简介是交牌子换声望及广播工具笔记 | 具体社区事件／账号；游戏头衔仅作检索键，不写成现实姓名，不将NPC资料入人物履历 |

八号当前均在Chaos arbiter／FRT；这是核对日归属，不倒推全部历史参战或任期。原TSV只更新对应与阅读字段，历史／近期的击杀数和ISK未改。零度两号已成同人，未入文人物继续沿本表续查；不重复取得已读简介。

## 混沌前50头衔增量（2026-10-14）

历史榜第11—50名头衔与完整简介已核读，已有MrWPRG画像复用，新增39次ESI请求；与前十合计前50已覆盖。只读公开名片，未跑个人船型统计；当前归属、游戏名片中的人数与自称不回写成任期事实。

| 名次 | 角色／ID | 公开头衔与已读内容 |
| --- | --- | --- |
| 11 | fendu／2122673856 | 头衔“#5261,封督，生产队的驴”；封督；“生产队的驴”为自嘲，沿石头退团帖里的丰都称呼继续核对，不凭谐音补指挥职位 |
| 12 | xuebi online／2121496804 | 头衔“#4690，雪碧”；雪碧；收藏贝斯特拉、万古等及本人万王海军战损，具体人物事件待补 |
| 13 | Flashing shark／2114362964 | 头衔“#1869，混沌-星星，统帅: 99 政治：97 武力：90”；星星，归已有列传；面板自评保留原素材 |
| 14 | Hadal Pedel／2121497006 | 头衔“#4693，吴磊磊，天使杆子控场认准唯一军团：混沌仲裁者，日活语音在线80-90活人，300+账号，天使杆子爽绕”；吴磊磊，与Losschyve Thellere同#4693、同混沌，归一人；自列天使杆子与在线人数为宣传说法 |
| 15 | MoJiangHan／2121089383 | 头衔“伊布”；伊布；简介自嘲打法不团队、爱堵门散打抓杆子并收藏战果，不写成已有具体内讧 |
| 16 | MrWPRG／2122394239 | 头衔“#5019,零度小号”；零度小号；与MrPW等六号合并，不另收人 |
| 17 | chen Tigarex／2116622837 | 头衔“#4341 宸”；宸；简介广播、凤凰战果及字符画，待独立故事／职责 |
| 18 | Witty Yy／2115635957 | 头衔“小歪”；小歪，简介空，待社区对应 |
| 19 | MrPRW／2122384975 | 头衔“#5019,零度小号”；零度小号；同头衔编号、词根及当前团，归MrPW组 |
| 20 | obsn8192G／2119571177 | 头衔“初衷”；初衷，当前The Skies Descend；默认简介，不能从历史榜倒推当前混沌职务 |
| 21 | Cold Sin／2120847059 | 头衔“我的心好冷”；我的心好冷，与Lone Heart小号同当前混沌合并；简介推荐多名虚拟主播，不认作其本人平台账号 |
| 22 | lingdu9／2122616750 | 头衔“#5019,零度”；零度；同#5019、当前混沌，归MrPW组 |
| 23 | make77／2115544472 | 头衔“#6353,77”；77，简介“你要跳舞吗”，待具体事件 |
| 24 | Lonely Devil／1199763738 | 头衔“#4567 寂寞”；寂寞，简介收藏铁壁及旗舰战果，待独立故事／职责 |
| 25 | MCtimes／2119942097 | 头衔“#4379 夹子 『 混沌凤雏』『混沌第一跳驱巴图鲁』混沌格里菲斯 夹子你准备好了吗？太监点妓女干看着”；夹子；“混沌凤雏”“混沌第一跳驱巴图鲁”，简介有名为“指挥”的设置，未据此认FC；护航争议中的小夹子已对应本人，独立争执已归[短传与素材](../../src/people/mctimes/materials-mctimes.md) |
| 26 | Vantler／2115274985 | 头衔“#1804，混沌-大V 1C”；大V；本人名Vantler与既有混沌团务回忆署名同名、同团，归该回忆作者；简介列材料学院建筑、战果及VantIer近名，后者未查 |
| 27 | Margarite Main／2122724223 | 头衔“#5306,派大星，我摸出来归魂图了！”；派大星，自写摸出归魂图，未核具体产出日期、物品和价值 |
| 28 | TenRou-D／2122635106 | 头衔“#5217,天狼”；天狼；简介将stewpenny贝斯特拉列2024年度最佳，沿退团争议被点名催促者继续对应 |
| 29 | Boanerges Du／2112804882 | 头衔“松鼠”；松鼠；简介转贴Weiss I Schnee询问集结配置及10seconds回复，另讥刺老山楂，均不认作本人对话或实际损失；上下文待补 |
| 30 | MrPD／2122385126 | 头衔“#5019,零度”；零度，归MrPW组六号 |
| 31 | Tylff／2122354926 | 头衔“#4987,团言”；团言；简介为市场估价、扫描与广播入口，待故事／职责 |
| 32 | jueduilingdu／2122501038 | 头衔“零度”；零度，中文词根加同当前混沌，归MrPW组六号 |
| 33 | NightsongzZ／2121393491 | 头衔“麻瓜小号”；麻瓜小号，自报小号但主号未找到；收藏战果不直接并入同名其他人 |
| 34 | Netalon／2113915950 | 头衔“坦克”；坦克；收藏两条元帅等入口，待本人参与及事件 |
| 35 | EVENVIC／2122610073 | 头衔“#5184,伊文”；伊文；简介仅广播，待故事／职责 |
| 36 | Huan mengyang／2123059890 | 头衔“#5591,桓孟阳”；桓孟阳；收藏本人战损、Norausdot与其他战果，提醒堵门放眼；CCP Swift聊天转贴不证明对话对象是本人 |
| 37 | Stealth crutch／2122297041 | 头衔“#4973,潜行拐杖，杆子爱心快递，我但凡吃一次独食，我船必炸。”；潜行拐杖，自称杆子爱心快递、吃独食必炸船；简介10B加姆为其标题说法，价值与参与待核 |
| 38 | qwquqaq／2117312483 | 头衔“阙”；阙／贪生怕死，归已有列传，当前星尘；4B合同旧说法与战果沿本人素材，不重复分号 |
| 39 | Sauce Lemon／2114218742 | 头衔“#3038，混沌-茄子”；茄子；简介阿巴阿巴，待故事／职责 |
| 40 | WLlng／2122271544 | 头衔“清水”；清水，归已有列传；简介古文不认本人原创 |
| 41 | HongXing111／2122809539 | 头衔“#5367,红星”；红星；自记首杀、首旗舰KM、首次无畏签名，不据签名认FC；战果待核 |
| 42 | adv233／2119992106 | 头衔“#4408 副词”；副词，简介空，待故事／职责 |
| 43 | Lone Heart／2121645454 | 头衔“我的心好冷小号”；我的心好冷小号，同当前混沌归Cold Sin；推荐主播不认本人的账号 |
| 44 | AMC-Special-Operations／2118142524 | 头衔“idf”；idf，当前Leaders Of The Ming Dynasty；近名IDF-Special-Operations及多战果入口，近名号尚未核团籍，不直接合并 |
| 45 | Ling 1 123／2123433497 | 头衔“#5929,凌”；凌，简介空，待故事／职责 |
| 46 | Aupas Jula Shihari／2121496247 | 头衔“#4844,无间道”；无间道；自嘲F1 Monkey、恶狼高手及收藏GM／CCP战果，不认FC或官方身份 |
| 47 | an yeu／2122293915 | 头衔“#4951,易武”；易武；明确自述第一次指挥，五条原始KM已核，归新短传与本人素材 |
| 48 | June Kalfren／96324900 | 头衔“无”；无头衔；英文战锤口号与元帅收藏，中文社区对应待核 |
| 49 | ces-mots-sonnent-faux／2113420879 | 头衔“鱼头”；鱼头，当前SARD；自称反馒七年、感谢TGA旧团友但除DomiTyphoon，具体旧争议待补；与BOP鱼头号没有同人桥 |
| 50 | AsterRoid／2122371985 | 头衔“#4998,艾佛里”；艾佛里，与Mr Lightt同中文头衔、当前混沌，归一人；默认简介 |

零度目前按六号归一：MrPW（2122394319）、MrWPRG（2122394239）、MrPRW（2122384975）、lingdu9（2122616750）、MrPD（2122385126）、jueduilingdu（2122501038）。前五号同#5019与零度中文称呼；末号同零度词根且同当前混沌，按近名规则归本人。六号均默认简介，不用多号排名补造FC履历。
Hadal Pedel（2121497006）与Losschyve Thellere（2121495206）同#4693吴磊磊；AsterRoid（2122371985）与Mr Lightt（1299744592）同艾佛里；Lone Heart（2121645454）自报我的心好冷小号，对应Cold Sin（2120847059）。各组同当前混沌，不分号收录。
易武自述指挥与具体KM已归[本人素材](../../src/people/an-yeu/materials-an-yeu.md)并写短传；其余方向仍沿本表追职责和独立事件。Vantler的老团回忆复用[共享摘要](../sources/corp-vitality-debate-2025.md)。封督／丰都、天狼与[石头争议](../../src/people/onlystone/materials-onlystone.md)有同团称呼线索；夹子已对应[护航收费争议](../../src/people/ai-ruo/materials-ai-ruo.md)里的小夹子，MCtimes已立短传，见[本人素材](../../src/people/mctimes/materials-mctimes.md)。

## PLA前十续查（2026-10-14）

原榜前十中Jason Yusi、Silvitni复用已有列传；Leela Sirene与SlayerRsBoxeR复用成功缓存，另六号ESI头衔／简介已取得并核读。Potential Impact同“7-Up”头衔同当前PLA，简介展示也与七喜旧传相合，归[七喜素材](../../src/people/han-dong/materials-han-dong.md)，不另写七秒或新增同名人物。本人所贴MY-T2P BR已核11条KM、109.91B损失，七喜寡妇围猎渡神、GA逍遥阔刀反击均入文；低于大型门槛，见[共享事件](../sources/my-t2p-freighter-2026-04-14.md)。

| 角色／ID | 已核头衔、内容 | 下一步 |
| --- | --- | --- |
| Leela Sirene／1212703823 | Hito；仅表情，复用10月12日快照，PLA／Goons | 独立事件与账号；不并HiToMinG／所思 |
| SlayerRsBoxeR／2121940078 | 太空.；默认简介，复用10月12日快照，当前Kun-Lun98825941／Goons | 具体故事与小号；PLA历史高榜不等于仍在PLA |
| Honour Karachi／96392074 | 骄阳；简介空，当前PLA／Goons | 社区账号／事件，不以普通外号随意并同名 |
| Diana Mayaki／2115143826 | 没人要；简介操作失误求谅的自嘲、总览、广播与文字符号 | 本人作品或独立事件；不把自嘲写成疾病／现实健康状况，通用总览不作FC职责 |
| Anakin Force／94192328 | 帝国隐秘部队；简介三份天使无畏／泰坦入口 | 先核链接属性，不当本人驾驶或旗舰损失；身份与事件待查 |
| admire mirriri／94385114 | 阿咪；简介引马太福音6:24，不能同时服侍God与Money | 是本人引用，不编信仰、贪财争议或原创；角色已定位，故事待查 |
| Davy Jones FlyingDutch／2115867394 | Davy；简介挂PLA新人启动500M福利、总览3.3、出勤链接、CCP Swift与Zelus舰队台风KM | 招新链接可找作者／实际职责，不能由一份广告认CEO或重要管理；原始KM待读 |

标题中的联系号码均不保存。余七人只到认号／读简介，继续留本表；成功缓存不重抓。其他号当前PLA／Goons仅代表快照核对日，历史名次不倒推岗位。三条巨蟒／元帅收藏仍未核原始参与，不与已核BR混称完整本人战役清单。

## PLA前50头衔增量（2026-10-14）

历史榜第11—50名的公开头衔与完整简介已核读；阿古斯既有画像复用，新增39次ESI请求，合前十已覆盖前50。未查个人船型统计，不将历史排名或总览分享认作岗位。联系方式不归档，中文名只按游戏名片使用。

| 名次 | 角色／ID | 公开头衔与已读内容 |
| --- | --- | --- |
| 11 | Charles Handsome／96652401 | 头衔“无”；无头衔；当前Odins Call（98370861），英文配船与战果入口，未建中文社区对应 |
| 12 | Mickey WANG／2113673259 | 头衔“麦奇”；麦奇，简介DOTLAN、市场、KB与PAP工具入口，与thearchy同当前PLA合并 |
| 13 | AlexYu1120／2122119681 | 头衔“小鱼”；小鱼，收藏蛋与阿塔诺战果，未核本人事件；联系方式不留 |
| 14 | g-j-t／94394939 | 头衔“冷凝迷”；冷凝迷，简介空，待故事／职责 |
| 15 | Agus Amar／2112722922 | 头衔“阿古斯”；阿古斯；复用既有线索与RedMoon总览读取，不重复已停止关键词分支 |
| 16 | Hysterics／176486276 | 头衔“什麽煙”；什麽煙，简介兰亭集序，未认作本人作品 |
| 17 | Rock Krystallos／2114196674 | 头衔“蚂蚁”；蚂蚁，简介空，待社区署名／事件 |
| 18 | Panzerkom／1189447863 | 头衔“无”；无头衔；当前退团状态，简介游戏物品EXOTIC DANCERS出售文案，不认现实行为 |
| 19 | ZzeBra Hemanseh／2116510466 | 头衔“斑马”；斑马，简介星城战果链接，待独立故事／职责 |
| 20 | Oblivion Mzzz／2112560657 | 头衔“渔夫”；渔夫，简介空，待社区署名／事件 |
| 21 | Akenairos Tuka Ichinumi／2120633401 | 头衔“蒜苗葵花”；蒜苗葵花，简介英文cockatoo诗式文案，未认本人原创 |
| 22 | Eternal Starsea／96099470 | 头衔“永恒星海”；永恒星海；简介符号，不据StarSea词形认成海哥哥／星海神谕 |
| 23 | StPeterTG／2120561038 | 头衔“圣鞠斯特”；圣鞠斯特，自嘲F1 Monkey与无害刷钱人，待事件 |
| 24 | Xu li01／2112243457 | 头衔“猪哥”；猪哥；简介PLA总览、Jason Yusi与Z Natalya角色链接，后两者不直接并号 |
| 25 | robin j／2115645339 | 头衔“无”；无头衔，当前Infinity Avenger；中英日俄四语“哥哥不打”及战果收藏，10B蛋为标题说法未核价值 |
| 26 | rock chen／141862398 | 头衔“无”；无头衔，当前Balance of Power Co.（98822175）；简介游戏铭牌与药剂，不认作本人教官职务 |
| 27 | naya Hakomairos／2113337567 | 头衔“质子猫”；质子猫，简介空，待故事／职责 |
| 28 | 6666666 6／2114834014 | 头衔“小洋-帝国第一白毛控”；小洋，归已有列传；公开头衔为帝国第一白毛控，收藏多条稀有旗舰战果，不将全墙均认本人参与 |
| 29 | Sky Otomeya／92438641 | 头衔“Andy”；Andy，简介空，待中文对应／职责 |
| 30 | Overlord Chen／2113903685 | 头衔“草鱼”；草鱼，简介诗式文案与字符画，未认本人原创或真实关系故事 |
| 31 | Y Snow／95852110 | 头衔“无”；无头衔、当前退团；自列FWST-8、319-3D、YZ9-F6、M2-XFE等战役名与英特纳雄耐尔歌词，逐场本人角色与职责未核 |
| 32 | ERICMU／2112141372 | 头衔“牧童”；牧童，与B MU同当前PLA、同中文头衔，合并一人 |
| 33 | Ser Bus／1468003362 | 头衔“无”；无头衔、当前退团；REKT/Kappa文案及本人神使损失入口，待独立故事／职责 |
| 34 | Bibby Sany／2113364884 | 头衔“豆豆”；豆豆，自称Skin manufacturers，列Cyan Blue、Sakura powder、芙宁娜、流光之影、Earth Federation、Zeon六个派瑞根中心上架入口；作品内容未读，待核本人制作及作品互动；另收藏战果和R.I.P.PH BR |
| 35 | B MU／2112315549 | 头衔“牧童”；牧童，归ERICMU同人组 |
| 36 | Danny Z／2113701784 | 头衔“无”；无头衔、简介空，当前Ouroboros union（98807451），待中文身份 |
| 37 | Austin Tagelian／2114865948 | 头衔“描述”；头衔描述、简介空，当前Corp de Chinese（98803292），待中文身份 |
| 38 | coconal／609962763 | 头衔“Hito”；Hito，与Leela Sirene同个性头衔、同PLA，连同Gibidin归一人；不合并HiToMinG／所思 |
| 39 | 9-Lives／2120197866 | 头衔“九命鸭”；九命鸭，自嘲F1等默认文案并挂TTC索迪约入口，参与与故事待核 |
| 40 | Makur LaMatar／90823860 | 头衔“无”；无头衔、当前退团，简介Delay No More!!733，待中文对应 |
| 41 | iDea Center1／2112343155 | 头衔“柯西”；柯西，简介空，待职责／故事 |
| 42 | IICHNIIMarshall Man／96713698 | 头衔“老司机”；老司机，简介符号，称呼常见不据此跨团并号 |
| 43 | Gibidin／939520039 | 头衔“Hito”；Hito，归Leela Sirene／coconal组 |
| 44 | Kohinata Yui／2112987713 | 头衔“啪基”；啪基，简介空，待故事／职责 |
| 45 | Aurora Adrianne／92186581 | 头衔“亚伯”；亚伯，简介字符画及广播，不认原创或FC |
| 46 | Foden Lu／2116181251 | 头衔“狠毒男孩”；狠毒男孩，简介玛卡巴卡，待故事／职责 |
| 47 | Caldari Citizen 90035293／90035293 | 头衔“斯巴达”；斯巴达，简介I dreamed a dream，待职责／社区署名 |
| 48 | thearchy／2113887620 | 头衔“麦奇”；麦奇，简介bbbb，归Mickey WANG |
| 49 | Razzle MyHeart／94631248 | 头衔“无”；无头衔、当前退团；简介NPC抗性与信号表，未见个人故事／职责 |
| 50 | MidnightW／2120907205 | 头衔“随便”；随便，默认简介，待故事／职责 |

麦奇两号为Mickey WANG（2113673259）、thearchy（2113887620）；牧童两号为ERICMU（2112141372）、B MU（2112315549）。两组各自同公开中文头衔、同当前PLA，直接归一人。
Hito组为原榜首Leela Sirene（1212703823）、coconal（609962763）、Gibidin（939520039）；三号同个性头衔、同当前PLA，归一人，前两号英文名差异不阻止头衔对应。与另一候选HiToMinG／所思仍无同人桥。
豆豆的六条SKIN商品入口与Y Snow战役记述是后续具体阅读方向；当前只读名片，作品实质、逐场本人参战和职责均尚未核，不把待读入口包装成已完成创作或指挥调查。其余中文称呼按本表继续找社区署名与职责。

## 伏羲前50头衔增量（2026-10-14）

历史榜第11—50名的公开头衔与完整简介已核读；麦兜与JKK成功画像复用，新增38次ESI请求。前十已有头衔／简介读取与人物素材，合计前50已覆盖；未跑个人船型统计。已有列传对应仍按角色与素材，旧研究指针不作为同人依据。

| 名次 | 角色／ID | 公开头衔与已读内容 |
| --- | --- | --- |
| 11 | Platinum Hunter／2113100787 | 头衔“Platinum Hunter”；英文头衔同角色名、简介空，中文署名／职责待查 |
| 12 | FeuerLiebFeuer／2118470981 | 头衔“牢壁”；牢壁；简介皮肤世界观、战果、总览与邀请链接，不作本人经历 |
| 13 | toosy／2114952488 | 头衔“土司”；土司，当前Actual Xanadu（98725089）；简介总览及Bubble Victims Alliance，职责／故事待查 |
| 14 | FFF group／2118846595 | 头衔“栗子”；栗子，当前SARD；简介“蕾妮·干妮玛”及广播，不据FFF词形认作其他F组人物 |
| 15 | Lamphare Arb／2113965229 | 头衔“Lafiel.Abriel 拉斐尔.亚布利亚尔 星界的战旗”；Lafiel.Abriel／拉斐尔.亚布利亚尔／星界的战旗，简介日文文案，不认角色作品原创 |
| 16 | Hydra hzy／2114861780 | 头衔“代行天威”；代行天威，与Medusa Serenity同个性中文头衔、同当前伏羲，合并一人 |
| 17 | kenkjia／2117494997 | 头衔“钢铁魔尊 - Steel Demon Lord”；钢铁魔尊，简介see you cowgirl等文案，待事件 |
| 18 | Eldoris massFIr／2113463433 | 头衔“八方”；八方，简介复读舰队集结配置连问，不作本人实际发问或指挥经历 |
| 19 | Andrea Alfrir／2113593488 | 头衔“2A”；2A，简介空，待中文对应 |
| 20 | michelle Dreamgirls／91631442 | 头衔“铁头”；铁头；简介游戏内5亿赎船／舱、20秒付款文案，与Lucy Yotosolo同头衔同团同文案合并；实际实施与履约待核 |
| 21 | Er1ck Thakrar／1641824959 | 头衔“星之声”；星之声，收藏三条larren lawson Monitor战果、舰种总览；与HearStaR同当前团同头衔归一人，不以打过Monitor认本人FC |
| 22 | Qin Shan／2114834426 | 头衔“青衫”；青衫；简介健康游戏忠告、Lineheart Fuxi与Batou Hinken角色链接，不直接认同人 |
| 23 | fenix fs／2113735458 | 头衔“麦兜”；麦兜，复用创世榜已读画像，待独立故事／职责 |
| 24 | Flame-Hair Shana／93696576 | 头衔“夏娜”；夏娜，自写吾王赐予英勇无畏的夏娜酱，待事件 |
| 25 | Master Chrysanthemum／2118219489 | 头衔“亮剑”；亮剑，自述多开操作失误请提醒、请勿口臭，简介抗性及传电数表，未见独立失误事件 |
| 26 | MrDiao／1387156123 | 头衔“总监 福利发放 多宇宙高维战神”；叼爷，已有列传；公开头衔总监／福利发放，实际任职期仍待补，安全执照文案沿本人已有强暴教材素材 |
| 27 | Muggeseggele ZED／2113032134 | 头衔“亮仔”；亮仔，简介空，待故事／职责 |
| 28 | Lucy Yotosolo／2115023340 | 头衔“铁头”；铁头，归michelle Dreamgirls同人组；简介抢劫运钞车、100b安抚者标题等战果，具体价值、参与及事件待核 |
| 29 | March 7th／2121587357 | 头衔“星神, 三月七”；星神／三月七，自写休闲游戏快乐自己，待故事／职责 |
| 30 | Skywalker H／2116201497 | 头衔“Skywalker”；Skywalker，简介空，待中文对应 |
| 31 | Ortun／2112896359 | 头衔“图”；图，简介空，待故事／职责 |
| 32 | zk LTL／91860761 | 头衔“zk LTL”；英文头衔zk LTL，简介单句拼音梗，不作独立事件 |
| 33 | Mule Sukarala／2116368723 | 头衔“Mule Sukarala”；英文头衔同角色名、简介空，待中文对应 |
| 34 | freeman gadon／2113349225 | 头衔“嘎咚”；嘎咚，简介空，待故事／职责 |
| 35 | fliet99／91254848 | 头衔“舵主☆黑PA”；舵主／黑PA，归已有列传，当前Tuvan；简介总览及战果，不倒推当前伏羲职位 |
| 36 | SUMMER-RAIN bilibili／2113965942 | 头衔“夏目”；夏目；角色名带bilibili，未取得可对应的UP账号；简介空，平台身份与作品文字材料待核，不读视频 |
| 37 | Quantum Whirlpools／2112549782 | 头衔“量子漩涡”；量子漩涡，简介光锥之内即是命运与字符画，不作原创或人物事件 |
| 38 | Dragontadie Ancient／91398306 | 头衔“龙马”；龙马，简介万物皆备于我、吾心即是宇宙与英文翻译，不认本人哲学作品 |
| 39 | Mina Dethahal／2118776119 | 头衔“瞑衍/FC/总监”；瞑衍，已有列传；明确自报FC／总监，自记魔像十颗星与最终本人战损，原始KM未在本轮重抓 |
| 40 | Dulanda Nolen／2112987410 | 头衔“诺兰”；诺兰，简介空，待故事／职责 |
| 41 | cjy／2114293317 | 头衔“无”；无头衔；简介“出门带针的必要性”及B站BV1cT411a7rq链接，UP账号未归本人；只留文字入口，未看影像 |
| 42 | Sayori izumi／2120590678 | 头衔“Sayori”；Sayori，简介YouTube链接，账号与作者未对应，不读视频 |
| 43 | chen yuwp／2113220934 | 头衔“chen yuwp”；英文头衔同角色名，简介ECM颜色、燃烧任务与抗性备忘，不认原创教学或FC |
| 44 | MRpenguin1／2119444705 | 头衔“企鹅先生”；企鹅先生；简介窝窝屎误国、重拦／拉克、停电等自嘲及Chinatech猎獒战果入口，未据泛化玩笑造翻车事件 |
| 45 | j0kk3rr／1902361257 | 头衔“总监/Director”；JKK，归已有列传；复用公开总监／Director、FC招募、月卡补损及中英德文福利广告，不将广告承诺写成逐项已兑现 |
| 46 | Tong Lazair／2114980001 | 头衔“咖啡”；咖啡，简介总览与广播，待故事／职责 |
| 47 | HearStaR／1201767821 | 头衔“星之声”；星之声，归Er1ck Thakrar组，简介建筑跳桥路线，不认其拥有或主持建设 |
| 48 | linke china／2115558702 | 头衔“林柯”；林柯，简介空，待故事／职责 |
| 49 | xzl520／2121282068 | 头衔“♡猫娘♡”；猫娘，归已有列传；复用头衔与作品入口，不据常规FC总览标题另立FC证据 |
| 50 | Omega Crucis／2113866246 | 头衔“公瑾”；公瑾，简介字符画，待故事／职责 |

代行天威为Medusa Serenity（2114912504）与Hydra hzy（2114861780），两号同个性中文头衔、同当前伏羲，直接归一人。铁头为michelle Dreamgirls（91631442）与Lucy Yotosolo（2115023340），同中文头衔、同团且同5亿赎船／舱文案；保留为游戏内说法，未查到具体实施或违约事件。星之声为Er1ck Thakrar（1641824959）、HearStaR（1201767821），同中文头衔、同团，归一人。
本人简介的普通总览、格言与泛化自嘲仍不单独立传。夏目、cjy与Sayori保留视频入口或平台名线索，未读影像、字幕、转写或声音；链接作者也未归本人。当前继续优先中文署名、实际职责与独立社区事件。

## 特执前十续查（2026-10-14）

复用嗜血、蜜柑列传与乌黑的手旧调查，固定补七号ESI头衔／简介。别杀朕已通过官方论坛同名角色发帖及SARD自述对应，2019卖角色求翻译、2020LP求助、2024三帖贝斯特拉竞价均读完整可见文字，归[本人素材](../../src/people/bieshazhen-bc/materials-bieshazhen-bc.md)并立传；原始127809541核本人诅咒参与贝斯特拉击杀，116978089核本人海神损失，自嘲不单独作收录依据。未读视频或字幕。

| 角色／ID | 已核内容 | 下一步 |
| --- | --- | --- |
| Manaplease／2122398589 | 头衔亚棍；简介FB／SFB标记、Varell Jast阿特龙、Einar Eliakim Valravn、SomeoneStrange元帅两条入口及Y-2ANO书签 | 原始KM和本人具体故事；标记不直接认最后一击或单杀，书签不认任职 |
| Y PAPA／2118096329 | 帕帕；简介总览／广播、PVE伤害与2023年赏金日志、CCP Dren的Cockroach链接与霍夫比入口 | 本人事件、小号与原始KM；原日志不扩大成生涯收入，NPC对象不写人物履历，链接不认本人驾驶 |
| DMY WST／2115249232 | 老张；简介“臣等正欲战死，陛下何故跳刀”“宁也是婊妹” | 是游戏梗与引句，未对应具体撤退事件或表妹本人；继续找账号／具体职务 |
| Youleland／2123721775 | 游乐园；简介字符画 | 本人事件与小号，不从画推作者作品或性格 |
| Sebander Nick／2113355387 | 沛川；简介自报本人名、US Time Zone，劝在战斗中历练、放平心态 | 文字社区账号、带队／事件，时区不认现实所在地 |
| paper clipcc／2116185481 | 缘来麾下今落幕；简介空 | 原中文外号或账号及具体故事，不把诗句变成生平 |

七号当前均为SARD／FRT，仅代表2026-10-14核对日。贴吧客户端各一页“eve欧服 别杀朕”“eve欧服 沛川”返回拆词／大量无关结果，未有效命中本人，不能记成严格零结果；不继续同词扩页。公开精确英文检索找到别杀官方论坛故事；中文沛川查询仍有无关现实人物，不收现实身份资料。其他六人继续留本表，不靠简介／KB立传；已读头衔与原始报告不重抓。

## 特执前50头衔增量（2026-10-14）

历史榜第11—50名公开头衔与完整简介已核读；3V与杰克既有画像复用，新增38次ESI请求。前十成功读取已复用，合前50已覆盖；另1次ESI履历核对Deedlit Liu。不跑个人船型统计。

| 名次 | 角色／ID | 公开头衔与已读内容 |
| --- | --- | --- |
| 11 | Ice Knife／2113151445 | 头衔“冰刀，SARD月矿管理”；冰刀，自报SARD月矿管理；回收文案按吉他buy95%收死亡势力装、93%压缩矿石按化矿价值及压缩气云，另列P4，90%可化矿垃圾；声称寂静谷全境回收、每晚结算。月矿具体安排与任期待补 |
| 12 | xia erdai／2113984713 | 头衔“夏尔戴”；夏尔戴，当前Actual Xanadu；简介兵贵神速、J123850及工具入口，职责待查 |
| 13 | Panther T／2113055938 | 头衔“画圆”；画圆，简介总览、广播及“你翻个锤子”，待具体事件 |
| 14 | 3VYiTie／2114314412 | 头衔“3V”；3V，复用星尘已读画像；诱导已亮等仅简介文案，不认作实际口令或FC |
| 15 | BoxeR-Z／2113333329 | 头衔“亡灵军 古小兔”；古小兔，与MouniKa同中文头衔、同当前SARD合并；简介热爱和平及稀有舰船收藏，未认本人参与 |
| 16 | youdianpiaoyi／2113976954 | 头衔“有点飘逸”；有点飘逸，简介主权时间、跳跃规划及旗舰战果，职责／事件待查 |
| 17 | bili fax／2114796586 | 头衔“无”；无头衔，当前退团，简介总览和刷怪预设，不认后勤岗位 |
| 18 | Temple9527／2114846317 | 头衔“冰城”；冰城，简介物品和夜神／贝斯特拉战果入口，待独立故事／职责 |
| 19 | Dacong／2121796036 | 头衔“大葱”；大葱，简介星城战果“国航家没了”，仅标题说法，日期、对象与本人角色待核 |
| 20 | MouniKa／2113335782 | 头衔“古小兔”；古小兔，归BoxeR-Z同人组；简介和平文案及配船／技能数字，未造具体战争事件 |
| 21 | NVIDIA HRX／2114297270 | 头衔“摇修，想当鹿野的狗，二阶堂，还没看EVA终，东堂葵真男人”；摇修，自列鹿野、二阶堂、EVA、东堂葵等文艺偏好；简介收藏救世等战果，不由昵称认后勤职务 |
| 22 | JingQi／2113836796 | 头衔“旌旗，招新官”；旌旗，自报招新官，简介空；实际招新事务／任期待补 |
| 23 | CrimsonTide／373959062 | 头衔“红潮”；红潮，简介收藏普通战果，待具体人物事件／职责 |
| 24 | littleguardsman LBLwings／2112541604 | 头衔“嗜血代管”；嗜血代管；名字littleguardsman LBLwings，简介试做型总览。只归代管关系线索，号主、代管时段与具体操作人待核，不把全号历史战果并给嗜血 |
| 25 | Kid Yili／2114345877 | 头衔“书生”；书生；简介星系、角色、工具及神使入口，收藏不作本人参与 |
| 26 | Teletubbies／2118491321 | 头衔“宝宝”；宝宝；简介改写守夜人誓词，夸张跑路、封地等不认实际弃职或背叛；自列宝宝核动力小摇篮 |
| 27 | Lieutenant Ackermann／2122003565 | 头衔“无尘”；无尘，简介用舰船加成格式写挣钱、少按弹射、多开等自嘲，待独立事件 |
| 28 | Wukong Michael／2114517132 | 头衔“悟空”；悟空，自称一发中大航，贴冥府超网订单并写“一发888，大家发发发”；获奖记录、交易结果及日期待核，不编实际赌资 |
| 29 | Jack098991／2122861740 | 头衔“杰克”；杰克，归已有列传；简介英文文案，不另收 |
| 30 | typhoooon Lee／95753951 | 头衔“༺ཌༀཉི 大 ༒ 师༃ༀད༻”；大师；自记2018低安五级任务与AFK、2023年7月阿尔法回归刷PB，9月两次毒蜥损失、2024年7月5日官员远征；目标冥府与冠名／赞助李星程星城均未兑现核验，故事上下文待补 |
| 31 | chusan yu／2120992602 | 头衔“初三”；初三，自嘲萌新乞讨、简介战果与总览，待独立故事／职责 |
| 32 | Even Rose／2112949937 | 头衔“Zero煌”；Zero煌，直接自报“个人主页”UID8370281，归ZeroHuang SS同人；两条泽尼塔超网订单分别标题赌狗的下场、赌狗应有尽有，不推实际输赢 |
| 33 | RRLF poi／2113745657 | 头衔“嗜血，总有刁民想害朕”；嗜血，与主号同中文称呼、同当前SARD，归本人；生产／矿队／总览入口，不据设置认额外指挥战役 |
| 34 | Niurtolen Isu／2122025935 | 头衔“循环 玩poe给自己玩A了”；循环，自嘲POE玩A、默认简介及CCP舱收藏，待独立事件 |
| 35 | Anonymous Comet／2121551136 | 头衔“彗星”；彗星，简介英文格言，待事件／职责 |
| 36 | GoldenJade／2122346059 | 头衔“鲸歌”；鲸歌，简介多句英文格言，未认作品原创 |
| 37 | Rhino-Y／2118985222 | 头衔“犀牛”；犀牛，收藏嗜血贝斯特拉、西布勒损失链接，本人参与与具体角色待核，不从收藏认指挥 |
| 38 | xixi shuijiao／2114107557 | 头衔“洗洗睡觉”；洗洗睡觉，简介RR总览、全槽毁灭者等预设及战果，不据预设认FC |
| 39 | Abysm X／2116291152 | 头衔“啊喽哈”；啊喽哈，简介土豆模式快捷键、广播及求放过，待独立事件 |
| 40 | Rename x／2113948330 | 头衔“小明”；小明，简介总览、会战视角、Zerg Bright预设，不据会战视角认本人创作或FC |
| 41 | inconceivabl／2114028684 | 头衔“银狐”；银狐，简介四级任务防御阈值、装备递减、ECM与抗性笔记，未认本人原创教学或具体互动 |
| 42 | Canthan Rogue／92760375 | 头衔“canthan 凯珊游侠 老外”；canthan／凯珊游侠，自标老外，中文社区交集待核，不将整个SARD视为华人个人 |
| 43 | MonikaMiHoYo／2124053076 | 头衔“小彩的莫妮卡”；小彩的莫妮卡，简介广播与洞外70洞内100，不自报FC；不因角色名认游戏公司成员 |
| 44 | icoming ohoh／2116410332 | 头衔“夏冰雹”；夏冰雹，简介广播，待事件／职责 |
| 45 | SunRY ASUKA／2118887361 | 头衔“飞鸟吃饱饱”；飞鸟吃饱饱，默认简介，具体职责与社区署名待核 |
| 46 | Deedlit Liu／2112867111 | 头衔“嗜血”；嗜血；当前军团98599770／FRT，ESI履历多次SARD且延续同中文头衔，归嗜血本人；离团不撤同人对应 |
| 47 | Angel's／2114819741 | 头衔“十七”；十七，简介同英文角色名，待事件／职责 |
| 48 | Misaka yang／2114875020 | 头衔“残月晓风，EN总监”；残月晓风，自报EN总监；具体英语事务与任期待补，联系方式不归档 |
| 49 | Berserker Aries／2114928013 | 头衔“阿瑞斯”；阿瑞斯，简介收藏战果及总览／位标，未认有本人具体带队事件 |
| 50 | GodofQueen vVv／2116949708 | 头衔“小女王”；小女王，简介空，待事件／职责 |

古小兔两号为BoxeR-Z（2113333329）、MouniKa（2113335782），同个性中文头衔、同当前SARD，归一人。冰刀的月矿管理、旌旗的招新官、残月晓风的EN总监按本人名片保留；具体事务与岗位任期继续追，不以排名代替职责内容。
RRLF poi（2113745657）同嗜血中文称呼、同当前SARD，归嗜血。Deedlit Liu（2112867111）同中文头衔、当前FRT；履历含2018-04-29、2023-11-13、2024-04-30三段入SARD，2025-10-13离SARD进入当前团，归本人另一号。littleguardsman LBLwings（2112541604）则仅明确“嗜血代管”，不据代管写成号主身份或把整个历史战果归给操作者。
Even Rose（2112949937）头衔Zero煌、同当前SARD，简介明确“个人主页”直挂UID8370281，与已核ZeroHuang SS同UP主页对应，归[Zero煌素材](../../src/people/zerohuang-ss/materials-zerohuang-ss.md)，未打开视频。
冰刀相关两组网页精确查询主要命中普通战果及无关词义，未取得具体月矿事件，未读无关网页；不将检索噪声记成人物无料。

## 昆仑前十续查（2026-10-14）

SlayerRsBoxeR复用已读太空.资料，Nany 1419复用旧传，另八号ESI头衔／简介已取得并核读。xiang sss同“幻象”头衔、同当前昆仑，归本人；非物JFK LOL自称战斗总监、七条Monitor本人字段均对上，已留[FC短传素材](../../src/people/jfk-lol/materials-jfk-lol.md)。代表KM另对上北暮，并发现红楼时期开Monitor的QingQing999／兔兔，现属昆仑，已归[兔兔素材](../../src/people/qingqing999/materials-qingqing999.md)留短传，不猜其已知FC主号。

| 角色／ID | 已核内容 | 下一步 |
| --- | --- | --- |
| Fauux／2122263187 | 虚实 Director Diplomat；公开军团简介也列总监兼外交，与重组通告虚实对应；简介17条KM分Final Blow／抽象／下水 | 2026-10-15按总监兼外交立传；17条KM已逐张核ESI，“下水”五张为本人新超旗打自家垃圾装配旗舰的剪彩首杀，见[本人素材](../../src/people/fauux/materials-fauux.md) |
| Dust McTrappist／2115976141 | 头衔08.，简介空，当前昆仑／Goons | Star McTrappist已按同词根同08头衔同团归一人；社区账号／事件待补，不跨团并混沌阿捌 |
| KuanLe---Sheng／2122530464 | 升.；自称啊升，挂Tony Goalardo洛基KM | xiaoxiaowu同升头衔同昆仑归啊升；原始KM与具体事件待补，挂墙不足立传 |
| MCefhfe123／2123546705 | 石燕；默认简介，当前军团98825114、联盟99015206，已不在昆仑 | MCefhfe123 4已按同近名同头衔同当前团归一人；社区事件待补，旧榜不当现在名册 |
| LingYunTS／2123562782 | 凌云.；默认简介，当前昆仑／Goons | 本人事件与账号，不从默认文案写性格 |
| asdaoid／2116149209 | 耳田 Director；简介空，与重组通告耳田管理对应 | 具体事务与任期；ertian-yieryi已核同耳田Director、同团归一人，不重新查人名 |

Fauux／JFK LOL公开精确英文检索主要为资料与普通战果页，仅Fauux有上述官方论坛问价；无新明确个人外交事件。三份Monitor出场角色：非物、北暮、兔兔均已对应，未另建匿名指挥名册。七条记录只代表同船型出勤，并非七场大型战役；其中六条集中同日两星系。列表原统计数字不覆盖为新个人累计，原有成功名单和本轮头衔不重抓。

## 昆仑前50头衔增量（2026-10-14）

历史榜第11—50名头衔与完整简介已核读，本批40次ESI请求；原前十读取复用，合前50已覆盖。未跑个人船型统计。名片中的职责、当日归属和历史同团分别保留，不由当前岗位倒推全年任职。

| 名次 | 角色／ID | 公开头衔与已读内容 |
| --- | --- | --- |
| 11 | Nemer1987／2115069949 | 头衔“幻象”；幻象，简介图尔基矿业八号舰，同当前昆仑归Nany 1419 |
| 12 | Aikur／2123848768 | 头衔“无”；无头衔、当前退团；与Aikur Plus／Pro同独特词根、均在昆仑历史榜，归三号；简介三省吾身自嘲与使徒收藏，不造具体冲突 |
| 13 | Kamatar Vagaer／2115070101 | 头衔“幻象”；幻象，简介图尔基矿业六号舰，归Nany 1419 |
| 14 | SHIROE233 CN2／2115410920 | 头衔“幻象”；幻象，简介空，归Nany 1419 |
| 15 | pang pang ju／2114713256 | 头衔“幻象”；幻象，简介空，归Nany 1419 |
| 16 | MSDN 576／2115070097 | 头衔“幻象”；幻象，简介图尔基矿业五号舰，归Nany 1419 |
| 17 | Nany 1440／2123834339 | 头衔“幻象”；幻象，既有Nany 1440同人关系复用，不另收 |
| 18 | mis hu Rotsuda／2116058503 | 头衔“无”；无头衔、简介空，待中文对应／职责 |
| 19 | Star McTrappist／2116044203 | 头衔“08”；08，同McTrappist词根、同当前昆仑，归Dust McTrappist一人；不跨团并混沌阿捌 |
| 20 | Amarr Noname／2115454291 | 头衔“米罗克”；米罗克，简介市场站点及CCP蟑螂入口，未核本人参与 |
| 21 | Galic Hita／2113343950 | 头衔“洋葱.”；洋葱，简介字符画，待故事／职责 |
| 22 | LookYourLeft ForKDS／2112334577 | 头衔“看左”；看左，简介舰队集结配置与旗舰操作复读问题，不当本人实际发问或指挥履历 |
| 23 | Laya A／2114862325 | 头衔“幻象”；幻象，简介图尔基矿业三号，归Nany 1419 |
| 24 | Aikur Plus／2124047662 | 头衔“无”；无头衔、当前退团；近名Aikur Plus归Aikur组，默认简介，不把退团状态写成退游 |
| 25 | Usx Yan／2116681601 | 头衔“脚气”；脚气，自称结构抗专家、列官员掉落次数与安全点分享，不核总利润或认原创教学；具体事件待补 |
| 26 | JACK-SC／2123818493 | 头衔“杰克船长.”；杰克船长，简介抗性表，中文称呼常见，不合并SARD杰克或其他杰克 |
| 27 | Rosa Ictus／2115691303 | 头衔“明月，外交官”；明月，外交官；同军团公开简介的俄语外交Rosa Ictus，实际外交事件与任期待补 |
| 28 | huanglong1／2123488040 | 头衔“黄龙.”；黄龙，归huanglong2同人；简介回收与远征出售的中英交易说明、位标和NPC资料，不因Sell ISK文字指控现实RMT |
| 29 | Royal Champion／2121755424 | 头衔“非物”；非物，同个性中文头衔、同当前昆仑归JFK LOL；默认简介，不新增战役指挥归因 |
| 30 | huanglong2／2123586424 | 头衔“黄龙”；黄龙，归huanglong1同人；简介位标、远征销售、广播及扫描谣言纠正笔记，待具体事件 |
| 31 | Bill PL／2115717111 | 头衔“大B.”；大B，简介Back from sleep及联系文案，收藏QA装备和CCP战果，不认官方身份或军团职务 |
| 32 | Uitoh kama／2124451177 | 头衔“哈亚木”；哈亚木，同yolo kama词根、同当前昆仑合并；简介空，地域字样不归档 |
| 33 | XUEAOYANG／2122632413 | 头衔“渡鸦”；渡鸦，简介八个高槽激活命令，不据此指控游戏外脚本或非法同步 |
| 34 | Nassy Blacky／2114798954 | 头衔“幻象”；幻象，简介图尔基矿业七号舰，归Nany 1419 |
| 35 | XD 26／2117285345 | 头衔“虚实”；虚实，同Fauux中文头衔、同当前昆仑，归一人；简介英文歌词，不造政治含义 |
| 36 | Lu3000／2122953406 | 头衔“陆三千”；陆三千，收藏CCP舱、纪念碑等，具体参与和事件待核 |
| 37 | Ysera Olsen／2113377474 | 头衔“伊瑟拉.”；伊瑟拉，简介仿舰船加成的IQ、好运、利润自嘲，不认实际作弊或人物事件 |
| 38 | ertian-yieryi／2116450019 | 头衔“耳田 Director”；耳田 Director，同asdaoid中文头衔与职务、同当前昆仑，直接归一人；简介空 |
| 39 | MCefhfe123 4／2124111876 | 头衔“石燕”；石燕，同MCefhfe123词根与头衔，且同当前军团98825114，归原号；默认简介，已离昆仑，不倒推现职 |
| 40 | Le petit-bonhomme en-mousse／2114066671 | 头衔“夜泛白”；夜泛白，简介工业杀手，具体职责／故事待核 |
| 41 | Aikur Pro／2124048300 | 头衔“无”；Aikur Pro，无头衔、当前退团，归Aikur组；不以普通退团军团名作身份依据，复用历史同团与独特词根 |
| 42 | yolo kama／2124462170 | 头衔“哈亚木”；哈亚木，归Uitoh kama组，简介空 |
| 43 | Bella rong／91902918 | 头衔“独行侠.”；独行侠，简介字符画、法文格言与虫洞寿命／质量／类型表，不认原创教学 |
| 44 | xiang yi Dave／2114881733 | 头衔“相忆”；相忆，简介广播、武台自用、昆仑点及RR总览，未据预设认FC |
| 45 | Cabbage0-0／2123433193 | 头衔“包菜”；包菜，默认简介；同词根Cabbage号众多，不并其他白菜／包菜角色 |
| 46 | jieshirui812／2115534603 | 头衔“812”；812，简介空，不认现实个人身份 |
| 47 | edge zandy zhang／93606880 | 头衔“阳光.”；阳光，简介RedMoon包、位标、战果等，不认总览原创或个人旗舰参与 |
| 48 | xiaoxiaowu／2122847728 | 头衔“升”；升，与KuanLe---Sheng的升头衔、自称啊升及同当前昆仑对应，直接归一人；具体事件待补 |
| 49 | xiatian1003／2124468965 | 头衔“无心”；无心，简介空，待职责／故事 |
| 50 | Ademondun／2114557453 | 头衔“埃德唐顿.”；埃德唐顿，自列frist km及Gideon Zendikar舱战果，待独立故事／职责 |

Nemer1987、Kamatar Vagaer、SHIROE233 CN2、pang pang ju、MSDN 576、Laya A、Nassy Blacky七号均同“幻象”头衔、同当前昆仑，部分简介直接列图尔基矿业三／五／六／七／八号舰，归[幻象](../../src/people/nany-1419/materials-nany-1419.md)并列aliases。Nany 1440复用已有对应；矿业名片不单独证明任矿业负责人。Royal Champion同非物头衔、同昆仑，归[非物](../../src/people/jfk-lol/materials-jfk-lol.md)，不分号立传。
耳田为asdaoid（2116149209）、ertian-yieryi（2116450019），两号同“耳田 Director”、同当前昆仑，旧近音候选已升级为直接头衔对应。虚实为Fauux（2122263187）、XD 26（2117285345），同中文头衔、同当前昆仑；职责来源仍用Fauux公开总监／外交与重组通告，不将所有战果都认其指挥。
08的Dust McTrappist与Star McTrappist同词根、同头衔变体且同昆仑；黄龙两号huanglong1／2同近名、同中文头衔、同团；哈亚木两号Uitoh kama／yolo kama同词根、同中文头衔、同团；石燕MCefhfe123／MCefhfe123 4同词根、头衔且同当前98825114。各组合并真人方向，未因多号榜数扩写故事。Aikur、Aikur Plus、Aikur Pro按独特词根与三号历史昆仑记录归一人；现已退团，不把普通退团状态当作独立事件。
明月Rosa Ictus的外交名片与军团简介的俄语外交一致，具体事务待补。xiaoxiaowu（2122847728）同KuanLe---Sheng（2122530464）升头衔、同当前昆仑；后者自称啊升，直接归同一人，不因头衔省略标点另建身份问题。具体战果／事件仍沿原号材料核。

## 创世前十续查（2026-10-14）

莫凡复用原线索，其余九号ESI头衔／简介已取得并核读。旧人揪心ROSEMARY m明确自称FC，以本人说法留[短传素材](../../src/people/rosemary-m/materials-rosemary-m.md)；本人元帅损失及归魂者攻击记录已核，另一条飞龙未见本号，不把收藏全写本人经历。出其东门WhyYouSoFW对上两千公开“风传”配装讥刺中的人物，故事归[本人素材](../../src/people/why-you-so-fw/materials-why-you-so-fw.md)，以来源方版本写；两千旧稿自行加的磁场稳定器／熵能散热槽方向解释已删除，不扩成游戏机制结论。其他七人保留具体缺口，不靠挂墙、自嘲或普通本地单句立传。

| 角色／ID | 已核内容 | 下一步 |
| --- | --- | --- |
| fenix fs／2113735458 | 麦兜；当前伏羲／FRT，简介两条无畏收藏及总览 | 原始KM、社区账号和本人事件，不并其他常见麦兜 |
| Bstls／2118525346 | 一曲，Fake news，总监；当前SARD／FRT，简介字符画 | 实际管理事务／独立故事；不因英文头衔认新闻作者，不将阿鸮口嗨单句定为本人事件 |
| JW LMY／2115218970 | 沐色；当前AMIYA／FRT，简介总览、本人金鹏及多条超旗／泰坦收藏 | 主小号、原始参与与事件；配置日期23.2.14不当实际参战日期，蟑螂配装不认本人驾驶 |
| CH-MAX／2117562356 | 迈克斯#15701；当前SARD／FRT，简介多条无畏、结构及克洛诺斯收藏；4-H本地普通一句沿旧共享材料 | 不与雪山飞鸟Zhongcaizhe MAX并人，独立事件待查 |
| Tofu Hunter／2116612115 | 豆腐；当前AMIYA／FRT，培训名单列新人教官培训；简介ATM自嘲、估值／装备／虫洞工具、Nix Wittro灾难海军同一目标三语收藏 | 具体教学与培训作品／互动，头衔不写成现实关系；同一目标三语不是三场战斗 |
| confused summer／2113000787 | 别样；当前SARD／FRT，简介总览、物流与远征联系人列表 | 联系人不是本人小号；本人账号、实际事务与独立故事 |
| 24K Cake／2116514884 | 无头衔；当前AMIYA／FRT，简介一个点 | 中文外号、主小号与事件，不从英文蛋糕名编人设 |

两项公开精确英文查询未取得本人新论坛故事，ROSEMARY m混入无关现实同名结果，不收现实身份资料。两千当前公开简介已全文复核，原明确“风传”保留；东门原始事故的日期、KM与本人回应仍待补。既有普通自嘲不与文言故事编为同一次互动。首轮成功名单和旧取得来源复用，原榜击杀／ISK没有覆盖为新个人stats；当前军团变化只记身份字段，不把旧榜当现役创世名单。

## 创世前50头衔增量（2026-10-14）

历史榜第11—50名头衔与完整简介已核读；沛川、画圆成功画像复用，新增38次ESI请求。前十已读名片与人物素材复用，合前50已覆盖；未跑个人船型统计。历史排名与当日退团／转团状态分开，不以名片所列所有战果认本人参与。

| 名次 | 角色／ID | 公开头衔与已读内容 |
| --- | --- | --- |
| 11 | Sebander Nick／2113355387 | 头衔“沛川”；沛川，复用SARD已读画像，自报US Time Zone，仍待本人事件／职责 |
| 12 | Star Battleax King／2115208085 | 头衔“战斧”；战斧，当前Arknights，简介总览／广播与diana LMY预设，未认原创或FC |
| 13 | Zirnitral／2119850771 | 头衔“泽妮塔”；泽妮塔，当前SARD，简介NPC抗性表，不认现实身份／指挥职责 |
| 14 | Demon iceman／2112580000 | 头衔“羞涩的疯狂”；羞涩的疯狂，当前Navigators Union；简介眼睛号、科莫多／无畏收藏及工具，Ryan Thrower未据链接合并 |
| 15 | LaoLiang JN／2118802099 | 头衔“老梁”；老梁，当前Arknights，简介物品／舰船链接与猫娘式文案，不认本人开过所有船或同人猫娘 |
| 16 | Ahulamumu／2115924739 | 头衔“魔域冰人”；魔域冰人，当前SARD，简介空，待事件／职责 |
| 17 | E naisama／2120002551 | 头衔“伊奈”；伊奈，当前Arknights，收藏GM Chaos蛋，不认官方身份 |
| 18 | lightcoolli Vaille／2116433808 | 头衔“酷酷”；酷酷，当前SARD，简介总览、工具与广播，待事件／职责 |
| 19 | Jason Bournne／2114348755 | 头衔“动感光波”；动感光波，简介星城／龙鸟收藏及舰队问题复读，不当本人指挥或实际问答 |
| 20 | ZI LIAN／2113713154 | 头衔“芷恋”；芷恋，当前Navigators Union；收藏表妹及科莫多／长须鲸／Monitor战果，实际参与和事件待核 |
| 21 | Mon Zamayid／2115094588 | 头衔“USTD QC”；USTD QC，当前SARD；简介自记QC Y第一条无畏刷怪被大航击毁，关联角色QC Y未核同人，普通失舰不单独立传 |
| 22 | Panda GG／2119546327 | 头衔“熊猫GG”；熊猫GG，当前伏羲；简介市场、LP、虫洞、贴吧与B站攻略入口，不认作者账号，不读视频 |
| 23 | Esamier／2119976401 | 头衔“百年”；百年，当前Arknights；简介you jump I jump等文案，待事件／职责 |
| 24 | NicholasYTZ／2119000942 | 头衔“EN/CN Diplo 特斯拉，✪ Molok开盒大师 ✪”；特斯拉，自报EN/CN Diplo、EUTZ与Molok开盒大师；简介♦索迪约与蓝图箱、T8T-RA及8F-TK3 BR入口，外交具体事件和开盒结果待核 |
| 25 | wevsty／2121046206 | 头衔“神猪”；神猪，简介总览及广播，待事件／职责 |
| 26 | Zespresso／2119562097 | 头衔“咖啡正浓, 创世唯一指定萌新，✪ 贝斯城管 ✪”；咖啡正浓，自称创世唯一指定萌新／贝斯城管；简介首KB、solo、反杀、强暴、旗舰／泰坦／AT签名与元帅超网入口，原始KM未核；共享贝斯城管称号不并其他人 |
| 27 | Christine Tekitsu／2113889064 | 头衔“无”；无头衔、简介空，当前军团98731219，中文对应待核 |
| 28 | Gauzeee Military／96262961 | 头衔“USTZ, 纱启强”；纱启强／纱布，角色ID直接归已有列传；USTZ、中英联系、晨曦移民回忆及血脉拆迁战果入口留原人物，不重造任职事件 |
| 29 | Panther T／2113055938 | 头衔“画圆”；画圆，复用SARD头衔／简介，当前SARD，历史榜不作现役创世名册 |
| 30 | Here I am／2122963042 | 头衔“烟鬼--创世第2黑”；烟鬼，自称创世第2黑，简介集结配置问题与创世位标工具，泛化自嘲不补具体黑料 |
| 31 | Bingki''wu／901028145 | 头衔“骄阳”；骄阳，当前SARD，简介字符画；与PLA骄阳没有明确同人桥，不只凭普通称呼跨团并号 |
| 32 | Queen of Club／2115155718 | 头衔“扑克牌  ♣Q”；扑克牌／草花秋／♣Q，当前Arknights，简介符号与Queen of Clubs，不认CEO／FC |
| 33 | erdai xia／2115118317 | 头衔“夏尔戴”；夏尔戴，近名erdai xia与xia erdai同中文头衔同当前Arknights，合并一人；简介附Ahri Sexy贬其PVP、称打YST奴与列糟糕声望的说法，具体冲突上下文及YST含义待补，不转述现实职业生活辱骂 |
| 34 | Jack Henry027／2116217836 | 头衔“楚风”；楚风，当前SARD，简介NPC抗性表与符号，不认实际教师或FC |
| 35 | Crazy little sharks／2113451843 | 头衔“疯狂小鲨鱼”；疯狂小鲨鱼，当前Navigators Union，简介空，待事件／职责 |
| 36 | Ashton0F Stark／2116587158 | 头衔“安舜橦”；安舜橦，简介Thera工具，游戏称呼不当现实身份 |
| 37 | MingChoa Tan／95390433 | 头衔“地球，✪ 贝斯城管 ✪”；地球／贝斯城管，简介♦索迪约入口、英文文案与字符画；本人职责及参与待核，不因贝斯城管合并别人 |
| 38 | nelemon／2121266983 | 头衔“✪谨言慎行✪，✪ 贝斯城管 ✪”；谨言慎行／贝斯城管，简介欢迎加入创世、广播与普通／泰坦战果，具体招新工作和独立事件待补 |
| 39 | LY Samoyed／2115423588 | 头衔“黎明”；黎明，当前Navigators Union，简介字符画与广播，未认总览作者或FC |
| 40 | GY1563／2118098339 | 头衔“梦中祈愿”；梦中祈愿，当前Navigators Union，自称PVP菜鸟，不作人物事件 |
| 41 | Galician0／2117641420 | 头衔“加利西亚（狼心守望者）”；加利西亚／狼心守望者，角色ID归已有列传；当前Navigators Union，FC依据沿原人物素材，不从誓词新增职位 |
| 42 | MOVAN3／2115281693 | 头衔“无”；MOVAN3，同MOVAN独特词根、同当前Arknights归莫凡；简介收藏Gackel MDC提亚玛特，具体参与未核，主号线索已存同一KM入口 |
| 43 | Mimi luya／2113903823 | 头衔“摸头怪”；摸头怪，当前SARD，简介收藏元帅、基摩拉、Molok等和总览，不认所有高价船均本人参与 |
| 44 | YeungCn／2117585878 | 头衔“无”；无头衔、简介空，当前98747085，中文身份待核 |
| 45 | Miliant Hean／2115385208 | 头衔“怀恩”；怀恩，简介虫洞编号及NPC名字备忘，不认本人原创教学或现实身份 |
| 46 | Kingwu1988 PVP／2119066525 | 头衔“1988”；1988，当前98696463；简介虫洞考古、出口、等级、质量、寿命、极化说明，未见作者署名／具体教人互动，不仅凭分享旧表写教师传 |
| 47 | tailandrice／2122643967 | 头衔“泰式香米，❤艾莉丝-格雷拉特❤”；泰式香米／艾莉丝格雷拉特，简介文学人物衰老告别段落，不认现实关系、年龄、性别或原创故事 |
| 48 | fantasy skycity／2115724452 | 头衔“fantasy”；fantasy，当前Arknights，简介三神NPC剧情文案，不写入个人履历 |
| 49 | criminals Catch／2115975570 | 头衔“疯狂的罪犯”；疯狂的罪犯，简介俄文文案、criminals Crazy／model／Caigou及Cyno UPPP链接与工具；前三近名号的团籍和角色ID未核，暂不纳同人 |
| 50 | abyss Uesugi／2114294937 | 头衔“无”；无头衔、当前退团，简介文艺句、Yvestiny链接与工具，不据单纯链接认本人账号或同人 |

特斯拉NicholasYTZ（2119000942）直接自报EN/CN Diplo、EUTZ，外交实际事务与任期待补；Molok开盒、两份BR是具体核读入口，不仅凭收藏认个人战功。咖啡正浓、地球、谨言慎行各有贝斯城管称号，人物名与当前军团之外尚无本人互链，不把共享称号认同人。
夏尔戴为xia erdai（2113984713）、erdai xia（2115118317），角色词根换序、同中文头衔、同当前Arknights，直接归一人。新号简介保存对方将其列糟糕声望的游戏内争执，说法与实际经过分开，现实职业／生活辱骂不归档。
MOVAN3（2115281693）同MOVAN词根、同当前Arknights，归[莫凡线索](movan.md)，不再另建人物。纱布与加利西亚按角色ID归已有列传，并修正原TSV仅认名未标对应的旧状态；两人当前职责与故事沿本人素材。B站攻略入口只留文字链接，未看影像、字幕或转写。

## KZU前十续查（2026-10-14）

炽天、花不语复用已有列传，其余八号ESI头衔／简介及个人stats已取得并读完。ppx-t1与Alfred Vulkan均为“阿福(英语翻译)”、同当前KZU98808817／Out of the Blue.99010877，按同头衔同团直接合成本人两号，不待额外确认；未找到足够具体的翻译事务或独立人物故事，继续取材。八份返回的船型榜未见Monitor，不等于全历史从未驾驶，不凭自动FC标签补职务。

| 人物／角色ID | 已核内容 | 下一步 |
| --- | --- | --- |
| 超级礼奈酱／RyuguRenakawaii（2123706787） | 当前KZU／Out of the Blue.；简介默认文案与Grape Penguin洛基收藏 | 原始参与、社区故事与同人，不据番剧名认跨平台作者 |
| 阿福／ppx-t1（2123091611）、Alfred Vulkan（2123035717） | 两号同头衔同团已归一。ppx自称“FOX头号大坏蛋——PPX”，把SilverVanilla小鹰KM与SkyWalker Shen游戏内尸体放在“犯罪记录”标题下；Alfred简介默认 | 英语翻译的具体协调／作品、本人事件，不把自嘲“犯罪”认现实违法，不因FOX字样归某团CEO；不与DVH的Alfred Z仅凭英文名合并 |
| shi Askiras／2115936628 | 中文头衔空、当前无联盟且不在原玩家军团；简介D manson猎敖、bingxuan 789工业材料蓝图、Anshar及多条航母／元帅等收藏 | 中文外号、主小号、原始参与与事件；同Askiras姓氏不自动并别的角色 |
| ShadowBurn X／2114638304 | 中文头衔空，当前军团98456550／DC；“注意换蛋”指向Abyssal crocodile太空舱，另贴深渊装备 | 原始KM与同人；目标名不是本号，不先写成本人忘换蛋损失，装备分享不认具体事故 |
| 竹空／Swl1oy（2120802988） | 当前KZU／Out of the Blue.，简介默认 | zhukong04已核同竹空头衔同KZU归一人；本人故事／职责待补 |
| S0dET／2121918991 | 无头衔，当前98720295／Horde99003995，简介“Live long and prosper” | 中文外号、同人和具体故事；旧KZU榜不当当前归属，不用座右铭编人格 |
| 破败／yongshiwuai（2122268803） | 头衔破败，当前98828269／BOSS99007887，简介默认 | Vimereau Serine、ak47didididi已同破败头衔同当前团归三号；本人事件待补，换团不作黑料 |

### 个人KB补查范围

以下是2026-10-14个人stats的公开累计，不改原军团all-time／recent数字；阿福主小号各列，不相加成“生涯总计”。指标只是续查主力号的入口，没有独立故事不据此立传。

| 角色 | 参与击杀 | 目标总值ISK | 损失数／损失ISK |
| --- | --- | --- | --- |
| RyuguRenakawaii | 3612 | 3841773010987 | 424／29398936056 |
| ppx-t1 | 2827 | 3794637368669 | 427／36048566244 |
| shi Askiras | 5107 | 2252751028525 | 461／48323541066 |
| Alfred Vulkan | 1959 | 897773974365 | 470／17707721390 |
| ShadowBurn X | 2557 | 1993284303887 | 297／53893052193 |
| Swl1oy | 1141 | 625450666623 | 90／12283085230 |
| S0dET | 2481 | 2202361093852 | 190／12787786787 |
| yongshiwuai | 1290 | 1013544318009 | 232／23070850849 |

公开精确ppx-t1、Alfred Vulkan查询主要为战果页及无关拆词，没有新人物故事；普通战损不作黑料，也不为凑故事扩大到无关现实同名资料。本轮没有取得／读取新视频或字幕，成功头衔与stats不重抓。阿福同人对应已成，其他中文外号、真实事务与具体事件沿本表续查。

## KZU前50头衔增量（2026-10-14）

历史榜第11—50名头衔与简介文字已核读，水哥Captain shikongsa成功画像复用，新增39次ESI请求；前十读取与已收录素材复用，合前50已覆盖。字符画只记存在，不评价作品质量。未跑个人船型统计。

| 名次 | 角色／ID | 公开头衔与已读内容 |
| --- | --- | --- |
| 11 | xiumu Dallocort／2115621247 | 头衔“朽木”；朽木，与Alen Sunji同中文头衔、同当前KZU归一人；简介字符画不作独立故事 |
| 12 | Hua1z／2123820157 | 头衔“坏坏”；坏坏，默认简介，待具体事件／职责 |
| 13 | shikongsa／2122252155 | 头衔“水哥”；水哥，角色ID直接归已有列传；简介官员名称表及广播，不认实际击杀全部官员 |
| 14 | ShadowBurn T／2114721085 | 头衔“无”；无头衔、简介空，同ShadowBurn词根且同当前98456550归ShadowBurn X；具体事件待补 |
| 15 | MiTom Mi／2113662572 | 头衔“灵韵”；灵韵，与Mimitom、SooCoool同头衔同当前KZU归三号，简介空 |
| 16 | bad g／2118451030 | 头衔“肉丝袜”；肉丝袜，当前98783407；简介中俄求放过、科莫多入口与再不贪土路自嘲，事件经过和战果待核 |
| 17 | Mimitom／2119836850 | 头衔“灵韵”；灵韵，归MiTom Mi／SooCoool组，默认简介 |
| 18 | chitian xiao／2114917439 | 头衔“炽天 清风不语，明月自来”；炽天，已核同现KZU及完整中文头衔；简介以mrpro口吻写耶舒尔／LN1P、攻略剽窃与隐投泄露争执，不把第一人称直接归炽天亲历或将炽天认成mrpro |
| 19 | Gamelife1／2122220084 | 头衔“花不语”；花不语，角色ID归已有列传；简介位标与广播，未新增独立事件 |
| 20 | Tachanka chen／2117247892 | 头衔“铖哥(德语翻译)”；铖哥，自报德语翻译；简介复读挑战／噩梦缠绕与后勤自嘲，具体翻译事务及实际对线待核 |
| 21 | Captain shikongsa／2115281834 | 头衔“水哥”；水哥，成功画像复用，已归shikongsa；简介虫洞编号，不认作本人原创 |
| 22 | Eliz Hran／2113526885 | 头衔“咩佬”；咩佬，简介空；与群聊管理咩的角色桥待补，不单凭一个字并号 |
| 23 | Amelia Yamamoto／2113165642 | 头衔“루나아라·艾米莉亚”；艾米莉亚；法文自称创办Amelia Development Foundation，募捐ISK用于船只燃料、维护等，并邀请加入A.D.F.，基金会游戏公司ID与职责待核，角色化脱贫文案不认现实年龄／生活 |
| 24 | SooCoool／2120934012 | 头衔“灵韵”；灵韵，归MiTom Mi／Mimitom组，默认简介 |
| 25 | prekeva1／2123920773 | 头衔“追忆”；追忆，默认简介，待事件／职责 |
| 26 | Arena Argenticuria／2119872547 | 头衔“永远”；永远，简介英文文案，待事件／职责 |
| 27 | huakuangzi／2121128725 | 头衔“无”；无头衔、当前98573431，简介红叶酒馆，中文名和任职待核 |
| 28 | Vimereau Serine／2122178110 | 头衔“破败”；破败，同yongshiwuai、ak47didididi头衔同当前98828269归三号；简介破败总览与工具，未认原创或FC |
| 29 | Eridanus Explorer／2113296389 | 头衔“无名杂兵”；无名杂兵，简介英文自嘲、市场及On Sale标题，不造具体商品或交易 |
| 30 | Eternal Core／2121307141 | 头衔“御天之骑”；御天之骑，默认简介，待事件／职责 |
| 31 | Boreas7／2118882331 | 头衔“无”；无头衔，当前98805774，收藏本人暴风舰队型损失，普通战损不立传 |
| 32 | ak47didididi／2121003451 | 头衔“破败”；破败，归yongshiwuai／Vimereau Serine组；抗性表与总览不作FC依据 |
| 33 | AXOLOTL-XC／2121303692 | 头衔“无”；无头衔，当前98788115；自称星门痴汉、堵门配船及多种重拦／元帅损失收藏，具体独立事件待核 |
| 34 | Yelan yao／2123003381 | 头衔“无”；无头衔、当前退团，与Yelanyao002同近名同历史KZU归一人；总览／物品入口不证明现役 |
| 35 | Alan froster／2115162092 | 头衔“阿兰”；阿兰，简介兰家收藏室、SAGA及泰坦物品／本人Enyo损失，实际事件待核 |
| 36 | Yelanyao002／2123083907 | 头衔“无”；无头衔、当前退团，归Yelan yao组，默认简介 |
| 37 | jumupobai／2122268761 | 头衔“无”；无头衔、当前98828269，收藏元帅／洛基等；名字与朽木读音有差，不跨团直接并号 |
| 38 | luoji 2338／2114505922 | 头衔“无”；无头衔、当前退团，简介NPC抗性备忘，不认实际教学 |
| 39 | chitian／2120421439 | 头衔“炽天 清风不语，明月自来”；炽天主号，复用现CEO与已有列传，不新增岗位 |
| 40 | zhukong04／2124138864 | 头衔“竹空”；竹空，同Swl1oy中文头衔、同当前KZU归一人；默认简介 |
| 41 | Zeon Finance／2113983760 | 头衔“无”；无头衔、当前New Boreas，简介广播／补损／工具入口，不据名Zeon Finance认财政主管 |
| 42 | shaomaiOvo／2123293690 | 头衔“烧卖”；烧卖，默认简介，待事件／职责 |
| 43 | Zerdt Rollard／2122602624 | 头衔“清风”；清风，简介chitian角色链接与共享总览；不因相同诗句中的清风二字或单纯链接归炽天 |
| 44 | MrZong5／2124093955 | 头衔“粽子”；粽子，当前PLA，默认简介；主小号与事件待核 |
| 45 | Akasukis／2121650258 | 头衔“楠木溪”；楠木溪，当前98804833；简介明写2026-06-08易主、原号主AFK，不把全历史统计归给现操作者；具体交接关系与现实身份不追 |
| 46 | Isabella00／2124327941 | 头衔“闽地悍匪(倭语翻译)”；闽地悍匪，自报倭语翻译，简介位标／角色链接及广播；实际翻译事务待补，不以称号认现实地区身份或违法行为 |
| 47 | Mai Chika／2115081155 | 头衔“无”；无头衔、简介空，当前98456550；与ShadowBurn号无近名桥，不只同团并人 |
| 48 | night Akiga／91772356 | 头衔“可乐”；可乐，简介总览；与可乐锅ColaPan名不全同，具体同人桥待补 |
| 49 | Alen Sunji／2121154854 | 头衔“朽木”；朽木，归xiumu Dallocort同人，简介英文短句 |
| 50 | yunyunlove／2123829102 | 头衔“云墨玄”；云墨玄，默认简介，待事件／职责 |

灵韵为MiTom Mi（2113662572）、Mimitom（2119836850）、SooCoool（2120934012），同中文头衔、同当前KZU归三号。朽木为xiumu Dallocort（2115621247）、Alen Sunji（2121154854），同中文头衔同团；竹空为Swl1oy（2120802988）、zhukong04（2124138864），同中文头衔同团；ShadowBurn T（2114721085）与ShadowBurn X（2114638304）同词根且同当前98456550；破败为yongshiwuai（2122268803）、Vimereau Serine（2122178110）、ak47didididi（2121003451），同中文头衔且同当前98828269。以上各组归一人，不合并统计。
Yelan yao（2123003381）与Yelanyao002（2123083907）按独特近名和同历史KZU归一人，现均退团；不是以普通退团军团作同人依据。楠木溪号则自写2026-06-08易主，需区分旧主和现操作者，先保留交接缺口。
chitian xiao当前头衔、团籍已经补到，旧待核项撤销。其长文用了mrpro口吻，对隐投泄露、蓝加跟踪、任务攻略剽窃争论、朋友多多语音闹事及联盟CEO偏袒发牢骚，并提Tony、王哒哒、牧星、LN1P；全文以“我是mrpro，是bgnm大将军，我要进京勤王”收束。它是炽天号公开选用的争论文本，不是炽天与mrpro同人桥，也不直接认各指控为实际发生。现实学历／职业辱骂不归档。
铖哥的德语翻译与Isabella00的倭语翻译称号留作实际职责入口；咩佬与群聊管理咩、可乐与可乐锅均继续核角色桥，不以常见或共享称呼自动并号。

## 星尘前50头衔增量（2026-10-14）

历史榜第11—50名的公开头衔与简介文字已核读，本轮40次ESI请求；前十成功读取复用，合前50已覆盖。字符画只记存在，未评价作品。具体报价另用find查重、原始KM及其唯一攻击者ESI核归因；不跑个人船型统计。

| 名次 | 角色／ID | 公开头衔与已读内容 |
| --- | --- | --- |
| 11 | 3brx／2120592889 | 头衔“陈冠希”；陈冠希，游戏头衔不认现实名人；简介装备与本人马克瑞战损，独立事件待补 |
| 12 | XiaoQi XX／2114722978 | 头衔“小气”；小气，简介WC标配伐木，待职责／事件 |
| 13 | Bryen Hummer／2113583390 | 头衔“败丶泪”；败丶泪，与Jyhh同头衔同当前The Skies Descend归两号；英文抗性说明不认本人原创 |
| 14 | Nyarlathotep Caos／95664556 | 头衔“小蔡   凛冬全境守护”；小蔡，与XiaoCaibucai同中文头衔同当前星尘归两号；简介列ATXXI前12、AOM终结及Atioth奖章文字与战果，个人获授／参与待核 |
| 15 | Avoider930516／2120142608 | 头衔“驰”；驰，简介司令栏自嘲、2022-11-08缪宁最后一舞BR、2024及2025回归记述与旗舰战果；指挥职责及具体事件待核，不以“司令”玩笑认总指挥 |
| 16 | XiaoCaibucai／2119546166 | 头衔“小蔡”；小蔡，归Nyarlathotep Caos；简介脑插与1128 Ljw凤凰收藏，实际参与待核 |
| 17 | Penelope Chelien／2114939114 | 头衔“大白鹅”；大白鹅，当前The Skies Descend，简介隐轰solo克洛诺斯入口，事件内容待核 |
| 18 | Yoluhaluka GA／2115558475 | 头衔“GA逍遥”；GA逍遥，已有列传；PVP纲领与反写荣耻、AT遴选及会战预设复用，不增加AT已参赛／总指挥归因 |
| 19 | detective pikapika／2114201370 | 头衔“皮卡丘”；皮卡丘，简介空，与创世皮卡无同人桥 |
| 20 | xiaoxin yu／2115080244 | 头衔“无”；无头衔、当前98797997；简介复制PVP纲领与TOURNEY文案，不凭共享模板认天空纸条或GA逍遥 |
| 21 | Cheryl Astelir／94260398 | 头衔“ઈ░▓█❃折纸❃█▓░༊༃”；折纸，角色ID归已有列传，当前The Skies Descend，既有故事／FC身份复用 |
| 22 | Jyhh／2113211269 | 头衔“败丶泪”；败丶泪，归Bryen Hummer组，默认简介 |
| 23 | Lativill Utrigas／2116823139 | 头衔“熊”；熊，简介自嘲及广播，待职责／事件 |
| 24 | Ccqit／2118171301 | 头衔“白莉栖”；白莉栖，简介自称爆丸小子、蛋收藏与谐音诗，不认原创或独立人物事件 |
| 25 | thinking machine／2122520201 | 头衔“略略略”；略略略，当前混沌，简介远征入口、蛋收藏和文案，不认独立事件或FC |
| 26 | 1125 Ljw／2115651960 | 头衔“天空纸条”；天空纸条，已有列传；十二大精神与反写八荣八耻复用，模板不迁为其他人的真实行动 |
| 27 | Phantom03／2115568275 | 头衔“苍蝇小号---星火公交车”；苍蝇小号／星火公交车，当前98655836；自报小号但主号未得，战果入口待核 |
| 28 | FBKFBKFBK／2118925201 | 头衔“阿福”；阿福，当前The Skies Descend，简介字符画；与KZU阿福及DVH Alfred Z无同人桥 |
| 29 | FUNNY HAPPY／2116554248 | 头衔“起飞”；起飞，当前The Skies Descend，简介空，待社区署名／事件 |
| 30 | Unimaginable unimaginable／2113169776 | 头衔“2080”；2080，当前The Skies Descend，简介普通战果及自嘲，待事件／职责 |
| 31 | Moonight Ranger／2115902563 | 头衔“月夜游侠”；月夜游侠，简介魔像／恶狼／救世战果与Atioth阿扎里尔入口，具体参与与故事待核 |
| 32 | Avives／2118446253 | 头衔“枳里”；枳里，当前The Skies Descend，默认简介，待事件／职责 |
| 33 | zhexianduiying／2120163638 | 头衔“谪仙”；谪仙，当前The Skies Descend，简介深渊NPC网／反／干扰表，不认原创教学 |
| 34 | Nost Inrain／2120625931 | 头衔“大鲸”；大鲸，默认简介，待事件／职责 |
| 35 | ygrqwerdf／2120590452 | 头衔“英胖”；英胖，简介反写荣耻、战果、2024-07-28对FC-Primary神使战斗日志及yingnianzaopang4链接；后者同人／原始KM未核 |
| 36 | Colere noire／2118869560 | 头衔“苹果梨”；苹果梨，简介脑子我爱吃脑子，不因苹果二字归DC苹果 |
| 37 | Molu ren／2115702226 | 头衔“宿命”；宿命，当前The Skies Descend，简介空，不归Choice Of Fate同名军团或别的人 |
| 38 | niewii8866／2119558628 | 头衔“聶”；聶，简介文艺句、游戏物品与GA逍遥角色链接及段子，性玩笑不认真实行为，具体事件待核 |
| 39 | Pigeon knight／2120633938 | 头衔“无”；无头衔、当前退团，默认简介，中文身份待核 |
| 40 | 1126 Ljw Saken／2116264881 | 头衔“noraus”；noraus，角色近名1126 Ljw Saken同1125 Ljw Saken词根且同当前星尘，归天空纸条；不因头衔冒称N老板本人 |
| 41 | heyboy／2122598490 | 头衔“俗染”；俗染，简介别看了，待事件／职责 |
| 42 | twistzzfyk／2123944276 | 头衔“麦香鱼 跳桥传说·唯一”；麦香鱼／跳桥传说唯一，简介新人与三角洲自嘲及战果，没有具体跳桥事故记录 |
| 43 | Mk18／2117438241 | 头衔“유지민”；韩文头衔유지민，当前The Skies Descend，收藏CCP及归魂者／旗舰等，不认现实人物或国籍 |
| 44 | wolaizhuarenle／2120183257 | 头衔“真的不吃香菜 ( =•ω•= )m”；真的不吃香菜，简介奇奇莫拉入口，待独立事件 |
| 45 | lavaLiu／2123491613 | 头衔“刘某”；刘某，简介空，头衔仅作游戏称呼 |
| 46 | julian sakurala／2114977219 | 头衔“Julian”；Julian，当前伏羲，简介符号，中文身份／故事待核 |
| 47 | Kuro Saky／95460018 | 头衔“望天-牧星7班-初级-猪猪”；望天／牧星7班初级猪猪，当前98807608，自写赤石与毛子投送，具体角色／事件待核 |
| 48 | fangfeiziwo／2115161526 | 头衔“放飞自我”；放飞自我，当前The Skies Descend，简介自记首次PVP与元帅／无畏战果，实际参与待核 |
| 49 | priset s／2115571665 | 头衔“神父  七国至尊   垃圾白给王”；神父，保护费报价不足独立立传，已转回[个人线索](priset-s.md)；3V舱收藏的攻击者另为Yen Dunier，未有同人桥，不当本人战果 |
| 50 | Marley Olacar／91715106 | 头衔“无”；无头衔、当前退团，简介字符画，只记存在，不评价人物经历 |

小蔡为Nyarlathotep Caos（95664556）、XiaoCaibucai（2119546166），同中文头衔且同当前星尘；败丶泪为Bryen Hummer（2113583390）、Jyhh（2113211269），同个性头衔、同当前The Skies Descend，归各自一人。名字与当前团籍用于身份对应，不由共享资料认岗位。
1126 Ljw Saken（2116264881）近1125 Ljw Saken词根与编号，同当前星尘，直接归天空纸条；其头衔noraus不覆盖这条角色近名／团籍链，也不是N老板身份桥。GA逍遥、折纸、纸条按已有角色ID归档。
神父[公开保护费方案与补查](priset-s.md)已转回个人线索：价目表的原作者与实际执行未明，综合KB及A1-AUH参战已补，仍缺独立人物事件或职责依据。名片所挂3V舱KM不是本号参与，不凭收藏追加袭击故事。

## 瑶光前50头衔增量（2026-10-14）

前十的完整头衔／简介已在[老黑素材](../../src/people/laohei2333333/materials-laohei2333333.md)既有核查中完成，含anna su单向链接待核，本轮复用，不重抓。第11—50名本轮核读：老黑编号号复用成功素材，新增39次ESI请求。合计前50头衔／简介文字已覆盖；字符画只记存在。未跑个人船型统计。

| 名次 | 角色／ID | 公开头衔与已读内容 |
| --- | --- | --- |
| 11 | Mad Buny／2122545296 | 头衔“云雀”；云雀，与WD0810353同中文头衔同当前瑶光归两号；简介字符画只记存在 |
| 12 | Uati Akiba／2120654159 | 头衔“UUU”；UUU，简介字符画，不以旗帜模板并LLL／EEE |
| 13 | UZI white／93857085 | 头衔“LAOHEI2333”；LAOHEI2333，同老黑独特名字／头衔词根、同瑶光，归老黑；简介本人恶狼收藏未核，不倒推旧号创号就是本人入坑 |
| 14 | CN170／2120520313 | 头衔“过失”；过失，与CN171—174连续编号、同头衔同当前瑶光归五号；简介有事弹窗、不看本地及战果 |
| 15 | CN171／2120479398 | 头衔“过失”；过失，归CN170—174组；虫洞救援入口不认本人执行救援或任教 |
| 16 | LordofDarknessBG／1048845062 | 头衔“LLL”；LLL，简介字符画，与UUU／EEE虽共享模板但无同人桥 |
| 17 | Si1Verr／2123830791 | 头衔“氯化银”；氯化银，简介PVE will stop、虫洞探索文案及Norausdot／Dark Shines战果，实际参与与故事待核 |
| 18 | Fantasia V／2114177561 | 头衔“小五(主号) seat,7988”；小五主号，与Jen X345、Ying Akachi同头衔同Seat编号同团，live you life亦同小五同团，归四号；简介深渊致命一击日志，实际损失与独立事件待核 |
| 19 | CN172／2120508908 | 头衔“过失”；过失，归CN170—174组，收藏战果不另认FC |
| 20 | Jen X345／619484723 | 头衔“小五 seat,7988”；小五，归Fantasia V组；简介深渊致命一击日志，未据此造具体掉船过程 |
| 21 | Ying Akachi／2115781477 | 头衔“小五 seat,7988”；小五，归Fantasia V组，简介空 |
| 22 | ZhaiXiaoMing／2122314218 | 头衔“小翟 seat”；小翟，与MingXiaoZhai词根换序、同头衔同当前瑶光归双号；收藏海神／蛋等，参与待核 |
| 23 | Merlin qiu／2118245727 | 头衔“叉烧饭 seat,1239”；叉烧饭，与icecept lan同头衔同Seat编号同瑶光归双号，默认简介 |
| 24 | CN173／2120544856 | 头衔“过失”；过失，归CN170—174组；收藏掠夺舰／旗舰战果，参与及实际岗位待核 |
| 25 | GU RABBIT／2117840183 | 头衔“无”；无头衔、当前退团，简介字符画，不凭RABBIT词根并其他兔子 |
| 26 | shengling2000／2120131776 | 头衔“随风（主号） seat,3605”；随风主号，默认简介；与DC随风当前团不同，无同人桥，不单凭普通称呼并人 |
| 27 | yuyuan lin／2115414649 | 头衔“韵宛”；韵宛，自述收6-10／10-10、教人卖远征，简介工具／元帅收藏；具体教学互动与独立事件待补 |
| 28 | NatsuiroFubuki／2120259699 | 头衔“插”；插，简介555，待职责／故事 |
| 29 | Temple suchenTT／2118929822 | 头衔“编剧,2943”；编剧，同su banana当前瑶光且Seat编号2943一致，归流氓／编剧一人；不以Temple词根并Temple banana |
| 30 | Dr--Siber／2118385284 | 头衔“晨曦  Corp Director，手量星图学V，手量星图专业研究V”；晨曦，自报Corp Director与手量星图学V；简介专业炸WC、瑶光BR页与无畏／旗舰收藏，实际管理事务、本人参与和战役待补 |
| 31 | lanengine／2119658690 | 头衔“醉墨兰”；醉墨兰，与mi-lu同头衔同当前瑶光归双号，默认简介 |
| 32 | Queen of theDirac-sea／2122466185 | 头衔“移动老黑”；移动老黑，当前瑶光；与已有老黑中文头衔相合、同团，归本人另一号，简介自链卖远征与QAQ预设，不新增指挥经历 |
| 33 | mi-lu／2119658594 | 头衔“醉墨兰”；醉墨兰，归lanengine同人组，默认简介 |
| 34 | dongchong／2119657539 | 头衔“钵钵鸡”；钵钵鸡，默认简介，待故事／职责 |
| 35 | Endonen kaka／2119301935 | 头衔“EEE”；EEE，简介字符画，共享模板不并UUU／LLL |
| 36 | kong xlng／2115516882 | 头衔“星空”；星空，简介噩梦与梅特诺克斯收藏，实际参与与事件待核 |
| 37 | live you life／2121326737 | 头衔“小五”；小五，归Fantasia V组，简介本人伊什塔／斯特修斯战果未核 |
| 38 | WD0810353／2122541842 | 头衔“云雀”；云雀，归Mad Buny双号，简介文案 |
| 39 | MingXiaoZhai／2123147263 | 头衔“小翟”；小翟，归ZhaiXiaoMing双号；自述游牧者我抓的、520送巧克力，未核KM及实际礼物，不造现实感情经历 |
| 40 | longlong-pro／2122232961 | 头衔“龙龙    新人教官”；龙龙，新人教官；同Puthia Sabezan龙龙头衔同团归双号；简介怪抗／叠加效应表、远征与超网，具体教学互动待补 |
| 41 | Erozim／2120363445 | 头衔“铭”；铭，当前98806237，简介物品及总览；与铭Mikoyan Anzomi无同人桥，不仅凭一个字并号 |
| 42 | Macmico／2120679892 | 头衔“流光叶卡 seat  亿万少女的梦”；流光叶卡／亿万少女的梦，简介格言、工具、字符画及战果，不认现实关系或原创作品 |
| 43 | wdadwd／2122257171 | 头衔“爆发小宇宙 seat  萌萌哒的萌新”；爆发小宇宙／萌萌哒的萌新，自写疯狂收转移，交易对象与具体执行未核 |
| 44 | icecept lan／2118250790 | 头衔“叉烧饭 seat,1239”；叉烧饭，归Merlin qiu双号，默认简介 |
| 45 | CN174／2120589875 | 头衔“过失    Director”；过失，Director，归CN170—174组；明确岗位名片与工业／估价工具，实际管理事务与任期待补 |
| 46 | sandunder／2117426351 | 头衔“沙下”；沙下，简介文艺句与广播，待故事／职责 |
| 47 | 248625／2122209190 | 头衔“无”；无头衔，默认简介；与天启阿柒268425仅随机数位相近，当前团不同，无中文桥，不直接归同人 |
| 48 | laohei23333333／2122428047 | 头衔“军团金牌FC老黑（复用）”；老黑，复用本人材料中已读完整名片与同人链，未重抓 |
| 49 | Puthia Sabezan／2120826835 | 头衔“龙龙”；龙龙，归longlong-pro双号，简介空 |
| 50 | Leiming D3vilback／2121710850 | 头衔“白井   Director”；白井，Director，默认简介；实际管理事务与任期待补 |

过失为CN170（2120520313）、CN171（2120479398）、CN172（2120508908）、CN173（2120544856）、CN174（2120589875）；同连续编号、同中文头衔同瑶光，归五号。CN174自报Director，实际分工与任期待补。晨曦Dr--Siber、白井Leiming D3vilback也有总监头衔；龙龙longlong-pro自报新人教官，与Puthia Sabezan同龙龙头衔同团归一人，不从复制教学表认原创。
小五为Fantasia V（自称主号）、Jen X345、Ying Akachi、live you life，同中文头衔同团，前三同Seat编号；小翟为ZhaiXiaoMing、MingXiaoZhai，同词根换序与中文头衔同团；叉烧饭为Merlin qiu、icecept lan，同头衔同Seat编号同团；云雀为Mad Buny、WD0810353，同头衔同团；醉墨兰为lanengine、mi-lu，同头衔同团。流氓su banana、编剧Temple suchenTT同Seat编号2943同团归一人，Temple banana的中文头衔与Seat编号不同，不仅凭banana／Temple词归同人。
UZI white（93857085）头衔LAOHEI2333，同老黑独特词根及当前瑶光；Queen of theDirac-sea（2122466185）直接自报移动老黑、同当前瑶光，归[本人素材](../../src/people/laohei2333333/materials-laohei2333333.md)并列aliases。现对应不替代每场战果的实际操作核查；不以较老小号的出生日期断言本人何时入坑。

## 宽带山前50头衔增量（2026-10-14）

历史榜前1—50名的头衔与简介文字已核读；13份成功画像复用，新增37次ESI请求。字符画只记存在，不评价作品。另复用[公开账号组](kds-account-groups-2026-10-12.md)，不重抓同页，未跑个人船型统计。缓存资料与当日新取资料不混作全量刷新。

| 名次 | 角色／ID | 公开头衔与已读内容 |
| --- | --- | --- |
| 1 | No money Allier／2115450918 | 头衔“没钱要命”；没钱要命，复用既有公开账号组及AOM读到的名片，不能与站内没钱组混并；战果收藏待核 |
| 2 | LED Apterbringer／2115988005 | 头衔“低调”；低调，归已有列传，简介FRT故土／黑渊／对舞／寂静谷之墓与4-H文案沿本人既有素材，不以标题认独杀 |
| 3 | I don't eat／2116913146 | 头衔“陈”；陈，复用AOM已读，简介空，社区署名／事件待补 |
| 4 | Burningleek／2119439404 | 头衔“燃烧的韭菜”；燃烧的韭菜，与LightCarrot公开同账号组，既有线索复用，不从格言认事件 |
| 5 | honghonghong／2121310358 | 头衔“帅帅的阿辉”；帅帅的阿辉，公开组与阿辉分开；简介jita95收死亡／打捞／挖坟、NPC94盒子赏金券及因斯／摄魂定点回收，实际服务故事待补 |
| 6 | lndlmy／2114570922 | 头衔“重盾正义克星”；重盾正义克星，既有组与AOM名片复用；简介夜神本人损失及收藏，原始参与／独立事件待核 |
| 7 | Lin xian deng／2120638286 | 头衔“林先登 MVP”；林先登／MVP，公开六号同组复用，简介工具／总览／广播，不据MVP认职务 |
| 8 | alicegoodnight ai／2115273685 | 头衔“勿忘我-回城卷轴”；勿忘我／回城卷轴，复用AOM；与yuanyizhezhi同头衔同当前团归双号；自列R-ARKN星城致命一击日志待核 |
| 9 | Gterrs Padecain／2115566810 | 头衔“过之”；过之，公开同组GteErrSS／Laugh laugh复用；简介D manson猎獒收藏与总览，不认作者／FC |
| 10 | Yuusuke Urameshi／2118440362 | 头衔“浦饭幽助”；浦饭幽助，公开同组Valen Lee复用；简介复用低调式FRT之墓文案，不能仅以模板归低调本人 |
| 11 | symx Orlanerd／2115456538 | 头衔“友爱”；友爱，同symx词根与Orlanerd／Orlenard近拼、同头衔同团归双号；简介物品题词与CCP收藏，不认现实行为 |
| 12 | Honda FD2／2115711479 | 头衔“洪大”；洪大，回收广告先连写暂停收垃圾；列TCAG-3、UALX-3、P-ZMZV、E3OI-U收货、贝斯20万立方上门、24H结算；承诺对账错误先赔50M，履约／暂停时点待补 |
| 13 | Kyle Broflovskds／2115199027 | 头衔“KY”；KY，简介字符画，待事件／职责 |
| 14 | No money li／2115488201 | 头衔“没钱要命”；没钱要命，归公开同组原号，不与没钱组并人 |
| 15 | City-Light-Rail／2118013212 | 头衔“城市轻轨”；城市轻轨，简介收垃圾链接Honda FD2及总览、舰船／索迪约物品；单纯服务转介不认洪大小号 |
| 16 | EVE lianyu／2115198244 | 头衔“鲢鱼”；鲢鱼，旧线索／AOM名片复用，简介总览与星城收藏，具体故事待补 |
| 17 | Bone cat／2118614609 | 头衔“骨猫”；骨猫，复用已读原线索，简介字符画，仍缺独立故事／职责 |
| 18 | Kellamy／2115570527 | 头衔“晨风”；晨风，与miilee公开同账号组；miilann同中文头衔同当前团归第三号；简介广播，不认FC |
| 19 | LightCarrot／2119852318 | 头衔“燃烧的韭菜”；燃烧的韭菜，归公开同组Burningleek，默认简介 |
| 20 | Abb-laoyao／2115174971 | 头衔“无”；无头衔，简介字符画，中文对应待补 |
| 21 | pirate Ellecon／93555898 | 头衔“无”；无头衔，简介采购／化矿／查询工具，具体角色与业务事件待补 |
| 22 | Hirakama Unpas Asanari／2123376193 | 头衔“够不到 【新人】”；够不到新人，与公开另组够不到／HUA02保持分开，默认简介不认真实入坑年龄 |
| 23 | Mia Starr／95801758 | 头衔“慕慕”；慕慕，复用公开账号组与AOM已读，简介总览／广播，不认原作者 |
| 24 | du nan／2116534789 | 头衔“dunan”；dunan，已读同名游戏称呼，简介空，事件／职责待补 |
| 25 | BlcakGold／2119827890 | 头衔“潮与虎”；潮与虎，简介首杀、普通／旗舰／超旗收藏；将实践题为旗舰首杀不改船型，原始参与未核，不立新FC证据 |
| 26 | evaeva913／2116198669 | 头衔“小步点”；小步点，与SX623公开同组且同头衔，归双号；简介抗性、晶体与广播，不认原创教学 |
| 27 | Sam Rock31／2121026195 | 头衔“石桑”；石桑，简介深渊加力物品，独立故事待补 |
| 28 | yuanyizhezhi／2116299528 | 头衔“勿忘我”；勿忘我，同alicegoodnight ai当前团同头衔归双号，简介科莫多／毒蜥战果参与待核 |
| 29 | past i／2117072106 | 头衔“无”；无头衔、简介空，中文身份待核 |
| 30 | zyx ly／2115389471 | 头衔“呜呼呼”；呜呼呼，复用AOM名片，现Phoenix City，历史榜不作现役宽带山成员证明 |
| 31 | liang lbwnb／2116382869 | 头衔“吊炸天的凉风”；凉风，简介宽带山招新福利、生产船及1亿启动、充卡送实践承诺；npc95收盒子红纸、jita95装备、O4T等挂合同秒接，具体兑现／角色职责待补；联系方式不留 |
| 32 | Rin Shibuya／2122350494 | 头衔“无”；无头衔、当前退团，默认简介，不写退游或现实身份 |
| 33 | Penglu／2119279892 | 头衔“大鹏”；大鹏，简介总览／广播，独立故事待补 |
| 34 | Anly Milet／2124119641 | 头衔“咸鱼 PAP第一人”；咸鱼／PAP第一人，公开六号同组复用；称号是自述，不认榜首或特定职务 |
| 35 | miilann／2120446800 | 头衔“晨风”；晨风，同头衔同当前团归Kellamy／miilee组，默认简介 |
| 36 | ERIC L／2116168956 | 头衔“艾瑞克”；艾瑞克，简介七条本人帕拉丁损失收藏与抗性表，不从普通失舰拼黑料 |
| 37 | Br1ck66／2123696247 | 头衔“砖”；砖，公开五号同组复用，简介广播／总览，事件待补 |
| 38 | Noshiro／2117721841 | 头衔“影风”；影风，简介空，待事件／职责 |
| 39 | SX623／2116318548 | 头衔“小步点”；小步点，归evaeva913同组；简介KEEP STEEL狂热晶体发言及共享配置，不作本人发言或另认教官 |
| 40 | symx Orlenard／2114586871 | 头衔“友爱”；友爱，归symx Orlanerd双号；简介莫欺少年穷等文案、本人恶狼收藏和工具，不认实际事故／失业年龄 |
| 41 | zyx lbl／2115962492 | 头衔“老祝”；老祝，简介空，不仅凭zyx常用前缀并呜呼呼 |
| 42 | Kongo IJN／2122580447 | 头衔“金刚”；金刚，公开三号同组复用，现仍候选；夸观FRT／INIT插标卖首、4-H星城等为本人宣传，不凭收藏立传 |
| 43 | attack stop／2116380291 | 头衔“西征十字军”；西征十字军，简介PIBC值守等共享预设，不由预设认FC或实际PIBC任职 |
| 44 | GteErrSS／2117280288 | 头衔“过之 最佳后勤”；过之／最佳后勤，公开同账号组Gterrs Padecain／Laugh laugh，岗位称号不认实际总指挥 |
| 45 | Sword Wen／91405293 | 头衔“大熊”；大熊，复用AOM已读，简介空，不以常见称呼跨团并人 |
| 46 | Chris Harbour CHN／2119035263 | 头衔“翎枫钧”；翎枫钧，简介总览／广播和市场工具，不写现实姓名 |
| 47 | Emperoryx7／2117032488 | 头衔“JUST 13J(十柒9786)”；JUST 13J／十柒，当前Infinity Avenger，简介元帅／夜神／CCP舱收藏与凯门鳄超网，参与／实际交易待核 |
| 48 | Caldari girl norei／96158251 | 头衔“悠久”；悠久，角色同名且同beijing当前宽带山，欠无畏一句账目不足立传，退回[人物线索](caldari-girl-norei.md)，保留角色对应 |
| 49 | miilee／2115670721 | 头衔“晨风 最佳轻拦”；晨风／最佳轻拦，公开与Kellamy同组、同中文头衔；miilann第三号按同头衔同团归，实际指挥或出勤未核 |
| 50 | KokoHekmatyars／2123583890 | 头衔“九尾妖狐”；九尾妖狐，简介虫洞编号、市场、总览与星城入口，不认原创教学或FC |

晨风为Kellamy（2115570527）、miilee（2115670721），公开同账号组；miilann（2120446800）同中文头衔同当前宽带山，归第三号。小步点evaeva913（2116198669）、SX623（2116318548）公开同组且同中文头衔。友爱symx Orlanerd（2115456538）、symx Orlenard（2114586871）近词根近拼、同中文头衔同当前团归双号；勿忘我alicegoodnight ai（2115273685）、yuanyizhezhi（2116299528）同个性中文头衔同当前团归双号。
燃烧的韭菜、林先登、过之、没钱要命、浦饭幽助、咸鱼、砖、金刚等，优先复用公开账号组，不再仅凭近名猜小号；不同账号组、不同人物的共享模板不并人。洪大、凉风的回收条款保存为具体服务线索，未核合同履约或实际职务。
悠久[单方欠船点名](caldari-girl-norei.md)已对应角色；一句欠船账目不足以单独立传，现退回线索。来路是同团beijing的公开简介，没补欠船时间、缘由、逾期或了结结局，也未套现实债务罪名。

## 帝皇之镰前50头衔增量（2026-10-14）

历史榜前1—50的头衔与简介文字已核读；5份成功画像复用，新增45次ESI角色请求。字符画仅记存在、歌词不全文归档。新增1次原始KM核对，仅核简介里明确标记的友军击杀；未跑个人船型统计、未读取视频影像／字幕／音轨。缓存名片不冒充当日刷新。来源为各角色的公开[ESI资料](https://esi.evetech.net/latest/characters/2120322262/)，逐号ID列于下表。

| 历史名次 | 角色／ID | 公开头衔与身份增量／续查缺口 |
| --- | --- | --- |
| 1 | SkyEagleMilize／2120306116 | 头衔“天鹰 金色镰刀”；天鹰；广播、总览与“天鹰流浪洞 Drifter”工具入口，不凭共享设置认原创教学或FC；金色镰刀多人共用 |
| 2 | QianQing／2121690488 | 头衔“浅清”；浅清；默认简介，实际职责／故事待补 |
| 3 | MxdHana／2114187563 | 头衔“一个小空格”；一个小空格；共享广播配置，实际职责／故事待补 |
| 4 | Target Chaser／95601799 | 头衔“少年”；少年；复用已有FC列传及画像，引用他人话与出勤设置不另认新职务 |
| 5 | VS paladin／2114805028 | 头衔“帕拉丁”；帕拉丁；格言，实际职责／故事待补 |
| 6 | galaxy898／2120480031 | 头衔“痞颜小子--彩凤”；彩凤／痞颜小子；功勋大希纪念句与本人Khizriel损失收藏，普通损失不单独立传 |
| 7 | GENSHIN IMPART／2122335637 | 头衔“七喜 暗夜潜者 旗舰组 妇女之友 原神高手”；七喜／暗夜潜者／旗舰组／妇女之友／原神高手；游戏文案及战果收藏。与PLA七喜没有同人桥，不仅凭外号合并 |
| 8 | Lambert NirvanaY／2113089640 | 头衔“咸鱼”；咸鱼；当前98825114，简介共享总览与战果入口，不用常见外号跨团并人 |
| 9 | Dr chow Tasioka／94024546 | 头衔“兵器-今天五小时了吗”；兵器；与SuperHunter MM同完整个性头衔、同ES归双号；诗歌歌词、普通聊天与收藏不单独立传 |
| 10 | MIKUMIKUExtremelycute39／2122861007 | 头衔“狗妈”；狗妈；简介称近名MIKUExtremelycute39的狂怒损失为“我的狂怒死掉了”，归近名小号线索；普通失舰不单独立传 |
| 11 | 91 mr C／2121855372 | 头衔“91”；91；本人克洛诺斯、恩尤及蛋损失与自嘲，不单独立传 |
| 12 | wtyybm／2123313777 | 头衔“风尘”；风尘；风尘总览单页／双页入口，未认原创作者或教官 |
| 13 | mommm／2120094796 | 头衔“歪比巴卜”；歪比巴卜；掠夺舰专家自许与本人克洛诺斯等损失、忘蛋笑话，普通损失／自嘲不单独立传 |
| 14 | Orangutan Alland／92034013 | 头衔“Wild Boar”；Wild Boar；文案，不认现实身份或具体社区事件 |
| 15 | shitburuo／2120168764 | 头衔“蟹不肉”；蟹不肉；配船工具、战果与游戏植入体交易文案；收藏jsh666的洛基损失，不把收藏认参与 |
| 16 | obyta／208043276 | 头衔“工程项目 帝皇之手 暗夜潜者”；工程项目／帝皇之手／暗夜潜者；复用已有管理冲突列传，当前头衔不倒推任期 |
| 17 | Isekato Otsito／2120447369 | 头衔“素手”；素手；简介空，实际职责／故事待补 |
| 18 | Ayanamo Kate Sasen／2121008589 | 头衔“胖头鱼”；胖头鱼；虫洞与抗性表，不从共享表认原创教学 |
| 19 | waiting AS／1306634301 | 头衔“无”；无头衔；已离开玩家军团，自嘲无PVP与字符画不单独立传 |
| 20 | MissRabbit／2116350757 | 头衔“狂天”；狂天；与Sna Revenger同个性中文头衔、同当前98825114归双号，RR总览不认本人任职 |
| 21 | xiaosong223333／2118501510 | 头衔“宋桑”；宋桑／小宋；复用已有列传和画像，默认简介 |
| 22 | LM-puxiao／2119363437 | 头衔“朴晓”；朴晓；与LM-puxiao2同词根、头衔及ES归双号；市场工具、总览与战果入口，实际职责／故事待补 |
| 23 | SuperHunter MM／2114165404 | 头衔“兵器-今天五小时了吗”；兵器；归Dr chow Tasioka双号；文案与音乐视频入口，不认本人UP。未看影像、未读字幕或音轨 |
| 24 | xiaozhang01 SoulReaper／2114207853 | 头衔“校长”；校长；总览与攻略3.5入口、字符画，不由外号认教官或原创作者 |
| 25 | Hoshino X／2120556332 | 头衔“星烨 摆烂王 金色镰刀”；星烨／摆烂王／金色镰刀；已有CEO与交接故事，Hoshino Y归同人；金色镰刀不是唯一姓名 |
| 26 | XIANYU001／2115575415 | 头衔“肖”；肖；共享广播、总览与字符画，不认FC |
| 27 | Sna Revenger／2113020473 | 头衔“狂天”；狂天；归MissRabbit双号，当前98825114，总览入口不单独立传 |
| 28 | Cooper Den／96464355 | 头衔“无”；无头衔；已离开玩家军团，F1文案与稀有船收藏不单独立传 |
| 29 | Zofia Abigail／2118132270 | 头衔“金色镰刀”；金色镰刀；与天鹰、星烨共用称号，不仅凭称号并人；生活格言不单独立传 |
| 30 | Gronya Somerville／2114181302 | 头衔“榴弹”；榴弹；打酱油V自嘲与物品链接，实际职责／故事待补 |
| 31 | Hitmeisunicorn unicorn／2114609019 | 头衔“爱吃猫的鱼”；爱吃猫的鱼；战果收藏、“感谢老板赞助内容”、超网与索迪约入口；不凭收藏认本人击杀或交易 |
| 32 | Hsleep／2121353014 | 头衔“【小特】”；小特；当前SCG（98598483）。简介“Kill friendly forces”链接同盟轻拦损失，本人最后一击已核；事由／后果待补，先留素材，不凭一句友军击杀立传 |
| 33 | Hoshino Y／2120322262 | 头衔“星烨”；星烨；Hoshino Y与Hoshino X同独特词根、同中文头衔同ES归本人小号；抗性表与共享设置不认新职务 |
| 34 | AsukaChan／2113093141 | 头衔“飞鸟”；飞鸟；字符画与现成英文歌词，不认本人创作，实际职责／故事待补 |
| 35 | Ajin Shizhu／2114206710 | 头衔“阿进”；阿进；中文头衔与born reaper旧ES材料同名、同军团，对应其小号；当前留ES不倒推被踢后本人操作、准入决定或绕禁令 |
| 36 | hannibal guang／2113716341 | 头衔“无”；无头衔；已离开玩家军团，简介“战地”；不与Hannibal Jia仅凭常见Hannibal前缀并号 |
| 37 | Hannibal Jia／2114896671 | 头衔“戒断反应”；戒断反应；CCP及泰坦战果收藏、耐心格言，实际参与／故事待补 |
| 38 | Yeah Three／2122086189 | 头衔“无”；无头衔；已离开玩家军团，文字游戏与本人普通舰船损失不单独立传 |
| 39 | Marvel Kate／2114870463 | 头衔“老八 嘻嘻普肉 大穷逼 菜狗 破产急先锋”；老八／嘻嘻普肉／大穷逼／菜狗／破产急先锋；与CC Pro同完整个性头衔、同简介同ES归双号；舰船自嘲不单独立传 |
| 40 | fanjing123／2117180492 | 头衔“大聪明 小傻瓜 小笨蛋 旗舰组”；大聪明／小傻瓜／小笨蛋／旗舰组；复用已有AOM队列画像，战果收藏不认实际职务 |
| 41 | jsh666／2120211185 | 头衔“蟹不肉年年加值”；年年；自报“我是年年”，头衔“蟹不肉年年加值”。复合称呼与蟹不肉不同，暂不并shitburuo；对方收藏此号洛基损失，关系待补 |
| 42 | LM-puxiao2／2119699106 | 头衔“朴晓”；朴晓；归LM-puxiao双号，市场及共享工具不认管理或原创作者 |
| 43 | lsparrc／2124030030 | 头衔“老色批”；老色批；游戏技能文案及总览，不单独立传 |
| 44 | ase1／2123655448 | 头衔“狼群号”；狼群号；市场与远征笔记、怪抗和警察时间表；共享笔记中的刷怪说法不认本人实际操作或原创教学 |
| 45 | Crow rideplane／2113260237 | 头衔“点点”；点点；广播、总览，不从配置认FC |
| 46 | CC Pro／2114576642 | 头衔“老八 嘻嘻普肉 大穷逼 菜狗 破产急先锋”；老八；归Marvel Kate双号，同完整个性头衔与舰船自嘲文案 |
| 47 | Anubis Abyss／2114248220 | 头衔“无”；无头衔；已离开玩家军团，简介空，实际职责／故事待补 |
| 48 | Lorentz Dunier／2116614315 | 头衔“#牛哥”；牛哥；当前98731561，简介空，不以常见牛哥外号跨团并人 |
| 49 | momocaizhenshuai Audanie／2115143247 | 头衔“馍馍菜”；馍馍菜；注入器超网与总览工具，momocai总览不证明同名平台账号或原创作者 |
| 50 | Tohsaka Rico／2114355065 | 头衔“骨龙”；骨龙；复用AOM画像，问候与陆游诗，不认本人创作或新职责 |

星烨Hoshino Y（2120322262）与收录号Hoshino X同独特词根、同“星烨”头衔同当前ES，归[本人素材](../../src/people/hoshino-x/materials-hoshino-x.md)。Ajin Shizhu（2114206710）当前ES、头衔“阿进”，与born reaper原ES头衔和社区对应一致，归[阿进素材](../../src/people/born-reaper/materials-born-reaper.md)；不因小号留团就写本人已经重新获准加入，旧脚本指控也不自动套到这个号。
兵器Dr chow Tasioka（94024546）、SuperHunter MM（2114165404）同“兵器-今天五小时了吗”头衔同ES归双号；朴晓LM-puxiao（2119363437）、LM-puxiao2（2119699106）同词根、头衔同ES；狂天MissRabbit（2116350757）、Sna Revenger（2113020473）同头衔同当前98825114；老八Marvel Kate（2114870463）、CC Pro（2114576642）同整串个性头衔、同简介同ES。四组保留在本队列，等待实际事务或人物故事。“金色镰刀”由天鹰、星烨、Zofia Abigail共用，不作为同人依据。

### 小特简介中的友军击杀

Hsleep（2121353014）公开头衔“小特”，当前Stars Corporate Group（98598483）。简介把Drill Mole轻拦战果标为“Kill friendly forces”；[原始KM](https://esi.evetech.net/latest/killmails/133617994/c18b3891e290ba11ba3e2a23b8af5973846f80a2/)记录2026-02-24T15:29:07Z、星系30004621，受害角色96802410、军团1104020786、船型22460（Eris），联盟1900696668（INIT）；5名攻击者中Hsleep在ES（98715582）、同INIT、驾驶24702，造成1041伤害并取得最后一击。参与和同盟关系已核；“友军”标签按本人简介说法保存，未取得事由、蓝加、动机、赔偿或后续争执，暂不升级为恶意awox或独立列传。
简介另挂AT冠军船、夜神及xEntriq等链接，也有本人普通舰船损失；未核其余KM参与，不凭收藏写本人击杀冠军或旗舰。实际职责、独立事件与这条击杀的后果待补。

## 采星者前50头衔增量（2026-10-14）

本批沿历史榜前1—50逐人读取公开名片，共50次ESI角色请求：49份头衔／简介文字已读，第33名rommel yin返回404。补读1次EveWho索引，仍未取得第33名头衔／简介；不能称50份个人文字全部读完。另核炒鸡简介3条原始KM及3个武器／船型名称，不跑人人船型统计；未读视频影像、字幕或音轨。字符画只记存在，现成文学文案不当本人创作。各角色ID及阅读缺口如下；公开角色资料以[ESI](https://esi.evetech.net/latest/characters/2114825696/)为来源。

| 历史名次 | 角色／ID | 公开头衔与身份增量／续查缺口 |
| --- | --- | --- |
| 1 | Astralis N1／2117577442 | 头衔“可乐”；可乐；本人普通损失、稀有船收藏与ATXXI Match 39标签；参赛角色及具体职责待核，不凭收藏立传 |
| 2 | Manazuru／2120997508 | 头衔“真鶴”；真鶴；可爱文案，实际职责／故事待补 |
| 3 | mashangshuijiao／2122328976 | 头衔“娜娜奇”；娜娜奇；MASHANGSHUIJIAO3同词根、头衔同采星者归双号；本人标ATXXI征程与CCP、超旗收藏，复用4-H频道名单，实际参赛／独立故事待核 |
| 4 | Growlyena Lee／2114280895 | 头衔“戴恩”；戴恩；与Grola192同中文头衔、同当前Arknights归双号；结合管理名单AMIYA-Grola828戴恩可接同人组，后勤燃料组实际事务待补 |
| 5 | Steven980326／2119593202 | 头衔“九零，炸船大菜逼，深渊钉子户,采星华莱士”；九零／炸船大菜逼／深渊钉子户／采星华莱士；本人普通损失及“记得换蛋”收藏他人蛋，欧气与自嘲不单独立传 |
| 6 | jie88989 jie88989／2114897403 | 头衔“冰封”；冰封；jie88989与jie111同jie词根、中文头衔同采星者归双号；简介空，职责／故事待补 |
| 7 | tudusang／2118840787 | 头衔“提督”；提督；广播设置与长须鲸战果入口，未核参与，不由外号认指挥 |
| 8 | simon samdatan／2117570867 | 头衔“电疗院院长”；电疗院院长；GM／ISD、首条旗舰、空堡与橘子DY HEII K无畏收藏，具体参与／故事待补 |
| 9 | ASXS1／2123074260 | 头衔“龙华”；龙华；“人生第一个kb”及旗舰、货舰等收藏，未核本人参与，不单独立传 |
| 10 | BOOOOM BOM／2114825696 | 头衔“炒鸡.aic, 总监/Director”；炒鸡.aic／总监Director；同采星者、同个性头衔，简介直接链接I-cute money plz，归已有炒鸡列传；周年庆两条KM与本人自炸已核 |
| 11 | Wolf Scharnhorst／2115407381 | 头衔“羽痕靖泽”；羽痕靖泽；“FRT罪恶深重”文案及多条收藏，称Readus为救自己牺牲；救援事由、参与与后果待补，不由挂KM认本人杀泰坦 |
| 12 | Tmall／2116194527 | 头衔“无”；无头衔；已离开玩家军团，简介“小明”及自嘲，实际职责／故事待补 |
| 13 | ZGG01／2118404648 | 头衔“猪哥哥”；猪哥哥；当皇帝、批评者拉黑的网络文案，不当实际滥权或处罚事件 |
| 14 | FZUxiaosep／2117534617 | 头衔“电竞小色批”；电竞小色批；官员装备产出清单、总览与损失收藏；未核本人实际掉落或操作，普通产出不单独立传 |
| 15 | lightg0000／2120630725 | 头衔“四零”；四零；旗舰、CCP、老板无畏与建筑等收藏、远征笔记，不从工具／收藏认FC或独立事件 |
| 16 | wadu hecki／2114287049 | 头衔“摩多”；摩多；两句远征层级笔记，不认原创教学或实际职责 |
| 17 | Foxlolita／2118401383 | 头衔“江风”；江风；已对应2118401383，复用反时区语录线索，简介超网与普通损失自嘲；不因轻梗单独立传 |
| 18 | kekoukele baozi／2118982360 | 头衔“雄心”；雄心；广播、夜神及CCP等收藏，未核本人参与，字符画不单独立传 |
| 19 | Pizzaboxer／2121829516 | 头衔“裸熊很穷／ 非酋”；裸熊很穷／非酋；对VOLTA／Goons的敌对文案、Asbendale聊天与战果收藏；不据藏品认实际猎杀故事 |
| 20 | jie111 jie／2114945794 | 头衔“冰封”；冰封；归jie88989双号，简介空，职责／故事待补 |
| 21 | East Thief／2117007618 | 头衔“东风风”；东风风；自用文件夹、“东风带队总览”、深渊加力、“朱庇特服刑七天”及退游文案；预设名不等于带队自述，服刑事由／具体事件待补 |
| 22 | feilang Ouyang／2113315178 | 头衔“欧阳飞狼”；欧阳飞狼；字符画及掠夺舰、建筑等战果收藏，不凭收藏立传 |
| 23 | nick1329／2116283053 | 头衔“张大佛爷PLUS”；张大佛爷PLUS；简介空，实际职责／故事待补 |
| 24 | Black dress Baby／2114090033 | 头衔“李福”；李福；复用已对应反时区语录名牌，简介群友打油诗和官员铭牌日期清单，不把别人的事故归本人 |
| 25 | Wan Ormand／2113092359 | 头衔“阿克”；阿克；简介空，实际职责／故事待补 |
| 26 | royal saluter／2114406475 | 头衔“不争”；不争；格言，实际职责／故事待补 |
| 27 | Blooming rainbow／96834114 | 头衔“江天晓”；江天晓；同中文头衔、同采星者，对应Uncertainty Principle Ray旧名牌归本人线索；GM杀人、自嘲与普通KM不足单独立传 |
| 28 | Aakuwa Sitei Tsuruomo／2117471748 | 头衔“绝域”；绝域；广播与深渊总览设置，不认原创教学或FC |
| 29 | YESHENG／2117542254 | 头衔“叶生”；叶生；文学引句，不认本人作品，实际职责／故事待补 |
| 30 | yq16／2117563123 | 头衔“好猛”；好猛；404文案、共享设置与物品链接，实际职责／故事待补 |
| 31 | YQ IS M1NED／2118213384 | 头衔“SUPER寒星-璀璨欧塔头号黑奴，刷子一号”；SUPER寒星／璀璨欧塔头号黑奴／刷子一号；当前98592004，本人俄洛巴斯损失、电竞文案及舰队问答段子，不认真实服务／指挥角色 |
| 32 | Chiang Chi-shek／2121195246 | 头衔“啊栓”；啊栓；B站关注星瞳文案，不认本人UP或作品，不读视频 |
| 33 | rommel yin／2116944780 | 头衔“未取得”；ESI返回404；EveWho仍有同ID、同名索引及13段履历，但未给头衔／简介，个人文字未核读，不作删号结论 |
| 34 | IQC／2122182356 | 头衔“龙马飞鹰”；龙马飞鹰；收藏别人的Monitor和幽灵战果，不能由受害者船型认自己FC |
| 35 | Luojia／2122430704 | 头衔“珞珈”；珞珈；战果、世界方舟物品与拉红文案，不认本人实际击杀或独立事件 |
| 36 | XiaoHuWei／2119511951 | 头衔“小护卫”；小护卫；挂技能自嘲、怪抗表及共享广播，不认原创教学 |
| 37 | Grola192／2114964760 | 头衔“戴恩”；戴恩；归Growlyena Lee双号，当前Arknights；简介空，后勤燃料组事务与人物故事待补 |
| 38 | WAR-Commander／2117066166 | 头衔“彬”；彬；一句个人信息提示，不由角色名WAR-Commander认指挥 |
| 39 | SuperCyno owo／2122857798 | 头衔“苏帕·赛诺·欧乌瓯”；苏帕／此方；已有动员与Monitor依据，复用列传；“买到娜娜奇本人了”的物品入口仅为游戏文案，不认买号或同人 |
| 40 | Summer Amarr／2113261413 | 头衔“狗剩将军”；狗剩将军；植入体、CCP战果与KB链接，未核本人参与，不由将军外号认FC |
| 41 | HUANREN／2119060429 | 头衔“~幻人~”；幻人；当前98670400，广播、官员铭牌与穿梭机物品，不凭产出或分享立传 |
| 42 | msy／2117562105 | 头衔“星啸”；星啸；简介空，实际职责／故事待补 |
| 43 | Karvi Nems Shana／2117567662 | 头衔“无”；无头衔；当前98592004，简介空，实际职责／故事待补 |
| 44 | Vivian Palpatine／2119643263 | 头衔“敏儿 ✵”；敏儿；文案及EN/CH bilingual USTZ，表示语言／游戏时区自述，不认外交任职或现实住址 |
| 45 | yuyu chaokeai／2117348259 | 头衔“鱼鱼 美女教官在线教挖矿”；鱼鱼／美女教官在线教挖矿；自报教官，矿船、工具与建筑／小航收藏；具体教学内容与互动待读，不推现实性别或收入 |
| 46 | Poseidon Nepune／2114566051 | 头衔“荀彧”；荀彧；字符画，实际职责／故事待补 |
| 47 | Kai Taiwu／2116745847 | 头衔“萌凯”；萌凯；存款小目标、普通损失与首solo收藏；宣称高于商人收价收采星静寂谷产出、0价合同给Kai Tomato1，实际履约与角色关系待补 |
| 48 | MASHANGSHUIJIAO3／2122883635 | 头衔“娜娜奇”；娜娜奇；归mashangshuijiao双号，同词根、中文头衔同采星者，默认简介 |
| 49 | MxueS／2117197131 | 头衔“山山而川”；山山而川；简介shan shan，不仅凭常见昵称跨团并人 |
| 50 | CQZC／2120046065 | 头衔“北極 作战小队”；北極／作战小队；当前98592004，共享设置与刷怪技能文案；小队称号不证明FC或实际任职 |

炒鸡BOOOOM BOM（2114825696）同“炒鸡.aic”个性头衔、同采星者，简介直接链接收录号I-cute money plz（2117995654），对应[已有素材](../../src/people/i-cute-money-plz/materials-i-cute-money-plz.md)，当前头衔总监／Director不倒推过去任期。冰封jie88989 jie88989（2114897403）、jie111 jie（2114945794）同jie词根、中文头衔同团归双号；娜娜奇mashangshuijiao（2122328976）、MASHANGSHUIJIAO3（2122883635）同独特词根、中文头衔同团归双号，复用[4-H频道名单](../sources/4h-local-dispute.md)，未凭普通参赛收藏写新列传。
戴恩Growlyena Lee（2114280895）、Grola192（2114964760）同中文头衔、同当前Arknights归双号；[凛冬管理名单](winterco-leadership-2026.md)已记AMIYA-Grola828戴恩（2115179564）为后勤燃料组，中文名、军团与Grola编号词根对应，接入本人候选组，不另造实际调运或管理事件。Blooming rainbow（96834114）同“江天晓”头衔、同采星者，对应Uncertainty Principle Ray旧SC-UN中文名牌，归[本人线索](uncertainty-principle-ray.md)，仍待有分量的独立故事或指挥／任职依据。

第33名[rommel yin ESI](https://esi.evetech.net/latest/characters/2116944780/)本次404；[EveWho](https://evewho.com/api/character/2116944780)返回同ID、名字与13段履历，但不是个人头衔／简介来源。缺口保留，不反复刷新同一404，也不把当前未取到名片解释为不存在、退游或没有故事。下一团接Dusk dreadnought.，此缺口继续留在主ledger。

## Dusk前50头衔增量（2026-10-14）

历史榜前1—50的头衔与简介文字已核读；4份成功画像复用，新增46次ESI角色请求。只记字符画存在，不全文归档歌词及普通聊天；现实联系方式和涉及现实身体、年龄的恶搞细节不保存。没有读取视频影像、字幕或音轨，没有跑个人船型统计。来源为各角色公开[ESI资料](https://esi.evetech.net/latest/characters/2114368430/)，逐号ID与实际增量如下；缓存资料不冒充当日刷新。

| 历史名次 | 角色／ID | 公开头衔与身份增量／续查缺口 |
| --- | --- | --- |
| 1 | snowdance／2122261505 | 头衔“雪舞 已认证 飞雪月下凤求凰”；雪舞／飞雪月下凤求凰；与BloodDance同中文头衔、同Dusk归双号；怪抗笔记不认原创教学 |
| 2 | Aitt duominx／2118339639 | 头衔“多 米 CEO”；多米／CEO；复用已有角色和列传，简介JOIN DC及多条超网订单不证明成交或兑付 |
| 3 | BloodDance／2122982148 | 头衔“雪舞 已认证 万花丛中蝶寻香”；雪舞／万花丛中蝶寻香；归snowdance双号；默认简介，不凭认证标签认职务 |
| 4 | FOV-XFLET／2123321777 | 头衔“幻冰 总监 交学费最贵的一集”；幻冰／总监／交学费最贵的一集；帕拉丁损失与“见证历史性的一刻”星城、无畏等收藏；明确总监名片，实际分工／任期和事件待补 |
| 5 | menglin Ormand／2116392936 | 头衔“梅林 已认证 打我自动下载原神”；梅林；与menglin Garemoko同词根、中文头衔同Dusk，后者直链本号，归双号；简介空 |
| 6 | Eyesone／2122303426 | 头衔“如月 已认证”；如月；与GlassBulb、Yasuraoka同中文头衔同Dusk归三号；总览及“不看舰队置顶直接枪毙”文案不认实际惩罚或FC |
| 7 | KokuraAsahi／2117467348 | 头衔“星奏”；星奏；复用DC旧候选名片，童谣文案，不凭月榜或普通发言立传 |
| 8 | Jaina Aishai／2116252614 | 头衔“吉安娜”；吉安娜；共享总览、广播与市场工具，实际职责／故事待补 |
| 9 | Hu Keikira／2118355435 | 头衔“胡凯丽”；胡凯丽；游戏头衔原样保留，不认现实姓名；共享广播，实际职责／故事待补 |
| 10 | Duhamel／2120900875 | 头衔“红豆”；红豆；本人鹏鲲损失、2026-04-28 4-H星城标签与其他战果收藏，未核本人具体参与／指挥，不凭收藏立传 |
| 11 | GlassBulb／2122333526 | 头衔“如月 已认证”；如月；归Eyesone／Yasuraoka三号，碎玻璃文案及总览，不认原创作者 |
| 12 | 2121165138／2121165138 | 头衔“漆黑”；漆黑；角色ID2121165138复用既有QHei同人链，队列为数字名字；已有8TPX-N Monitor依据，广播及枪毙文案不认新指挥事件 |
| 13 | Polarnacht D／2114687792 | 头衔“极夜 已认证”；极夜；简介空，实际职责／故事待补 |
| 14 | Chevalier-Crusader／2119751783 | 头衔“探归”；探归；Chevalier-Crusader与Chevalier-Tan同词根、中文头衔同Dusk归双号；默认简介 |
| 15 | WeiWei Zheng／2114209655 | 头衔“三皮 已认证”；三皮；字符画与本人蛋收藏，普通损失不单独立传 |
| 16 | yzy314／2123220093 | 头衔“狂徒 已认证”；狂徒；与SkyFanaticis同中文头衔同Dusk归双号；无畏收藏及“出收集者了”文案，具体参与／故事待补 |
| 17 | tutuker noe／2116147378 | 头衔“图图”；图图；自称PVP战士、分享虫洞／交易工具与配置；自称PVP不等于FC或独立人物故事 |
| 18 | Wenda／2118088398 | 头衔“文大”；文大；复用已有成功画像，默认简介；原教学入口另留队列，不把未读内容认本人作品 |
| 19 | Chevalier-Tan／2114368430 | 头衔“探归 总监”；探归／总监；自称PH华人社区工具人及Discord group host，退役UP直链探归者夕迁Official／UID8702252；明确岗位与账号入口，具体主持事务／作品文字待补，未看影像 |
| 20 | xash small／2116059804 | 头衔“夜羽 已认证”；夜羽；广播、总览与矿价／税务等共享网址；不认实际管理、网站作者或跨平台账号 |
| 21 | Knight Ohmiras／2114133958 | 头衔“蜘蛛侠 已认证”；蜘蛛侠；共享设置、估价与虫洞工具、长期收远征文案，实际履约／事件待补 |
| 22 | annhigh／2122758961 | 头衔“飒飒临风 已认证”；飒飒临风；默认简介，实际职责／故事待补 |
| 23 | pepperWhite／2120804034 | 头衔“黑白 已认证”；黑白；默认简介，不以常见外号跨团并人 |
| 24 | Rose Jeremy／2122171725 | 头衔“不会飞的意面 已认证”；不会飞的意面；旗舰、QHei等战果收藏和角色链接，不凭收藏认本人参与或被链接角色为小号 |
| 25 | corswain3／2121396037 | 头衔“阿考 已认证”；阿考；默认简介，实际职责／故事待补 |
| 26 | RoxyMG／2123019905 | 头衔“Director山之内花音”；山之内花音／Director；当前98631475，岗位不套为Dusk总监；黑米角色恶搞文案与GM／CCP收藏，不作为现实身份或独立人物事件；2026-10-15 贴吧账号对应后以 PP 总监身份立传：[山之内花音](../../src/people/roxymg/materials-roxymg.md) |
| 27 | YoungDreams Risalo／2114666900 | 头衔“大大的罗非鱼 已认证”；大大的罗非鱼；市场及共享表格入口，不认表格作者或实际职责 |
| 28 | Angdaiyin／2121416236 | 头衔“扎加拉 总监”；扎加拉／总监；默认简介，具体分工、任期与事务待补 |
| 29 | Wujian／2118123759 | 头衔“无间 总监”；无间／总监；个人简介与Dusk招新文案同样戏仿《绝地潜兵》，“观看5秒自动加入”等为文案，灵感损失与自嘲不当真实制度或独立故事 |
| 30 | Ki11er／268736558 | 头衔“Ar 已认证”；Ar；复用Ki11er旧候选名片，日文文案与字符画；先补中文身份和具体角色，不由战报高参与认FC |
| 31 | centaurea0718／2120394420 | 头衔“寻歌”；寻歌；“1 expensive”共享配置及广播、自嘲文案，不认原创作者或实际岗位 |
| 32 | lorrisa L／2113972998 | 头衔“怪兽”；怪兽；字符画及“停船，留下ISK再走”文案，没有具体勒索／付款事件 |
| 33 | fanchen2002／2120408783 | 头衔“凡尘 已认证”；凡尘；新人自嘲、帕拉丁战果和产出／角色链接与共享设置，具体角色关系／事件待补 |
| 34 | Yukikana／2121302742 | 头衔“雪风 已认证”；雪风；默认简介，不以常见外号跨团并人 |
| 35 | TiRLey233／2124170366 | 头衔“千代 已认证”；千代；默认简介，实际职责／故事待补 |
| 36 | MO Sheet／2115410974 | 头衔“小莫”；小莫；PVE频道、工具网址与共享设置，不从入口认原创教学 |
| 37 | Tsukishima Haruka／2119655271 | 头衔“无”；无头衔；当前98747952，1A大哥文案及现成日文歌词，不认原创作品、本人身份或具体事件 |
| 38 | Joey Elizabeth／2116573630 | 头衔“闻人醉巧”；闻人醉巧；共享总览与角色玩笑，不认实际教学、现实身体或独立人物事件 |
| 39 | Ledbacknew／2118369993 | 头衔“LED”；LED；星城战果收藏，未核个人参与或战役时间，不凭收藏立传 |
| 40 | menglin Garemoko／2123605130 | 头衔“梅林 已认证 打我自动下载鸣潮”；梅林；归menglin Ormand双号，简介直接链接对方，下载鸣潮文案不作实际行为 |
| 41 | Yasuraoka／2122285814 | 头衔“如月 已认证”；如月；归Eyesone／GlassBulb三号，新人总览及文字笑话不认教官或FC |
| 42 | BamHI／2120504983 | 头衔“冉吉”；冉吉；针对Pro的玩笑，不由这一句认父子关系或独立人物事件 |
| 43 | zrn1028／2114130757 | 头衔“工地人 已认证”；工地人；简介空，不由昵称认现实职业 |
| 44 | CHNVoltaire／2123989254 | 头衔“伏尔泰 已认证”；伏尔泰；感应器／怪抗表、广播与技能注入器超网，不认原创教学或实际成交 |
| 45 | skyfun／2124096060 | 头衔“liBond”；liBond；默认简介，实际职责／故事待补 |
| 46 | lthildim／2120843622 | 头衔“禅师 战地记者”；禅师／战地记者；简介工具、多米产出回收95折／超时97折与交易入口，实际采写／履约待补；“凶起来队友豆沙”等KM菜单未核，不认真实攻击队友或记者作品 |
| 47 | Uetilen Lo Toralen／2122450953 | 头衔“大炮炮”；大炮炮；阿塔诺及普通舰船战果菜单，不由“致命一击”“一发入魂”等文案认所有参与或总指挥 |
| 48 | karl ZAA／2117686166 | 头衔“蜗牛 已认证”；蜗牛；远征、字符画、星城／跳货／凯门鳄收藏及共享总览，不认实际参战、原作者或指挥 |
| 49 | Hedeng／2122249719 | 头衔“鹤灯 已认证 DD第一深情”；鹤灯／DD第一深情；简介空，情感头衔不认现实关系或独立故事 |
| 50 | SkyFanaticis／2123218779 | 头衔“狂徒 已认证”；狂徒；归yzy314双号，默认简介 |

本批岗位优先线索为幻冰FOV-XFLET（2123321777）、探归Chevalier-Tan（2114368430）、扎加拉Angdaiyin（2121416236）、无间Wujian（2118123759）的总监头衔。探归本人还明确写PH华人社区Discord主持与退役UP，直链[探归者夕迁Official](https://space.bilibili.com/8702252)，可认本人平台账号；不抄联系方式、不读取视频影像／字幕／音轨，后续可沿公开文字补主持事务、作品互动或独立人物故事。知乎材料中的“熊猫人探归”只同中文昵称，尚无跨平台自报桥，不把其2020年AOM评论直接套给本号。山之内花音RoxyMG当前在另一军团（98631475），不把其Director头衔记为Dusk任职；禅师lthildim（2120843622）写战地记者，但未取得实际报道作品，回收入口也不证明本人负责回收或完成交付。

雪舞snowdance（2122261505）、BloodDance（2122982148）同中文头衔同Dusk归双号；如月Eyesone（2122303426）、GlassBulb（2122333526）、Yasuraoka（2122285814）同中文头衔同团归三号；梅林menglin Ormand（2116392936）、menglin Garemoko（2123605130）同独特词根、中文头衔同团，后者直链前者，归双号；狂徒yzy314（2123220093）、SkyFanaticis（2123218779）同中文头衔同团归双号；探归Chevalier-Crusader（2119751783）、Chevalier-Tan（2114368430）同独特词根、中文头衔同团归双号。共有“已认证”标签只是军团名片格式，不把不同中文名的人合并，也不认作CEO／FC职务。

多米与漆黑复用已有列传。数字名2121165138仍以角色ID复用[QHei既有同人链与Monitor依据](../../src/people/qihei/materials-qihei.md)，不因名字在榜单显示数字另收一人，也不推测改名缘由或角色转让。星奏、Ar、文大复用原画像和旧队列，月榜、字画、共享工具与KB继续只作线索。

## BOP前50头衔增量（2026-10-14）

历史榜前1—50的头衔与简介文字已核读；4份成功画像复用，新增46次ESI角色请求。现成诗文、NPC设定、字符画只辨认类型，不当人物自创作品；不保存现实联系方式与民族侮辱。未读视频影像、字幕或音轨，也未跑个人船型统计。来源为各角色[公开ESI](https://esi.evetech.net/latest/characters/2115982767/)，逐号ID和已核范围如下，缓存名片不冒充当日刷新。

| 历史名次 | 角色／ID | 公开头衔与身份增量／续查缺口 |
| --- | --- | --- |
| 1 | virustao wang／2115847829 | 头衔“☺赤翼-大炮是丈量国土面积”；赤翼；已有Monitor列传，R virushuan／V virushuan同词根、同赤翼头衔同BOP归新增小号；教程与频道不认本人作者或冠希 |
| 2 | Pisces AN／2113760714 | 头衔“星痕”；星痕；复用旧候选，简介D manson、冷剑与稀有泰坦收藏；不以常见外号并灭世星痕，不凭收藏立传 |
| 3 | R virushuan／2115884297 | 头衔“赤翼-卡彻守护神-埃索土皇帝”；赤翼／卡彻守护神／埃索土皇帝；归virustao wang，与V virushuan同编号风格、头衔同BOP；共享配船、怪抗与教程入口不认独立管理事件 |
| 4 | R virustao／2115982767 | 头衔“赤翼”；赤翼；复用已对应R virustao，工具与普通蛋收藏不新增指挥经历 |
| 5 | JYDSYHYL／2114753808 | 头衔“九月”；九月；JYDSYHYL与JYDSY、YL JYDSY同词根、中文头衔同BOP归三号；估价工具，实际职责／故事待补 |
| 6 | Yog-Sothoth Tsasa／2114203575 | 头衔“龙渊——EVE单口相声”；龙渊／EVE单口相声；与Deep-blue Andomer同中文头衔同BOP归双号；战果、字画不认原创相声或独立事件 |
| 7 | Kay Wood／2116117848 | 头衔“观星”；观星；简介空，实际职责／故事待补 |
| 8 | Feixiang Audene／2113686565 | 头衔“飞翔”；飞翔；与DUDUvDUDu同中文头衔同BOP归双号；共享总览、抗性表，不从工具认教官 |
| 9 | Fan Tuan Tuan／2118880203 | 头衔“饭团团”；饭团团；与Sun Xing Zhe同中文头衔同BOP归双号；格言、《出师表》及导航，不认原创作品或社区任职 |
| 10 | metree／2114564840 | 头衔“老杰克”；老杰克；工具及本人奇奇莫拉损失，不把普通损失单独立传 |
| 11 | dear mumusan／2114825720 | 头衔“木木三”；木木三；已有列传，WTB KB、诗句与共享总览不认交易实际完成或原创作者 |
| 12 | V virushuan／2115979807 | 头衔“赤翼小号-寡妇杀手”；赤翼小号／寡妇杀手；V virushuan自写小号、同赤翼词根同团，归本人，不从绰号认实际击杀寡妇 |
| 13 | sanjiang／2115800495 | 头衔“三江”；三江；与sanjiang A同独特词根、中文头衔同BOP归双号；泰坦等收藏，未核本人参与，不凭收藏立传 |
| 14 | Apple Reborn／2113791371 | 头衔“苹二,锅大王,甲级战犯”；苹二／锅大王／甲级战犯；复用已有CEO及苹果同人材料，头衔自嘲不补造指挥事故 |
| 15 | Sjt gala／2121793314 | 头衔“无”；无头衔；当前98643246，共享虫洞出口表，不认原创教学或本人社区职务 |
| 16 | nature00 soul／2113266423 | 头衔“天籁”；天籁；复用已有作者／FC列传，英文生存守则、掠夺舰／元帅等收藏及本人纳迦法损失；不把新收藏全部认本人击杀 |
| 17 | sanjiang A／2117471417 | 头衔“三江”；三江；归sanjiang双号，同词根同头衔同BOP，广播与估价工具不单独立传 |
| 18 | Bloodcolour honour／2114395157 | 头衔“血色荣耀”；血色荣耀；我爱你及KB入口，不认实际恋情或独立事件 |
| 19 | Jungle Chan／94870154 | 头衔“程正果”；程正果；复用原人物线索，11条本人帕拉丁损失及读书自嘲未补足门槛，不恢复列传 |
| 20 | RAVleiwen／2123523815 | 头衔“雷文”；雷文；默认简介，实际职责／故事待补 |
| 21 | Yan Zui Zhu／2113235830 | 头衔“蚂蚁”；蚂蚁；共享配置、物流广告及帕拉丁超网，不认Imperial Transcontinental Logistics经营者或实际交付 |
| 22 | Argyrosaurus／2116484411 | 头衔“银龙”；银龙；与Graceful Lion同中文头衔同BOP，且相同新人邀请链接，归双号；字画、抗性／声望工具不认教官或原创作者 |
| 23 | Airuta Majima／2115486661 | 头衔“鬼大王”；鬼大王；自称萌新拿下旗舰吨位，挂勒维亚坦、冥府与神奇黑旗战果，未核个人参与，不凭收藏／自吹立传 |
| 24 | soulembers Omanid／2113634755 | 头衔“甘蔗”；甘蔗；游戏NPC演讲不作人物经历，星城收藏及akissone角色链接不认小号；提醒带后勤不证明FC |
| 25 | Trainee Captain／2118315996 | 头衔“实习舰长”；实习舰长；反对抽主号／卖号后堆小号混人权的个人意见，出售官员装备与P4长期生产文案；未核具体交易／履约，不因英文简称TC归TweakCuke |
| 26 | Stone Xiao／2114820480 | 头衔“泡泡很忙”；泡泡很忙；Stone Xiao同中文头衔、同当前PLA，归XXXHolic-TK X旧CEO候选及dawnstar091 XX同人组，不归空离；共享工具不认原创作者 |
| 27 | KrischLi／2120707880 | 头衔“69”；69；工具与共享总览，没有具体岗位／独立事件 |
| 28 | Kali Squat／2115258981 | 头衔“卡里”；卡里；字画、怪抗及工具表，不认原创作者或实际教学 |
| 29 | Fatemoon2001／2119818368 | 头衔“血肉苦弱”；血肉苦弱；Fatemoon2001与Fatemoon2004同独特词根、中文头衔同当前D.OK归双号；Fatemoon01神示收藏未核操作人或个人参与 |
| 30 | Dark BOOB／2115142937 | 头衔“懒洋洋”；懒洋洋；当前98709916，字画、工具与抗性表，不以通用外号跨团并人 |
| 31 | seven-sec Ellecon／2112509132 | 头衔“孟婆”；孟婆；文案、泰坦及普通舰船收藏与工具，不仅凭同外号认其他人物 |
| 32 | Tom Wincheste／2113210093 | 头衔“催命”；催命；复用九月画像及原候选队列，广播／总览／世界方舟入口，不认本人旗舰或FC |
| 33 | JYDSY／2114852283 | 头衔“九月”；九月；归JYDSYHYL三号组，简介空，实际职责／故事待补 |
| 34 | DUDUvDUDu／2116306763 | 头衔“飞翔”；飞翔；归Feixiang Audene双号，Dracarys. Cap Chain及广播配置不认实际管理或指挥任职 |
| 35 | PiKaQ／2119555414 | 头衔“皮卡”；皮卡；工具大全、回收角色入口和隐跳／流浪洞笔记，未认回收经营者或具体教学作品 |
| 36 | Yukon ChaosWeaver／2114208258 | 头衔“织炎”；织炎；角色技能文案、GM／CCP及普通舰船收藏、超网，不当真实技能／事件或实际成交 |
| 37 | July is'hot Duyin／2114548750 | 头衔“七月有点热”；七月有点热；游戏休眠／迷失虚空文案，不补真实AFK经历或独立故事 |
| 38 | Boiled fish／2114649026 | 头衔“无”；无头衔；已离开玩家军团，抗性表，不认原创作者或实际职责 |
| 39 | Yihongyuan／2115480135 | 头衔“☺怡红院-带头造反-参谋长”；怡红院／带头造反／参谋长；明确名片称号，具体参谋分工、任期与所谓造反事件待补；使徒损失与个人自述不单独立传 |
| 40 | Fatemoon2004／2120149665 | 头衔“血肉苦弱”；血肉苦弱；归Fatemoon2001双号，当前D.OK，默认简介 |
| 41 | YL JYDSY／2114852301 | 头衔“九月”；九月；归JYDSYHYL／JYDSY三号组，简介空，职责／故事待补 |
| 42 | SisterI'mhanging Sister／2114556720 | 头衔“点点”；点点；共享总览／工具，不因常见点点昵称跨团并人 |
| 43 | NO TRACE／2114564572 | 头衔“无”；无头衔；已离开玩家军团，苏轼词句，不认本人作品或实际事件 |
| 44 | Hervyz／2122181744 | 头衔“何公子”；何公子；定制总览、广播、怪抗及声望工具，不从定制标签认实际教官／作者 |
| 45 | Alluradel／2116698842 | 头衔“无”；无头衔；已离开玩家军团，The Mittani獾收藏、本人归魂者损失自称刷怪意外及World Ark入口；身份／事件待补，不凭收藏立传 |
| 46 | jianlajichide mua／2114567983 | 头衔“叮咚”；叮咚；2020-01-12奇幻冒险及文字笑话，既有2019普通无畏KM最后一击附图不证明FC，事由与故事待补 |
| 47 | Deep-blue Andomer／2113227269 | 头衔“龙渊”；龙渊；归Yog-Sothoth Tsasa双号，旧BOP九年招新文案与战果；不由招新文案认当时CEO或所有福利已兑付，联系方式不保存 |
| 48 | Katou Megumii／2113507968 | 头衔“西兰”；西兰；总览及泰坦收藏，未核个人参与，不凭收藏立传 |
| 49 | Graceful Lion／2122257758 | 头衔“银龙”；银龙；归Argyrosaurus双号，同中文头衔、同当前BOP及同新人邀请链接 |
| 50 | Sun Xing Zhe／2119388568 | 头衔“---☺饭团团”；饭团团；归Fan Tuan Tuan双号，公开游戏上线安排、舰船目标、KOOK及互救提醒，不认实际值守／救援或管理职责 |

赤翼新增R virushuan（2115884297）、V virushuan（2115979807）：同virus词根、同赤翼中文头衔同BOP，V本人写“赤翼小号”，与已有virustao wang／R virustao归同一人，见[本人素材](../../src/people/virustao-wang/materials-virustao-wang.md)。九月为JYDSYHYL（2114753808）、JYDSY（2114852283）、YL JYDSY（2114852301），同独特词根、中文头衔同BOP归三号；三江sanjiang（2115800495）、sanjiang A（2117471417）同词根、中文头衔同团归双号。血肉苦弱Fatemoon2001（2119818368）、Fatemoon2004（2120149665）同词根、中文头衔同当前D.OK归双号；简介另挂Fatemoon01的神示，先留关系线索，不直接认其全部操作或战果。
饭团团Fan Tuan Tuan（2118880203）、Sun Xing Zhe（2119388568）同中文头衔同BOP归双号；银龙Argyrosaurus（2116484411）、Graceful Lion（2122257758）同中文头衔同团，简介又有同一新人邀请链接，归双号；龙渊Yog-Sothoth Tsasa（2114203575）、Deep-blue Andomer（2113227269）同中文头衔同BOP归双号；飞翔Feixiang Audene（2113686565）、DUDUvDUDu（2116306763）同中文头衔同团归双号。总览、矿表、频道、交易入口与现成诗文不补足独立列传门槛，各组实际事务或人物故事继续沿本队列。

Stone Xiao（2114820480）公开头衔“泡泡很忙”、同当前PLA，与[XXXHolic-TK X／dawnstar091 XX组](../../src/people/kongli/materials-kongli.md#泡泡很忙同人号)归同人，不并给空离；仅保存中文称呼，去掉头衔中的联系方式。当前角色对应不倒推每个小号的历史职务。怡红院Yihongyuan（2115480135）名片写“带头造反／参谋长”，保留为职责优先候选；没有具体造反事件或实际参谋事务，不能把绰号扩写成政变或指挥实绩。
苹二、赤翼、木木三、天籁复用已有角色、职务与故事；程正果、星痕、催命、其余战果墙候选仍按原门槛保留线索，不把普通失舰或小事重新包装成立传理由。实习舰长Trainee Captain与TC／TweakCuke没有同人桥，不仅凭英文缩写并人。

## Fox前50头衔增量（2026-10-15）

历史榜前1—50名片文字已核读；2份已有ESI画像复用，新增48次角色请求，于10月14日取得、15日归档。另核官网具名核心团队、教官与组织规则，来源已归[共用材料](../sources/foxor-management-2026-10-15.md)。关联取材首轮上限30次：网页读取失败1次、官网正文和名单2次、原始Monitor KM1次、精确名查询和星系名2次、JNNN find查询1次，四名新收录快照与头像共21次；合计28次，其余名片查重复用ID，不联网。未读视频影像、字幕或音轨，没有人人船型统计。歌词、诗文、字画只辨认内容类型，不认本人创作，不存现实联系方式或地点。

| 历史名次 | 角色／ID | 公开头衔与身份增量／续查缺口 |
| --- | --- | --- |
| 1 | KIddsis Wang／2112441816 | 头衔“兔斯基”；兔斯基；官网核心团队明确列舰队翻译、战备物资上架与合同管理，已有实际职责依据，已写短篇；旗舰收藏未核个人参与 |
| 2 | NyxCV／2122366928 | 头衔“无梦”；无梦；官网明确列前线FC及IT运维，已写短篇；简介小额游戏欠账仅作补充，不是立传理由 |
| 3 | Xaivada Skywalker／96506815 | 头衔“梁天 FOX镶黄旗 第一巴图鲁”；梁天／FOX镶黄旗／第一巴图鲁；官网明确列欧区外交、黑隐队指挥和IT，已写短篇；WTB Fanta／Uber Eat归双小号 |
| 4 | SkyWalker Shen／2114341045 | 头衔“在小小的花园里面挖呀挖呀挖”；在小小的花园里面挖呀挖呀挖；链接四十二、共享乞讨文案与fc总览；元帅自损及收藏不证明FC，不凭Skywalker词归梁天 |
| 5 | chu meng／2116299695 | 头衔“我叫初梦妈妈从小告诉我名字长容易被别人记住”；初梦；官网股东／战斗总监／指挥体系职责及CBO致辞，已写短篇；YoYo zhang同头衔同团归小号 |
| 6 | zlzl24／2122181840 | 头衔“无”；无头衔；当前98771960，表情文案，实际职责／故事待补 |
| 7 | SilverVanilla／2120471651 | 头衔“峰哥亡命天涯”；峰哥亡命天涯；共享乞讨文案、fc总览与战果收藏，fc为预设名，不认指挥任职 |
| 8 | WLlng／2122271544 | 头衔“清水”；清水；复用混沌已读画像，当前CACX，文学引句不认本人作品 |
| 9 | Miss 2600／93370327 | 头衔“沐风”；沐风；官网荣誉顾问／赞助人，未列组织工作；与Buddhakeks同头衔同Fox归双号，具体支持或独立故事待补 |
| 10 | EVEBruceL／2112928634 | 头衔“布鲁斯”；布鲁斯；当前CACX，简介空，实际职责／故事待补 |
| 11 | JNNN／2116157769 | 头衔“小桔”；小桔；官网FC、安全官查SPY及IT运维；本人Monitor损失原件已核，已写短篇；Lemon JN归同人 |
| 12 | mightyhh／2122604639 | 头衔“灰灰”；灰灰；当前PLA，默认简介，不保存头衔联系方式，不以常见昵称跨团并人 |
| 13 | Yeah Three／2122086189 | 头衔“无”；无头衔；复用ES画像，已离开玩家军团，文字游戏与普通损失不单独立传 |
| 14 | CptDavyJones／2113996237 | 头衔“骷髅”；骷髅；简介空，不因Davy／船长通用词归其他人物 |
| 15 | YoYo zhang／2112470936 | 头衔“初梦”；初梦；归chu meng小号，官网实际管理／指挥职责可用；战果收藏未核个人参与 |
| 16 | HLP Akiga／2116014383 | 头衔“无”；无头衔；已离开玩家军团，跳洛基修人文案、物品与广播，不把玩笑当实际救援或FC |
| 17 | Reimu Suzumiya／2118143751 | 头衔“上杉(三神裔仙人)”；上杉／三神裔仙人；官网核心股东、人事总监，负责招募与教官管理，另列教官；按重要职责已写短篇，普通损失／技能自嘲只作补充 |
| 18 | yaouy／2123357458 | 头衔“妖雨”；妖雨；简介空，实际职责／故事待补 |
| 19 | ckevin hao／2115456845 | 头衔“康斯坦丁”；康斯坦丁；超旗与黑隐战果收藏，未核参与，不据标题blops认黑隐队指挥 |
| 20 | Aloutte／2122585760 | 头衔“大聪明”；大聪明；默认简介，不以通用外号归Grand Bright等其他人 |
| 21 | Audacon Eyrou／2121687358 | 头衔“瑾”；瑾；官网明确列公司快递运作与远征合作社负责人，按实际职责已写短篇；总览不等于独立教学 |
| 22 | Mor Morgana／2123103540 | 头衔“特洛伊”；特洛伊；Mor Morgana同中文头衔同Fox，接官网Gtroy（2120504987）同人组；官网明确IT运维、狐姬之父，已写短篇，具体作品待补，不将诗篇认本人创作 |
| 23 | Census Office／2121754338 | 头衔“路人甲”；路人甲；两个反引号，实际职责／故事待补 |
| 24 | WTB Fanta／2115594093 | 头衔“梁天”；梁天；归Xaivada Skywalker组，简介空，角色统计不相加 |
| 25 | Mikong／2122339171 | 头衔“柿子”；柿子；简介“1”，实际职责／故事待补 |
| 26 | Uber Eat／2122203216 | 头衔“梁天”；梁天；归Xaivada Skywalker组，F1 Monkey／广播及PH建筑入口不认独立事件 |
| 27 | SylphZorah／2122424721 | 头衔“紫凰 POS权限”；紫凰／POS权限；与Conrad Stonebanks同中文头衔同Fox归双号；权限名片不自动算重要管理，实际事务待补 |
| 28 | LUIDEAM／2122123518 | 头衔“牢路 单浪王”；牢路／单浪王；与Laolu5同个性头衔同Fox归双号，简介空，独立事件／实际职责待补 |
| 29 | Joker Adora Otsito／2117618582 | 头衔“黑帆”；黑帆；格言与共享设置，不认真实宗教身份、原创作者或FC |
| 30 | BINGLANGZHIXI／2123031626 | 头衔“猫猫很有坏心思”；猫猫很有坏心思；当前伏羲，矿石、远征与共享笔记，官员远征文案不认本人实际操作或原创教学 |
| 31 | Beebo W／2122727901 | 头衔“囚鸟，『混沌第一白给巴图鲁』,『今天你白给了吗?』,『得罪了智障还想走?!』,『宝可梦大湿』，『008老表』”；囚鸟／混沌第一白给巴图鲁等；当前CACX，格言与讨ISK文案，不凭通用008称呼归其他人物或单独立传 |
| 32 | 123456jiudianfen1／2122209503 | 头衔“淀粉”；淀粉；PH工业站点与战果收藏，未核本人参与或实际经营，不凭收藏立传 |
| 33 | XIAODIZHU X／2114722499 | 头衔“小地主”；小地主；与DIZHU XFKANGKANG同地主词根、中文头衔同Fox归双号；超网与字符画不认交易履约 |
| 34 | Tlartor／2118947519 | 头衔“七叔”；七叔；广播／银狐总览与工具入口，不认原创教学或FC |
| 35 | filmbailang／2122875877 | 头衔“白浪”；白浪；官网列教官，并自述手游转欧服、卫队民兵赚LP、游戏内答疑；具体教学／人物事件待补，不从教官头衔自动认核心管理 |
| 36 | Lemon JN／2116257822 | 头衔“小桔,在九月结束的时候与你告别”；小桔／九月告别文案；同中文头衔、同简介文案同Fox，归JNNN小号，不与筱橘近音并人 |
| 37 | Stardust Driver／2121456564 | 头衔“星辰”；星辰；当前98601277，字画，不以常见称呼跨团归其他人 |
| 38 | Quickchop of King／2122492494 | 头衔“迅斩”；迅斩；默认简介，实际职责／故事待补 |
| 39 | JulyI／2121916490 | 头衔“七月”；七月；当前KZU，文艺句子，不以同月份称呼跨团并人 |
| 40 | MrGuess／2123060976 | 头衔“猜猜”；猜猜；字符画，不认本人作品或实际事件 |
| 41 | Buddhakeks／1373163196 | 头衔“沐风”；沐风；归Miss 2600双号，德语文案不认真实国籍或现实身份 |
| 42 | YANG KE／2116273912 | 头衔“杨科”；杨科；当前CACX，共享广播与物品、字画，不认教官或指挥 |
| 43 | Yumi Charen-Teng／94705524 | 头衔“人来疯 pos权限”；人来疯／pos权限；名人引句与奇美拉收藏，权限称号不自动算重要管理，实际岗位／故事待补 |
| 44 | Conrad Stonebanks／2121294308 | 头衔“紫凰”；紫凰；归SylphZorah双号，舰载机弱点表、总览与物品，不认原创教学或独立事件 |
| 45 | Nosi Umid／2121259599 | 头衔“子启”；子启；当前采星者，自夸外观／泰坦糕手、采星七周年纪念及收藏，不认现实外貌、实际驾驶泰坦或全部参与 |
| 46 | ZxwSky／2121436639 | 头衔“希艾”；希艾；广播／总览与行星工业标签，具体职责／故事待补 |
| 47 | DIXIN7／2121120042 | 头衔“47”；47；默认简介，不凭数字绰号归四十二或其他人物 |
| 48 | Laolu5／2123413191 | 头衔“牢路”；牢路；归LUIDEAM双号，同中文头衔同团，默认简介 |
| 49 | DIZHU XFKANGKANG／2116449123 | 头衔“小地主”；小地主；归XIAODIZHU X双号，同地主词根、中文头衔同团，简介空 |
| 50 | Renard42／2121799880 | 头衔“四十二”；四十二；复用已有CEO／FC列传；乞讨文案多人共用，不仅凭这段把成员归四十二 |

具名官网比角色简介多出明确职责：[兔斯基](../../src/people/kiddsis-wang/materials-kiddsis-wang.md)舰队翻译／战备合同，[上杉](../../src/people/reimu-suzumiya/materials-reimu-suzumiya.md)股东／人事总监，[瑾](../../src/people/audacon-eyrou/materials-audacon-eyrou.md)公司快递与远征合作社，[特洛伊](../../src/people/gtroy/materials-gtroy.md)IT运维及吉祥物制作。以上按重要管理或实际组织职责已写短篇，具体事务、作品与战例继续补，不能因为没见Monitor改判只剩KB墙。官网另列[折木](../../src/people/charly-ouo/materials-charly-ouo.md)Charly OUO（2121856723）为股东／CFO／FC，[澄明](../../src/people/clarityjupiter/materials-clarityjupiter.md)ClarityJupiter（2122296275）为外交总监兼招新与教官管理；两号虽不在此50名中，精确名字已对应，短篇已分别归本人目录，不因名次排除。

小桔JNNN（2116157769）与Lemon JN（2116257822）同中文头衔、同个性九月告别文案同Fox，归本人，见[素材](../../src/people/jnnn/materials-jnnn.md)。[原始Monitor损失](https://esi.evetech.net/latest/killmails/127516378/cc6aaea3d2834d9072af05c2a6f768d895100fbf/)为2025-05-31T14:05:08Z、Q-K2T7，受害者为本号、Fox／PH、船型45534；官网另明确FC／安全官SPY调查／IT岗位。按实际指挥与职责写短篇，不把普通指挥船损失当黑料或推为总指挥。
梁天Xaivada Skywalker（96506815）、WTB Fanta（2115594093）、Uber Eat（2122203216）同中文头衔同Fox归三号；初梦chu meng（2116299695）、YoYo zhang（2112470936）同中文头衔同Fox归双号，均归本人素材。官网“梁天”是外交／黑隐／IT，“初梦”是股东／战斗总监／指挥体系，各自职务不归四十二；SkyWalker Shen的Renard42文本、多人共享乞讨文案和fc总览只是链接／配置，不作为同人或FC任职依据。

紫凰SylphZorah（2122424721）、Conrad Stonebanks（2121294308）同中文头衔同Fox归双号；牢路LUIDEAM（2122123518）、Laolu5（2123413191）同个性头衔同团归双号；小地主XIAODIZHU X（2114722499）、DIZHU XFKANGKANG（2116449123）同地主词根、中文头衔同团归双号；沐风Miss 2600（93370327）、Buddhakeks（1373163196）同中文头衔同团归双号，暂不把荣誉赞助身份当具体管理岗位。特洛伊Mor Morgana（2123103540）同官网Gtroy中文名、同Fox，归[特洛伊本人](../../src/people/gtroy/materials-gtroy.md)，原诗篇不当本人作品。

白浪的教官身份另有官网自述，但具体教学文字／互动待读；其余共享工具、战果墙、普通自嘲候选继续保留。未读新视频，不把B站直播间链接直接认成小桔本人主播账号。

## 叶落星海前50头衔增量（2026-10-15）

历史榜前1—50头衔／简介文字已核读；3份成功画像复用，新增47次ESI角色请求。另以1次军团ESI和1次登记CEO名片请求核对任职与福利口径，关联取材首轮上限30次、实际2次。没有人人船型统计、未读视频影像／字幕／音轨；字符画只记存在，现成诗文不认本人作品。现实联系方式、群号不保存。角色ID见下表，来源为[公开ESI](https://esi.evetech.net/latest/characters/2114598179/)，缓存名片不冒充当日刷新；另读第51名登记CEO名片，单列增量，不混作原前50批次。

| 历史名次 | 角色／ID | 公开头衔与身份增量／续查缺口 |
| --- | --- | --- |
| 1 | siti xiya／2115264327 | 头衔“丝提西亚”；丝提西亚；与siti xiya1同独特词根、中文头衔同当前Arknights归双号；星城／归魂者收藏未核个人参与，不凭收藏立传 |
| 2 | Tama Ajatar／2118469291 | 头衔“浪子”；浪子；与Jita Ajatar同Ajatar词根、中文头衔同叶落归双号；战果及GM／CCP收藏不认实际指挥或独立事件 |
| 3 | Nicholas Kaga／2120220330 | 头衔“加贺，狂犬”；加贺／狂犬；自称专业CRN驾驶员，广播与格言，不把舰船驾驶自称当FC |
| 4 | sk mmmm／2114598179 | 头衔“青春 维纳尔萌新”；青春／维纳尔萌新；复用已有主事者／FC与列传，新人6亿＋8亿福利及任务合作社入口归本人素材，不把宣传认实际兑付 |
| 5 | akdanks Ozuwara／2114921441 | 头衔“一声问候”；一声问候；掠夺舰、CCP及普通船收藏、广播与字符画，不认原创总览作者或独立故事 |
| 6 | Zzzzmishi／2118809396 | 头衔“迷失”；迷失；与zstray同中文头衔同叶落归双号，“已收到，感谢”缺具体事件，不认实际交付或补损 |
| 7 | FOLIE／2117980500 | 头衔“风子”；风子；与FOLIE2同独特词根、中文头衔同叶落归双号；2024-11-29 13:00战报入口及噩梦收藏，未读BR，不认指挥或具体战役胜负 |
| 8 | zstray／2118867585 | 头衔“迷失”；迷失；归Zzzzmishi双号，默认简介，不因无内容否定已成同人对应 |
| 9 | Novice White／2114983705 | 头衔“风筝糕手”；风筝糕手；当前特执，魔像文案不认本人事故，不以近音外号跨团并人 |
| 10 | FengZ Ours／2115169195 | 头衔“银色黎明小号”；银色黎明小号；有自报主人外号，主号尚未对到；药品物品链接不认原创教学或独立事件 |
| 11 | Mayi Hoi／2113451467 | 头衔“环球蚂蚁”；环球蚂蚁；N老板玩笑、字画及普通无畏等收藏，不凭物品／称呼认管理或独立故事 |
| 12 | MrGao／2114912615 | 头衔“长清风”；长清风；共享凛冬总览与制式，不认教官或原创作者 |
| 13 | liubi150 Pc／2115032211 | 头衔“麦克”；麦克；简介空，实际职责／故事待补 |
| 14 | Docter Hikanami／2118244824 | 头衔“黑色乌鸦,叶落第一导”；黑色乌鸦／叶落第一导；已有战备后勤主管、对手点名争议及列传，复用原材料；“第一导”不单独证明FC，DOCTOR联盟岗位对应仍待核 |
| 15 | Partia1 pear／2119692121 | 头衔“偏梨”；偏梨；广播、星系／距离文案与总览，不认原创教学或实际岗位 |
| 16 | Fawang／2114237535 | 头衔“法网”；法网；共享总览、挖坟配置及掠夺舰收藏，不认实际教学或指挥 |
| 17 | empair Chieve／2114378432 | 头衔“帝国”；帝国；矿船／特里斯坦配装、广播及合同入口，不认作者、承运角色或实际成交 |
| 18 | FOLIE2／2118921577 | 头衔“风子”；风子；归FOLIE双号，同独特词根同中文头衔同叶落，总览与默认文案 |
| 19 | dao123／2115821912 | 头衔“王钢蛋”；王钢蛋；共享总览与角色链接，不以配置作者名认本人或其他号 |
| 20 | Growlyena Lee／2114280895 | 头衔“戴恩”；戴恩；复用采星已读画像和Grola同人组，当前Arknights；燃料组事项继续沿原队列，不重复查名 |
| 21 | xzl520／2121282068 | 头衔“♡猫娘♡”；猫娘；复用伏羲已读画像与已有FC列传，当前伏羲；已有Monitor及角色对应保留，新总览文案不添新指挥场次 |
| 22 | Blooding Avatar／95962804 | 头衔“子启”；子启；Blooding Avatar与Nosi Umid同个性中文头衔、同完整简介同采星归双号；外观／泰坦糕手自嘲和纪念收藏不认现实身份或实际驾驶 |
| 23 | HiTelitar／2119880151 | 头衔“河马”；河马；GLHF文案，实际职责／故事待补 |
| 24 | weier3／2121487383 | 头衔“威尔”；威尔；绝念、使徒等收藏，未核个人参与，军团链接／广播不认管理或FC |
| 25 | Titan ziteo／2115748340 | 头衔“泰坦”；泰坦；共享总览、普通舰船收藏及星系入口，不由名字认泰坦驾驶员 |
| 26 | forverfly／2117761622 | 头衔“墨归”；墨归；一天不爆船难受自嘲、共享设置、中秋礼包入口，不认原创教学或独立事件 |
| 27 | sk loceme／2114852427 | 头衔“合欢散”；合欢散；与青春只共用sk通用前缀、个性头衔不同，不直接归本人；作战位标不认FC |
| 28 | nocan nobibi／2115478648 | 头衔“雪菜”；雪菜；当前PLA，飞龙收藏未核本人参与，不保存头衔联系方式或凭收藏立传 |
| 29 | rainstorm fzh／2114883451 | 头衔“暴雨 =总监=”；暴雨／总监；明确名片称号，具体分工、任期与管理事件待补；新人邀请入口不认实际履约 |
| 30 | Rock YIN／95305085 | 头衔“小金刚”；小金刚；魔像收藏未核个人参与，不与其他团金刚只凭常见外号并人 |
| 31 | Kauroma Kurvora／2119076720 | 头衔“素奕”；素奕；总览、估价与广播工具，实际职责／故事待补 |
| 32 | Catherine Jing／2115378239 | 头衔“义坦小号”；义坦小号；自报主人外号，简介Phoenix saya字符画；主号未对上，不由画中文字认操作者 |
| 33 | BBKAO CHIANG／2112223923 | 头衔“BBKAO”；BBKAO；普通舰船及青春蛋收藏、广播与私人总览，不由收藏认本人小号或指挥 |
| 34 | Pantake／2121281180 | 头衔“小豆角”；小豆角；当前创世，莱塔卢收藏未核参与，不把通用豆字归其他人 |
| 35 | Hoshiguma／2117447303 | 头衔“震荡”；震荡；简介空，实际职责／故事待补 |
| 36 | Jessi Creative／92164907 | 头衔“慈悲”；慈悲；创世记引句，不认本人创作、现实宗教或独立事件 |
| 37 | DragonHao6Hero／2117641272 | 头衔“神龙丶龙皓”；神龙丶龙皓；物品与广播、文字玩笑，不认本人驾驶CCP船或独立事件 |
| 38 | siti xiya1／2115841336 | 头衔“丝提西亚”；丝提西亚；归siti xiya双号，同词根同中文头衔同当前Arknights，简介空 |
| 39 | YAmatou／2117753422 | 头衔“寒鸦号”；寒鸦号；任务交易与燃烧总览入口，实际经营／作者与具体教学内容待补 |
| 40 | kaisa666／2122901847 | 头衔“天空暮雨”；天空暮雨；默认简介，实际职责／故事待补 |
| 41 | Laura Rolla／2119882517 | 头衔“阿坤”；阿坤；默认简介，实际职责／故事待补 |
| 42 | Mrone FENG／2114579225 | 头衔“随缘/泰坦”；随缘／泰坦；任务抗性、值守提醒及共享总览，不由名字或频道提醒认泰坦驾驶、值守负责人或FC |
| 43 | Berserker Aries／2114928013 | 头衔“阿瑞斯”；阿瑞斯；复用特执已读画像，当前特执；星城／神示等收藏不认新的指挥经历或独立事件 |
| 44 | HFSLOVEBABY／2115676768 | 头衔“胖子”；胖子；简介空，不以常见称呼跨团并人 |
| 45 | Jita Ajatar／2118469323 | 头衔“浪子”；浪子；归Tama Ajatar双号，同Ajatar词根同中文头衔同叶落；简介“红”不认实际事件 |
| 46 | Anton Chancel／2115746848 | 头衔“=安东=”；安东；与Andon Chancel同近形词根、中文头衔同叶落归双号，简介空 |
| 47 | North Hades／2122158066 | 头衔“北冥、叶落第一小鸡霸”；北冥／叶落第一小鸡霸；交流群入口不认群主／重要管理，不保存群号或由自嘲认现实身体 |
| 48 | Cheng777／2123617745 | 头衔“万里”；万里；当前混沌，萌新文案，不以通用称呼跨团并人 |
| 49 | Andon Chancel／2115876810 | 头衔“=安东=”；安东；归Anton Chancel双号，同近形词根同中文头衔同叶落，简介空 |
| 50 | Tank Shen／2113709827 | 头衔“坦克”；坦克；自称喜欢PVE，未认实际岗位／故事 |

丝提西亚siti xiya（2115264327）、siti xiya1（2115841336）同独特词根、中文头衔同当前Arknights归双号；浪子Tama Ajatar（2118469291）、Jita Ajatar（2118469323）同Ajatar词根、中文头衔同叶落归双号；迷失Zzzzmishi（2118809396）、zstray（2118867585）同中文头衔同叶落归双号；风子FOLIE（2117980500）、FOLIE2（2118921577）同独特词根、中文头衔同叶落归双号；安东Anton Chancel（2115746848）、Andon Chancel（2115876810）同近形词根、中文头衔同叶落归双号，身份已成、不另等确认。子启Blooding Avatar（95962804）与前批Nosi Umid（2121259599）同中文头衔、同完整个性简介同采星者，归同人组，不凭泰坦糕手文案或采星周年庆收藏编实际操作。

暴雨rainstorm fzh（2114883451）有总监头衔，具体分工／任期尚缺；寒鸦号YAmatou（2117753422）有任务交易、燃烧配置入口，实际经营与作品文字继续补。FengZ Ours（2115169195）自写银色黎明小号，Catherine Jing（2115378239）自写义坦小号，主人外号已留、主号仍未对上；不因字画或通用前缀擅认。sk loceme（2114852427）头衔合欢散，与青春中文头衔不同，只有sk通用前缀，不直接并人。

青春、黑色乌鸦、猫娘复用原列传与已核职责／指挥依据；戴恩、阿瑞斯复用旧画像和候选，不重复抓成功来源。[最新军团ESI](https://esi.evetech.net/latest/corporations/98588384/)仍列创建者sk mmmm、登记CEO AsunaZX（2119592670），简介则写CEO sk mmmm并将业务邮件引向本号；这两个号的真人关系仍缺桥，不把旋转直接并青春，也不据登记字段认定青春退任。福利分别为军团广告3E启动资金＋礼包，青春名片6亿＋8亿福利；均按公开承诺保存，不合并金额、不认实际发放。增量归[青春素材](../../src/people/sk-mmmm/materials-sk-mmmm.md)。

风子简介的[2024-11-29 13:00战报入口](https://br.evetools.org/related/30000294/202411291300)尚未核整窗及本人参与，不冒称已读战役，不因单有BR就立传。DOCTOR联盟岗位与黑色乌鸦是否同人仍沿[本人素材](../../src/people/docter-hikanami/materials-docter-hikanami.md)保留缺口；不从“第一导”或名字近形扩大既有战备主管职责。

登记CEO AsunaZX（2119592670）为本团历史榜第51名，本次公开头衔“旋转变幻”、当前叶落，简介仍写CEO sk mmmm，分享安东V6.0新人总览与3E启动资金、礼包／脑浆／毒蜥等团方宣传。登记任职与中文称呼已核，不因缺独立故事判其不够格；目前待核的是与已收录青春的操作者对应，先保留[本人关联素材](../../src/people/sk-mmmm/materials-sk-mmmm.md)，避免同一真人分两篇，也不编二人分工、转让或夺权。

## 红楼前50头衔增量（2026-10-15）

历史榜前1—50名片文字已读，2份成功画像复用，新增48次ESI角色请求。另核团方资料、登记CEO名片（第74名）及安迪2条原始KM；未读影像／字幕／音轨、未跑人人船型统计。角色名片来源为[ESI](https://esi.evetech.net/latest/characters/96638675/)，日期不将缓存冒充当日刷新。

| 历史名次 | 角色／ID | 公开头衔与续查记录 |
| --- | --- | --- |
| 1 | Dema1／2115768319 | 头衔“德玛”；德玛；入团邮件联系人；DEMA 119／dema110归小号；创团CEO，已立传 |
| 2 | Zuoshuzhang 007／2115765596 | 头衔“左庶长-卷王”；左庶长；同Zuoshuzhang 008词根、头衔同团归双号 |
| 3 | Justin Chronos／2114931491 | 头衔“无”；建筑战果收藏，未核个人参与或独立故事 |
| 4 | Achillesheel／2122352829 | 头衔“无”；当前230445889，文案／字符画不单独立传 |
| 5 | Shaw Cadelanne／2116417582 | 头衔“空下”；空下；与Shaw Oksaras同词根同头衔同团归双号 |
| 6 | Amarr Noname／2115454291 | 头衔“米罗克”；米罗克；复用昆仑画像，不以物品入口认实际驾驶 |
| 7 | DZ Sharisa／2114626283 | 头衔“狗哥”；狗哥；玩笑文案，职责／故事待补 |
| 8 | TieTouWa／2117003909 | 头衔“铁头”；铁头；符号文案，不与伏羲铁头跨团并人 |
| 9 | xuanfen／2122306438 | 头衔“进取号”；进取号；xuanfen2同词根同头衔同团归双号 |
| 10 | Shaw Oksaras／2116417658 | 头衔“空下”；空下；归Shaw Cadelanne双号，广播不认FC |
| 11 | Khossion Siha Davaham／2124253445 | 头衔“云苼”；云苼；简介空，待职责／故事 |
| 12 | E x-calibur／2115747228 | 头衔“咖喱棒”；咖喱棒；Via Breir Arsten头衔EX咖喱棒同团，归同人组；广播不认FC |
| 13 | DrAndy／2123920625 | 头衔“安迪”；安迪；Andythebest近名同头衔同团归双号；首战KM本人普通参战、INIT那条无本号，不认FC，见下文 |
| 14 | MSG-MashiMaro／2122590961 | 头衔“曲馨”；曲馨；技能／招新自嘲不认真实机制、实际管理或独立事件。2026-10-16 B站扫描：本人UP“MSG-Mashimaro曲馨”（UID 489315235），约59条，欧服新手教程系列至第16期、扫描与种菜教学、红楼军团短剧与《红楼战歌》，签名为欧服招新群；持续创作可另评立传，见[B站名单](../bilibili-uploaders.md#候选与线索) |
| 15 | tuhu zhang／2118494341 | 头衔“肉师傅”；肉师傅；工具、怪抗与远征笔记不认原创教学 |
| 16 | Isendra／2123652500 | 头衔“字母”；字母；简介空，待职责／故事 |
| 17 | gkl Olerie／2116772236 | 头衔“无冥”；无冥；gkl asd同词根同中文头衔同团归双号 |
| 18 | Maria DM／2114240101 | 头衔“无”；无头衔；简介空，待职责／故事 |
| 19 | Hong cg／2123508126 | 头衔“段段”；段段；默认简介；与断断仅同音及Hong团名前缀，分开留记录 |
| 20 | Seohyun Unnie／93122240 | 头衔“豆芽”；豆芽；元帅收藏未核参与，不凭收藏立传 |
| 21 | dema110／2114204576 | 头衔“无”；dema110；与Dema1近名同团归小号，无头衔，符号文案 |
| 22 | gkl asd／2116696944 | 头衔“无冥”；无冥；归gkl Olerie双号，广播及物品不认FC |
| 23 | GuardianMymMei／2119503792 | 头衔“探索”；探索；与jiaxue、PsychicSword同头衔同团归三号，建筑收藏不认指挥 |
| 24 | jiaxue／180890974 | 头衔“探索”；探索；归GuardianMymMei／PsychicSword组，字画与收藏不单独立传 |
| 25 | xuanfen2／2122976070 | 头衔“进取号”；进取号；归xuanfen双号，广播／总览不认原创作者 |
| 26 | chuntang xianjiu／2121234739 | 头衔“肉馅丸子”；肉馅丸子；与Anno-Karo同中文头衔同团归双号，FC Bee收藏不认自己FC |
| 27 | Zuoshuzhang 008／2115817809 | 头衔“左庶长”；左庶长；归Zuoshuzhang 007双号，简介空 |
| 28 | Jun927／2123577432 | 头衔“使徒”；使徒；文学句子不认原创，待故事／职责 |
| 29 | Anno-Karo／2121249272 | 头衔“肉馅丸子”；肉馅丸子；归chuntang xianjiu双号，默认简介 |
| 30 | hou2zi／2123509210 | 头衔“猴子”；猴子；默认简介，不以常见昵称跨团并人 |
| 31 | AiliSenn／2122366764 | 头衔“布朗”；布朗；Ailisin近形名字同头衔同团归双号，字画不认本人作品 |
| 32 | Ailisin／2122382577 | 头衔“布朗”；布朗；归AiliSenn双号，普通自嘲不单独立传 |
| 33 | Yimoyimoyim0／2123754427 | 头衔“忆摩”；忆摩；他称德玛灼热之王，自嘲、耻辱榜和收藏不认具体职务／事件 |
| 34 | Ineverleft／2119025670 | 头衔“破碎铅秋”；破碎铅秋；默认简介，待职责／故事 |
| 35 | Luga Brasi／2123583027 | 头衔“鑫”；鑫；默认简介，待职责／故事 |
| 36 | Rhathymia／2123436020 | 头衔“无忧”；无忧；补损／舰队网站入口不认网站经营者或管理 |
| 37 | Andythebest／2123959887 | 头衔“安迪”；安迪；归DrAndy双号，文案不认独立事件 |
| 38 | Hong TZ／2123691794 | 头衔“断断”；断断；与段段仅同音及Hong团名前缀，分开保留 |
| 39 | Komatsuu Nana 02／2123216799 | 头衔“丧尸”；丧尸；同团昵称与台风提及小丧尸相合，低价回收说法留线索，未核交易后果，不凭普通收购立传 |
| 40 | PsychicSword／96885953 | 头衔“探索”；探索；归GuardianMymMei／jiaxue三号组，萌新求放过文案 |
| 41 | OrgrimmarXIII／2122354688 | 头衔“无”；当前230445889，无头衔，文案不单独立传 |
| 42 | liesha yongheng／2115110126 | 头衔“无”；白市商人广告；已离开玩家军团，95／93／92／90折地区收购、蓝图报价、垃圾回收与两天结清承诺未核履约，不认重要管理 |
| 43 | Lighting Serral／2116341809 | 头衔“无”；无头衔；星城收藏未核参与 |
| 44 | JUDAWANG／2124228773 | 头衔“橘大王”；橘大王；无畏收藏未核参与，不以常见橘称呼跨团并人 |
| 45 | Via Breir Arsten／2122461624 | 头衔“EX咖喱棒”；EX咖喱棒；归E x-calibur同人组，默认简介 |
| 46 | Misaka Fairy／2115629744 | 头衔“无”；已离开玩家军团；角色／物品链接不认同人或实际驾驶 |
| 47 | Baiwu scholar／2117081474 | 头衔“书生”；书生；冥府／凤凰收藏配签名自嘲，不凭收藏独立立传 |
| 48 | Shakiel Ahs／2123858288 | 头衔“白大雨”；白大雨；现成歌词不认本人创作或独立事件 |
| 49 | Roccano／92005020 | 头衔“无”；已离开玩家军团；总览、血袭LP／船交易广告未核履约 |
| 50 | oooooil／2123572401 | 头衔“小调”；小调；战舰拟人文案不认实际职责或独立事件 |

[老许／Captain Bo素材](../../src/people/captain-bo/materials-captain-bo.md)：第74名角色，最新公司资料明确登记CEO，角色头衔老许，按任职依据写短篇；不与德玛仅因同公司并人。角色的Iron Ring Cyborg Leader称号及铁环速递频道不证明使用脚本、实际经营快递或历史管理任期。
安迪[首战原始KM](https://esi.evetech.net/latest/killmails/132145198/532b027f3c1ac97c2d424163f9bcb58878610c4a/)为2025-12-24T16:11:48Z，本人驾驶17713、取得最后一击；受害者194996051、船12005。[OPS INIT WWW原始KM](https://esi.evetech.net/latest/killmails/136192705/d19e4ee8384eade7c8e32dfc169bb0822c9fa77c/)为2026-06-11T19:28:27Z，受害者2119338678、船11995，无DrAndy本号；未从收藏认FC或猜同人。另两条OPS及其他收藏未核，群友普通嘴仗也不单独立传。
台风材料提红楼“小丧尸”低价回收物资，当前Komatsuu Nana 02头衔丧尸、同红楼，角色创建早于该2026年叙事，留关联线索；不将一般低价收购升级为骗局。来源沿[台风素材](../../src/people/domityphoon/materials-domityphoon.md)，具体价格／交易方式／影响待补。
军团联盟历史已取；DOTLAN记DEMA 119于2025-02-10传位Dema1、Dema1于2025-04-05传位老许（2025-03-19入团）。2024年r/Eve评论所述DC红楼bot指控早于老许入团，不归老许；当时CEO为创建者DEMA 119，已归德玛任内。2022年表第76行同名HongLou、标RR；联盟转换日期已留素材，历史表实体判定暂不改，下一步先核这份表的截点与联盟记录口径，不回推全年归属。

## PLA Fleet前50头衔增量（2026-10-15）

历史榜前1—50逐份核读，49份完整名片成功，第37名Lotus Lee为ESI404，继续保留头衔／简介缺口。本次复用已取得的名片，不把取得缓存写成当日重新请求。来源为[ESI公开角色名片](https://esi.evetech.net/latest/characters/2114969276/)，历史榜仍限原军团范围；未读影像／字幕／音轨。

| 历史名次 | 角色／ID | 头衔与续查记录 |
| --- | --- | --- |
| 1 | Jason Yusi／2114969276 | 已归青春，B站／YouTube及刷怪演示入口沿本人素材复用 |
| 2 | Horizon Agera／2114000295 | 头衔简介空；当前非PLA Fleet，待社区称呼与故事 |
| 3 | Chirs QY／2113882657 | 无头衔，三条冥府与科莫多等战果收藏；未核本人参与，不凭收藏立传 |
| 4 | ALL the ofline／2114004640 | 无头衔，马克瑞战果及共享总览，不凭共享设置归小圆脸 |
| 5 | Beverly HillFolk／92995625 | 伦敦哥；当前Arknights.，自挂多条普通船损并自嘲昂贵生产船，待独立事件 |
| 6 | MoYan JueYin／2114839704 | 头衔简介空；已离开玩家军团，不仅凭MoYan近名归魔焱 |
| 7 | Arianrhod Levi／94951545 | 头衔简介空；已离开玩家军团，待故事／职责 |
| 8 | Laferrari BY／2113908175 | 头衔简介空；当前Curse of Angels，待故事／职责 |
| 9 | Austin Tagelian／2114865948 | 复用旧名片，头衔“描述”、简介空，待故事／职责 |
| 10 | hisen／2113692343 | 无头衔，仅物品与空间站入口，待故事／职责 |
| 11 | EVANGELION AT／2114600788 | 无头衔，杜甫《赠卫八处士》与总览，不认本人原创 |
| 12 | TOGG Hilitari／2114484257 | 头衔简介空；待故事／职责 |
| 13 | One-act Play／2114152328 | 头衔简介空；当前Curse of Angels，待故事／职责 |
| 14 | Assassinrose lee／2114597913 | 凌沙；当前CACX，CCP／GM战果收藏与格言，不认本人参与／指挥 |
| 15 | Anakin Force／94192328 | 帝国隐秘部队；复用旧名片，物品链接不认实际驾驶 |
| 16 | Cutthroat Kate／1568668285 | 头衔简介空；已离开玩家军团，待故事／职责 |
| 17 | DarkElf Ghost／2112089535 | 无头衔，旧PLA招募及总览；复制团方广告不自动认招新管理 |
| 18 | EternalStarsea／96174116 | 永恒星海；当前PLA，稀有船物品入口，不凭近名并海哥哥等人 |
| 19 | fisher -A／2113894826 | 无头衔，绝地海盗改诗、无人机克制笔记及邀请，不凭个人文案立传 |
| 20 | Cocle／2113870230 | 延卿；当前PLA Fleet，共享卫队总览与广播，待实际职责 |
| 21 | Razor Jaxx／945883645 | 极端荣耀；当前PLA Fleet，兔子卫队30人本招新承诺；名号与已有PLA Fleet CEO归属相合归荣耀 |
| 22 | hlen／2113717276 | 白凝；当前Dawn's LightP，复仇名单与矿队／角色线索；未有具体行为后果，待事件 |
| 23 | Lv223／2113228175 | Fu1crum；已对应收录人物，Rooks and Kings作品分享不认本人作者 |
| 24 | Sakura WU／2114600094 | 老鹰；朱雀登记CEO同头衔号互链本号、现有玄武朱雀人物关系相合，归老鹰；自述入侵后勤指挥已入文 |
| 25 | Kingkill Edin／2113180741 | 赐客；当前Golden Fleece，文艺句子与字画，不凭此立传 |
| 26 | Lydia Y Cooper／2113932111 | 星葉樱怜；当前PLA，首杀／最贵KM收藏，待独立故事／职责 |
| 27 | Carnagie／668678329 | 阿P哥；当前PLA，简介“加达里海军空代”，普通代刷广告未核履约 |
| 28 | feather Sun／92837498 | 无头衔，简介“He is a good man.”，无独立事件 |
| 29 | QingFeng Dallocort／2114854584 | 头衔简介空；已离开玩家军团，待故事／职责 |
| 30 | Cn Oramara／2114280606 | 暗；当前King For Crazy，简介空，待职责／故事 |
| 31 | yiming zhang／2114621067 | 小猫咪；当前N A T O，RR总览，不据通用外号并人 |
| 32 | TomX fuweijie Hybwdl510／2114569706 | 汤木木；当前PLA，分享国服搬来的总览，不认本人原创 |
| 33 | Choi Roamer／91582475 | 小恶魔；当前昆仑，2014—2018战果收藏与频道，未核本人参与 |
| 34 | ColorTea6666 Evingod／2114644913 | 头衔简介空；已离开玩家军团，待故事／职责 |
| 35 | New Explorer／95239349 | 无头衔，EVE University声望文档入口，不认本人作者 |
| 36 | Alan Amon／2114577125 | 无头衔，共享总览与频道，不认本人指挥 |
| 37 | Lotus Lee／2114708150 | ESI404，头衔与简介缺口；不将失败当空简介 |
| 38 | Samean／936393057 | 头衔简介空；当前PLA Heavenly Host，待故事／职责 |
| 39 | Orthogonal Olacar／95156618 | 头衔简介空；已离开玩家军团，待故事／职责 |
| 40 | gogostar daydayup／2113606391 | 无头衔，KM收藏与总览；不认全部本人参与或指挥 |
| 41 | Doub1egy／96597483 | 头衔简介空；已离开玩家军团，待故事／职责 |
| 42 | Abot／2114460361 | 阿爆特；当前PLA，简介“12345 上山打老虎”，普通文案 |
| 43 | M Big／92632304 | 头衔简介空；已离开玩家军团，待故事／职责 |
| 44 | saber follower／2114858801 | 群星；当前PLA，简介空，待职责／故事 |
| 45 | Dachui Li／2114116972 | 头衔简介空；已离开玩家军团，待故事／职责 |
| 46 | Dark Tina／96822153 | 千秋的鱼；当前采星者，简介空，不凭常见千秋称呼并人 |
| 47 | ftw Wessette／2113278955 | 无头衔，仅一串数字，无独立事件 |
| 48 | longmeng zeng／2114982763 | 无头衔，配装、PLA Associates军团链接与本人促进损失，不认所属组织管理或同人 |
| 49 | Photon Particle／2115087351 | 落叶琉璃；当前Interstellar Rosefinch，简介空，待故事／职责 |
| 50 | Assassin Specter／2114639075 | 鲁提辖；当前神农，PLA总览与战果收藏，不认FC或本人全部参与 |

老鹰的Sakura WU（2114600094）、朱雀登记CEO／创建号ZQ-EAgle-ADMIN（2121322329）同为“老鹰”头衔；后者简介直接列Sakura WU为CEO，团方简介同样具名，结合既有玄武—朱雀社区叙事并回[老鹰素材](../../src/people/lao-ying/materials-lao-ying.md)。入侵后勤指挥自述已补正文；教学链接只留入口，未读影像或字幕，不作作品精选。Razor Jaxx头衔极端荣耀，当前PLA Fleet，与已有PLA Fleet CEO归属相合，归[荣耀素材](../../src/people/silvitni/materials-silvitni.md)，不另立传。

## 图万神殿前50头衔增量（2026-10-15）

历史榜前1—50完整头衔／简介已核读；舵主复用旧ESI名片，LK另补ESI完整名片，不用只有军团履历的构建快照充当简介。本次复用已取得的名片，不把取得缓存写成当日重新请求。来源为[ESI公开角色名片](https://esi.evetech.net/latest/characters/91254848/)，历史榜仍限原军团范围；未读影像／字幕／音轨。

| 历史名次 | 角色／ID | 头衔与续查记录 |
| --- | --- | --- |
| 1 | fliet99／91254848 | 舵主；复用伏羲完整ESI名片，fliet100同词根同团归本人，已补alias |
| 2 | Hieda Humio／2114849159 | 剑仙；猎獒／诱导自嘲与仿技能文案，不认实际指挥；six small monkey自述卖号另留操作者边界 |
| 3 | Davian Loyalar／202442262 | 表哥；古制官衔、猎獒与旗舰KM收藏，未核指挥；“会战视角”为总览预设 |
| 4 | fliet100／2112611896 | 舵主；与fliet99同词根同团、中文头衔相合归小号；D-Scan及普通KM收藏 |
| 5 | LIZARD K／983162808 | LK；ESI完整名片另核，复用既有列传，不将游戏数据快照当简介 |
| 6 | NiZhenDeHenPi／2113957965 | 小二／手真红；官员物品与剑仙／表哥角色链接，不凭互链认同人 |
| 7 | Stella Helena／96685477 | amj；黑手大将军等古制头衔与RIP Aura文案，待具体职责／故事 |
| 8 | cy Aivoras／2116273864 | 逍遥；当前红楼，简介字画，不据常见称呼并人 |
| 9 | vanzz Nolm／2113181164 | 丸子；与vanzo Kuha同van词根、中文头衔同团归双号；植入体／旗舰收藏 |
| 10 | pr yl／2116053187 | 夏未繁；与Alice Aloisia同中文头衔同PLA归双号；诗句不认原创 |
| 11 | vanzo Kuha／2112538158 | 丸子／打捞员；归vanzz Nolm双号，古制官衔与战果物品收藏 |
| 12 | S ktial／2114183149 | 星渊；与Rage Bear同中文头衔同团归双号；古制大将军与共享总览不补实际指挥 |
| 13 | Zzz Wolf／90265839 | 黑妹；与Evergreentree同头衔同团、同《道德经》排版归双号 |
| 14 | more 9888／1231727668 | 九八；与Horizon 01同中文头衔同团归双号；OSY大将军等戏称不认FC |
| 15 | GoodBread／2120840885 | 面包；古制官衔、文学句子及神使收藏，不凭收藏立传 |
| 16 | springcao／96742773 | 曹操；与spring live同词根同头衔同团归双号；现成粗俗文案不认真实经历 |
| 17 | Kashiwagi Yuki／2114339519 | Yuki；与Yilian Mengbi同头衔同团归双号；运输／战果收藏与价格网站 |
| 18 | maaple／2114702652 | 红叶／红老板；自称OSY倒卖LP商人及被跳货风筝，待具体事件；与红叶酒馆Red-Leaf分开 |
| 19 | Guo Andy／91875038 | 安迪；古制官衔与地点笔记，不与红楼安迪仅凭昵称并人 |
| 20 | six small monkey／2114896218 | 剑仙；四语自述“此号已卖，恩怨两清”，旧操作者／转让时点待核，不将本号历史自动并给现役Hieda Humio |
| 21 | doubao FF／2114834361 | 豆包；与heidou FF同FF词根同中文头衔同团归双号；估价／报点工具入口 |
| 22 | sven lestart／91599501 | 茅台；公开自称OSY超旗队首席指挥，按FC收录短篇；非古制官衔推断 |
| 23 | Alisa zZ／2114870011 | 佩奇；古制官衔、天鹤与普通KM收藏，期货书名不认现实职业 |
| 24 | Setsuna W／2114538901 | KK；古制参知政事称号、简介空，具体职责待查 |
| 25 | Rubioh／1003998291 | 电磁炮；与Harlon Smart同头衔同团、重合泰坦／超旗收藏归双号 |
| 26 | yaxiu haines／2115600469 | 雅修；古制官衔、简介空，实际职责待查 |
| 27 | Morita Naoki／2118115002 | 米拉；当前红楼，仿技能介绍与利维坦加成玩笑，不认实际驾驶或独立事件 |
| 28 | 88 1／91976031 | 881；古制官衔、简介空，实际职责待查 |
| 29 | Rage Bear／92361506 | 星渊；归S ktial双号，虫洞祷文与WiNGSPAN文案不认本人原创／独立事件 |
| 30 | Zeifutiy Chou／96650763 | 紫冰；多语求放过与古制官衔，不作独立事件 |
| 31 | Konor alt／2116648588 | 康纳；太子与都督等古制头衔、简介空，实际指挥待查 |
| 32 | Chris JM／2114897355 | 错觉；古制官衔与字画，待职责／故事 |
| 33 | Alice Aloisia／2115265476 | 夏未繁；归pr yl双号，同头衔同PLA，简介空 |
| 34 | spring live／93767683 | 曹操；归springcao双号，文学排版，不认本人原创 |
| 35 | INGO DK／2115203346 | 无头衔；当前Zhuan Zhuan 2nd Hand，葫芦娃文案不作独立故事 |
| 36 | LiuFeng OF／2112879416 | 流风；古制官衔及星际总览，待具体职责／故事 |
| 37 | FleetBeacon／2116000457 | 航标；Top5 Pods战果收藏，不凭收藏认独立故事 |
| 38 | Preston - Cole／2113430461 | 科尔；古制官衔、简介空，不凭近音认荣耀公告中的“科尔斯” |
| 39 | Evergreentree／458142350 | 黑妹；归Zzz Wolf双号，同头衔同团及同文案 |
| 40 | jinpengFTD／2115703459 | 金鹏；古制官衔与虫洞识别、洞口编号笔记，不认原创教学或真实指挥职务 |
| 41 | heidou FF／2116559586 | 豆包；归doubao FF双号，同FF词根同头衔同团，简介空 |
| 42 | veg soup won／2113495989 | 汤达人；古制官衔、共享总览、混乱任务无人机笔记与恶狼收藏，不认FC |
| 43 | Horizon 01／295922774 | 九八；归more 9888双号，同中文头衔同团，字画 |
| 44 | Yilian Mengbi／96827618 | Yuki；归Kashiwagi Yuki双号，同头衔同团，角色与合同收藏不另认同人 |
| 45 | LiveviL VoloV／2113345801 | LV；古制官衔、简介空，实际职责待查 |
| 46 | ShadowMurloc13 Oasis／2114326770 | 十三；移动牵引／黑手自嘲与古制官衔，仅他人角色入口 |
| 47 | Caldari TT-Phoenix／2116211529 | 祝余；古制官衔、字符画与Blood Sotiyo收藏，未核本人参与 |
| 48 | SnowHydra／351590083 | 小鱼；爱PVP文案、字画、普通粗口战果签名与共享总览，不单凭这些立传／标低素质 |
| 49 | Harlon Smart／2116326010 | 电磁炮；归Rubioh双号，同头衔同团、重合旗舰收藏 |
| 50 | PANDA WSJ／2114851152 | 熊猫；简介空，待职责／独立事件 |

[茅台素材](../../src/people/sven-lestart/materials-sven-lestart.md)有直接FC自称，已写短篇；其余只有古制官衔者继续补实际事务，不能整批认管理。剑仙的已卖号声明独留操作者边界；OSY红叶不与红叶酒馆合并。金鹏的虫洞入门笔记保留识别信号、先存出口、洞口编号、J空间等级与查询入口等内容，但未据转载笔记认原创作者，后续先追社区教学与互动。

本次认号补查另用3次ESI（朱雀公司、登记CEO、LK完整名片），公开检索3组（茅台精确名、OSY中文称呼、Sakura WU与老鹰）；未重新请求旧榜单。新人物快照由正式fetch脚本取得。下一批Chi Gua先核历史榜前十，沿已有名片缓存复用，首批至多10人，ESI及必要身份补查上限30请求；有具体社区入口再转入故事调查。

## 吃瓜前十头衔增量（2026-10-15）

历史榜第1—10完整名片已核读，本批新增10次ESI角色请求，均为当前Chi Gua；无影像／字幕／音轨。名片来源为[ESI](https://esi.evetech.net/latest/characters/2112554347/)。后续第11—50已核读，覆盖见下表；本段仍只记前十的当批取材。

| 历史名次 | 角色／ID | 头衔与续查记录 |
| --- | --- | --- |
| 1 | jian PD／2112554347 | 批地 MAIN；头衔对应中文称呼，简介空，职责／独立故事待查 |
| 2 | Rebirth EVE／93209504 | 左手 MAIN；归已有列传，普通自嘲不另造事件 |
| 3 | Lvte Xiao／2112612580 | 小绿特 MAIN；复用既有FC与战役素材，另号Heite Xiao并回本人 |
| 4 | Nine -L／2115444624 | 老九 MAIN；复用已有CEO列传，字符画不另认原创 |
| 5 | Mikoyan Anzomi／2113483168 | 铭 MAIN；仅常规禁言已退回[本人线索](mikoyan-anzomi.md)，文学歌词不认本人原创 |
| 6 | Ame Hana／2113227611 | 伊枫 MAIN；简介空，实际职责／故事待查 |
| 7 | heisemaoyi／2115189845 | 小辉 MAIN；简介空，实际职责／故事待查 |
| 8 | a chen／2113894712 | 阿晨 MAIN；改写五德的粗俗现成文案不作独立人物事件，不采其中涉及未成年人的性文案 |
| 9 | Heite Xiao／2122946394 | 小绿特 ALT；Heite／Lvte Xiao近形同Xiao词根、同中文名同团及MAIN／ALT对应，归小绿特 |
| 10 | HunShang Si／2113622756 | 四魂 MAIN；突变质体合同网站入口，不认本人经营者或实际交易履约 |

小绿特Heite Xiao已补[本人素材](../../src/people/lvte-xiao/materials-lvte-xiao.md)与aliases，不相加两号历史KB。批地、伊枫、小辉、阿晨、四魂目前只有中文称呼及普通简介，先沿团内公开职责／社区点名补故事，不能拿MAIN字样认重要管理。后续第11—30名已在同一首批30请求上限内推进，第31—50已续读，见下文；不重新抓前十成功名片。

### 吃瓜第11—30名增量

第11—30完整名片已读，复用波波一份2026-10-14名片，新增19次ESI；与前十合计29次角色请求，仍在首批30上限内。历史榜第1—30在该批连续核读完成；后续31—50见下文。

| 历史名次 | 角色／ID | 头衔与续查记录 |
| --- | --- | --- |
| 11 | Alice Shinki／2112816779 | 艾荔丝 MAIN；简介符号，实际职责／独立故事待查 |
| 12 | 0204 USB／94040366 | 喵爷 MAIN；简介点Sazzina Seii、Jango D、MCMC的游戏内“sons”文案不认真实亲属或小号；根号三第69楼点名邀请进虫洞，见下文 |
| 13 | yyyyy Keikira／2113650154 | 老五；字画与普通挑衅文案，待实际职责／独立故事 |
| 14 | peter li peter／2113450798 | 污龟 MAIN；归已有列传，简介空，不抹去旧素材 |
| 15 | FACT IN／2113515731 | 飞袖李 MAIN；归已有FACT IN列传，简介空，不混另一位污龟 |
| 16 | Turtle Extraordinaire／825838921 | 三龟 MAIN；二进制“you are dumb”、多语求放过、字画与距离／抗性笔记，不与污龟只凭龟字并人 |
| 17 | IarchangelI Michael／2114277716 | 波波 MAIN；复用AOM前50名片，当前吃瓜，总览／广播及大航PVE预设不认原创作者或FC |
| 18 | Lillte Roomate／2113625619 | 无头衔，已离开玩家军团，简介RUA，不认同人或独立事件 |
| 19 | xiaolang C／2113788641 | 小狼 ALT；简介空；不与当前图万、头衔果喵的xiaolang SM仅凭词根并人，待同组织／历史依据 |
| 20 | FtheMAG／2116286692 | 四维 MAIN；简介空，待职责／故事 |
| 21 | xiaolang SM／2113421652 | 果喵；当前图万，古制官衔与朱庇特星域超旗KB等收藏；未核本人参与，不凭收藏立传 |
| 22 | DennisDDT／2113018076 | QQT ALT；同Dennis词根、同团及MAIN／ALT标记，亦合旧QQT&DDT名牌，归QQT并补alias |
| 23 | CHU SKY-JU／2113971426 | 天拒 MAIN；简介空，待职责／故事 |
| 24 | Maria Taylor／2114299824 | 无头衔，当前98664770，简介空，待社区称呼／故事 |
| 25 | MCMC／2114417578 | 无头衔，当前98749004；简介“have fun and enjoy the game”，喵爷提及不证明其小号 |
| 26 | Zigeng Z／2113731408 | 子根；已有列传，本次无头衔／简介，旧独立故事保留 |
| 27 | superparafans／2113622650 | 苏苏 MAIN；多语求放过、总览及Azariel收藏，未核本人参与，不凭收藏立传 |
| 28 | Amethyst Shock／2115496754 | 原姐姐；已有列传，自署原礼辛及字画，不认字画原创 |
| 29 | NGEX5／2122012874 | 小寄寄 ALT；萌新击杀收藏、本人灵感损失与广播，先找主号，不凭小号字样造归属 |
| 30 | Eve Crystick／96762349 | 泡芙 MAIN；仅233数字文案；不与DC泡芙解说只凭同外号并人，待作者／组织桥 |

喵爷／0204 USB的[根号三回忆录第69楼](https://tieba.baidu.com/p/7173850192)已复用缓存核读主楼与两条可见楼中楼：根号三说，先有路小兔提出资助他打FRT、N老板邀请，随后“追杀我的子根等人联系我0204 USB直接邀请同他们一起进洞，我同样拒绝了”。这段定位了邀请者的精确角色和虫洞交集，但只有一次被婉拒的招揽，未交代0204 USB的职务、具体行动后果或其本人更完整的故事；保留入口，不把根号三的成长史移成喵爷经历。简介里的MCMC等被点名者也不由这句话归本人小号。整帖尚有楼中楼计数缺口，本次不声称又完整复读全帖。

DennisDDT已归[QQT素材](../../src/people/dennisqqt/materials-dennisqqt.md)，共享广播单句粗口不新增低素质标签。xiaolang C与xiaolang SM当前不同军团、中文头衔不同；暂保留组织与操作者桥，不为凑同人将“小狼”与“果喵”强并。NGEX5小寄寄只明确ALT，主号继续从后续名片找；泡芙不只凭同名归DC作品作者。后续第31—50已续读，见下文；不重抓前30成功名片。

本轮续查范围：吃瓜历史第31—50、咸鱼历史第1—10，逐批不超过10人；缺失名片与必要身份补查合计上限30请求，复用成功缓存。明确职责／故事再展开，不跑人人船型统计，不读影像／字幕／音轨。

### 吃瓜第31至50名增量

第31—50完整头衔／简介已核读，新增20次ESI角色请求；本团历史榜前50连续核读完成，不等于九月月榜前50或所有人的故事调查完成。

| 历史名次 | 角色／ID | 头衔与续查记录 |
| --- | --- | --- |
| 31 | tence Agnon／2114330319 | 璀璨恒星 MAIN；简介空，实际职责／独立故事待查 |
| 32 | Tae yeonSS／2114322832 | 血誓 MAIN；共享会战／旗舰总览及远征频道，不凭铭的配置名并本人或认FC |
| 33 | Oh Dragon／2112135986 | 无头衔，当前98799911，现成励志文案不认独立事件 |
| 34 | TARI TI／2113072891 | TI MAIN；简介空，实际职责／独立故事待查 |
| 35 | Vilin Ray Wang／2122776663 | 夜火 MAIN；抗性笔记、稀有船物品与凤凰收藏，不认实际驾驶／原创教学 |
| 36 | clannad GU／94941521 | 游侠；当前CACX，简介“I was there.”，未点事件，待独立故事／职责 |
| 37 | Billions Gate／96851001 | 无头衔，已离开玩家军团，反复角色名文案，不认独立事件 |
| 38 | man in rainy／2122601948 | 半岛铁盒 MAIN；[本人线索](man-in-rainy.md)已对应UP半导你铁盒是也／488303483，飞行地板两作文字及访谈致谢已读；普通互动暂留线索，独立故事／职责与空间排序待补 |
| 39 | huile chuan／94881773 | 无头衔；已离开玩家军团，战果收藏及普通文案，未核本人参与 |
| 40 | Little Roomie／2113643777 | 老姚 ALT；与Lillte Roomate近形Room词根、同RUA简介、同吃瓜历史榜归双号；不凭ALT猜其他主号 |
| 41 | Kenny Zhu／2113260461 | 肯尼 MAIN；简介“筚路蓝缕，以启山林”，待实际职责／故事 |
| 42 | Aston Aubaris／2113092518 | 阿斯顿 MAIN；简介空，待实际职责／故事 |
| 43 | Final Warning／2123431283 | 海草 MAIN；远征层次／目标笔记与战果收藏；不与宝宝巴士海草海草／涅磐萝卜仅凭常见外号并人 |
| 44 | Zeroouf Sky／2113503617 | 左手代驾西瓜账号；只支持左手操作过的西瓜账号，号主／代驾时段分开，不加左手本人小号alias |
| 45 | wg003 Oksaras／2115255669 | 无头衔，已离开玩家军团，简介空，待故事／职责 |
| 46 | Snow without return／2122086755 | 蛇皮 MAIN；复用芙水之乱名牌对应，总览／攻略汇集与收藏不补足具体人物事件 |
| 47 | Mamimami Hong／2115618196 | 干饭人1号 MAIN；文学句子与冥府、长须鲸、无畏等收藏，未核本人参与，不凭收藏立传 |
| 48 | Starry QI／2113323827 | 无头衔，已离开玩家军团，共享总览，不认原创或FC |
| 49 | Cygnus Rei／2123997791 | 天鹅 ALT；“很厉害的FC”实际是指向nextorian／Noraus的角色链接，不认天鹅本人FC；旗舰收藏待核 |
| 50 | CuteCatttt／2122867833 | 鹊桥蜜柠 MAIN；本人简介主动贴直播间8857671，已留个人线索；UP UID／作品文字待读，不把直播间号当UID |

天鹅Cygnus Rei的[ESI简介](https://esi.evetech.net/latest/characters/2123997791/)末尾“很厉害的FC”明确链接角色343563816，沿现有素材即nextorian／Noraus，已把这句他人泛评归[Noraus素材](../../src/people/noraus/materials-noraus.md)；不据此给天鹅套FC。鹊桥蜜柠的本人直播入口与尚未读的作品缺口归[个人线索](cute-catttt.md)，下一步沿确定入口读公开文字、核UID，不逐人搜外号。

老姚双号Lillte Roomate／Little Roomie在同一吃瓜历史榜、近形Room词根且同RUA文案，直接归同人组；前者目前已离开玩家军团。Zeroouf Sky公开头衔明确“左手代驾西瓜账号”，支持左手操作关系，不证明账号属于左手，不将该号完整KB、历史军团或战役归给左手，也不称现时仍由其代驾。蛇皮已有芙水之乱身份对应，简介本轮无新的具体行为／事件；不将攻略收集升级为创作人故事。

## 咸鱼前十头衔增量（2026-10-15）

Salted Fish Inc／98640194历史榜第1—10完整名片已核读，新增10次ESI；本次续查与吃瓜余20名合计30次角色请求，预算用满，未追加个人KM、视频或直播请求。名片来源示例：[zhangke zhangke的ESI](https://esi.evetech.net/latest/characters/2114973381/)。

| 历史名次 | 角色／ID | 头衔与续查记录 |
| --- | --- | --- |
| 1 | zhangke zhangke／2114973381 | kk／可可；与bad Kurvora、creams ice、Kamadainen Motsu同kk头衔同团归四号组；单人旗舰击杀自述与收藏待核 |
| 2 | bad Kurvora／2115426565 | kk／可可；同四号组，远征KEY、矿石／月矿笔记与快递工具，不认重要管理／原创；成人文案不存原句 |
| 3 | creams ice／2115230077 | kk／可可；同四号组，运输文档、月矿表与组织链接，不认本人经营／历史任职 |
| 4 | BAPTISTHE／2112798173 | 文曲；简介空，实际职责／故事待查 |
| 5 | Kamadainen Motsu／2118065734 | kk／可达鸭；同kk头衔同团归可可四号组；简介只有可达鸭，不造独立事件 |
| 6 | Konruri／2122898695 | 琉璃；简介自列Konruri、RuriC17、Chihaya Ruri及BV19U4y1W7oo；后两号ID／组织待核，字符画不认本人原创 |
| 7 | Artoria Neko／2115213993 | 无头衔；简介空，待中文称呼／职责／故事 |
| 8 | Andrey Jell／93528076 | 茉莉茶；文学句子与字画，未见独立人物事件 |
| 9 | Ustialod Aelin Adestur／2122626046 | 无头衔，已离开玩家军团，多条普通船战果收藏，未核本人参与 |
| 10 | Suzutsuki SukiFoever／2117870060 | 涼／Shirokey；领奖励文案实际指向角色面板／退出游戏，另有稀有船与KM收藏；不凭简介整活立传 |

kk／可可四号的同人链、玩法笔记与“单人旗舰击杀”三条待核入口归[同人线索](kk-salted-fish.md)，没有独立故事或职责依据时不只凭这些立传。琉璃简介自列三个名字，但未取得另外两号的ID／军团，保留系列名字与本人B站直链，下一步先在同团后续名片核对，再读确定链接的文字；未看影像／字幕。涼的“如何领取技能点”蓝字实际为打开角色面板、退出游戏等游戏内命令，不当真实领奖教程；“数字僭主”也是物品入口，不归成另一个现实玩家的同人关系。

咸鱼历史第11—30已续读；登记CEO saber lv1在第13，任职已核并写短篇，见下文。前十名片与上述确定链接不重复抓取；已读但无故事者继续保留明确续查入口。

本批继续咸鱼历史第11—30名片与登记CEO取材，逐批至多10人；缺失名片、公司／身份与新人物快照合计上限30请求，复用成功缓存，不重取前十。

### 咸鱼第11至30名增量

第11—30完整名片已核读，新增20次ESI；另1次公司请求核CEO，2组公开检索及1次巴哈姆特帖子读取。该帖HTTP403后停止该站。新人物快照由正式fetch脚本取得；未重抓前十、未读影像／字幕／音轨。

| 历史名次 | 角色／ID | 头衔与续查记录 |
| --- | --- | --- |
| 11 | sabersama／2112963145 | 无头衔，简介空；与saber lv1、saberlv5同saber词根同团归CEO本人 |
| 12 | Eugene Pax／2112812714 | 文曲；与BAPTISTHE同中文头衔同团归双号，简介空 |
| 13 | saber lv1／2116737842 | saber；当前公司资料直接登记CEO，已按职责写短篇；不倒推2022任职 |
| 14 | saberlv5／2115402029 | 无头衔，简介空；同saber词根同团归CEO本人 |
| 15 | farm Niam／2116445913 | kk；与已读可可四号同头衔同团，归可可第5号，点状文案不认独立事件 |
| 16 | Kagari Siina／2114263670 | KAG；起跳公式、测试服命令、虫洞工具与装配收藏，不认原创教学或本人实际驾驶稀有船 |
| 17 | egdie668／2122418752 | 668；当前图万，简介o7，不凭数字外号认其他人物 |
| 18 | DMITRIY ALEXEECH／91521415 | 黄瓜；价值观文案、估价／LP／虫洞／投送等工具汇集，不认工具经营者或原创教学 |
| 19 | EVOL kamenrider／2115605949 | 无头衔；简介空，实际职责／独立故事待查 |
| 20 | DAC OUCS／2115984872 | 龙井；总览与SFI.TEST 0.1预设，不从配置名认本人原创或管理 |
| 21 | Nothing yy／2116296322 | 灰烬；简介空，实际职责／独立故事待查 |
| 22 | kekeaai／2121012513 | kk；同中文／字母头衔同团归可可第6号，默认简介 |
| 23 | tom ACL／2115824208 | 茉莉叉；与茉莉茶Andrey Jell近形称呼、同以吾之力以达天际文案及同字符画同团归双号；总览分享不认原创 |
| 24 | savior770／2119112903 | 雨声；招呼文案与共享总览，不认独立事件 |
| 25 | John Eunha／2120070385 | 银河；中文头衔及同义韩文签名，不认其他同名人物 |
| 26 | TWXiaochen／2118239761 | 小陈；《八大人觉经》与CCP战果收藏，不认本人原创／现实宗教身份或指挥 |
| 27 | MultithreadedGundam／2117088704 | 无头衔；共享MG总览、广播，不认本人作者或FC |
| 28 | kuo kuo／2113160766 | 阔阔；复用已有列传与素材，冥府／超旗／长须鲸收藏不自动归全为本人参与 |
| 29 | silence lyf／2119415693 | 无头衔；当前98777152，简介句点，待社区称呼／故事 |
| 30 | Felix0433／2115371615 | 菲力锅；简介挂被骂及MTU收藏，普通嘴仗不作独立立传；未核上下文与损失后果 |

[saber素材](../../src/people/saber-lv1/materials-saber-lv1.md)已留当前CEO、+8洞团与零税依据；sabersama／saberlv5归本人，同团saber lv7／saber lv8由本次公开检索的精确角色页补入aliases，不要求空简介再等独立事件。创建号另属2114222466，不将saber写成创团人，不由2026登记回填2022任期。巴哈姆特445招新帖只取得搜索标题，正文403、作者未核，不能与当前+8简介合成具体部署；旧团同名表行仍独留历史实体问题。

kk／可可又增farm Niam（第15）、kekeaai（第22），同kk头衔同团归六号组，[同人素材](kk-salted-fish.md)已同步。文曲BAPTISTHE／Eugene Pax同中文头衔同团归双号；茉莉茶／茉莉叉称呼近形、同个人格言及字符画同团归双号。通用工具、经文、共享总览与普通聊天不当作独立人物事件；没有职责的人仍继续追社区故事。

第31—50已续读，见下文；登记CEO已成文，后续名字系列先对照现有saber／可可／琉璃／文曲／茉莉组，不重复立传。

本批续咸鱼历史第31—50及神农历史前十，逐批至多10人；复用成功缓存，缺失名片及必要身份补查上限30请求；具体职责／故事出现后再展开，未读影像／字幕／音轨。

### 咸鱼第31至50名增量

第31—50完整名片已读，新增20次ESI角色请求；本团历史前50连续核读完成。没有因此把所有成员的社区事件／职责调查标成完成。

| 历史名次 | 角色／ID | 头衔与续查记录 |
| --- | --- | --- |
| 31 | liuyanchen／2121666666 | 无头衔；D哥哥Laelaps及无畏收藏，未核本人参与，不凭收藏立传 |
| 32 | John Yuju／2120062095 | yinhe；John词根与John Eunha相合、同银河中英头衔同团归双号；默认简介 |
| 33 | Hold Seven／2114562591 | 没所谓；与Soare、pike william同中文头衔同团归三号组；骷髅符号不认独立事件 |
| 34 | pillow Ragnarok／2116439454 | 忽悠小强 ALT；当前晨曦98538918，铁壁／神使收藏，待主号及具体职责／故事 |
| 35 | Soare／2112420212 | 没所谓；归Hold Seven／pike william三号组，简介空 |
| 36 | LSY6666／2115484363 | 龙井；与DAC OUCS同中文头衔同团归双号；共享总览不认原创 |
| 37 | liyzh6／94546501 | 杰罗姆；简介空，待职责／故事 |
| 38 | PavilionCat／2121174844 | 亭台下的猫；格言与ISD战果收藏，不认本人参与或独立事件 |
| 39 | Srota Buddhist／96338377 | 无头衔，当前98758033，简介短语，不认真实宗教身份或同人 |
| 40 | YoungC／2118935955 | 波斯猫；共享火力／后勤广播，待职责／故事 |
| 41 | Outoku Aihaken／2124070335 | kk；同kk头衔同团归可可第7号，默认简介 |
| 42 | hwd twice／2115640874 | 无头衔；共享总览，待中文称呼／职责／故事 |
| 43 | pike william／2115337691 | 没所谓；归Hold Seven／Soare三号组，简介空 |
| 44 | nai qi／2115817969 | 奶老板；字画及游戏阵营粗口，不凭老板称呼认CEO／重要管理或独立事件 |
| 45 | D RG／2114167607 | DR；普通船战果收藏、PVE与PVP自述及字画，不认指挥／独立事件 |
| 46 | Nothing ash 4／2119949438 | 执念；默认简介，待职责／故事 |
| 47 | Joy Darkblade／2118134505 | 乔；默认简介，不与同名乔跨团并人 |
| 48 | Minmatar KIMI／91906830 | KIMI；简介空，待职责／故事 |
| 49 | Love I／2118957975 | 羡慕；仿技能表的白给／超网／水群自嘲，不认实际超网经营、具体亏损或独立事件 |
| 50 | kagerou sama／2122120239 | 无头衔，当前98828269，广播及总览，不认本人原创或重要管理 |

可可第41名Outoku Aihaken同kk头衔同团归第七号，[个人素材](kk-salted-fish.md)已同步。银河John Eunha／John Yuju同John词根、银河中英头衔同团归双号；不与Fallingyinhe／坠落银河仅凭银河词并人。没所谓Hold Seven／Soare／pike william三号、龙井DAC OUCS／LSY6666双号均有同中文头衔同团依据。忽悠小强只明确ALT、当前晨曦，主号继续从其后续名片核；普通现成文案、字画与未核战果不替代独立事件。

## 神农前十头衔增量（2026-10-15）

历史第1—10完整名片已读，新增10次ESI，与咸鱼余20合计30次角色请求，预算用满，未追加视频、船型统计或全量KM请求。来源示例：[chouchou baby的ESI](https://esi.evetech.net/latest/characters/96355155/)。

| 历史名次 | 角色／ID | 头衔与续查记录 |
| --- | --- | --- |
| 1 | chouchou baby／96355155 | 风筝；中俄格言、CCBB总览与《ai诺娃子N老板这么可爱》B站分享，不凭转贴认本人作者 |
| 2 | undefined-moe-1／2121313190 | undefined／udf一郎；与undefined-moe同词根同中文自署同团归双号，4H／吉他96%回收广告已归个人线索，待重要职责／具体事件 |
| 3 | bb play／2121093031 | 肉扣热热子；现成粗俗自勉文案不认独立人物事件 |
| 4 | Fley Den／2113213717 | 乌鸦王；复用已有CEO／AT成员列传，赫尔与长须鲸收藏不另认本人参与 |
| 5 | ZHU1SH1／2122125627 | 追施；一天泰坦／最速传说为头衔自吹，默认简介，不据此编具体获得泰坦事件 |
| 6 | Yilinsensei／2123374083 | 卡缪维丹；问候与广播设置，不认FC或具体故事 |
| 7 | undefined-moe／2118944158 | undefined／udf一郎；归undefined-moe-1双号，总览／弱抗与叠加惩罚笔记不认原创教学 |
| 8 | LI JIE L／2114730784 | 李杰；总览、广播、工具与洛基／元帅收藏，未核本人参与，不认FC |
| 9 | Kirin X Yato／2121510874 | 斯卡蒂；简介空，待职责／故事 |
| 10 | innosD9c／2122617868 | 袖笼；已有列传；2024夜神梦、2025喜提泰坦自述及船链接角色ID2122654383将innosD8c归本人，已补alias和正文 |

[undefined双号](undefined-moe.md)的回收地点、96%计价、一天接单与拒绝倾销条款已归档；目前只是回收业务宣传，不认重要经济管理或已兑现履约。风筝的BV1cT411a7rq标题《ai诺娃子N老板这么可爱》只为简介分享入口，UP归属未核，不能把收藏者认成作者；B站未读影像／字幕，也未因该链接加人物标签。

[袖笼素材](../../src/people/innos-d9c/materials-innos-d9c.md)已补innosD8c：本号自述2025-04-01喜提勒维亚坦，船链接含角色2122654383，合既有同名小号ID；并回aliases、补两次大船心愿，不将船链接写成泰坦战损／指挥，也不把FallNight1纪念KM算本人航母。此前已认可的招新、考勤争议、创作和大战主线均保留。

神农第11—40已续读，见下文；前十只完成名片与上述对应／入文，其他人的实际职责或独立故事继续查。

本批续神农历史第11—40，逐批至多10人；复用成功缓存，缺失名片与必要身份补查合计上限30请求，不读影像／字幕／音轨。具体职责或故事出现后再展开，不把榜单完成当人物调查完成。

### 神农第11至40名增量

第11—40完整名片已核读，新增30次ESI角色请求；没有重抓前十或给每人跑船型统计。另复用已取得的LP争议帖，仅读第1—2楼及第2楼相关回复，没有新请求或整帖复读声明。

| 历史名次 | 角色／ID | 头衔与续查记录 |
| --- | --- | --- |
| 11 | WRYYYYYYYYY Ellecon／2114027940 | XD；CCP太空舱收藏、问候与远征频道，不认本人参与或原创 |
| 12 | Den Like Raven／2113941665 | 乌鸦王／烏鴉王一郎；复用已有CEO小号与AT正式队员身份，不凭最强传说扩成率队冠军 |
| 13 | Hoshimati Comet／2120246500 | 无头衔，当前98749004，马克瑞／巴盖斯收藏及BR入口未核，不只凭Comet归彗星 |
| 14 | KAGERO2／2121977264 | 六点；与KAGERO1同词根同头衔、当前同伏羲归双号，泰坦收藏未核本人参与 |
| 15 | JACK JIE LI／2114800869 | 李杰；同LI JIE L／LI JIE 3词根、中文头衔同团归三号组；总览与元帅收藏不认FC |
| 16 | annoyform／2120883392 | 然然；与annoyform2同词根同头衔同团归双号；默认简介 |
| 17 | ovo mmp／2113480359 | 十八掌；科莫多收藏与凯旋FC总览，配置名不认本人FC |
| 18 | Orange pai／2120789203 | 蛋挞；LP／市场／估价与远征笔记、旗舰收藏，不认原创教学或本人全部参与 |
| 19 | FIRST BLOOD Kanjus／2114564689 | 老黑；已有素材明确排除为滑稽老黑GoldMining Owner；简介空，保持独立待查 |
| 20 | Interstellar dust Sprin／2115186522 | 无头衔，已离开玩家军团，格言不认独立事件 |
| 21 | 111 project／2119653564 | 111工程；默认简介，待职责／独立故事 |
| 22 | Frozen Haz／90270787 | 嘟可 MAIN；当前吃瓜，简介起哄举报鹊桥蜜拧与火箭队台词；提及已归鹊桥线索，不认实际举报或同人 |
| 23 | LI JIE 3／2117065223 | 李杰；归LI JIE L／JACK JIE LI三号组，通用大航总览不认FC |
| 24 | Weiss schneal／2114342307 | 尾巴；简介空，待职责／独立故事 |
| 25 | MIAO-NEI／2123083691 | 喵内；总览、广播、普通船KM收藏与字画，不认FC／本人原创 |
| 26 | OVTAVIA James／2115288365 | 疯子；当前GECL，征服者收藏、超网订单与广播文案，不认具体交易履约／本人指挥，不凭单句粗口标低素质 |
| 27 | ningmengshiwode／2122692508 | 柠檬是我的；默认简介，不仅凭柠檬近名归其他人物 |
| 28 | Sky Okanata／2116560291 | 咫尺；简介空，待职责／独立故事 |
| 29 | Tonydiao／2118626081 | 你的13；死亡准入、幽灵信号、抗性与虫洞编号笔记，不认本人原创或独立教学互动 |
| 30 | Noone Null／2113219141 | 三三；CCP相关普通粗口与战果收藏，不认实际骚扰事件或FC |
| 31 | KAGERO1／2121967869 | 六点；归KAGERO2双号，当前伏羲，技能规划与广播不认本人原创／FC |
| 32 | Kirin X recovery／2121522022 | 斯卡蒂；与Kirin X Yato同Kirin X词根、中文头衔同团归双号；共享广播 |
| 33 | annoyform2／2121321614 | 然然；归annoyform双号，同词根同头衔同团，默认简介 |
| 34 | leoheyhey3／2122624060 | leo；同团头衔与129Leo相合，已对应自称DSN总监及LP投诉接诉行动，待快照／成文 |
| 35 | btvvsr Arzi／2114567293 | 惆怅；共享总览、频道，不认本人原创／FC |
| 36 | FallNight1／2122596283 | 坠尘；归[坠尘](../../src/people/zhui-chen/materials-zhui-chen.md)小号，已立传；袖笼“a掉的好兄弟”KM为圣诞打蓝，不归袖笼小号 |
| 37 | li707／2122801621 | 梅州；虫洞安全／出口／洞号笔记与工具入口，不认现实籍贯、原创或独立事件 |
| 38 | CillianMurphy／2122867177 | 庸医；估价工具、物品与总览，不认真实职业或原创 |
| 39 | Yuyuko saigyuuji／2112544950 | 西红柿；当前伏羲，抗性／任务掉落／声望与总览笔记，不认本人原创或持续教学 |
| 40 | fafnfaab fan／2115916938 | 坠尘；已立传收录号（AI恶搞元帅帖、cnmc c p打蓝收藏墙），同头衔FallNight1/4、cnmc c p归本人 |

[Leo／129Leo](../../src/people/leoheyhey3/materials-leoheyhey3.md)已按同昵称／词根、同神农对应角色leoheyhey3（2122624060），后续已成文。原帖第2楼中本人自称DSN总监，向LP投诉人索取角色ID与经过、承诺回去核查，次日楼主称聊天记录已发；这是实际接诉行动，达到职责短篇条件。正式快照与短篇已完成、材料已迁入人物目录，不再用空简介退回普通候选；未知的是核查结论，不是是否有人接投诉。未把其他管理的骂人／踢团／锁船指控摊给Leo。

李杰LI JIE L／JACK JIE LI／LI JIE 3三号、六点KAGERO1／KAGERO2双号、斯卡蒂Kirin X Yato／Kirin X recovery双号、然然annoyform／annoyform2双号、坠尘FallNight1／fafnfaab fan双号均按同词根或中文头衔及同团归组。六点两号当前均在伏羲，不能因其旧神农榜记录把当前团写回DSN。FIRST BLOOD Kanjus“老黑”沿[滑稽老黑既有排除](../../src/people/goldmining-owner/materials-goldmining-owner.md)保持分人，不把该行指向素材当已对应列传。

嘟可对鹊桥蜜柠的简介提及已入[鹊桥线索](cute-catttt.md)，目前只有一句起哄，不补实际举报／骚扰结果。坠尘已立传，见[坠尘素材](../../src/people/zhui-chen/materials-zhui-chen.md)；袖笼纪念的奇美拉是他参与的圣诞打蓝，不是AFK，也不算袖笼战损。通用笔记与配置作者名继续只作入口，不靠总览里的FC字样认指挥。

本团第41—50后续已核读，Leo快照与短传已完成，见下文；不重复抓前40。

本批先完成Leo快照与短篇，再续神农历史第41—50、Family Guy.历史前十；逐批至多10人，快照／缺失名片／必要身份补查合计上限30请求，复用成功缓存，不读影像／字幕／音轨。

### 神农第41至50名与Leo成文

第41—50完整名片已读，新增10次ESI；本团历史前50连续核读完成。[Leo素材](../../src/people/leoheyhey3/materials-leoheyhey3.md)已迁入人物目录、正式快照与短篇已完成；leoheyhey同词根同头衔同团归本人，不再留待撰行。

| 历史名次 | 角色／ID | 头衔与续查记录 |
| --- | --- | --- |
| 41 | Reed Collins／2124092157 | 红月；多语求放过与字画，不凭常见外号归其他人物或认独立事件 |
| 42 | leoheyhey／2122566259 | leo；与leoheyhey3同词根加数字、同头衔同DSN归总监Leo，已补aliases |
| 43 | Yvanise Cerd Brinalle／2122786487 | 小白；默认简介，待具体职责／故事，不与同名小白跨团并人 |
| 44 | Y-cheerss／2123914741 | 疯鱼；纯字符画，不认本人原创或独立事件 |
| 45 | Dark Traffic Police／2116541917 | 跤警；制造业获数百亿投资自述、神使收藏与他人粗俗聊天，未有交易前因后果，不凭自嘲／收藏立传 |
| 46 | Uuhushin Tsukaya／2121495926 | 风卿晨；星城／工业建筑及普通舰船收藏，不认本人全参与或指挥 |
| 47 | Winder Feather／2113267241 | 芳草草；RPS旧简介有联系人线索，自嘲与美洲虎梗；普通联系人不直接认重要管理，待实际事务 |
| 48 | XENONXXIV／2124202202 | XE；Focus／Choice文案，待职责／独立故事 |
| 49 | RainbowSlime／2123813857 | 彩虹史莱姆；超网订单、乌鸦王／GM等战果收藏与字画，不认交易履约或实际指挥 |
| 50 | JI Chai／2115803911 | 无头衔，当前98641376；免费舰船／星币、人生黄字与字画，不认真实福利或具体骗局 |

LP争议10430077310可见46主楼、119楼中楼文字及第1／23楼三张核心图已读；计数仍有缺口，末尾招新图未读。统一事实、2025回收争执、2026接诉与袖笼反驳归[事件摘要](../sources/dsn-lp-dispute-2026.md)，不在三个人素材重复转录。补图直接认出阿巴怪Aba--Guai（2119615259）与投诉人无火的余灰awa-123（2123557648），均已有独立人物事件，[阿巴怪素材](../../src/people/aba-guai/materials-aba-guai.md)、[余灰素材](../../src/people/awa-123/materials-awa-123.md)已归人物目录并成文，后续实际权限／资产结果另查。原话、@与实际执行边界分开，不能把“fuxi管理”红字当原聊天职务，也不把卫队强制回收全部说成DSN本团规定。

袖笼新增自称带新一年130人、对投诉者的现实能力贬低与爷新指责，及对方关于培训／出勤的反驳，已补正文与来源；低素质标签基于2月12—13日公开争吵及现实人身攻击，不是因一句普通粗口。Leo接诉、阿巴怪的回收／权限威胁和袖笼的出勤争论各自归人，不混成总监Leo下令锁船。

## Family Guy前十头衔增量（2026-10-15）

历史榜第1—10完整名片已读，新增10次ESI。与神农余十、Leo正式快照、三张关键图及一次ESI精确名字解析合计在本批30请求上限内；未追加视频、人人船型统计或KM全量扫描。名片来源示例：[MrPRO的ESI](https://esi.evetech.net/latest/characters/2114453889/)。

| 历史名次 | 角色／ID | 头衔与续查记录 |
| --- | --- | --- |
| 1 | knight114514／2119030292 | 无头衔；默认简介，未有中文身份／职责故事；114514为通用梗，不仅凭同团同数字尾巴并cheng114514 |
| 2 | T zhong／2115476943 | 无头衔；简介空，具体人物／职责待查 |
| 3 | Tony Pellion／2113191119 | 无头衔；简介空，不仅凭Tony常见名归回忆录中的未认号Tony |
| 4 | Argent Benuse／2123501229 | 无头衔；默认简介，具体人物／职责待查 |
| 5 | cheng114514／2118886547 | 无头衔；收藏Caspae／Winston 4Head关于ECM脉冲波图标的聊天，未有本人互链，不因此归MrPRO |
| 6 | Dominator person／2120430224 | 无头衔；简介空，具体人物／职责待查 |
| 7 | MrPRO／2114453889 | 陌然；复用已有列传、回忆录与事件；同词根同团Mrpropropro归本人，不将被骂聊天当新事件 |
| 8 | Yushou Kaka／2119085697 | 无头衔；本人奇基莫拉／伊什塔损失及马克瑞收藏；不只凭Kaka归CodeBoss卡卡，后者当前Space Bass |
| 9 | Mrpropropro／2114554682 | BLUE KILLER；同Mrpro词根、同Family Guy，重合收藏归MrPRO；头衔不代替具体打蓝事件 |
| 10 | lIlIlIIllIIIlll／2117919109 | 无头衔；纳迦法收藏配DT掉线一枪文案，不仅凭普通掉线／船损立传，未核本人具体参与 |

[陌然素材](../../src/people/mrpro/materials-mrpro.md)补Mrpropropro（2114554682）同人及BLUE KILLER自署；不由头衔补造新打蓝事件，也不由cheng114514收藏的ECM笑话认同人。低安回忆录中的人物仍沿原[旁支线索](mrpro-lowsec-accounts.md)，本批不把空简介的Tony Pellion、Yushou Kaka自动塞给未对应或已有故事角色。

阿巴怪和无火的余灰快照与列传后续已完成，Family Guy第11—30已续读，见下文；其他实际职责／故事继续沿具体线索补。

2026-10-16本批先完成阿巴怪与无火的余灰正式快照、列传及相关互链，再续Family Guy历史第11—20；快照与缺失名片／必要身份补查合计上限30请求，复用已读LP事件与图片，不读影像／字幕／音轨。新正文按显著发挥验收。

Family Guy第21—30已有两份成功名片可复用，余8份在本批30请求上限的剩余额度内接着核读；不另续预算。

### Family Guy第11至30名增量（2026-10-16）

第11—30完整头衔／简介已核读，复用3份旧成功名片（寻歌2026-10-14、晓天和炽天2026-10-12），新增17次ESI角色请求；旧名片不写作当日刷新。另一请求核军团完整资料，两名新人物的正式快照与上述请求合计在本批30上限内。

| 历史名次 | 角色／ID | 头衔与续查记录 |
| --- | --- | --- |
| 11 | StDiana／2121540507 | 无头衔；默认简介，中文身份／实际职责／故事待查 |
| 12 | Parker Tan／2121671728 | 无头衔；非EVE译作入口不作为本人EVE创作故事，不追现实身份或保存现实人名／组织细节 |
| 13 | biebiemi／2122020347 | 无头衔；文艺文案、字画、本人毒蝎损失与广播；指挥官字样为游戏物品入口，不认FC |
| 14 | Bsjsisnjs／2121930451 | 无头衔；现成英文句子，不认本人创作或独立事件 |
| 15 | Snowan／2120408402 | 无头衔；DEAD ALLIANCE字画，不从文案认现实联盟解散事件 |
| 16 | 404-NOTFOUND／2117018265 | 无头衔；稀有船与旗舰收藏、自用总览；不凭收藏认本人全部参与或指挥 |
| 17 | whutbadmman／2122320120 | 无头衔；简介空，中文身份／实际职责／故事待查 |
| 18 | McAdamFergus／2119770299 | 无头衔；Fly Safe与安全按钮提示“Set this button red your idiot”，不是指向他人的辱骂事件 |
| 19 | centaurea0718／2120394420 | 寻歌；复用Dusk 2026-10-14名片，当前Dusk，共享配置及自嘲，不冒充当日刷新 |
| 20 | dancingf／2113671355 | 无头衔；抗性与技能属性笔记，不认本人原创／教学互动 |
| 21 | GE ZONG／2115337208 | 686；当前Infinity Avenger，2025-04-14必吃榜榜首自署、铁壁收藏，未有具体事件，不凭自嘲立传 |
| 22 | Lady Vindicta／90018978 | 无头衔；他人署名总览与1 expensive配置，不凭配置署名并其他人物 |
| 23 | Bomb Reze／2122641286 | KAKO；当前98799349，字画及泰坦／万古／稀有船收藏，未核本人参与，不仅凭KAKO并已收录卡卡 |
| 24 | feng fenghua／2113500164 | 无头衔；简介空，中文身份／职责／故事待查 |
| 25 | Guifangq／2115482062 | 晓天；复用2026-10-12名片，与Guifangq Hate同人已归线索；旗舰收藏与KM墙不补足立传门槛 |
| 26 | Cockroach Killer／2116307433 | 无头衔；当前98823638，神使超网订单及共享总览，不认交易履约、CEO或指挥 |
| 27 | chitian hehehe／2113788113 | 炽天；复用2026-10-12名片，同词根同KZU已归已有列传；旧白魔爪广告不改成当前所属 |
| 28 | SadMU／2121504672 | 无头衔；冥府／神使收藏、广播玩笑，不认本人独立故事或FC |
| 29 | zixiaoyaojuben001／2118944398 | 无头衔；当前98823638，广播与BIG IS COMING配置，不认本人职责或具体动员 |
| 30 | pugb 2／2119305945 | 无头衔；当前Family Guy，同pugb词根加2、同团归双号组；绝念收藏未核具体参与 |

[pugb双号](pugb.md)按同词根同Family Guy归组，角色pugb 2／2119305945的简介没有新的独立人物事件或指挥依据。RHG中文招新残留与两组织时间接续仍沿原材料，不由同根号把汉堡、pugb或Family Guy管理并成一人。晓天沿[原个人线索](guifangq-hate.md)保留对应与战果，不因多读几条KM墙恢复列传。

Family Guy最新ESI明确Cyan nomi（2122229391）为创建者兼CEO，2025-03-14成立、当前164角色，简介定位低安小规模团；旧DOTLAN有3月16日加入Deepwater记录。[Cyan nomi材料](../../src/people/cyan-nomi/materials-cyan-nomi.md)已纠正旧“仅岗位履历不写”搁置理由，本轮已按已核创团与CEO职责成文、补快照，以游戏名为标题，不再等糯米中文外号／账号桥。未知外号继续留缺口，不妨碍已核角色任职成文。

## LP双主角成文（2026-10-16）

[阿巴怪素材](../../src/people/aba-guai/materials-aba-guai.md)与[无火的余灰素材](../../src/people/awa-123/materials-awa-123.md)已迁入人物目录、两篇列传与正式快照完成，实际停补损／撤权限和船的后续仍留[共用事件](../sources/dsn-lp-dispute-2026.md)查。阿巴怪两块黑料展开统一回收的理由、训话与三项权限威胁；余灰保留问LP、公开控诉、先懒发长记录后补材料和出勤／教学争论，未把被踢本身当黑料。本人说法与其他人的话分开，未添实际执行结果。

两人按快照挂当前组织：阿巴怪FUXI／FRT，余灰JXXY／CSF.；余灰在DSN的历史记录2025-07-19—2026-01-25，与事件及发帖日期相合，旧DSN／FRT不作其当前标签。Leo、袖笼与两人互链已补，旧待撰入口已撤，不留空壳转跳页。

Cyan nomi正式快照、短篇及Family Guy第31—50后续已完成，见下文；前30和两篇LP人物不重抓成功资料，未完成的后续事件继续按具体入口推进。

2026-10-16续批：先完成Cyan nomi创建者／CEO短篇与正式快照，再分十人续Family Guy历史第31—50；复用成功名片，快照及缺失名片／必要身份补查合计上限30请求。只读公开文字，不读视频、音轨或字幕。

### Family Guy第31至50名增量（2026-10-16）

第31—50完整头衔／简介已核读，其中第40名炽天xiao复用2026-10-14KZU名片，余19份新增ESI。Cyan nomi正式快照6次请求、上述19次ESI及酒云贴吧搜索1次合计26次，在本批30上限内；没有重抓成功月榜、历史榜或旧名片。

| 历史名次 | 角色／ID | 头衔与续查记录 |
| --- | --- | --- |
| 31 | S1rpentis／2121813442 | 无头衔；简介仅斜线，中文身份／职责／故事待查 |
| 32 | Howard Chu／2116448319 | 无头衔；当前98670400，简介空，中文身份／职责／故事待查 |
| 33 | MyHearTw1llgoOn／2121464600 | 无头衔；当前98799064，4-HWWF与DUTY文案，不认本人具体动员或指挥 |
| 34 | FanFan Hu／2115181118 | 无头衔；当前98604904，自设Mango Dealer船体加成笑话，不当职业、交易实绩或独立事件 |
| 35 | Fritz Bratwurst／90470423 | P子；当前Dusk，MrPro’s Favorite Item为物品链接，不据此并陌然；配置与不在提示不认实际职责 |
| 36 | acetaffy／2121787238 | 无头衔；默认简介，中文身份／职责／故事待查 |
| 37 | YFdy／2114057918 | 无头衔；简介空，中文身份／职责／故事待查 |
| 38 | Elize Einzbern／2116470606 | 酒云；当前Dusk，自署教学频道及通用总览；频道为游戏内joinChannel，不是B站，教学内容／持续活动待读 |
| 39 | LierFan／2119252153 | 无头衔；俄洛巴斯击杀收藏，未核本人具体参与，不由收藏立传 |
| 40 | chitian xiao／2114917439 | 炽天；复用2026-10-14KZU名片，xiao已归本人；长文为反讽陌然自述，沿已有共享事件，不当炽天新亲历 |
| 41 | FGDH545／2121575089 | 无头衔；广播按钮、集结／阵营文案与太空舱／帕拉丁收藏，不由按钮认FC或实际动员 |
| 42 | ababacd／2117181306 | 无头衔；当前98840701，Try to find who I am文案，无本人互链，不按名字猜阿巴怪 |
| 43 | Gallente Citizen 2115879001／2115879001 | 无头衔；当前默认军团，总览分享，不推断改名原因 |
| 44 | Bor1as／2121321033 | 无头衔；简介空，中文身份／职责／故事待查 |
| 45 | Deact S／2116506361 | 无头衔；For the Good of Many文案，无具体独立事件 |
| 46 | Bediverus／2123289584 | 无头衔；自称要做K头高手及几条KM收藏，不把自嘲和收藏拼成独立故事 |
| 47 | gaili58／2122810325 | 无头衔；广播设置和植入体物品链接，不认交易、教学或实际职责 |
| 48 | Wayne 686／2116927240 | 686；当前Infinity Avenger，与GE ZONG相同中文头衔及同当前军团归本人组，独立故事／职责待查 |
| 49 | cloak and-daggers／2122579634 | 无头衔；默认简介，中文身份／职责／故事待查 |
| 50 | Ride Volde／95132135 | 无头衔；署名雪莱Ozymandias诗句，不认本人创作或社区事件 |

[酒云](jiuyun.md)的本人教学频道与总览已留入口，但教学内容与持续活动尚未读到；不是从“教学频道”四字就认FC或改成B站UP。[686](686.md)两号同头衔、同Infinity Avenger，归本人组，不把两号KB相加；P子与陌然只有物品玩笑关联，不合并。未出现职责或独立故事的人仍留线索，普通收藏、自嘲和广播按钮不补足门槛。

Cyan nomi已收录，素材迁入[本人目录](../../src/people/cyan-nomi/materials-cyan-nomi.md)，中文“糯米”和贴吧账号仍待桥梁。短篇保留建团两天后入Deepwater、推荐制与炽天招新理念冲突的组织背景，不虚构是谁下令踢人；当前F.GUY／BIGAB按快照标注。旧待写入口已撤。

下一批从第24家Cosmic-Wanderers／98769610历史前十续读。Family Guy前50名片核读完成，不代表其九月榜前50、所有教学／个人故事或50家全部调查完成；酒云和P子等具体人物入口可按增量接着补。

2026-10-16 Cosmic-Wanderers续批：从历史前十开始，逐批最多10人；本批缺失名片与必要身份补查总上限30请求，复用已成功缓存，按增量在额度内续读，不读影像／字幕／音轨。小黄人已收录，先核同人及具体职责，不重复建CEO页。

### Cosmic-Wanderers前20头衔与米奇成文（2026-10-16）

前十、11—20各一批完整名片已读。新增20次角色ESI、2次军团ESI及米奇正式快照6请求，合计28次，未自动续预算；故事优先于更多无职责名片，先完成米奇，不再挤额度抓第21名以后。旧打蓝加事件复用成功缓存，只重读本人发言及相关反应，不重抓原帖。

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 1 | FizzyCrow／2123083622 | 科勒，征西将军；同团作战文夹、书签与广播入口，不仅凭将军头衔认实际指挥 |
| 2 | NightRainCN／2122455340 | 夜雨（御马监），军团唯一雷电法王；字符画，无职责说明，不并其他夜雨行舟或FC |
| 3 | Xiao HuangRen／2119217172 | 教皇；Xiao HuangRen既有小黄人号，沿用本人身份，收藏不作新增具体战役 |
| 4 | Xiao Huang Fight／2119362525 | 教皇；Xiao Huang Fight与小黄人同词根、同头衔、同CO.WA，并本人，不相加KB |
| 5 | Jiao-Huang／2119497024 | 教皇；收录号Jiao-Huang，旧故事／管理FC职责沿原传 |
| 6 | M Ding／2114624513 | 绝活搓背，镇西将军；小型舰与纪念碑收藏，无明确指挥／职责 |
| 7 | MC the BallBall／2123310034 | 唔该，征北将军；通用抗性表、总览与广播，不由将军头衔认FC |
| 8 | geek cc／2116152408 | 出其，镇北将军，审判王；简介空，不因半名并出其东门 |
| 9 | Chenxi Weiliao／2123400760 | 未了；自署2025-05-05陪伴／不看KB高低文案及救赎收藏，不认独立事件 |
| 10 | Brax Swag／2114661099 | 夜星行客；elder ricardo god文案，实际职责／故事待查 |
| 11 | Dunemur Xuan／2123494957 | 小轩；总览、广播与自标首杀的响尾蛇及太空舱等收藏，未核具体事件 |
| 12 | xg chi／2113530734 | 老蒋；萌新自称、NPC抗性表，无独立故事／实际职责 |
| 13 | prairie king／2114761643 | 茗茗；多语投降文案与字符画，不当真实投降事件 |
| 14 | wutangk／2123388238 | 鱼糕；小航等KM收藏、血6／血10／蛇10收购入口，无履约事件或职责 |
| 15 | babaaini／2116943455 | 表哥，招新官、总监、POS权限；当前Deadspace Spearhead，实际招新／管理职务足以留短篇，下一批补快照成文 |
| 16 | Vaan1／2123360678 | 林斯特；抗性表、冬眠者箱子提示、总览与广播，未有本人教学活动／独立事件 |
| 17 | M1kiIy／2123055352 | 米奇，CEO、FC；现Sparrow In Cage创建者兼CEO；同名同CO.WA时间对应错过😳◎，统一回复／插广告／spy解释已成文 |
| 18 | cloudfog／2122441192 | 无头衔；当前98846275，楼房地基与夕阳比喻，未有具体人物事件 |
| 19 | cheng he／2114050764 | 程；维德马克收藏与GG评价，未有独立故事／实际职责 |
| 20 | BB ice／2123440570 | 黑鸟；BB ice既有列传，简介格言及无关金融缩写不追现实活动 |

[小黄人素材](../../src/people/jiao-huang/materials-jiao-huang.md)新增Xiao Huang Fight号；第3／4／5均归同一人，不另立传，不相加逐号统计。[米奇素材](../../src/people/m1kiiy/materials-m1kiiy.md)记录游戏头衔、CO.WA任期、贴吧称呼与统一回复的账号桥，列传保留创建Sparrow In Cage、自称FC及旧团打蓝加争议中的广告／spy口径。已加与小黄人的互链；当前.MU／IGC按快照，不挂旧CO.WA／INIT标签。其历史榜名次不是其当前军团。

[表哥babaaini](../../src/people/babaaini/materials-babaaini.md)已核公开招新官／总监／POS权限，当前Deadspace Spearhead／98841123，CEO是另一角色AlizeeJacotey，不把表哥误称CEO；管理职务足以留短篇。后续已补正式快照、按实际组织职责成文，见下文；Cosmic-Wanderers第21—35已续读。科勒等将军称号、昵称、通用配置与自嘲尚未显示具体职责或独立人物事件，继续沿公开任职／点名补材料，不凭官衔字面批量认FC。

2026-10-16表哥成文续批：先补babaaini正式快照与管理短篇，再逐十人续Cosmic-Wanderers第21—40；正式快照、缺失名片与必要身份补查总上限30请求，缓存优先，不自动续预算，不读影像／字幕／音轨。

### Cosmic-Wanderers第21至35名与管理短篇（2026-10-16）

第21—30及31—35完整名片已读，新增15次角色ESI；表哥简介训练计划另补读两作者ESI2次，核弹CO.WA任职时间补历史ESI1次，加两名正式快照12请求，共30次。第31—40原十人名片均缺成功缓存，预算内只续到35，不自动加预算。职责人物先成文，没有将未读后续名单宣称前50完成。

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 21 | AUG U／2121581732 | 鲸落；默认简介，不并其他同外号人物 |
| 22 | Pop Driver／2122529467 | 派大星；简介空，职责／故事待查 |
| 23 | ji wuming／2112339969 | 无名；简介空，不仅凭常见外号并已有无名 |
| 24 | YIGEGE／2123608231 | 益哥；简介自标前两KM及招新广告／广播，与小黄人帖子益哥称呼同团可作入口，未补独立故事 |
| 25 | teleportor／704527521 | 浩；本人英文自报舰队物资后勤官及对外军团外交；按本人说法留管理短篇，不升格联盟高层 |
| 26 | hurt Leo／2112645460 | 老刘；新年及坦克字画，无具体独立事件 |
| 27 | You Siste／2124139415 | 老哥；星点字画，未有职责／事件 |
| 28 | Qiu-qian／2121853214 | 秋千（大聪明）；中英粗口自嘲及本人损失／旭日／苍鹭收藏，非持续辱骂或独立事件 |
| 29 | Mu Xu／2114554951 | X7；60KM环绕哨站提示，不当原创教学或实际职责 |
| 30 | Tdawn／567655533 | 肥肥狒狒；国服搬来的总览链接，非国服人物事件／原创创作 |
| 31 | N-bomber／2120263809 | 飞奔的核弹；2025-04-17起同CO.WA，旧帖day沈学连被称核弹、替本团辩护并被讥电鱼，身份已接，下一批补快照成文 |
| 32 | Thunder luck／2116363615 | 无头衔；当前默认军团，广播、总览、NPC抗性及反跳怪笔记，未有本人教学活动／故事 |
| 33 | Aonehod1337／2124094329 | 绿豆（原红豆，因lolC失败改名绿豆）；自嘲头衔及苍鹭收藏，无完整事件／职责，不解读lolC机制 |
| 34 | RyersonW／2123515802 | 王；默认简介，职责／故事待查 |
| 35 | hmy6／2119292241 | 星光，征东将军；同词根编号hmy6-2同历史CO.WA归本人组，主号KM收藏与广播未有具体指挥／故事 |

[表哥素材](../../src/people/babaaini/materials-babaaini.md)迁入人物目录、当前.D.DS／CP.已按快照成文，正文区分本人招新／总监职责与简介转挂的训练计划，不误作原创课程。计划作者DreamM00n／★苏玩★和Siivitni／千里已补读完整名片，角色信息与身份缺口留本人素材，未由作者ID或形近名强并表哥／荣耀。

[浩素材](../../src/people/teleportor/materials-teleportor.md)与短篇完成，按本人英文自述交代保障舰队物资、对外军团外交，不认CEO、FC或INIT联盟外交负责人；当前CO.WA／INIT.。泛战斗自述不造具体战报，抒情段只作门面文风。

[核弹](../../src/people/n-bomber/materials-n-bomber.md)的角色头衔、2025-04-17起CO.WA履历、贴吧#28被称核弹与本人为军团辩护的发言已接成身份链，对手#4孔乙己体与楼中楼电鱼讥刺单列为对方文案。后续已补快照成文并读完该团前50，见下文。[星光](hmy6.md)双号已按同词根加编号、同历史军团归组，第38名hmy6-2完整名片未读，姓名对应不提高连续核读范围。

2026-10-16核弹成文续批：先完成N-bomber正式快照与列传，再分十人续Cosmic-Wanderers第36—50；有剩余额度再接Galactic Empire Co LTD前十。正式快照、缺失名片、必要身份补查总上限30请求，复用成功来源；不读影像、字幕、音轨。

本批Cosmic-Wanderers第36—50与核弹／花花快照完成后，剩余2请求先读Galactic Empire Co LTD第1—2名；不将前两名当作前十完成。花花只沿公开总监任职与已核在团期间讲组织背景，不将同名ES交接人归给他。

### Cosmic-Wanderers第36至50名及GECL前两名（2026-10-16）

第36—45、46—50完整名片分批已读，新增15次角色ESI；核弹与花花两份正式快照12请求、花花关键词搜索1次、GECL前两名ESI2次，合计30次。GECL后续未读，不将前两名改称前十完成；未额外加预算。

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 36 | Tu Dou2／2123789981 | 土豆；投降字画及酒云喵00总览，只有作者工具入口，不认实际投降或原创作品 |
| 37 | ruiruia／2120308783 | 豆芽；现Deadspace Spearhead，同ruiruian词根、同头衔同团归组，打怪笔记、纪念碑收藏不认独立故事 |
| 38 | hmy6-2／2119666440 | 星光；当前同CO.WA，与hmy6同词根编号同头衔补核，广播及世界观文案不作人物事件 |
| 39 | Your Siste／2124139355 | 老哥；Your Siste与You Siste同近似词根、同头衔同CO.WA归组，自贴旧KB不认当前统计或能力 |
| 40 | liu pizi／2114007521 | 卡本；字符画，无实际职责／独立事件 |
| 41 | D-Alessandro83 Kuha／2116450382 | 达涅；当前Phoenix City，自贴伊什塔损失收藏，不据普通损失立传 |
| 42 | Man 8／2122619196 | 曼巴；飞龙远征文案，非具体战役／本人指挥或独立故事 |
| 43 | cherrybone／2121993705 | 花花 总监；本人公开总监任职留管理短篇，CO.WA在团自2025-01-15；不认ES同名交接人 |
| 44 | JY-SaMa／2123377920 | 久夜；默认简介，无实际职责／独立事件 |
| 45 | ruiruian／2119606084 | 豆芽；现Deadspace Spearhead，与ruiruia同词根／同头衔／同团归组，总览广播不认原创教学 |
| 46 | Otsusen Kishunuba／2123242314 | 劳伦；默认简介，与小黄人招新帖劳伦大将称呼同团可作入口，普通船损／昵称不足立传 |
| 47 | yao666／2123455063 | 大表哥；当前Baby-Bus，字符画，不并babaaini或Dusk表哥 |
| 48 | 24kzz／2123763873 | 心之；默认简介，无实际职责／独立事件 |
| 49 | Hybiki Terona／91712473 | 叶子；广播、洗安等及太空舱／苍鹭收藏，无完整人物事件 |
| 50 | laolaiyihao／2123094840 | 老赖1号；当前Baby-Bus，夸张威胁字画无上下文，不当真实威胁事件或据此立传 |

[豆芽](douya.md)、[老哥](you-siste.md)双号按同词根／同头衔／同当前军团归组；[星光](hmy6.md)编号号完整名片已补，当前同CO.WA且头衔吻合，不相加多号KB。土豆转挂酒云喵00总览，作为[酒云](jiuyun.md)工具传播补充，不把使用者当作者或推教学效果。

[核弹素材](../../src/people/n-bomber/materials-n-bomber.md)迁入人物目录并成文，本人对线与对手戏台分别叙述，未造真实电鱼船损。[花花素材](../../src/people/cherrybone/materials-cherrybone.md)按公开总监任职留短篇，CO.WA履历和军团迁盟作背景，不杜撰具体部门，也不由同名归ES交接旧事。两人当前CO.WA／INIT.，小黄人篇补核弹发言与互链。

GECL前两名已读：第1 Aurora Rinzler／2114098387，头衔银光／黑塔狂热粉丝，当前Arknights.／98725089／FRT；第2 jianjun Aideron／96280212，头衔建军，现怯薛／98694557／FRT，沿已有列传。建军简介年度打窝奖指向银光，银光简介反提建军“我保小”文案与nextorian Monitor收藏；[银光线索](aurora-rinzler.md)记录身份、互相提名及待补事件，不由收藏、单句聊天、AT冠军好兄弟自嘲认其本人战果／夺冠或FC，也不并成建军小号。建军正文已补银光中文称呼，Noraus素材只留第三方简介摘句，不造Monitor损失责任。

GECL第3—25后续已续读，见下文，再沿有效职责与事件展开；Cosmic-Wanderers前50名片完成不等于该团九月月榜、所有人的故事或50团调查完成。

2026-10-16 GECL续批：先读第3—10，再按线索以每批最多10人续读；缺失名片、必要身份补查与可能成文快照合计上限30请求，优先复用缓存，不自动加预算，不读影像／字幕／音轨。

### GECL第3至25名与daoyan yin成文（2026-10-16）

第3—10、11—20、21—25完整名片分批已读，新23次角色ESI；另复核噩梦完整ESI1次，daoyan yin正式快照6请求，共30次。前两名复用旧成功记录，前25形成连续范围；第26以后未读，不自动加预算。

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 3 | daoyan yin／2118623409 | 真没招了；当前Arknights.，与噩梦两份简介具体互挂／元帅批注及技能教材互动已成文，六分钟说法仍标本人来源 |
| 4 | wpbill／2114107719 | 亡术，IV级超级旗舰成员；总览、广播、Gay Niu总览预设（非角色链接）与代驾工作室署名，未有本人经营／脚本或指挥依据 |
| 5 | KCooperA／2114837657 | 狗汁，银河陆军统帅，IV级超级旗舰成员；字符画，不由风格头衔认FC或实际统帅 |
| 6 | juli xu／2114290891 | 许杰，II级主力火力成员；KM收藏，不认具体本人故事／职责 |
| 7 | Puff LY／2114785735 | 帝国，魔王；简介空，职责／故事待查 |
| 8 | niuniu wei／2115153179 | 再战，IV级泰坦成员；非EVE成人作品入口不展开现实人物／影像；诱导打赏与物品入口，不认交易履约或RMT |
| 9 | Harry Kewell／2114344694 | 贝塔，II级主力火力成员；小航／无畏／太空舱／空堡收藏，未核实际参与，不单独立传 |
| 10 | Leepapa／2114286449 | 泡面，IV级大航成员；字符画和恶狼收藏，无独立人物事件／职责 |
| 11 | Riound cc／2118584000 | 小马宝莉；当前Arknights.，猎犬自损和稀有船／旗舰／CCP船收藏，不认本人全部参与或普通损失黑料 |
| 12 | Fubuki Waifu／2115433044 | 无中文头衔；黑莲收录号Fubuki Waifu，ATXIX冠军队长自署沿原传，收藏不作新战果 |
| 13 | dingd xiao／2116196470 | 小叮当；当前Arknights.，简介单句骂辞，不由一行粗口认严重辱骂标签或独立事件 |
| 14 | suiyue chine／2113955546 | 岁月；会战总览、dscan、补损网站入口，不认本人管理职责或原创作品 |
| 15 | LY666／2113441162 | 党员；当前Arknights.，仅游戏头衔，不推现实政治身份；总览、广播及地点笔记，无具体职责／故事 |
| 16 | DreadNaught 723／1289646216 | 723，III级旗舰成员；格言、抗性、队长是我别开枪玩笑与WC黑影值守／信标流程，未明原创及本人教学活动，不认本人值守指挥 |
| 17 | kun Ohaya／2112982260 | 昆；当前Arknights.，KM收藏及学会五度提示，不认明确带队或事故 |
| 18 | ALL SET／2112846010 | 云婶，皇家大陆驻新伊甸大使；停止窥探，戏称未指明实际玩家组织外交事务，不升格外交管理 |
| 19 | lzabbx／2114174154 | 无头衔；当前默认军团，简介空，身份／职责／故事待查 |
| 20 | Jackie Corvinus／92758044 | 最强萝莉；队友被抓边笑边刷等文案，不从玩笑认真实卖队友或具体行为 |
| 21 | Maitreya1017／2113999764 | 弥勒，II级主力火力成员；简介空，职责／故事待查 |
| 22 | M Yilia／2115171347 | MY；诱导／死亡成长及solo失败概率自嘲，不当KB定论或立传事件 |
| 23 | Wandering GECL／2115119209 | 小猪；性暗示文案无具体事件／职责，不扩成现实行为 |
| 24 | Leper Gnomee／2114398220 | 无头衔；当前默认军团，格言与RIP NeedsToBeReal署名，背景未明，不猜现实死亡或独立事件 |
| 25 | W HDXG／2112788428 | 灿星；当前Arknights.，柱公列传文言戏仿，人物／事件和创作互动未对应，另留作者线索 |

[daoyan yin素材](../../src/people/daoyan-yin/materials-daoyan-yin.md)与列传已完成：本人挂噩梦2022年欧贝直播六分钟开席的讥刺，噩梦公开给其四条元帅逐条批注，既有论坛又将他当练技能教材。正文写两边的公开言行，不拿普通损船／KB作立传门槛，不编简介编辑先后，也不由未读BR认定全部号／损失／指挥。游戏名作标题，头衔真没招了入别名，不自行造导演等中文名。

噩梦篇保留全期KB、三场已核战役与逐项批注，新增对方挂回来的六分钟说法及互链；原把蜜蜂半年列黑的块已撤、军团经历并开篇背景，Komodo收藏保留门面而不算本人围杀功劳。黑莲当前收录号与冠军队长自署归原素材，不用本次简介重读替代旧AT／B站调查。[灿星](w-hdxg.md)的文言戏仿先存作品结构、人物缺口，不把戏中对白／辱骂／现实影射当事实。

GECL第26—50后续已读，见下文，继续优先实际职责／人物事件；军团分级、旗舰成员、银河统帅等头衔不单独认FC，皇家大陆大使不在缺组织事务时升格外交管理。

2026-10-16 GECL后半续批：从第26—35开始，逐批最多10人；缺失名片、必要身份补查、可能人物快照共上限30请求，复用成功缓存，不自动追加额度，不读影像／字幕／音轨。

GECL第26—50完整名片核读后，已新增24请求、复用布鲁斯2026-10-14缓存1份；剩余6请求接Chuangshi College／98705642第1—6名，不把前六名称前十完成。

### GECL第26至50名与创世学院前六名（2026-10-16）

GECL第26—35、36—45、46—50完整名片分批已读，新24次ESI，复用布鲁斯2026-10-14名片1份；创世学院第1—6名新6次ESI，共30请求，未自动续预算。前50是GECL历史榜的名片核读，不等于九月榜个人调查或所有故事完成。

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 26 | sky chine／2113907530 | 岁月；与suiyue chine同头衔同GECL归组；估价、市场、总览等工具不认原创或管理 |
| 27 | Alternative Muv-Luv／95072457 | 无头衔；黄鳝收录号Alternative Muv-Luv，当前98749004，空简介，不撤原AT／舰队故事 |
| 28 | ROSEN SHINKU／95190417 | 帝国；与Puff LY同头衔同GECL归组，Big brother文案不认管理／监视行为 |
| 29 | Vasuman／2114212214 | 大力，IV级大航成员；简介空，职责／故事待补 |
| 30 | NSH Ken／2115101507 | 无头衔；当前默认军团，简介空，中文身份／职责／故事待补 |
| 31 | roger dio／2115179064 | 我最铞；本人直贴B站av33759016，作者／公开文字及是否本人作品未读，不当UP身份 |
| 32 | Destiny Depran／2115548450 | 一骑，II级火力成员；简介空，职责／故事待补 |
| 33 | Buzz Kevin／2115488476 | 随风；现特执，暂无与DC随风的同人桥，不以同名合并；工具／交易频道未见具体职责 |
| 34 | a-piao／2117878863 | 无头衔；当前默认军团，阿飘总览、Noraus太空舱及CCP船收藏，单句粗口不认独立事件 |
| 35 | MartingAo／2119101671 | 奥利奥；冥府／使徒收藏、建筑管理频道和工具入口，不由频道名认管理职责 |
| 36 | FUZE TACHANKA／2113366690 | 福泽；燃烧任务操作笔记及总览，未明原创或本人持续教学／互动 |
| 37 | Anankke Z／2114031696 | 无头衔；当前默认军团，简介空，中文身份／职责／故事待补 |
| 38 | Cytoophidia／2113986043 | G3毒气，III级旗舰成员；简介空，不认FC或重要管理 |
| 39 | Polarisdigua Inkunen／2113244982 | 地瓜#02573 AFK，贝斯城管；当前创世，简介空，不由共享城管头衔认管理或指挥 |
| 40 | hdxxh／2118582384 | 活动星系核，BWF萌新最爱之人；KM收藏，头衔未说明人事／战备／招新等实际职责 |
| 41 | SnowLeaf／2117177992 | 叶子，II级火力成员；简介空，不并其他军团同名叶子 |
| 42 | wp billl／2114314764 | 亡术；wp billl与wpbill同词根拼写变体、同头衔同GECL归组；广播不认实际职责 |
| 43 | Aivio Rotsuda／2118648915 | 丝路；默认简介，职责／故事待补 |
| 44 | EVEBruceL／2112928634 | 布鲁斯；复用Fox 2026-10-14完整名片，当前混沌，空简介，未作当日刷新 |
| 45 | xiao mai lin／2115196303 | 阿德；总览、报点与工具入口，未有独立故事／实际职责 |
| 46 | XJNYDX／2118832755 | 温度；现特执，首次跟队吃超旗自署、飞龙及其他KM收藏、矿石笔记，未核具体参与不凭收藏立传 |
| 47 | SuFei Dryovernigh／2113458206 | 苏菲；物品交换入口，未有具体交易事件／职责 |
| 48 | SelilaLee／1944229468 | 洛，IV级泰坦成员；燃烧任务三跳内组队帮做、索取分LP，留服务入口，不认已履约或持续教学 |
| 49 | lianyicheng／2117319606 | 潋伊晨，II级火力成员；广播入口，职责／故事待补 |
| 50 | hu jiao／2115143063 | 胡椒；简介空，职责／故事待补 |

[岁月](suiyue-chine.md)、[亡术](wpbill.md)、[帝国](puff-ly.md)各两号按同头衔、同当前GECL及名字变体归组，不相加各号统计；未有独立故事或实际职责时不只凭总览、广播、成员等级立传。[Buzz Kevin](buzz-kevin.md)只确定头衔随风、现特执，与DC随风缺桥先不合并。[洛](selilalee.md)的燃烧任务帮做和分LP条件已留，尚无履约、持续教学或具体玩家反馈。

旧记录把亡术简介“Gay Niu”误写为角色入口，本批核原始href实际为overviewPreset，已更正旧表及TSV，不能拿来认牛团主事者或小号。“Fraternity Building Management”为奥利奥简介入口，不单凭加入频道认建筑管理职务。roger dio本人直贴B站av33759016留作具体入口，作品作者／公开文字未读，不认UP身份、不读视频／音轨／字幕。

创世学院Chuangshi College／98705642第1—6名已核读：

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 1 | Banknote printer／2119749773 | 主团，白给大师#41267；默认简介，不把主团标记认CEO／管理或本人主号 |
| 2 | Fracture Ray／2117368009 | 主团，碎裂的光芒#11770；手机电容等自设加成玩笑，不作独立人物事件 |
| 3 | My Fair Lady／92487232 | 主团，明哥#74629；简介空，不与其他团明哥合并 |
| 4 | Vbndolog／2124182303 | 理想#84540；当前创世，默认简介，职责／故事待补 |
| 5 | Raziel Maken／2116228249 | 无头衔；当前98806817，Not Friendly文案，职责／故事待补 |
| 6 | Yuan-Ji／2113881347 | 元吉#88230；当前创世，广播、物品及图形文案，不由短句认指挥／职责 |

创世学院第7—38后续已续读，见下文；第28、30旧名片复用，不把前38写成前50完成。[主团]、成员编号与同名昵称不自动证明职责、本人主号或同人关系。

2026-10-16创世学院续批：从第7—16开始，逐批最多10人，缺失名片及必要身份补查／人物快照合计上限30请求；复用成功名片，不自动追加额度，不读影像／字幕／音轨。

### 创世学院第7至38名与同人组（2026-10-16）

第7—16、17—26、27—36、37—38完整名片分批已读；共32份，其中泽妮塔／神猪复用2026-10-14名片、Thunder luck复用本日Family Guy名片，新增29次角色ESI。另补本人直指主号eroiturete完整ESI1次，共30请求，未自动追加额度；不把主号补查塞入原冻结名单／排名。

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 7 | SSJT／2122580617 | 宝宝#68750；与SJJT名字近、同头衔同学院归组，默认简介无职责／独立故事 |
| 8 | Rulee Krzysztof／2120939713 | 诺克#19560；工业禁PVP与先付500万赔偿申请的英文导师条款，留文本，不认已赔付／诈骗或实际导师任职 |
| 9 | Lulili／2118454057 | 陆离；当前98613748，文学引句，不认原创或个人事件 |
| 10 | gameoverbro／2124225436 | 主团CE#99773；简介直指eroiturete／2118525107是主号，补读同CE编号、现创世，明确同人；暂无故事／职责 |
| 11 | Rnaissance／2123308899 | 薛定谔#85801；当前创世，吃饭文案、签名／KM文字与广播，不认独立事件 |
| 12 | cruryTAT／2123857553 | 栗子；当前咸鱼，简介空，职责／故事待补 |
| 13 | Security100／2119788390 | 无头衔；当前默认军团，两条普通KM收藏不认独立事件 |
| 14 | Big bobomao／2122020572 | 彗星；快递号自署，未有实际服务事件或组织职责 |
| 15 | we4eta／2118970944 | 豆芽炒土豆#45660；与Buil同头衔同学院归组，默认简介 |
| 16 | kasumi90／2121560439 | 西行寺幽灵子#44221；当前创世，偏振长尾鲛自夸、KM收藏与露蒂丝称呼，无实际故事／账号桥 |
| 17 | Assalmitier Neye Actault／2122739346 | 苹果#24114；当前创世，CS首杀自署及稀有船／旗舰收藏，未核本人参与，不据收藏立传 |
| 18 | Buil／2123983883 | 豆芽炒土豆；与we4eta同中文头衔同学院归组，默认简介 |
| 19 | Evan W／2118387734 | Иван；当前创世，简介空，职责／故事待补 |
| 20 | MrBear226／2124070402 | 小白熊#10936；当前创世，默认简介，职责／故事待补 |
| 21 | Voidborn Specter／2124058308 | 明哥#74629；与My Fair Lady同姓名／相同编号及同历史学院归组，当前创世，不把两号当前团籍写成相同 |
| 22 | nalemoncha／2121578356 | 谨言慎行#15557；当前创世，同lemon词根／同中文称呼／同团记录归nelemon，广播不认实际管理 |
| 23 | MyShmily1／2123950325 | 思倾年#61161；当前创世，默认简介，职责／故事待补 |
| 24 | lzq3／2122479798 | 无头衔；当前98618097，默认简介，职责／故事待补 |
| 25 | Yokukka 3／2124159381 | 无头衔；当前创世，名字带3但未对上同系列号，默认简介 |
| 26 | fried chicken leg／2121979971 | 炸鸡腿#60142；当前创世，默认文案与弥米尔收藏，无独立事件／职责 |
| 27 | SJJT／2122658883 | 主团宝宝#68750；SJJT与SSJT字符序变体、同完整头衔同学院归组，默认简介 |
| 28 | Zirnitral／2119850771 | 泽妮塔；复用2026-10-14名片，现特执，抗性表；不是驾驶泽尼塔、FC或实际教学依据 |
| 29 | haonimao／2123802791 | 战灵#74448；当前创世，恶狼收藏和广播，职责／故事待补 |
| 30 | wevsty／2121046206 | 神猪#47262；复用2026-10-14名片，当前创世，广播与总览，不认实际管理／FC |
| 31 | Thunder luck／2116363615 | 无头衔；复用本日Family Guy所读Thunder luck名片，当前默认军团；广播和抗性笔记不认原创教学 |
| 32 | Okar-z／2121377038 | 耶干面#20735；当前创世，简介空，职责／故事待补 |
| 33 | hutao111／2121568794 | 胡桃#04586；当前创世，海军凤凰收藏、抗性表及文案，未核参与或职责 |
| 34 | MaxBiao／2120385962 | 无头衔；当前98758183，默认简介，中文身份／职责／故事待补 |
| 35 | Vandolog／2123503024 | 理想#84540；Vandolog与Vbndolog单字母变化、同编号同创世归组；KM收藏不认独立事件 |
| 36 | Raisond'etreoF9／2121487664 | 无头衔；当前默认军团，字符画和GM／CCP船收藏，不认本人参与或工作人员身份 |
| 37 | BGDS-Drone-Z／2122400056 | 白给大师#41267；与Banknote printer及Drone-Y同头衔／相同编号／同学院归三号组，默认简介 |
| 38 | BGDS-Drone-Y／2122400043 | 白给大师#41267；与Banknote printer及Drone-Z同头衔／相同编号／同学院归三号组，默认简介 |

同人已归正式线索：[白给大师](baige-dashi.md)三号、[宝宝](baobao-ssjt.md)双号、[豆芽炒土豆](douya-chaotudou.md)双号、[明哥](mingge-74629.md)双号、[理想](lixiang-84540.md)双号、[谨言慎行](jinyan-shenxing.md)双号、[CE](ce-eroiturete.md)主小号。姓名、相同编号、同团及本人直指分别记录，不要求再确认；明哥两号当前学院／创世分别写，nelemon旧名片不假称本日刷新。诸号还缺独立事件或明确职责，不用成员／主团标记、默认简介、KB与自嘲拼立传门槛，也不把不同号统计相加。

[诺克](rulee-krzysztof.md)的工业号禁PVP、500万申请费、吉他价赔付、超1B另议和先攻击不赔等文案已吸收保存。只取得简介条款，没有具体付款／赔付、导师任职或本人对应Keyboard Monkey的证据，不写成已发生的赔偿／诈骗故事。

创世学院第39—50后续已读，见下文；前50名片完成不代表九月榜人物调查、全员故事完成。当前已归组者可沿职责／具体事件追加材料，主号补读和别名对应不冒充人物成稿。

2026-10-16学院收尾与Navigators Union续批：从学院第39—48开始，再补49—50；有剩余额度接Navigators Union前十。缺失名片、必要身份补查及人物快照总上限30请求，每批至多10人，缓存优先，不自动追加额度，不读影像／字幕／音轨。

### 创世学院第39至50名及Navigators Union前23名（2026-10-17）

本批于10月16日取得完整名片，17日归档；学院新12份，Navigators Union新18份、复用2026-10-14创世旧名片5份，共30请求、35份名片核读。没有按归档日伪称全部新刷新，未自动追加预算。

| 学院历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 39 | BeiLiujiang／2120606084 | 北流江#60141；当前创世，抗性、燃烧、虫洞笔记与矿工无害自称，不认原创教学或实际职责 |
| 40 | BGDS-Drone-X／2122400011 | 白给大师#41267；同学院同编号、Drone-X系列归白给大师第四号，默认简介 |
| 41 | Shiki OvO／2118351278 | 无头衔；当前98680791，简介空，职责／故事待补 |
| 42 | jita dutu／2120363625 | 夕阳#94042；当前创世，默认文案与广播／物品入口，无独立事件 |
| 43 | ZZ ceti Fi／2113437541 | 吓死猫；当前98772842，抗性笔记，未有本人教学活动／故事 |
| 44 | WILLIAMC／2118780792 | 深呼吸#51383；默认简介，职责／故事待补 |
| 45 | KINGMANBO／2124548992 | KING曼波#36477；字画，无具体人物事件／职责 |
| 46 | plan fgh／2121916071 | 爱大狗#6198；当前混沌，普通KM及物品入口，不并其他大狗或由收藏立传 |
| 47 | milk tea1／2121029321 | 波波奶茶#63134；当前创世，大地瓜文字与本人狐鼬损失收藏，无主号链接，不强并地瓜 |
| 48 | pavlov114／2124382785 | 走136#09930；当前创世，默认简介，职责／故事待补 |
| 49 | HYHduhe／2121490491 | 渡河#43019；当前Navigators Union，CCP太空舱收藏，不认本人参与或工作人员身份 |
| 50 | GGQC／2124398661 | 白色小花#39372；当前创世，默认简介，职责／故事待补 |

白给大师Drone-X同编号同团加入[四号组](baige-dashi.md)。学院历史前50至此连续核读完成；普通笔记、自损、角色编号和默认简介仍不替代独立人物故事或实际职责。

| Navigators Union历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 1 | Crazy little sharks／2113451843 | 疯狂小鲨鱼#73675；复用2026-10-14名片，空简介，无实际职责／故事 |
| 2 | GY1563／2118098339 | 梦中祈愿#32967；复用2026-10-14名片，PVP菜鸟自嘲不构成人物事件 |
| 3 | ATLantis ZS／2116772995 | Az#54192，内环成员；内环未说明具体组织工作，旗舰收藏与他人台词另存，不单凭称呼认高层／FC |
| 4 | T95 FV4201／2124231755 | 秃酋#46610；普通舰／铁壁／GM太空舱收藏、广播，不认实际职责／新故事 |
| 5 | Madyne en Chalune／2121563823 | 摸鱼#38009；阿兹贝尔收藏及广播，与O字系列摸鱼编号不同、名字不近，暂不强并 |
| 6 | OAOOOOO／2121075817 | 摸鱼#11501；OAOOOOO与OOOOOAO同字母变体、同编号同团归组；YouTube链接不认本人频道 |
| 7 | Moonfall JL／2114781304 | 落月之夜#71577；简介空，职责／故事待补 |
| 8 | longxiacun／2117618891 | 龙夏存#84118；抒情句，未有具体人物事件／职责 |
| 9 | ZI LIAN／2113713154 | 芷恋#83804；复用2026-10-14名片，旗舰／监视者等KM收藏及工具，不认收藏者驾驶Monitor或指挥 |
| 10 | Monicadede／2113572217 | 飞奔#59359；总览／收藏及juanniaoyuhua转引六竹吐槽，已归六竹材料，不由保存者身份立传 |
| 11 | Rikimaru98 Lee／2114386210 | 力丸#23288；四条本人阿斯特罗损失配自嘲／警示，无外部互动或独立事件，不凭自挂战损立传 |
| 12 | JL-Yuzhou／2124283314 | 宇宙#11037；默认简介，职责／故事待补 |
| 13 | water Bottled／2116281285 | 816#22571；单句粗口、GM／泰坦收藏及广播，无具体人物事件 |
| 14 | Andrew Cumningham／2119111469 | 决明#40380；征服者收藏与光荣属于欧塔文案，不认本人参赛／夺冠或指挥 |
| 15 | Ealker Skord／2119111185 | 老徐#29101；总览广播，无实际职责／独立故事 |
| 16 | black meow cat／2113227777 | 冬玥喵#56084；F1自称与拟人化威胁玩笑，无具体受害人；无敌buff实际退出游戏界面提示，不当真实工具 |
| 17 | sorryicamelate teacupnight／2116807193 | 水龟#63762；采矿总览入口，无实际教学／管理依据 |
| 18 | qingkong／2118755954 | 落梦星河#17518；默认文案、广播与总览，无独立故事／职责 |
| 19 | heiyezhimao cat／95569843 | 吉祥物葉猫儿#26594；总览广播与星城收藏，不凭猫名并冬玥喵 |
| 20 | Galician0／2117641420 | 加利西亚#00700，狼心守望者；复用2026-10-14名片，已有列传／FC依据沿原人物，格言不补真实背叛事件 |
| 21 | OOOOOAO／2120859435 | 摸鱼#11501；OOOOOAO与OAOOOOO同字母变体同编号同团归组，未读YouTube频道 |
| 22 | LY Samoyed／2115423588 | 黎明#33520；复用2026-10-14名片，字符画和广播，无独立人物事件 |
| 23 | qiuxiaoye／2124366891 | 秋小叶#35457；音乐／其他游戏剪辑的喜好清单，不认本人作品或EVE持续创作 |

[摸鱼O字组](moyu-11501.md)双号同根、同编号同团归并；另一个摸鱼名字不近、编号不同，先不强合。两个猫名中文头衔也不同，不仅凭cat词合人。[Az](atlantis-zs.md)内环称呼及收藏、[Monicadede](monicadede.md)转引六竹的话均已归档；不由内环名片认高层，不由他人台词认保存者本人经历。

六竹篇按被转引的吐槽补进个人印象段，保留两层署名、不写真实感情经过或精神状态。普通DC一天换团撤出黑料、事实留素材；ESS只据公开介绍写教学红料，不声称读视频。原KB、A1、H-PA29与全部他人评语保留，统计不写成开船次数。

Navigators Union第24—45后续已读，见下文；这些是该团历史名片，不是该团前50、九月人物调查或全员故事完成。

2026-10-17离线按当前人物目录的收录号ID补齐19个既有人物的过时收录标记，共305条记录现明确标对应；未新增人物、未刷新名片、未扩充原榜，也未借常见别名推新同人。原头衔／简介核读事实保留，旧“未收录”资格状态不再沿用。

2026-10-17 Navigators Union续批：从第24—33起，逐批最多10人；缺失名片、必要身份补查及人物快照共上限30请求，复用成功缓存，不自动追加预算，不读影像／字幕／音轨。

### Navigators Union第24至45名与老实成文（2026-10-17）

第24—33、34—43、44—45完整名片分批已读，新22次角色ESI；老实正式快照6请求，newcat解析名字及完整名片2请求，共30次，未自动追加预算。优先完成明确公开教学作品，后五名留下一批，不把前45称前50完成。

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 24 | LOL-boom／2116573047 | 房子小#56756；四族无畏打油诗、回文诗及字画／长须鲸收藏，不认原创或具体会战／指挥 |
| 25 | Crazy Sharks／2113480038 | 疯狂小鲨鱼#73675；近名同头衔同当前团归Crazy little sharks，空简介不补故事 |
| 26 | Aslantic Ops／2124350320 | Az#54192（内环成员）；同编号同团归ATLantis ZS小号，默认简介未补实际职责 |
| 27 | Bra bear／2119036692 | 奶嘴熊#26368；广播／总览，无独立事件／职责 |
| 28 | shialen Akiga／97029900 | 白桦#72933；简介空，职责／故事待补 |
| 29 | XIAN915／2122241170 | 政贤#1330；常规／旗舰收藏及欧服首杀AT自署，未核本人参与／全服首杀，不只凭收藏立传 |
| 30 | fanms An／2115770922 | 大树；当前混沌，I AM INEVITABLE文案，不认真实事件／职责 |
| 31 | beichuang233／2116369676 | 悲怆#67418；总览／称呼／给点入口，未有具体交易或人物事件 |
| 32 | TaihangHistory／2124279433 | 宇宙#11037；与JL-Yuzhou同编号同团归组，默认简介 |
| 33 | jack zqls／2115957999 | zql早起了#34314；简介空，职责／故事待补 |
| 34 | Tiger WRC／2119565866 | 飞奔#59359；与Monicadede同编号同团归组，生活格言不作人物事件 |
| 35 | newdog catch／2112603797 | 马巴奥；小妖收录号，复国诗和收货号沿原传；newcat catch已核同人，错字误判已更正 |
| 36 | Na2SiO3／2119780455 | 龙夏存#84118；与longxiacun同头衔同团归组，硅酸钠无害文案非实际事件 |
| 37 | Sextant IV／2112111572 | 有话未曾讲#65188；LP收购、OSY社区及攻略工具入口，无具体经营／管理职责或事件 |
| 38 | LentoZero／2121410226 | 加利西亚#00700（狼心守望者）；同编号同团归加利西亚小号，格言不作真实背叛事 |
| 39 | Snowlyhz／2116861785 | 烛安#45649；抒情、工具与KM收藏，无独立事件／职责 |
| 40 | SilverMoon Pope／2115060237 | 银月教皇#89978；字画、QA物品／总览／KM收藏，不认QA身份或实际指挥 |
| 41 | LeaMan／2118234078 | 柠檬#65733；任务路线、字画与总览，不因半名并谨言慎行等角色 |
| 42 | Fargone McStra／91787471 | 老实#57068；本人公开整理11套燃烧配装及操作／测试说明已读，按教学作品成文，不宣称全部原创或实飞效果 |
| 43 | TaihangYuzhou／2124277346 | 宇宙#11037；同Taihang系列、同编号同团归宇宙三号组，默认简介 |
| 44 | Xing lang Z／2121423915 | 星狼#04247；当前98827799，建筑管理频道、总览和KM收藏，不认建筑管理员或新战役 |
| 45 | cold rain TT／2114078284 | 冷雨#09379；单句对喷文案，无具体互动事件，不凭一句粗口加严重辱骂标签 |

[疯狂小鲨鱼](crazy-little-sharks.md)、[Az](atlantis-zs.md)、[宇宙](yuzhou-11037.md)、[飞奔](monicadede.md)、[龙夏存](longxiacun.md)、[加利西亚](../../src/people/galician0/materials-galician0.md)六组补同人；同编号同团为依据，不相加逐号KB，也不凭内环、文案或物品名补管理／FC职责。

[老实素材](../../src/people/fargone-mcstra/materials-fargone-mcstra.md)与列传已完成，九正式、两测试版配装和具体操作说明作为本人公开整理／教学内容；抄字按本人自嘲叙述，不说独立原创、真实侵权或已验证当前版本效果。当前N-V-U／FRT按正式快照。

[小妖素材](../../src/people/newdog-catch/materials-newdog-catch.md)补newcat catch／2112627820，同奥巴马称呼同创世且本人指定收货号，直接归小号；旧错字笑话已纠正。原FC／斥候经历、KB、Atioth与北方战役保留，补小号拿超旗损失调侃资历的原话；不由这句造新船损、角色指挥或主小号累计。不是新增一个自然人或给收货号虚构历史榜名次。

该续批现已完成，见下文Navigators Union收尾与兔飞前26名；其他普通候选继续沿实际职责／具体事件补，不靠诗文、收藏、报价或总览强凑列传。

### Navigators Union收尾与兔飞前26名（2026-10-17）

Navigators Union第46—50及兔飞第1—10、11—20、21—26完整名片分批已读，29次新ESI、2份旧缓存（渡河16日、非物14日）。预算上限30，未继续扩批或转查普通战果；50与26只指历史榜名片覆盖，九月榜个人调查及故事仍未完成。

#### Navigators Union第46—50名

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 46 | Xcorleone／2118631643 | 八爷#03232；雷电与炼狱格言、巴盖斯及特里斯坦收藏，不认文学原创或本人参战 |
| 47 | Jay Judy／2114250451 | 温克罗德#57678；英文调侃及Judy落款，无独立事件／实际职责 |
| 48 | XiyeJDG／2120547893 | 兮夜#88439；广播、PLA总览与龙鸟收藏，沛川精英小队为频道入口，不认实际指挥 |
| 49 | lol-booom／2116651131 | 房子小#56756；同LOL-boom近名同编号同当前团归双号，矿石分级表与字画不认原创教学 |
| 50 | HYHduhe／2121490491 | 渡河#43019；复用16日名片，CCP太空舱收藏，不认本人击杀或官方身份 |

#### 兔飞第1—26名

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 1 | YDmercer／2118981963 | 你好朋友；QAQ，无独立事件／职责 |
| 2 | Zhao-Jian-Guo／2115652382 | 赵建国；自列七条长须鲸损失入口及三句修仙调侃；沿已有本人线索，不当七次独立人物故事 |
| 3 | YM sakura／2116369488 | 飞飞；已有CEO列传，萌新小Sakura自称沿原传 |
| 4 | Sakanaaaa／2120647491 | 鱼鱼；深空鱼漫游手册实际为总览预设，非已读攻略文章，不认原创作者 |
| 5 | Iivo Virpio／2120902383 | 精神小伙の仿生人；与suraka同团、头衔明确指主人且同suraka自设入口，归本人双号，QA物品不认测试员 |
| 6 | Red Sun2022／2116344108 | 六色；简介空，职责／故事待补 |
| 7 | sena123／2118717687 | 乱套；火力、后勤与传电广播，无独立事件／职责 |
| 8 | CXKOLG／2117185800 | 飞飞の仿生人；同已确认系列的完整个性头衔、同兔飞归飞飞；后勤首KM为自述，泰坦／冥府收藏待核参与 |
| 9 | xiao shui／2119496334 | 无头衔；当前非玩家军团，仅广播，不把历史榜当现任兔飞成员 |
| 10 | Corlos M Constantine／2121413619 | 卡洛斯的仿生人；当前98626718，抗性、感应器、植入体用途表及广播，不认原创或管理 |
| 11 | Weavers Uers／2122669144 | 火只；普通船损、星城收藏、首旗舰KM自署及估价工具，不仅凭战果集合立传 |
| 12 | fatbird11／2121523075 | 小燕子；收藏北极星、星城与舰娘入口，不认官方身份；与fatbird14近名且主人称呼同团归双号 |
| 13 | tuzifei001／2120091139 | 飞飞の仿生人；已有飞飞小号tuzifei001，默认介绍不写世界观 |
| 14 | yuhang55／2119806899 | 雨杭；当前98556933，自称后勤驾驶员、反TIDI及利夫／使徒损失收藏，非FC证据 |
| 15 | hua hua hua／2120184051 | 无头衔；当前98720295，空简介，不凭花花重名并已有同人 |
| 16 | COCO MILK／2121139867 | 大树；当前混沌，I AM PROVIDENCE；与fanms An仅常见头衔相同，英文文案不同，不在缺更多桥梁时并人 |
| 17 | Liu-Kang-Mei／2115768686 | 无头衔；当前98831820，古诗不当本人原创或战役自述 |
| 18 | Li BaTian／2115368163 | 霸天；广播、LP／深渊／工业／矿价／运输工具索引，未有实际经营或管理事件 |
| 19 | KaoLengmian／2122754474 | 烤冷面；简介空，职责／故事待补 |
| 20 | fatbird14／2122111689 | 小燕子の仿生人；同fatbird11近名／主人称呼同兔飞归双号，默认介绍不作经历 |
| 21 | JFK LOL／2120847133 | 非物，战斗总监；复用14日名片与已有列传，不重复建总监人物，远征广告沿本人素材 |
| 22 | Nekkakainen Isula Penken／2120417063 | 饭饭；默认介绍，职责／故事待补 |
| 23 | kevinyyya／2121189697 | 凯文；当前98529628，监视者与无畏收藏不认本人驾驶Monitor／FC |
| 24 | Raskiainen Appas Yotosala／2122767179 | 56；本人帕拉丁损失收藏与Chris Harbour CHN角色入口，不由分享直接认同人 |
| 25 | suraka／2120743274 | 精神小伙；本人suraka自设及外来总览、远征等级入口，与Iivo Virpio归双号，不认所有总览原创 |
| 26 | ocu9idear／2116322604 | Lonの仿生人；救世收藏、总览与估价工具，主人Lon角色待对，不凭仿生人称呼认飞飞 |

[房子小](lol-boom.md)、[小燕子](fatbird11.md)、[精神小伙](suraka.md)三组同人已归档；[飞飞](../../src/people/ym-sakura/materials-ym-sakura.md)补CXKOLG，原有编号系列不重建人物。赵建国长须鲸收藏与修仙自嘲归[本人线索](zhao-jian-guo.md)，不把收藏条数替代独立人物事件。小水当前非玩家军团，其他人当前军团各以本次ESI记录为准，不将历史榜名册当现任兔飞名单。

深空鱼漫游手册为overviewPreset，并非外部教学文；精神小伙主号的suraka自设同样属于总览入口，未读其具体预设内容或作品互动，不因带“手册／自设”便立传。Lon主人尚未对上，卡洛斯与常见大树称呼继续待具体桥梁；不把所有仿生人都并给飞飞。

兔飞第27—50及Faceless前十已续读，见下文；优先看中文头衔、实际职责、作者入口与具体事件，保留既有失败／排除记录，不读影像、音轨、字幕。2022年一月活跃表仍独立归档，不与历史榜或九月榜相混。

### 兔飞第27至50名与Faceless前十（2026-10-17）

完整名片：兔飞第27—36、37—46、47—50及Faceless前十，34份中28份新ESI、6份复用13／14日缓存；另1次ESI核颂词作者Kyousuke7，共29请求，上限30，没有追加。兔飞前50及Faceless前十为历史榜名片阅读，不代表九月个人调查或故事全收齐。

#### 兔飞第27—50名

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 27 | BK0717／2119616016 | BK；当前98799349，虫洞／Turnur／扎尔扎克路线、收费站频道及BR655b637399730f044eba04e5；收藏不认实际参战或经营收费站 |
| 28 | Eat oranges／2122086437 | 夜空；英文蝴蝶自述及外来总览个人修改版，无独立社区事件／作品互动 |
| 29 | Daft Eullon／2115155689 | 摸摸；小八配装与保护船的文案、广播，无独立事件／职责 |
| 30 | Yashkambim Cansh Noud／2122694243 | YA；建筑与回收服务入口、Vidmak收藏，不认本人经营或建筑管理 |
| 31 | Vagabond TT／2115041623 | 神话の仿生人；已有神话小号Vagabond TT，任务／虫洞／远征表与自用总览，保留本人旧债务故事 |
| 32 | X Wanzi／2122499269 | 丸子；默认简介，职责／故事待补 |
| 33 | indefinitely／2117874977 | 无头衔；当前非玩家军团，童话文案与Laelaps收藏不足独立故事 |
| 34 | ikun00／2122136359 | 梦の仿生人；与ikun000近名、主人称呼同团归双号，四项团队ECM配装入口与伤害提示非完整实测教程 |
| 35 | yoimiya11／2122862410 | 小燕子の仿生人；同fatbird系列个性主人称呼／同兔飞归小燕子第三号，烟花抒情句不认独立事迹 |
| 36 | Kyousuke777／2123179159 | 京介；与Kyousuke7近名同主人头衔同兔飞归双号；估价工具及make by myself未展开具体作品内容 |
| 37 | Fake-End／2118969207 | 李广；简介空，职责／故事待补 |
| 38 | jingluo／2118730741 | 欧鹏；长篇爱莉希雅文娱剧情介绍，不挪成EVE人物经历 |
| 39 | Barbecue camels／2122502799 | 烧烤の仿生人；扫描、LP、合同、深渊、工业、矿价及运输工具，主人准确角色待对 |
| 40 | Roccano／92005020 | 无头衔；复用14日名片，当前非玩家军团，总览广播及LP／辟邪出售，无具体成交或角色职责 |
| 41 | WuMinPPP／2123131125 | 葭九；默认简介，职责／故事待补 |
| 42 | Yudeqiannn／2120189814 | 于德谦；二战老兵文案、宗教语句、字画与KM收藏，不推现实年龄／身份；角色互链不直接认同人 |
| 43 | BT0925／2121150646 | BT；简介空，职责／故事待补 |
| 44 | RoninrN13／2121452673 | 肉；虫洞及物流工具、收货号2121310358入口；改善EVE实际链接退出游戏按钮，不当教程 |
| 45 | hhdd88／2117315164 | hhdd88；退出游戏与打开钱包按钮玩笑、N老板挑衅及Monitor收藏，沿AOM既有线索，不把收藏当本人击杀 |
| 46 | ikun000／2122018023 | 梦；同ikun00近名、主人称呼同兔飞归双号，深空鱼手册为总览预设 |
| 47 | Fehnabre Amat Puhkastu／2122774798 | 树叶；70M收摄魂／24小时上线打钱广告、旗舰与CCP收藏、抗性远征对应表，无实际成交／指挥证据 |
| 48 | tyouki01／2121614283 | 张张；总览、估价与扫描工具，黑豹超载输出文案及无畏收藏，不由自嘲推实战贡献或事故责任 |
| 49 | Magic Spell／2118936868 | 泽瑞；当前98550682，简介空，职责／故事待补 |
| 50 | tuzifei003／2120093703 | 飞飞の仿生人；已对应飞飞小号tuzifei003，默认介绍不作世界观经历 |

#### Faceless前十

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 1 | Rainight kurumi／2117046673 | 无头衔；复用13日名片，现非玩家军团，泰坦收藏三KM已核攻击者，沿既有线索，不把TT没了写成本人泰坦损失 |
| 2 | Soy sauce No／2118118124 | 酱油；复用13日名片，默认简介，职责／故事待补 |
| 3 | coo en Cedoulain／2114463130 | 系欧欧；复用13日名片，总览与广播，无独立事件／实际职责 |
| 4 | Qiya Hei／2115982590 | 神奇黑旗，联盟FC；复用13日名片及已有FC短传，公开招新沿本人素材 |
| 5 | Andromeda XU／2115426304 | 老徐；当前B.O.P，Tree From Andromeda短句，无独立事件／职责 |
| 6 | Fadek Windy／2115325695 | 随风；已归联盟主事者随风小号Fadek Windy，招新福利不重复建传 |
| 7 | Kar Erkkinen／92392376 | 烟火黑；简介空，职责／故事待补 |
| 8 | Pyrion Flax／751405489 | 快乐小超人；当前98833988，简介空，不能凭Pyrion Flax同名套别的公众人物 |
| 9 | Fan Tuan Tuan／2118880203 | 饭团团；复用14日B.O.P名片，出师表为诸葛亮原文，非本人创作 |
| 10 | Dr3twa／1629866259 | 那个光头男人；英文歌词，不作本人作品或现实外貌评价 |

[梦](ikun000.md)、[京介](kyousuke777.md)双号已归档，[小燕子](fatbird11.md)增第三号。神话／飞飞／随风已有小号不重建人物；京介的颂词及第一次无畏KM身份补回[飞飞素材](../../src/people/ym-sakura/materials-ym-sakura.md)与原红料块，不从感谢信推飞飞主动让人头或要求个人崇拜。

hhdd88沿[AOM既有线索](aom-monthly-2021-09.md#2026-10-17hhdd88名片入口复核)补退出游戏／钱包按钮的链接性质，Monitor收藏未读原始参与，不添本人旗舰战果。[Rainight](rainight-kurumi.md)三条已成功核读KM仍复用，不再把“TT没了”归其本人损失。其他文娱剧情、古文、宗教语句及默认世界观均不改写成角色本人的现实身份或游戏经历。

Faceless第11—36已续读25份，第24名ESI404，见下文；复用已有名片与列传，优先实际职责、具体事件及作者入口；旧名片日期与本次归档日期分开。2022年一月活跃表继续独立处理，不读视频、音轨、字幕。

### Faceless第11至36名与小小苏成文（2026-10-17）

第11—20、21—30、31—36分批核读，26名取得25份完整名片，第24名Wangzha角色ESI404（未重试、未推删号原因）。本批20次角色ESI含该404，复用6份13／14日缓存；小小苏关键词2次、官方论坛全文1次、标准快照6次，共29请求，上限30。第22名tinggo在首个脚本中成功保存、恢复时复用，仍计一次新请求；成功名片不重取。首个临时脚本遇404退出，修为复用缓存并保留该缺口后继续；未以失败当不存在。

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 11 | TricK Dexter／161529106 | 大萝卜；路过者多语文案、字画及starslave战果收藏，与RobertK Neville同中文头衔同团归双号 |
| 12 | Ventus ZhongLi／2119086999 | 钟离尘风，钟离财团创始人；复用13日完整名片，已有联盟管理与译稿列传，生日字样不存现实年龄 |
| 13 | Azure bluesky／2114644820 | 天兵，军团首席菜鸡.团灭之星；已有CEO／FC与钢羽故事，不把自嘲当新事故 |
| 14 | chu meng／2116299695 | 初梦；复用14日Fox名片及已有故事线索，战果收藏不认新事件 |
| 15 | ZZZ KKKXXX／2113127318 | 余声；本人伊什塔／太空舱／希尔博拉斯损失收藏与字画，不把普通船损独立立传 |
| 16 | CPwind／2118781235 | 无头衔；当前非玩家军团，首次休津／大航KM、2022旗舰与建筑签名自述留存，未核具体原始参与 |
| 17 | snkbod／2118139417 | 空空如也；snkbod总览与外来总览分享，具体创作／作品互动与职责待查 |
| 18 | JiaShen Yangg／2118018631 | 珅（钟离替身，括号否认）；复用14日主号名片，已有联盟外交管理列传，台词与Laelaps收藏沿本人素材 |
| 19 | RobertK Neville／94605820 | 大萝卜；同TricK Dexter中文称呼同当前无面者归双号，乔丹语录不认本人原创 |
| 20 | fpsless Guo／2114750098 | 小小苏，CFO；公开自报财务负责人、当前Fox，按重要管理短篇；角色市场26B报价已核，不指定CFO所属组织或任期 |
| 21 | Tisiphone ALCESS／2115564526 | 悲叹之星；复用14日名片及九条已核KM，不重查幸运击杀榜或据最后一击认FC |
| 22 | tinggo／2119750000 | TG；完整名片已读，当前银雾龙骑98613748、简介空，职责／故事待补 |
| 23 | KAT Candy／2115160005 | 糖果猫；同Candy DOG双号归组已在九月线索，EE Logistics报价广告不认本人经营物流或法尔小号 |
| 24 | Wangzha／2115161793 | ESI404；2026-10-17角色接口缺名片，不写删号原因／头衔；其他名片成功后续读 |
| 25 | mai shoushou／2115186880 | 卖手手；已收录作者／FC，当前钢羽98617103，军团多项戏谑菜单不单独造事故 |
| 26 | StarsX／2117051150 | 无头衔；当前非玩家军团，总览与月卡价格入口，不认实际成交或现实交易 |
| 27 | Wilson Vic／2115685711 | 空城；仅联系方式，不保存现实账号，不凭普通称呼合并其他人 |
| 28 | Mnemosyne888／167133199 | 无头衔；简介空，职责／故事待补 |
| 29 | Mature vinegar No-2／2119102346 | 酱油；与Soy sauce No同中文头衔同团，调味品词根及No命名相合归双号，默认介绍不作经历 |
| 30 | KD Hsueh／2119399734 | Kelly；简介空，职责／故事待补 |
| 31 | Candy DOG／2115188259 | 糖果猫；复用14日名片，Candy DOG与KAT Candy既有双号组，不算本轮首次认人 |
| 32 | m yj11／2116148497 | 大泡泡；广播、虫洞／属性技能／任务掉落通用表，无本人署名创作互动或独立事故 |
| 33 | CabbageTimil／2116041057 | 白菜；已收录CabbageTimil，EVE PARTNER与B站279635057／YouTube入口沿本人素材，非小白菜Cabbage66 |
| 34 | Captain Thor／2112826041 | 雷神；简介空，职责／故事待补 |
| 35 | Hurry CHINA／2115891977 | 无头衔；当前非玩家军团，抗性／反跳怪／远征通用说明，不将通用表当独立作品或本人事件 |
| 36 | howcoolisit／2117147603 | 几度；对JJ SoulMate等人的辱骂配文与舰船收藏、洛基高手自许、掉线元帅说法；只有收藏和片段，未核具体故事／责任 |

[小小苏素材](../../src/people/fpsless-guo/materials-fpsless-guo.md)与短篇已完成，以公开自报CFO这一重要管理身份收录；官方市场26B竞价是正文场景，未以普通买号／战果收藏单独凑门槛。头衔没写所属组织及任期，正文不擅称Fox或无面者财务总监；当前FOXOR／NC按正式快照。成交的是另一位买家的26.5B，不把出售角色归小小苏小号，也不造钱款亏空或成交失败黑料。

[大萝卜](da-luobo.md)、[酱油](soy-sauce-no.md)双号归档；[糖果猫及悲叹之星](dok-monthly-people-2026-10-14.md)沿既有完整归档，不冒称新同人或重读九KM。[白菜](../../src/people/cabbagetimil/materials-cabbagetimil.md)、天兵、钟离、珅与卖手已有传，保留原角色故事；普通首舰KM、通用表、角色链接与自嘲不自动认新事故、教师／管理或同人。

Faceless第37—50已补读，见下文；前50实际49份名片、第24号仍为显式缺口。九月个体故事与其余队列继续保留。2022年一月活跃表独立归档，不与当前ESI或历史榜混同；影像、音轨、字幕未读。

### Faceless收尾与Dawns LightP前十（2026-10-17）

Faceless第37—46、47—50与Dawn’s LightP前十完整名片分批已读，新23次ESI、白菜小号复用12日缓存1份；老魏标准快照6请求，共29次，上限30，未继续扩批。Faceless前50实际读49份，第24名Wangzha的既有404仍保留，没有重试或按失败推删号；Dawn’s LightP只是历史前十，不代表当前成员／九月个人调查完成。

#### Faceless第37—50名

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 37 | lanka TRUMP／2115189906 | 无头衔；当前非玩家军团，简介空，不凭TRUMP名字认其他人物 |
| 38 | junshengfuxi／2120219685 | 鲸落，元气少女果冻妹妹；特殊舰船配装／物品及CCP Dren收藏，不认实际驾驶／官方身份，不与跨团鲸落并人 |
| 39 | XIAO WAN WAN／2119051502 | 小万万；火力／后勤广播与总览，没有具体职责／独立事件 |
| 40 | xiaoxiaohualuo／2121192104 | 潇潇桦落；懒得写，无独立事件／职责 |
| 41 | xuelian Lin／2115157211 | 林；政治理论文本引用，不据此认现实政治身份／军团管理或本人原创 |
| 42 | Crea1ure／2116699191 | 木木三；同中文外号同DC社区归dear mumusan小号，曹操155—220 B.C落款笔误已补原传，不认英文译文原创 |
| 43 | From the sky／2122531853 | 猫娘猫猫；好朋友FENTOU收藏、对FRT文案与舰船／星城收藏，总览抗性表不认实际FC或他盟猫娘 |
| 44 | Mature vinegar No-4／2119102517 | 酱油；同Mature vinegar No-2系列同头衔同团归第三号，默认介绍不作经历 |
| 45 | Purple Iris／2118294915 | 9527梦；当前BOP，字画、罪恶／马克瑞／GM太空舱收藏，不认GM身份或具体本人事件 |
| 46 | CaiGou CabbageTimil／2116264387 | 白菜；复用12日名片，既有CaiGou CabbageTimil小号与本人平台入口，不重复建传 |
| 47 | Kumiko Tosaka／2116586734 | 御坂；让龙焰再次伟大与罐装知识玩笑，无具体活动／管理依据 |
| 48 | Doge Patrouette／2113085667 | 安玻；当前神农98779710，简介空，职责／故事待补 |
| 49 | AK47 CCTV／2113678561 | 无头衔；当前非玩家军团，自嘲文案与旅行者收藏，不推现实学校／性别或违法事件 |
| 50 | yuan shijieheping／2113239656 | 愿世界和平；双语反战愿望与数字序列，无独立人物故事／实际职责 |

#### Dawn’s LightP前十

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 1 | Z-33H3／2122054135 | 无头衔；当前星城大学98707431，默认简介不作世界观经历 |
| 2 | Prehonel Aynie Stetille／2122529211 | 老辛；当前混沌98598862，默认简介，职责／故事待补 |
| 3 | yu le／2122668203 | 老魏，FC；当前宝宝巴士98777401，按本人自报FC成文；预警指南只读本人分享标题，OGC冠军按本人自称 |
| 4 | Misguider zheng／2122309682 | 误导者；当前混沌，自称萌新不当管理或具体翻车 |
| 5 | Tench TTTSAI／2113305888 | 放血；当前混沌，in and out短句，无独立事件／职责 |
| 6 | charon1／2119928531 | 大傻春-牧星6班-班主任-达达；CEO charon1已对应王答答，不因班主任头衔重复建传或撤原CEO依据 |
| 7 | Shadow Warrior85／2117610404 | 低吟；简介There is nothing here，无独立事件／实际职责 |
| 8 | Ichie Poljus／2123185557 | 无头衔；当前非玩家军团，荤段子与字画／广播不作独立人物事件 |
| 9 | SoupOnly／2123302409 | 韩立；天南第一剑修文娱称号、EVE-Scout及星城／加姆／使徒收藏，不认本人全部参与或指挥 |
| 10 | GainBoast40／2114511679 | 欧欧；简介空，职责／故事待补 |

[老魏素材](../../src/people/yu-le/materials-yu-le.md)与FC短篇已完成，当前B.Y.B／D.C依正式快照；OGC冠军按本人自称，不补赛事全称／规则／年月或胜负，预警指南只是本人分享标题，不当本人原创教学。charon1既有王答答身份与CEO记录复用，不因班主任头衔另起一篇。

[木木三素材](../../src/people/mumusan/materials-mumusan.md)补Crea1ure，同中文外号同DC语境归小号；两号当前分别无面者／BOP，不写成同团，不换收录号或加总KB。曹操落款的B.C笔误补原传轻黑料，旧招新、赔钱卖无畏、管理风波、综合KB与会战均保留。[酱油](soy-sauce-no.md)补Mature vinegar No-4为第三号，不冒称编号系列齐全。猫娘、鲸落等常见外号不跨团套给其他人物。

Dawn’s LightP第11—40后续已读，见下文；其余故事／职责、九月个体与2022一月任期仍在原队列，不以名片覆盖代替全部完成。影像、音轨、字幕未读。

### Dawns LightP第11至40名与同人归档（2026-10-17）

第11—20、21—30、31—40完整名片分批核读，30次新ESI达到本批上限30；另复用15日hlen名片补同人。未再打开B站、查KM或取新快照，入口已归档待下一批，未把预算停点当成作品质量不足。本批没有新增列传，四组同人和具体作者／职责入口仍为实际增量。前40为历史榜名片，不是当前团员或九月个体故事完成。

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 11 | Tegi Nakrar／2123194272 | 村口头号杀猪佬；当前98812288，英文海盗赎金模板含占位符与虚构要求，不当真实勒索／海盗职务或本人独立事件 |
| 12 | holi sily／2115502909 | 阿尔卑斯山；简介空，职责／故事待补 |
| 13 | ChiYan／2121623978 | 无头衔；当前98811170，简介--，职责／故事待补 |
| 14 | TempestUdf／2123068426 | 0845 儿子；polapo奥鸟等收藏与本人贴出的B站631118682入口；主页未读，不推现实家庭或已确认UP |
| 15 | XTiger256／2123454108 | 长文白；同XTiger258系列同头衔同当前98825114归双号，普通狂暴损失不立传 |
| 16 | Samarkanda／96204081 | 泰山 军团；烟花甚美不过瞬间文案，军团两字不认重要管理／FC |
| 17 | MoMian／2121623991 | 无头衔；当前98811170，CCP Lumi雷裔收藏，未核本人参与，不认官方身份 |
| 18 | Altria P／2122713650 | 柿子#26237；当前特执98540583，民不可轻格言，无具体管理／人物故事 |
| 19 | Ex-KF Ex-KF／2115461883 | 白凝；与hlen及后续三号同头衔同团归五号组，总览工具不认原创教学 |
| 20 | XTiger258／2123407411 | 长文白；同XTiger数字系列／同当前团归双号，GM与普通舰收藏不认官方身份或职责 |
| 21 | pluviophy／2123881349 | 破风 六班；默认介绍，六班不认班主任或实际管理职责 |
| 22 | Frozenstein／2123456542 | 9527；简介空，不以常见数字称呼并9527梦等角色 |
| 23 | A Speculum／94262190 | 无头衔；当前98840731，GECL火力／后勤广播，无独立事件／职责 |
| 24 | Panthera America／2115839196 | @；总览与广播，@通用符号不作跨号归属依据 |
| 25 | Lova 8899／2122318173 | 萌萌；新手教程指B站31544583、广播入门BV1D79vYdEmE，本批未打开，不把分享者当作者；个人总览与GM收藏待具体故事 |
| 26 | BOSSXRPG／2122368655 | 无头衔；当前非玩家军团，CCP太空舱／铭牌及无畏收藏，无独立人物事件／职责 |
| 27 | General TAnk／2113898124 | 坦克；当前98777557，多语萌新自嘲与和平文案，不据此推现实身份或能力 |
| 28 | Baocang／2122781669 | 白凝；同中文头衔同Dawn’s LightP归五号组，恶狼收藏不认指挥／全部参与 |
| 29 | Misguider Black／2123042985 | 误导者；同Misguider系列／同当前混沌归双号，默认文案不作经历 |
| 30 | CN luo yu／2122772581 | 无头衔；简介自署洛羽，无独立事件／职责 |
| 31 | yingkong／2122681921 | 阴空；同yingkong2近名编号／同头衔同混沌归双号，简介空 |
| 32 | ONETC／2123142334 | 无头衔；当前非玩家军团，卫队总览／教皇自用预设名不认本人是教皇或原创作者 |
| 33 | super star book／2123275651 | 梦宇-牧星6班-初级-达达；卫队总览与ww专属入口，班级末尾达达沿现有王答答方向，不认本号管理职责 |
| 34 | yingkong2／2122721996 | 阴空；同yingkong编号／同当前混沌归双号，偏远屏障短句无事件 |
| 35 | Yue Ban Z／2123101891 | 月半-牧星5班-初级-误导；有误导者带教／联系人方向，字段未释义，不直接认班主任或归本人小号 |
| 36 | DaBingJiaYiQie／2122657553 | 大饼；当前混沌，奥苏斯收藏无具体本人事件／职责 |
| 37 | qbnipabupa3／2122781750 | 白凝；同头衔同团归五号组，默认介绍不作经历 |
| 38 | onepig0022／2122781536 | 白凝；同头衔同团归五号组，默认介绍不作经历 |
| 39 | Romaneeconti／2122751769 | 蝎子AFK；自称2024军团十大杰出人物／特殊贡献成员、反击所有来犯军团宣言及旗舰／普通舰收藏，实际贡献／管理分工待补 |
| 40 | NICOLE MOTHER／2119469763 | @；虫洞信号、出口书签、洞口分级／编号／质量寿命／极化通用说明，未识别本人原创或作品互动，不凭@并Panthera |

[长文白](xtiger256.md)、[误导者](misguider-zheng.md)、[阴空](yingkong.md)各双号；[白凝](bai-ning.md)五号同中文头衔／同当前团归组，复仇与矿队名单只保存本人标签和角色入口，未取得具体争执、原言论或战斗，未认全部名单为本人小号。学员名片末尾误导／达达与班号、初级的对应格式保留，实际带教分工继续查，不仅凭成员名片便给误导者补班主任头衔。

[TempestUdf](tempestudf.md)本人贴B站631118682；[萌萌](lova-8899.md)分享31544583主页与BV1D79vYdEmE。均保留确定URL供直读，本批未开主页／作品，不在总表提前登记为已确认UP，不把教程分享认成本人创作。Tegi的海盗文案明确有占位符，要求一万颗椰子、十桶82年朗姆、海盗表情包和辣条，另开价十亿金币、威胁放出连续骂72小时的鹦鹉，落款Blindeye Jerry／Pasture Star No.1二副；保留为模板玩笑，不当真实勒索、入账或军团岗位。Romaneeconti自称十大杰出人物，贡献未展开，不拿奖项自述代替管理工作。

该续批已完成，见下文Dawn’s LightP收尾与AOCAL前十；确定UP入口按实际公开文字另查，影像、音轨、字幕不读。2022年一月活跃表与2026九月／历史榜分开。

### Dawns LightP收尾与AOCAL前十（2026-10-17）

Dawn’s LightP第41—50与AOCAL前十完整名片分批核读，19次新ESI、陆三千复用14日缓存1份。两张B站资料卡与4个公开空间导航已读，含可能匿名引导的预留后本轮≤29次／导航，上限30；未再打开具体视频页、翻评论或取新人物快照。没有新列传，白凝两新号及两个已识别账号名的入口是新增归档。

#### Dawn’s LightP第41—50名

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 41 | CV coin／2122852486 | 本质AFK；默认介绍，AFK自称不当普通船损或职务依据 |
| 42 | microplumage／2122815675 | 无头衔；当前非玩家军团，简介空，职责／故事待补 |
| 43 | James Regans／2116587466 | 军团；字画，军团二字不认CEO／重要管理 |
| 44 | zheng white／2114204689 | 大白；当前98825114，越南语冷面杀手文案，不作真实暴力或社区事件 |
| 45 | Lu3000／2122953406 | 陆三千；复用14日昆仑名片，CCP／纪念碑收藏及半血王子文案，不推本人参与或原创 |
| 46 | onepig0033／2122781546 | 白凝；同onepig编号同头衔同团归第六号，默认介绍不作经历 |
| 47 | WGRY／2120794344 | 无头衔；当前98814317，默认介绍，职责／故事待补 |
| 48 | yd1008611／2122784036 | 白凝；同头衔同团归第七号，默认介绍不作经历 |
| 49 | Bel'veth／2120090057 | 维斯；O.o表情复读，无独立人物事件／职责 |
| 50 | EvilDemon25／2123415335 | 恶鬼；当前混沌98598862，字画／广播／凛冬总览框架，不作独立作品或FC |

#### AOCAL前十

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 1 | Napoleon Codie／2113235803 | 毛蛋王纸等头衔；已有AOCAL CEO／FC列传，人数钱数表单位用途不明已归本人素材，不重建人物 |
| 2 | sown 001／2113741413 | 猫先生；会战视角实际为overviewPreset总览，不是战斗视频或指挥经历，其他广播／预设待具体故事 |
| 3 | lizia lizia／2114969932 | 立子；当前98732722，三种旗舰名称／通用抗性表与频道，不认实际驾驶或本人创作 |
| 4 | Tush Aak／2120607124 | 吉普；默认介绍与广播，无独立事件／实际职责 |
| 5 | untheshadow／2114371268 | 天堂角落；总览与火力／后勤广播，无独立人物事件／职责 |
| 6 | wuya Ornulf／2114660222 | 无头衔；当前98732722，旗舰物品入口、通用抗性表与燃烧TEAM伤害提示，未识别本人教学互动或职责 |
| 7 | Gateraus／2113367034 | 雷电；NoNo Never Feed及天空纸条常规FC总览是共享预设，不认本人为NoNo／纸条或FC |
| 8 | young Acami／91609641 | 星光；通用抗性表与Eon火力广播，不认实际任职或原创，不凭常见外号并其他星光 |
| 9 | killyouall NOW／2114215513 | 无头衔；当前98806403，铁壁／CCP太空舱与寡妇收藏，未核本人参与／实际职责 |
| 10 | XiGuan Allas-Rui／2114524679 | 吸管；自嘲索要太空舱文案，无具体对象、独立事件／指挥依据 |

[白凝](bai-ning.md)现对应七号，所有号统计仍分开；[毛蛋](../../src/people/napoleon-codie/materials-napoleon-codie.md)沿已有CEO／FC身份，人数钱数表只归档，不造税款或分账用途。sown 001的会战视角、Gateraus的FC总览均核为预设，未把蓝字标题认成作品或指挥。

[TempestUdf入口](tempestudf.md)对应账号名EVE牧星军团631118682，[Lova分享入口](lova-8899.md)对应EVE老头乐31544583；两账号已补B站总表候选，未给分享者补个人UP标签。最新首屏分别12／42视频标题已读，资料卡／空间计数差另记，卡片第二计数未当评论数。两组order=click地址与最新页返回相同顺序，最多播放没有实际切换，不称已完成两排序；合集、作品简介及评论未读，标题候选不等于作品推荐或真实泄密／战果。

此续批已完成，见下文AOCAL第11—20名与牧星评论入文；两账号操作者仍待对应。普通角色具体职责／故事、九月个人调查与2022年一月历史任期仍在原队列。只读公开文字，影像、音轨、字幕未读。

### AOCAL第11至20名与牧星评论入文（2026-10-17）

本批9次新ESI、银狐复用14日缓存1份；夜灵正式快照6次；两个公开空间导航及各一次实际点击排序共4动作、合集目录2导航、三作品API公开元数据／一页评论各2次，共27请求／导航动作，上限30。没有自动翻评论、作品分页或加预算。

| 历史名次 | 角色／ID | 已读头衔、身份与下一步 |
| --- | --- | --- |
| 11 | xiaotian ORE／2124019653 | 小天；角色背景式种族／血统自述不入正文，无独立人物事件／实际职责 |
| 12 | JBCNM／2120724936 | CMER；当前98679090，五层轨道及无人机／炸弹操作笔记、估价／预设；夹站外成人链接未打开，不认原创或实教互动 |
| 13 | Fiery Kylin／2114106058 | 囚梦；广播、跳桥选项、字画及新人连环提问模板，不把模板当本人某次带队或指挥翻车 |
| 14 | Tofe／2113895481 | 拖肥；总览与星系入口、角色1687651723链接标题Two Asher Elias=One noraus，不认本人是该角色或真实人数／能力换算 |
| 15 | inconceivabl／2114028684 | 银狐#11309；复用14日名片，通用IV任务防效／递减表含异常800007.08860%显示，不当现行装配建议或独立故事 |
| 16 | onthe shadow／2113552028 | 天堂角落 王牌飞行员；同shadow近名同头衔同团归untheshadow双号，王牌按自称不认FC |
| 17 | AK mao／2114582057 | 青稚；简介空，无独立事件／职责 |
| 18 | Cir Benuse／2114871328 | 亱靈，故土FC，总监；当前SARD98540583，按公开自报FC短篇成文，不补某场总指挥或总监具体分工 |
| 19 | bigsurge／2120201457 | 风云；联系人标签、nanyuan11骗子标签及通用资料，未有具体交易／损失，不把单方标签当现实犯罪 |
| 20 | Sistais／2121705499 | 熊二；对喷文案及勒维亚坦收藏，无具体互动事件／指挥依据 |

[夜灵素材](../../src/people/cir-benuse/materials-cir-benuse.md)与短篇已完成，按头衔自报故土FC／总监保留，当前SARD.／FRT按正式快照；不指定实际指挥战役或把英文小队署名认成组织创建记录。[天堂角落](onthe-shadow.md)双号、[银狐](inconceivabl.md)异常任务表、[风云](bigsurge.md)联系人与骗子标签分别归档，普通模板、链接和粗口不补成事件。

两个B站账号已实际点击最多播放并核选中状态，最新／最多首屏及合集目录均有阅读边界。牧星三集合集卡3159与第三集1706分开；旧order=click链接未切换的失败认定保留，未把卡片第二计数当评论数。[第三集的RR／蜜蜂黑名单话题](../sources/muxing-rabbit-tutorial-2026-04.md)8主／9附带回复已读，补王答答与台风原传。EVE老头乐招新12主／8附带、千人会战20主／46附带已归[原账号线索](lova-8899.md)，包括作者自述海盗小队抓掉线鹏鲲；不把别人的会战日期／星系或片段套给他，账号游戏角色仍未对上。

下一批接AOCAL第21—30名；两账号优先找公开游戏角色／中文自报，再沿已读教程、招新、海盗小队经历和作品互动补人物。未读候选不判质量不足，影像、音轨、字幕未读；2022一月活跃表仍独立。
