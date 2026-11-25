import { markdownCodeBlock } from "@/lib/markdown";
import PythonCode from "./PythonCode";

export default function ChallengeExample({
  example,
}: {
  example: { setup: string; expectedOutput: string };
}) {
  if (import.meta.env.SSG_MD) {
    const output = example.expectedOutput
      ? markdownCodeBlock(example.expectedOutput, "text")
      : "无输出。";
    return (
      <>{`\n\n### 样例变量\n\n${markdownCodeBlock(example.setup)}\n\n### 样例预期输出\n\n${output}\n\n`}</>
    );
  }

  const blockClass =
    "rounded-lg bg-rp-soft px-3 py-2.5 font-rp-mono text-sm wrap-anywhere whitespace-pre-wrap";

  return (
    <>
      <h3>样例变量</h3>
      <pre className={blockClass}>
        <PythonCode code={example.setup} />
      </pre>

      <h3>样例预期输出</h3>
      <pre className={blockClass}>
        <samp>{example.expectedOutput}</samp>
      </pre>
    </>
  );
}
