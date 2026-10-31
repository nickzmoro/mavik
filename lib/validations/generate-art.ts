import { z } from "zod";

export const generateArtFormSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Descreva a ideia do post para gerar a arte.")
    .max(1500, "Use até 1.500 caracteres para descrever a ideia."),
});

export type GenerateArtFormValues = z.infer<typeof generateArtFormSchema>;
