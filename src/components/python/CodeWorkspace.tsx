import { ChevronDown } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { markdownCodeBlock } from "@/lib/markdown";
import type {
  PythonCase,
  PythonCheck,
  PythonResult,
} from "@/lib/python/protocol";
import { usePythonRunner } from "@/lib/python/usePythonRunner";
import PythonCode from "./PythonCode";
import PythonEditor from "./PythonEditor";
import { Card } from "@/components/ui/card";

type Props = {
  starterCode: string;
  solution?: string;
  label: string;
  cases: PythonCase[];
  checks?: PythonCheck[];
  chapter?: boolean;
};

type Execution = {
  code: string;
  cases: PythonCase[];
  checks: PythonCheck[];
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

const outputCode =
  "rounded-lg border border-rp-line bg-rp-soft px-3 py-2.5 font-rp-mono text-xs/relaxed wrap-anywhere whitespace-pre-wrap";

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
    <li className="grid gap-1.5 rounded-lg border border-rp-line p-3">
      <div className="flex flex-wrap items-center justify-between gap-1.5 text-rp-text">
        <strong>{test.label}</strong>
        {(check || result.error) && (
          <span
            className={
              success
                ? "font-semibold text-green-700 dark:text-green-300"
                : "font-semibold text-red-700 dark:text-red-300"
            }
          >
            {status}
          </span>
        )}
      </div>
      <pre className={outputCode} aria-label="实际输出">
        {result.stdout || "暂无输出"}
      </pre>
      {result.stderr && (
        <pre
          className={`${outputCode} text-red-700 dark:text-red-300`}
          aria-label="错误输出"
        >
          {result.stderr}
        </pre>
      )}
      {result.error && (
        <pre
          className={`${outputCode} text-red-700 dark:text-red-300`}
          aria-label="运行错误"
        >
          {result.error}
        </pre>
      )}
      {result.truncated && <p>输出过长，已截断。</p>}
      {check && !success && test.expectedOutput !== undefined && (
        <div className="grid gap-1.5">
          <span className="text-amber-800 dark:text-amber-300">预期输出</span>
          <pre className={outputCode}>{test.expectedOutput || "无输出"}</pre>
        </div>
      )}
    </li>
  );
}

function CheckResults({
  checks,
  outcome,
}: {
  checks: PythonCheck[];
  outcome: boolean[] | null;
}) {
  if (!checks.length) return null;
  if (!outcome) return <p>代码有语法错误，暂未检查写法要求。</p>;

  return (
    <div className="grid gap-1.5 rounded-lg border border-rp-line p-3">
      <strong className="text-rp-text">写法要求</strong>
      <ul className="grid gap-1">
        {checks.map(({ message }, index) => (
          <li
            key={message}
            className={
              outcome[index]
                ? "text-green-700 dark:text-green-300"
                : "text-red-700 dark:text-red-300"
            }
          >
            {outcome[index] ? "✓ " : "✗ "}
            {message}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Summary({
  chapter,
  passedCases,
  totalCases,
  checks,
}: {
  chapter?: boolean;
  passedCases: number;
  totalCases: number;
  checks: boolean[] | null;
}) {
  const passedChecks = checks?.filter(Boolean).length ?? 0;
  const totalChecks = checks?.length ?? 0;

  if (chapter) {
    return (
      <p>
        通过 {passedCases} / {totalCases} 组测试
        {totalChecks > 0 &&
          `，满足 ${passedChecks} / ${totalChecks} 条写法要求`}
      </p>
    );
  }

  if (passedCases < totalCases || !totalChecks) return null;
  const complete = passedChecks === totalChecks;
  return (
    <p
      className={
        complete
          ? "font-semibold text-green-700 dark:text-green-300"
          : "font-semibold text-amber-800 dark:text-amber-300"
      }
    >
      {complete
        ? "输出和写法要求全部满足。"
        : `输出正确，还有 ${totalChecks - passedChecks} 条写法要求未满足。`}
    </p>
  );
}

export default function CodeWorkspace(props: Props) {
  if (import.meta.env.SSG_MD) {
    const { starterCode, solution, label, cases, chapter } = props;
    const blocks = chapter ? [] : [`**${label}**`];
    blocks.push(markdownCodeBlock(starterCode));

    const expectedOutput = chapter ? undefined : cases[0]?.expectedOutput;
    if (expectedOutput !== undefined) {
      blocks.push(
        expectedOutput
          ? `**预期输出**\n\n${markdownCodeBlock(expectedOutput, "text")}`
          : "**预期输出**\n\n无输出。",
      );
    }
    if (solution) {
      blocks.push(
        `<details>\n<summary>查看参考答案</summary>\n\n${markdownCodeBlock(solution)}\n\n</details>`,
      );
    }
    return <>{`\n\n${blocks.join("\n\n")}\n\n`}</>;
  }

  return <InteractiveCodeWorkspace {...props} />;
}

function InteractiveCodeWorkspace({
  starterCode,
  solution,
  label,
  cases,
  checks = [],
  chapter,
}: Props) {
  const resultHeadingId = useId();
  const [code, setCode] = useState(starterCode);
  const [execution, setExecution] = useState<Execution>();
  const [ready, setReady] = useState(false);
  const { state, run, stop, reset } = usePythonRunner();
  const busy = state.phase === "loading" || state.phase === "running";
  const showResults = state.phase === "complete" && execution?.code === code;

  useEffect(() => setReady(true), []);

  function execute(checkAll: boolean) {
    const selected = checkAll ? cases : cases.slice(0, 1);
    const inputs: PythonCase[] = selected.length
      ? selected
      : [{ label: "本次运行", setup: "" }];
    const check =
      checkAll || (!chapter && inputs[0]?.expectedOutput !== undefined);
    const selectedChecks = check ? checks : [];
    setExecution({ code, cases: inputs, checks: selectedChecks, check });
    run({
      code,
      setups: inputs.map(({ setup }) => setup),
      checks: selectedChecks,
    });
  }

  function restore() {
    setCode(starterCode);
    setExecution(undefined);
    reset();
  }

  return (
    <Card
      asChild
      className={`gap-0 overflow-hidden p-0 sm:p-0 ${chapter ? "" : "my-6"}`}
    >
      <section aria-label={label}>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-rp-line px-4 py-3 text-sm">
            <strong>{label}</strong>
            <span className="font-rp-mono text-xs text-rp-muted">Python</span>
          </div>
          <PythonEditor code={code} onChange={setCode} />
          <div className="flex flex-wrap gap-2 border-t border-rp-line px-4 py-3">
            <Button
              variant={!chapter ? "default" : "outline"}
              disabled={!ready || busy}
              onClick={() => execute(false)}
            >
              {chapter ? "运行示例" : "运行代码"}
            </Button>
            {chapter && cases.length > 0 && (
              <Button disabled={!ready || busy} onClick={() => execute(true)}>
                检查答案
              </Button>
            )}
            {busy ? (
              <Button variant="outline" onClick={stop}>
                停止
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled={code === starterCode}
                onClick={restore}
              >
                重置代码
              </Button>
            )}
          </div>
        </div>
        <div
          className="grid gap-2 border-t border-rp-line px-4 py-3 text-sm text-rp-muted"
          role="region"
          aria-labelledby={resultHeadingId}
          aria-live="polite"
        >
          <p id={resultHeadingId} className="font-semibold text-rp-text">
            运行结果
          </p>
          {state.phase === "idle" && <p>运行代码后，输出会出现在这里。</p>}
          {state.phase === "loading" && <p>正在加载 Python 环境⋯⋯</p>}
          {state.phase === "running" && <p>正在执行代码⋯⋯</p>}
          {state.phase === "error" && (
            <Alert role={undefined} variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          {showResults && (
            <>
              {execution.check && (
                <Summary
                  chapter={chapter}
                  passedCases={
                    state.results.filter((result, index) =>
                      passed(result, execution.cases[index]),
                    ).length
                  }
                  totalCases={execution.cases.length}
                  checks={execution.checks.length ? state.checks : []}
                />
              )}
              <ul className="grid gap-2.5">
                {state.results.map((result, index) => (
                  <CaseResult
                    key={index}
                    result={result}
                    test={execution.cases[index]}
                    check={execution.check}
                  />
                ))}
              </ul>
              <CheckResults checks={execution.checks} outcome={state.checks} />
            </>
          )}
          {state.phase === "complete" && !showResults && (
            <p>代码已更改，请重新运行。</p>
          )}
        </div>
        {solution && (
          <Collapsible className="border-t border-border px-4 py-2 text-sm">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="group w-full justify-between">
                查看参考答案
                <ChevronDown
                  aria-hidden="true"
                  className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid gap-2.5 pt-2 pb-1">
                <pre className={outputCode}>
                  <PythonCode code={solution} />
                </pre>
                <div>
                  <Button
                    variant="outline"
                    disabled={!ready || busy || code === solution}
                    onClick={() => setCode(solution)}
                  >
                    放进编辑器
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </section>
    </Card>
  );
}
