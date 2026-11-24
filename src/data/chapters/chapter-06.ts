import meta from "@/content/docs/chapter-06/_meta.json";
import { lessonsOf } from "../lessons.ts";

export const chapter06 = {
  id: "chapter-06",
  label: "第 6 章 · 异常",
  lessons: lessonsOf("chapter-06", meta),
  challenge: {
    starterCode:
      "# 已给定：raw 是一段文本\n\n# TODO 1：定义异常类 ConfigError，直接继承 Exception\n\ndef parse_port(raw):\n    # TODO 2：把 raw 转成整数；转换失败时抛出 ConfigError('端口必须是整数')，并用 from 标明原因\n    # TODO 3：端口不在 1 到 65535 之间时，抛出 ConfigError('端口超出范围')\n    ...\n\ntry:\n    port = parse_port(raw)\nexcept ConfigError as err:\n    print(f'配置错误: {err}')\nelse:\n    print(f'端口 {port}')\n",
    solution:
      "class ConfigError(Exception):\n    pass\n\ndef parse_port(raw):\n    try:\n        port = int(raw)\n    except ValueError as exc:\n        raise ConfigError('端口必须是整数') from exc\n    if not 1 <= port <= 65535:\n        raise ConfigError('端口超出范围')\n    return port\n\ntry:\n    port = parse_port(raw)\nexcept ConfigError as err:\n    print(f'配置错误: {err}')\nelse:\n    print(f'端口 {port}')\n",
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
        message: "用 raise ... from 把转换失败记为直接原因",
        test: "any(r.cause is not None for r in nodes(ast.Raise))",
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
        expectedOutput: "配置错误: 端口必须是整数",
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
