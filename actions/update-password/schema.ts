import { z } from "zod";

import { newPasswordSchema } from "@/lib/validations/auth";

export const updatePasswordSchema = z
  .object({
    password: newPasswordSchema,
    confirmPassword: z.string().min(1, { error: "Repita a nova senha." }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    error: "As senhas não são iguais. Digite a mesma senha nos dois campos.",
    path: ["confirmPassword"],
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
