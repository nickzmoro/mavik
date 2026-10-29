import { z } from "zod";

export const scheduleArtworkSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    prompt: z.string().trim().max(32000),
    caption: z
      .string()
      .trim()
      .min(1, { error: "Escreva a legenda do post." })
      .max(2200, { error: "Use até 2.200 caracteres na legenda." }),
    format: z.enum(["post", "story"]),
    scheduledAt: z.iso
      .datetime({ offset: true })
      .refine((value) => new Date(value).getTime() > Date.now(), {
        error: "Escolha um horário no futuro.",
      }),
    artworkId: z.uuid().optional(),
    contentId: z.uuid().optional(),
    imageDataUrl: z
      .string()
      .regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/, {
        error: "Não encontramos a arte para agendar. Gere de novo.",
      })
      .max(6 * 1024 * 1024, { error: "A arte ficou grande demais." })
      .optional(),
  })
  .refine((input) => input.artworkId || input.imageDataUrl, {
    error: "Não encontramos a arte para agendar. Gere de novo.",
    path: ["artworkId"],
  });

export type ScheduleArtworkInput = z.infer<typeof scheduleArtworkSchema>;
