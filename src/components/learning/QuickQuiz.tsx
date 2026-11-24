import { useEffect, useId, useState } from "react";
import ActionButton from "@/components/ui/ActionButton";

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
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = selected === answerIndex;
  const hint = selected === null ? undefined : feedback?.[selected];

  useEffect(() => setReady(true), []);

  return (
    <form
      className="rp-not-doc my-6 grid min-w-0 gap-4 rounded-xl border border-rp-line bg-rp-surface p-4 sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (selected !== null) setChecked(true);
      }}
    >
      <fieldset className="grid min-w-0 gap-2" disabled={!ready}>
        <legend className="mb-3 font-semibold text-rp-text">{question}</legend>
        {code && (
          <pre
            className="mb-2 overflow-x-auto rounded-lg border border-rp-line bg-rp-soft px-3 py-2 font-rp-mono text-sm/relaxed text-rp-text"
            tabIndex={0}
            aria-label="题目代码"
          >
            <code>{code}</code>
          </pre>
        )}
        {options.map((option, index) => (
          <label
            className="flex cursor-pointer items-baseline gap-2.5 rounded-lg border border-rp-line px-3 py-2 wrap-anywhere hover:bg-rp-soft focus-within:border-rp-brand has-checked:border-rp-brand has-checked:bg-rp-tint"
            key={index}
          >
            <input
              type="radio"
              className="shrink-0 accent-rp-brand"
              name={name}
              value={index}
              checked={selected === index}
              onChange={() => {
                setSelected(index);
                setChecked(false);
              }}
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      <div className="flex flex-wrap gap-2">
        <ActionButton type="submit" primary disabled={selected === null}>
          检查答案
        </ActionButton>
      </div>
      <div role="status" className="empty:hidden">
        {checked && (
          <div
            className="grid gap-1.5 rounded-lg border border-rp-line bg-rp-soft p-3 text-sm"
            data-result={correct ? "correct" : "incorrect"}
          >
            <strong
              className={
                correct
                  ? "text-green-700 dark:text-green-300"
                  : "text-amber-800 dark:text-amber-300"
              }
            >
              {correct ? "答对了" : "再想一想"}
            </strong>
            {correct || !hint ? <p>{explanation}</p> : <p>{hint}</p>}
          </div>
        )}
      </div>
    </form>
  );
}
