import { useEffect, useRef, useState } from "react";
import type {
  PythonResult,
  PythonWorkerReply,
  PythonWorkerRequest,
} from "./protocol";

type RunState =
  | { phase: "idle" | "loading" | "running" }
  | { phase: "complete"; results: PythonResult[] }
  | { phase: "error"; message: string };

const loadDeadline = 45_000;
const runDeadline = 8_000;

export function usePythonRunner() {
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
      const current =
        worker.current ??
        new Worker(new URL("./python.worker.ts", import.meta.url), {
          type: "module",
        });
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
            setState({ phase: "complete", results: event.data.results });
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
