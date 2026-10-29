import type { FieldValues, UseFormReturn } from "react-hook-form";

import {
  connectionFailure,
  type AuthActionResult,
} from "@/lib/auth-action-result";

type UseStepFormActionsOptions<TValues extends FieldValues> = {
  form: UseFormReturn<TValues>;
  save: (
    values: TValues,
    shouldAdvance: boolean,
  ) => Promise<AuthActionResult<unknown>>;
};

export function useStepFormActions<TValues extends FieldValues>({
  form,
  save,
}: UseStepFormActionsOptions<TValues>) {
  const saveValues = async (values: TValues, shouldAdvance: boolean) => {
    form.clearErrors("root");

    const result = await save(values, shouldAdvance).catch(connectionFailure);

    if (!result.isSuccess) {
      form.setError("root", { message: result.errorMessage });
    }

    return result.isSuccess;
  };

  const submitAndAdvance = (onAdvance: () => void) =>
    form.handleSubmit(async (values) => {
      if (await saveValues(values, true)) {
        onAdvance();
      }
    });

  const saveDraftAndLeave = async (onLeave: () => void) => {
    if (await form.trigger()) {
      await saveValues(form.getValues(), false);
    }

    onLeave();
  };

  return { submitAndAdvance, saveDraftAndLeave };
}
