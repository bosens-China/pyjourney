/** @typedef {Awaited<ReturnType<typeof import("pyodide").loadPyodide>>} PythonRuntime */
/** @typedef {import("pyodide/ffi").PyProxy} PyProxy */
/** @typedef {import("./protocol").PythonResult} PythonResult */
/** @typedef {import("./protocol").PythonWorkerReply} PythonWorkerReply */
/** @typedef {import("./protocol").PythonWorkerRequest} PythonWorkerRequest */

const outputLimit = 8_192;
/** @type {Promise<PythonRuntime> | undefined} */
let runtime;

function captureOutput() {
  const decoder = new TextDecoder();
  let output = "";
  let remaining = outputLimit;
  let truncated = false;

  return {
    /** @param {Uint8Array} buffer */
    write(buffer) {
      const captured = buffer.subarray(0, remaining);
      output += decoder.decode(captured, { stream: true });
      remaining -= captured.length;
      truncated ||= captured.length !== buffer.length;
      return buffer.length;
    },
    read() {
      return { output: output + decoder.decode(), truncated };
    },
  };
}

/** @param {unknown} error */
function formatError(error) {
  if (!(error instanceof Error)) return "运行代码时发生错误。";

  const frame = error.message.indexOf('  File "练习.py"');
  return (
    (frame >= 0 ? error.message.slice(frame) : error.message)
      .trim()
      .slice(0, outputLimit) || "运行代码时发生错误。"
  );
}

// 自己编译执行，不让 runPython 去掉读者代码的公共缩进。
const executorSource = `
import linecache

def execute(code, scope):
    # 回溯从 linecache 读取出错的那一行源码。
    linecache.cache["练习.py"] = (len(code), None, code.splitlines(True), "练习.py")
    exec(compile(code, "练习.py", "exec"), scope)

execute
`;

/**
 * @param {PythonRuntime} python
 * @param {import("pyodide/ffi").PyCallable} execute
 * @param {string} setup
 * @param {string} code
 * @returns {PythonResult}
 */
function runCase(python, execute, setup, code) {
  const stdout = captureOutput();
  const stderr = captureOutput();
  const globals = /** @type {PyProxy} */ (python.toPy({}));
  /** @type {string | undefined} */
  let error;

  python.setStdout(stdout);
  python.setStderr(stderr);
  try {
    if (setup) python.runPython(setup, { globals });
    execute(code, globals);
  } catch (cause) {
    error = formatError(cause);
  } finally {
    try {
      // 输出没有换行时，Python 可能仍把它留在缓冲区。
      python.runPython(
        '__import__("sys").__stdout__.flush()\n__import__("sys").__stderr__.flush()',
      );
    } catch (cause) {
      error ??= formatError(cause);
    }
    globals.destroy();
  }

  const output = stdout.read();
  const errors = stderr.read();
  return {
    stdout: output.output,
    stderr: errors.output,
    truncated: output.truncated || errors.truncated,
    error,
  };
}

const checkerSource = `
import ast

def check(code, tests):
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return None

    def nodes(kind):
        return [node for node in ast.walk(tree) if isinstance(node, kind)]

    def has(kind):
        return bool(nodes(kind))

    def name_of(node):
        match node:
            case ast.Name(id=name) | ast.Attribute(attr=name):
                return name
            case ast.Call(func=func):
                return name_of(func)
        return None

    def calls(name):
        return any(name_of(call.func) == name for call in nodes(ast.Call))

    scope = {
        "ast": ast,
        "tree": tree,
        "nodes": nodes,
        "has": has,
        "name_of": name_of,
        "calls": calls,
    }
    results = []
    for test in tests:
        try:
            results.append(bool(eval(test, scope)))
        except Exception:
            results.append(False)
    return results

check
`;

/**
 * @param {PythonRuntime} python
 * @param {string} code
 * @param {import("./protocol").PythonCheck[]} checks
 * @returns {boolean[] | null}
 */
function runChecks(python, code, checks) {
  if (!checks.length) return [];

  const scope = /** @type {PyProxy} */ (python.toPy({}));
  const tests = /** @type {PyProxy} */ (
    python.toPy(checks.map(({ test }) => test))
  );
  /** @type {import("pyodide/ffi").PyCallable | undefined} */
  let checker;
  /** @type {PyProxy | null | undefined} */
  let outcome;
  try {
    checker = python.runPython(checkerSource, { globals: scope });
    outcome = /** @type {import("pyodide/ffi").PyCallable} */ (checker)(
      code,
      tests,
    );
    return outcome ? /** @type {boolean[]} */ (outcome.toJs()) : null;
  } catch {
    return checks.map(() => false);
  } finally {
    outcome?.destroy();
    checker?.destroy();
    tests.destroy();
    scope.destroy();
  }
}

/** @param {PythonWorkerReply} message */
function reply(message) {
  self.postMessage(message);
}

self.addEventListener(
  "message",
  /** @param {MessageEvent<PythonWorkerRequest>} event */
  async (event) => {
    try {
      const python = await (runtime ??= (async () => {
        const version = new URL(self.location.href).searchParams.get("version");
        if (!version || !/^\d+\.\d+\.\d+(?:-[\da-z.-]+)?$/i.test(version)) {
          throw new Error("Invalid Pyodide version");
        }
        const indexURL = `https://cdn.jsdelivr.net/npm/pyodide@${version}/`;
        const { loadPyodide } = /** @type {typeof import("pyodide")} */ (
          await import(`${indexURL}pyodide.mjs`)
        );
        return loadPyodide({ indexURL, jsglobals: {} });
      })());
      reply({ type: "ready" });
      const { code, setups, checks } = event.data;
      const scope = /** @type {PyProxy} */ (python.toPy({}));
      const execute = /** @type {import("pyodide/ffi").PyCallable} */ (
        python.runPython(executorSource, { globals: scope })
      );
      try {
        reply({
          type: "complete",
          results: setups.map((setup) => runCase(python, execute, setup, code)),
          checks: runChecks(python, code, checks),
        });
      } finally {
        execute.destroy();
        scope.destroy();
      }
    } catch {
      reply({ type: "unavailable" });
    }
  },
);
