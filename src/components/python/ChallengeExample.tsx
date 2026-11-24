export default function ChallengeExample({
  example,
}: {
  example: { setup: string; expectedOutput: string };
}) {
  const blockClass =
    "rounded-lg bg-rp-soft px-3 py-2.5 font-rp-mono text-sm wrap-anywhere whitespace-pre-wrap";

  return (
    <>
      <h3>样例变量</h3>
      <pre className={blockClass}>
        <code>{example.setup}</code>
      </pre>

      <h3>样例预期输出</h3>
      <pre className={blockClass}>
        <samp>{example.expectedOutput}</samp>
      </pre>
    </>
  );
}
