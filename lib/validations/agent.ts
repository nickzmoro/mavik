import { z } from "zod";

import { agentToneOptions } from "@/lib/mocks/agent";

export const agentMessageFormSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Escreva uma mensagem para o agente.")
    .max(2000, "Use até 2.000 caracteres na mensagem."),
});

export type AgentMessageFormValues = z.infer<typeof agentMessageFormSchema>;

const requiredContextField = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `Preencha ${fieldName}.`)
    .max(120, "Use até 120 caracteres.");

export const agentContextFormSchema = z.object({
  business: requiredContextField("o tipo de negócio"),
  audience: requiredContextField("o público"),
  goal: requiredContextField("o objetivo"),
  tone: z.enum(agentToneOptions),
  additionalContext: z.string().trim().max(1000, "Use até 1.000 caracteres."),
  preferences: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      meta: z.string(),
      isFromCurrentConversation: z.boolean(),
    }),
  ),
});

export type AgentContextFormValues = z.infer<typeof agentContextFormSchema>;

export const postLinkFormSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Cole o link do post.")
    .max(500, "Esse link é longo demais.")
    .pipe(
      z.url({
        protocol: /^https?$/,
        error: "Cole um link válido, começando com https://",
      }),
    ),
});

export type PostLinkFormValues = z.infer<typeof postLinkFormSchema>;
