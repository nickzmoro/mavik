import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

export function BrandAssuranceNote({
  className,
  children,
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "m-0 flex items-start gap-2 text-[13px] leading-normal text-muted",
        className,
      )}
    >
      <ShieldCheck
        aria-hidden="true"
        className="mt-px size-4 shrink-0 text-success"
      />
      <span>{children}</span>
    </p>
  );
}
