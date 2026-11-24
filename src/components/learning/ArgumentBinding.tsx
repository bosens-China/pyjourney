import { useId, useState } from "react";
import PythonCode from "@/components/python/PythonCode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const argumentsToBind = [
  {
    token: "'select'",
    value: "'select'",
    parameter: "sql",
    rule: "仅限位置",
    explanation: "第一个位置实参绑定到 / 前面的 sql。",
  },
  {
    token: "10",
    value: "10",
    parameter: "timeout",
    rule: "位置或关键字",
    explanation: "第二个位置实参绑定到 timeout，覆盖默认值 30。",
  },
  {
    token: "read_only=True",
    value: "True",
    parameter: "read_only",
    rule: "仅限关键字",
    explanation: "read_only 在 * 后面，按关键字的名字绑定。",
  },
] as const;

type Parameter = (typeof argumentsToBind)[number]["parameter"];

export default function ArgumentBinding() {
  const headingId = useId();
  const [selected, setSelected] = useState<number | null>(null);
  const [bound, setBound] = useState<Parameter[]>([]);
  const [feedback, setFeedback] = useState("");

  function bind(parameter: Parameter) {
    if (selected === null) return;
    const argument = argumentsToBind[selected];
    if (argument.parameter !== parameter) {
      setFeedback(
        `${argument.token} 不能绑定到 ${parameter}。${argument.explanation}`,
      );
      return;
    }

    setBound([...bound, parameter]);
    setFeedback(`${parameter} 收到 ${argument.value}。${argument.explanation}`);
    setSelected(null);
  }

  return (
    <Card asChild className="my-6">
      <figure aria-labelledby={headingId}>
        <figcaption id={headingId} className="font-semibold">
          三个区间怎样接收实参
        </figcaption>
        <pre className="rounded-lg border border-rp-line bg-rp-soft px-3 py-2 font-rp-mono text-sm wrap-anywhere whitespace-pre-wrap">
          <PythonCode
            code={
              "def query(sql, /, timeout=30, *, read_only): ...\nquery('select', 10, read_only=True)"
            }
          />
        </pre>
        <p className="text-sm text-rp-muted">
          先选一个实参，再选它要绑定到的形参。
        </p>
        <div className="grid gap-2" role="group" aria-label="实参">
          <span className="text-sm font-medium">调用时传进来的实参</span>
          <div className="flex flex-wrap gap-2">
            {argumentsToBind.map(({ token, parameter }, index) => (
              <Button
                key={token}
                variant={selected === index ? "default" : "outline"}
                aria-pressed={selected === index}
                disabled={bound.includes(parameter)}
                onClick={() => {
                  setSelected(index);
                  setFeedback("");
                }}
              >
                <code className="font-rp-mono">{token}</code>
              </Button>
            ))}
          </div>
        </div>
        <div className="grid gap-2" role="group" aria-label="形参">
          <span className="text-sm font-medium">函数定义中的形参</span>
          <div className="grid gap-2 sm:grid-cols-3">
            {argumentsToBind.map(({ parameter, rule, value }) => (
              <Button
                variant="outline"
                key={parameter}
                className="grid min-h-16 gap-1 whitespace-normal aria-disabled:cursor-default"
                onClick={() => bind(parameter)}
                aria-disabled={selected === null}
              >
                <code className="font-rp-mono">{parameter}</code>
                <span className="text-xs font-normal text-rp-muted">
                  {rule}
                </span>
                {bound.includes(parameter) && (
                  <samp className="font-rp-mono text-rp-brand">= {value}</samp>
                )}
              </Button>
            ))}
          </div>
        </div>
        <p role="status" className="rounded-md bg-rp-soft px-3 py-2 text-sm">
          {feedback ||
            (selected === null
              ? "选一个实参开始。"
              : `已选 ${argumentsToBind[selected].token}，现在选形参。`)}
          {bound.length === argumentsToBind.length && " 三个实参都已绑定。"}
        </p>
        <div>
          <Button
            variant="outline"
            onClick={() => {
              setBound([]);
              setSelected(null);
              setFeedback("");
            }}
          >
            重新绑定
          </Button>
        </div>
      </figure>
    </Card>
  );
}
