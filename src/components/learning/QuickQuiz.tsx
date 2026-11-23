import { useEffect, useId, useState } from "react";
import "./learning.css";

interface QuickQuizProps {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export default function QuickQuiz({
  question,
  options,
  answerIndex,
  explanation,
}: QuickQuizProps) {
  const name = useId();
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = selected === answerIndex;

  useEffect(() => setReady(true), []);

  return (
    <form
      className="learning-card not-content"
      onSubmit={(event) => {
        event.preventDefault();
        if (selected !== null) setChecked(true);
      }}
    >
      <fieldset className="learning-choices" disabled={!ready}>
        <legend className="learning-title">{question}</legend>
        {options.map((option, index) => (
          <label className="learning-choice" key={index}>
            <input
              type="radio"
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
      <div className="learning-actions">
        <button
          type="submit"
          className="learning-button learning-button-primary"
          disabled={selected === null}
        >
          检查答案
        </button>
      </div>
      <div role="status">
        {checked && (
          <div
            className="learning-feedback"
            data-result={correct ? "correct" : "incorrect"}
          >
            <strong>{correct ? "答对了" : "再想一想"}</strong>
            <p>{explanation}</p>
          </div>
        )}
      </div>
    </form>
  );
}
