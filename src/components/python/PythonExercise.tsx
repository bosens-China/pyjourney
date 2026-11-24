import type { PythonCheck } from "@/lib/python/protocol";
import CodeWorkspace from "./CodeWorkspace";

type Props = {
  starterCode: string;
  solution?: string;
  expectedOutput?: string;
  checks?: PythonCheck[];
  label?: string;
};

export default function PythonExercise({
  starterCode,
  solution,
  expectedOutput,
  checks,
  label = "随堂练习",
}: Props) {
  return (
    <CodeWorkspace
      starterCode={starterCode}
      solution={solution}
      label={label}
      cases={[{ label: "本次运行", setup: "", expectedOutput }]}
      checks={checks}
    />
  );
}
