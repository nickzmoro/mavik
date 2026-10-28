"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Check, Clock, Sparkles } from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { OptionTileGroup } from "@/components/common/option-tile-group";
import { PillGroup } from "@/components/common/pill-group";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import {
  agendaWeekdayLabels,
  planDateOptions,
  planFrequencyOptions,
  planLibraryUsageOptions,
  planMonthOptions,
  planStrategyBase,
} from "@/lib/mocks/agenda";
import { toggleArrayItem } from "@/lib/toggle-array-item";
import {
  generatePlanFormSchema,
  type GeneratePlanFormValues,
} from "@/lib/validations/agenda";

const generatePlanFormId = "generate-plan-form";
const planGenerationDelayInMs = 2000;

const generationSteps = [
  { label: "Lendo o objetivo e as preferências", isDone: true },
  { label: "Encaixando datas e campanhas", isDone: true },
  { label: "Equilibrando formatos e objetivos", isDone: false },
];

function GeneratingPlanState({ monthName }: { monthName: string }) {
  return (
    <div
      aria-live="polite"
      className="flex flex-col items-center gap-3.5 px-7 pt-9 pb-8 text-center"
    >
      <span
        aria-hidden="true"
        className="flex size-16 animate-soft-pulse items-center justify-center rounded-[22px] bg-accent text-(--violet-900) motion-reduce:animate-none"
      >
        <Calendar className="size-7" />
      </span>
      <p className="m-0 font-display text-[17px] leading-[1.4] font-semibold">
        Montando o plano de {monthName.toLowerCase()}
      </p>
      <ul className="m-0 flex list-none flex-col gap-2 p-0 text-left">
        {generationSteps.map((step) => (
          <li
            key={step.label}
            className={
              step.isDone
                ? "flex items-center gap-2 text-sm leading-[1.4]"
                : "flex animate-soft-pulse items-center gap-2 text-sm leading-[1.4] text-muted motion-reduce:animate-none"
            }
          >
            {step.isDone ? (
              <Check aria-hidden="true" className="size-4 text-success" />
            ) : (
              <Clock aria-hidden="true" className="size-4" />
            )}
            {step.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function GeneratePlanForm({ onGenerated }: { onGenerated: () => void }) {
  const [generatingMonth, setGeneratingMonth] = useState<string | null>(null);
  const form = useForm<GeneratePlanFormValues>({
    resolver: zodResolver(generatePlanFormSchema),
    defaultValues: {
      month: "Novembro",
      frequency: "recommended",
      focusDays: ["Qui", "Sex", "Sáb"],
      dates: ["consciencia-negra", "black-friday"],
      libraryUsage: "Sim, priorizar salvas",
    },
  });
  const [focusDays, dates] = useWatch({
    control: form.control,
    name: ["focusDays", "dates"],
  });
  const finishGeneration = useEffectEvent(onGenerated);

  useEffect(() => {
    if (!generatingMonth) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => finishGeneration(),
      planGenerationDelayInMs,
    );

    return () => window.clearTimeout(timeoutId);
  }, [generatingMonth]);

  if (generatingMonth) {
    return <GeneratingPlanState monthName={generatingMonth} />;
  }

  return (
    <>
      <Form {...form}>
        <form
          id={generatePlanFormId}
          noValidate
          onSubmit={form.handleSubmit((values) =>
            setGeneratingMonth(values.month),
          )}
          className="scrollbar-subtle m-0 flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7"
        >
          <div className="plan flex flex-wrap items-center gap-1.5 rounded-(--r-lg) px-3.5 py-3">
            <span className="mr-1 text-xs leading-[1.4] font-semibold text-primary">
              Base da estratégia
            </span>
            {planStrategyBase.map((strategy) => (
              <span
                key={strategy}
                className="chip-surface rounded-full px-2.5 py-0.75 text-xs leading-[1.4] font-medium"
              >
                {strategy}
              </span>
            ))}
          </div>
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <PillGroup
                id="plan-month"
                label="Mês"
                options={planMonthOptions}
                isSelected={(option) => option === field.value}
                onToggle={field.onChange}
              />
            )}
          />
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <OptionTileGroup
                id="plan-frequency"
                label="Frequência"
                options={planFrequencyOptions}
                isSelected={(optionId) => optionId === field.value}
                onToggle={field.onChange}
                minTileWidth={180}
                tileClassName="min-h-15"
              />
            )}
          />
          <FormField
            control={form.control}
            name="focusDays"
            render={({ field, fieldState }) => (
              <PillGroup
                id="plan-focus-days"
                label="Dias de foco"
                hint="(sugeridos pelo seu objetivo)"
                options={agendaWeekdayLabels}
                isSelected={(option) => field.value.includes(option)}
                onToggle={(option) =>
                  field.onChange(toggleArrayItem(field.value, option))
                }
                errorMessage={fieldState.error?.message}
              />
            )}
          />
          <FormField
            control={form.control}
            name="dates"
            render={({ field }) => (
              <OptionTileGroup
                id="plan-dates"
                label="Datas para incluir"
                options={planDateOptions}
                isSelected={(optionId) => field.value.includes(optionId)}
                onToggle={(optionId) =>
                  field.onChange(toggleArrayItem(field.value, optionId))
                }
                minTileWidth={180}
                tileClassName="min-h-15"
              />
            )}
          />
          <FormField
            control={form.control}
            name="libraryUsage"
            render={({ field }) => (
              <PillGroup
                id="plan-library-usage"
                label="Usar ideias da biblioteca"
                options={planLibraryUsageOptions}
                isSelected={(option) => option === field.value}
                onToggle={field.onChange}
              />
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <span className="mr-auto text-[13px] leading-[1.4] text-muted">
          {focusDays.length} dias de foco · {dates.length}{" "}
          {dates.length === 1 ? "data" : "datas"}
        </span>
        <DialogClose asChild>
          <Button variant="ghost">Cancelar</Button>
        </DialogClose>
        <Button type="submit" form={generatePlanFormId}>
          <Sparkles aria-hidden="true" className="size-4.5" />
          Gerar plano
        </Button>
      </DialogFooter>
    </>
  );
}

type GeneratePlanDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onGenerated: () => void;
};

export function GeneratePlanDialog({
  open,
  onOpenChange,
  onGenerated,
}: GeneratePlanDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-170">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Gerar plano do mês</DialogTitle>
          <DialogDescription>
            O agente monta o calendário a partir da sua estratégia, não de
            horários aleatórios.
          </DialogDescription>
        </DialogHeader>
        <GeneratePlanForm onGenerated={onGenerated} />
      </DialogContent>
    </Dialog>
  );
}
