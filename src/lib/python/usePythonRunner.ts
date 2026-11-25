import { useEffect, useRef, useState } from "react";
import { version } from "pyodide/package.json";
import type {
  PythonResult,
  PythonWorkerReply,
  PythonWorkerRequest,
} from "./protocol";

type RunState =
  | { phase: "idle" | "loading" | "running" }
  | { phase: "complete"; results: PythonResult[]; checks: boolean[] | null }
  | { phase: "error"; message: string };

const loadDeadline = 45_000;
const runDeadline = 8_000;

export function usePythonRunner({ reuseWorker = true } = {}) {
  const worker = useRef<Worker>(null);
  const deadline = useRef<number>(null);
  const [state, setState] = useState<RunState>({ phase: "idle" });

  function clearDeadline() {
    if (deadline.current !== null) window.clearTimeout(deadline.current);
    deadline.current = null;
  }

  function close() {
    clearDeadline();
    worker.current?.terminate();
    worker.current = null;
  }

  useEffect(() => close, []);

  function fail(message: string) {
    close();
    setState({ phase: "error", message });
  }

  function run(request: PythonWorkerRequest) {
    if (deadline.current !== null) return;

    setState({ phase: worker.current ? "running" : "loading" });
    try {
      // 将 Worker 作为独立文件发布，浏览器按 ES 模块加载。
      const workerUrl = new URL("./python.worker.mjs", import.meta.url);
      workerUrl.searchParams.set("version", version);
      const current =
        worker.current ?? new Worker(workerUrl, { type: "module" });
      worker.current = current;
      const unavailable = "Python 环境启动失败。请检查网络后重试。";

      deadline.current = window.setTimeout(
        () => fail(unavailable),
        loadDeadline,
      );
      current.onmessage = (event: MessageEvent<PythonWorkerReply>) => {
        if (worker.current !== current) return;
        clearDeadline();

        switch (event.data.type) {
          case "ready":
            setState({ phase: "running" });
            deadline.current = window.setTimeout(
              () => fail("运行超过 8 秒，已停止。请检查代码后重试。"),
              runDeadline,
            );
            break;
          case "complete":
            if (!reuseWorker) close();
            setState({
              phase: "complete",
              results: event.data.results,
              checks: event.data.checks,
            });
            break;
          case "unavailable":
            fail(unavailable);
            break;
        }
      };
      current.onerror = () => {
        if (worker.current === current) fail(unavailable);
      };
      current.postMessage(request);
    } catch {
      fail("无法启动 Python 环境。请刷新页面后重试。");
    }
  }

  return {
    state,
    run,
    stop: () => fail("运行已停止。"),
    reset: () => setState({ phase: "idle" }),
  };
}
