import { z } from "zod";

import { ideaFormats, ideaGoals, ideaTypes } from "@/lib/mocks/ideas";

export const ideaQuantityOptions = [3, 6, 9] as const;

export const generateIdeasFormSchema = z.object({
  theme: z.string().trim().max(80, "Use até 80 caracteres."),
  goal: z.enum(ideaGoals),
  formats: z
    .array(z.enum(ideaFormats))
    .min(1, "Escolha pelo menos um formato."),
  types: z
    .array(z.enum(ideaTypes))
    .min(1, "Escolha pelo menos um tipo de conteúdo."),
  quantity: z.union([z.literal(3), z.literal(6), z.literal(9)]),
});

export type GenerateIdeasFormValues = z.infer<typeof generateIdeasFormSchema>;

export const scheduleIdeaFormSchema = z.object({
  day: z.string().min(1, "Escolha um dia."),
  time: z.string().min(1, "Escolha um horário."),
  preparation: z.string().min(1, "Escolha como preparar."),
});

export type ScheduleIdeaFormValues = z.infer<typeof scheduleIdeaFormSchema>;
