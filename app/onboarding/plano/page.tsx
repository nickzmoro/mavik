import { redirect } from "next/navigation";
import { Suspense } from "react";

import { OnboardingStepIntro } from "@/components/onboarding/onboarding-step-intro";
import { OnboardingStepSkeleton } from "@/components/onboarding/onboarding-step-skeleton";
import { SideNote } from "@/components/onboarding/side-note";
import { getPlanStepData } from "@/lib/onboarding/get-step-data";
import { getCurrentUserId } from "@/lib/onboarding/store-access";
import { routes } from "@/lib/routes";

import { AnalysisSourcesCard } from "./components/analysis-sources-card";
import { DiagnosisCard } from "./components/diagnosis-card";
import { InsightColumns } from "./components/insight-columns";
import { PlanReview } from "./components/plan-review";

async function PlanStep() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect(routes.login);
  }

  const planStepData = await getPlanStepData(userId);

  if (!planStepData) {
    redirect(routes.onboardingVoice);
  }

  const { diagnosis, sources, planStartDate, planItems, isPlanApproved } =
    planStepData;
  const shareSummary = [
    `Maturidade de marketing: ${diagnosis.score} de 100.`,
    `Consistência ${diagnosis.consistencyScore}, conteúdo ${diagnosis.contentScore}, oferta ${diagnosis.offerScore}.`,
    diagnosis.attentionPoints.length > 0 &&
      `Pontos de atenção: ${diagnosis.attentionPoints.join(", ")}.`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex min-w-0 flex-col gap-6">
        <DiagnosisCard {...diagnosis} />
        <InsightColumns {...diagnosis} />
        <PlanReview
          startDate={planStartDate}
          initialItems={planItems}
          isInitiallyApproved={isPlanApproved}
        />
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
        <AnalysisSourcesCard sources={sources} shareSummary={shareSummary} />
        <SideNote title="Diagnóstico concluído" variant="success">
          <p>Você revisa e aprova cada arte antes de qualquer publicação.</p>
        </SideNote>
        <SideNote title="Nunca inventamos dados">
          <p>Sem acesso a uma fonte, o diagnóstico usa só as suas respostas.</p>
        </SideNote>
      </aside>
    </div>
  );
}

export default function OnboardingPlanPage() {
  return (
    <>
      <OnboardingStepIntro
        step={4}
        title="Diagnóstico da sua marca"
        description="Um diagnóstico claro e um calendário de 30 dias pronto para aprovar."
      />
      <Suspense fallback={<OnboardingStepSkeleton />}>
        <PlanStep />
      </Suspense>
    </>
  );
}
