import { useState, type ComponentProps, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
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
        <Button
          variant={path === "normal" ? "default" : "outline"}
          aria-pressed={path === "normal"}
          onClick={() => setPath("normal")}
        >
          正常离开
        </Button>
        <Button
          variant={path === "exception" ? "default" : "outline"}
          aria-pressed={path === "exception"}
          onClick={() => setPath("exception")}
        >
          遇到异常
        </Button>
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
