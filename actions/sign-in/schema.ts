import { z } from "zod";

import {
  captchaTokenSchema,
  emailSchema,
  PASSWORD_MAX_LENGTH,
} from "@/lib/validations/auth";

export const signInFormSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, { error: "Digite sua senha." })
    .max(PASSWORD_MAX_LENGTH, { error: "E-mail ou senha incorretos." }),
  remember: z.boolean(),
});

export const signInSchema = signInFormSchema.extend({
  captchaToken: captchaTokenSchema,
  redirectTo: z.string().max(2048).optional(),
});

export type SignInFormValues = z.infer<typeof signInFormSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
