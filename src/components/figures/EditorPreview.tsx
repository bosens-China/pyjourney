import type { ReactNode } from "react";

interface Mark {
  line: number;
  /** 这一行里要画波浪线的文字，取第一次出现的位置。 */
  text: string;
  source: string;
  message: string;
  severity: "error" | "warning";
}

interface EditorPreviewProps {
  label: string;
  file: string;
  code: string[];
  marks: Mark[];
  status: string[];
}

const tone = {
  error: {
    underline: "decoration-red-600 dark:decoration-red-400",
    text: "text-red-700 dark:text-red-300",
    icon: "✕",
  },
  warning: {
    underline: "decoration-amber-600 dark:decoration-amber-400",
    text: "text-amber-800 dark:text-amber-300",
    icon: "!",
  },
};

function renderLine(text: string, marks: Mark[]): ReactNode {
  const mark = marks[0];
  const start = mark ? text.indexOf(mark.text) : -1;
  if (!mark || start < 0) return text || " ";
  const end = start + mark.text.length;
  return (
    <>
      {text.slice(0, start)}
      <span
        className={`underline decoration-wavy underline-offset-4 ${tone[mark.severity].underline}`}
      >
        {text.slice(start, end)}
      </span>
      {renderLine(text.slice(end), marks.slice(1))}
    </>
  );
}

export default function EditorPreview({
  label,
  file,
  code,
  marks,
  status,
}: EditorPreviewProps) {
  return (
    <figure className="rp-not-doc my-6 grid gap-3">
      <div
        className="overflow-hidden rounded-xl border border-rp-line bg-rp-surface"
        role="img"
        aria-label={`${label}：${marks.map((m) => `第 ${m.line} 行 ${m.source} 提示 ${m.message}`).join("；")}`}
      >
        <div className="flex items-center gap-3 border-b border-rp-line bg-rp-soft px-3 py-2">
          <span aria-hidden="true" className="flex gap-1.5">
            {["bg-red-400", "bg-amber-400", "bg-green-400"].map((color) => (
              <span key={color} className={`size-2.5 rounded-full ${color}`} />
            ))}
          </span>
          <span className="rounded-md border border-rp-line bg-rp-surface px-2 py-0.5 font-rp-mono text-xs text-rp-text">
            {file}
          </span>
        </div>
        <pre className="overflow-x-auto px-0 py-3 font-rp-mono text-sm leading-6">
          {code.map((text, index) => {
            const line = index + 1;
            return (
              <div key={line} className="flex">
                <span className="w-10 shrink-0 pr-3 text-right text-rp-muted select-none">
                  {line}
                </span>
                <code className="pr-4 whitespace-pre text-rp-text">
                  {renderLine(
                    text,
                    marks.filter((mark) => mark.line === line),
                  )}
                </code>
              </div>
            );
          })}
        </pre>
        <div className="grid gap-1 border-t border-rp-line px-3 py-2 text-xs">
          <span className="font-semibold text-rp-muted">问题</span>
          {marks.map(({ line, source, message, severity }) => (
            <div
              key={`${line}:${source}`}
              className="flex flex-wrap items-baseline gap-x-2"
            >
              <span aria-hidden="true" className={tone[severity].text}>
                {tone[severity].icon}
              </span>
              <span className="text-rp-text">{message}</span>
              <span className="text-rp-muted">
                {source} · 第 {line} 行
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 bg-rp-brand px-3 py-1 font-rp-mono text-xs text-white">
          {status.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <figcaption className="text-center text-sm text-rp-muted">
        {label}
      </figcaption>
    </figure>
  );
}
