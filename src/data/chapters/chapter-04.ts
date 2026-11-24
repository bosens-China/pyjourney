import meta from "@/content/docs/chapter-04/_meta.json";
import { lessonsOf } from "../lessons.ts";

export const chapter04 = {
  id: "chapter-04",
  label: "第 4 章 · 函数",
  lessons: lessonsOf("chapter-04", meta),
  challenge: {
    starterCode:
      "# 已给定：start、step、times\n\ndef make_counter(start, step):\n    # TODO 1：start 只能按位置传入；step 只能按关键字传入，默认值是 1\n    # TODO 2：定义并返回内层函数 count，每次调用把当前值加上 step 再返回\n    ...\n\ncounter = make_counter(start, step=step)\nresults = []\nfor _ in range(times):\n    results.append(counter())\nprint(*results)\n",
    solution:
      "def make_counter(start, /, *, step=1):\n    current = start\n\n    def count():\n        nonlocal current\n        current += step\n        return current\n\n    return count\n\ncounter = make_counter(start, step=step)\nresults = []\nfor _ in range(times):\n    results.append(counter())\nprint(*results)\n",
    checks: [
      {
        message: "start 是仅限位置形参",
        test: "any(f.name == 'make_counter' and [a.arg for a in f.args.posonlyargs] == ['start'] for f in nodes(ast.FunctionDef))",
      },
      {
        message: "step 是仅限关键字形参，默认值为 1",
        test: "any(f.name == 'make_counter' and [a.arg for a in f.args.kwonlyargs] == ['step'] and getattr(f.args.kw_defaults[0], 'value', None) == 1 for f in nodes(ast.FunctionDef))",
      },
      {
        message: "在 make_counter 里定义并返回内层函数",
        test: "any(f.name == 'make_counter' and any(isinstance(n, ast.FunctionDef) for n in f.body) for f in nodes(ast.FunctionDef))",
      },
      {
        message: "用 nonlocal 修改外层变量，不用 global",
        test: "has(ast.Nonlocal) and not has(ast.Global)",
      },
    ],
    cases: [
      {
        label: "从 0 开始每次加 1",
        setup: "start = 0; step = 1; times = 3",
        expectedOutput: "1 2 3",
      },
      {
        label: "更大的步长",
        setup: "start = 10; step = 5; times = 2",
        expectedOutput: "15 20",
      },
      {
        label: "从负数开始",
        setup: "start = -3; step = 3; times = 4",
        expectedOutput: "0 3 6 9",
      },
    ],
  },
};
