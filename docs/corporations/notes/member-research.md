> 本页保存迁移前的来源与核读摘记。榜单和共享角色调查统一查询军团档案；旧“前50完成”、收录结论与失败记录仅代表原范围，不覆盖当前人物身份，也不触发刷新或补查。

# 前50军团成员榜反查（2026-10-12）

当前收录状态见[待撰备忘录](../../pending-characters.md)与各人素材；下文取得、核读范围保留，旧成文记录不代表当前仍收录。

逐号查询改用 `npm run corporations -- members <军团ID> --scope all-time`；跨军团角色用 `character <角色ID>`。

## 范围与实际覆盖

名单沿用[九月前50军团](activity-2026-09.md)。本轮在共享冷却结束后补齐余下46家历史榜：**50家all-time人物榜均已取得，共4996条历史名次记录**；49家各前100，Deadspace Spearhead返回96个角色，不把返回不足100记成分页失败。另保存接口近期榜490条，范围不是九月。

合计5486条榜单记录，去重4834个角色；全部名字已经ESI批量解析，按当前收录号、aliases及明确同人素材对照。247个不同角色在TSV明确标为已对应当前列传（对应319条榜单记录），4587个未标为已对应当前列传；这些是角色数，不是去重后真人数。名字对照不等于个人调查完成，逐人结果见[清单](../README.md)。

**首次HTTP批次九月monthly为0/50**：确认公开源码支持`/corporation/<ID>/top/year/2026/month/9/`后，第一张混沌页面即HTTP403；立即停止本轮zKillboard全部请求，没有切换出口、镜像或接口继续取同一数据。此次403不影响此前已经取完的历史响应，但月榜和后续Monitor查询仍有缺口。

历史榜使用统计响应`topAllTime`的character子榜；按返回顺序保留击杀数排名与其军团范围内的参与击杀价值。历史榜不是现役名册，不证明当前军团或管理／指挥职责；不同军团、主小号统计均不直接相加。`topLists`角色榜单独标为`recent`，不冒充2026-09。

口径依据：[API实体统计文档](https://zkillboard.com/api/docs/)；[公开页面控制器](https://github.com/zKillboard/zKillboard/blob/master/view/overview.php)的top分支设角色榜limit=100，并读取year、month。只核对路线，不以源码替代实际月榜数据。

本轮明确续查50团历史榜与九月榜，联网总上限140次，个体核对首批10名；另补已收录人物的3个近名小号与莫凡3条原始KM。历史缺口46请求、月榜1次即403；其余请求为ESI批量认名、角色／KM核对、源码口径与新人物快照。没有继续获取被拦站点的个人KB或Monitor。

后续系统Chrome缓存已取得50家2026-09角色榜；本轮按缓存URL、页面标题及榜单结构回填取得状态。历史TSV仍保留all-time／recent口径，不把月榜条数掺入历史统计；取得页面不等于逐人故事调查完成。 月榜4403行已另存[正式名单](../README.md)，保留返回的全部名次、角色ID、名字与击杀条数，前十以外也可续查，不依赖临时缓存。


## 当前续查重点

大团逐人核读范围扩至前50，优先读取公开头衔、完整简介中的中文称呼、职责和角色互链，再对照已有列传与同人材料。历史榜与月榜各自保留，不混合排名；头衔取得、身份对应和故事入文分别记录。个人船型统计降为有具体指挥或战役线索时的辅助核对，不作为人人必跑项目。

AOM历史人物先沿[2021年9月前100固定名单](aom-2021-09.md)核读前50的身份线索，海哥哥仍需角色对应桥；不把某个单月的缺席当排除。

## 50团覆盖清单

这是本轮50团成员榜的主 ledger。**榜单取得**与**逐人核读**分栏维护；身份对应不等于已找到故事或已入文。

- 50家历史榜与九月榜均已取得，正式名单保留全部返回名次；不是只存前十。
- 混沌、PLA、伏羲、特执、昆仑、创世、KZU、星尘、瑶光、宽带山、帝皇之镰、Dusk、BOP、Fox、叶落星海、红楼、图万神殿、吃瓜、咸鱼、神农：历史榜前50的头衔／简介已核读。
- 采星者与PLA Fleet前50各已读49份名片，分别第33、37名ESI404缺头衔／简介；吃瓜前50、神农前50、Family Guy前50已读；LP两人及创建者兼CEO Cyan nomi已成文，Cosmic-Wanderers前50已读，核弹、花花已成文；GECL前50已读、daoyan yin成文；创世学院前50已读、白给大师补四号，Navigators Union前50已读、老实成文、小妖补newcat；兔飞前50已读、京介颂词补身份；Faceless前50已读49份、第24名ESI404；Dawn’s LightP前50已读，白凝七号归组；Attack On CALDARI前20已读，夜灵按自报FC成文，续21—30；两B站实际最多排序与合集目录已核，操作者待对应，教程评论补王答答／台风，银光／建军互相提名已归档；Fox其他候选继续补教学、赞助与人物事件；其余军团显示实际已登记名次，未核定连续范围的不冒称前十或前50完成。
- 月榜个人调查与历史榜另分范围；本栏不把历史榜前50核读改称九月前50完成。AOM另用[2021年9月ledger](aom-2021-09.md)，前100名单已存、前50名片已核读。

表中“有名片记录”仅表示正式TSV有头衔／简介核读记录；空头衔已读也计入，已有列传但未登记名片的号不自动计入。逐号的成文、待核身份和待补故事见[正式清单](../README.md)所指原队列／人物素材。


| 九月名次 | 军团 / ID | all-time角色榜取得 | 九月monthly角色榜取得 | 历史榜个人核读范围 / 下一步 | 身份对应进度 |
| --- | --- | --- | --- | --- | --- |
| 1 | Chaos arbiter（混沌） / 98598862 | [前100](https://zkillboard.com/api/stats/corporationID/98598862/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98598862/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98598862.md#混沌前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；9个明确对上当前列传 |
| 2 | Peoples Liberation Army（PLA） / 98190062 | [前100](https://zkillboard.com/api/stats/corporationID/98190062/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98190062/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98190062.md#pla前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；7个明确对上当前列传 |
| 3 | Fuxi Legion（伏羲） / 98185110 | [前100](https://zkillboard.com/api/stats/corporationID/98185110/kills/)，2026-10-11 | [已取得前100](https://zkillboard.com/corporation/98185110/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98185110.md#伏羲前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；13个明确对上当前列传 |
| 4 | Special law enforcement department（特执／SARD） / 98540583 | [前100](https://zkillboard.com/api/stats/corporationID/98540583/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98540583/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98540583.md#特执前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；10个明确对上当前列传 |
| 5 | Kun-Lun（昆仑） / 98825941 | [前100](https://zkillboard.com/api/stats/corporationID/98825941/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98825941/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98825941.md#昆仑前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；14个明确对上当前列传 |
| 6 | ChuangShi（创世） / 98535868 | [前100](https://zkillboard.com/api/stats/corporationID/98535868/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98535868/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98535868.md#创世前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；10个明确对上当前列传 |
| 7 | Knight of Zero Ultra（KZU） / 98808817 | [前100](https://zkillboard.com/api/stats/corporationID/98808817/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98808817/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98808817.md#kzu前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；6个明确对上当前列传 |
| 8 | Stardust-Guardian（星尘） / 98550682 | [前100](https://zkillboard.com/api/stats/corporationID/98550682/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98550682/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98550682.md#星尘前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；10个明确对上当前列传 |
| 9 | Alkaid Broken Army（瑶光） / 98725234 | [前100](https://zkillboard.com/api/stats/corporationID/98725234/kills/)，2026-10-11 | [已取得前100](https://zkillboard.com/corporation/98725234/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98725234.md#瑶光前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；11个明确对上当前列传 |
| 10 | Kuan.Dai.Shan（宽带山） / 98626718 | [前100](https://zkillboard.com/api/stats/corporationID/98626718/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98626718/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98626718.md#宽带山前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；2个明确对上当前列传 |
| 11 | Emperor Scythes / 98715582 | [前100](https://zkillboard.com/api/stats/corporationID/98715582/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98715582/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98715582.md#帝皇之镰前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；6个明确对上当前列传 |
| 12 | STARCHASER Inc / 98626494 | [前100](https://zkillboard.com/api/stats/corporationID/98626494/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98626494/top/year/2026/month/9/)，系统Chrome缓存 | [前50已读49份](member-research/98626494.md#采星者前50头衔增量2026-10-14)；第33名ESI404，头衔／简介缺口保留 | 100个名字已对照；4个明确对上当前列传 |
| 13 | Dusk dreadnought. / 98817310 | [前100](https://zkillboard.com/api/stats/corporationID/98817310/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98817310/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98817310.md#dusk前50头衔增量2026-10-14)；优先补总监／社区主持实际事务 | 100个名字已对照；5个明确对上当前列传 |
| 14 | B.O.P Supplication For Glorious / 98547771 | [前100](https://zkillboard.com/api/stats/corporationID/98547771/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98547771/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98547771.md#bop前50头衔增量2026-10-14)；优先补参谋长实际职责与人物故事 | 100个名字已对照；13个明确对上当前列传 |
| 15 | Fox of Resistance / 98755298 | [前100](https://zkillboard.com/api/stats/corporationID/98755298/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98755298/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98755298.md#fox前50头衔增量2026-10-15)；明确管理职责已写短篇；其他候选待补故事／教学 | 100个名字已对照；16个明确对上当前列传 |
| 16 | YeLuo-XingHai / 98588384 | [前100](https://zkillboard.com/api/stats/corporationID/98588384/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98588384/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98588384.md#叶落星海前50头衔增量2026-10-15)；补总监分工、任务交易与人物事件 | 100个名字已对照；6个明确对上当前列传 |
| 17 | HongLou / 98642382 | [前100](https://zkillboard.com/api/stats/corporationID/98642382/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98642382/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98642382.md#红楼前50头衔增量2026-10-15)；补实际职责与独立事件 | 100个名字已对照；3个明确对上当前列传 |
| 18 | PLA Fleet / 98576141 | [前100](https://zkillboard.com/api/stats/corporationID/98576141/kills/)，2026-10-12 | [已取得前0](https://zkillboard.com/corporation/98576141/top/year/2026/month/9/)，系统Chrome缓存 | [前50已读49份](member-research/98576141.md#pla-fleet前50头衔增量2026-10-15)；第37名ESI404；老鹰双号归本人 | 100个名字已对照；5个明确对上当前列传 |
| 19 | Temple of Tuvan Orth / 98652614 | [前100](https://zkillboard.com/api/stats/corporationID/98652614/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98652614/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98652614.md#图万神殿前50头衔增量2026-10-15)；茅台FC已立传，其他实际职责／故事待补 | 100个名字已对照；6个明确对上当前列传 |
| 20 | Chi Gua / 98524084 | [前100](https://zkillboard.com/api/stats/corporationID/98524084/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98524084/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98524084.md#吃瓜第31至50名增量)；喵爷虫洞邀请、天鹅ALT及鹊桥直播继续补故事 | 100个名字已对照；14个明确对上当前列传 |
| 21 | Salted Fish Inc / 98640194 | [前100](https://zkillboard.com/api/stats/corporationID/98640194/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98640194/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98640194.md#咸鱼第31至50名增量)；saber CEO已立传，kk七号归一组，其他职责／故事继续 | 100个名字已对照；7个明确对上当前列传 |
| 22 | Descendants of Shen Nong / 98702890 | [前100](https://zkillboard.com/api/stats/corporationID/98702890/kills/)，2026-10-12 | [已取得前95](https://zkillboard.com/corporation/98702890/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98702890.md#神农第41至50名与leo成文)；Leo总监已立传，其他实际职责／故事继续 | 100个名字已对照；7个明确对上当前列传 |
| 23 | Family Guy. / 98798876 | [前100](https://zkillboard.com/api/stats/corporationID/98798876/kills/)，2026-10-11 | [已取得前86](https://zkillboard.com/corporation/98798876/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98798876.md#family-guy第31至50名增量2026-10-16)；酒云教学入口、P子和686等继续补故事 | 100个名字已对照；5个明确对上当前列传 |
| 24 | Cosmic-Wanderers / 98769610 | [前100](https://zkillboard.com/api/stats/corporationID/98769610/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98769610/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98537981-98769610.md#cosmic-wanderers第36至50名及gecl前两名2026-10-16)；豆芽／老哥／星光归组，具体人物故事继续补 | 100个名字已对照；9个明确对上当前列传 |
| 25 | Galactic Empire Co LTD / 98537981 | [前100](https://zkillboard.com/api/stats/corporationID/98537981/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98537981/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98537981-98705642.md#gecl第26至50名与创世学院前六名2026-10-16)；同人组及B站直链等后续故事待补 | 100个名字已对照；5个明确对上当前列传 |
| 26 | Chuangshi College / 98705642 | [前100](https://zkillboard.com/api/stats/corporationID/98705642/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98705642/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98705642-98825044.md#创世学院第39至50名及navigators-union前23名2026-10-17)；具体人物故事继续补 | 100个名字已对照；0个明确对上当前列传 |
| 27 | Navigators' Union / 98825044 | [前100](https://zkillboard.com/api/stats/corporationID/98825044/kills/)，2026-10-12 | [已取得前98](https://zkillboard.com/corporation/98825044/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98648061-98825044.md#navigators-union收尾与兔飞前26名2026-10-17)；房子小双号，职责／故事续查 | 100个名字已对照；4个明确对上当前列传 |
| 28 | Tu Zi Fei Corporation / 98648061 | [前100](https://zkillboard.com/api/stats/corporationID/98648061/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98648061/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98645589-98648061.md#兔飞第27至50名与faceless前十2026-10-17)；梦／京介归双号，小燕子三号，颂词补飞飞 | 100个名字已对照；6个明确对上当前列传 |
| 29 | Faceless. / 98645589 | [前100](https://zkillboard.com/api/stats/corporationID/98645589/kills/)，2026-10-12 | [已取得前95](https://zkillboard.com/corporation/98645589/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核49份](member-research/98645589-98781311.md#faceless收尾与dawns-lightp前十2026-10-17)，第24名ESI404；木木三补Crea1ure | 100个名字已对照；14个明确对上当前列传 |
| 30 | Dawn's LightP / 98781311 | [前100](https://zkillboard.com/api/stats/corporationID/98781311/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98781311/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](member-research/98599181-98781311.md#dawns-lightp收尾与aocal前十2026-10-17)；白凝七号，具体故事／职责续查 | 100个名字已对照；2个明确对上当前列传 |
| 31 | Attack On CALDARI / 98599181 | [前100](https://zkillboard.com/api/stats/corporationID/98599181/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98599181/top/year/2026/month/9/)，系统Chrome缓存 | [前20已核读](member-research/98599181.md#aocal第11至20名与牧星评论入文2026-10-17)；夜灵成文，天堂角落双号；续21—30 | 100个名字已对照；2个明确对上当前列传 |
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
| 50 | Dam Scientific Research / 98606029 | [前100](https://zkillboard.com/api/stats/corporationID/98606029/kills/)，2026-10-12 | [已取得前77](https://zkillboard.com/corporation/98606029/top/year/2026/month/9/)，系统Chrome缓存 | [前20已核读](member-research/98599181.md#aocal第11至20名与牧星评论入文2026-10-17)；夜灵成文，天堂角落双号；续21—30 | 100个名字已对照；0个明确对上当前列传 |
## 本轮已吸收的故事与同人号

- **黑山羊、小白菜**：已凭指挥依据收录；导演、默、奈何后因仅有参赛／战果退回线索，旧取得记录保留，不再记为当前收录。Thunder ebon已补同场ATXXI经历与互链。
- **幽竹／LS-Somber（2118767266）**：本人招募承诺作战船军团包揽、每月单浪补损2B，现保留[单人线索](../../leads/ls-somber.md)；LS-Somber5／2119292222同词根同瑶光并入本人。
- **久／xie jiu（2120047333）**：长剑、神示、长须鲸三条KM确认本人参战并取最后一击，“红烧猪头／夜宵／吃鱼”菜单归[本人线索](../../leads/xie-jiu.md)，简介菜单与KM不足立传。贝斯特拉那条无本号，只写挂军团战果与自夸，不认本人击杀。
- **丁大炮／dingdapao001（2118510270）**：完整读取本人BR，六窗口213条去重KM、总损失66.83B；两条本人永灭记录保留[单人线索](../../leads/dingdapao001.md)。未达到大型战役门槛。
- **乔布／qiaobu123、剑穿天下／Contingency-JCTX**：后续已立传，分别见[乔布素材](../../../src/people/qiaobu123/materials-qiaobu123.md)、[剑穿天下素材](../../../src/people/contingency-jctx/materials-contingency-jctx.md)；此次回填状态，不计为本轮新写。
- **莫凡／MOVAN（2115166285）**：创世历史榜第1，本人头衔对应；简介留下归魂者、泽尼塔KM及“忘记换蛋的下场”。原始KM核对材料归[本人线索](../../leads/movan.md)，简介自嘲与KM不足立传。泽尼塔为无畏，未写成超旗；未取战损估值，不冒充已核大型战役。
- **乐章／PS Rogen（2113093205）**：SCG历史榜第1，本人中文头衔与工程项目材料里的管理乐章对应。ES清退风波中被请离一方称其“公正且明辨是非”，归[本人线索](../../leads/ps-rogen.md)，仅管理身份与一句好评不足立传；不编接收结果或顶住禁令的动作。
- **污龟：peter li peter1（2113882039）**。头衔“污龟 ALT”，同当前Chi Gua，归[污龟](../../../src/people/peter-li-peter/materials-peter-li-peter.md)。
- **白菜：CaiGou CabbageTimil（2116264387）**。头衔“白菜”，与收录号同当前军团Steel Feather Special Air Corps（98617103），归[白菜](../../../src/people/cabbagetimil/materials-cabbagetimil.md)。
- **水哥：Captain shikongsa（2115281834）**。头衔“水哥”，同当前KZU，归[水哥](../../../src/people/shikongsa/materials-shikongsa.md)。
- TaiBaiJinXIng（2119449883）在榜内显示(recycled)后缀；此前已有[胡汉三素材](../../../src/people/taishang-laojun/materials-taishang-laojun.md)明确归属，复用原对应而非新认号。其是否换操作人未重查，不以历史榜证明当今仍由本人操作。

## 本轮首批其余角色

| 角色 / ID | 当前公开头衔 | 已有线索与待查 |
| --- | --- | --- |
| xie jiu / 2120047333 | #4380 久，『 混沌卧龙』修津高手 | 混沌历史榜第1，简介“带队使用”预设及“我们cacx真的太强啦”；三条本人参战KM与贝斯特拉宣传已核，已退回[久线索](../../leads/xie-jiu.md)；仍不凭设置名认FC。 |
| Leela Sirene / 1212703823 | Hito#872747 | PLA历史榜第1；Hito只是头衔片段，不并到HiToMinG／所思；本人事件与账号待查。 |
| Pstark Adoulin / 2114017643 | 乌黑的手 | RR历史榜第1；头衔“乌黑的手”，简介空，中文外号／管理身份未展开。 |
| CMFF / 2117820367 | 【默(Chilmore)】 | 暂留[默的线索](../../leads/cmff.md)，三号同头衔同团归本人；MCX-CMFF的航母KM已核。不是乐章或刚子。 |
| SkyEagleMilize / 2120306116 | 天鹰 金色镰刀 | ES历史榜第1；本人链接总览与“天鹰流浪洞 Drifter”，是工具入口，不当本人战役或新B站账号。；2026-10-21已立传，续见[天鹰素材](../../../src/people/sky-eagle-milize/materials-sky-eagle-milize.md) |
| qiaobu123 / 2121450438 | #乔布 | 朱雀历史榜第1，军团简介Head-FC指向本号，中文头衔“乔布”；刀哥、GM Nito与Zelus三条KM已核，已立[乔布短传](../../../src/people/qiaobu123/materials-qiaobu123.md)；其余入口留本人素材。 |
| La Rusa / 2118160416 | 奈何 | 暂留[奈何线索](../../leads/la-rusa.md)，Obe泰坦击杀与2024虫洞拆迁入文；登记CEO号关系仍待核。 |
| Dema1 / 2115768319 | 德玛 | 红楼历史榜第1；DEMA 119为红楼创建者兼创团CEO（2020-05—2025-02），已立[德玛列传](../../../src/people/dema1/materials-dema1.md)。 |

## 上一批明确同人及候选



- **晓天：Guifangq（2115482062）**。Family Guy历史榜第25，1136条、约1.714T；ESI头衔“晓天”，当前Infinity Avenger（98556933），与收录Guifangq Hate同词根、同中文头衔、同当前军团。归回[晓天](../../leads/guifangq-hate.md)，不另立传。
- **炽天：chitian hehehe（2113788113）**。Family Guy历史榜第27，994条、约414.40B；ESI完整头衔“炽天 清风不语，明月自来”，当前KZU（98808817），与收录号同词根、同头衔和同当前军团。**chitian xiao（2114917439）**也在同一Family Guy历史榜第40，729条、约275.08B，与已认号hehehe同词根、同历史军团，按同词根同军团规则合并；xiao当前头衔与KZU团籍已补核，不将历史榜当今日归属。两号归回[炽天](../../../src/people/chitian/materials-chitian.md)。huhuhu仍缺对应记录。

## 优先候选与首批头衔

不凭军团高榜名次认定管理或FC；先保存外号与直接职责，再追事件、Monitor记录和社区账号。职位或普通参战统计单独不足以造个人故事。

| 角色 / ID | 人物线索 | 已有依据与下一步 |
| --- | --- | --- |
| Lemmily / 272243056 | 瑶光导演／Lemmily | 暂留[导演线索](../../leads/lemmily.md)，ATXXI夜鹰出场已核；本人仍为简介列出的主要负责人，具体任期与社区故事待查。 |
| Ox00FFFFFFF BIS / 2114035946 | 奎恩 | 瑶光历史榜第4；本人头衔“奎恩”，简介为古文；中文社区事件与同人关系待查。 |
| LS-Somber / 2118767266 | 幽竹 | 瑶光历史榜第10；本人头衔“幽竹(主号)”，简介招新人并称作战船只军团包揽、每月单浪额外补损2B；招募承诺留[幽竹线索](../../leads/ls-somber.md)，LS-Somber5／2119292222并入本人；PH文字是旧简介口径。 |
| Arthur Hemanseh / 96724929 | MasterChief／顶级猎手 | 伏羲历史榜第1；本人头衔“MasterChief - 顶级猎手”，简介空；客户端顶级猎手及公开伏羲组合各1页未有效命中，转事件／Monitor入口，不据常用词认人。 |
| Zamira Mtskhetashi / 92761884 | 扎米拉 | 伏羲第2；本人头衔“扎米拉”、简介F1 Monkey；公开精确中文查询无人物命中，尚无独立事件。 |
| No Fung / 2112427316 | 老馮 | 伏羲第3；本人头衔“老馮”、简介F1 Monkey；不按常见姓氏合并已有角色。 |
| ForAeon / 2121683065 | 不回 | 伏羲第4；本人简介“呜呜呜，要被揍了（咬牙）”及番剧链接；属于游戏号自述，不能据番剧作者认本人B站账号。 |
| Medusa Serenity / 2114912504 | 代行天威 | 伏羲第5；头衔“代行天威”、简介空；已与同头衔同团的Hydra hzy归一人，社区故事／职责待查。 |
| Cavick / 2112541174 | Cavick | 伏羲第6；头衔同英文名、简介空；中文外号与故事待查。 |
| Zack Raines / 2113144878 | 后天 | 伏羲第7；本人头衔“后天”、简介空；不把其他帖子中的普通时间词当本人。 |
| SamNeko / 2117340398 | SamNeko | 伏羲第9；头衔同角色名、简介空；身份待查。 |

星尘前十名片的历史核读范围见[来源摘记](member-research/98550682.md#星尘前十名片核读2026-10-12)，逐号调查判断与待查事项统一查询共享角色档案，不再维护独立批次队列。Family Guy前十旧调查见[Cyan nomi素材](../../../src/people/cyan-nomi/materials-cyan-nomi.md)。

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

- **[导演／Lemmily](../../leads/lemmily.md)**：角色ID直接对上EVE_NT ATXXI名单，驾驶夜鹰代表PMA出场；同队Thunder ebon已对上本站166847438，追加其参赛经历并互链。比赛日期、具体轮次、指挥身份未取得，普通竞技落败不记黑料；其他队员保留在[共享赛事摘要](../../sources/atxxi-pma-3816.md)，未完成逐人社区调查。
- **[默／CMFF](../../leads/cmff.md)**：MCX-CMFF、MJ CMFF、Chilmore三号均同中文头衔、同SCG，合写一人。MCX-CMFF简介挂出的90444413已核，2021-02-03、2R-CRW、16名攻击者中记录本人太空舱船型；目标Thanatos／绝念为普通航母，不是超旗。个人KB与挂墙行为已入文，不编太空舱攻击航母的操作或指挥。
- **[黑山羊／War martyrdom Freedom](../../../src/people/black-goat/materials-black-goat.md)**：ESI中文头衔明确，简介是月矿、矿物与虫洞资料。既有138807390确认2026-09-30、Y-C3EQ驾驶Monitor参与指挥；新读138764476则开灾难级海军型，两种船型分别叙述。个人KB已补，不因工具列表认矿业管理职责。
- **[小白菜／Cabbage66](../../../src/people/cabbage66/materials-cabbage66.md)**：ESI头衔“小白菜”，与本站白菜无同人依据。完整138764476原始名单确认2026-09-28、Y-C3EQ、瑶光／INIT、Monitor船型，已立短传并与黑山羊互链。空简介与两个搜索分支未给出新社区账号，不认终身无发言。
- **[奈何／La Rusa](../../leads/la-rusa.md)**：旧招新帖作者主题列表仅一条EVE帖，吧名为eve；当前98817783军团成立于2025-11-11，不能直接将2023同名帖接为此团史，服务器及组织承接仍待核。改查本人KB与原始名单，取得Obe冥府击杀及2024年Lazerhawks六条虫洞结构拆迁经历，战果保留在奈何线索，现缺独立故事或指挥依据；旧帖认号不是前置条件。公开简介CEO与登记CEO号2123893786的同人关系仍缺，不合并。
- 本轮五号个人KB分别取得，按收录号范围表述；各小号统计不相加。九月50团缓存与旧历史榜复用，仅新增角色、事件和账号分支；每份名单取得、个体认号与入文继续分别记录。
- 浏览器在本机CDP连接阶段超时，未导航到138764476；随后公开zKB API及对应ESI均200，原始记录完整可读，没有因站点拦截切换出口。EVE_NT两个人物页超时，比赛页完整且链接ID已对上，不反复读取人物页。奈何的常用词搜索命中普通连词与无关小说内容，不归人物。

2026-10-13已消化条目：BOP历史榜akissone（2113411990）以招新联系名单、Akiss回复账号及2018起同团雇佣期对应，招新玩笑已入[本人素材](../../../src/people/akissone/materials-akissone.md)。历史榜数字保持原口径，不拿本次个人stats覆盖榜单。

## 2026-10-13续查：D.OK与近名号

本批固定十个对象：钟离尘风、神奇黑旗、Rainight kurumi、酱油、系欧欧、老曲、伊利法尔近名号、苍墨、雨季、乌黑的手。前九个已补ESI，乌黑的手复用旧头衔与本轮公开搜索；请求首轮上限30，两个访谈另按关联UP上限15，快照补齐沿构建流程，不扩成逐团全量刷新。榜单与成功缓存复用，取得、核读、归属与成文分开。

| 对象／ID | 核读与归档 | 当前下一步 |
| --- | --- | --- |
| 钟离尘风／Ventus ZhongLi，2119086999 | 中文头衔、无面者归属、首星捐赠自述、动员译稿点名已读；[本人素材](../../../src/people/ventus-zhongli/materials-ventus-zhongli.md)，已立传 | 管理具体分工、任期、小号与代表战役 |
| 神奇黑旗／Qiya Hei，2115982590 | 中文头衔直接自报联盟FC，公开招新福利及个人KB已读；[本人素材](../../../src/people/qiya-hei/materials-qiya-hei.md)，保留FC短传 | 具体指挥事件、Monitor与贴吧账号；高安Blackflag同名不归他 |
| Rainight kurumi，2117046673 | 两条泰坦及一条莫洛原始KM已核，本人均为攻击者；简介“TT没了”不归本人损失，详见[本人线索](../../leads/rainight-kurumi.md) | 中文账号、本人具体故事与指挥依据；不重复三条成功KM |
| 酱油／Soy sauce No，2118118124 | 中文头衔酱油、当前无面者；九月本团第3、150条，历史第2、5274条；简介只有默认文案 | 本人事件与小号；不因高榜名次认管理 |
| 系欧欧／coo en Cedoulain，2114463130 | 中文头衔与当前无面者已读；简介为总览和广播 | 社区事件与同人；工具分享不立传 |
| 老曲／NanJing-9，2117364874 | 头衔老曲、当前咸鱼团98640194；简介广播设置 | 查本人社区账号，不因NanJing词根归南京 |
| yilifaerrrrrrr，2121295606 | 头衔#Eli-Yilifaer、同Your Ex's，按同词根同团合并；[伊利法尔素材](../../../src/people/yilifaer/materials-yilifaer.md) | 简介多个FC与CCP角色的KM、Twitch片段待读；不据收藏链接编战果 |
| 苍墨／Weightless01，2121209822 | 头衔#苍墨、朱雀军团98742946；简介挂Nyth Hinken巴盖斯KM | 本人与想想同人依据未得，不合并；KM及社区账号待查 |
| 雨季／ai weiyang，2116008826 | 头衔雨季、当前98642939／FRT；简介主要为总览 | 未对应未央，不归卡商九卡事件；具体故事待查 |
| 乌黑的手／Pstark Adoulin，2114017643 | 复用旧ESI中文头衔与军团98540583；本轮公开检索只见战绩页，没有社区事件 | 继续事件、Monitor与主小号，KB本身不立传 |

本批归入当前列传新增3个角色ID（两位新人、伊利法尔一号），同时按当前文件回填旧撤回人物的线索路径。两期宁静访谈补白杉、NoNo、大林与斑鸠的具体言行；未对应小派留[视频身份入口](../../leads/ningjing-interview-guests-2022.md)。2022年一月98行军团表另归[历史榜事实](../../sources/corp-activity-2022-01.md)，不混入本页2026年九月统计。

2026-10-13后续核读：Rainight的三条原始记录支持泰坦／无畏参与击杀，不支持本人“土路丢泰坦”，已按人物归档。2022历史团分支定位七个团与六个登记号的角色头衔，内森并回旧传；夜叉糖按既有完整帖子写新传。取得军团ID与现任CEO不等于2022任期已核，不改变本页4834角色逐人故事覆盖。

社区续查本轮从角色转原事件：We Love Cody在2025年CEO声明中出现的Code Earth已核角色2112856066并立传，声明实际由Nan Li Leo代发，两人身份在材料中拆清；与今日“寇德”Zerg Lemon暂不合并。这是2022旧团表分支的新人物，不将其加入本页4834名历史／近期榜角色计数。伏羲顶级猎手、扎米拉及红楼德玛的本轮关键词分支未取得人物事件，分别更新原候选行，下一步改沿同队事件与Monitor，不重复同一零命中搜索。

2026-10-14九月榜首批十号已核头衔／简介，待故事者集中在[无面者人物入口](faceless-research.md)。糖果猫两号已按同头衔同团归一；JiaShen Yangg与SummerHall外交官珅同词根、同头衔、同DC，归[本人素材](../../../src/people/jiashen-yang/materials-jiashen-yang.md)，具体自嘲与D哥哥猎獒记录留存，珅已按核心管理恢复短传，具体外交事件继续补料。原TSV只更新身份字段，不将九月记录加进历史／近期统计。顶部对应数现只统计明确已对应状态且有当前列传的行；“待故事／待认号”行即使指向某人的取材文件，也不能当作同人已成。

2026-10-14旧团表续查：奥术飞弹创建人／CEO DA已据任职依据留短传，AUG SE同词根同DC并回本人；2022招新帖完整文字与评论区钱包玩笑归[本人素材](../../../src/people/aug-ss/materials-aug-ss.md)。这是2022历史团分支人物，不加入本页4834角色的已对应计数；2022具体任期继续核，不把登记创建人当连续任职证明。

## LP双主角成文（2026-10-16）

[阿巴怪素材](../../../src/people/aba-guai/materials-aba-guai.md)与[无火的余灰素材](../../../src/people/awa-123/materials-awa-123.md)已迁入人物目录、两篇列传与正式快照完成，实际停补损／撤权限和船的后续仍留[共用事件](../../sources/dsn-lp-dispute-2026.md)查。阿巴怪两块黑料展开统一回收的理由、训话与三项权限威胁；余灰保留问LP、公开控诉、先懒发长记录后补材料和出勤／教学争论，未把被踢本身当黑料。本人说法与其他人的话分开，未添实际执行结果。

两人按快照挂当前组织：阿巴怪FUXI／FRT，余灰JXXY／CSF.；余灰在DSN的历史记录2025-07-19—2026-01-25，与事件及发帖日期相合，旧DSN／FRT不作其当前标签。Leo、袖笼与两人互链已补，旧待撰入口已撤，不留空壳转跳页。

Cyan nomi正式快照、短篇及Family Guy第31—50后续已完成，见下文；前30和两篇LP人物不重抓成功资料，未完成的后续事件继续按具体入口推进。

2026-10-16续批：先完成Cyan nomi创建者／CEO短篇与正式快照，再分十人续Family Guy历史第31—50；复用成功名片，快照及缺失名片／必要身份补查合计上限30请求。只读公开文字，不读视频、音轨或字幕。

## 2026-10-21：已知账号对应收尾

天鹰／SkyEagleMilize、INIT七喜／GENSHIN IMPART、曲馨／MSG-MashiMaro、萌萌／Lova 8899已按本人作品公开文字与独立互动立传；此前仅名片／工具入口的结论是原轮阅读范围，不能覆盖后续作品取材。INIT七喜与PLA七喜仍为两人；Lova对应EVE老头乐的身份缺口已经解决。详细来源分别归各自人物素材，不沿旧表重复搜索。
