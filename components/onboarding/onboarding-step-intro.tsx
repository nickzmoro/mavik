import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import {
  onboardingSteps,
  type OnboardingStepNumber,
} from "@/lib/onboarding/constants";

type OnboardingStepIntroProps = {
  step: OnboardingStepNumber;
  title: string;
  description: string;
};

export function OnboardingStepIntro({
  step,
  title,
  description,
}: OnboardingStepIntroProps) {
  const currentStep = onboardingSteps[step - 1];
  const previousStep = onboardingSteps[step - 2];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {previousStep ? (
          <Link
            href={previousStep.href}
            className="flex min-h-11 items-center gap-1 rounded-(--r-sm) text-sm font-medium text-text no-underline hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            Voltar
          </Link>
        ) : (
          <span className="flex min-h-11 items-center gap-1 text-sm text-muted opacity-50">
            <ChevronLeft size={16} aria-hidden="true" />
            Voltar
          </span>
        )}
        <div
          role="progressbar"
          aria-label="Progresso da configuração"
          aria-valuemin={0}
          aria-valuemax={onboardingSteps.length}
          aria-valuenow={step}
          className="h-1.5 min-w-32 flex-1 overflow-hidden rounded-full bg-surface-2"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-250 motion-reduce:transition-none"
            style={{ width: `${(step / onboardingSteps.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-muted">
          Etapa {step} de {onboardingSteps.length} · {currentStep.duration}
        </span>
      </div>

      <div>
        <h1 className="m-0 font-display text-[28px] leading-[1.2] font-bold text-text sm:text-[32px]">
          {title}
        </h1>
        <p className="m-0 mt-2 max-w-[60ch] text-base leading-[1.6] text-muted">
          {description}
        </p>
      </div>
    </div>
  );
}
