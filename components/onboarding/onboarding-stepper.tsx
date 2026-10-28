"use client";

import {
  Building2,
  CalendarDays,
  Check,
  MessageSquare,
  Palette,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { onboardingSteps } from "@/lib/onboarding/constants";
import { cn } from "@/lib/utils";

const stepIcons: LucideIcon[] = [
  Building2,
  Palette,
  MessageSquare,
  CalendarDays,
];

type StepStatus = "done" | "current" | "pending";

const statusLabels: Record<StepStatus, string> = {
  done: "Concluída",
  current: "Em andamento",
  pending: "",
};

function StepStatusBadge({ status }: { status: StepStatus }) {
  if (status === "pending") {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs leading-[1.4] font-medium",
        status === "done"
          ? "border border-success bg-success-bg text-text"
          : "bg-primary text-on-primary",
      )}
    >
      {status === "done" && (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
      )}
      {statusLabels[status]}
    </span>
  );
}

export function OnboardingStepper({ reachedStep }: { reachedStep: number }) {
  const pathname = usePathname();
  const currentStep =
    onboardingSteps.find((step) => pathname.startsWith(step.href))?.number ?? 1;

  return (
    <nav aria-label="Etapas da configuração">
      <p className="m-0 mb-4 hidden text-xs font-medium text-muted lg:block">
        Primeiros passos · 4 etapas
      </p>
      <ol className="m-0 flex list-none items-start justify-between gap-2 p-0 lg:flex-col lg:gap-0">
        {onboardingSteps.map((step, index) => {
          const Icon = stepIcons[index];
          const status: StepStatus =
            step.number === currentStep
              ? "current"
              : step.number < Math.max(currentStep, reachedStep)
                ? "done"
                : "pending";
          const isNavigable =
            step.number <= reachedStep && status !== "current";
          const isLast = index === onboardingSteps.length - 1;

          const content = (
            <>
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-10 flex-none items-center justify-center rounded-full border",
                  status === "done" && "border-success bg-success text-white",
                  status === "current" &&
                    "border-primary bg-surface-2 text-primary",
                  status === "pending" && "border-muted bg-bg text-muted",
                )}
              >
                {status === "done" ? <Check size={18} /> : <Icon size={18} />}
              </span>
              <span className="hidden flex-col gap-1 sm:flex">
                <span className="text-xs text-muted">Etapa {step.number}</span>
                <span
                  className={cn(
                    "text-sm leading-tight",
                    status === "pending"
                      ? "text-muted"
                      : "font-medium text-text",
                  )}
                >
                  {step.label}
                </span>
                <StepStatusBadge status={status} />
              </span>
              <span className="sr-only sm:hidden">
                Etapa {step.number}: {step.label}. {statusLabels[status]}
              </span>
            </>
          );

          return (
            <li
              key={step.href}
              aria-current={status === "current" ? "step" : undefined}
              className="relative flex flex-1 lg:flex-none lg:pb-8 lg:last:pb-0"
            >
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-5 left-12 hidden h-px w-[calc(100%-3.5rem)] lg:top-11 lg:left-5 lg:block lg:h-[calc(100%-3rem)] lg:w-px",
                    "sm:block",
                    status === "done" ? "bg-success" : "bg-border",
                  )}
                />
              )}
              {isNavigable ? (
                <Link
                  href={step.href}
                  className="relative flex items-start gap-3 rounded-(--r-md) text-text no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  {content}
                </Link>
              ) : (
                <span className="relative flex items-start gap-3">
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
