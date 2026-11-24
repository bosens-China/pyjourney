import { useId, useState } from "react";
import ActionButton from "@/components/ui/ActionButton";

const codeLines = [
  "def countdown(n):",
  "    while n > 0:",
  "        yield n",
  "        n -= 1",
];
const initialNumber = 3;

export default function GeneratorExplorer() {
  const headingId = useId();
  const [calls, setCalls] = useState(0);
  const finished = calls > initialNumber;
  const paused = calls > 0 && !finished;
  const latest = initialNumber - calls + 1;
  const activeLine = paused ? 2 : finished ? 1 : -1;

  return (
    <figure
      className="rp-not-doc my-6 grid min-w-0 gap-4 rounded-xl border border-rp-line bg-rp-surface p-4 text-rp-text sm:p-6"
      aria-labelledby={headingId}
    >
      <figcaption id={headingId} className="font-semibold">
        一次 next() 会跑到哪里？
      </figcaption>
      <p className="text-sm text-rp-muted">
        对同一个生成器多调用几次 <code>next(g)</code>
        ，看每次交出的值和暂停的位置。
      </p>
      <pre className="overflow-x-auto rounded-lg border border-rp-line bg-rp-soft py-2 font-rp-mono text-sm">
        <code>
          {codeLines.map((line, index) => (
            <span
              key={line}
              className={`block border-l-2 px-3 ${
                activeLine === index
                  ? "border-rp-brand bg-rp-tint"
                  : "border-transparent"
              }`}
            >
              {line}
            </span>
          ))}
          <span className="mt-2 block border-l-2 border-transparent px-3">
            g = countdown(3)
          </span>
        </code>
      </pre>
      <div className="flex flex-wrap gap-2">
        <ActionButton
          primary
          disabled={finished}
          onClick={() => setCalls((count) => count + 1)}
        >
          <code className="font-rp-mono">next(g)</code>
        </ActionButton>
        <ActionButton disabled={calls === 0} onClick={() => setCalls(0)}>
          重新创建生成器
        </ActionButton>
      </div>
      <div
        role="status"
        className="grid gap-1 rounded-md bg-rp-soft px-3 py-2 text-sm"
      >
        {calls === 0 ? (
          <p>
            <strong>已创建。</strong> 函数体还没开始运行。
          </p>
        ) : finished ? (
          <>
            <p>
              <strong>已结束。</strong> 本次调用引发 <samp>StopIteration</samp>
              。
            </p>
            <p>
              从上次的 <code>yield</code> 后继续，把 <code>n</code> 减到{" "}
              <code>0</code>，循环结束。
            </p>
          </>
        ) : (
          <>
            <p>
              <strong>
                暂停在 <code>yield n</code>。
              </strong>{" "}
              本次交出 <samp>{latest}</samp>，此时仍是 <code>n = {latest}</code>
              。
            </p>
            <p>
              {calls === 1
                ? "第一次调用从函数体开头运行。"
                : "这次从上次的 yield 后继续，先执行 n -= 1，再回到循环。"}
              下次会从 <code>n -= 1</code> 继续。
            </p>
          </>
        )}
      </div>
    </figure>
  );
}
