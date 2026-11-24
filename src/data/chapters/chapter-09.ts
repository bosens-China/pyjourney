import meta from "@/content/docs/chapter-09/_meta.json";
import { lessonsOf } from "../lessons.ts";

export const chapter09 = {
  id: "chapter-09",
  label: "第 9 章 · 包装机制",
  lessons: lessonsOf("chapter-09", meta),
  challenge: {
    starterCode:
      "from functools import wraps\n\n# 已给定：message 是一段文本\n\ndef shout(fn):\n    # TODO：定义 wrapper，用 wraps 保留 fn 的元数据；它调用 fn，再把返回的文本转成大写\n    ...\n\n@shout\ndef greet(text):\n    return text\n\nprint(greet(message))\nprint(greet.__name__)\n",
    solution:
      "from functools import wraps\n\ndef shout(fn):\n    @wraps(fn)\n    def wrapper(text):\n        return fn(text).upper()\n    return wrapper\n\n@shout\ndef greet(text):\n    return text\n\nprint(greet(message))\nprint(greet.__name__)\n",
    checks: [
      {
        message: "包装函数用 wraps 装饰",
        test: "any(name_of(d) == 'wraps' for f in nodes(ast.FunctionDef) for d in f.decorator_list)",
      },
      {
        message: "用 @shout 装饰 greet",
        test: "any(f.name == 'greet' and [name_of(d) for d in f.decorator_list] == ['shout'] for f in nodes(ast.FunctionDef))",
      },
      {
        message: "greet 原样返回文本，大写转换放在装饰器里",
        test: "any(f.name == 'greet' and not any(isinstance(n, ast.Call) and name_of(n.func) == 'upper' for n in ast.walk(f)) for f in nodes(ast.FunctionDef))",
      },
    ],
    cases: [
      {
        label: "转成大写",
        setup: "message = 'hello'",
        expectedOutput: "HELLO\ngreet",
      },
      {
        label: "保留原有字符",
        setup: "message = 'Py 3'",
        expectedOutput: "PY 3\ngreet",
      },
    ],
  },
};
