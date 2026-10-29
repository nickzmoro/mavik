import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  onboardingSteps,
  type OnboardingStepNumber,
} from "@/lib/onboarding/constants";

type StepFrameProps = {
  step: OnboardingStepNumber;
  title: string;
  description: string;
  onBack?: () => void;
  footer: React.ReactNode;
  children: React.ReactNode;
};

export function StepFrame({
  step,
  title,
  description,
  onBack,
  footer,
  children,
}: StepFrameProps) {
  const { duration } = onboardingSteps[step - 1];

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-240 flex-1 flex-col gap-8 px-4 pt-6 pb-10 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            type="button"
            variant="ghost"
            disabled={!onBack}
            onClick={onBack}
            className="px-3 sm:px-4"
          >
            <ChevronLeft aria-hidden="true" className="size-4.5" />
            Voltar
          </Button>
          <Progress
            value={step * 25}
            aria-label="Progresso da configuração"
            className="flex-1"
          />
          <span className="text-sm whitespace-nowrap text-muted max-sm:sr-only">
            Etapa {step} de {onboardingSteps.length} · {duration}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="m-0 font-display text-[28px] leading-[1.2] font-bold text-balance sm:text-[32px]">
            {title}
          </h1>
          <p className="m-0 max-w-[62ch] text-base leading-relaxed text-muted">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-8">{children}</div>
      </div>

      <footer className="sticky bottom-0 z-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-app-canvas/90 via-app-canvas/50 to-transparent backdrop-blur-xl mask-[linear-gradient(to_top,black_45%,transparent)]"
        />
        <div className="relative mx-auto flex w-full max-w-240 flex-wrap items-center justify-end gap-3 px-4 pt-8 pb-4 sm:px-6">
          {footer}
        </div>
      </footer>
    </div>
  );
}
