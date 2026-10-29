"use client";

import type { Control } from "react-hook-form";

import type { SaveOnboardingBrandKitFormValues } from "@/actions/save-onboarding-brand-kit/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { parseColor } from "@/lib/color-contrast";
import type { ColorRole } from "@/lib/onboarding/constants";

type ColorSwatchFieldProps = {
  control: Control<SaveOnboardingBrandKitFormValues>;
  role: ColorRole;
  label: string;
};

const fallbackColor = "#000000";

const normalizeHexInput = (value: string) => {
  const trimmedValue = value.trim().toUpperCase();

  return trimmedValue.startsWith("#") || !trimmedValue
    ? trimmedValue
    : `#${trimmedValue}`;
};

export function ColorSwatchField({
  control,
  role,
  label,
}: ColorSwatchFieldProps) {
  return (
    <FormField
      control={control}
      name={`colors.${role}`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex items-center gap-2">
            <input
              type="color"
              aria-label={`Escolher a cor ${label.toLowerCase()}`}
              value={parseColor(field.value) ?? fallbackColor}
              onChange={(event) =>
                field.onChange(event.target.value.toUpperCase())
              }
              className="size-11 shrink-0 cursor-pointer rounded-(--r-md) border border-muted bg-transparent p-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            />
            <FormControl>
              <Input
                maxLength={7}
                autoCapitalize="characters"
                spellCheck={false}
                className="min-w-0 font-mono uppercase"
                name={field.name}
                ref={field.ref}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(event) =>
                  field.onChange(normalizeHexInput(event.target.value))
                }
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
