"use client";

import { useFormContext } from "react-hook-form";

import type { SaveOnboardingBrandKitFormValues } from "@/actions/save-onboarding-brand-kit/schema";
import { RequirementBadge } from "@/components/onboarding/requirement-badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  bodyFontFamilies,
  titleFontFamilies,
} from "@/lib/onboarding/constants";

import { fontFamilyStyles } from "./font-options";
import { NativeSelect } from "./native-select";

const fontFields = [
  {
    name: "titleFont",
    label: "Títulos",
    families: titleFontFamilies,
    helper: "acentos ok",
  },
  {
    name: "bodyFont",
    label: "Parágrafos",
    families: bodyFontFamilies,
    helper: "legível em tamanho pequeno",
  },
] as const;

export function FontPicker() {
  const form = useFormContext<SaveOnboardingBrandKitFormValues>();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fontFields.map(({ name, label, families, helper }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className="gap-3 rounded-(--r-lg) border border-border bg-bg p-4 shadow-(--shadow-sm)">
                <div className="flex items-center justify-between gap-2">
                  <FormLabel className="font-normal text-muted">
                    {label}
                  </FormLabel>
                  <RequirementBadge requirement="obrigatorio" />
                </div>
                <p
                  aria-hidden="true"
                  className="m-0 text-[32px] leading-tight text-text"
                  style={{ fontFamily: fontFamilyStyles[field.value] }}
                >
                  Aa Çã É
                </p>
                <FormControl>
                  <NativeSelect {...field}>
                    {families.map((family) => (
                      <option key={family} value={family}>
                        {family}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
                <p className="m-0 text-xs text-muted">
                  {field.value} · {helper}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>

      <FormField
        control={form.control}
        name="licenseConfirmed"
        render={({ field }) => (
          <FormItem>
            <div className="flex min-h-11 items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
              </FormControl>
              <FormLabel className="cursor-pointer font-normal">
                Confirmo que tenho o direito de uso destas fontes.
              </FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
