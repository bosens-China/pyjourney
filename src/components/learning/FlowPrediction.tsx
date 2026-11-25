import { useId, useState } from "react";
import Diagram, { type FlowDiagram } from "@/components/learning/Diagram";
import PythonCode from "@/components/python/PythonCode";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { markdownCodeBlock } from "@/lib/markdown";

interface Choice {
  label: string;
  feedback: string;
  path?: string[];
}

interface FlowPredictionProps {
  question: string;
  code: string;
  choices: Choice[];
  diagram: FlowDiagram;
}

export default function FlowPrediction({
  question,
  code,
  choices,
  diagram,
}: FlowPredictionProps) {
  const questionId = useId();
  const [selected, setSelected] = useState<Choice>();

  if (import.meta.env.SSG_MD) {
    const options = choices
      .map(({ label }, index) => `${index + 1}. ${label}`)
      .join("\n");
    const answer = choices.find(({ path }) => path);
    return (
      <>
        {`\n\n**${question}**\n\n${markdownCodeBlock(code)}\n\n`}
        <Diagram diagram={diagram} />
        {`${options}\n\n`}
        {answer?.path && (
          <>
            {`<details>\n<summary>答案解析</summary>\n\n**答案** ${answer.label}\n\n${answer.feedback}\n\n`}
            <Diagram diagram={{ ...diagram, active: answer.path }} />
            {"</details>\n\n"}
          </>
        )}
      </>
    );
  }

  return (
    <Card asChild className="my-6">
      <section aria-labelledby={questionId}>
        <p id={questionId} className="font-semibold text-rp-text">
          {question}
        </p>
        <pre
          className="overflow-x-auto rounded-lg border border-rp-line bg-rp-soft px-3 py-2 font-rp-mono text-sm/relaxed text-rp-text focus-visible:outline-2 focus-visible:outline-rp-brand"
          tabIndex={0}
          aria-label="题目代码"
        >
          <PythonCode code={code} />
        </pre>
        <Diagram
          diagram={{ ...diagram, active: selected?.path ?? diagram.active }}
        />
        <div
          role="group"
          aria-labelledby={questionId}
          className="flex flex-wrap gap-2"
        >
          {choices.map((choice) => (
            <Button
              key={choice.label}
              variant={selected === choice ? "default" : "outline"}
              aria-pressed={selected === choice}
              onClick={() => setSelected(choice)}
            >
              {choice.label}
            </Button>
          ))}
        </div>
        <div role="status" className="text-sm text-rp-text empty:sr-only">
          {selected && (
            <Alert
              role={undefined}
              className="bg-muted"
              data-result={selected.path ? "correct" : "incorrect"}
            >
              <AlertTitle
                className={
                  selected.path
                    ? "text-green-700 dark:text-green-300"
                    : "text-amber-800 dark:text-amber-300"
                }
              >
                {selected.path ? "答对了" : "再想一想"}
              </AlertTitle>
              <AlertDescription>{selected.feedback}</AlertDescription>
            </Alert>
          )}
        </div>
      </section>
    </Card>
  );
}
