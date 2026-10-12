# DC／Goons 九月月榜：Chrome 实读增量

2026-10-12。系统 Chrome 的本机连接已配置并实读成功，使用独立浏览器资料，不读取日常浏览器资料。此前 HTTP／Chromium 的 403 是对应方式的抓取失败，不能写成月榜功能受限。

## 范围

九月使用显式 `year/2026/month/9/`；本月 `/top/` 是十月截至查询时的数据。四团各读取角色榜前100名，角色ID、名次与参与击杀保存在[400条候选表](dc-goons-monthly-top-2026-10-12.tsv)，不是全体成员、CEO榜或完整活跃名册。

| 军团 / ID | 九月第一名 / ID | 参与击杀 | 来源 |
| --- | --- | --- | --- |
| PLA / 98190062 | Jason Yusi / 2114969276 | 301 | [九月榜](https://zkillboard.com/corporation/98190062/top/year/2026/month/9/) |
| BOP / 98547771 | Yu Tou / 2122088488 | 322 | [九月榜](https://zkillboard.com/corporation/98547771/top/year/2026/month/9/) |
| 宽带山 / 98626718 | Lin xian deng / 2120638286 | 407 | [九月榜](https://zkillboard.com/corporation/98626718/top/year/2026/month/9/) |
| Dusk / 98817310 | Wenda / 2118088398 | 342 | [九月榜](https://zkillboard.com/corporation/98817310/top/year/2026/month/9/) |

PLA十月榜另核：Aeviter Cynosure排1，140条；凯撒Reinhard Merlin排59，28条。九月前100名未找到凯撒，不据此断言九月没有出勤。

## Monitor筛选与新候选

在四团九月榜路径后加 `ship/45534/`，实读的Top Ships只剩Monitor，角色榜分别变成4、1、1、1条，筛选确实生效。计数是驾驶该船参与击杀的月榜记录，不是出勤场次或指挥胜场。

| 军团 | 角色 / ID | 九月Monitor记录 | 处理 |
| --- | --- | --- | --- |
| PLA | zrxzhh / 2122520286 | 6 | 已收录 |
| PLA | NanJin / 2122496778 | 1 | 已收录 |
| PLA | TweakCuke / 2122236855 | 1 | 已立TC短传，头衔TC |
| PLA | TweakCukess / 2123738920 | 1 | 同词根、同团、同头衔，归TC同一人，已入本人素材 |
| BOP | virustao wang / 2115847829 | 3 | 已立赤翼短传，头衔“赤翼-大炮是丈量国土面积” |
| 宽带山 | LED Apterbringer / 2115988005 | 49 | 已收录低调 |
| Dusk | Aitt duominx / 2118339639 | 4 | 已对应多米 |

**TC代表KM**：[138365432](https://zkillboard.com/kill/138365432/)，2026-09-11 15:23 UTC，HB-5L3，目标为Glory Navy／FRT铁壁。展开“List all pilots”后，TweakCuke和TweakCukess均明确显示Monitor、PLA／Goons、伤害0；本日ESI也显示两号当前在PLA、头衔相同。联系号码不留存。这只是建筑行动参与，不扩写为旗舰会战，不把整张KM独算个人功劳。

**赤翼代表KM**：[138726918](https://zkillboard.com/kill/138726918/)，2026-09-27 02:21 UTC，G-M4GK，目标k'dai的Lachesis。完整驾驶员列表显示virustao wang驾驶Monitor，BOP／DC，伤害0。九月同团榜另有R virustao（2115982767，排12、95条）、virustao shao（2121649568，排92、6条），按同词根、同团归为本人小号；逐号统计不相加。R virustao也出现在同场KM。简介中的“B.O.P冠希传电频道”只是频道入口，不据此另认作冠希本人。

默认KM页面只显示部分驾驶员，零伤害Monitor须展开后才看见；只看默认列表会漏掉FC。本轮已对上述两张代表KM展开并核到本人。另读138807995，但未把没有对应到TC的记录挂到TC身上。

## 其他中文头衔入口

本日另读ESI：Jason Yusi为“青春”，简介署B站“青春的工作室”、YouTube“Jason Yus i”，有旗舰刷怪教学入口；Agus Amar为“阿古斯”；Yu Tou为“鱼头”；Jungle Chan为“程正果”；Lin xian deng为“林先登 MVP”；Wenda为“文大”。这几号当前军团与对应月榜军团吻合。

Jason Yusi不凭“青春”并到叶落sk mmmm，名字和军团不同，缺同人桥。鱼头简介挂自己失误的KM，Jungle Chan反复挂本人帕拉丁损失；这里只保留原件入口，不凭重复链接编造多次翻车。程正果的简介自嘲保留短篇；阿古斯仅有总览分享，现退回[单人线索](agus-amar.md)；其他视频、具体事件和社区署名仍待补，不把入文等同全部读完。

## 已完成与缺口

已取得并核读四团九月各前100名、四团Monitor榜、PLA十月前100名，抽读9个角色的ESI，核读两张新候选代表KM。新Monitor自然人方向为赤翼、TC，尚缺独立社区故事与常用名号。其他DC／Goons军团仍未读，400行名字不等于400人调查完成；首轮先查线索；后续已按具体Monitor事件立赤翼、TC短传，社区故事继续补。

可复用读取工具为 `scripts/research/chrome-read.mjs`：WSL通过Windows Node连接系统Chrome，提取正文、表格、角色ID和击杀链接；浏览器导航仍计预算，不重置HTTP停止记录。

## 前20固定续查队列

四团各前20，共80个角色条目，逐号的来源、名次、ID、对应人物、当前处理与下一步集中在[状态表](dc-goons-top20-intake-2026-10-12.tsv)。这是角色条目数，不是80个自然人；主小号归同一人，不重抓已取得的原榜。

先追已有中文名与平台入口：PLA的Jason Yusi、Agus Amar，BOP的Yu Tou、Jungle Chan，宽带山的Lin xian deng、Burningleek，Dusk的Wenda。已有角色的故事与指挥依据分别核对；阿古斯、燃烧的韭菜、没钱要命目前留单人线索，程正果保留具体自嘲故事，金刚保留星城自吹。TC、骨猫属于原80条之外的增量，不回算进前20覆盖。

2026-10-12离线对照旧DC战报集合，21个前20条目有缓存BR入口，已存状态表；参与者索引不自动认作主战场或指挥。宽带山前20全部能对上[公开账号组](kds-account-groups-2026-10-12.md)，分组取得不等于故事已读。赤翼与TC的具体KM及同人依据归本人素材。
