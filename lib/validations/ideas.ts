import { z } from "zod";

import { MAX_REQUESTED_IDEAS } from "@/actions/generate-ideas/schema";
import { contentTypes } from "@/lib/content/content-labels";
import { contentFormats, contentGoals } from "@/lib/onboarding/constants";

export const generateIdeasFormSchema = z.object({
  theme: z.string().trim().max(80, "Use até 80 caracteres."),
  calendarDateId: z.string().nullable(),
  goal: z.enum(contentGoals),
  formats: z
    .array(z.enum(contentFormats))
    .min(1, "Escolha pelo menos um formato."),
  contentTypes: z
    .array(z.enum(contentTypes))
    .min(1, "Escolha pelo menos um tipo de conteúdo."),
  quantity: z
    .number({ error: "Diga quantas ideias você quer." })
    .int("Use um número inteiro.")
    .min(1, "Peça pelo menos 1 ideia.")
    .max(MAX_REQUESTED_IDEAS, `Peça até ${MAX_REQUESTED_IDEAS} ideias.`),
});

export type GenerateIdeasFormValues = z.infer<typeof generateIdeasFormSchema>;

export const scheduleIdeaFormSchema = z.object({
  day: z.string().min(1, "Escolha um dia."),
  time: z.string().min(1, "Escolha um horário."),
  preparation: z.string().min(1, "Escolha como preparar."),
});

export type ScheduleIdeaFormValues = z.infer<typeof scheduleIdeaFormSchema>;
