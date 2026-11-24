import { useEffect, useId, useState } from "react";
import PythonCode from "@/components/python/PythonCode";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuickQuizProps {
  question: string;
  code?: string;
  options: string[];
  answerIndex: number;
  /** 与 options 一一对应：选中该项时，解释为什么不对。正确项留空。 */
  feedback?: string[];
  explanation: string;
}

export default function QuickQuiz({
  question,
  code,
  options,
  answerIndex,
  feedback,
  explanation,
}: QuickQuizProps) {
  const name = useId();
  const questionId = `${name}-question`;
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = selected === answerIndex;
  const hint = selected === null ? undefined : feedback?.[selected];

  useEffect(() => setReady(true), []);

  return (
    <Card asChild className="my-6">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (selected !== null) setChecked(true);
        }}
      >
        <fieldset className="grid min-w-0 gap-2" disabled={!ready}>
          <legend id={questionId} className="mb-3 font-semibold">
            {question}
          </legend>
          {code && (
            <pre
              className="mb-2 overflow-x-auto rounded-lg border border-border bg-muted px-3 py-2 font-rp-mono text-sm/relaxed focus-visible:outline-2 focus-visible:outline-ring"
              tabIndex={0}
              aria-label="题目代码"
            >
              <PythonCode code={code} />
            </pre>
          )}
          <RadioGroup
            aria-labelledby={questionId}
            name={name}
            orientation="vertical"
            disabled={!ready}
            value={selected?.toString() ?? ""}
            onValueChange={(value) => {
              setSelected(Number(value));
              setChecked(false);
            }}
          >
            {options.map((option, index) => {
              const id = `${name}-${index}`;
              return (
                <label
                  className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm wrap-anywhere hover:bg-muted focus-within:border-ring has-[button[aria-checked=true]]:border-ring has-[button[aria-checked=true]]:bg-rp-tint"
                  htmlFor={id}
                  key={index}
                >
                  <RadioGroupItem id={id} value={String(index)} />
                  <span>{option}</span>
                </label>
              );
            })}
          </RadioGroup>
        </fieldset>
        <div>
          <Button type="submit" disabled={!ready || selected === null}>
            检查答案
          </Button>
        </div>
        <div role="status" className="empty:sr-only">
          {checked && (
            <Alert
              role={undefined}
              className="bg-muted"
              data-result={correct ? "correct" : "incorrect"}
            >
              <AlertTitle
                className={
                  correct
                    ? "text-green-700 dark:text-green-300"
                    : "text-amber-800 dark:text-amber-300"
                }
              >
                {correct ? "答对了" : "再想一想"}
              </AlertTitle>
              <AlertDescription>
                {correct || !hint ? explanation : hint}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </form>
    </Card>
  );
}
