"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Sparkles } from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";
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
import { ideaFormats, ideaGoals, ideaTypes } from "@/lib/mocks/ideas";
import { mockCurrentStore } from "@/lib/mocks/sidebar";
import { toggleArrayItem } from "@/lib/toggle-array-item";
import {
  generateIdeasFormSchema,
  ideaQuantityOptions,
  type GenerateIdeasFormValues,
} from "@/lib/validations/ideas";
import { useToast } from "@/providers/toast-provider";

const generateIdeasFormId = "generate-ideas-form";
const ideasGenerationDelayInMs = 1800;

type GenerateIdeasDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialTheme: string;
};

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
        Criando {quantity} ideias para {storeName || "a sua marca"}
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

function GenerateIdeasForm({
  initialTheme,
  onGenerated,
}: {
  initialTheme: string;
  onGenerated: (quantity: number) => void;
}) {
  const [generatingQuantity, setGeneratingQuantity] = useState<number | null>(
    null,
  );
  const form = useForm<GenerateIdeasFormValues>({
    resolver: zodResolver(generateIdeasFormSchema),
    defaultValues: {
      theme: initialTheme,
      goal: "vender",
      formats: ["reels", "carrossel"],
      types: ["educativo", "comercial"],
      quantity: 6,
    },
  });

  const quantity = useWatch({ control: form.control, name: "quantity" });
  const finishGeneration = useEffectEvent((generatedQuantity: number) =>
    onGenerated(generatedQuantity),
  );

  useEffect(() => {
    if (generatingQuantity === null) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => finishGeneration(generatingQuantity),
      ideasGenerationDelayInMs,
    );

    return () => window.clearTimeout(timeoutId);
  }, [generatingQuantity]);

  if (generatingQuantity !== null) {
    return (
      <GeneratingIdeasState
        quantity={generatingQuantity}
        storeName={mockCurrentStore.name}
      />
    );
  }

  const handleGenerateIdeas = (values: GenerateIdeasFormValues) =>
    setGeneratingQuantity(values.quantity);

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
                  Tema ou data{" "}
                  <span className="font-normal text-muted">(opcional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex.: Black Friday, cardápio de verão, novo bolo"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <PillGroup
                id="generate-goal"
                label="Objetivo"
                options={ideaGoals}
                isSelected={(option) => option === field.value}
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
                options={ideaFormats}
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
            name="types"
            render={({ field, fieldState }) => (
              <PillGroup
                id="generate-types"
                label="Tipo de conteúdo"
                options={ideaTypes}
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
            name="quantity"
            render={({ field }) => (
              <PillGroup
                id="generate-quantity"
                label="Quantas ideias"
                options={ideaQuantityOptions}
                isSelected={(option) => option === field.value}
                onToggle={field.onChange}
              />
            )}
          />
          <p className="tile m-0 flex items-start gap-2.5 rounded-[14px] px-3.5 py-3 text-[13px] leading-normal text-muted">
            <Check
              aria-hidden="true"
              className="mt-px size-4 shrink-0 text-success"
            />
            Vou respeitar suas preferências: tom acolhedor, fotos reais e sem
            destacar descontos.
          </p>
        </form>
      </Form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancelar</Button>
        </DialogClose>
        <Button type="submit" form={generateIdeasFormId}>
          <Sparkles aria-hidden="true" className="size-4.5" />
          Gerar {quantity} ideias
        </Button>
      </DialogFooter>
    </>
  );
}

export function GenerateIdeasDialog({
  open,
  onOpenChange,
  initialTheme,
}: GenerateIdeasDialogProps) {
  const { showToast } = useToast();

  const handleGenerated = (quantity: number) => {
    onOpenChange(false);
    showToast(`${quantity} novas ideias na sua biblioteca`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-160">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Gerar novas ideias</DialogTitle>
          <DialogDescription>
            O agente usa o que sabe do {mockCurrentStore.name}. Escolha só o que
            importa agora.
          </DialogDescription>
        </DialogHeader>
        <GenerateIdeasForm
          initialTheme={initialTheme}
          onGenerated={handleGenerated}
        />
      </DialogContent>
    </Dialog>
  );
}
