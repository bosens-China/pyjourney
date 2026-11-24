import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";

const examples = [
  {
    label: "分配四项",
    code: "head, *middle, tail = [1, 2, 3, 4]",
    items: [1, 2, 3, 4],
    targets: ["head", "*middle", "tail"],
    correct: ["head", "*middle", "*middle", "tail"],
    hints: [
      "head 在星号前，接走第一项 1。",
      "第二项和第三项都在中间，由 *middle 接住。",
      "第二项和第三项都在中间，由 *middle 接住。",
      "tail 在星号后，接走最后一项 4。",
    ],
    success: "对了。head = 1，middle = [2, 3]，tail = 4。",
  },
  {
    label: "只分配一项",
    code: "head, *rest = [1]",
    items: [1],
    targets: ["head", "*rest"],
    correct: ["head"],
    hints: ["head 在星号前，接走第一项 1。"],
    success:
      "对了。head = 1。星号接住剩余项，零项也会得到一个列表，所以 rest = []。",
  },
];

const selectClass =
  "min-h-11 w-full rounded-md border border-rp-line bg-rp-surface px-3 text-rp-text focus-visible:outline-2 focus-visible:outline-rp-brand";

function Assignment({ example }: { example: (typeof examples)[number] }) {
  const [assignments, setAssignments] = useState<string[]>([]);
  const [rest, setRest] = useState("");
  const [feedback, setFeedback] = useState("");
  const singleItem = example.items.length === 1;

  function check() {
    const wrong = example.correct.findIndex(
      (target, index) => assignments[index] !== target,
    );
    if (wrong !== -1) {
      setFeedback(example.hints[wrong]);
    } else if (singleItem && rest !== "[]") {
      setFeedback("一项也没有剩下。想一想星号目标用什么类型装剩余项。");
    } else {
      setFeedback(example.success);
    }
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        check();
      }}
    >
      <code className="block rounded-md bg-rp-soft p-3 font-rp-mono text-sm wrap-break-word">
        {example.code}
      </code>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {example.items.map((item, index) => (
          <label key={item} className="grid min-w-0 gap-1 text-sm">
            <span>
              数值 <code>{item}</code> 给谁？
            </span>
            <select
              className={selectClass}
              required
              value={assignments[index] ?? ""}
              onChange={(event) => {
                const target = event.currentTarget.value;
                setAssignments((previous) => {
                  const next = [...previous];
                  next[index] = target;
                  return next;
                });
                setFeedback("");
              }}
            >
              <option value="">请选择</option>
              {example.targets.map((target) => (
                <option key={target}>{target}</option>
              ))}
            </select>
          </label>
        ))}
        {singleItem && (
          <label className="grid min-w-0 gap-1 text-sm">
            <span>
              <code>rest</code> 的结果
            </span>
            <select
              className={selectClass}
              required
              value={rest}
              onChange={(event) => {
                setRest(event.currentTarget.value);
                setFeedback("");
              }}
            >
              <option value="">请选择</option>
              <option>[]</option>
              <option>None</option>
              <option>引发 ValueError</option>
            </select>
          </label>
        )}
      </div>
      {!singleItem && (
        <div>
          <p className="mb-1 text-sm text-rp-muted">我的分配</p>
          <dl className="grid grid-cols-3 gap-2 text-center font-rp-mono text-sm">
            {example.targets.map((target) => {
              const items = example.items.filter(
                (_, index) => assignments[index] === target,
              );
              const value = target.startsWith("*")
                ? `[${items.join(", ")}]`
                : items.join(", ") || "—";
              return (
                <div key={target} className="rounded-md bg-rp-soft p-2">
                  <dt>{target}</dt>
                  <dd>{value}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <ActionButton type="submit" primary>
          检查分配
        </ActionButton>
        <p className="text-sm" role="status">
          {feedback}
        </p>
      </div>
    </form>
  );
}

export default function UnpackingGroups() {
  const [active, setActive] = useState(0);

  return (
    <section
      aria-label="星号解包练习"
      className="rp-not-doc my-6 grid gap-4 rounded-xl border border-rp-line bg-rp-surface p-4 text-rp-text"
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="选择练习">
        {examples.map(({ label }, index) => (
          <ActionButton
            key={label}
            primary={active === index}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            {label}
          </ActionButton>
        ))}
      </div>
      <Assignment key={active} example={examples[active]} />
    </section>
  );
}
