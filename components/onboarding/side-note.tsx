import { CircleCheck, Info, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

const noteVariants = {
  card: { className: "border-border bg-bg shadow-(--shadow-md)", icon: null },
  info: { className: "border-border bg-surface", icon: Info },
  warning: { className: "border-warning bg-warning-bg", icon: TriangleAlert },
  success: { className: "border-success bg-success-bg", icon: CircleCheck },
};

type SideNoteProps = {
  title: string;
  variant?: keyof typeof noteVariants;
  children: React.ReactNode;
  className?: string;
};

export function SideNote({
  title,
  variant = "info",
  children,
  className,
}: SideNoteProps) {
  const { className: variantClassName, icon: Icon } = noteVariants[variant];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-(--r-lg) border p-5",
        variantClassName,
        className,
      )}
    >
      {Icon && (
        <span
          aria-hidden="true"
          className={cn(
            "flex flex-none pt-0.5",
            variant === "warning" && "text-warning",
            variant === "success" && "text-success",
            variant === "info" && "text-primary",
          )}
        >
          <Icon size={18} />
        </span>
      )}
      <div className="flex flex-col gap-1 text-sm leading-normal">
        <p
          className={cn(
            "m-0 font-semibold text-text",
            variant === "card" && "font-display text-lg",
          )}
        >
          {title}
        </p>
        <div className="text-muted [&_p]:m-0 [&_strong]:text-text">
          {children}
        </div>
      </div>
    </div>
  );
}
