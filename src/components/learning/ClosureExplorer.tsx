import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

const closures = [
  { name: "double", factor: 2 },
  { name: "triple", factor: 3 },
].map(({ name, factor }) => ({
  name,
  factor,
  call: (x: number) => x * factor,
}));

export default function ClosureExplorer() {
  const [argument, setArgument] = useState(4);
  const [called, setCalled] = useState<(typeof closures)[number] | null>(null);

  return (
    <Card asChild className="my-6">
      <section aria-label="闭包记住各自的 factor">
        <p className="text-sm text-rp-muted">
          选一个参数，先想想结果，再调用任意一个函数。看看它读的是哪个 factor。
        </p>
        <label className="flex flex-wrap items-center gap-2 text-sm font-medium">
          参数 <code>x</code>
          <NativeSelect
            className="font-rp-mono"
            value={argument}
            onChange={(event) => {
              setArgument(Number(event.currentTarget.value));
              setCalled(null);
            }}
          >
            {[4, -2, 0].map((value) => (
              <NativeSelectOption key={value} value={value}>
                {value}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
        <ul className="grid gap-2" aria-label="两个闭包各自记住的变量">
          {closures.map((closure) => {
            const active = called === closure;
            return (
              <li
                key={closure.name}
                className={`flex flex-wrap items-center gap-3 rounded-lg border p-2 font-rp-mono text-sm ${active ? "border-rp-brand bg-rp-tint" : "border-rp-line"}`}
              >
                <Button variant="outline" onClick={() => setCalled(closure)}>
                  {closure.name}({argument})
                </Button>
                <span aria-hidden="true">→</span>
                <code>factor = {closure.factor}</code>
              </li>
            );
          })}
        </ul>
        <p role="status" className="text-sm">
          {called && (
            <>
              <code>{called.name}</code> 读取自己的 <code>factor</code>：{" "}
              <samp className="font-rp-mono font-semibold">
                {argument} × {called.factor} = {called.call(argument)}
              </samp>
            </>
          )}
        </p>
      </section>
    </Card>
  );
}
