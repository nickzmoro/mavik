import { Palette } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getOnboardingStatus } from "@/lib/onboarding/get-onboarding-status";
import { getOnboardingStepRoute } from "@/lib/routes";

export async function OnboardingBanner() {
  const status = await getOnboardingStatus();

  if (!status || status.isCompleted) {
    return null;
  }

  return (
    <section
      aria-labelledby="onboarding-banner-title"
      className="brand-glass flex flex-wrap items-center gap-4 rounded-3xl p-4 sm:px-5"
    >
      <span
        aria-hidden="true"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-2 text-primary"
      >
        <Palette className="size-5" />
      </span>
      <div className="flex min-w-0 flex-1 basis-64 flex-col gap-0.5">
        <h2
          id="onboarding-banner-title"
          className="m-0 font-display text-base leading-[1.4] font-semibold"
        >
          Você ainda não completou o Brand Kit da sua empresa
        </h2>
        <p className="m-0 text-sm leading-normal text-muted">
          Termine a configuração para o Estúdio criar artes com a identidade
          visual da sua marca.
        </p>
      </div>
      <Button asChild>
        <Link href={getOnboardingStepRoute(status.currentStep)}>
          Continuar configuração
        </Link>
      </Button>
    </section>
  );
}
