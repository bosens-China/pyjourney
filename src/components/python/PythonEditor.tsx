import { python } from "@codemirror/lang-python";
import { syntaxHighlighting } from "@codemirror/language";
import { Decoration, EditorView } from "@codemirror/view";
import { classHighlighter } from "@lezer/highlight";
import { basicSetup } from "codemirror";
import { useEffect, useRef, useState } from "react";
import { lazyImportOffsets } from "@/lib/python/highlight";
import PythonCode from "./PythonCode";

type Props = {
  code: string;
  onChange: (code: string) => void;
};

const editorUtilities = [
  "python-code",
  "[&_.cm-editor]:min-h-30 [&_.cm-editor]:text-rp-text!",
  "[&_.cm-scroller]:max-h-96 [&_.cm-scroller]:py-2 [&_.cm-scroller]:font-rp-mono! [&_.cm-scroller]:text-sm/relaxed!",
  "[&_.cm-gutters]:border-rp-line! [&_.cm-gutters]:bg-rp-surface! [&_.cm-gutters]:text-rp-muted!",
  "[&_.cm-activeLine]:bg-rp-tint! [&_.cm-activeLineGutter]:bg-rp-tint! [&_.cm-cursor]:border-rp-brand!",
].join(" ");

const lazyKeyword = Decoration.mark({ class: "tok-keyword" });
const lazyImportHighlighting = EditorView.decorations.compute(
  ["doc"],
  ({ doc }) =>
    Decoration.set(
      Array.from(lazyImportOffsets(doc.toString()), (offset) =>
        lazyKeyword.range(offset, offset + 4),
      ),
    ),
);

export default function PythonEditor({ code, onChange }: Props) {
  const initialCode = useRef(code);
  const host = useRef<HTMLDivElement>(null);
  const editor = useRef<EditorView>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!host.current) return;
    const view = new EditorView({
      doc: initialCode.current,
      parent: host.current,
      extensions: [
        basicSetup,
        python(),
        syntaxHighlighting(classHighlighter),
        lazyImportHighlighting,
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({
          "aria-label": "Python 代码",
          autocapitalize: "off",
          spellcheck: "false",
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) onChange(update.state.doc.toString());
        }),
      ],
    });
    editor.current = view;
    setMounted(true);
    return () => {
      view.destroy();
      editor.current = null;
    };
  }, [onChange]);

  useEffect(() => {
    const view = editor.current;
    if (view && view.state.doc.toString() !== code) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: code },
      });
    }
  }, [code]);

  return (
    <div className="grid min-w-0 bg-rp-soft [&:has(.cm-editor)>pre]:hidden">
      {!mounted && (
        <pre className="min-h-30 px-4 py-3 font-rp-mono text-sm/relaxed wrap-anywhere whitespace-pre-wrap">
          <PythonCode code={code} />
        </pre>
      )}
      <div className={`min-w-0 ${editorUtilities}`} ref={host} />
    </div>
  );
}
