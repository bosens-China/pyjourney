import type { ComponentProps } from "react";

type Props = ComponentProps<"button"> & { primary?: boolean };

export default function ActionButton({
  primary = false,
  type = "button",
  className = "",
  ...props
}: Props) {
  const appearance = primary
    ? "border-transparent bg-rp-tint"
    : "border-rp-line bg-rp-surface";

  return (
    <button
      {...props}
      type={type}
      className={`min-h-10 cursor-pointer rounded-lg border px-3.5 py-1.5 text-sm font-semibold text-rp-text enabled:hover:border-rp-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rp-brand disabled:cursor-not-allowed disabled:opacity-60 ${appearance} ${className}`}
    />
  );
}
