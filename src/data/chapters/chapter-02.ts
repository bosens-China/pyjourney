import meta from "@/content/docs/chapter-02/_meta.json";
import { lessonsOf } from "../lessons.ts";

export const chapter02 = {
  id: "chapter-02",
  label: "第 2 章 · 数据",
  lessons: lessonsOf("chapter-02", meta),
  challenge: {
    starterCode:
      "# 已给定：record 是一条访问记录，至少包含方法和路径\n\n# TODO：用一次带星号的赋值取出 method、path，其余字段放进 rest\n\nprint(f'{method} {path} {len(rest)}')\n",
    solution:
      "method, path, *rest = record\nprint(f'{method} {path} {len(rest)}')\n",
    checks: [
      {
        message: "用带星号的目标解包 record",
        test: "any(isinstance(t, (ast.Tuple, ast.List)) and any(isinstance(e, ast.Starred) for e in t.elts) for n in nodes(ast.Assign) for t in n.targets)",
      },
      {
        message: "星号目标的名字是 rest",
        test: "any(name_of(s.value) == 'rest' for s in nodes(ast.Starred))",
      },
      {
        message: "不用下标逐个读取 record",
        test: "not any(name_of(s.value) == 'record' for s in nodes(ast.Subscript))",
      },
    ],
    cases: [
      {
        label: "捕获多余字段",
        setup: "record = ['GET', '/users', 200, 'gzip']",
        expectedOutput: "GET /users 2",
      },
      {
        label: "没有多余字段",
        setup: "record = ['POST', '/login']",
        expectedOutput: "POST /login 0",
      },
      {
        label: "元组也能解包",
        setup: "record = ('DELETE', '/items/7', 204)",
        expectedOutput: "DELETE /items/7 1",
      },
    ],
  },
};
