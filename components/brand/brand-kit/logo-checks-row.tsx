import { Check, CircleAlert, TriangleAlert } from "lucide-react";

import {
  logoCheckLabels,
  type LogoCheckId,
  type LogoCheckStatus,
} from "@/lib/onboarding/logo-analysis";
import { cn } from "@/lib/utils";

type CheckState = LogoCheckStatus | "pendente";

const stateLabels: Record<CheckState, string> = {
  ok: "aprovado",
  aviso: "precisa de atenção",
  erro: "com problema",
  pendente: "pendente",
};

function CheckIcon({ state }: { state: CheckState }) {
  const iconClassName = "flex size-6 items-center justify-center rounded-full";

  if (state === "ok") {
    return (
      <span className={cn(iconClassName, "bg-success text-white")}>
        <Check size={14} aria-hidden="true" />
      </span>
    );
  }

  if (state === "aviso" || state === "erro") {
    const Icon = state === "aviso" ? TriangleAlert : CircleAlert;

    return (
      <span
        className={cn(
          iconClassName,
          state === "aviso" ? "bg-warning text-white" : "bg-danger text-white",
        )}
      >
        <Icon size={14} aria-hidden="true" />
      </span>
    );
  }

  return <span className={cn(iconClassName, "border-2 border-muted")} />;
}

type LogoChecksRowProps = {
  checks: Partial<Record<LogoCheckId, LogoCheckStatus>>;
  isApproved: boolean;
};

export function LogoChecksRow({ checks, isApproved }: LogoChecksRowProps) {
  const items: { id: string; label: string; state: CheckState }[] = [
    ...(Object.keys(logoCheckLabels) as LogoCheckId[]).map((checkId) => ({
      id: checkId,
      label: logoCheckLabels[checkId],
      state: checks[checkId] ?? ("pendente" as const),
    })),
    {
      id: "aprovacao",
      label: "Aprovação",
      state: isApproved ? "ok" : "pendente",
    },
  ];

  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => (
        <li
          key={item.id}
          className={cn(
            "flex min-h-20 flex-col gap-2 rounded-(--r-md) border bg-bg p-3 text-sm text-text shadow-(--shadow-sm)",
            item.state === "aviso" && "border-warning bg-warning-bg",
            item.state === "erro" && "border-danger bg-danger-bg",
            (item.state === "ok" || item.state === "pendente") &&
              "border-border",
          )}
        >
          <CheckIcon state={item.state} />
          <span>
            {item.label}
            <span className="sr-only">: {stateLabels[item.state]}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
