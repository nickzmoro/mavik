"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import {
  planItemSchema,
  type PlanItemValues,
} from "@/actions/save-onboarding-plan/schema";
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
import { RadioGroup, RadioGroupCardItem } from "@/components/ui/radio-group";
import { contentKinds } from "@/lib/onboarding/constants";
import { getStudioUrlForPauta } from "@/lib/routes";

type PlanItemEditorProps = {
  dateLabel: string;
  item: PlanItemValues;
  isNew: boolean;
  onApply: (item: PlanItemValues) => void;
  onRemove: () => void;
};

export function PlanItemEditor({
  dateLabel,
  item,
  isNew,
  onApply,
  onRemove,
}: PlanItemEditorProps) {
  const form = useForm<PlanItemValues>({
    resolver: zodResolver(planItemSchema),
    values: item,
  });

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onApply)}
        className="m-0 flex flex-col gap-4 rounded-(--r-lg) border border-primary bg-bg p-5 shadow-(--shadow-md)"
      >
        <p className="m-0 font-display text-base font-semibold text-text">
          {isNew ? `Nova pauta · ${dateLabel}` : `Pauta de ${dateLabel}`}
        </p>

        <FormField
          control={form.control}
          name="kind"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de conteúdo</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid-cols-3"
                >
                  {contentKinds.map(({ value, label }) => (
                    <RadioGroupCardItem key={value} value={value} className="py-2">
                      {label}
                    </RadioGroupCardItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da pauta</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex.: 3 dúvidas comuns sobre limpeza de pele"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="sm">
            {isNew ? "Adicionar pauta" : "Aplicar ajuste"}
          </Button>
          {!isNew && (
            <>
              <Button asChild size="sm" variant="secondary">
                <Link href={getStudioUrlForPauta(item.title)}>
                  <Sparkles size={16} aria-hidden="true" />
                  Gerar a arte
                </Link>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={onRemove}
              >
                <Trash2 size={16} aria-hidden="true" />
                Remover
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
}
