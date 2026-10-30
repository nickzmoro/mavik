"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Sparkles } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGenerateIdeas } from "@/hooks/mutations/use-generate-ideas";
import { formatShortDate } from "@/lib/agenda-dates";
import {
  contentTypeLabels,
  contentTypes,
  formatLabels,
  goalLabels,
} from "@/lib/content/content-labels";
import type { IdeaDateView } from "@/lib/ideas/idea-types";
import { contentFormats, contentGoals } from "@/lib/onboarding/constants";
import { toggleArrayItem } from "@/lib/toggle-array-item";
import {
  generateIdeasFormSchema,
  type GenerateIdeasFormValues,
} from "@/lib/validations/ideas";
import { useToast } from "@/providers/toast-provider";

const generateIdeasFormId = "generate-ideas-form";

const replaceWarning =
  "As novas ideias vão substituir as atuais. Suas ideias salvas nos favoritos continuam guardadas.";

const failedMessage = "Não conseguimos gerar as ideias agora. Tente de novo.";

export function GeneratingIdeasState({
  quantity,
  storeName,
}: {
  quantity: number;
  storeName: string;
}) {
  return (
    <div
      aria-live="polite"
      className="flex flex-col items-center gap-3.5 px-7 pt-10 pb-9 text-center"
    >
      <span
        aria-hidden="true"
        className="flex size-16 animate-soft-pulse items-center justify-center rounded-[22px] bg-accent text-(--violet-900) motion-reduce:animate-none"
      >
        <Sparkles className="size-7" />
      </span>
      <p className="m-0 font-display text-[17px] leading-[1.4] font-semibold">
        Criando {quantity === 1 ? "1 ideia" : `${quantity} ideias`} para{" "}
        {storeName || "a sua marca"}
      </p>
      <p className="m-0 max-w-95 text-sm leading-normal text-muted">
        Cruzando seu objetivo, seus produtos e o seu público. Leva alguns
        segundos.
      </p>
      <div className="mt-1.5 flex w-full max-w-90 flex-col gap-2">
        {["w-full", "w-4/5", "w-3/5"].map((widthClassName) => (
          <div
            key={widthClassName}
            className={`tile h-3.5 animate-soft-pulse rounded-lg motion-reduce:animate-none ${widthClassName}`}
          />
        ))}
      </div>
    </div>
  );
}

type GenerateIdeasFormProps = {
  initialTheme: string;
  dates: IdeaDateView[];
  storeName: string;
  onGenerated: (created: number, missing: number) => void;
};

function GenerateIdeasForm({
  initialTheme,
  dates,
  storeName,
  onGenerated,
}: GenerateIdeasFormProps) {
  const { showToast } = useToast();
  const generateIdeasMutation = useGenerateIdeas();
  const initialDate = dates.find((date) => date.name === initialTheme);
  const form = useForm<GenerateIdeasFormValues>({
    resolver: zodResolver(generateIdeasFormSchema),
    defaultValues: {
      theme: initialDate ? "" : initialTheme,
      calendarDateId: initialDate?.id ?? null,
      goal: "vender",
      formats: ["reels", "carrossel"],
      contentTypes: ["educativo", "comercial"],
      quantity: 6,
    },
  });
  const quantity = useWatch({ control: form.control, name: "quantity" });

  if (generateIdeasMutation.isPending) {
    return <GeneratingIdeasState quantity={quantity} storeName={storeName} />;
  }

  const handleGenerateIdeas = (values: GenerateIdeasFormValues) =>
    generateIdeasMutation.mutate(
      { mode: "request", ...values },
      {
        onSuccess: (result) =>
          result.isSuccess
            ? onGenerated(result.data.created, result.data.missing)
            : showToast(result.errorMessage),
        onError: () => showToast(failedMessage),
      },
    );

  return (
    <>
      <Form {...form}>
        <form
          id={generateIdeasFormId}
          noValidate
          onSubmit={form.handleSubmit(handleGenerateIdeas)}
          className="scrollbar-subtle m-0 flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7"
        >
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  Tema{" "}
                  <span className="font-normal text-muted">(opcional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex.: Black Friday, cardápio de verão, novo bolo"
                    autoComplete="off"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      form.setValue("calendarDateId", null);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {dates.length > 0 ? (
            <FormField
              control={form.control}
              name="calendarDateId"
              render={({ field }) => (
                <PillGroup
                  id="generate-date"
                  label="Ou uma data do calendário"
                  options={dates.map((date) => date.id)}
                  getLabel={(dateId) => {
                    const date = dates.find(({ id }) => id === dateId);

                    return date
                      ? `${date.name} · ${formatShortDate(date.date)}`
                      : "";
                  }}
                  isSelected={(dateId) => dateId === field.value}
                  onToggle={(dateId) => {
                    field.onChange(dateId === field.value ? null : dateId);
                    form.setValue("theme", "");
                  }}
                />
              )}
            />
          ) : null}
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <PillGroup
                id="generate-goal"
                label="Objetivo"
                options={contentGoals}
                getLabel={(goal) => goalLabels[goal]}
                isSelected={(goal) => goal === field.value}
                onToggle={field.onChange}
              />
            )}
          />
          <FormField
            control={form.control}
            name="formats"
            render={({ field, fieldState }) => (
              <PillGroup
                id="generate-formats"
                label="Formatos"
                hint="(um ou mais)"
                options={contentFormats}
                getLabel={(format) => formatLabels[format]}
                isSelected={(format) => field.value.includes(format)}
                onToggle={(format) =>
                  field.onChange(toggleArrayItem(field.value, format))
                }
                errorMessage={fieldState.error?.message}
              />
            )}
          />
          <FormField
            control={form.control}
            name="contentTypes"
            render={({ field, fieldState }) => (
              <PillGroup
                id="generate-types"
                label="Tipo de conteúdo"
                hint="(um ou mais)"
                options={contentTypes}
                getLabel={(contentType) => contentTypeLabels[contentType]}
                isSelected={(contentType) => field.value.includes(contentType)}
                onToggle={(contentType) =>
                  field.onChange(toggleArrayItem(field.value, contentType))
                }
                errorMessage={fieldState.error?.message}
              />
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="max-w-40">
                <FormLabel className="font-semibold">Quantas ideias</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={12}
                    {...field}
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(event) =>
                      field.onChange(event.target.valueAsNumber)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p
            role="note"
            className="tile m-0 flex items-start gap-2.5 rounded-[14px] px-3.5 py-3 text-[13px] leading-normal text-muted"
          >
            <Info
              aria-hidden="true"
              className="mt-px size-4 shrink-0 text-primary"
            />
            {replaceWarning}
          </p>
        </form>
      </Form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancelar</Button>
        </DialogClose>
        <Button type="submit" form={generateIdeasFormId}>
          <Sparkles aria-hidden="true" className="size-4.5" />
          {Number.isInteger(quantity) && quantity > 0
            ? `Gerar ${quantity === 1 ? "1 ideia" : `${quantity} ideias`}`
            : "Gerar ideias"}
        </Button>
      </DialogFooter>
    </>
  );
}

type GenerateIdeasDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialTheme: string;
  dates: IdeaDateView[];
  storeName: string;
};

export function GenerateIdeasDialog({
  open,
  onOpenChange,
  initialTheme,
  dates,
  storeName,
}: GenerateIdeasDialogProps) {
  const { showToast } = useToast();

  const handleGenerated = (created: number, missing: number) => {
    onOpenChange(false);
    showToast(
      missing > 0
        ? `${created} novas ideias na sua biblioteca. Faltaram ${missing}, tente gerar de novo.`
        : `${created === 1 ? "1 nova ideia" : `${created} novas ideias`} na sua biblioteca`,
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-160">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Gerar novas ideias</DialogTitle>
          <DialogDescription>
            {`O agente usa o que sabe ${storeName ? `do ${storeName}` : "da sua marca"}. Escolha só o que importa agora.`}
          </DialogDescription>
        </DialogHeader>
        {open ? (
          <GenerateIdeasForm
            key={initialTheme}
            initialTheme={initialTheme}
            dates={dates}
            storeName={storeName}
            onGenerated={handleGenerated}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
