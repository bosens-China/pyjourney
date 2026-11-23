import CodeWorkspace from "./CodeWorkspace";

type Props = {
  starterCode: string;
  expectedOutput?: string;
  label?: string;
};

export default function PythonExercise({
  starterCode,
  expectedOutput,
  label = "随堂练习",
}: Props) {
  return (
    <CodeWorkspace
      starterCode={starterCode}
      label={label}
      cases={[{ label: "本次运行", setup: "", expectedOutput }]}
    />
  );
}
