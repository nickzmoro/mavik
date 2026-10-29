"use client";

import { Check, Trash2 } from "lucide-react";
import type { Control } from "react-hook-form";

import type { SaveOnboardingVoiceFormValues } from "@/actions/save-onboarding-voice/schema";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type PersonaCardProps = {
  control: Control<SaveOnboardingVoiceFormValues>;
  index: number;
  onRemove: () => void;
};

export function PersonaCard({ control, index, onRemove }: PersonaCardProps) {
  return (
    <div className="tile flex flex-col gap-4 rounded-(--r-lg) p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_88px] gap-3">
        <FormField
          control={control}
          name={`personas.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex.: Mariana" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`personas.${index}.age`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Idade</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={14}
                  max={100}
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
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
      </div>
      <FormField
        control={control}
        name={`personas.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quem é essa pessoa?</FormLabel>
            <FormControl>
              <Textarea
                rows={3}
                placeholder="Rotina, desejos e dores em poucas linhas"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-wrap items-center gap-2">
        <FormField
          control={control}
          name={`personas.${index}.confirmed`}
          render={({ field }) => (
            <Button
              type="button"
              size="sm"
              variant={field.value ? "default" : "secondary"}
              aria-pressed={field.value}
              onClick={() => field.onChange(!field.value)}
            >
              {field.value ? (
                <Check aria-hidden="true" className="size-4" />
              ) : null}
              {field.value ? "Confirmada" : "Confirmar"}
            </Button>
          )}
        />
        <Button type="button" size="sm" variant="ghost" onClick={onRemove}>
          <Trash2 aria-hidden="true" className="size-4" />
          Remover
        </Button>
      </div>
    </div>
  );
}
