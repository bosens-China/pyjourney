import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const counters = ["a", "b"] as const;

export default function ClosureExplorer() {
  const [counts, setCounts] = useState({ a: 0, b: 0 });
  const [called, setCalled] = useState<(typeof counters)[number]>();

  if (import.meta.env.SSG_MD) {
    return (
      <>
        {
          "\n\n从两个新计数器开始，依次调用 `a()`、`a()` 和 `b()`，返回 `1`、`2` 和 `1`。\n\n"
        }
      </>
    );
  }

  return (
    <Card asChild className="my-6">
      <section aria-label="两个闭包各自保存计数">
        <p className="text-sm text-rp-muted">
          先预测 <code>b()</code> 第一次会返回多少。点击 <code>a()</code>{" "}
          两次，再点一次 <code>b()</code>，观察两个计数。
        </p>
        <ul className="grid gap-2" aria-label="两个闭包的计数">
          {counters.map((name) => (
            <li
              key={name}
              className={`flex flex-wrap items-center gap-3 rounded-lg border p-2 font-rp-mono text-sm ${called === name ? "border-rp-brand bg-rp-tint" : "border-rp-line"}`}
            >
              <Button
                variant="outline"
                onClick={() => {
                  setCounts((previous) => ({
                    ...previous,
                    [name]: previous[name] + 1,
                  }));
                  setCalled(name);
                }}
              >
                {name}()
              </Button>
              <span aria-hidden="true">→</span>
              <code>count = {counts[name]}</code>
            </li>
          ))}
        </ul>
        <p role="status" className="text-sm empty:sr-only">
          {called && (
            <>
              <code>{called}()</code> 更新自己的 <code>count</code>，返回{" "}
              <samp className="font-rp-mono font-semibold">
                {counts[called]}
              </samp>
              。
            </>
          )}
        </p>
      </section>
    </Card>
  );
}
