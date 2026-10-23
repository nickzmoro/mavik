import { z } from "zod";

import { captchaTokenSchema, emailSchema } from "@/lib/validations/auth";

export const requestPasswordResetFormSchema = z.object({
  email: emailSchema,
});

export const requestPasswordResetSchema = requestPasswordResetFormSchema.extend(
  {
    captchaToken: captchaTokenSchema,
  },
);

export type RequestPasswordResetFormValues = z.infer<
  typeof requestPasswordResetFormSchema
>;
export type RequestPasswordResetInput = z.infer<
  typeof requestPasswordResetSchema
>;
