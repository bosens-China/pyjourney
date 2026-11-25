import { useState, type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import ConceptStepper from "@/components/learning/ConceptStepper";

type Steps = ComponentProps<typeof ConceptStepper>["steps"];

export default function ContextExitTimeline({
  label,
  normal,
  exception,
}: {
  label: string;
  normal: Steps;
  exception: Steps;
}) {
  const [path, setPath] = useState<"normal" | "exception">("normal");

  if (import.meta.env.SSG_MD) {
    return (
      <>
        {`\n\n**${label}**\n\n`}
        <ConceptStepper label="正常离开" steps={normal} />
        <ConceptStepper label="遇到异常" steps={exception} />
      </>
    );
  }

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
        label={label}
        steps={path === "normal" ? normal : exception}
      />
    </div>
  );
}
