import { pythonLanguage } from "@codemirror/lang-python";
import { classHighlighter, highlightTree } from "@lezer/highlight";

function isLazyImport(code: string, from: number, to: number) {
  return (
    code.slice(from, to) === "lazy" &&
    /^(?:[ \t\f]|\\\r?\n)+(?:from|import)\b/.test(code.slice(to))
  );
}

export function highlightPython(
  code: string,
  visit: (from: number, to: number, className: string) => void,
) {
  highlightTree(
    pythonLanguage.parser.parse(code),
    classHighlighter,
    (from, to, className) => {
      visit(
        from,
        to,
        className === "tok-variableName" && isLazyImport(code, from, to)
          ? "tok-keyword"
          : className,
      );
    },
  );
}

export function lazyImportOffsets(code: string) {
  const offsets = new Set<number>();
  if (!code.includes("lazy")) return offsets;

  // The bundled parser reads the new soft keyword as a variable name.
  highlightPython(code, (from, to, className) => {
    if (className === "tok-keyword" && code.slice(from, to) === "lazy") {
      offsets.add(from);
    }
  });
  return offsets;
}
