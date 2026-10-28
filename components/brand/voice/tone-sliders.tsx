"use client";

import { useFormContext } from "react-hook-form";

import type { SaveOnboardingVoiceFormValues } from "@/actions/save-onboarding-voice/schema";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";

const toneScales = [
  { name: "formalCasual", start: "Formal", end: "Descontraído" },
  { name: "seriousFun", start: "Sério", end: "Divertido" },
  { name: "technicalSimple", start: "Técnico", end: "Simples" },
  { name: "educationalSales", start: "Educativo", end: "Vendedor" },
] as const;

export function ToneSliders() {
  const form = useFormContext<SaveOnboardingVoiceFormValues>();

  return (
    <div className="grid gap-x-8 gap-y-2 rounded-(--r-lg) border border-border bg-bg p-5 shadow-(--shadow-sm) sm:grid-cols-2">
      {toneScales.map(({ name, start, end }) => (
        <FormField
          key={name}
          control={form.control}
          name={`tone.${name}`}
          render={({ field }) => (
            <FormItem className="gap-0">
              <div
                className="flex justify-between text-sm text-text"
                aria-hidden="true"
              >
                <span>{start}</span>
                <span>{end}</span>
              </div>
              <FormControl>
                <Slider
                  aria-label={`${start} ou ${end}`}
                  min={0}
                  max={100}
                  step={5}
                  value={[field.value]}
                  onValueChange={([value]) => {
                    field.onChange(value);
                    form.setValue("sampleApproved", false);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
