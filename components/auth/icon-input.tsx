import type { LucideIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type IconInputProps = React.ComponentProps<typeof Input> & {
  icon: LucideIcon;
  trailing?: React.ReactNode;
};

export function IconInput({
  icon: Icon,
  trailing,
  className,
  ...props
}: IconInputProps) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3.5 z-1 flex -translate-y-1/2 text-muted"
      >
        <Icon size={18} />
      </span>
      <Input className={cn("pl-11", trailing && "pr-12", className)} {...props} />
      {trailing}
    </div>
  );
}
