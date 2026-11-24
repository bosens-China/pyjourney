import { useState, type ComponentProps, type ReactNode } from "react";
import ActionButton from "@/components/ui/ActionButton";
import ConceptStepper from "@/components/learning/ConceptStepper";

type Steps = ComponentProps<typeof ConceptStepper>["steps"];

export default function ContextlibTimeline({
  normal,
  exception,
  exceptionCheck,
}: {
  normal: Steps;
  exception: Steps;
  exceptionCheck: ReactNode;
}) {
  const [path, setPath] = useState<"normal" | "exception">("normal");

  return (
    <div className="rp-not-doc">
      <div
        role="group"
        aria-label="离开代码块的情形"
        className="flex flex-wrap gap-2"
      >
        <ActionButton
          primary={path === "normal"}
          aria-pressed={path === "normal"}
          onClick={() => setPath("normal")}
        >
          正常离开
        </ActionButton>
        <ActionButton
          primary={path === "exception"}
          aria-pressed={path === "exception"}
          onClick={() => setPath("exception")}
        >
          遇到异常
        </ActionButton>
      </div>
      <ConceptStepper
        key={path}
        label="override 的执行顺序"
        steps={path === "normal" ? normal : exception}
      />
      {path === "exception" && exceptionCheck}
    </div>
  );
}
