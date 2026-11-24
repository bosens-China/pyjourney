import meta from "@/content/docs/chapter-09/_meta.json";
import { lessonsOf } from "../lessons.ts";

const previewDemo = `@preview
def render(message):
    if message is None:
        raise ValueError("缺少消息")
    return f"{settings['prefix']} {message}"

try:
    print(render(message))
except ValueError as error:
    print(f"渲染失败：{error}")

print(f"调用后前缀：{settings['prefix']}")
print(f"函数名：{render.__name__}")
`;

export const chapter09 = {
  id: "chapter-09",
  label: "第 9 章 · 包装机制",
  lessons: lessonsOf("chapter-09", meta),
  challenge: {
    starterCode: `from contextlib import contextmanager
from functools import wraps

# 已给定 settings 和 message。

def temporary_prefix(prefix):
    # TODO：用 @contextmanager 和 try / finally 在离开时恢复前缀
    ...

def preview(fn):
    # TODO：用 @wraps(fn) 包装 fn，并在临时前缀生效时调用它
    ...

${previewDemo}`,
    solution: `from contextlib import contextmanager
from functools import wraps

@contextmanager
def temporary_prefix(prefix):
    previous = settings["prefix"]
    settings["prefix"] = prefix
    try:
        yield
    finally:
        settings["prefix"] = previous

def preview(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        with temporary_prefix("[预览]"):
            return fn(*args, **kwargs)
    return wrapper

${previewDemo}`,
    checks: [
      {
        message: "temporary_prefix 用 @contextmanager 装饰",
        test: "any(f.name == 'temporary_prefix' and any(name_of(d) == 'contextmanager' for d in f.decorator_list) for f in nodes(ast.FunctionDef))",
      },
      {
        message: "temporary_prefix 在 try 中产出，用 finally 恢复前缀",
        test: `any(
  isinstance(t, ast.Try) and t.finalbody
  and any(isinstance(n, ast.Yield) for s in t.body for n in ast.walk(s))
  for f in nodes(ast.FunctionDef) if f.name == 'temporary_prefix'
  for t in ast.walk(f)
)`,
      },
      {
        message: "preview 的包装函数用 @wraps 装饰",
        test: `any(
  isinstance(w, ast.FunctionDef) and w is not f
  and any(name_of(d) == 'wraps' for d in w.decorator_list)
  for f in nodes(ast.FunctionDef) if f.name == 'preview'
  for w in ast.walk(f)
)`,
      },
      {
        message: "preview 用 with 进入 temporary_prefix",
        test: `any(
  isinstance(w, ast.With)
  and any(isinstance(i.context_expr, ast.Call) and name_of(i.context_expr) == 'temporary_prefix' for i in w.items)
  for f in nodes(ast.FunctionDef) if f.name == 'preview'
  for w in ast.walk(f)
)`,
      },
      {
        message: "render 用 @preview 装饰",
        test: "any(f.name == 'render' and any(name_of(d) == 'preview' for d in f.decorator_list) for f in nodes(ast.FunctionDef))",
      },
    ],
    cases: [
      {
        label: "预览消息",
        setup: "settings = {'prefix': '[正式]'}\nmessage = '构建完成'",
        expectedOutput: "[预览] 构建完成\n调用后前缀：[正式]\n函数名：render",
      },
      {
        label: "恢复不同的旧前缀",
        setup: "settings = {'prefix': '[任务]'}\nmessage = '同步结束'",
        expectedOutput: "[预览] 同步结束\n调用后前缀：[任务]\n函数名：render",
      },
      {
        label: "渲染出错后也恢复前缀",
        setup: "settings = {'prefix': '[发布]'}\nmessage = None",
        expectedOutput:
          "渲染失败：缺少消息\n调用后前缀：[发布]\n函数名：render",
      },
    ],
  },
};
