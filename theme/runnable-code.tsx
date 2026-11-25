import {
  CodeButtonGroup as OriginalCodeButtonGroup,
  getCustomMDXComponent as getOriginalComponents,
  type CodeButtonGroupProps,
} from "@rspress/core/theme-original";
import { LoaderCircle, Play } from "lucide-react";
import {
  createContext,
  useContext,
  useRef,
  type ComponentProps,
  type RefObject,
} from "react";
import { Button } from "@/components/ui/button";
import { usePythonRunner } from "@/lib/python/usePythonRunner";

const { pre: OriginalPre } = getOriginalComponents();
type PreProps = ComponentProps<typeof OriginalPre>;

const RunControl = createContext<{
  run: () => void;
  button: RefObject<HTMLButtonElement | null>;
  busy: boolean;
} | null>(null);

export function CodeButtonGroup(props: CodeButtonGroupProps) {
  const control = useContext(RunControl);
  if (!control) return <OriginalCodeButtonGroup {...props} />;

  return (
    <div className="rp-code-button-group pyjourney-run-toolbar">
      <Button
        ref={control.button}
        variant="ghost"
        size="icon-sm"
        className="rp-code-button-group__button focus-visible:border-transparent focus-visible:ring-0 aria-disabled:cursor-wait"
        aria-label="运行 Python 示例"
        aria-disabled={control.busy}
        title="运行"
        onClick={control.run}
      >
        <Play className="rp-code-button-group__icon" aria-hidden="true" />
      </Button>
      <OriginalCodeButtonGroup {...props} />
    </div>
  );
}

function RunnablePre({ code, ...props }: PreProps & { code: string }) {
  const { state, run, stop, reset } = usePythonRunner({ reuseWorker: false });
  const runButton = useRef<HTMLButtonElement>(null);
  const showingOutput = state.phase !== "idle";
  const busy = state.phase === "loading" || state.phase === "running";
  const result = state.phase === "complete" ? state.results[0] : undefined;

  function hideOutput() {
    reset();
    runButton.current?.focus();
  }

  const outputClass =
    "overflow-x-auto font-rp-mono text-sm/relaxed wrap-anywhere whitespace-pre-wrap";

  return (
    <>
      <div className="pyjourney-runnable-source">
        <RunControl.Provider
          value={{
            run: () => {
              if (!busy) run({ code, setups: [""], checks: [] });
            },
            button: runButton,
            busy,
          }}
        >
          <OriginalPre {...props} />
        </RunControl.Provider>
      </div>
      {showingOutput && (
        <section
          aria-label="示例运行结果"
          className="rp-not-doc my-4 min-h-28 min-w-0 rounded-xl border border-rp-line bg-white text-rp-text shadow-sm dark:bg-rp-surface"
        >
          <div className="flex items-center justify-between gap-2 border-b border-rp-line px-4 py-2">
            <strong className="text-sm">运行结果</strong>
            <Button
              variant="ghost"
              size="sm"
              onClick={busy ? stop : hideOutput}
            >
              {busy ? "停止运行" : "收起结果"}
            </Button>
          </div>
          <div role="status" className="grid min-w-0 gap-2 px-4 py-3">
            {busy && (
              <p className="flex items-center gap-2 text-sm text-rp-muted">
                <LoaderCircle
                  className="size-4 animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
                {state.phase === "loading"
                  ? "正在准备 Python 环境…"
                  : "正在运行代码…"}
              </p>
            )}
            {state.phase === "error" && (
              <p className="text-sm text-destructive">{state.message}</p>
            )}
            {result?.stdout && (
              <pre className={outputClass} aria-label="代码输出">
                <samp>{result.stdout}</samp>
              </pre>
            )}
            {result?.stderr && (
              <pre
                className={`${outputClass} text-destructive`}
                aria-label="错误输出"
              >
                <samp>{result.stderr}</samp>
              </pre>
            )}
            {result?.error && (
              <pre
                className={`${outputClass} text-destructive`}
                aria-label="运行错误"
              >
                <samp>{result.error}</samp>
              </pre>
            )}
            {result?.truncated && (
              <p className="text-sm text-rp-muted">输出过长，已截断。</p>
            )}
            {result && !result.stdout && !result.stderr && !result.error && (
              <p className="text-sm text-rp-muted">运行完成，代码没有输出。</p>
            )}
          </div>
        </section>
      )}
    </>
  );
}

function CodePre({
  "data-run-source": code,
  ...props
}: PreProps & { "data-run-source"?: string }) {
  return code === undefined ? (
    <OriginalPre {...props} />
  ) : (
    <RunnablePre {...props} code={code} />
  );
}

export function getCustomMDXComponent() {
  return { ...getOriginalComponents(), pre: CodePre };
}
