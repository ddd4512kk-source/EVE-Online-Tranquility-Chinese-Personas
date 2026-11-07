# MTO2-2：援军堵在自家门，退路烧成太空灰

## 来源与窗口

- 主报：[br.evetools 6aea46ee795df616e2011459](https://br.evetools.org/br/6aea46ee795df616e2011459)，2026-11-04 实际打开网页、展开 A/B 全部组织列表，并读取同页 composition 数据。MTO2-2（30005189），UTC 2026-11-03 19:00—23:00；实际记录 19:44—22:52。1225 条 KM、1408 个角色，总损失 1493.035959924B。仅采用本星系、本窗口，不把外地诱饵信标损失加进来。
- 主报网页初始队头：A 605 人、505.37B、364 条 Ships Lost；B 793 人、987.66B、860 条 Ships Lost。网页全场 1225 KM，队头相加为1224；队头人数相加1398，少于全场1408。保留网页原显示，不强行填平。本站按逐角色并集及受害方逐 KM 计算，建筑、太空舱都在损失记录口径内。
- 原作者复盘：[Peng_Wei，(AAR) 1.4 TRILLION ISK DREAD BRAWL IN NULLSEC - BIGAB/PROBS vs BOSS/FRT/SYN](https://www.reddit.com/r/Eve/comments/1xn76hv/aar_14_trillion_isk_dread_brawl_in_nullsec/)，2026-11-04 阅读正文及当前展开评论；不是把搬运站摘要当原文。
- 复盘主链：[6aea4e373e3b130016bbe956](https://br.evetools.org/br/6aea4e373e3b130016bbe956)，实际打开核到 MTO2-2、NIM-FY 两星系，UTC 2026-11-03 20:00—23:00；读取时1519人、1232 KM，A 527.73B、B 942.63B，合计1470.36B。此版少了主报19:00—20:00的MTO记录，增加NIM-FY，不并入本站数字；它把STAKAN放A、HK放B，与交火方向相符，ITTY仍放A，不能整份照抄。
- 评论 riftergaming 附[修正版6aea5a6df8fa9404a38bb20e](https://br.evetools.org/br/6aea5a6df8fa9404a38bb20e)。仅取得链接，未读取该版，不以“updated”字样自动替换主报。
- [DOTLAN 主权事件](https://evemaps.dotlan.net/region/Perrigen_Falls/changes)：2026-11-02 23:02，BOSS失去MTO2-2，Deepwater获得，交叉支持复盘“前一天丢主权枢纽”的背景。

## 事件骨架与来源方说法

复盘作者是BIGAB一方的Peng_Wei；游戏战报同名角色96825960也在BIGAB，本次只用于辨别发言视角，不新增人物身份合并。

1. MTO2-2通往Venal的区域星门是BOSS的撤离通道。主权枢纽失守后不能开启诱导干扰；本日两座BOSS铁壁都到最后计时，BOSS为第一座全力集结，称其为自己的“alamo”。不能因此写成本窗口两座铁壁均被击毁。
2. BIGAB叫来PROBS、XIX等；BOSS叫来凛冬和HK等无人机区队伍。双方先由战列舰交战：进攻方约320条（马克瑞、灾难海军队），防守方约365条（暴风舰队、乌鸦、噩梦队）。数字是复盘说法，非本站角色人数。
3. PROBS一方先投无畏打敌方FAX；BOSS反投自己的无畏，BIGAB也全面投入。凛冬约80条无畏在中转两座POS上线，准备增援。复盘给出的总投入为进攻方159条无畏、守军196条；不是损失数，且覆盖复盘多星系窗口，正文只说守军投入更多。
4. BIGAB执行者Krimson Serenity提前安排拦截舰在UJX敌方POS旁下线，上线后给凛冬无畏围泡泡。复盘把情报来源戏称为天使托梦，不把这种修辞当真实情报手段。
5. 关键原文：“a player named Uber Eat convinced us to stop bubbling”；随后无畏离开并加入战斗。正文把Uber Eat对应既有梁天小号，写劝说停止封锁，不编具体交易、赎金或双方达成的条件。
6. 复盘说FRT有几条无畏跳入BIGAB集结地的诱饵信标，被铁壁击毁。发生在主报星系外，不附会成MTO的某几条损失；只采用有原帖出处的情节，不把这些船价并进1493B。
7. 复盘说BOSS常规队锚到三条智能炸弹涅斯托上，常规战也开始明显不利。评论Sure-Werewolf0说自己开Oneiros给ITTY/BOSS修船并生还，赞炸弹驾驶员刷出数页KM；SmoothParfait补充有人给锚点上网。正文只用前两项，未给未认号的锚点编人物名。
8. 防守方最终撤离，铁壁被击毁。主报同时含BOSS阿兹贝尔损失KM139654851（46.351200137B）和铁壁KM139658028（21.412629821B）；不把来源不同估值的47.3B、22.9B混入快照。

## 完整网页组织映射

以下为主报实际展开后的组织及网页人数。未标“军团”的均为联盟；小联盟出现只代表成员在场，不宣称统一动员。除下述HK、ITTY、STAKAN三项修正外，完整网页归组作为本场组织映射；全部写进唯一的`battle.sides[].organizations`，不让分队冲突后的自动推断随意重排小组织。

### 网页Team A

| 组织 | ID | 网页人数 | 本站归方 |
| --- | --- | --- | --- |
| Deepwater Hooligans | 99009927 | 240 | 进攻 |
| HOLD MY PROBS | 99012122 | 197 | 进攻 |
| Legion of xXDEATHXx | 1411711376 | 58 | 进攻 |
| Ferrata Victrix | 99007629 | 19 | 进攻 |
| Hard Knocks Citizens | 99005065 | 16 | 守军，修正 |
| Sedition. | 99009845 | 14 | 进攻 |
| Itty Bitty Asteroid Committee | 99013502 | 12 | 守军，修正 |
| 1400mm diplomacy.（军团） | 98830958 | 6 | 进攻 |
| THE RUSSIA | 99007969 | 4 | 进攻 |
| Ferrata Production Exec | 99014546 | 3 | 进攻 |
| Death or Glory | 917526329 | 3 | 进攻 |
| Kollective efforts（军团） | 98812994 | 3 | 进攻 |
| Diplomatic Incidents. | 99010312 | 3 | 进攻 |
| RS Rangers | 99014396 | 2 | 进攻 |
| Sportmodel | 99012279 | 2 | 进攻 |
| Amamake Private School（军团） | 98846661 | 1 | 进攻 |
| Enemy in System（军团） | 98476260 | 1 | 进攻 |
| Critical. Mass. | 99013690 | 1 | 进攻 |
| U N K N O W N | 99011095 | 1 | 进攻 |
| C A M E L O T | 99012464 | 1 | 进攻 |
| Lunar Luminescence | 99014050 | 1 | 进攻 |
| Fast Rabbits at Play（军团） | 98768225 | 1 | 进攻 |
| WILD FLAME（军团） | 98719510 | 1 | 进攻 |
| Whiskers of Doom.（军团） | 98580857 | 1 | 进攻 |
| Big Green Fly | 99011248 | 1 | 进攻 |
| ZER0P0INT（军团） | 98800867 | 1 | 进攻 |
| Crab plex for flex（军团） | 98754032 | 1 | 进攻 |
| Ministry of Inappropriate Footwork | 431502563 | 1 | 进攻 |
| The Relica's Alliance | 99012214 | 1 | 进攻 |
| Tearalament | 99013616 | 1 | 进攻 |
| Alternative Freight Services（军团） | 98678960 | 1 | 进攻 |
| HAMS ON WHEELS（军团） | 98428913 | 1 | 进攻 |
| Bird Corporation（军团） | 98762515 | 1 | 进攻 |
| Howitzers and Champagne | 99014391 | 1 | 进攻 |
| Multiboxxed（军团） | 98800848 | 1 | 进攻 |
| The Initiative. | 1900696668 | 1 | 进攻 |
| Raitaru Reapers（军团） | 98842166 | 1 | 进攻 |
| The Khan Initiative（军团） | 98665330 | 1 | 进攻 |

### 网页Team B

| 组织 | ID | 网页人数 | 本站归方 |
| --- | --- | --- | --- |
| Brotherhood of Spacers | 99007887 | 225 | 守军 |
| Fraternity. | 99003581 | 205 | 守军 |
| Synergy of Steel | 99002685 | 142 | 守军 |
| UA Fleets Holding | 99013045 | 27 | 守军 |
| The Skeleton Crew | 99008788 | 25 | 守军 |
| Siberian Squads | 99007203 | 23 | 守军 |
| xqtywiznalamywmodxfhhopawzpqyjdwrpeptuaenabjawdzku | 99011528 | 23 | 守军 |
| Test Alliance Please Ignore | 498125261 | 23 | 守军 |
| Ignore This. | 99000580 | 16 | 守军 |
| Death Legion of Capybaras | 99013766 | 14 | 守军 |
| STAKAN UNIVERSE | 99012328 | 12 | 进攻，修正 |
| Solyaris Chtonium | 1042504553 | 10 | 守军 |
| Fraternity Auxiliary | 99013541 | 6 | 守军，随FRT |
| Blades of Grass | 99005393 | 4 | 守军 |
| Northern Coalition. | 1727758877 | 4 | 守军 |
| Pandemic Legion | 386292982 | 3 | 守军 |
| Synergy of Support | 99014081 | 3 | 守军 |
| Hard Knocks Executors | 99013327 | 3 | 守军，随HK |
| Banderlogs Alliance | 99001317 | 3 | 守军 |
| Tilean Dominium | 99014321 | 3 | 守军 |
| DarkSide. | 99004804 | 3 | 守军 |
| Abyssal Brick Rollers | 99011828 | 2 | 守军 |
| Aurora.（军团） | 98778021 | 1 | 守军 |
| Magical Ponies and Butterflies（军团） | 142309059 | 1 | 守军 |
| Pride Association of New Eden（军团） | 98748279 | 1 | 守军 |
| Celestial Palace. | 99015206 | 1 | 守军 |
| ZERG REBORN | 99011387 | 1 | 守军 |

### 冲突交叉核对与采用理由

- HK：网页A与复盘“BOSS叫来HK”、作者另一版BR的B冲突。主报攻击者对旗舰的实际伤害：对Deepwater 1,659,404、PROBS 340,477、XIX 248,045、STAKAN147,554、Diplomatic Incidents.90,569、THE RUSSIA15,657；这些有实伤的旗舰目标都在进攻方，采用守军归属。HK Executors网页本来在B，保持同边。
- STAKAN：网页B与作者另一版BR的A、逐舰记录冲突。对BOSS旗舰实伤981,836、SYN337,293、UA278,666、长名联盟257,030、TEST相关Ignore This.54,922、FRT27,394；采用进攻方。不是依据长期外交换边。
- ITTY：主报A、作者版也A，但Sure-Werewolf0明确说为ITTY/BOSS修船。主报自身ITTY攻击Deepwater实伤11,441，没有对守军的正伤害；ITTY后勤损失由PROBS炸弹队、Deepwater打出。与参战者说法交叉，采用守军。不是把一条零散交叉命中当作第三方。
- 实伤汇总取主报已取得的逐舰记录；旗舰取泽尼塔及四族普通／部分海军无畏样本，足以核方向，不冒称全舰型总伤害。全文没有用0伤害判断人没出力。
- 逐方核对：修正后Deepwater/PROBS方602角色、505.460546202B、351条损失；BOSS/FRT方806角色、987.575413722B、874条损失。合计1408角色、1493.035959924B、1225条损失；无额外第三方。与网页初始队头差异来自组织修正及逐角色／逐KM计算，不能把605/793直接移植到本站。
- 全部联盟与其本场历史军团同方；FRT Auxiliary随FRT，HK Executors随HK。不用军团当前归属倒填历史，也不把单角色INIT参战写成全联盟站队。

## 战斗类型与人物

- 本场以双方成建制无畏混战为重要阶段，标签取“旗舰战”。主报KM139659582含Deepwater角色Gideon Ravenorr（95209820），俄洛巴斯级671，武器24554；2026-11-04 ESI中文type资料核为“俄洛巴斯级”和“'极光之仪'热能末日武器”。该记录只能证明一条泰坦列入攻击者，不能证明双方同时各投入至少10条超旗，不构成超旗战分类依据。记录伤害为0，不拿它作无效参战或嘲讽素材，也不补写命中效果。作者两星系版另有多条泰坦实伤记录，同样没有建立双方同时达到门槛的依据，且不移入主报数字。
- 自动认出四位自然人：进攻方MrPRO（陌然，2114453889）；守军Jubah Musanji（W佬，93331025）、Optimus Mecca（娃娃，96548383）及其既有小号、Uber Eat（2122203216→梁天96506815）。归方逐项对本场军团／联盟，而非现今名片。
- 梁天的小号对应已在`src/people/xaivada-skywalker/96506815-id.json`的`identity.alts`，原依据见其人物素材；不因本次复盘同名而另造同人依据。正文只将明确的Uber Eat劝说行为归本人，不把整支凛冬舰队的具体指令或损失归他。
- 陌然所在Family Guy.（98798876）／Deepwater；W佬The Soul Society（1218670486）／FRT；娃娃及本次命中的既有小号在Arknights.（98725089）／FRT；Uber Eat在抵抗之狐Fox of Resistance（98755298）／NC。名字按名称表核，角色与军团只代表本次记录，不推断指挥责任。
- 本场华人军团从既有名称表的`chinese`标记与快照自动产生，未为凑人数把外国军团标华人。人物已有正文未引用本场BR，无需替换旧链接；新增战役会自动生成四位人物的参战反链。

## 视频与阅读边界

本地材料与W佬频道档案未定位到W佬自己的投稿；原帖也没有附视频。2026-11-06 用B站搜索“MTO2 无畏”找到[BV1FUxm6KEro](https://www.bilibili.com/video/BV1FUxm6KEro/)（UP星月也想睡觉，UID 53247199，2026-11-04发布，播放1167、评论25）：简介原文“卡卡卡 切得有点快 眩晕预警！”并附本场BR（MTO2-2，30005189，202611032100），星系与日期对得上，已挂到战役页。只读了标题、简介和首屏评论，视频内容未看。UID 53247199已确认是娃娃（Optimus Mecca）本人账号，她本场在Arknights.／FRT；标题标“第一视角”，该账号同类标题评论都说是她自己的画面，但开什么船只据标题，不另指。评论里作者答“syn组的局看起来是”“又要回维纳尔恶心frt了”；有观众说被泡泡这么多无畏后还进去加码、亏400b，是观众估算，未核。评论摘要已入[娃娃素材](../../people/optimus-mecca/materials-optimus-mecca.md)。其余候选（Amamake、Satogas或他场搬运）均不是本场。
