import {
  Building2,
  CalendarDays,
  Check,
  MessageCircle,
  Palette,
  type LucideIcon,
} from "lucide-react";

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

type OnboardingStepperProps = {
  currentStep: OnboardingStepNumber;
};

export function OnboardingStepper({ currentStep }: OnboardingStepperProps) {
  return (
    <nav
      aria-label="Etapas da configuração"
      className="glass shrink-0 rounded-none border-x-0 border-t-0 px-4 py-3 sm:px-6 sm:py-4"
    >
      <ol className="m-0 mx-auto flex max-w-240 list-none items-center p-0">
        {onboardingSteps.map(({ number, label }, index) => {
          const isDone = number < currentStep;
          const isCurrent = number === currentStep;
          const isLast = index === onboardingSteps.length - 1;
          const StepIcon = stepIcons[number];

          return (
            <li
              key={number}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex min-w-0 items-center gap-3",
                isLast ? "flex-none" : "flex-1",
              )}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] bg-bg",
                  isDone && "border-success bg-success text-on-primary",
                  isCurrent && "border-primary bg-surface-2 text-primary",
                  !isDone && !isCurrent && "border-muted text-muted",
                )}
              >
                {isDone ? (
                  <Check aria-hidden="true" className="size-4.5" />
                ) : (
                  <StepIcon aria-hidden="true" className="size-4.5" />
                )}
              </span>
              <span
                className={cn(
                  "min-w-0 flex-col items-start gap-1",
                  isCurrent ? "flex" : "hidden lg:flex",
                )}
              >
                <span className="text-xs leading-[1.4] font-medium text-muted">
                  Etapa {number}
                </span>
                <span
                  className={cn(
                    "text-[15px] leading-[1.3]",
                    isDone || isCurrent
                      ? "font-medium text-text"
                      : "text-muted",
                  )}
                >
                  {label}
                </span>
                {isDone ? <Badge variant="success">Concluída</Badge> : null}
                {isCurrent ? <Badge>Em andamento</Badge> : null}
              </span>
              {isLast ? null : (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mx-1 h-0.5 min-w-4 flex-1 rounded-full sm:mx-2",
                    isDone ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
