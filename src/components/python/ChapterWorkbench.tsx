import CodeWorkspace from "./CodeWorkspace";

type Props = {
  starterCode: string;
  cases: { label: string; setup: string; expectedOutput: string }[];
};

export default function ChapterWorkbench({ starterCode, cases }: Props) {
  return (
    <CodeWorkspace
      starterCode={starterCode}
      label="代码编辑器"
      cases={cases}
      chapter
    />
  );
}
