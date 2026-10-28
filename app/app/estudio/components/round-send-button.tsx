import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

type RoundSendButtonProps = Omit<React.ComponentProps<"button">, "aria-label"> & {
  label: string;
};

export function RoundSendButton({
  label,
  className,
  type = "submit",
  ...props
}: RoundSendButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-primary p-0 text-on-primary shadow-[0_6px_16px_rgba(89,38,200,.28)] transition-[background-color,opacity] duration-150 not-disabled:hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <ArrowUp aria-hidden="true" className="size-4.5" />
    </button>
  );
}
