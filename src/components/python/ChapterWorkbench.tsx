import type { PythonCheck } from "@/lib/python/protocol";
import CodeWorkspace from "./CodeWorkspace";

type Props = {
  starterCode: string;
  solution: string;
  cases: { label: string; setup: string; expectedOutput: string }[];
  checks: PythonCheck[];
};

export default function ChapterWorkbench({
  starterCode,
  solution,
  cases,
  checks,
}: Props) {
  return (
    <CodeWorkspace
      starterCode={starterCode}
      solution={solution}
      label="代码编辑器"
      cases={cases}
      checks={checks}
      chapter
    />
  );
}
