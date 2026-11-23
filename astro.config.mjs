import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { chapters } from "./src/data/chapters.ts";

export default defineConfig({
  site: process.env.PYJOURNEY_SITE,
  base: process.env.PYJOURNEY_BASE ?? "/",
  integrations: [
    starlight({
      title: "Python 漫游指南",
      description: "一本以 Python 3.15 为基础的交互式语言精粹",
      locales: {
        root: { label: "简体中文", lang: "zh-CN" },
      },
      customCss: ["./src/styles/global.css"],
      sidebar: chapters.map(({ id, label, lessons }) => ({
        label,
        collapsed: true,
        items: [...lessons, { label: "章节挑战", link: `/challenge/${id}/` }],
      })),
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["codemirror", "@codemirror/lang-python"],
      exclude: ["pyodide"],
    },
  },
});
