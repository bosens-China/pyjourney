import meta from "@/content/docs/chapter-04/_meta.json";
import { lessonsOf } from "../lessons.ts";

const runCounters = `
default_counter = make_counter(start)
custom_counter = make_counter(start, step=step)
for _ in range(times):
    print(default_counter(), custom_counter())
`;

export const chapter04 = {
  id: "chapter-04",
  label: "第 4 章 · 函数",
  lessons: lessonsOf("chapter-04", meta),
  challenge: {
    starterCode: `# 已给定 start、step 和 times

def make_counter(start, step):
    # TODO：限定传参方式，将 step 的默认值设为 1
    # TODO：返回内层函数，让它每次调用都更新并返回当前值
    ...
${runCounters}`,
    solution: `def make_counter(start, /, *, step=1):
    current = start

    def count():
        nonlocal current
        current += step
        return current

    return count
${runCounters}`,
    checks: [
      {
        message: "start 是仅限位置形参",
        test: "any(f.name == 'make_counter' and [a.arg for a in f.args.posonlyargs] == ['start'] for f in nodes(ast.FunctionDef))",
      },
      {
        message: "step 是仅限关键字形参，默认值为 1",
        test: `any(
    function.name == 'make_counter'
    and [argument.arg for argument in function.args.kwonlyargs] == ['step']
    and type(getattr(function.args.kw_defaults[0], 'value', None)) is int
    and function.args.kw_defaults[0].value == 1
    for function in nodes(ast.FunctionDef)
)`,
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
        label: "交替调用两个步长不同的计数器",
        setup: "start = 0\nstep = 2\ntimes = 3",
        expectedOutput: "1 2\n2 4\n3 6",
      },
      {
        label: "更大的步长",
        setup: "start = 10\nstep = 5\ntimes = 2",
        expectedOutput: "11 15\n12 20",
      },
      {
        label: "从负数开始",
        setup: "start = -3\nstep = 3\ntimes = 4",
        expectedOutput: "-2 0\n-1 3\n0 6\n1 9",
      },
    ],
  },
};
