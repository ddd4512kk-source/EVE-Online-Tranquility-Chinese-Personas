---
name: add-person
description: 为新伊甸野史添加或修订一篇人物列传。收到某个玩家的角色（名字、EveWho/zKillboard 链接或 ID）和素材（事迹、黑历史、聊天记录、评价），要求“加一个人”“写列传”“补充某某的黑料/红料”时使用。
---

# 添加 / 修订列传

规则全在 `AGENTS.md`（第 2–5 节）。记住一句：**宁收勿漏，有线索就发挥，骨架不能编。**

## 1. 查 ID、查重

```bash
npm run find -- "<名字或链接>"
```

- 已有列传 → 修订：在原文基础上增补，不推倒重写。
- 找不到主号 → 用本人小号；帖中署名、截图、同名且军团或时间吻合都算对应依据，记进素材文件。完全对不上才登记 `docs/pending-characters.md`。

## 2. 找料

按 `docs/research-method.md` 做四项：游戏画像 → 贴吧 → 搜索引擎 → B 站。料少不妨碍立传：有一件有出处的事就写短篇。

## 3. 撰写

`src/people/<短名>/<短名>.md`（从 `docs/person-template.md` 复制）+ 同目录 `materials-<短名>.md`（来源与检索记录）。

- `cn_name` 有就填；`aliases` 写外号；`epithet` ≤25 字，多想几版挑最狠的；`tags` 先 `rg "^tags:" src/people/*/*.md` 复用已有。
- 正文：开篇讲故事 → 红料块 → 黑料块 → `::: 评`。每条料一块。
- 料薄的地方大胆推测、补前因后果，带一句“大概”“看样子”；不写免责声明。

## 4. 构建与自查

```bash
npm run fetch
npm run build
```

读 `_site/p/<ID>/index.html`：标题、每块料、锐评渲染正常，无残留 `:::`，句句接得上。

## 5. 提交与汇报

```bash
git add src/people/<短名>/
git commit -m "添加列传：<名字>"     # 修订用“修订列传：<名字>”
git push
```

没有明确授权时，推送前先问。汇报：写了谁、几红几黑、锐评、网址 `https://ddd4512kk-source.github.io/EVE-Online-Tranquility-Chinese-Personas/p/<ID>/`（推送后 1–2 分钟生效）。
