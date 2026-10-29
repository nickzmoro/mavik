"use client";

import { Check, CircleMinus } from "lucide-react";
import { useState } from "react";

import { MonthDistributionCard } from "@/app/app/agenda/components/month-distribution-card";
import { Button } from "@/components/ui/button";
import { useSaveOnboardingPlan } from "@/hooks/mutations/use-save-onboarding-plan";
import { connectionFailure } from "@/lib/auth-action-result";
import type { OnboardingData } from "@/lib/onboarding/get-onboarding-data";
import type { PlanItem } from "@/lib/onboarding/thirty-day-plan";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";

import { toPlanAgendaItems } from "../utils/plan-agenda-items";
import { ApproveOnboardingPlanDialog } from "./approve-onboarding-plan-dialog";
import { DiagnosisInsights } from "./diagnosis-insights";
import { DiagnosisScoreCard } from "./diagnosis-score-card";
import { FormSection, SectionHint } from "./form-section";
import { PlanItemSheet } from "./plan-item-sheet";
import { PlanMonthView } from "./plan-month-view";
import { StepFrame } from "./step-frame";

const sourceLabels: Record<string, string> = {
  respostas: "Suas respostas",
  site: "Site",
  instagram: "Perfil público",
};

type PlanData = NonNullable<OnboardingData["plan"]>;

type PlanStepProps = {
  plan: PlanData;
  onBack: () => void;
  onFinish: () => void;
};

export function PlanStep({ plan, onBack, onFinish }: PlanStepProps) {
  const { showToast } = useToast();
  const saveMutation = useSaveOnboardingPlan();
  const [items, setItems] = useState<PlanItem[]>(plan.planItems);
  const [isPlanApproved, setIsPlanApproved] = useState(plan.isPlanApproved);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);

  const { diagnosis, planStartDate } = plan;
  const agendaItems = toPlanAgendaItems(items, planStartDate);
  const selectedItem = items.find((item) => item.day === selectedDay) ?? null;
  const formatsCount = new Set(items.map((item) => item.format)).size;

  const persistPlan = async (nextItems: PlanItem[], shouldApprove: boolean) => {
    const result = await saveMutation
      .mutateAsync({ items: nextItems, shouldApprove })
      .catch(connectionFailure);

    if (!result.isSuccess) {
      showToast(result.errorMessage);
    }

    return result.isSuccess;
  };

  const handleSaveItem = async (originalDay: number, updatedItem: PlanItem) => {
    const nextItems = items
      .map((item) => (item.day === originalDay ? updatedItem : item))
      .sort((first, second) => first.day - second.day);

    if (await persistPlan(nextItems, false)) {
      setItems(nextItems);
      setSelectedDay(null);
      showToast("Pauta atualizada");
    }
  };

  const handleRemoveItem = async (day: number) => {
    const nextItems = items.filter((item) => item.day !== day);

    if (await persistPlan(nextItems, false)) {
      setItems(nextItems);
      setSelectedDay(null);
      showToast("Pauta removida");
    }
  };

  const approvePlan = async () => {
    if (!(await persistPlan(items, true))) {
      return false;
    }

    setIsPlanApproved(true);
    return true;
  };

  const handleApprove = async () => {
    if (await approvePlan()) {
      setIsApproveDialogOpen(false);
      showToast(`Plano aprovado: ${items.length} conteúdos na sua Agenda`);
    }
  };

  const handleFinish = async () => {
    if (isPlanApproved || (await approvePlan())) {
      onFinish();
    }
  };

  return (
    <StepFrame
      step={4}
      title="Diagnóstico da sua marca"
      description="Um diagnóstico claro e um calendário de 30 dias pronto para aprovar."
      onBack={onBack}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            disabled={isPlanApproved}
            onClick={() => setIsApproveDialogOpen(true)}
          >
            {isPlanApproved ? (
              <Check aria-hidden="true" className="size-4" />
            ) : null}
            {isPlanApproved ? "Plano aprovado" : "Aprovar plano"}
          </Button>
          <span className="max-sm:hidden sm:flex-1" />
          <Button
            type="button"
            size="lg"
            loading={saveMutation.isPending}
            onClick={handleFinish}
          >
            Gerar minha primeira arte
          </Button>
        </>
      }
    >
      <ul
        aria-label="Fontes do diagnóstico"
        className="tile m-0 flex list-none flex-wrap items-center gap-x-5 gap-y-2 rounded-(--r-lg) px-4 py-3 text-sm"
      >
        {Object.entries(sourceLabels).map(([key, label]) => {
          const isAccessed = plan.sources[key] === true;

          return (
            <li
              key={key}
              className={cn(
                "inline-flex items-center gap-1.5",
                !isAccessed && "text-muted",
              )}
            >
              {isAccessed ? (
                <Check
                  aria-hidden="true"
                  className="size-4 text-success"
                  strokeWidth={2.5}
                />
              ) : (
                <CircleMinus aria-hidden="true" className="size-4" />
              )}
              {label}
              {isAccessed ? "" : " · não acessado"}
            </li>
          );
        })}
      </ul>

      <DiagnosisScoreCard
        score={diagnosis.score}
        metrics={[
          { label: "Consistência", value: diagnosis.consistencyScore },
          { label: "Conteúdo", value: diagnosis.contentScore },
          { label: "Oferta", value: diagnosis.offerScore },
        ]}
      />

      <DiagnosisInsights
        strengths={diagnosis.strengths}
        attentionPoints={diagnosis.attentionPoints}
        opportunities={diagnosis.opportunities}
      />

      <FormSection
        title="Plano de 30 dias"
        adornment={<SectionHint>você aprova ou ajusta cada pauta</SectionHint>}
        description="Montado a partir do seu objetivo. Clique numa pauta para ajustar tema, formato ou data."
      >
        <PlanMonthView
          startDate={planStartDate}
          items={agendaItems}
          onOpenItem={(itemId) =>
            setSelectedDay(Number(itemId.replace("plan-", "")))
          }
        />
        <div className="max-w-sm">
          <MonthDistributionCard monthItems={agendaItems} />
        </div>
      </FormSection>

      <PlanItemSheet
        item={selectedItem}
        startDate={planStartDate}
        occupiedDays={items.map((item) => item.day)}
        open={selectedItem !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedDay(null);
          }
        }}
        onSave={handleSaveItem}
        onRemove={handleRemoveItem}
      />
      <ApproveOnboardingPlanDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
        contentsCount={items.length}
        formatsCount={formatsCount}
        isApproving={saveMutation.isPending}
        onApprove={handleApprove}
      />
    </StepFrame>
  );
}
