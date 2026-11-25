import { Card } from "@/components/ui/card";
export default function FloorNumberLine() {
  if (import.meta.env.SSG_MD) {
    return (
      <>{"\n\n数轴上 `-4 ≤ -3.5 < -3`，朝负无穷方向取整得到 `-4`。\n\n"}</>
    );
  }

  return (
    <Card asChild className="my-6 gap-0 text-center sm:p-4">
      <figure>
        <svg
          aria-hidden="true"
          className="mx-auto block h-auto w-full max-w-88 font-rp-mono text-base"
          viewBox="0 0 320 98"
        >
          <path
            d="M24 58H296 M56 51V65 M160 51V65 M264 51V65"
            className="fill-none stroke-rp-muted"
            strokeWidth="1.5"
          />
          <path
            d="M160 36H56 M64 30L56 36L64 42"
            className="fill-none stroke-rp-brand"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="108" y="21" textAnchor="middle" className="fill-rp-text">
            向下取整
          </text>
          <circle cx="56" cy="58" r="4" className="fill-rp-brand" />
          <circle cx="160" cy="58" r="4" className="fill-rp-text" />
          <g textAnchor="middle" className="fill-rp-text">
            <text x="56" y="83">
              −4
            </text>
            <text x="160" y="83">
              −3.5
            </text>
            <text x="264" y="83">
              −3
            </text>
          </g>
        </svg>
        <figcaption className="text-sm text-rp-text">
          从 <code>-3.5</code> 朝负无穷方向找最近的整数，得到 <code>-4</code>。
        </figcaption>
      </figure>
    </Card>
  );
}
