import { Fragment, useEffect, useId, useState, type ReactNode } from "react";
import Diagram, { type DiagramSpec } from "@/components/learning/Diagram";
import PythonCode from "@/components/python/PythonCode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { markdownCodeBlock } from "@/lib/markdown";

interface Step {
  code: string;
  description: string;
  values?: { name: string; value: string }[];
  output?: string;
  diagram?: DiagramSpec;
  visual?: ReactNode;
}

interface ConceptStepperProps {
  label: string;
  steps: Step[];
  language?: "python" | "text";
}

export default function ConceptStepper({
  label,
  steps,
  language = "python",
}: ConceptStepperProps) {
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

  if (import.meta.env.SSG_MD) {
    return (
      <>
        {`\n\n**${label}**\n\n`}
        {steps.map(
          ({ code, description, values, output, diagram, visual }, i) => {
            const details = [
              values
                ?.map(({ name, value }) => `- \`${name}\` → \`${value}\``)
                .join("\n"),
              output !== undefined &&
                `**输出**\n\n${markdownCodeBlock(output, "text")}`,
              description,
            ];
            return (
              <Fragment key={i}>
                {`**第 ${i + 1} 步**\n\n${markdownCodeBlock(code, language)}\n\n`}
                {diagram && <Diagram diagram={diagram} />}
                {visual}
                {`\n\n${details.filter(Boolean).join("\n\n")}\n\n`}
              </Fragment>
            );
          },
        )}
      </>
    );
  }

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
    <Card asChild className="my-6">
      <figure aria-labelledby={headingId}>
        <figcaption className="flex flex-wrap items-center justify-between gap-2">
          <span id={headingId} className="font-semibold text-rp-text">
            {label}
          </span>
          <span className="rounded-md bg-rp-tint px-2 py-0.5 font-rp-mono text-xs whitespace-nowrap text-rp-text">
            {index + 1} / {steps.length}
          </span>
        </figcaption>
        <div key={index} className="grid min-w-0 gap-2">
          <pre
            className="overflow-x-auto rounded-lg border border-rp-line bg-rp-soft px-3 py-2 font-rp-mono text-sm focus-visible:outline-2 focus-visible:outline-rp-brand"
            tabIndex={0}
            aria-label="当前步骤的代码"
          >
            {language === "python" ? (
              <PythonCode code={step.code} />
            ) : (
              <code>{step.code}</code>
            )}
          </pre>
        </div>
        {step.diagram && <Diagram diagram={step.diagram} />}
        {step.visual}
        <div className="grid min-w-0 gap-2 empty:hidden">
          {!!step.values?.length && (
            <dl className="grid min-w-0 gap-1.5" aria-label="当前变量">
              {step.values.map(({ name, value }) => (
                <div
                  className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 rounded-lg border border-rp-line px-3 py-1.5 font-rp-mono text-sm wrap-anywhere"
                  key={name}
                >
                  <dt className="max-w-full shrink-0 text-rp-brand">
                    <code>{name}</code>
                  </dt>
                  <dd className="flex min-w-0 max-w-full items-baseline gap-2">
                    <span aria-hidden="true">→</span>
                    <code>{value}</code>
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {step.output !== undefined && (
            <div className="grid min-w-0 gap-2 text-sm text-rp-muted">
              <span>输出</span>
              <pre className="overflow-x-auto rounded-lg border border-rp-line bg-rp-soft px-3 py-2 font-rp-mono text-sm focus-visible:outline-2 focus-visible:outline-rp-brand">
                <samp>{step.output}</samp>
              </pre>
            </div>
          )}
        </div>
        <p role="status" className="text-sm text-rp-muted">
          {step.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => goTo(index - 1)}
            disabled={!ready || index === 0}
          >
            上一步
          </Button>
          <Button
            onClick={() => goTo(index + 1)}
            disabled={!ready || index === lastIndex}
          >
            下一步
          </Button>
          {lastIndex > 0 && (
            <Button
              variant="outline"
              onClick={togglePlayback}
              disabled={!ready}
            >
              {playing ? "暂停" : index === lastIndex ? "重新播放" : "播放"}
            </Button>
          )}
        </div>
      </figure>
    </Card>
  );
}
