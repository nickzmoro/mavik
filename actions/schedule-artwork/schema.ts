import { z } from "zod";

const missingArtworkMessage =
  "Não encontramos a arte para agendar. Gere de novo.";

export const approvedArtworkSchema = z.object({
  title: z.string().trim().min(1).max(120),
  prompt: z.string().trim().max(32000),
  caption: z
    .string()
    .trim()
    .max(2200, { error: "Use até 2.200 caracteres na legenda." }),
  format: z.enum(["post", "story"]),
  artworkId: z.uuid().optional(),
  contentId: z.uuid().optional(),
  imageDataUrl: z
    .string()
    .regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/, {
      error: missingArtworkMessage,
    })
    .max(6 * 1024 * 1024, { error: "A arte ficou grande demais." })
    .optional(),
});

export const hasArtwork = {
  check: (input: { artworkId?: string; imageDataUrl?: string }) =>
    Boolean(input.artworkId || input.imageDataUrl),
  options: { error: missingArtworkMessage, path: ["artworkId"] },
};

export const hasCaptionWhenPost = {
  check: (input: { format: "post" | "story"; caption: string }) =>
    input.format === "story" || input.caption.length > 0,
  options: { error: "Escreva a legenda do post.", path: ["caption"] },
};

export const scheduleArtworkSchema = approvedArtworkSchema
  .extend({
    scheduledAt: z.iso
      .datetime({ offset: true })
      .refine((value) => new Date(value).getTime() > Date.now(), {
        error: "Escolha um horário no futuro.",
      }),
  })
  .refine(hasArtwork.check, hasArtwork.options)
  .refine(hasCaptionWhenPost.check, hasCaptionWhenPost.options);

export type ScheduleArtworkInput = z.infer<typeof scheduleArtworkSchema>;
