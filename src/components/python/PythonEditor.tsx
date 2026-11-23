import { python } from "@codemirror/lang-python";
import { basicSetup, EditorView } from "codemirror";
import { useEffect, useRef, useState } from "react";

type Props = {
  code: string;
  onChange: (code: string) => void;
};

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
    <div className="pj-python__editor">
      {!mounted && <pre>{code}</pre>}
      <div ref={host} />
    </div>
  );
}
