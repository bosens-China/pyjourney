import { useId } from "react";
import Diagram, { type FlowDiagram } from "@/components/learning/Diagram";
import PythonCode from "@/components/python/PythonCode";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const exceptionFlow = {
  kind: "flow",
  nodes: [
    { id: "try", label: "try" },
    { id: "else", label: "else" },
    { id: "except", label: "except" },
    { id: "finally", label: "finally" },
    { id: "propagate", label: "异常向外传播" },
  ],
  edges: [
    ["try", "else"],
    ["try", "except", 1],
    ["try", "finally", 2],
    ["else", "finally", -1],
    ["except", "finally"],
    ["finally", "propagate"],
  ],
} satisfies Omit<FlowDiagram, "active">;

const scenarios = [
  {
    id: "successful",
    label: "除法成功",
    call: "divide(2, 1)",
    path: ["try", "else", "finally"],
    output: "result is 2.0\nexecuting finally clause",
    explanation: "除法成功。else 打印结果，随后执行 finally。",
  },
  {
    id: "caught",
    label: "异常被捕获",
    call: "divide(2, 0)",
    error: "ZeroDivisionError",
    path: ["try", "except", "finally"],
    output: "division by zero!\nexecuting finally clause",
    explanation: "except 捕获 ZeroDivisionError，随后执行 finally。",
  },
  {
    id: "propagated",
    label: "异常向外传播",
    call: 'divide("2", "1")',
    error: "TypeError",
    path: ["try", "finally", "propagate"],
    output: "executing finally clause",
    explanation:
      "TypeError 没有匹配的处理器。执行 finally 后，异常继续向外传播。",
  },
];

export default function ExceptionPaths() {
  const caption = useId();

  return (
    <Card asChild className="my-6">
      <figure aria-labelledby={caption}>
        <figcaption id={caption} className="font-semibold">
          三种调用各自经过哪些子句？
        </figcaption>
        <Tabs defaultValue="successful">
          <TabsList
            aria-label="选择调用情形"
            className="h-auto w-full flex-wrap sm:w-fit"
          >
            {scenarios.map(({ id, label }) => (
              <TabsTrigger key={id} value={id}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          {scenarios.map(({ id, call, path, output, explanation }) => (
            <TabsContent
              key={id}
              value={id}
              className="grid min-w-0 gap-2 data-[state=inactive]:hidden"
            >
              <pre className="overflow-x-auto rounded-lg border border-rp-line bg-rp-soft px-3 py-2 font-rp-mono text-sm">
                <PythonCode code={call} />
              </pre>
              <Diagram diagram={{ ...exceptionFlow, active: path }} />
              <p className="text-rp-muted">{explanation}</p>
              <pre
                aria-label="程序打印的内容"
                className="overflow-x-auto rounded-lg border border-rp-line bg-rp-soft px-3 py-2 font-rp-mono text-sm"
              >
                <samp>{output}</samp>
              </pre>
            </TabsContent>
          ))}
        </Tabs>
      </figure>
    </Card>
  );
}
