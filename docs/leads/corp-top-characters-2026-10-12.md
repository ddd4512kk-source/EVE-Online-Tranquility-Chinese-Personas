# 前50军团成员榜反查（2026-10-12）

当前收录状态见[待撰备忘录](../pending-characters.md)与各人素材；下文取得、核读范围保留，旧成文记录不代表当前仍收录。

## 范围与实际覆盖

名单沿用[九月前50军团](top50-corp-ceos-2026-10-11.md)。本轮在共享冷却结束后补齐余下46家历史榜：**50家all-time人物榜均已取得，共4996条历史名次记录**；49家各前100，Deadspace Spearhead返回96个角色，不把返回不足100记成分页失败。另保存接口近期榜490条，范围不是九月。

合计5486条榜单记录，去重4834个角色；全部名字已经ESI批量解析，按当前收录号、aliases及明确同人素材对照。198个不同角色在TSV明确标为已对应当前列传（对应252条榜单记录），4636个未标为已对应当前列传；这些是角色数，不是去重后真人数。名字对照不等于个人调查完成，逐人结果见[清单](corp-top-characters-2026-10-12.tsv)。

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
- 混沌、PLA、伏羲、特执、昆仑、创世、KZU、星尘、瑶光、宽带山、帝皇之镰、Dusk、BOP、Fox、叶落星海、红楼：历史榜前50的头衔／简介已核读。
- 采星者前50已读49份名片，第33名ESI404缺头衔／简介；下一轮接PLA Fleet / 98576141前50；Fox其他候选继续补教学、赞助与人物事件；其余军团显示实际已登记名次，未核定连续范围的不冒称前十或前50完成。
- 月榜个人调查与历史榜另分范围；本栏不把历史榜前50核读改称九月前50完成。AOM另用[2021年9月ledger](aom-monthly-2021-09.md)，前100名单已存、前50名片已核读。

表中“有名片记录”仅表示正式TSV有头衔／简介核读记录；空头衔已读也计入，已有列传但未登记名片的号不自动计入。逐号的成文、待核身份和待补故事见[正式清单](corp-top-characters-2026-10-12.tsv)所指原队列／人物素材。


| 九月名次 | 军团 / ID | all-time角色榜取得 | 九月monthly角色榜取得 | 历史榜个人核读范围 / 下一步 | 身份对应进度 |
| --- | --- | --- | --- | --- | --- |
| 1 | Chaos arbiter（混沌） / 98598862 | [前100](https://zkillboard.com/api/stats/corporationID/98598862/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98598862/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#混沌前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；8个明确对上当前列传 |
| 2 | Peoples Liberation Army（PLA） / 98190062 | [前100](https://zkillboard.com/api/stats/corporationID/98190062/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98190062/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#pla前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；7个明确对上当前列传 |
| 3 | Fuxi Legion（伏羲） / 98185110 | [前100](https://zkillboard.com/api/stats/corporationID/98185110/kills/)，2026-10-11 | [已取得前100](https://zkillboard.com/corporation/98185110/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#伏羲前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；12个明确对上当前列传 |
| 4 | Special law enforcement department（特执／SARD） / 98540583 | [前100](https://zkillboard.com/api/stats/corporationID/98540583/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98540583/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#特执前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；9个明确对上当前列传 |
| 5 | Kun-Lun（昆仑） / 98825941 | [前100](https://zkillboard.com/api/stats/corporationID/98825941/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98825941/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#昆仑前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；12个明确对上当前列传 |
| 6 | ChuangShi（创世） / 98535868 | [前100](https://zkillboard.com/api/stats/corporationID/98535868/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98535868/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#创世前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；8个明确对上当前列传 |
| 7 | Knight of Zero Ultra（KZU） / 98808817 | [前100](https://zkillboard.com/api/stats/corporationID/98808817/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98808817/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#kzu前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；6个明确对上当前列传 |
| 8 | Stardust-Guardian（星尘） / 98550682 | [前100](https://zkillboard.com/api/stats/corporationID/98550682/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98550682/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#星尘前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；7个明确对上当前列传 |
| 9 | Alkaid Broken Army（瑶光） / 98725234 | [前100](https://zkillboard.com/api/stats/corporationID/98725234/kills/)，2026-10-11 | [已取得前100](https://zkillboard.com/corporation/98725234/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#瑶光前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；11个明确对上当前列传 |
| 10 | Kuan.Dai.Shan（宽带山） / 98626718 | [前100](https://zkillboard.com/api/stats/corporationID/98626718/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98626718/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#宽带山前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；1个明确对上当前列传 |
| 11 | Emperor Scythes / 98715582 | [前100](https://zkillboard.com/api/stats/corporationID/98715582/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98715582/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#帝皇之镰前50头衔增量2026-10-14)；继续补职责与人物事件 | 100个名字已对照；6个明确对上当前列传 |
| 12 | STARCHASER Inc / 98626494 | [前100](https://zkillboard.com/api/stats/corporationID/98626494/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98626494/top/year/2026/month/9/)，系统Chrome缓存 | [前50已读49份](#采星者前50头衔增量2026-10-14)；第33名ESI404，头衔／简介缺口保留 | 100个名字已对照；4个明确对上当前列传 |
| 13 | Dusk dreadnought. / 98817310 | [前100](https://zkillboard.com/api/stats/corporationID/98817310/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98817310/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#dusk前50头衔增量2026-10-14)；优先补总监／社区主持实际事务 | 100个名字已对照；4个明确对上当前列传 |
| 14 | B.O.P Supplication For Glorious / 98547771 | [前100](https://zkillboard.com/api/stats/corporationID/98547771/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98547771/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#bop前50头衔增量2026-10-14)；优先补参谋长实际职责与人物故事 | 100个名字已对照；11个明确对上当前列传 |
| 15 | Fox of Resistance / 98755298 | [前100](https://zkillboard.com/api/stats/corporationID/98755298/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98755298/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#fox前50头衔增量2026-10-15)；明确管理职责已写短篇；其他候选待补故事／教学 | 100个名字已对照；15个明确对上当前列传 |
| 16 | YeLuo-XingHai / 98588384 | [前100](https://zkillboard.com/api/stats/corporationID/98588384/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98588384/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#叶落星海前50头衔增量2026-10-15)；补总监分工、任务交易与人物事件 | 100个名字已对照；5个明确对上当前列传 |
| 17 | HongLou / 98642382 | [前100](https://zkillboard.com/api/stats/corporationID/98642382/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98642382/top/year/2026/month/9/)，系统Chrome缓存 | [前50已核读](#红楼前50头衔增量2026-10-15)；补实际职责与独立事件 | 100个名字已对照；2个明确对上当前列传 |
| 18 | PLA Fleet / 98576141 | [前100](https://zkillboard.com/api/stats/corporationID/98576141/kills/)，2026-10-12 | [已取得前0](https://zkillboard.com/corporation/98576141/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：9,15；连续范围待验收 | 100个名字已对照；2个明确对上当前列传 |
| 19 | Temple of Tuvan Orth / 98652614 | [前100](https://zkillboard.com/api/stats/corporationID/98652614/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98652614/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：1；连续范围待验收 | 100个名字已对照；4个明确对上当前列传 |
| 20 | Chi Gua / 98524084 | [前100](https://zkillboard.com/api/stats/corporationID/98524084/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98524084/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：17；连续范围待验收 | 100个名字已对照；12个明确对上当前列传 |
| 21 | Salted Fish Inc / 98640194 | [前100](https://zkillboard.com/api/stats/corporationID/98640194/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98640194/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；2个明确对上当前列传 |
| 22 | Descendants of Shen Nong / 98702890 | [前100](https://zkillboard.com/api/stats/corporationID/98702890/kills/)，2026-10-12 | [已取得前95](https://zkillboard.com/corporation/98702890/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；4个明确对上当前列传 |
| 23 | Family Guy. / 98798876 | [前100](https://zkillboard.com/api/stats/corporationID/98798876/kills/)，2026-10-11 | [已取得前86](https://zkillboard.com/corporation/98798876/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：1,2,3,4,5,6,8,9,10,25,27,40；连续范围待验收 | 100个名字已对照；3个明确对上当前列传 |
| 24 | Cosmic-Wanderers / 98769610 | [前100](https://zkillboard.com/api/stats/corporationID/98769610/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98769610/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；0个明确对上当前列传 |
| 25 | Galactic Empire Co LTD / 98537981 | [前100](https://zkillboard.com/api/stats/corporationID/98537981/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98537981/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；3个明确对上当前列传 |
| 26 | Chuangshi College / 98705642 | [前100](https://zkillboard.com/api/stats/corporationID/98705642/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98705642/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：28,30；连续范围待验收 | 100个名字已对照；0个明确对上当前列传 |
| 27 | Navigators' Union / 98825044 | [前100](https://zkillboard.com/api/stats/corporationID/98825044/kills/)，2026-10-12 | [已取得前98](https://zkillboard.com/corporation/98825044/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：1,2,9,20,22；连续范围待验收 | 100个名字已对照；2个明确对上当前列传 |
| 28 | Tu Zi Fei Corporation / 98648061 | [前100](https://zkillboard.com/api/stats/corporationID/98648061/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98648061/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：13,21,50；连续范围待验收 | 100个名字已对照；5个明确对上当前列传 |
| 29 | Faceless. / 98645589 | [前100](https://zkillboard.com/api/stats/corporationID/98645589/kills/)，2026-10-12 | [已取得前95](https://zkillboard.com/corporation/98645589/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：2,3,4,12,18,21,23,31,46；连续范围待验收 | 100个名字已对照；12个明确对上当前列传 |
| 30 | Dawn's LightP / 98781311 | [前100](https://zkillboard.com/api/stats/corporationID/98781311/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98781311/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：45；连续范围待验收 | 100个名字已对照；1个明确对上当前列传 |
| 31 | Attack On CALDARI / 98599181 | [前100](https://zkillboard.com/api/stats/corporationID/98599181/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98599181/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：15；连续范围待验收 | 100个名字已对照；1个明确对上当前列传 |
| 32 | Serenity Moe University / 98707431 | [前100](https://zkillboard.com/api/stats/corporationID/98707431/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98707431/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：8,49；连续范围待验收 | 100个名字已对照；1个明确对上当前列传 |
| 33 | Stars Corporate Group / 98598483 | [前100](https://zkillboard.com/api/stats/corporationID/98598483/kills/)，2026-10-12 | [已取得前93](https://zkillboard.com/corporation/98598483/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：1,2,6,9,20；连续范围待验收 | 100个名字已对照；3个明确对上当前列传 |
| 34 | Silver Fog Dragon Ride / 98613748 | [前100](https://zkillboard.com/api/stats/corporationID/98613748/kills/)，2026-10-12 | [已取得前89](https://zkillboard.com/corporation/98613748/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：37；连续范围待验收 | 100个名字已对照；4个明确对上当前列传 |
| 35 | Baby-Bus / 98777401 | [前100](https://zkillboard.com/api/stats/corporationID/98777401/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98777401/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：11；连续范围待验收 | 100个名字已对照；0个明确对上当前列传 |
| 36 | New Eden Light Point College / 98772842 | [前100](https://zkillboard.com/api/stats/corporationID/98772842/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98772842/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；2个明确对上当前列传 |
| 37 | Foredawn Business Corporation / 98538918 | [前100](https://zkillboard.com/api/stats/corporationID/98538918/kills/)，2026-10-12 | [已取得前49](https://zkillboard.com/corporation/98538918/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；6个明确对上当前列传 |
| 38 | Deadspace Spearhead / 98841123 | [前96](https://zkillboard.com/api/stats/corporationID/98841123/kills/)，2026-10-12 | [已取得前72](https://zkillboard.com/corporation/98841123/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 96个名字已对照；0个明确对上当前列传 |
| 39 | Arknights. / 98725089 | [前100](https://zkillboard.com/api/stats/corporationID/98725089/kills/)，2026-10-12 | [已取得前76](https://zkillboard.com/corporation/98725089/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：7,13,15,19,22,26,27,29,31,33,43；连续范围待验收 | 100个名字已对照；7个明确对上当前列传 |
| 40 | Silent Sojourner / 98817783 | [前100](https://zkillboard.com/api/stats/corporationID/98817783/kills/)，2026-10-12 | [已取得前61](https://zkillboard.com/corporation/98817783/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：1；连续范围待验收 | 100个名字已对照；0个明确对上当前列传 |
| 41 | Formosa Research Center / 98049623 | [前100](https://zkillboard.com/api/stats/corporationID/98049623/kills/)，2026-10-12 | [已取得前49](https://zkillboard.com/corporation/98049623/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；3个明确对上当前列传 |
| 42 | Texas of Requiem / 98806126 | [前100](https://zkillboard.com/api/stats/corporationID/98806126/kills/)，2026-10-12 | [已取得前83](https://zkillboard.com/corporation/98806126/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；2个明确对上当前列传 |
| 43 | Forever Stardust Navy Combined Fleet / 98804833 | [前100](https://zkillboard.com/api/stats/corporationID/98804833/kills/)，2026-10-12 | [已取得前56](https://zkillboard.com/corporation/98804833/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；0个明确对上当前列传 |
| 44 | Red Scarf Humpback / 98632030 | [前100](https://zkillboard.com/api/stats/corporationID/98632030/kills/)，2026-10-12 | [已取得前85](https://zkillboard.com/corporation/98632030/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；3个明确对上当前列传 |
| 45 | Glory Navy / 98530802 | [前100](https://zkillboard.com/api/stats/corporationID/98530802/kills/)，2026-10-12 | [已取得前81](https://zkillboard.com/corporation/98530802/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：41；连续范围待验收 | 100个名字已对照；2个明确对上当前列传 |
| 46 | Infinity Avenger / 98556933 | [前100](https://zkillboard.com/api/stats/corporationID/98556933/kills/)，2026-10-12 | [已取得前28](https://zkillboard.com/corporation/98556933/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：29；连续范围待验收 | 100个名字已对照；9个明确对上当前列传 |
| 47 | Phoenix City / 98575144 | [前100](https://zkillboard.com/api/stats/corporationID/98575144/kills/)，2026-10-12 | [已取得前56](https://zkillboard.com/corporation/98575144/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；1个明确对上当前列传 |
| 48 | Zhuque squad / 98742946 | [前100](https://zkillboard.com/api/stats/corporationID/98742946/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98742946/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：1,8,42；连续范围待验收 | 100个名字已对照；3个明确对上当前列传 |
| 49 | Black.King.Bar / 98599315 | [前100](https://zkillboard.com/api/stats/corporationID/98599315/kills/)，2026-10-12 | [已取得前74](https://zkillboard.com/corporation/98599315/top/year/2026/month/9/)，系统Chrome缓存 | 零散人物素材已复用；连续范围未登记 | 100个名字已对照；1个明确对上当前列传 |
| 50 | Dam Scientific Research / 98606029 | [前100](https://zkillboard.com/api/stats/corporationID/98606029/kills/)，2026-10-12 | [已取得前77](https://zkillboard.com/corporation/98606029/top/year/2026/month/9/)，系统Chrome缓存 | 有名片记录：15；连续范围待验收 | 100个名字已对照；0个明确对上当前列传 |
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

星尘前十的剑穿天下、3V、911、那年、QY、逐风、楠哥、丁大炮已有[逐人入口](sg-cn-fc-followup-2026-10-12.md)，后续剑穿天下已凭具体Monitor记录立传；丁大炮已核本人BR，现退回线索，3V、911、那年、QY、逐风、楠哥仍缺个人事件。Family Guy前十旧调查见[糯米线索](cyan-nomi.md)。

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
| Fauux／2122263187 | 虚实 Director Diplomat；公开军团简介也列总监兼外交，与重组通告虚实对应；简介17条KM分Final Blow／抽象／下水 | [重组线索](goons-shit-list.md)已补角色及Molok问价，继续实际外交／重组事务，不靠一条问价补足普通故事 |
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
| 49 | priset s／2115571665 | 头衔“神父  七国至尊   垃圾白给王”；神父，公开保护费报价及威胁条款写短传；3V舱收藏的攻击者另为Yen Dunier，未有同人桥，不当本人战果 |
| 50 | Marley Olacar／91715106 | 头衔“无”；无头衔、当前退团，简介字符画，只记存在，不评价人物经历 |

小蔡为Nyarlathotep Caos（95664556）、XiaoCaibucai（2119546166），同中文头衔且同当前星尘；败丶泪为Bryen Hummer（2113583390）、Jyhh（2113211269），同个性头衔、同当前The Skies Descend，归各自一人。名字与当前团籍用于身份对应，不由共享资料认岗位。
1126 Ljw Saken（2116264881）近1125 Ljw Saken词根与编号，同当前星尘，直接归天空纸条；其头衔noraus不覆盖这条角色近名／团籍链，也不是N老板身份桥。GA逍遥、折纸、纸条按已有角色ID归档。
神父[公开保护费方案](../../src/people/priset-s/materials-priset-s.md)已归本人素材并写短传；名片所挂3V舱KM不是本号参与，未凭收藏追加袭击故事。未核实成交、收费或执行，正文只写公开价目与条件。

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
| 26 | RoxyMG／2123019905 | 头衔“Director山之内花音”；山之内花音／Director；当前98631475，岗位不套为Dusk总监；黑米角色恶搞文案与GM／CCP收藏，不作为现实身份或独立人物事件 |
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

Stone Xiao（2114820480）公开头衔“泡泡很忙”、同当前PLA，与[XXXHolic-TK X／dawnstar091 XX组](kongli.md#泡泡很忙同人号)归同人，不并给空离；仅保存中文称呼，去掉头衔中的联系方式。当前角色对应不倒推每个小号的历史职务。怡红院Yihongyuan（2115480135）名片写“带头造反／参谋长”，保留为职责优先候选；没有具体造反事件或实际参谋事务，不能把绰号扩写成政变或指挥实绩。
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
| 14 | MSG-MashiMaro／2122590961 | 头衔“曲馨”；曲馨；技能／招新自嘲不认真实机制、实际管理或独立事件 |
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
