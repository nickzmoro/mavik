import { z } from "zod";

import { studioPromptMaxLength } from "@/lib/mocks/studio";

export const studioPromptFormSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Descreva a arte que você quer.")
    .max(
      studioPromptMaxLength,
      `Use até ${studioPromptMaxLength} caracteres para descrever a arte.`,
    ),
});

export type StudioPromptFormValues = z.infer<typeof studioPromptFormSchema>;

export const guidedAnswerFormSchema = z.object({
  answer: z
    .string()
    .trim()
    .min(1, "Escreva ou escolha uma resposta.")
    .max(200, "Use até 200 caracteres na resposta."),
});

export type GuidedAnswerFormValues = z.infer<typeof guidedAnswerFormSchema>;

export const aiEditFormSchema = z.object({
  instruction: z
    .string()
    .trim()
    .min(1, "Diga o que você quer mudar.")
    .max(300, "Use até 300 caracteres no ajuste."),
});

export type AiEditFormValues = z.infer<typeof aiEditFormSchema>;

export const scheduleArtFormSchema = z.object({
  day: z.string().min(1, "Escolha um dia."),
  time: z.string().min(1, "Escolha um horário."),
  caption: z
    .string()
    .trim()
    .min(1, "Escreva a legenda do post.")
    .max(2200, "Use até 2.200 caracteres na legenda."),
});

export type ScheduleArtFormValues = z.infer<typeof scheduleArtFormSchema>;
