import { z } from "zod";

import { artOptionsSchema } from "./art-options.ts";
import {
  postCopyFieldSchema,
  postCopySchema,
  type PostCopyField,
} from "./post-copy/post-copy-schema.ts";
import { generateArtFormSchema } from "./validations/generate-art.ts";

export const POST_DRAFT_STORAGE_KEY = "mavik:post-draft";

export const storedPostDraftSchema = artOptionsSchema.extend({
  prompt: generateArtFormSchema.shape.prompt,
  copy: postCopySchema.optional(),
  artFields: z.array(postCopyFieldSchema),
  isApproved: z.boolean(),
  attachmentCount: z.number().int().min(0).optional(),
});

export type StoredPostDraft = z.infer<typeof storedPostDraftSchema>;

export const defaultArtFields: PostCopyField[] = ["title", "cta"];

export function parsePostDraft(raw: string | null): StoredPostDraft | null {
  if (!raw) {
    return null;
  }

  try {
    const parsedDraft = storedPostDraftSchema.safeParse(JSON.parse(raw));

    return parsedDraft.success ? parsedDraft.data : null;
  } catch {
    return null;
  }
}
