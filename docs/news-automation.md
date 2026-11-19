# 天书每小时收录

GitHub 托管运行器在每小时第 17 分钟读取官网 RSS，并从新闻首页定位当前补丁说明。首次检查记录起点。从下一次变化起，新文章和更新过的补丁自动进入待办。运行器关机后，待办仍保存在站点仓库。

## 启用

1. 将天书收录工具、页面模板和本工作流一并合入站点仓库 `mrd-e/CEVE-History` 的默认分支 `main`。启用仓库的 GitHub Actions 和现有 Pages 部署流程。
2. 在自己的终端运行 `claude setup-token`，使用 Claude 订阅账号完成浏览器授权。在站点仓库的 **Settings → Secrets and variables → Actions → Secrets → New repository secret** 中建立 `CLAUDE_CODE_OAUTH_TOKEN`，值为终端返回的令牌。一年到期时重新生成并替换。工作流使用 Claude Code 自带的订阅认证。
3. 用能访问翻译框架仓库的 GitHub 账号创建 fine-grained personal access token。仓库范围只选 `mrd-e/EVE-Online-Translation-Framework`，在 Repository permissions 中给 **Contents → Read-only**。在同一处建立 `TRANSLATOR_READ_TOKEN`，值为该令牌。工作流从该仓库读取固定版本的框架、词表和复核技能。
4. 站点工作流需要向 main 写入文章及待办，并调度部署。工作流已声明 `contents: write` 和 `actions: write`；仓库或组织策略须允许这两项权限。如果 main 强制经过 PR，当前直接推送方式会被分支规则拦下。
5. 打开 **Actions → 天书每小时收录 → Run workflow**，选择 main 并勾选“仅用一段样文测试订阅、翻译与独立复核”。成功时日志中出现样文译文。这一步会使用少量订阅额度。随后取消勾选再运行一次，建立订阅起点。也可以等到下一次定时运行建立起点。

## 运行结果

- 有可用的官方简中正文时，Claude 通读并只校正明显错误。英文稿按 translator 技能分块写稿，新的 Claude 会话独立复核。框架返回“已复核”或“复核后修订”且各项检查齐全才可发布。
- 当前补丁页每小时检查正文，即使 RSS 条目已滚出列表也能发现变化。同一补丁合辑首次需要创建页面时处理全篇。之后按日期和当日序号复用已发布的译文；新增、改写的小节及变动的前言单独处理。
- 单篇失败留在待办，下次从该篇重新尝试。其他成功的文章可先发布。已完成的文章与待办状态一同推送，随后显式启动“构建与发布”。收录工作流显示成功表示部署请求已发出，实际上线结果见“构建与发布”。
- 配额不足时查看收录运行中失败的篇目；令牌失效时替换同名 Secret，再手动运行收录。GitHub 繁忙时定时任务可能延迟。持续停机期间已滑出 RSS 的普通新闻需要另行补录。
