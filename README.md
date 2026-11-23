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
