import { z } from "zod";

export const REFERENCE_IMAGE_MAX_BYTES = 4 * 1024 * 1024;
export const REFERENCE_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const PROMPT_MAX_LENGTH = 32000;

const promptSchema = z
  .string()
  .trim()
  .min(10, { error: "Conte um pouco mais sobre a arte que você quer." })
  .max(PROMPT_MAX_LENGTH, {
    error: `Use até ${PROMPT_MAX_LENGTH} caracteres.`,
  });

export const generateImageFormSchema = z.object({
  prompt: promptSchema,
  referenceImage: z
    .instanceof(File)
    .refine((file) => REFERENCE_IMAGE_TYPES.includes(file.type), {
      error: "Envie uma foto em PNG, JPG ou WEBP.",
    })
    .refine((file) => file.size <= REFERENCE_IMAGE_MAX_BYTES, {
      error: "A foto pode ter até 4 MB. Envie uma versão menor.",
    })
    .optional(),
});

export const generateImageSchema = z
  .object({
    prompt: promptSchema,
    referenceImage: z
      .string()
      .regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/, {
        error: "Envie uma foto em PNG, JPG ou WEBP.",
      })
      .max(Math.ceil((REFERENCE_IMAGE_MAX_BYTES * 4) / 3) + 64, {
        error: "A foto pode ter até 4 MB. Envie uma versão menor.",
      })
      .optional(),
    editInstruction: z
      .string()
      .trim()
      .min(1, { error: "Diga o que você quer mudar." })
      .max(300, { error: "Use até 300 caracteres no ajuste." })
      .optional(),
  })
  .refine((input) => !input.editInstruction || input.referenceImage, {
    error: "Não encontramos a arte para ajustar. Gere de novo.",
    path: ["referenceImage"],
  });

export type GenerateImageFormValues = z.infer<typeof generateImageFormSchema>;
export type GenerateImageInput = z.infer<typeof generateImageSchema>;
export type GenerateImageResult = { imageUrl: string; artworkId?: string };
