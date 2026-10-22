# 马瑟拉，2026-05-31

## 来源与实际阅读范围

- [BR 6a1c88b7902913b29a68c4cf](https://br.evetools.org/br/6a1c88b7902913b29a68c4cf)：正式composition接口完整响应，194条去重KM；使用仓库`buildSnapshot`、`stringifySnapshot`生成本目录`maseera-2026.json` 的 `br`，未手编快照。原始响应本轮保存在`/tmp/eve-next-maseera/br-raw.json`。
- [Megaman39，AAR: Cartel Only a Shadow of its Former Self 500b Down](https://www.reddit.com/r/Eve/comments/1tu263h/)，2026-06-01：Sedition一方复盘，主帖及58条评论全部读取，分页完成、无错误；评论末条到2026-06-07。原帖与评论JSON、易读全文分别在`/tmp/eve-next-maseera/reddit-1tu263h.json`、`reddit-output.txt`。正文只消化公开文字，未读帖中视频、图片、音频、字幕或转录。
- [CCP ESI星系中文资料](https://esi.evetech.net/latest/universe/systems/30004235/?language=zh)：Maseera中文名为“马瑟拉”，星系ID30004235；原响应在`/tmp/eve-next-maseera/maseera-system-zh.json`。

## 事件与双方说法

Megaman39把本场放在持续数月的低安设施战里：Shadow Cartel被俄罗斯组织赶离无人机区后部署Aridia；此前双方已在Essence、Domain及高低安争结构、计时和月矿，Sedition约两个月前开始持续打行星海关。其九十天“250+海关、65+Metenox”与前期数场无畏战约400B，均是作者对战役前史的说法，不是马瑟拉单场战果，不加进本场损失。文章另列多个星系和战报，未逐一核读，不把这些链接视作已完成核查。

马瑟拉当晚，作者写Shadow Cartel继续向LSH及俄方盟友施压，Sedition加入防守，并以伏特加、土豆和无畏舰打趣俄方外交。Shadow Cartel上远射Triforce风格无畏及旗舰后勤，对方短射程旗舰直接落到其身边，形成大规模旗舰混战；Blackflag、高安组织、Triumvirate到场。作者挖苦Tri带约三人，评论Araneatrox认领了这个玩笑。文末也承认Shadow Cartel确实出旗舰接战，而非只在远处游走。本场直接目标是哪座设施、目标成败、双方具体发令者未取得，不补写。

W0wbagger-评论反驳作者的总体战争叙事：称对方联军约己方两倍，612轮海关增强最终取得约70座，Shadow Cartel当时在远处部署；自己一侧几乎全是组织发船，仍愿在人少时接战。**被毁海关数量与最终取得的海关数量不是同一指标**，这两项说法保留各自范围，不能把70直接当成250的数值纠错。该账号与具体游戏角色没有完成身份对应，正文只把他作为评论发言人，不填入人物或军团领导者。

其他评论争论计时时区、防守出勤与是否借盟友的力量写战果；不读附图，不从图片说明反推具体出勤数。作者与评论相互讥讽的内容作为战后争执，不当中立联盟史。

## 窗口、分方与数值

单星系Maseera，UTC2026-05-31 18:00—21:00；front matter与快照保留同一window。共526个去重角色、194条KM、504,486,807,345 ISK，属于大型战役。

| 归方 | 角色数 | 受害方损失 B | 损失记录 |
| --- | ---: | ---: | ---: |
| Shadow Cartel及友军 | 198 | 382.633418781 | 123 |
| Sedition、深水及友军 | 316 | 113.615399486 | 59 |
| 未归组残余 | 12 | 8.237989078 | 12 |

BR两队以Shadow Cartel（495729389）和Sedition.（99009845）／Deepwater Hooligans（99009927）为种子整队归方。第一队包括Wings Freedom.、Triumvirate.等，第二队包括Sedition、深水、PL、NC等。只说明本场交战站位，不是永久外交编制。

未归组12人是统计残余，不据此宣称存在独立战略第三方。按全站规则不显示小于30人的第三方，原始记录及全场合计保留。FRT关联Chaos arbiter角色未出现在作者两队定义中，不能仅凭联盟名强并进主方。

## 华人军团与人物对应

本轮全量对照526名角色与本站`peopleIndex`的收录号及已登记小号，零人物命中；不等于没有华人。依现有名称表`chinese:true`军团标记，有5个直接出场角色：

| 角色及ID | 军团及ID | 本场归属 |
| --- | --- | --- |
| haley thefith，432227175 | ChuangShi，98535868 | Wings Freedom.，99014783；Shadow Cartel侧 |
| Tasaro Sunji，2119871784 | ChuangShi，98535868 | 同上 |
| Cockroach Killer，2116307433 | Family Guy.，98798876 | Deepwater Hooligans，99009927；Sedition／深水侧 |
| lIlIlIIllIIIlll，2117919109 | Family Guy.，98798876 | 同上 |
| Beginning of winter，2123139185 | Chaos arbiter，98598862 | FRT，99003581；未归组残余 |

五个角色名经ESI批量查名返回，角色ID与全站已收录人物未对上。只按现有华人军团标记取样，不声称穷尽所有华人组织；不因一次参战新立人物，也不替这些角色推定指挥责任。

## 后续入口与访问记录

本场已取得、核读、归档并入文；待补目标设施与结果、双方发令者及角色身份对应，出现具体当事人文字再追。Reddit使用既定PullPush入口，历史冷却时间已过后读取一次主帖与一次完整评论分页；BR、角色ESI批量查名、星系中文名各一次，共5次成功请求。没有用其他路径重试受限来源。
