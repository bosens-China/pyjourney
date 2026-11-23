import { useEffect, useState } from "react";
import type { PythonCase, PythonResult } from "@/lib/python/protocol";
import { usePythonRunner } from "@/lib/python/usePythonRunner";
import PythonEditor from "./PythonEditor";
import "./python.css";

type Props = {
  starterCode: string;
  label: string;
  cases: PythonCase[];
  chapter?: boolean;
};

type Execution = {
  code: string;
  cases: PythonCase[];
  check: boolean;
};

function normalize(output: string) {
  return output.replace(/\r\n/g, "\n").replace(/\n$/, "");
}

function passed(result: PythonResult, test: PythonCase) {
  return (
    !result.error &&
    !result.truncated &&
    test.expectedOutput !== undefined &&
    normalize(result.stdout) === normalize(test.expectedOutput)
  );
}

function CaseResult({
  result,
  test,
  check,
}: {
  result: PythonResult;
  test: PythonCase;
  check: boolean;
}) {
  const success = check && passed(result, test);
  const status = result.error ? "运行出错" : success ? "通过" : "输出不符";

  return (
    <li className="pj-python__result">
      <div className="pj-python__result-header">
        <strong>{test.label}</strong>
        {(check || result.error) && (
          <span data-status={success ? "passed" : "failed"}>{status}</span>
        )}
      </div>
      <pre aria-label="实际输出">{result.stdout || "暂无输出"}</pre>
      {result.stderr && <pre aria-label="错误输出">{result.stderr}</pre>}
      {result.error && <pre aria-label="运行错误">{result.error}</pre>}
      {result.truncated && <p>输出过长，已截断。</p>}
      {check && !success && test.expectedOutput !== undefined && (
        <div className="pj-python__expected">
          <span>预期输出</span>
          <pre>{test.expectedOutput}</pre>
        </div>
      )}
    </li>
  );
}

export default function CodeWorkspace({
  starterCode,
  label,
  cases,
  chapter,
}: Props) {
  const [code, setCode] = useState(starterCode);
  const [execution, setExecution] = useState<Execution>();
  const [ready, setReady] = useState(false);
  const { state, run, stop, reset } = usePythonRunner();
  const busy = state.phase === "loading" || state.phase === "running";
  const showResults = state.phase === "complete" && execution?.code === code;

  useEffect(() => setReady(true), []);

  function execute(check: boolean) {
    const selected = check ? cases : cases.slice(0, 1);
    const inputs: PythonCase[] = selected.length
      ? selected
      : [{ label: "本次运行", setup: "" }];
    setExecution({
      code,
      cases: inputs,
      check: check || (!chapter && inputs[0]?.expectedOutput !== undefined),
    });
    run({ code, setups: inputs.map(({ setup }) => setup) });
  }

  function restore() {
    setCode(starterCode);
    setExecution(undefined);
    reset();
  }

  return (
    <section className="pj-python not-content" aria-label={label}>
      <div className="pj-python__panel">
        <div className="pj-python__section-header">
          <strong>{label}</strong>
          <span>Python</span>
        </div>
        <PythonEditor code={code} onChange={setCode} />
        <div className="pj-python__actions">
          <button
            type="button"
            data-variant={chapter ? "secondary" : "primary"}
            disabled={!ready || busy}
            onClick={() => execute(false)}
          >
            {chapter ? "运行示例" : "运行代码"}
          </button>
          {chapter && cases.length > 0 && (
            <button
              type="button"
              data-variant="primary"
              disabled={!ready || busy}
              onClick={() => execute(true)}
            >
              检查答案
            </button>
          )}
          {busy ? (
            <button type="button" onClick={stop}>
              停止
            </button>
          ) : (
            <button
              type="button"
              disabled={code === starterCode}
              onClick={restore}
            >
              重置代码
            </button>
          )}
        </div>
      </div>
      <div className="pj-python__output" aria-live="polite">
        <p className="pj-python__output-title">运行结果</p>
        {state.phase === "idle" && <p>运行代码后，输出会出现在这里。</p>}
        {state.phase === "loading" && <p>正在加载 Python 环境⋯⋯</p>}
        {state.phase === "running" && <p>正在执行代码⋯⋯</p>}
        {state.phase === "error" && <p data-status="failed">{state.message}</p>}
        {showResults && (
          <>
            {execution.check && chapter && (
              <p>
                通过{" "}
                {
                  state.results.filter((result, index) =>
                    passed(result, execution.cases[index]),
                  ).length
                }
                {" / "}
                {execution.cases.length} 组测试
              </p>
            )}
            <ul className="pj-python__results">
              {state.results.map((result, index) => (
                <CaseResult
                  key={index}
                  result={result}
                  test={execution.cases[index]}
                  check={execution.check}
                />
              ))}
            </ul>
          </>
        )}
        {state.phase === "complete" && !showResults && (
          <p>代码已更改，请重新运行。</p>
        )}
      </div>
    </section>
  );
}
