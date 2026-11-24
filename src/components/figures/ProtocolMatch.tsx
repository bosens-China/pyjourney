import { Card } from "@/components/ui/card";

export default function ProtocolMatch() {
  return (
    <Card asChild className="my-6 gap-3">
      <figure>
        <figcaption className="font-semibold">
          类型检查器对照方法签名
        </figcaption>
        <div className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr]">
          <div className="grid gap-1 rounded-lg border border-rp-line bg-rp-soft px-3 py-2 text-sm">
            <span className="text-rp-muted">
              <code className="font-rp-mono">Renderable</code> 要求
            </span>
            <code className="font-rp-mono">render(self) -&gt; str</code>
          </div>
          <div className="text-center text-sm text-rp-muted">
            符合协议{" "}
            <span aria-hidden="true" className="sm:hidden">
              ↓
            </span>
            <span aria-hidden="true" className="hidden sm:inline">
              →
            </span>
          </div>
          <div className="grid gap-1 rounded-lg border border-rp-line bg-rp-tint px-3 py-2 text-sm">
            <span className="text-rp-muted">
              <code className="font-rp-mono">MarkdownDoc</code> 提供
            </span>
            <code className="font-rp-mono">render(self) -&gt; str</code>
          </div>
        </div>
        <p className="text-sm text-rp-muted">
          <code className="font-rp-mono text-rp-text">
            display(MarkdownDoc())
          </code>{" "}
          通过静态类型检查。
        </p>
      </figure>
    </Card>
  );
}
