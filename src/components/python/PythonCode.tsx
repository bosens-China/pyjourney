import type { ReactNode } from "react";
import { highlightPython } from "@/lib/python/highlight";

export function PythonTokens({ code }: { code: string }) {
  const parts: ReactNode[] = [];
  let previous = 0;

  highlightPython(code, (from, to, tokenClass) => {
    if (from > previous) parts.push(code.slice(previous, from));
    parts.push(
      <span className={tokenClass} key={from}>
        {code.slice(from, to)}
      </span>,
    );
    previous = to;
  });
  if (previous < code.length) parts.push(code.slice(previous));

  return <>{parts}</>;
}

export default function PythonCode({
  code,
  className = "",
}: {
  code: string;
  className?: string;
}) {
  return (
    <code className={`python-code ${className}`}>
      <PythonTokens code={code} />
    </code>
  );
}
