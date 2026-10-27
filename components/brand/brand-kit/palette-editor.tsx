"use client";

import { Sparkles, TriangleAlert } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import type { SaveOnboardingBrandKitFormValues } from "@/actions/save-onboarding-brand-kit/schema";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { contrastRatio } from "@/lib/color";
import { colorRoles, type ColorRole } from "@/lib/onboarding/constants";

const contrastPairs: {
  label: string;
  foreground: ColorRole;
  background: ColorRole;
}[] = [
  { label: "Texto sobre o fundo", foreground: "texto", background: "fundo" },
  {
    label: "Fundo sobre a primária",
    foreground: "fundo",
    background: "primaria",
  },
  {
    label: "Texto sobre a secundária",
    foreground: "texto",
    background: "secundaria",
  },
  {
    label: "Texto sobre o destaque",
    foreground: "texto",
    background: "destaque",
  },
];

const MIN_CONTRAST = 4.5;
const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;

type PaletteEditorProps = {
  suggestedPalette: Record<ColorRole, string> | null;
};

export function PaletteEditor({ suggestedPalette }: PaletteEditorProps) {
  const form = useFormContext<SaveOnboardingBrandKitFormValues>();
  const colors = useWatch({ control: form.control, name: "colors" });

  const failingPairs = contrastPairs.filter(({ foreground, background }) => {
    const foregroundHex = colors[foreground];
    const backgroundHex = colors[background];

    return (
      HEX_PATTERN.test(foregroundHex) &&
      HEX_PATTERN.test(backgroundHex) &&
      contrastRatio(foregroundHex, backgroundHex) < MIN_CONTRAST
    );
  });

  const applySuggestion = () => {
    if (!suggestedPalette) {
      return;
    }

    form.setValue("colors", suggestedPalette, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {colorRoles.map(({ value: role, label }) => (
          <FormField
            key={role}
            control={form.control}
            name={`colors.${role}`}
            render={({ field }) => (
              <FormItem>
                <label
                  className="block h-16 cursor-pointer rounded-(--r-md) border border-border shadow-(--shadow-sm) focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus"
                  style={{
                    backgroundColor: HEX_PATTERN.test(field.value)
                      ? field.value
                      : "transparent",
                  }}
                >
                  <input
                    type="color"
                    aria-label={`Escolher cor ${label}`}
                    value={
                      HEX_PATTERN.test(field.value) ? field.value : "#000000"
                    }
                    onChange={(event) =>
                      field.onChange(event.target.value.toUpperCase())
                    }
                    className="sr-only"
                  />
                </label>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    maxLength={7}
                    onChange={(event) =>
                      field.onChange(event.target.value.toUpperCase())
                    }
                    className="min-h-9 font-mono text-sm uppercase"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {failingPairs.length === 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success bg-success-bg px-3 py-1 text-xs font-medium text-text">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-success"
            />
            Contraste AA ok
          </span>
        ) : (
          <span className="inline-flex items-start gap-1.5 rounded-(--r-md) border border-warning bg-warning-bg px-3 py-2 text-sm text-text">
            <TriangleAlert
              size={16}
              aria-hidden="true"
              className="mt-0.5 flex-none text-warning"
            />
            Pouco contraste em:{" "}
            {failingPairs.map(({ label }) => label.toLowerCase()).join(", ")}.
            Ajuste as cores para o texto ficar legível.
          </span>
        )}
        {suggestedPalette && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={applySuggestion}
          >
            <Sparkles size={16} aria-hidden="true" />
            Sugerir a partir da logo
          </Button>
        )}
      </div>
    </div>
  );
}
