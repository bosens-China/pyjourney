import meta from "@/content/docs/chapter-06/_meta.json";
import { lessonsOf } from "../lessons.ts";

const showPort = `
try:
    port = parse_port(raw)
except ConfigError as err:
    print(f"配置错误: {err}")
    if err.__cause__ is not None:
        print(f"直接原因: {type(err.__cause__).__name__}")
else:
    print(f"端口 {port}")
`;

export const chapter06 = {
  id: "chapter-06",
  label: "第 6 章 · 异常",
  lessons: lessonsOf("chapter-06", meta),
  challenge: {
    starterCode: `# 已给定文本 raw

# TODO：定义异常类 ConfigError，直接继承 Exception

def parse_port(raw):
    # TODO：转成整数。失败时抛出 ConfigError，并用 from 标明原因
    # TODO：检查端口范围，合法就返回端口
    ...
${showPort}`,
    solution: `class ConfigError(Exception):
    pass

def parse_port(raw):
    try:
        port = int(raw)
    except ValueError as exc:
        raise ConfigError("端口必须是整数") from exc
    if not 1 <= port <= 65535:
        raise ConfigError("端口超出范围")
    return port
${showPort}`,
    checks: [
      {
        message: "ConfigError 直接继承 Exception",
        test: "any(c.name == 'ConfigError' and [name_of(b) for b in c.bases] == ['Exception'] for c in nodes(ast.ClassDef))",
      },
      {
        message: "只捕获 ValueError 和 ConfigError，不写宽泛的 except",
        test: "all(name_of(h.type) in {'ValueError', 'ConfigError'} for h in nodes(ast.ExceptHandler))",
      },
      {
        message: "用 raise ... from 把捕获到的 ValueError 记为直接原因",
        test: `any(
    name_of(handler.type) == 'ValueError'
    and handler.name
    and any(
        isinstance(statement, ast.Raise)
        and name_of(statement.exc) == 'ConfigError'
        and isinstance(statement.cause, ast.Name)
        and statement.cause.id == handler.name
        for statement in ast.walk(handler)
    )
    for handler in nodes(ast.ExceptHandler)
)`,
      },
    ],
    cases: [
      {
        label: "合法端口",
        setup: "raw = '8080'",
        expectedOutput: "端口 8080",
      },
      {
        label: "不是整数",
        setup: "raw = 'http'",
        expectedOutput: "配置错误: 端口必须是整数\n直接原因: ValueError",
      },
      {
        label: "合法的最小端口",
        setup: "raw = '1'",
        expectedOutput: "端口 1",
      },
      {
        label: "合法的最大端口",
        setup: "raw = '65535'",
        expectedOutput: "端口 65535",
      },
      {
        label: "超出上限",
        setup: "raw = '70000'",
        expectedOutput: "配置错误: 端口超出范围",
      },
      {
        label: "端口不能是 0",
        setup: "raw = '0'",
        expectedOutput: "配置错误: 端口超出范围",
      },
      {
        label: "两侧带空白",
        setup: "raw = ' 443 '",
        expectedOutput: "端口 443",
      },
    ],
  },
};
