import { useEffect, useId, useState } from "react";
import "./learning.css";

interface Step {
  code: string;
  description: string;
  values?: { name: string; value: string }[];
  output?: string;
}

interface ConceptStepperProps {
  label: string;
  steps: Step[];
}

export default function ConceptStepper({ label, steps }: ConceptStepperProps) {
  const headingId = useId();
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const lastIndex = steps.length - 1;
  const step = steps[index];

  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (!playing) return;

    const timer = window.setTimeout(() => {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      if (nextIndex === lastIndex) setPlaying(false);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [index, lastIndex, playing]);

  if (!step) return null;

  function goTo(nextIndex: number) {
    setPlaying(false);
    setIndex(nextIndex);
  }

  function togglePlayback() {
    if (playing) {
      setPlaying(false);
      return;
    }

    if (index === lastIndex) setIndex(0);
    setPlaying(true);
  }

  return (
    <figure className="learning-card not-content" aria-labelledby={headingId}>
      <figcaption className="learning-header">
        <span id={headingId} className="learning-title">
          {label}
        </span>
        <span className="learning-progress">
          {index + 1} / {steps.length}
        </span>
      </figcaption>
      <div key={index} className="learning-step-frame">
        <pre className="learning-code" tabIndex={0} aria-label="当前步骤的代码">
          <code>{step.code}</code>
        </pre>
        {!!step.values?.length && (
          <dl className="learning-values" aria-label="当前变量">
            {step.values.map(({ name, value }) => (
              <div className="learning-binding" key={name}>
                <dt>
                  <code>{name}</code>
                </dt>
                <dd>
                  <span aria-hidden="true">→</span>
                  <code>{value}</code>
                </dd>
              </div>
            ))}
          </dl>
        )}
        {step.output !== undefined && (
          <div className="learning-output">
            <span>输出</span>
            <pre className="learning-code">
              <samp>{step.output}</samp>
            </pre>
          </div>
        )}
      </div>
      <p role="status" className="learning-step-description">
        {step.description}
      </p>
      <div className="learning-actions">
        <button
          type="button"
          className="learning-button"
          onClick={() => goTo(index - 1)}
          disabled={!ready || index === 0}
        >
          上一步
        </button>
        <button
          type="button"
          className="learning-button learning-button-primary"
          onClick={() => goTo(index + 1)}
          disabled={!ready || index === lastIndex}
        >
          下一步
        </button>
        {lastIndex > 0 && (
          <button
            type="button"
            className="learning-button"
            onClick={togglePlayback}
            disabled={!ready}
          >
            {playing ? "暂停" : index === lastIndex ? "重新播放" : "播放"}
          </button>
        )}
      </div>
    </figure>
  );
}
