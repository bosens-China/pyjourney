# Python 漫游指南 · PyJourney

一本以 Python 3.15 为基础的交互式语言精粹。

## 本地开发

使用 Node.js 22.23.4 或更高版本和 pnpm。

```sh
pnpm install
pnpm dev
```

用 `pnpm check` 检查类型，用 `pnpm build` 生成静态网站。

从 `/chapter-01/first-program/` 开始阅读。文章按章存放在 `src/content/docs/`，侧栏由 `src/data/chapters.ts` 中的章节数据生成。章末挑战用例也在章节数据中。

## 持续集成与 GitHub Pages

推送到 `main` 或向 `main` 提交拉取请求时，`CI and Pages` 会检查格式和类型，并按 GitHub Pages 的仓库子路径构建站点。

准备发布时，在仓库的 **Settings → Pages** 将 **Source** 设为 **GitHub Actions**。然后在 **Actions → CI and Pages → Run workflow** 选择 `main`，勾选「发布到 GitHub Pages」并运行。
