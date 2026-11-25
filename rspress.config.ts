import { resolve } from "node:path";
import { pluginTailwindcss } from "@rsbuild/plugin-tailwindcss";
import { defineConfig } from "@rspress/core";
import { lazyImportOffsets } from "./src/lib/python/highlight.ts";

const base = process.env.PYJOURNEY_BASE ?? "/";
const siteOrigin = process.env.PYJOURNEY_SITE;

export default defineConfig({
  root: resolve(import.meta.dirname, "src/content/docs"),
  outDir: "dist",
  base,
  siteOrigin,
  title: "Python 漫游指南",
  description: "从零开始，探索 Python 的奇妙世界。",
  lang: "zh",
  llms: false,
  markdown: {
    shiki: {
      transformers: [
        {
          name: "pyjourney:runnable-python",
          pre(node) {
            const { lang, meta } = this.options;
            if (
              (lang === "python" || lang === "py") &&
              /^run(?:\s|$)/.test(meta?.__raw?.trimStart() ?? "")
            ) {
              node.properties["data-run-source"] = this.source;
            }
          },
        },
        {
          name: "pyjourney:lazy-import",
          tokens(tokens) {
            if (this.options.lang !== "python" && this.options.lang !== "py")
              return;
            const offsets = lazyImportOffsets(this.source);
            if (!offsets.size) return;

            return tokens.map((line) =>
              line.flatMap((token) => {
                const index = token.content.indexOf("lazy");
                if (index < 0 || !offsets.has(token.offset + index))
                  return token;

                const offset = token.offset + index;
                return [
                  { ...token, content: token.content.slice(0, index) },
                  {
                    ...token,
                    offset,
                    content: "lazy",
                    color: "var(--shiki-token-keyword)",
                  },
                  {
                    ...token,
                    offset: offset + 4,
                    content: token.content.slice(index + 4),
                  },
                ].filter(({ content }) => content);
              }),
            );
          },
        },
      ],
    },
  },
  globalStyles: resolve(import.meta.dirname, "tailwind.css"),
  builderConfig: {
    plugins: [pluginTailwindcss()],
    performance: { buildCache: { cacheDigest: [base, siteOrigin] } },
  },
  i18nSource: (translations) => ({
    ...translations,
    prevPageText: { ...translations.prevPageText, zh: "上一节" },
    nextPageText: { ...translations.nextPageText, zh: "下一节" },
  }),
  logo: "/logo-mark.svg",
  logoText: "PyJourney",
  icon: "/favicon.svg",
  route: { cleanUrls: true },
  themeConfig: {
    editLink: {
      docRepoBaseUrl:
        "https://github.com/bosens-China/pyjourney/tree/main/src/content/docs",
    },
    lastUpdated: true,
    footer: {
      message:
        "内容以 Python 3.15 官方文档为准 · 页内练习运行于 Pyodide（Python 3.15）",
    },
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/bosens-China/pyjourney",
      },
    ],
  },
});
