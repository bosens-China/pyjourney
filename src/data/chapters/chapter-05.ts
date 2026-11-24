import meta from "@/content/docs/chapter-05/_meta.json";
import { lessonsOf } from "../lessons.ts";

export const chapter05 = {
  id: "chapter-05",
  label: "第 5 章 · 模块",
  lessons: lessonsOf("chapter-05", meta),
  challenge: {
    starterCode: `# 已给定 scores 和 __name__
# TODO：从 statistics 导入 mean 和 median

def print_report(scores):
    # TODO：计算并打印统计结果
    ...

# TODO：只在作为入口运行时调用 print_report(scores)
`,
    solution: `from statistics import mean, median

def print_report(scores):
    print(f"平均 {mean(scores):.1f} 中位 {median(scores):.1f}")

if __name__ == "__main__":
    print_report(scores)
`,
    checks: [
      {
        message: "用 from statistics import 导入 mean 和 median",
        test: `{'mean', 'median'} <= {
    imported.name
    for statement in nodes(ast.ImportFrom)
    if statement.level == 0 and statement.module == 'statistics'
    for imported in statement.names
}`,
      },
      {
        message: "不使用星号导入",
        test: "not any(a.name == '*' for n in nodes(ast.ImportFrom) for a in n.names)",
      },
      {
        message: "定义 print_report，在函数里用 mean 和 median",
        test: `any(
    function.name == 'print_report'
    and {'mean', 'median'} <= {
        name_of(call.func) for call in ast.walk(function) if isinstance(call, ast.Call)
    }
    for function in nodes(ast.FunctionDef)
)`,
      },
      {
        message: "在 if __name__ == '__main__' 下调用 print_report",
        test: `any(
    isinstance(condition, ast.Compare)
    and isinstance(condition.left, ast.Name)
    and condition.left.id == '__name__'
    and len(condition.ops) == 1
    and isinstance(condition.ops[0], ast.Eq)
    and isinstance(condition.comparators[0], ast.Constant)
    and condition.comparators[0].value == '__main__'
    and any(
        isinstance(statement, ast.Expr)
        and isinstance(statement.value, ast.Call)
        and name_of(statement.value.func) == 'print_report'
        for statement in branch.body
    )
    for branch in nodes(ast.If)
    for condition in [branch.test]
)`,
      },
    ],
    cases: [
      {
        label: "奇数个分数",
        setup: '__name__ = "__main__"\nscores = [80, 90, 100]',
        expectedOutput: "平均 90.0 中位 90.0",
      },
      {
        label: "偶数个分数",
        setup: '__name__ = "__main__"\nscores = [70, 80, 90, 100]',
        expectedOutput: "平均 85.0 中位 85.0",
      },
      {
        label: "未排序的分数",
        setup: '__name__ = "__main__"\nscores = [95, 60, 70]',
        expectedOutput: "平均 75.0 中位 70.0",
      },
      {
        label: "模块被导入时不打印",
        setup: '__name__ = "score_report"\nscores = [95, 60, 70]',
        expectedOutput: "",
      },
    ],
  },
};
