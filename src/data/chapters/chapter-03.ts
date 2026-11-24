import meta from "@/content/docs/chapter-03/_meta.json";
import { lessonsOf } from "../lessons.ts";

export const chapter03 = {
  id: "chapter-03",
  label: "第 3 章 · 控制流与推导",
  lessons: lessonsOf("chapter-03", meta),
  challenge: {
    starterCode:
      "# 已给定：command 是一个序列\n\nmatch command:\n    # TODO：['go', 方向] 打印「前往 方向」，方向绑定到 direction\n    # TODO：['stay'] 打印「停留」\n    case _:\n        print('未知')\n",
    solution:
      "match command:\n    case ['go', direction]:\n        print(f'前往 {direction}')\n    case ['stay']:\n        print('停留')\n    case _:\n        print('未知')\n",
    checks: [
      {
        message: "使用 match 语句",
        test: "has(ast.Match)",
      },
      {
        message: "在序列模式里把方向绑定到 direction",
        test: "any(isinstance(p, ast.MatchAs) and p.name == 'direction' for s in nodes(ast.MatchSequence) for p in s.patterns)",
      },
      {
        message: "不用 isinstance 或下标判断形状",
        test: "not calls('isinstance') and not any(name_of(s.value) == 'command' for s in nodes(ast.Subscript))",
      },
    ],
    cases: [
      {
        label: "带方向的移动",
        setup: "command = ['go', 'north']",
        expectedOutput: "前往 north",
      },
      {
        label: "停留",
        setup: "command = ['stay']",
        expectedOutput: "停留",
      },
      {
        label: "无法识别的指令",
        setup: "command = ['jump']",
        expectedOutput: "未知",
      },
      {
        label: "缺少方向",
        setup: "command = ['go']",
        expectedOutput: "未知",
      },
      {
        label: "多出一项",
        setup: "command = ('stay', 'here')",
        expectedOutput: "未知",
      },
    ],
  },
};
