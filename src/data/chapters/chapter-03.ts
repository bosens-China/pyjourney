import meta from "@/content/docs/chapter-03/_meta.json";
import { lessonsOf } from "../lessons.ts";

export const chapter03 = {
  id: "chapter-03",
  label: "第 3 章 · 控制流与推导",
  lessons: lessonsOf("chapter-03", meta),
  challenge: {
    starterCode:
      "# 已给定：commands 是按顺序排列的一批指令\n\n# TODO：遍历 commands，用序列模式匹配每条指令\n# TODO：提取 direction，再用守卫检查方向是否有效\n",
    solution: `directions = ("north", "south", "east", "west")

for command in commands:
    match command:
        case ["go", direction] if direction in directions:
            print(f"前往 {direction}")
        case ["stay"]:
            print("停留")
        case _:
            print("未知")
`,
    checks: [
      {
        message: "用 for 遍历 commands",
        test: "any(name_of(n.iter) == 'commands' for n in nodes(ast.For))",
      },
      {
        message: "在序列模式里把方向绑定到 direction",
        test: "any(isinstance(p, ast.MatchAs) and p.name == 'direction' for s in nodes(ast.MatchSequence) for p in s.patterns)",
      },
      {
        message: "用守卫检查捕获到的方向",
        test: "any(isinstance(c.pattern, ast.MatchSequence) and c.guard is not None for c in nodes(ast.match_case))",
      },
    ],
    cases: [
      {
        label: "按顺序处理一批指令",
        setup: "commands = [['go', 'north'], ['stay'], ('go', 'west')]",
        expectedOutput: "前往 north\n停留\n前往 west",
      },
      {
        label: "方向不在允许范围内",
        setup:
          "commands = [['go', 'up'], ['go', 'east'], ['go', 'south'], ['go', []]]",
        expectedOutput: "未知\n前往 east\n前往 south\n未知",
      },
      {
        label: "缺少字段、多出字段和未知指令",
        setup: "commands = [['go'], ('stay', 'here'), ['jump']]",
        expectedOutput: "未知\n未知\n未知",
      },
    ],
  },
};
