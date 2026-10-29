import { z } from "zod";

export const generatePostCaptionSchema = z.object({
  prompt: z.string().trim().max(32000),
  imageDataUrl: z
    .string()
    .regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/)
    .max(2 * 1024 * 1024)
    .optional(),
  previousCaption: z.string().trim().max(2200).optional(),
});

export type GeneratePostCaptionInput = z.infer<
  typeof generatePostCaptionSchema
>;
