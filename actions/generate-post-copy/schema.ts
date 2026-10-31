import { z } from "zod";

import { artFormatIdSchema } from "@/lib/art-options";
import {
  postCopyFieldSchema,
  postCopySchema,
  type PostCopy,
} from "@/lib/post-copy/post-copy-schema";
import { generateArtFormSchema } from "@/lib/validations/generate-art";

export const generatePostCopySchema = z.object({
  prompt: generateArtFormSchema.shape.prompt,
  formatId: artFormatIdSchema,
  field: postCopyFieldSchema.optional(),
  currentCopy: postCopySchema.optional(),
});

export type GeneratePostCopyInput = z.infer<typeof generatePostCopySchema>;

export type GeneratedPostCopy = { copy: PostCopy };
