import meta from "@/content/docs/chapter-05/_meta.json";
import { lessonsOf } from "../lessons.ts";

export const chapter05 = {
  id: "chapter-05",
  label: "第 5 章 · 模块",
  lessons: lessonsOf("chapter-05", meta),
  challenge: {
    starterCode:
      "# 已给定：scores 是一组分数\n\n# TODO 1：从 statistics 模块导入 mean 和 median\n\n# TODO 2：打印「平均 x 中位 y」，两个数都保留一位小数\n",
    solution:
      "from statistics import mean, median\n\nprint(f'平均 {mean(scores):.1f} 中位 {median(scores):.1f}')\n",
    checks: [
      {
        message: "用 from statistics import 导入 mean 和 median",
        test: "any(n.module == 'statistics' and {'mean', 'median'} <= {a.name for a in n.names} for n in nodes(ast.ImportFrom))",
      },
      {
        message: "不使用星号导入",
        test: "not any(a.name == '*' for n in nodes(ast.ImportFrom) for a in n.names)",
      },
      {
        message: "不手写求和或排序",
        test: "not (calls('sum') or calls('sorted') or calls('sort'))",
      },
    ],
    cases: [
      {
        label: "奇数个分数",
        setup: "scores = [80, 90, 100]",
        expectedOutput: "平均 90.0 中位 90.0",
      },
      {
        label: "偶数个分数",
        setup: "scores = [70, 80, 90, 100]",
        expectedOutput: "平均 85.0 中位 85.0",
      },
      {
        label: "未排序的分数",
        setup: "scores = [95, 60, 70]",
        expectedOutput: "平均 75.0 中位 70.0",
      },
    ],
  },
};
