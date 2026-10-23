import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, { error: "Digite seu e-mail." })
  .pipe(
    z.email({
      error: "Confira o e-mail. Ele precisa ter @ e domínio, como voce@suaempresa.com.br.",
    }),
  );
