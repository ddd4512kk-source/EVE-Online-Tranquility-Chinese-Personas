# 按问题复查，不重读全站

`npm run review` 离线扫描正式档案，只输出数量。脚本读取全站文件不消耗模型上下文；代理只读分页候选、对象卡片和必要段落。目录、块数、首次加入日期、身份对应、战役关联均按需计算，不维护另一份全员总表，也不把扫描结果当作已读。

## 先筛选，再定本批范围

```sh
npm run review -- list --feature combat --recent 30 --max-blocks 2 --limit 10
npm run review -- list --feature combat --signal battle-without-narrative --limit 10
npm run review -- card person:alero-araragiero --feature combat
npm run review -- read person:alero-araragiero --file material --from 20 --lines 25
```

- `list` 默认每页10条、最多20条，`--offset` 翻页；`--recent N` 先选最近首次加入的N篇，再筛料数。未提交新篇排在最前，日期为null；无Git历史时拒绝按近期筛选，不拿文件修改时间代替加入时间。全站短篇不用 `--recent`。
- `card` 返回料块标题与行号、战斗相关短摘录、已存KB、已确认小号、关联战役和素材章节；命中摘录最多6条，每条320字。结构最多20项，战役最多12项，均报告实际总数；超出部分沿素材分段读取。`read` 限定本人正文／素材，每次最多80行，按返回行号续读。
- `battle-without-narrative` 仅指有快照／手工参战关联且正文未命中战斗词；`command-without-tag` 提醒简介自称FLEET COMMANDER而缺少FC标签的候选。命中战斗词的人也可能漏查综合KB、常用船、高值月份或主力小号。`few-blocks`、`no-saved-kb` 同样只负责排队，不判不合格。人物被战役正文点名与真正参战分开标明；快照的宽窗口命中还须人工核星系与窗口。
- 抽查先选少量代表对象，分别核收录号、主力小号、已有战役和本次关键缺口，再按结果扩批。只补有依据的画像，不把普通参战逐场拆成料。取材预算、缓存复用及失败停止规则沿[取材手册](research-method.md#联网条件与预算所有取材入口共用)。
- 实际回顾到的素材同时按[素材归档](content-rules.md#6-素材归档)整理低价值操作流水账；只处理读到的文件，不为清理另开全仓扫描或汇报清单。

## 只保存人工结论

```sh
npm run review -- mark person:短名 --feature combat --status needs-work \
  --note '缺常用船和高值月份核读；已有战役已对照' \
  --evidence src/people/短名/materials-短名.md
npm run review -- list --feature combat --state needs-work
npm run review -- list --feature combat --state stale
```

唯一人工队列是 `docs/reviews/<feature>.json`，只给实际核读过的对象写记录，不预填数百条“待查”。记录包含结论、具体缺口／采用理由、证据指针及当时输入与规则的指纹，不重复事件正文和统计，不另写阶段汇总日志。证据可重复 `--evidence`，允许带章节锚点。

- `reviewed`：本项所需覆盖已人工核完；不表示全文或其他功能已审核。
- `needs-work`：已读部分证据，仍有具体缺口；说明已读范围和下一步。
- `blocked`：确有来源访问／身份等阻碍；原因与失败记录留正式素材。
- `unreviewed`、`stale` 由脚本计算。没有记录就是未审；输入或所选规则变化就是失效，旧结论仍可查看。取得响应、关键词命中、互链出现、校验或构建成功均不能自动写 `reviewed`。

指纹覆盖本人正文、档案（含小号与已存KB）、素材、素材所链接的共享来源、额外证据，以及本人在已有战役中的关联。新增战役命中、身份改变、关联消失也会失效。战报中别人的普通KM变化不重置本人记录。共享来源只跟随 `docs/sources/` 本地链接，不沿人物互链把全站串进同一依赖。

## 改规则或功能时先查影响

```sh
npm run review -- impact --feature combat --since HEAD --limit 10
npm run review -- impact --feature combat --files docs/sources/某事件.md
npm run review -- impact --feature battle-attribution --files src/battles/某战役/某战役.json
```

`--since` 合并指定Git引用以来的暂存、未暂存及未跟踪文件；只输出所选功能的候选对象与当前状态，不改文件、不联网。依赖反查同时保留旧审核时的路径，以找出已经删除的关联。先分页看候选，再核失效原因与相关段落，不为消除 `unreviewed` 重写全站。

功能规则只在 `docs/review-features.json` 登记适用对象、检索词和权威规则选择器；可选整文件、精确标题节或唯一包含行。战斗项只依赖战斗相关节，样式等无关节变化不重置已完成的战斗审核。新增审查维度先复用该机制；需要新的确定性检测再扩脚本，不把各功能规则复制到技能或列传。`battle-attribution` 已支持战役对象的结构卡、规则指纹和影响筛选；它不自动裁决阵营。修改复查算法语义时提升脚本中规则指纹的 `engine` 版本，让旧结论重新进入复查。

功能的共享实现文件另在该配置的 `implementation` 中登记：修改人物归并或战报计算会重置关联功能的结论，改CSS不会重置战斗审核。以后增加其他功能时登记它实际依赖的实现与规则，不把所有改动都绑到每一项审核。

战役对名称表只取该场涉及的组织：给别的军团改名不会让所有战役重审，修改本场军团名称／华人标记则会失效。`impact --state stale` 可在变更候选里只看已经失效的人工结论。

JSON缩进、对象字段顺序及人物快照单独更新抓取日期不改变审核输入；真实身份、战绩或归属变化才使相应记录失效。

人物／战役新增与具体写作仍走 `add-person`／`add-battle`，全文成稿验收仍按[写作验收](writing-review.md)。本工具解决定位、范围和结论失效，不替代写作判断，也不要求把数百篇未审状态一次清零。

战役视频复查用 `--feature battle-videos`，记录战役关联与所选作品；低播放候选不因关注度被排除。全站先用 `node scripts/bilibili-archive.mjs candidates all [偏移]` 盘点，不等待逐场点名；候选发现用 `node scripts/bilibili-archive.mjs candidates <战役短名> [偏移]`，简介BR查漏用同工具的 `reports`；输出只作排队，具体判断依[取材手册](research-method.md#4-b-站与贴吧同等重要)。需要后续读取的UID档案用额外 `--evidence docs/bilibili/<UID>.json` 登记，档案更新时旧结论会失效。
