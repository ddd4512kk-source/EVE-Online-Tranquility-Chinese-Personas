# 前50军团成员榜反查（2026-10-12）

当前收录状态见[待撰备忘录](../pending-characters.md)与各人素材；下文取得、核读范围保留，旧成文记录不代表当前仍收录。

## 范围与实际覆盖

名单沿用[九月前50军团](top50-corp-ceos-2026-10-11.md)。本轮在共享冷却结束后补齐余下46家历史榜：**50家all-time人物榜均已取得，共4996条历史名次记录**；49家各前100，Deadspace Spearhead返回96个角色，不把返回不足100记成分页失败。另保存接口近期榜490条，范围不是九月。

合计5486条榜单记录，去重4834个角色；全部名字已经ESI批量解析，按当前收录号、aliases及明确同人素材对照。196个角色对上收录人物，4638个尚未对上；这些是角色数，不是去重后真人数。名字对照不等于个人调查完成，逐人结果见[清单](corp-top-characters-2026-10-12.tsv)。

**首次HTTP批次九月monthly为0/50**：确认公开源码支持`/corporation/<ID>/top/year/2026/month/9/`后，第一张混沌页面即HTTP403；立即停止本轮zKillboard全部请求，没有切换出口、镜像或接口继续取同一数据。此次403不影响此前已经取完的历史响应，但月榜和后续Monitor查询仍有缺口。

历史榜使用统计响应`topAllTime`的character子榜；按返回顺序保留击杀数排名与其军团范围内的参与击杀价值。历史榜不是现役名册，不证明当前军团或管理／指挥职责；不同军团、主小号统计均不直接相加。`topLists`角色榜单独标为`recent`，不冒充2026-09。

口径依据：[API实体统计文档](https://zkillboard.com/api/docs/)；[公开页面控制器](https://github.com/zKillboard/zKillboard/blob/master/view/overview.php)的top分支设角色榜limit=100，并读取year、month。只核对路线，不以源码替代实际月榜数据。

本轮明确续查50团历史榜与九月榜，联网总上限140次，个体核对首批10名；另补已收录人物的3个近名小号与莫凡3条原始KM。历史缺口46请求、月榜1次即403；其余请求为ESI批量认名、角色／KM核对、源码口径与新人物快照。没有继续获取被拦站点的个人KB或Monitor。

后续系统Chrome缓存已取得50家2026-09角色榜；本轮按缓存URL、页面标题及榜单结构回填取得状态。历史TSV仍保留all-time／recent口径，不把月榜条数掺入历史统计；取得页面不等于逐人故事调查完成。

## 50团覆盖清单

| 九月名次 | 军团 / ID | all-time角色榜 | 九月monthly角色榜 | 认号进度 |
| --- | --- | --- | --- | --- |
| 1 | Chaos arbiter / 98598862 | [前100](https://zkillboard.com/api/stats/corporationID/98598862/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98598862/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；7个对上；1个有头衔快照 |
| 2 | Peoples Liberation Army / 98190062 | [前100](https://zkillboard.com/api/stats/corporationID/98190062/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98190062/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；6个对上；1个有头衔快照 |
| 3 | Fuxi Legion / 98185110 | [前100](https://zkillboard.com/api/stats/corporationID/98185110/kills/)，2026-10-11 | [已取得前100](https://zkillboard.com/corporation/98185110/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；20个对上；9个有头衔快照 |
| 4 | Special law enforcement department / 98540583 | [前100](https://zkillboard.com/api/stats/corporationID/98540583/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98540583/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；6个对上；2个有头衔快照 |
| 5 | Kun-Lun / 98825941 | [前100](https://zkillboard.com/api/stats/corporationID/98825941/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98825941/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；2个对上；0个有头衔快照 |
| 6 | ChuangShi / 98535868 | [前100](https://zkillboard.com/api/stats/corporationID/98535868/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98535868/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；6个对上；1个有头衔快照 |
| 7 | Knight of Zero Ultra / 98808817 | [前100](https://zkillboard.com/api/stats/corporationID/98808817/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98808817/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；6个对上；3个有头衔快照 |
| 8 | Stardust-Guardian / 98550682 | [前100](https://zkillboard.com/api/stats/corporationID/98550682/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98550682/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；14个对上；8个有头衔快照 |
| 9 | Alkaid Broken Army / 98725234 | [前100](https://zkillboard.com/api/stats/corporationID/98725234/kills/)，2026-10-11 | [已取得前100](https://zkillboard.com/corporation/98725234/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；11个对上；10个有头衔快照 |
| 10 | Kuan.Dai.Shan / 98626718 | [前100](https://zkillboard.com/api/stats/corporationID/98626718/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98626718/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；2个对上；2个有头衔快照 |
| 11 | Emperor Scythes / 98715582 | [前100](https://zkillboard.com/api/stats/corporationID/98715582/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98715582/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；3个对上；2个有头衔快照 |
| 12 | STARCHASER Inc / 98626494 | [前100](https://zkillboard.com/api/stats/corporationID/98626494/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98626494/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；3个对上；0个有头衔快照 |
| 13 | Dusk dreadnought. / 98817310 | [前100](https://zkillboard.com/api/stats/corporationID/98817310/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98817310/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；4个对上；2个有头衔快照 |
| 14 | B.O.P Supplication For Glorious / 98547771 | [前100](https://zkillboard.com/api/stats/corporationID/98547771/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98547771/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；9个对上；1个有头衔快照 |
| 15 | Fox of Resistance / 98755298 | [前100](https://zkillboard.com/api/stats/corporationID/98755298/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98755298/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；2个对上；0个有头衔快照 |
| 16 | YeLuo-XingHai / 98588384 | [前100](https://zkillboard.com/api/stats/corporationID/98588384/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98588384/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；6个对上；1个有头衔快照 |
| 17 | HongLou / 98642382 | [前100](https://zkillboard.com/api/stats/corporationID/98642382/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98642382/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；0个对上；1个有头衔快照 |
| 18 | PLA Fleet / 98576141 | [前100](https://zkillboard.com/api/stats/corporationID/98576141/kills/)，2026-10-12 | [已取得前0](https://zkillboard.com/corporation/98576141/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；2个对上；0个有头衔快照 |
| 19 | Temple of Tuvan Orth / 98652614 | [前100](https://zkillboard.com/api/stats/corporationID/98652614/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98652614/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；4个对上；0个有头衔快照 |
| 20 | Chi Gua / 98524084 | [前100](https://zkillboard.com/api/stats/corporationID/98524084/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98524084/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；12个对上；2个有头衔快照 |
| 21 | Salted Fish Inc / 98640194 | [前100](https://zkillboard.com/api/stats/corporationID/98640194/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98640194/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；2个对上；0个有头衔快照 |
| 22 | Descendants of Shen Nong / 98702890 | [前100](https://zkillboard.com/api/stats/corporationID/98702890/kills/)，2026-10-12 | [已取得前95](https://zkillboard.com/corporation/98702890/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；4个对上；0个有头衔快照 |
| 23 | Family Guy. / 98798876 | [前100](https://zkillboard.com/api/stats/corporationID/98798876/kills/)，2026-10-11 | [已取得前86](https://zkillboard.com/corporation/98798876/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；4个对上；12个有头衔快照 |
| 24 | Cosmic-Wanderers / 98769610 | [前100](https://zkillboard.com/api/stats/corporationID/98769610/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98769610/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；0个对上；0个有头衔快照 |
| 25 | Galactic Empire Co LTD / 98537981 | [前100](https://zkillboard.com/api/stats/corporationID/98537981/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98537981/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；3个对上；0个有头衔快照 |
| 26 | Chuangshi College / 98705642 | [前100](https://zkillboard.com/api/stats/corporationID/98705642/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98705642/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；0个对上；0个有头衔快照 |
| 27 | Navigators' Union / 98825044 | [前100](https://zkillboard.com/api/stats/corporationID/98825044/kills/)，2026-10-12 | [已取得前98](https://zkillboard.com/corporation/98825044/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；1个对上；0个有头衔快照 |
| 28 | Tu Zi Fei Corporation / 98648061 | [前100](https://zkillboard.com/api/stats/corporationID/98648061/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98648061/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；5个对上；2个有头衔快照 |
| 29 | Faceless. / 98645589 | [前100](https://zkillboard.com/api/stats/corporationID/98645589/kills/)，2026-10-12 | [已取得前95](https://zkillboard.com/corporation/98645589/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；6个对上；2个有头衔快照 |
| 30 | Dawn's LightP / 98781311 | [前100](https://zkillboard.com/api/stats/corporationID/98781311/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98781311/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；1个对上；0个有头衔快照 |
| 31 | Attack On CALDARI / 98599181 | [前100](https://zkillboard.com/api/stats/corporationID/98599181/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98599181/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；1个对上；0个有头衔快照 |
| 32 | Serenity Moe University / 98707431 | [前100](https://zkillboard.com/api/stats/corporationID/98707431/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98707431/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；0个对上；0个有头衔快照 |
| 33 | Stars Corporate Group / 98598483 | [前100](https://zkillboard.com/api/stats/corporationID/98598483/kills/)，2026-10-12 | [已取得前93](https://zkillboard.com/corporation/98598483/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；6个对上；2个有头衔快照 |
| 34 | Silver Fog Dragon Ride / 98613748 | [前100](https://zkillboard.com/api/stats/corporationID/98613748/kills/)，2026-10-12 | [已取得前89](https://zkillboard.com/corporation/98613748/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；4个对上；0个有头衔快照 |
| 35 | Baby-Bus / 98777401 | [前100](https://zkillboard.com/api/stats/corporationID/98777401/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98777401/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；0个对上；1个有头衔快照 |
| 36 | New Eden Light Point College / 98772842 | [前100](https://zkillboard.com/api/stats/corporationID/98772842/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98772842/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；3个对上；0个有头衔快照 |
| 37 | Foredawn Business Corporation / 98538918 | [前100](https://zkillboard.com/api/stats/corporationID/98538918/kills/)，2026-10-12 | [已取得前49](https://zkillboard.com/corporation/98538918/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；5个对上；0个有头衔快照 |
| 38 | Deadspace Spearhead / 98841123 | [前96](https://zkillboard.com/api/stats/corporationID/98841123/kills/)，2026-10-12 | [已取得前72](https://zkillboard.com/corporation/98841123/top/year/2026/month/9/)，系统Chrome缓存 | 96个名字已对照；0个对上；0个有头衔快照 |
| 39 | Arknights. / 98725089 | [前100](https://zkillboard.com/api/stats/corporationID/98725089/kills/)，2026-10-12 | [已取得前76](https://zkillboard.com/corporation/98725089/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；12个对上；3个有头衔快照 |
| 40 | Silent Sojourner / 98817783 | [前100](https://zkillboard.com/api/stats/corporationID/98817783/kills/)，2026-10-12 | [已取得前61](https://zkillboard.com/corporation/98817783/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；1个对上；1个有头衔快照 |
| 41 | Formosa Research Center / 98049623 | [前100](https://zkillboard.com/api/stats/corporationID/98049623/kills/)，2026-10-12 | [已取得前49](https://zkillboard.com/corporation/98049623/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；3个对上；0个有头衔快照 |
| 42 | Texas of Requiem / 98806126 | [前100](https://zkillboard.com/api/stats/corporationID/98806126/kills/)，2026-10-12 | [已取得前83](https://zkillboard.com/corporation/98806126/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；9个对上；0个有头衔快照 |
| 43 | Forever Stardust Navy Combined Fleet / 98804833 | [前100](https://zkillboard.com/api/stats/corporationID/98804833/kills/)，2026-10-12 | [已取得前56](https://zkillboard.com/corporation/98804833/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；0个对上；0个有头衔快照 |
| 44 | Red Scarf Humpback / 98632030 | [前100](https://zkillboard.com/api/stats/corporationID/98632030/kills/)，2026-10-12 | [已取得前85](https://zkillboard.com/corporation/98632030/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；4个对上；1个有头衔快照 |
| 45 | Glory Navy / 98530802 | [前100](https://zkillboard.com/api/stats/corporationID/98530802/kills/)，2026-10-12 | [已取得前81](https://zkillboard.com/corporation/98530802/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；2个对上；1个有头衔快照 |
| 46 | Infinity Avenger / 98556933 | [前100](https://zkillboard.com/api/stats/corporationID/98556933/kills/)，2026-10-12 | [已取得前28](https://zkillboard.com/corporation/98556933/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；10个对上；0个有头衔快照 |
| 47 | Phoenix City / 98575144 | [前100](https://zkillboard.com/api/stats/corporationID/98575144/kills/)，2026-10-12 | [已取得前56](https://zkillboard.com/corporation/98575144/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；1个对上；0个有头衔快照 |
| 48 | Zhuque squad / 98742946 | [前100](https://zkillboard.com/api/stats/corporationID/98742946/kills/)，2026-10-12 | [已取得前100](https://zkillboard.com/corporation/98742946/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；2个对上；1个有头衔快照 |
| 49 | Black.King.Bar / 98599315 | [前100](https://zkillboard.com/api/stats/corporationID/98599315/kills/)，2026-10-12 | [已取得前74](https://zkillboard.com/corporation/98599315/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；1个对上；0个有头衔快照 |
| 50 | Dam Scientific Research / 98606029 | [前100](https://zkillboard.com/api/stats/corporationID/98606029/kills/)，2026-10-12 | [已取得前77](https://zkillboard.com/corporation/98606029/top/year/2026/month/9/)，系统Chrome缓存 | 100个名字已对照；1个对上；0个有头衔快照 |

## 本轮已吸收的故事与同人号

- **导演、默、奈何、黑山羊、小白菜**：2026-10-13续查已立五篇，事件、同人和来源边界见下方；Thunder ebon补同场ATXXI经历与互链。
- **幽竹／LS-Somber（2118767266）**：本人招募承诺作战船军团包揽、每月单浪补损2B，现保留[单人线索](ls-somber.md)；LS-Somber5／2119292222同词根同瑶光并入本人。
- **久／xie jiu（2120047333）**：长剑、神示、长须鲸三条KM确认本人参战并取最后一击，“红烧猪头／夜宵／吃鱼”菜单已写[短传与素材](../../src/people/xie-jiu/materials-xie-jiu.md)。贝斯特拉那条无本号，只写挂军团战果与自夸，不认本人击杀。
- **丁大炮／dingdapao001（2118510270）**：完整读取本人BR，六窗口213条去重KM、总损失66.83B；两条本人永灭记录保留[单人线索](dingdapao001.md)。未达到大型战役门槛。
- **乔布／qiaobu123、剑穿天下／Contingency-JCTX**：后续已立传，分别见[乔布素材](../../src/people/qiaobu123/materials-qiaobu123.md)、[剑穿天下素材](../../src/people/contingency-jctx/materials-contingency-jctx.md)；此次回填状态，不计为本轮新写。
- **莫凡／MOVAN（2115166285）**：创世历史榜第1，本人头衔对应；简介留下归魂者、泽尼塔KM及“忘记换蛋的下场”。原始KM核对后新增[短传与素材](../../src/people/movan/materials-movan.md)。泽尼塔为无畏，未写成超旗；未取战损估值，不冒充已核大型战役。
- **乐章／PS Rogen（2113093205）**：SCG历史榜第1，本人中文头衔与工程项目材料里的管理乐章对应。ES清退风波中被请离一方称其“公正且明辨是非”，新增[短传与素材](../../src/people/ps-rogen/materials-ps-rogen.md)；不编接收结果或顶住禁令的动作。
- **污龟：peter li peter1（2113882039）**。头衔“污龟 ALT”，同当前Chi Gua，归[污龟](../../src/people/peter-li-peter/materials-peter-li-peter.md)。
- **白菜：CaiGou CabbageTimil（2116264387）**。头衔“白菜”，与收录号同当前军团Steel Feather Special Air Corps（98617103），归[白菜](../../src/people/cabbagetimil/materials-cabbagetimil.md)。
- **水哥：Captain shikongsa（2115281834）**。头衔“水哥”，同当前KZU，归[水哥](../../src/people/shikongsa/materials-shikongsa.md)。
- TaiBaiJinXIng（2119449883）在榜内显示(recycled)后缀；此前已有[胡汉三素材](../../src/people/taishang-laojun/materials-taishang-laojun.md)明确归属，复用原对应而非新认号。其是否换操作人未重查，不以历史榜证明当今仍由本人操作。

## 本轮首批其余角色

| 角色 / ID | 当前公开头衔 | 已有线索与待查 |
| --- | --- | --- |
| xie jiu / 2120047333 | #4380 久，『 混沌卧龙』修津高手 | 混沌历史榜第1，简介“带队使用”预设及“我们cacx真的太强啦”；三条本人参战KM与贝斯特拉宣传已核，已立[久短传](../../src/people/xie-jiu/materials-xie-jiu.md)；仍不凭设置名认FC。 |
| Leela Sirene / 1212703823 | Hito#872747 | PLA历史榜第1；Hito只是头衔片段，不并到HiToMinG／所思；本人事件与账号待查。 |
| Pstark Adoulin / 2114017643 | 乌黑的手 | RR历史榜第1；头衔“乌黑的手”，简介空，中文外号／管理身份未展开。 |
| CMFF / 2117820367 | 【默(Chilmore)】 | 暂留[默的线索](cmff.md)，三号同头衔同团归本人；MCX-CMFF的航母KM已核。不是乐章或刚子。 |
| SkyEagleMilize / 2120306116 | 天鹰 金色镰刀 | ES历史榜第1；本人链接总览与“天鹰流浪洞 Drifter”，是工具入口，不当本人战役或新B站账号。 |
| qiaobu123 / 2121450438 | #乔布 | 朱雀历史榜第1，军团简介Head-FC指向本号，中文头衔“乔布”；刀哥、GM Nito与Zelus三条KM已核，已立[乔布短传](../../src/people/qiaobu123/materials-qiaobu123.md)；其余入口留本人素材。 |
| La Rusa / 2118160416 | 奈何 | 暂留[奈何线索](la-rusa.md)，Obe泰坦击杀与2024虫洞拆迁入文；登记CEO号关系仍待核。 |
| Dema1 / 2115768319 | 德玛 | 红楼历史榜第1；头衔“德玛”，军团简介招新联系人；诗文未署名，不认本人原创，不据招新职务认CEO。 |

## 上一批明确同人及候选



- **晓天：Guifangq（2115482062）**。Family Guy历史榜第25，1136条、约1.714T；ESI头衔“晓天”，当前Infinity Avenger（98556933），与收录Guifangq Hate同词根、同中文头衔、同当前军团。归回[晓天](../../src/people/guifangq-hate/materials-guifangq-hate.md)，不另立传。
- **炽天：chitian hehehe（2113788113）**。Family Guy历史榜第27，994条、约414.40B；ESI完整头衔“炽天 清风不语，明月自来”，当前KZU（98808817），与收录号同词根、同头衔和同当前军团。**chitian xiao（2114917439）**也在同一Family Guy历史榜第40，729条、约275.08B，与已认号hehehe同词根、同历史军团，按同词根同军团规则合并；未读xiao当前头衔，不将历史榜当今日归属。两号归回[炽天](../../src/people/chitian/materials-chitian.md)。huhuhu仍缺对应记录。

## 优先候选与首批头衔

不凭军团高榜名次认定管理或FC；先保存外号与直接职责，再追事件、Monitor记录和社区账号。职位或普通参战统计单独不足以造个人故事。

| 角色 / ID | 人物线索 | 已有依据与下一步 |
| --- | --- | --- |
| Lemmily / 272243056 | 瑶光导演／Lemmily | 暂留[导演线索](lemmily.md)，ATXXI夜鹰出场已核；本人仍为简介列出的主要负责人，具体任期与社区故事待查。 |
| Ox00FFFFFFF BIS / 2114035946 | 奎恩 | 瑶光历史榜第4；本人头衔“奎恩”，简介为古文；中文社区事件与同人关系待查。 |
| LS-Somber / 2118767266 | 幽竹 | 瑶光历史榜第10；本人头衔“幽竹(主号)”，简介招新人并称作战船只军团包揽、每月单浪额外补损2B；招募承诺留[幽竹线索](ls-somber.md)，LS-Somber5／2119292222并入本人；PH文字是旧简介口径。 |
| Arthur Hemanseh / 96724929 | MasterChief／顶级猎手 | 伏羲历史榜第1；本人头衔“MasterChief - 顶级猎手”，简介空；继续找社区发言或代表战役。 |
| Zamira Mtskhetashi / 92761884 | 扎米拉 | 伏羲第2；本人头衔“扎米拉”、简介F1 Monkey；尚无独立事件。 |
| No Fung / 2112427316 | 老馮 | 伏羲第3；本人头衔“老馮”、简介F1 Monkey；不按常见姓氏合并已有角色。 |
| ForAeon / 2121683065 | 不回 | 伏羲第4；本人简介“呜呜呜，要被揍了（咬牙）”及番剧链接；属于游戏号自述，不能据番剧作者认本人B站账号。 |
| Medusa Serenity / 2114912504 | 代行天威 | 伏羲第5；头衔“代行天威”、简介空；主小号及社区故事待查。 |
| Cavick / 2112541174 | Cavick | 伏羲第6；头衔同英文名、简介空；中文外号与故事待查。 |
| Zack Raines / 2113144878 | 后天 | 伏羲第7；本人头衔“后天”、简介空；不把其他帖子中的普通时间词当本人。 |
| SamNeko / 2117340398 | SamNeko | 伏羲第9；头衔同角色名、简介空；身份待查。 |

星尘前十的剑穿天下、3V、911、那年、QY、逐风、楠哥、丁大炮已有[逐人入口](sg-cn-fc-followup-2026-10-12.md)，后续剑穿天下已凭具体Monitor记录立传；丁大炮已核本人BR，现退回线索，3V、911、那年、QY、逐风、楠哥仍缺个人事件。Family Guy前十旧调查见[糯米线索](cyan-nomi.md)。

## 剩余覆盖缺口

- 九月monthly后续50家均已取得，见覆盖表；下一步使用已有月榜与历史榜追具体人物，不重复抓同一成功榜单。
- 大多数角色目前只解析名字、查收录号与aliases，尚未读头衔、个人简介、Monitor、任期、代表战役或社区帖子；不把4834角色的名册保存当全部调查完成。
- 乔布、久已立传；奈何、默、导演退回线索；德玛仍优先找本人社区事件；有故事则立传，已收录人物小号并回本人。
- NanJing-9（2117364874）、yilifaerrrrrrr（2121295606）、Weightless01（2121209822）、ai weiyang（2116008826）与本站名字相近，但本次只拿到榜内历史归属，尚未对上相应收录号的相同军团／联盟或头衔；继续留认号线索，不只按英文片段合并。
- 首次榜单批次未新增大范围社区检索；乐章故事复用本地来源，莫凡事迹来自本人简介与原始KM。六人续查的社区搜索覆盖另列下方，不把重复搜索当增量。

## 六人写作续查（2026-10-12）

冻结首批：幽竹、久、丁大炮、导演、奈何、默。首轮前三人已归档并入文；本轮后续已补导演、奈何、默三人，原有查漏记录保留，具体增量见下方续查。名字对照已按当前收录号与明确aliases回填TSV；已收录不代表此人的全部号与经历调查完成。

- **导演／Lemmily（本批已收录）**：重新读取本人ESI，中文头衔“导演 Director”，简介仅两份“九”总览及Esaeel地点链接。瑶光公开军团简介已有Director①／主要负责人对应；九月普通榜本号第3、199条，九月Monitor榜只有War martyrdom Freedom、Cabbage66。客户端“eve欧服 瑶光 导演”一页无结果；网页组合查询只找到瑶光官网／wiki背景，没有本人事件。后续ATXXI名单已直接对上角色ID并立传；具体带队、任内故事与社区账号继续归本人素材。
- **奈何／La Rusa（现退回线索）**：本人中文头衔及简介CEO关系沿用，简介仍为广播与虫洞书签。沉默旅人九月Monitor页Top Characters与Top Ships为空，只限定该团该月份；不排除其他号或月份。“eve欧服 奈何 沉默旅人”一页命中[2023-08-10招新帖](https://tieba.baidu.com/p/8544703566)，正倒序各1页、3条主楼、无楼中楼，可见全文已读。楼主Miss幻º／原名fjlove6598／UID634182519称每晚收割、挺针、过洞及多种PVE活动；没有角色署名，旧帖同名组织与当前军团ID的承接未核，不归奈何，不保留通讯号码。下一步用该楼主的其他游戏主题找角色署名，再核对同名组织年代。
- **默／CMFF（现退回线索）**：中文头衔“默(Chilmore)”，SCG九月普通榜已有MCX-CMFF／2117820398（第10、34条）、MJ CMFF／2119866050（第28、10条），同词根同团按本人小号对应；Chilmore／2122002957（第26、11条）与本人头衔英文名相同且同团，归同一候选人。不能当成刚子。SCG九月Monitor页角色、船型榜均空；客户端“eve欧服 Chilmore”一页无结果，网页仅取得同名角色榜入口，尚无本人事件。后续三号中文头衔同为默，MCX-CMFF的绝念航母击杀已核并立传；同人依据与剩余缺口归本人素材。
- **新增Monitor候选**：War martyrdom Freedom／2115488091、Cabbage66／2116339735，瑶光／INIT九月Monitor榜各27条、合计54条，Top Ships仅Monitor。复用既有完整KM缓存，[138807390](https://zkillboard.com/kill/138807390/)中War martyrdom Freedom驾驶Monitor45534、瑶光98725234／INIT1900696668、伤害0，2026-09-30 13:43 UTC、Y-C3EQ，目标为红领鲸／FRT的Metenox Moon Drill；可据此记参与指挥，不认总指挥。该KM未找到Cabbage66，代表KM仍待读；其余高值入口138764476、138545187、138807210、138764462、138764450未在本轮逐条核读。后续两人中文头衔已对上黑山羊、小白菜，小白菜代表KM已核，两人已收录；同人和社区复盘缺口归本人素材，不并入本站白菜。
- **失败与阅读边界**：丁大炮BR在网页工具中不可访问，后以独立公开HTTP入口读取HTML及实际前端接口，完整响应已核；幽竹个人stats在Chrome的CDP连接阶段超时，目标页未导航，未重复尝试。三个Monitor榜读取均成功；奈何、默空榜不是终身零记录。公开搜索出现无关同名结果，不归人物。必要角色快照和头像由fetch脚本生成。

## 后续五人入文（2026-10-13）

- **[导演／Lemmily](lemmily.md)**：角色ID直接对上EVE_NT ATXXI名单，驾驶夜鹰代表PMA出场；同队Thunder ebon已对上本站166847438，追加其参赛经历并互链。比赛日期、具体轮次、指挥身份未取得，普通竞技落败不记黑料；其他队员保留在[共享赛事摘要](../sources/atxxi-pma-3816.md)，未完成逐人社区调查。
- **[默／CMFF](cmff.md)**：MCX-CMFF、MJ CMFF、Chilmore三号均同中文头衔、同SCG，合写一人。MCX-CMFF简介挂出的90444413已核，2021-02-03、2R-CRW、16名攻击者中记录本人太空舱船型；目标Thanatos／绝念为普通航母，不是超旗。个人KB与挂墙行为已入文，不编太空舱攻击航母的操作或指挥。
- **[黑山羊／War martyrdom Freedom](../../src/people/black-goat/materials-black-goat.md)**：ESI中文头衔明确，简介是月矿、矿物与虫洞资料。既有138807390确认2026-09-30、Y-C3EQ驾驶Monitor参与指挥；新读138764476则开灾难级海军型，两种船型分别叙述。个人KB已补，不因工具列表认矿业管理职责。
- **[小白菜／Cabbage66](../../src/people/cabbage66/materials-cabbage66.md)**：ESI头衔“小白菜”，与本站白菜无同人依据。完整138764476原始名单确认2026-09-28、Y-C3EQ、瑶光／INIT、Monitor船型，已立短传并与黑山羊互链。空简介与两个搜索分支未给出新社区账号，不认终身无发言。
- **[奈何／La Rusa](la-rusa.md)**：旧招新帖作者主题列表仅一条EVE帖，吧名为eve；当前98817783军团成立于2025-11-11，不能直接将2023同名帖接为此团史，服务器及组织承接仍待核。改查本人KB与原始名单，取得Obe冥府击杀及2024年Lazerhawks六条虫洞结构拆迁经历，已写传；旧帖认号不是前置条件。公开简介CEO与登记CEO号2123893786的同人关系仍缺，不合并。
- 本轮五号个人KB分别取得，按收录号范围表述；各小号统计不相加。九月50团缓存与旧历史榜复用，仅新增角色、事件和账号分支；每份名单取得、个体认号与入文继续分别记录。
- 浏览器在本机CDP连接阶段超时，未导航到138764476；随后公开zKB API及对应ESI均200，原始记录完整可读，没有因站点拦截切换出口。EVE_NT两个人物页超时，比赛页完整且链接ID已对上，不反复读取人物页。奈何的常用词搜索命中普通连词与无关小说内容，不归人物。
