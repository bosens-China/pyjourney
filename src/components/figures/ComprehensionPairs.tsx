import { Card } from "@/components/ui/card";

const attempts = [
  { y: 3, result: "(1, 3)" },
  { y: 1, result: null },
  { y: 4, result: "(1, 4)" },
];

export default function ComprehensionPairs() {
  if (import.meta.env.SSG_MD) {
    const rows = attempts.map(({ y, result }) =>
      result ? `| ${y} | 加入 \`${result}\` |` : `| ${y} | 跳过 |`,
    );
    return (
      <>
        {`\n\n外层第一轮时，\`x = 1\`。\n\n| 内层的 \`y\` | 是否加入结果 |\n| --- | --- |\n${rows.join("\n")}\n\n`}
      </>
    );
  }

  return (
    <Card asChild className="my-6 gap-3">
      <figure>
        <figcaption className="font-semibold">
          外层循环的第一轮，<code className="font-rp-mono">x = 1</code>
        </figcaption>
        <ol role="list" className="m-0 grid list-none gap-2 p-0 sm:grid-cols-3">
          {attempts.map(({ y, result }) => (
            <li
              key={y}
              className="grid gap-1 rounded-lg border border-rp-line bg-rp-soft px-3 py-2 text-sm"
            >
              <code className="font-rp-mono">y = {y}</code>
              <span className="text-rp-muted">
                <code className="font-rp-mono">1 != {y}</code>
                <span aria-hidden="true"> → </span>
                {result ? "为真" : "为假"}
              </span>
              {result ? (
                <span className="font-medium">
                  加入 <code className="font-rp-mono">{result}</code>
                </span>
              ) : (
                <span className="text-rp-muted">跳过</span>
              )}
            </li>
          ))}
        </ol>
        <p className="text-sm text-rp-muted">
          本轮结束时，列表里有{" "}
          <code className="font-rp-mono text-rp-text">[(1, 3), (1, 4)]</code>。
        </p>
      </figure>
    </Card>
  );
}
