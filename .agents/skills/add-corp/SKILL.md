---
name: add-corp
description: 为新伊甸野史添加或修订军团页：找候选、判门槛、汇全仓线索、写军团志并收尾。
---

# 添加／修订军团

读 `docs/rules-corp.md`、`docs/terminology.md` 和 `docs/corp-template.md`，字段见 `src/corps/AGENTS.md`，成稿读 `docs/corp-review.md`。流程固定按下面走，不临时写脚本，也不用脚本批量生成正文。

1. **定范围。** `npm run corps -- candidates` 列未开页的军团，`npm run corps -- audit` 列已开页的缺口。标“待判断”的看简介、CEO 和招新帖判断是不是华人军团。不是华人军团、或过不了门槛的，记入 `docs/corps-excluded.json` 并写明原因，不开页。
2. **开页。** `npm run corps -- open <军团ID>` 建骨架并标华人军团，再 `npm run corps:snapshot -- <短名>` 取快照。快照后 `audit` 报未达门槛的，删目录并记入排除表。
3. **取材。** `npm run corps -- clues <短名>` 汇总列传履历、招新帖候选和全仓线索，一条线索读不懂就打开原文件读整段，`--limit` 可放宽条数。读到华人圈的叫法（如中文名、CEO 昵称）就用 `--also 别名,别名` 再搜一遍，这往往才是大头。列传和素材是最常漏的来源。读贴吧原帖用 `node scripts/research/tieba-client-dump.mjs .cache/tieba-review/<帖号>.json`，没有缓存先用 `tieba-client-read.mjs` 取，`docs/tieba/` 只存标题。一年内发布或仍有人回复的招新帖直接算正在招新，即使没有 QQ 群号；`recruitment.last_seen` 按最近回复日期更新。检查关联 B 站 EVE 视频的简介和回复，若有明确属于该团的群号，将群号（`qq`）、最近活动日期和来源链接记入 `recruitment`。有群号且旧招新证据的军团再跑 `npm run corps:pilots -- <短名>`；没群号的不查。需要联网时才读 `docs/research-method.md`。线索归入 `materials-<短名>.json`，只记事实与出处。碰到 EVE 相关的 B站 UP 或视频，把链接写进素材；未入档时 `check` 会报错并给出命令。
4. **写正文与定风格。** 按模板写成浮夸、商业化的集团招商风，绝口不提丑事；起 `cn_name`、商业宣传语 `epithet`，凭印象选定视觉主题 `corp.style`（取值见军团志模板）并填妥三项 0–100 整数评价 `corp.ratings`（`pvp` 武德、`shenren` 含神量、`influence` 声望；`shenren` 只计现任成员，前成员不算，且对标列传“神人”高标准）。先找这家军团自己的牌面：发家底蕴、主权地盘、印钞基建、打过的硬仗、骨干立下的功劳，用真实事实撑起高调排场。只有履历没有事时，从本人列传里找他在这家军团的正面贡献来吹；实在只有 ESI 数字和一个人，就写成精悍的品牌门面，不要抄在团年月。人物链接用收录 ID，线索里括号内的数字就是。
5. **批量时。** 先写 3 家代表（线索多、中、少各一家），对照模板通读，再扩批。每家都走第 3、4 步，不共用一段话术。
6. **收尾。** `npm run corps -- audit` 里本团不再有问题，流水账只能改写正文，不能改检查。按 `docs/corp-review.md` 核读正文；目录和详情生成页与现稿一致才通读，否则报告未验证，按根目录要求定向验收。
7. 能开子代理时，正文定稿后把第 6 步交给新开的 `corp-reviewer` 子代理（模型和强度已配好：Claude Code 为 Sonnet 中等，Codex 为 Luna 高，不另行指定），只交代短名列表和本次范围，不转述主会话对质量的自评，也不要求通读规则文档。批量时一批一个子代理，不一家开一个。子代理只做格式、术语、链接等机械修正，正文缺口交回主会话。缺口只是小修时，主会话改完直接交付，不再动用子代理；实质重写才把改动位置发回同一子代理续审，不另开新子代理从头读起。
