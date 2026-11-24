import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";

const numbers = [1, 2, 3];
const trialNumbers = [2, 4, 7];
const remainingNumbers = trialNumbers.slice(1);
const remainingSum = remainingNumbers.reduce((sum, value) => sum + value, 0);
const expected = `${remainingSum} 0 ${remainingSum + trialNumbers[0]}`;
const initial = { position: 0, message: "已创建迭代器，下一项是 1。" };

function Positions({
  values,
  position,
}: {
  values: number[];
  position: number;
}) {
  return (
    <ol className="flex flex-wrap gap-2" aria-label="列表与迭代器位置">
      {values.map((value, index) => {
        const next = index === position;
        return (
          <li
            key={index}
            className={`grid min-w-16 justify-items-center gap-1 rounded-lg border px-2 py-1.5 ${next ? "border-rp-brand bg-rp-tint" : "border-rp-line"}`}
          >
            <code className="font-rp-mono">{value}</code>
            <span className="text-xs text-rp-muted">
              {index < position ? "已取出" : next ? "下一项" : "待取"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function IteratorExplorer() {
  const [state, setState] = useState(initial);
  const [practice, setPractice] = useState(false);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const correct = answer.trim().replace(/\s+/g, " ") === expected;

  function advance() {
    setState(({ position }) => {
      if (position === numbers.length) {
        return { position, message: "引发 StopIteration，迭代器已耗尽。" };
      }

      const next = position + 1;
      const remaining =
        next === numbers.length
          ? "迭代器里已经没有下一项。"
          : `下一项是 ${numbers[next]}。`;
      return {
        position: next,
        message: `取出 ${numbers[position]}。${remaining}`,
      };
    });
  }

  return (
    <section
      className="rp-not-doc my-6 grid gap-4 rounded-xl border border-rp-line bg-rp-surface p-4 text-rp-text sm:p-6"
      aria-label="逐项取值的迭代器"
    >
      <p className="font-rp-mono text-sm">
        <code>{`numbers = [${numbers.join(", ")}]`}</code>
      </p>
      <Positions values={numbers} position={state.position} />
      <p className="text-sm text-rp-muted">
        原列表保存着全部元素。标记显示的是迭代器的当前位置。
      </p>
      <div className="flex flex-wrap gap-2">
        <ActionButton primary className="font-rp-mono" onClick={advance}>
          next(it)
        </ActionButton>
        <ActionButton
          className="font-rp-mono"
          onClick={() => setState(initial)}
        >
          it = iter(numbers)
        </ActionButton>
      </div>
      <p role="status" className="text-sm">
        {state.message}
      </p>

      <div className="grid gap-3 border-t border-rp-line pt-3">
        <div>
          <ActionButton
            aria-expanded={practice}
            onClick={() => setPractice((previous) => !previous)}
          >
            {practice ? "收起自测" : "试一试：预测三次求和"}
          </ActionButton>
        </div>
        {practice && (
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              setChecked(true);
            }}
          >
            <pre className="overflow-x-auto rounded-lg bg-rp-soft p-3 font-rp-mono text-sm">
              <code>{`numbers = [${trialNumbers.join(", ")}]\nit = iter(numbers)\nnext(it)\nprint(sum(it), sum(it), sum(numbers))`}</code>
            </pre>
            <Positions values={trialNumbers} position={1} />
            <label className="grid max-w-sm gap-1 text-sm font-medium">
              按顺序输入三个结果，用空格隔开
              <input
                required
                className="min-h-11 rounded-md border border-rp-line bg-rp-surface px-3 font-rp-mono text-rp-text focus-visible:outline-2 focus-visible:outline-rp-brand"
                value={answer}
                onChange={(event) => {
                  setAnswer(event.currentTarget.value);
                  setChecked(false);
                }}
              />
            </label>
            <div>
              <ActionButton primary type="submit">
                检查
              </ActionButton>
            </div>
            <p role="status" className="text-sm">
              {checked && (
                <>
                  <strong>
                    {correct ? "答对了。" : "再看看每次从哪里取值。"}
                  </strong>{" "}
                  结果是 <samp className="font-rp-mono">{expected}</samp>
                  。第一次 <code>sum(it)</code> 取尽剩下的{" "}
                  {remainingNumbers.join(" 和 ")}
                  。第二次遇到已经耗尽的迭代器，直接结束并得到 0。
                  <code>sum(numbers)</code> 从列表头重新取值。
                </>
              )}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
