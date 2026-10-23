import { z } from "zod";

import { newPasswordSchema } from "@/lib/validations/auth";

const passwordFieldsSchema = z.object({
  password: newPasswordSchema,
  confirmPassword: z.string().min(1, { error: "Repita a nova senha." }),
});

const passwordsMatchRefinement = {
  check: ({ password, confirmPassword }: z.infer<typeof passwordFieldsSchema>) =>
    password === confirmPassword,
  params: {
    error: "As senhas não são iguais. Digite a mesma senha nos dois campos.",
    path: ["confirmPassword"],
  },
};

export const updatePasswordFormSchema = passwordFieldsSchema.refine(
  passwordsMatchRefinement.check,
  passwordsMatchRefinement.params,
);

export const updatePasswordSchema = passwordFieldsSchema
  .extend({
    tokenHash: z.string().max(512).optional(),
  })
  .refine(passwordsMatchRefinement.check, passwordsMatchRefinement.params);

export type UpdatePasswordFormValues = z.infer<typeof updatePasswordFormSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
