import { Check, Minus, TriangleAlert, X, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type ValidationStatus = "ok" | "aviso" | "erro" | "pendente";

export type ValidationCheck = {
  label: string;
  status: ValidationStatus;
};

const statusStyles: Record<
  ValidationStatus,
  { icon: LucideIcon; iconClassName: string; srLabel: string }
> = {
  ok: { icon: Check, iconClassName: "bg-success text-on-primary", srLabel: "ok" },
  aviso: {
    icon: TriangleAlert,
    iconClassName: "bg-warning text-on-primary",
    srLabel: "atenção",
  },
  erro: { icon: X, iconClassName: "bg-danger text-bg", srLabel: "erro" },
  pendente: {
    icon: Minus,
    iconClassName: "bg-surface-2 text-muted",
    srLabel: "pendente",
  },
};

type ValidationChecklistProps = {
  checks: ValidationCheck[];
};

export function ValidationChecklist({ checks }: ValidationChecklistProps) {
  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
      {checks.map(({ label, status }) => {
        const { icon: StatusIcon, iconClassName, srLabel } =
          statusStyles[status];

        return (
          <li
            key={label}
            className={cn(
              "tile flex min-h-12 items-center gap-2.5 rounded-(--r-md) px-3 py-2 text-sm",
              status === "aviso" && "border-warning bg-warning-bg",
              status === "erro" && "border-danger bg-danger-bg",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full",
                iconClassName,
              )}
            >
              <StatusIcon className="size-3" strokeWidth={3} />
            </span>
            {label}
            <span className="sr-only">: {srLabel}</span>
          </li>
        );
      })}
    </ul>
  );
}
