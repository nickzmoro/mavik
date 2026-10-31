import { z } from "zod";

import type { PostCopy, PostCopyField } from "./post-copy-schema.ts";

export const approvedCopyEntrySchema = z.object({
  role: z.enum([
    "headline",
    "headline-highlight",
    "subtitle",
    "topic-title",
    "topic-text",
    "cta",
  ]),
  text: z.string().min(1).max(120),
});

export type ApprovedCopyEntry = z.infer<typeof approvedCopyEntrySchema>;

export function toApprovedCopyEntries(
  copy: PostCopy,
  artFields: PostCopyField[],
): ApprovedCopyEntry[] {
  const isInArt = (field: PostCopyField) => artFields.includes(field);

  return [
    ...(isInArt("title")
      ? [
          { role: "headline" as const, text: copy.title.regular },
          { role: "headline-highlight" as const, text: copy.title.highlight },
        ]
      : []),
    ...(isInArt("subtitle")
      ? [{ role: "subtitle" as const, text: copy.subtitle }]
      : []),
    ...(isInArt("topics")
      ? copy.topics.flatMap((topic) => [
          { role: "topic-title" as const, text: topic.title },
          { role: "topic-text" as const, text: topic.sentence },
        ])
      : []),
    ...(isInArt("cta") ? [{ role: "cta" as const, text: copy.cta }] : []),
  ];
}

export function buildApprovedCopyInstruction(entries: ApprovedCopyEntry[]) {
  if (entries.length === 0) {
    return "";
  }

  return [
    "The post must contain ONLY these texts, in Brazilian Portuguese, copied character by character exactly as written between the quotes. Do not rewrite, translate, shorten, correct or add any word, and add no other text:",
    ...entries.map(({ role, text }) => `- ${role}: "${text}"`),
  ].join("\n");
}

export const replaceHeadlineRule = (
  instructions: string,
  headlineRule: string,
  replacement: string,
) => instructions.replace(headlineRule, () => replacement);
