import {
  Building2,
  CalendarDays,
  Check,
  MessageCircle,
  Palette,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  onboardingSteps,
  type OnboardingStepNumber,
} from "@/lib/onboarding/constants";
import { cn } from "@/lib/utils";

const stepIcons: Record<OnboardingStepNumber, LucideIcon> = {
  1: Building2,
  2: Palette,
  3: MessageCircle,
  4: CalendarDays,
};

type StepStatus = "done" | "current" | "pending";

const statusLabels: Record<StepStatus, string> = {
  done: "Concluída",
  current: "Em andamento",
  pending: "",
};

type OnboardingStepperProps = {
  currentStep: OnboardingStepNumber;
  reachedStep: OnboardingStepNumber;
};

export function OnboardingStepper({
  currentStep,
  reachedStep,
}: OnboardingStepperProps) {
  return (
    <nav aria-label="Etapas da configuração">
      <p className="m-0 mb-4 hidden text-xs font-medium text-muted lg:block">
        Primeiros passos · {onboardingSteps.length} etapas
      </p>
      <ol className="m-0 flex list-none items-start justify-between gap-2 p-0 lg:flex-col lg:gap-0">
        {onboardingSteps.map(({ number, label, href }, index) => {
          const StepIcon = stepIcons[number];
          const status: StepStatus =
            number === currentStep
              ? "current"
              : number < Math.max(currentStep, reachedStep)
                ? "done"
                : "pending";
          const isNavigable = number <= reachedStep && status !== "current";
          const isLast = index === onboardingSteps.length - 1;

          const content = (
            <>
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-10 flex-none items-center justify-center rounded-full border-[1.5px] bg-bg",
                  status === "done" &&
                    "border-success bg-success text-on-primary",
                  status === "current" &&
                    "border-primary bg-surface-2 text-primary",
                  status === "pending" && "border-muted text-muted",
                )}
              >
                {status === "done" ? (
                  <Check className="size-4.5" />
                ) : (
                  <StepIcon className="size-4.5" />
                )}
              </span>
              <span className="hidden flex-col items-start gap-1 sm:flex">
                <span className="text-xs leading-[1.4] font-medium text-muted">
                  Etapa {number}
                </span>
                <span
                  className={cn(
                    "text-[15px] leading-tight",
                    status === "pending"
                      ? "text-muted"
                      : "font-medium text-text",
                  )}
                >
                  {label}
                </span>
                {status === "done" ? (
                  <Badge variant="success">{statusLabels.done}</Badge>
                ) : null}
                {status === "current" ? (
                  <Badge>{statusLabels.current}</Badge>
                ) : null}
              </span>
              <span className="sr-only sm:hidden">
                Etapa {number}: {label}. {statusLabels[status]}
              </span>
            </>
          );

          return (
            <li
              key={number}
              aria-current={status === "current" ? "step" : undefined}
              className="relative flex flex-1 lg:flex-none lg:pb-8 lg:last:pb-0"
            >
              {isLast ? null : (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-5 left-12 hidden h-0.5 w-[calc(100%-3.5rem)] sm:block lg:top-11 lg:left-5 lg:h-[calc(100%-3rem)] lg:w-0.5",
                    status === "done" ? "bg-success" : "bg-border",
                  )}
                />
              )}
              {isNavigable ? (
                <Link
                  href={href}
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
