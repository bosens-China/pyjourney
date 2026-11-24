interface Entry {
  name: string;
  depth: number;
  note: string;
  /** 例如「提交」「不提交」「自动生成」。 */
  tag?: string;
  /** 需要读者留意的标签用醒目的颜色。 */
  warn?: boolean;
  /** 由工具生成、不必手写的条目显示为淡色。 */
  generated?: boolean;
}

interface FileTreeProps {
  label: string;
  entries: Entry[];
}

export default function FileTree({ label, entries }: FileTreeProps) {
  return (
    <figure className="rp-not-doc my-6 grid gap-3 rounded-xl border border-rp-line bg-rp-surface p-4 sm:p-6">
      <figcaption className="font-semibold text-rp-text">{label}</figcaption>
      <ul className="grid divide-y divide-rp-line overflow-hidden rounded-lg border border-rp-line">
        {entries.map(({ name, depth, note, tag, warn, generated }) => (
          <li
            key={`${depth}:${name}`}
            className="grid gap-1 bg-rp-soft px-3 py-2 sm:grid-cols-[14rem_1fr] sm:items-baseline sm:gap-4"
          >
            <span
              className={`font-rp-mono text-sm ${generated ? "text-rp-muted" : "text-rp-text"}`}
              style={{ paddingInlineStart: `${depth * 1.25}rem` }}
            >
              {depth > 0 && (
                <span aria-hidden="true" className="text-rp-muted">
                  └{" "}
                </span>
              )}
              {name}
            </span>
            <span className="flex flex-wrap items-baseline gap-2 text-sm text-rp-muted">
              {tag && (
                <span
                  className={`rounded px-1.5 py-0.5 text-xs whitespace-nowrap ${
                    warn
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-rp-tint text-rp-text"
                  }`}
                >
                  {tag}
                </span>
              )}
              {note}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
