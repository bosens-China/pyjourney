import { loadPyodide, version } from "pyodide";
import type { PyProxy } from "pyodide/ffi";
import type {
  PythonResult,
  PythonWorkerReply,
  PythonWorkerRequest,
} from "./protocol";

const outputLimit = 8_192;
let runtime: ReturnType<typeof loadPyodide> | undefined;

function captureOutput() {
  const decoder = new TextDecoder();
  let output = "";
  let remaining = outputLimit;
  let truncated = false;

  return {
    write(buffer: Uint8Array) {
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

type PythonRuntime = Awaited<ReturnType<typeof loadPyodide>>;

function formatError(error: unknown) {
  if (!(error instanceof Error)) return "运行代码时发生错误。";

  const frame = error.message.indexOf('  File "练习.py"');
  return (
    (frame >= 0 ? error.message.slice(frame) : error.message)
      .trim()
      .slice(0, outputLimit) || "运行代码时发生错误。"
  );
}

function runCase(
  python: PythonRuntime,
  setup: string,
  code: string,
): PythonResult {
  const stdout = captureOutput();
  const stderr = captureOutput();
  const globals = python.toPy({}) as PyProxy;
  let error: string | undefined;

  python.setStdout(stdout);
  python.setStderr(stderr);
  try {
    if (setup) python.runPython(setup, { globals });
    const result: unknown = python.runPython(code, {
      globals,
      filename: "练习.py",
      dedent: false,
    });
    if (result instanceof python.ffi.PyProxy) result.destroy();
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

function reply(message: PythonWorkerReply) {
  self.postMessage(message);
}

self.addEventListener(
  "message",
  async (event: MessageEvent<PythonWorkerRequest>) => {
    try {
      const python = await (runtime ??= loadPyodide({
        indexURL: `https://cdn.jsdelivr.net/pyodide/v${version}/full/`,
        jsglobals: {},
      }));
      reply({ type: "ready" });
      const { code, setups } = event.data;
      reply({
        type: "complete",
        results: setups.map((setup) => runCase(python, setup, code)),
      });
    } catch {
      reply({ type: "unavailable" });
    }
  },
);
