"use client";

import type { Control } from "react-hook-form";

import type { SaveOnboardingVoiceFormValues } from "@/actions/save-onboarding-voice/schema";
import { FormControl, FormField, FormItem } from "@/components/ui/form";

type ToneKey = keyof SaveOnboardingVoiceFormValues["tone"];

const toneSliders: {
  name: ToneKey;
  startLabel: string;
  endLabel: string;
  ariaLabel: string;
}[] = [
  {
    name: "formalCasual",
    startLabel: "Formal",
    endLabel: "Descontraído",
    ariaLabel: "De formal a descontraído",
  },
  {
    name: "seriousFun",
    startLabel: "Sério",
    endLabel: "Divertido",
    ariaLabel: "De sério a divertido",
  },
  {
    name: "technicalSimple",
    startLabel: "Técnico",
    endLabel: "Simples",
    ariaLabel: "De técnico a simples",
  },
  {
    name: "educationalSales",
    startLabel: "Educativo",
    endLabel: "Vendedor",
    ariaLabel: "De educativo a vendedor",
  },
];

type ToneSlidersProps = {
  control: Control<SaveOnboardingVoiceFormValues>;
  onToneChange: () => void;
};

export function ToneSliders({ control, onToneChange }: ToneSlidersProps) {
  return (
    <div className="tile grid gap-6 rounded-(--r-lg) p-5 md:grid-cols-2">
      {toneSliders.map(({ name, startLabel, endLabel, ariaLabel }) => (
        <FormField
          key={name}
          control={control}
          name={`tone.${name}`}
          render={({ field }) => (
            <FormItem className="gap-2">
              <div className="flex justify-between text-sm font-medium">
                <span>{startLabel}</span>
                <span>{endLabel}</span>
              </div>
              <FormControl>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  aria-label={ariaLabel}
                  name={field.name}
                  ref={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(event) => {
                    field.onChange(Number(event.target.value));
                    onToneChange();
                  }}
                  className="h-11 w-full cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                />
              </FormControl>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
