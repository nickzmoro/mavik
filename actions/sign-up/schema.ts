import { z } from "zod";

import {
  captchaTokenSchema,
  emailSchema,
  newPasswordSchema,
} from "@/lib/validations/auth";

export const signUpFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Digite seu nome." })
    .max(80, { error: "Use um nome com até 80 caracteres." }),
  email: emailSchema,
  password: newPasswordSchema,
  acceptedTerms: z.boolean().refine((isAccepted) => isAccepted, {
    error: "Aceite os Termos de uso e a Política de privacidade para continuar.",
  }),
});

export const signUpSchema = signUpFormSchema.extend({
  captchaToken: captchaTokenSchema,
});

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
