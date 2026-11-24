import meta from "@/content/docs/chapter-01/_meta.json";
import { lessonsOf } from "../lessons.ts";

export const chapter01 = {
  id: "chapter-01",
  label: "第 1 章 · 名字与对象",
  lessons: lessonsOf("chapter-01", meta),
  challenge: {
    starterCode:
      "# 已给定：records 是一个列表，extra 是要追加的元素\n\n# TODO 1：让 alias 与 records 指向同一个列表\n\n# TODO 2：通过 alias 追加 extra\n\n# TODO 3：打印 records 的最后一个元素和 alias is records，中间一个空格\n",
    solution:
      "alias = records\nalias.append(extra)\nprint(f'{records[-1]} {alias is records}')\n",
    checks: [
      {
        message: "把 records 直接绑定给 alias，不复制列表",
        test: "any(name_of(n.value) == 'records' and isinstance(n.value, ast.Name) and any(name_of(t) == 'alias' for t in n.targets) for n in nodes(ast.Assign))",
      },
      {
        message: "通过 alias 调用 append",
        test: "any(isinstance(c.func, ast.Attribute) and c.func.attr == 'append' and name_of(c.func.value) == 'alias' for c in nodes(ast.Call))",
      },
      {
        message: "用 is 比较两个名字的标识号",
        test: "any(isinstance(op, ast.Is) for n in nodes(ast.Compare) for op in n.ops)",
      },
    ],
    cases: [
      {
        label: "两个名字指向同一列表",
        setup: "records = ['py']; extra = 'doc'",
        expectedOutput: "doc True",
      },
      {
        label: "追加后仍是同一个对象",
        setup: "records = ['a', 'b']; extra = 'c'",
        expectedOutput: "c True",
      },
    ],
  },
};
