import { z } from "zod";

import {
  CAPTION_CLICHES,
  findMentionedTerms,
  humanizeCaption,
  lintCaption,
} from "../caption/lint.ts";
import { calendarEventKeys } from "./calendar-events.ts";
import type { IdeaSlot } from "./idea-slots.ts";

export const MAX_TITLE_LENGTH = 60;
const MAX_IDEA_HASHTAGS = 5;
const MAX_WHY_SENTENCES = 2;
const SIMILAR_TITLE_THRESHOLD = 0.6;

export const generatedIdeaSchema = z.object({
  slot: z.number().int(),
  title: z.string(),
  why: z.string(),
  how_to_use: z.string(),
  steps: z.array(z.string()),
  caption_example: z.string(),
  best_time: z.string(),
  audience: z.string().nullable(),
  calendar_event: z.enum(calendarEventKeys).nullable(),
});

export const generatedIdeasSchema = z.object({
  ideas: z.array(generatedIdeaSchema),
});

export type GeneratedIdea = z.infer<typeof generatedIdeaSchema>;

export type ValidatedIdea = {
  slot: IdeaSlot;
  title: string;
  why: string;
  howToUse: string;
  steps: string[];
  captionExample: string;
  bestTime: string;
  audience: string | null;
  calendarEvent: GeneratedIdea["calendar_event"];
};

const stopWords = new Set([
  "a",
  "as",
  "o",
  "os",
  "e",
  "de",
  "da",
  "do",
  "das",
  "dos",
  "que",
  "seu",
  "sua",
  "em",
  "no",
  "na",
  "um",
  "uma",
  "para",
  "pra",
  "com",
]);

const toTitleWords = (title: string) =>
  new Set(
    title
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter((word) => word && !stopWords.has(word)),
  );

const jaccard = (first: Set<string>, second: Set<string>) => {
  const shared = [...first].filter((word) => second.has(word)).length;
  const union = new Set([...first, ...second]).size;

  return union === 0 ? 0 : shared / union;
};

export function findSimilarTitle(title: string, titles: string[]) {
  const words = toTitleWords(title);

  return (
    titles.find(
      (otherTitle) =>
        jaccard(words, toTitleWords(otherTitle)) >= SIMILAR_TITLE_THRESHOLD,
    ) ?? null
  );
}

const countSentences = (text: string) =>
  text.split(/[.!?]+(?:\s|$)/).filter((sentence) => sentence.trim()).length;

const cleanIdea = (idea: GeneratedIdea) => ({
  title: humanizeCaption(idea.title),
  why: humanizeCaption(idea.why),
  howToUse: humanizeCaption(idea.how_to_use),
  steps: idea.steps.map(humanizeCaption).filter(Boolean),
  captionExample: humanizeCaption(idea.caption_example),
  bestTime: humanizeCaption(idea.best_time),
  audience: idea.audience ? humanizeCaption(idea.audience) : null,
  calendarEvent: idea.calendar_event,
});

type ValidateGeneratedIdeasInput = {
  slots: IdeaSlot[];
  generated: GeneratedIdea[];
  forbiddenTerms: string[];
  existingTitles: string[];
};

export function validateGeneratedIdeas({
  slots,
  generated,
  forbiddenTerms,
  existingTitles,
}: ValidateGeneratedIdeasInput) {
  const approved: ValidatedIdea[] = [];
  const rejected: Record<number, string[]> = {};

  for (const slot of slots) {
    const idea = generated.find((candidate) => candidate.slot === slot.slot);

    if (!idea) {
      rejected[slot.slot] = ["the idea for this slot is missing"];
      continue;
    }

    const cleaned = cleanIdea(idea);
    const allText = [
      cleaned.title,
      cleaned.why,
      cleaned.howToUse,
      ...cleaned.steps,
      cleaned.captionExample,
    ].join("\n");
    const titleCliches = findMentionedTerms(cleaned.title, CAPTION_CLICHES);
    const usedForbiddenTerms = findMentionedTerms(allText, forbiddenTerms);
    const similarTitle = findSimilarTitle(cleaned.title, [
      ...existingTitles,
      ...approved.map(({ title }) => title),
    ]);
    const issues = [
      !cleaned.title && "the title is empty",
      cleaned.title.length > MAX_TITLE_LENGTH &&
        `the title has ${cleaned.title.length} characters, the maximum is ${MAX_TITLE_LENGTH}`,
      titleCliches.length > 0 &&
        `the title uses a cliché: ${titleCliches.join(", ")}`,
      similarTitle && `the title is too similar to "${similarTitle}"`,
      countSentences(cleaned.why) > MAX_WHY_SENTENCES &&
        `why must have at most ${MAX_WHY_SENTENCES} sentences`,
      cleaned.steps.length === 0 && "steps is empty",
      ...lintCaption(cleaned.captionExample, {
        maxHashtags: MAX_IDEA_HASHTAGS,
      }).issues,
      usedForbiddenTerms.length > 0 &&
        `uses a forbidden term: ${usedForbiddenTerms.join(", ")}`,
    ].filter((issue): issue is string => Boolean(issue));

    if (issues.length > 0) {
      rejected[slot.slot] = issues;
      continue;
    }

    approved.push({ slot, ...cleaned });
  }

  return { approved, rejected };
}
