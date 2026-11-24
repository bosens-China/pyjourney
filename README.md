# Python 漫游指南 · PyJourney

一本以 Python 3.15 为基础的交互式语言精粹，使用 Rspress 生成静态网站。

## 本地开发

使用 Node.js 22.23.4 或更高版本和 pnpm。

```sh
pnpm install
pnpm dev
```

用 `pnpm check` 检查类型，用 `pnpm build` 生成静态网站，再用 `pnpm preview` 本地预览。

从 `/preface` 或 `/chapter-01/program-shape` 开始阅读。文章按章存放在 `src/content/docs/`。导航和侧栏由 `_nav.json` 与各级 `_meta.json` 生成，各章的小节顺序也从 `_meta.json` 读取。章末挑战的题目、参考答案、写法检查和用例在 `src/data/chapters/`。

站点采用 Rspress 默认主题。自定义学习组件使用 Tailwind 原子类，并复用主题的颜色和字体。

## 持续集成与 GitHub Pages

推送到 `main` 或向 `main` 提交拉取请求时，`CI and Pages` 会检查格式和类型，并按 GitHub Pages 的仓库子路径构建站点。

准备发布时，在仓库的 **Settings → Pages** 将 **Source** 设为 **GitHub Actions**。然后在 **Actions → CI and Pages → Run workflow** 选择 `main`，勾选「发布到 GitHub Pages」并运行。
