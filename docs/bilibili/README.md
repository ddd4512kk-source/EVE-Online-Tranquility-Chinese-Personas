# B站档案：先复用，再补缺口

用[材料查询](../research-method.md#本地材料查询)按需定位账号，不另存全员总表。这里每个 `<UID>.json` 是该账号唯一的身份、频道与作品状态档案；人物档案通过 `identity.person` 自动关联，不再维护另一份UID。具体人物事件与作品摘记仍在本人 `materials-*.md`，JSON只保存可复用的公开元数据、状态和指向摘记的链接。两边各有分工，不互相重写。

## 找一份已有材料

1. 用 `npm run materials -- "人物或账号名" --kind bilibili` 定位UID档案，无需加载全员总表；或用 `node scripts/person-identity.mjs <人物短名或平台账号名>`，取得人物全部已对应账号。
2. `node scripts/bilibili-archive.mjs show 22271994` 只输出身份、profile、覆盖与作品状态，不倾倒整页频道目录。
3. `node scripts/bilibili-archive.mjs show 22271994 BV19X4y1n7da` 读取这一作品已存的简介、计数、署名状态及 `material_evidence`：从既有素材按需定位的原段落、章节、行号和范围说明，不另存摘要副本。`table_row`只表示表格引用，`prose_reference`只表示正文引用，均不自动升级消化状态；被截短的段落继续沿 `reading.material_refs` 读取。没有作品页档案时，先查 `channel.listings` 是否已有标题与确切BV。
4. 只有上述档案与素材均缺少本次需要的具体内容，才按[取材手册](../research-method.md#4-b-站与贴吧同等重要)定向联网。缓存清理、换会话、没有精选、没有完成全频道阅读，都不是刷新理由。

## 战役视频候选

`node scripts/bilibili-archive.mjs candidates atioth-2026 0` 按战役日期区间从正式作品页及频道候选中查找，综合标题和简介的大战主题、星系与BR，不按播放量筛选。带时区的发布时间先转换为UTC日期；只有中文日期的频道卡片保留UTC前一天及当天的可能，原始日期不改写。发布日期距战役不足5天者全部进入复查池：有大战主题者列高概率关联，标题未点名大战或星系者标为待补简介，不得在读取前排除。同主报链接者优先；不同BR仍可按实际时间地点确认。频道卡片与作品页分开标明，联合投稿BV去重，卡片所在频道不冒作原作者。每页10条，偏移翻页。结果不自动写入推荐，也不自动判断原录像阵营；明确别场内容须人工排除。人工结论复用 `battle-videos` 增量复查项。`node scripts/bilibili-archive.mjs candidates all [偏移]` 按全站战役盘点日期候选、待补简介和未取得作品页数量，逐场续查；这是派生查询，不另存候选总表。

## 简介里的战报查漏

`node scripts/bilibili-archive.mjs reports 0 10` 按UID／BV分页提取当前及历史简介的公开BR入口，支持br.evetools、killmail.app、WarBeacon与旧br.inyour.space；偏移从0开始，单页最多20条。链接、取得版本、同链接战役来源及战役素材提及均从正式档案按需生成，不另存索引。未匹配只能说明本地尚无同链接引用，不能自动认作漏收战役；已提及也不代表战报已核。读取与后续处理按[取材手册](../research-method.md#来源对战役时区与战报)。

清理简介联系方式时保留同一行的公开BR链接，不保留联系方式正文。战役视频选取按[内容规则](../content-rules.md#战役)，战役候选不套低播放粗筛。

## 字段与状态

UID用字符串，BV区分大小写；一个UID一个文件，一个BV在该账号只记一次；图文用`opus:<字符串ID>`，旧专栏用`article:<字符串cv号>`作key，分别在`posts[]`去重。图文ID可能超过JavaScript安全整数范围，必须保存字符串。账号名、视频标题会变，不能拿名字作主键。

| 字段 | 含义与维护处 |
| --- | --- |
| `version`、`uid`、`name`、`url` | 档案版本1、稳定UID、公开账号名、规范主页。 |
| `identity.state` | `confirmed`已对应；`candidate`待核；`associated`官号或关联，未归个人；`source`事件来源账号；`excluded`已排除。身份状态与作品阅读无关。 |
| `identity.person`、`material`、`evidence` | 已收录人物短名、正式素材路径、账号对应依据。未立传者短名留空、素材指向线索；不把关联人物冒作运营者。详见[人物身份数据](../person-identity.md)。 |
| `identity.related` | 其他关联素材与排除依据，不自动归给这些人物。 |
| `discovery` | 尚未读取空间的旧搜索线索：题材、原扫描记录、取得范围及下一步；只有标题、没有BV时不虚造作品页档案。 |
| `channel.tag_review` | 旧调查中本人账号尚不满足B站标签的具体原因与范围；不自动改列传标签，不把旧计数当现值。 |
| `channel.profile` | 当时公开名片、签名或尚未拆分的`header_text`、计数、取得时间和来源；计数保留原显示单位，不当今日实时数据。 |
| `channel.coverage.latest/popular/series` | 最新、最多播放、合集分别保存状态、日期、页次／范围及依据；一个排序不能替代另一个。 |
| `channel.prior_notes` | 迁移前已有的阅读／缺口原文，保留可复用信息；不是当前使用状态，旧“已精选”以`videos[].usage`为准。未校准时先读这些记录，不能视为没调查过。 |
| `channel.listings` | 已取得频道页的确切BV与标题候选。`unverified`不证明选中过哪个排序；可见卡片不证明已核作品作者、简介或评论。`all`表示合并保存的公开投稿目录（标题、已有发布日与当时播放），实际范围以`scope`与`verification`为准，不能仅凭排序名认定收全；可按已有播放或日期排序筛候选，先复用它，不重复拉取已成功保存的列表。 |
| `channel.coverage.opus` | 图文投稿列表的独立覆盖，入口为`https://space.bilibili.com/<UID>/upload/opus`；缺省为`unknown`，不迁改全部旧档案。保存实际页次／滚动范围、取得日期、来源和未读断点；视频排序、动态首页不能替代。 |
| `posts[]` | 同一UID内的图文／旧专栏；字段与导入约定见下节。未登记不等于账号没有图文。 |
| `videos[]` | 已核对应作品页的BV、上传者UID、标题、发布日期、简介、当时播放与评论计数。`captured_at:null`表示旧API缓存没保留取得日期，不能用文件修改时间补造。 |
| `videos[].credit` | 创作、原作、转载或团队署名。导入默认`unreviewed`，owner只证明上传者；有外部原作链接不自动认定翻译由UP完成。 |
| `videos[].reading` | 取得与消化状态，见下表；素材引用可带稳定`bili-bv…`锚点。 |
| `videos[].usage` | `body`与`selected`从当前人物正文核对，不手填；同一BV不得两者均为true。正文简称仍需人工核对，标题匹配只是辅助。 |
| `videos[].description_history` | 再取得时简介发生变化，保留旧公开版本及原取得日期；不覆盖已完成摘要或阅读范围。 |

### 频道覆盖

- **目录数量核对**：UP主可以隐藏视频，投稿接口的 `page.total` 与网页当前公开视频数不同是正常现象，差额不算漏查。`channel.listings[].verification` 保存核对日期、网页公开数量、已存目录数、旧接口总数与实际结论；`count_matched` 只表示数量对齐及本次可见入口已核，不表示逐项重读全部历史投稿。旧入口多于当前公开数量时保留历史记录，不自动删除；只有实际可见而尚未归档的入口、明确未取得的分页才记目录缺口。目录候选也不证明作品作者、简介或评论已核。
- `unknown`：还没核定已有覆盖，先看既有素材；不等于从未读过。
- `legacy_record`：旧素材已有范围或缺口说明，尚未整理成新字段；必须先读`prior_notes`。
- `captured`：确实取得了这个排序／合集的公开文本与入口，范围写清。不能据此声称每项作品已读。
- `reviewed`：已经人工核对范围、排序选中状态和相关候选，保存日期与范围。不是全频道已读完。

### 作品阅读

- `captured`：作品页元数据已持久保存，不能据读取工具输出`read`就称已经消化。
- `material_linked`：正式素材已经引用这个BV；可能是详细摘要，也可能只有候选名录，须沿链接读原范围。不能自动降成“未读”或自动升成“评论全读”。
- `digested`：人工确认关键内容、上下文、署名和边界已落进正式素材。必填`material_refs`与`scope`，写明读了简介、哪些主评论／作者回复，未翻页或未展开之处；可记`reviewed_at`。不要求穷尽所有评论。

入文是另外一条轴：已经消化可以不入文；从精选撤下不撤回消化，也不记成质量不佳。正文已经展开同一作品，精选另选或留空。翻译、搬运可候选，联合制作仍按内容规则处理。

## 图文与旧专栏

查UP时要单独检查图文投稿列表；先复用已有覆盖与`channel.listings`，记录实际可见范围及候选。列表可在`channel.listings`增加`ordering: "opus"`项，附`source`、`captured_at`、`scope`及`candidates: [{key, title, url}]`，只存已见的确切入口；列表摘要不作为作品正文导入。单篇用`posts[]`保存公开文字，详细事件、作者回应及解读仍归原有素材。

`posts[]`与`videos[]`并列，不把图文伪造为BV，也不另建UP名单。`key`、`kind`（`opus`或`article`）、`id`、`url`、`owner_uid`标识作品；`title`可空，不拿正文第一句冒充标题；`text`存清理隐私后的公开文字，`published_at`与`captured_at`未知留null，`capture_scope`写清全文／节选、图片和评论是否实际读过。`credit`、`reading`、`usage`沿用现有分工；再导入保留人工状态和`text_history`中的旧文字、标题与取得范围。旧专栏与新版图文不凭标题或相同数字自动合并；动态链接先核到实际作品规范链接，转发者不冒作原作者。

读取器现在接受`/upload/opus`列表及单篇`/opus/<ID>`、`/read/cv<ID>`；列表和单篇仍输出可见DOM，不自动判定图文正文／作者，也不自动翻页。**Chrome原始图文输出尚不能直接import**：先人工核对作品作者、正文与范围，整理为下面的离线导入格式。不能拿整页导航、相关推荐、动态摘要或加载壳填正文，也不凭工具输出的`partial`推定已读。图片上的文字须逐图核读后在素材摘要，不能因拿到图片链接而称已读；评论未加载单独记缺口。

```json
{
  "source": "https://www.bilibili.com/opus/1182987654321098765",
  "status": "read",
  "at": null,
  "coverage": "公开正文文字；图片、评论未读",
  "metadata": {
    "kind": "opus",
    "id": "1182987654321098765",
    "owner": { "mid": "123" },
    "title": "",
    "published_at": null,
    "text": "这里填写实际核读且清理隐私后的公开正文。"
  }
}
```

以上为格式示例，不代表真实作品。旧专栏改为`kind: "article"`，`id`仅填cv后的数字字符串，source为`https://www.bilibili.com/read/cv<ID>`。用现有`import`命令导入，仍须预先登记作者UID；之后sync与check同时处理视频、图文。`show <UID> opus:<ID>`或`show <UID> article:<ID>`读取单篇及既有素材证据，`show <UID>`同时返回图文状态与独立覆盖。素材用规范作品URL互链；只有标题的图文继续留在频道候选。图文正文中的BR／KM入口须人工续查，当前`reports`和战役视频候选命令仍只扫描视频简介，不声称覆盖图文。

## 增量归档

公开作品页取得后，可离线导入：

```bash
node scripts/bilibili-archive.mjs import .cache/某次读取/001.json
npm run bilibili:sync
npm run bilibili:check
```

导入支持现有Chrome作品页结果和旧公开API视频元数据；按实际owner UID归档，只接受与metadata BV一致的作品页。未知UID须先登记身份，不擅自认人。再导入不会回退人工阅读状态，也不会覆盖旧简介。此命令没有网络能力，不保存Cookie、完整页面DOM、全部评论或二进制。

有价值的内容由人工写入本人素材：标题与BV、时间、简介要点、作者与相关人物回应、具体上下文、原作／BR／KM入口、未核部分。不要只写“已读”“有趣”或一句推荐理由。已有详细摘要直接加锚点和档案引用，不重新写一遍。只有标题的作品保留候选，不能编内容；无关及隐私内容不迁入。

完成摘要后把对应作品改为`digested`，指向正式素材锚点，再运行sync。清理临时缓存前，确认有价值的独有文字已在正式素材或公开元数据档案中；不以“页面取到了”代替消化。往后只补新增作品、明确未读部分或确有必要刷新的字段，不重读所有UP。

`npm run check`与`npm run build`均先检查使用状态是否同步、素材路径与摘要锚点是否存在、UID/BV／图文key是否一致、正文与精选是否重复。校验和sync全程离线，不启动浏览器；脚本整理元数据和状态，不批量生成列传故事。

## 扫描记录

扫描方法只维护在[取材手册](../research-method.md#b站扫描队列)。`node scripts/bilibili-archive.mjs scans` 读取 `scans.json` 中的实际覆盖、旧排除范围和续查断点；它不列全部UP，也不启动搜索。已知候选仍各归UID档案，不在扫描记录另抄身份／作品状态。查询候选可用 `npm run materials -- --kind bilibili --limit 10 --offset 0` 后沿分页读取；默认输出不表示这些账号已对应人物。
