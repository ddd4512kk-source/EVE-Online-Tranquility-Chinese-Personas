# 人物身份数据

每人只维护一份 `src/people/<短名>/<收录角色ID>-id.json`。原来的数字名快照与单独的 `identity.json` 已合并，不再并存。Markdown 只保留正文，不写 front matter；档案顶层 `id` 是唯一收录号，必须与文件名一致。

## 档案结构

顶层 `id`、`name`、`birthday`、`corporation_id`、`affiliation`、`history`、`fetched_at` 是游戏快照，由抓取程序维护。展示配置写 `person`，人工确认的身份关系写 `identity`；刷新快照会原样保留这两部分以及 `related_snapshots`。

以下为叼爷档案中人工部分的示例（其余游戏字段省略）：

```json
{
  "id": 1387156123,
  "person": {
    "cn_name": "叼爷",
    "aliases": ["MrDiao", "吊哥", "diao哥"],
    "epithet": "教程留给新人，录音留给苦主。",
    "tags": ["00区", "FRT"]
  },
  "identity": {
    "version": 1,
    "alts": [
      {
        "id": 2118070113,
        "name": "Not Mrdiao",
        "sources": ["materials-mr-diao.md"]
      },
      {
        "id": 712912091,
        "name": "DiaoMoney",
        "sources": ["materials-mr-diao.md"]
      }
    ],
    "accounts": {}
  }
}
```

- `person` 必须是对象，可填 `cn_name`、`aliases`、`epithet`、`tags`，不重复写角色 ID。更新时间从正文 Git 历史自动计算。新人物可先建立只有 `id`、`person`、`identity` 的档案，运行 `npm run fetch` 补快照。
- `aliases` 是外号、简称和社区别称，小号是独立角色。不得把 `identity.alts` 里的正式号名再抄到 `aliases`；页面把“又名”和“小号”分开显示，小号名链接到对应角色的 EveWho 资料。
- `version` 固定为 `1`；`alts`、`accounts` 可留空。不在 Markdown front matter 重复维护 `alts`。
- `alts` 每项必须有数字 `id`、实际角色名 `name` 与非空 `sources`；三者缺一均不能通过校验。名字按已经取得的素材／公开角色资料保存，不因改名改动角色 ID。
- `sources` 为相对本人目录的素材文件（可附锚点）或公开 HTTPS 来源。身份判断的完整上下文、阅读范围和疑点仍保留素材。机器字段存对应关系，素材存判断依据，不用把素材重写成 JSON。
- 战报按收录号与 `identity.alts[].id` 统一认人；检查会拒绝重复 ID、小号与他人收录号冲突、来源文件不存在等问题。
- `related_snapshots` 保存更换收录号前已经取得的其他角色快照，仍按各自 ID 提供历史数据。刷新主号时原样保留；存有旧快照本身不自动证明它是本人小号，认人仍以 `identity.alts` 为准。
- 售号、代管或只确认某一时期由本人操作的角色，不能直接作全生涯小号映射；先在素材保留时段和操作边界。候选、已排除与第三方作者也不进入已确认列表。

## 贴吧

确认属于本人的账号写进 `identity.accounts.tieba`，支持一人多号：

```json
{
  "tieba": [
    {
      "uid": "934613764",
      "name": "大手牵小手⛄",
      "aliases": ["猪头1019316"],
      "sources": ["materials-godhand-kk.md"]
    }
  ]
}
```

`uid` 用字符串保存；`name` 是已读到的公开账号名，`aliases` 留存旧名／其他展示名，`portrait` 可保存已取得的主页标识。已确认账号但还没取得 UID 时，可只记 `name` 和依据；不按昵称猜 UID。相同昵称不自动合并，同一个确定 UID 不能归两人。

主题／回帖覆盖、`hide_post`、读到第几页、未读帖子和具体事迹仍归素材，不能从一个账号登记推断已读完此账号。

## B站与其他可结构化的数据

B站已有按 UID 保存的 `docs/bilibili/<UID>.json`，其中 `identity.state: confirmed`、`identity.person: <人物短名>` 是账号归属的唯一维护处。人物文件不再抄一份 UID；统一读取时自动得到 `accounts.bilibili`，包括 UID、名字、主页、档案入口与素材依据。一人多个个人号／节目号均能关联；候选、只有关联的官号、他人投稿以及未立传线索不会自动算成本人账号。具体作品、署名、频道覆盖与阅读进度按 [B站档案说明](bilibili/README.md) 管理。

凛冬论坛等公开账号同样适合以后按稳定用户名、主页和素材依据登记；目前没有统一迁移，仍从素材复用。军团／联盟名字与 ticker 已统一在 `src/_data/entityNames.json`，战役的窗口、角色记录和统计已在各场同名战役 JSON 的 `br`，继续复用各自的数据源。中文外号、列传标签和一句话锐评属于作者维护的展示内容，统一写在人物档案的 `person`。

## 统一读取与校验

```bash
node scripts/person-identity.mjs mr-diao
node scripts/person-identity.mjs 2118070113
node scripts/person-identity.mjs 大手牵小手⛄
```

小号名与平台账号名自动进入首页检索串，不需要为搜索再抄进列传 `aliases`。工具离线输出整个人物的身份档案，支持短名、主号名字、主小号 ID、已登记小号名、平台 UID 与账号名；不带参数输出全部人物。脚本共用 `readAllIdentities(root)`，网站数据为 `identities[短名]`，列传计算数据为 `identity`。`npm run check` 与 `npm run build` 会校验人工关系，构建和游戏刷新均不为身份档案额外联网。
