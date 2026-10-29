"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { planItemSchema } from "@/actions/save-onboarding-plan/schema";
import { FilterPill } from "@/components/common/filter-pill";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { addDays } from "@/lib/agenda-dates";
import {
  contentFormats,
  contentGoals,
  contentKinds,
} from "@/lib/onboarding/constants";
import type { PlanItem } from "@/lib/onboarding/thirty-day-plan";

import { getPlanDayFromDate, PLAN_DAYS } from "../utils/plan-agenda-items";

const planItemFormSchema = z.object({
  title: planItemSchema.shape.title,
  kind: z.enum(contentKinds.map((kind) => kind.value)),
  format: z.enum(contentFormats),
  goal: z.enum(contentGoals),
  date: z.string().min(1, { error: "Escolha uma data." }),
});

type PlanItemFormValues = z.infer<typeof planItemFormSchema>;

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

type PlanItemSheetProps = {
  item: PlanItem | null;
  startDate: string;
  occupiedDays: number[];
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (originalDay: number, item: PlanItem) => void;
  onRemove: (day: number) => void;
};

export function PlanItemSheet({
  item,
  startDate,
  occupiedDays,
  open,
  onOpenChange,
  onSave,
  onRemove,
}: PlanItemSheetProps) {
  const form = useForm<PlanItemFormValues>({
    resolver: zodResolver(planItemFormSchema),
    defaultValues: {
      title: "",
      kind: "educativo",
      format: "post",
      goal: "engajar",
      date: startDate,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        title: item.title,
        kind: item.kind,
        format: item.format,
        goal: item.goal,
        date: addDays(startDate, item.day - 1),
      });
    }
  }, [item, startDate, form]);

  const handleSubmit = form.handleSubmit(({ date, ...values }) => {
    if (!item) {
      return;
    }

    const day = getPlanDayFromDate(startDate, date);
    const isDayTaken = day !== item.day && occupiedDays.includes(day);

    if (day < 1 || day > PLAN_DAYS || isDayTaken) {
      form.setError("date", {
        message: isDayTaken
          ? "Este dia já tem uma pauta. Escolha outro."
          : "Escolha uma data dentro dos 30 dias do plano.",
      });
      return;
    }

    onSave(item.day, { ...values, day });
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        closeLabel="Fechar"
        overlayClassName="bg-(--scrim) backdrop-blur-[6px]"
        closeClassName="top-5 right-4 size-11 hover:bg-icon-hover hover:text-muted"
        className="dialog-surface inset-y-3 right-3 box-border h-auto w-130 max-w-[calc(100%-1.5rem)] overflow-hidden rounded-[28px] font-sans text-text sm:inset-y-4 sm:right-4 sm:max-w-[calc(100%-2rem)]"
      >
        <div className="flex flex-col gap-1 pt-6 pr-16 pl-5 sm:pl-7">
          <SheetTitle className="m-0 font-display text-xl leading-[1.3] font-bold">
            Ajustar pauta
          </SheetTitle>
          <SheetDescription className="m-0 text-sm leading-normal text-muted">
            Mude o tema, o formato ou a data. Nada é publicado sem a sua
            aprovação.
          </SheetDescription>
        </div>
        <Form {...form}>
          <form
            noValidate
            onSubmit={(event) => {
              event.stopPropagation();
              handleSubmit(event);
            }}
            className="scrollbar-subtle flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pt-5 pb-6 sm:px-7"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tema da pauta</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      min={startDate}
                      max={addDays(startDate, PLAN_DAYS - 1)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ChoiceField
              form={form}
              name="kind"
              label="Tipo de conteúdo"
              options={contentKinds.map(({ value, label }) => ({
                value,
                label,
              }))}
            />
            <ChoiceField
              form={form}
              name="format"
              label="Formato"
              options={contentFormats.map((format) => ({
                value: format,
                label: capitalize(format),
              }))}
            />
            <ChoiceField
              form={form}
              name="goal"
              label="Objetivo"
              options={contentGoals.map((goal) => ({
                value: goal,
                label: capitalize(goal),
              }))}
            />
            <div className="mt-2 flex flex-wrap justify-between gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => item && onRemove(item.day)}
              >
                <Trash2 aria-hidden="true" className="size-4.5" />
                Remover pauta
              </Button>
              <Button type="submit">Salvar pauta</Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

type ChoiceFieldProps = {
  form: ReturnType<typeof useForm<PlanItemFormValues>>;
  name: "kind" | "format" | "goal";
  label: string;
  options: { value: string; label: string }[];
};

function ChoiceField({ form, name, label, options }: ChoiceFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-2">
          <FormLabel>{label}</FormLabel>
          <div role="group" aria-label={label} className="flex flex-wrap gap-2">
            {options.map(({ value, label: optionLabel }) => (
              <FilterPill
                key={value}
                isActive={field.value === value}
                onClick={() => field.onChange(value)}
              >
                {optionLabel}
              </FilterPill>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
