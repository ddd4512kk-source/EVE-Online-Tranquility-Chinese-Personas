# 阿巴宗摆千人擂台，谁都想来收门票 · 素材

## 战报口径（2026-10-20）

- 来源：https://br.evetools.org/battle/17676
- 星系：Ahbazon（30005196）；完整接口读取成功。
- UTC窗口：2026-08-01T16:58:16.000Z 至 2026-08-01T21:25:46.000Z。
- 按KM ID去重，共1373条损失记录（含太空舱等），1959个角色，合计642.625518189B。
- 数字编号网页摘要可能与逐KM金额略有差异；页面采用快照逐KM金额，不混用摘要金额。
- 本接口没有作者分队。主战按无畏交火大致分为两阵营：Minmatar Fleet Alliance、Minmatar Fleet Associates、Amarr Fleet Alliance一组；INIT、SND、Dragon Riders Legion、TEST、Shadow Cartel、URSA、Psyno Theory、Seker Matar一组。FRT、Solyaris Chtonium、SYN、NC、蜜蜂、Brave、Snuffed Out点名为第三方。其余未点名组织按交火推断；此为本场主战统计归组，不表示各组织完全互不交火或长期结盟。
- 仅有战报，开战缘由、具体动员与战场命令仍缺公开文字复盘；不凭胜负指定总指挥或归责。
- 首轮网页工具访问失败，curl取得404；随后Node GET取得正常网页，读取网页主脚本确认数字入口为 /newapi/br/battle/<ID>，再取得完整JSON。三条数字链接站外精确搜索零命中，不作为事件不存在的依据。

## 分方与人物

### Minmatar及无畏友军

549角色，损失368.027087B，483条损失记录；无已收录人物命中。

### INIT、SND及无畏诸部

785角色，损失208.983946B，490条损失记录。

- [Awakeallnight](../../src/people/awakeallnight/awakeallnight.md)：命中角色 2114626303；舰船typeID 639、670、19720、24698、0。损失KM：[137409983](https://zkillboard.com/kill/137409983/)（typeID 639，0.256B）、[137410786](https://zkillboard.com/kill/137410786/)（typeID 19720，4.868B）。
- [红名](../../src/people/hm-hongming/hm-hongming.md)：命中角色 2114820390；舰船typeID 639。无本窗口损失记录。

### 第三方

625角色，损失65.614485B，400条损失记录。

- [W佬](../../src/people/jubah-musanji/jubah-musanji.md)：命中角色 93331025；舰船typeID 11184、670。损失KM：[137412720](https://zkillboard.com/kill/137412720/)（typeID 11184，0.029B）。
- [哈威](../../src/people/husky-weoo/husky-weoo.md)：命中角色 2123311408；舰船typeID 11184。无本窗口损失记录。
- [极端荣耀](../../src/people/silvitni/silvitni.md)：命中角色 1664583033；舰船typeID 639、33328、641。损失KM：[137410021](https://zkillboard.com/kill/137410021/)（typeID 639，0.278B）。
- [方小明](../../src/people/fang-xiaoming/fang-xiaoming.md)：命中角色 2113415433；舰船typeID 644、0。无本窗口损失记录。
- [一捆烂胶带](../../src/people/sickle-alter/sickle-alter.md)：命中角色 2114508645；舰船typeID 639。无本窗口损失记录。
- [青春（PLA）](../../src/people/jason-yusi/jason-yusi.md)：命中角色 2114969276；舰船typeID 639、670、640、0。损失KM：[137410186](https://zkillboard.com/kill/137410186/)（typeID 639，0.271B）、[137410806](https://zkillboard.com/kill/137410806/)（typeID 640，0.143B）。

## 续查

已取得完整战报，按全部KM解析并对照全部收录号与已登记小号，快照保留完整参战对应。人物具体船型、指挥位与独立情节的增补以本人素材和后续复盘为准。未知组织是否为华人军团需有组织依据，不能仅靠中文角色名打标。

## 舰船与部署物名称核对

2026-10-20用CCP ESI universe/names批量核对typeID：11184为Crusader（十字军），11387为Hyena（土狼），24694为Maelstrom（死亡漩涡），42124为Vehement（猛烈），33475为Mobile Tractor Unit，33476为Mobile Cynosural Inhibitor。部署物损失不写成小船或舰船损失；舰型中文名沿本站术语表。

## 主战与第三方口径修正（2026-10-20）

- FRT、Solyaris Chtonium（1042504553）、Synergy of Steel（99002685，SYN）属于第三方，不以其出场人数定义本场主战阵营。北方联盟原与FRT合组，随赶场队伍列第三方。
- 完整接口的485组（无畏）逐角色读取：Minmatar Fleet Alliance 23号、SND（Stain Neurodiverse Democracy，99013072）19号、Dragon Riders Legion 7号、TEST 6号、Amarr Fleet Alliance（99015143）6号、Shadow Cartel 6号；这是本场KM中出现的驾驶角色，不是同时在场或全部投放数。
- 无畏损失：Minmatar Fleet Alliance 12条、108.955698B；SND 2条、9.408491B；Dragon Riders Legion 6条、29.027280B；TEST 6条、24.960352B；Amarr Fleet Alliance 3条、14.739144B。INIT有2个无畏驾驶角色并损失2条凤凰级海军型，共14.645541B；FRT有1个无畏驾驶角色并损失1条，共7.222128B。少量无畏出场不自动改变第三方身份。
- 主战按无畏势力大致分两阵营，INIT归主战一侧；归组以对Minmatar的主要无畏交火方向为准：SND无畏出现在11条Minmatar无畏损失中，Dragon Riders Legion为10条，INIT为7条，TEST为4条。Minmatar无畏则分别出现在TEST、Dragon Riders Legion各5条无畏损失中。组织间存在交叉击杀，不据统计归组声称完全协同或互不攻击。
- 联盟名称由CCP ESI universe/names按本场ID读取；舰型、角色与KM取自同一完整战报接口。未读取视频、音频或字幕。

## 本地视频对应（2026-10-20）

本轮仅复用本地缓存的公开元数据、简介与既有素材中已归档的评论；未联网取材，未读取影像、音轨或字幕。下列介绍不包含视听质量评价。

- 待补候选：[BV1yN3S6GEAm](https://www.bilibili.com/video/BV1yN3S6GEAm/)，Awakeallnight，《6000亿战损！阿巴宗千人会战》，2026-08-01发布；本地简介为空，尚缺交战日期或战报链，不能仅按投稿日与量级认作本场。BV1cEKC6rEP9标题明确2026-07-19，属另场，排除。

## 本地视频对应（2026-10-22）

本轮仅按本地B站档案（`docs/bilibili/`）中的标题、投稿日与简介，以及YouTube搜索页公开的标题与频道名对应本场；未读取影像、音轨或字幕，介绍只转述标题与简介。

- [【EVE】6000亿战损！阿巴宗千人会战](https://www.bilibili.com/video/BV1yN3S6GEAm/)：标题指名阿巴宗千人会战。
- [【EVE】2026.8.2 阿巴宗千人会战  T2指挥航连续陨落  高低安零零各势力自由开火](https://www.bilibili.com/video/BV19y3U6dEA1/)：标题写2026.8.2（北京时间）阿巴宗千人会战。
