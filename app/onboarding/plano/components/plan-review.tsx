"use client";

import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { PlanItemValues } from "@/actions/save-onboarding-plan/schema";
import { FormAlert } from "@/components/auth/form-alert";
import { Button } from "@/components/ui/button";
import { useSaveOnboardingPlan } from "@/hooks/mutations/use-save-onboarding-plan";
import { connectionFailure } from "@/lib/auth-action-result";
import { getStudioUrlForPauta, routes } from "@/lib/routes";

import { getPlanDate, PlanCalendar } from "./plan-calendar";
import { PlanItemEditor } from "./plan-item-editor";

type PlanReviewProps = {
  startDate: string;
  initialItems: PlanItemValues[];
  isInitiallyApproved: boolean;
};

export function PlanReview({
  startDate,
  initialItems,
  isInitiallyApproved,
}: PlanReviewProps) {
  const savePlanMutation = useSaveOnboardingPlan();
  const [items, setItems] = useState(initialItems);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isApproved, setIsApproved] = useState(isInitiallyApproved);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const selectedItem = items.find(({ day }) => day === selectedDay);
  const firstItem = [...items].sort(
    (first, second) => first.day - second.day,
  )[0];

  const updateItems = (nextItems: PlanItemValues[]) => {
    setItems(nextItems);
    setHasUnsavedChanges(true);
    setSelectedDay(null);
  };

  const savePlan = async (shouldApprove: boolean) => {
    setErrorMessage(undefined);
    const result = await savePlanMutation
      .mutateAsync({ items, shouldApprove })
      .catch(connectionFailure);

    if (!result.isSuccess) {
      setErrorMessage(result.errorMessage);
      return;
    }

    setHasUnsavedChanges(false);
    setIsApproved(result.data.isApproved);
  };

  const pendingAction = savePlanMutation.isPending
    ? savePlanMutation.variables?.shouldApprove
    : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="m-0 font-display text-xl font-semibold text-text">
          Plano de 30 dias
        </h2>
        <span className="text-sm text-muted">
          você aprova ou ajusta cada pauta
        </span>
      </div>
      <p className="m-0 text-sm text-muted">
        Mistura de conteúdos educativos, comerciais e de autoridade. Clique num
        dia para ajustar a pauta, adicionar uma nova ou gerar a arte.
      </p>

      <FormAlert message={errorMessage} />

      <PlanCalendar
        startDate={startDate}
        items={items}
        selectedDay={selectedDay}
        onSelectDay={(day) => setSelectedDay(day === selectedDay ? null : day)}
      />

      {selectedDay !== null && (
        <PlanItemEditor
          key={selectedDay}
          dateLabel={getPlanDate(startDate, selectedDay).toLocaleDateString(
            "pt-BR",
            {
              weekday: "long",
              day: "numeric",
              month: "long",
              timeZone: "UTC",
            },
          )}
          isNew={!selectedItem}
          item={
            selectedItem ?? { day: selectedDay, kind: "educativo", title: "" }
          }
          onApply={(item) =>
            updateItems([...items.filter(({ day }) => day !== item.day), item])
          }
          onRemove={() =>
            updateItems(items.filter(({ day }) => day !== selectedDay))
          }
        />
      )}

      {isApproved && !hasUnsavedChanges && (
        <p
          role="status"
          className="m-0 flex items-center gap-2 rounded-(--r-lg) border border-success bg-success-bg p-4 text-sm text-text"
        >
          <CircleCheck size={18} aria-hidden="true" className="text-success" />
          Plano aprovado. Nada é publicado sem você revisar cada arte antes.
        </p>
      )}

      <div className="sticky bottom-0 z-10 -mx-4 mt-6 border-t border-border bg-bg/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!hasUnsavedChanges || savePlanMutation.isPending}
              loading={pendingAction === false}
              onClick={() => savePlan(false)}
            >
              Salvar ajustes
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={
                (isApproved && !hasUnsavedChanges) || savePlanMutation.isPending
              }
              loading={pendingAction === true}
              onClick={() => savePlan(true)}
            >
              {isApproved && !hasUnsavedChanges
                ? "Plano aprovado"
                : "Aprovar plano"}
            </Button>
          </div>
          <Button asChild variant="brand" size="lg">
            <Link
              href={
                firstItem
                  ? getStudioUrlForPauta(firstItem.title)
                  : routes.studio
              }
            >
              Gerar minha primeira arte
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
