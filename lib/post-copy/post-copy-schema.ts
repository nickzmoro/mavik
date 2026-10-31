import { z } from "zod";

import { CAPTION_LIMIT } from "../caption/lint.ts";

const copyText = (maxLength: number) => z.string().trim().min(1).max(maxLength);

export const MAX_POST_COPY_TOPICS = 3;

export const postCopySchema = z.object({
  title: z.object({ regular: copyText(30), highlight: copyText(30) }),
  subtitle: copyText(90),
  topics: z
    .array(z.object({ title: copyText(30), sentence: copyText(110) }))
    .max(MAX_POST_COPY_TOPICS),
  cta: copyText(30),
  caption: copyText(CAPTION_LIMIT).optional(),
});

export type PostCopy = z.infer<typeof postCopySchema>;

export const postCopyFieldSchema = z.enum([
  "title",
  "subtitle",
  "topics",
  "cta",
  "caption",
]);

export type PostCopyField = z.infer<typeof postCopyFieldSchema>;
