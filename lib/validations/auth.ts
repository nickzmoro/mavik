import { z } from "zod";

export const PASSWORD_MAX_LENGTH = 72;

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, { error: "Digite seu e-mail." })
  .max(254, { error: "Esse e-mail é longo demais. Confira se digitou certo." })
  .pipe(
    z.email({
      error: "Confira o e-mail. Ele precisa ter @ e domínio, como voce@suaempresa.com.br.",
    }),
  );

export const newPasswordSchema = z
  .string()
  .min(8, { error: "Sua senha precisa ter pelo menos 8 caracteres." })
  .max(PASSWORD_MAX_LENGTH, {
    error: `Sua senha pode ter no máximo ${PASSWORD_MAX_LENGTH} caracteres.`,
  })
  .regex(/[a-zA-Z]/, { error: "Inclua pelo menos uma letra na senha." })
  .regex(/\d/, { error: "Inclua pelo menos um número na senha." });

export const captchaTokenSchema = z
  .string()
  .min(1, { error: "Confirme que você não é um robô e tente de novo." })
  .max(4096);
