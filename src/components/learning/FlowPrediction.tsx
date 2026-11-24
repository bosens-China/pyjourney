import { useId, useState } from "react";
import Diagram, { type FlowDiagram } from "@/components/learning/Diagram";
import ActionButton from "@/components/ui/ActionButton";

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

  return (
    <section
      aria-labelledby={questionId}
      className="rp-not-doc my-6 grid min-w-0 gap-4 rounded-xl border border-rp-line bg-rp-surface p-4 sm:p-6"
    >
      <p id={questionId} className="font-semibold text-rp-text">
        {question}
      </p>
      <pre
        className="overflow-x-auto rounded-lg border border-rp-line bg-rp-soft px-3 py-2 font-rp-mono text-sm/relaxed text-rp-text focus-visible:outline-2 focus-visible:outline-rp-brand"
        tabIndex={0}
        aria-label="题目代码"
      >
        <code>{code}</code>
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
          <ActionButton
            key={choice.label}
            primary={selected === choice}
            aria-pressed={selected === choice}
            onClick={() => setSelected(choice)}
          >
            {choice.label}
          </ActionButton>
        ))}
      </div>
      <div role="status" className="text-sm text-rp-text empty:sr-only">
        {selected && (
          <p data-result={selected.path ? "correct" : "incorrect"}>
            <strong
              className={
                selected.path
                  ? "text-green-700 dark:text-green-300"
                  : "text-amber-800 dark:text-amber-300"
              }
            >
              {selected.path ? "答对了" : "再想一想"}
            </strong>{" "}
            {selected.feedback}
          </p>
        )}
      </div>
    </section>
  );
}
