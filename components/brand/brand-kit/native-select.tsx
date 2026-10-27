import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export function NativeSelect({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          "box-border block min-h-11 w-full cursor-pointer appearance-none rounded-(--r-md) border border-muted bg-bg pr-10 pl-3 font-sans text-base text-text hover:border-primary focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus aria-invalid:border-danger",
          className,
        )}
        {...props}
      />
      <ChevronDown
        size={18}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
