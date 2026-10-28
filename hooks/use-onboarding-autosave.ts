import { useEffect, useRef, useState } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import type { AuthActionResult } from "@/lib/auth-action-result";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

type UseOnboardingAutosaveOptions<TValues extends FieldValues> = {
  form: UseFormReturn<TValues>;
  schema: z.ZodType<TValues>;
  save: (values: TValues) => Promise<AuthActionResult<unknown>>;
  delayMs?: number;
};

export function useOnboardingAutosave<TValues extends FieldValues>({
  form,
  schema,
  save,
  delayMs = 1500,
}: UseOnboardingAutosaveOptions<TValues>) {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const saveRef = useRef(save);

  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const subscription = form.watch(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const parsedValues = schema.safeParse(form.getValues());

        if (!parsedValues.success) {
          return;
        }

        setStatus("saving");
        const result = await saveRef
          .current(parsedValues.data)
          .catch(() => ({ isSuccess: false as const, errorMessage: "" }));
        setStatus(result.isSuccess ? "saved" : "error");
      }, delayMs);
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [form, schema, delayMs]);

  return status;
}
