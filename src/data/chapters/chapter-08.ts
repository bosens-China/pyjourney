import meta from "@/content/docs/chapter-08/_meta.json";
import { lessonsOf } from "../lessons.ts";

export const chapter08 = {
  id: "chapter-08",
  label: "第 8 章 · 迭代器与生成器",
  lessons: lessonsOf("chapter-08", meta),
  challenge: {
    starterCode:
      "# 已给定：numbers 是一组整数\n\ndef positives(nums):\n    # TODO：逐个检查 nums，用 yield 交出大于 0 的数\n    ...\n\nprint(' '.join(str(n) for n in positives(numbers)))\n",
    solution:
      "def positives(nums):\n    for n in nums:\n        if n > 0:\n            yield n\n\nprint(' '.join(str(n) for n in positives(numbers)))\n",
    checks: [
      {
        message: "positives 是用 yield 写成的生成器函数",
        test: "any(f.name == 'positives' and any(isinstance(n, ast.Yield) for n in ast.walk(f)) for f in nodes(ast.FunctionDef))",
      },
      {
        message: "不先建成结果列表",
        test: "not calls('append') and not has(ast.ListComp)",
      },
    ],
    cases: [
      {
        label: "混合正负数",
        setup: "numbers = [-1, 2, 0, 4]",
        expectedOutput: "2 4",
      },
      {
        label: "没有正数",
        setup: "numbers = [-3, 0]",
        expectedOutput: "",
      },
      {
        label: "只有一个正数",
        setup: "numbers = [5]",
        expectedOutput: "5",
      },
    ],
  },
};
