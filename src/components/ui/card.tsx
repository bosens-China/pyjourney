import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Card({
  className,
  asChild = false,
  ...props
}: ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      data-slot="card"
      className={cn(
        "rp-not-doc flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm sm:p-6",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
