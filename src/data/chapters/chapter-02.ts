import meta from "@/content/docs/chapter-02/_meta.json";
import { lessonsOf } from "../lessons.ts";

export const chapter02 = {
  id: "chapter-02",
  label: "第 2 章 · 数据",
  lessons: lessonsOf("chapter-02", meta),
  challenge: {
    starterCode:
      "# 已给定：record 是一条访问记录，至少包含方法和路径\n\n# TODO：用一次带星号的赋值取出 method、path，其余字段放进 rest\n# TODO：用 f-字符串输出方法、路径和可选字段的个数\n",
    solution:
      "method, path, *rest = record\nprint(f'{method} {path}（{len(rest)} 个可选字段）')\n",
    checks: [
      {
        message: "解包 record，并用 *rest 收集剩余字段",
        test: "any(isinstance(n.value, ast.Name) and n.value.id == 'record' and isinstance(t, (ast.Tuple, ast.List)) and any(isinstance(e, ast.Starred) and name_of(e.value) == 'rest' for e in t.elts) for n in nodes(ast.Assign) for t in n.targets)",
      },
      {
        message: "用 f-字符串整理输出",
        test: "has(ast.JoinedStr)",
      },
    ],
    cases: [
      {
        label: "捕获多余字段",
        setup: "record = ['GET', '/users', 200, 'gzip']",
        expectedOutput: "GET /users（2 个可选字段）",
      },
      {
        label: "没有多余字段",
        setup: "record = ['POST', '/login']",
        expectedOutput: "POST /login（0 个可选字段）",
      },
      {
        label: "元组也能解包",
        setup: "record = ('DELETE', '/items/7', 204)",
        expectedOutput: "DELETE /items/7（1 个可选字段）",
      },
    ],
  },
};
