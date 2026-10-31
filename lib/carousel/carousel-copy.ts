import { z } from "zod";

import {
  CAPTION_LIMIT,
  findMentionedTerms,
  lintCaption,
} from "../caption/lint.ts";

export const MIN_CAROUSEL_SLIDES = 3;
export const MAX_CAROUSEL_SLIDES = 10;
export const DEFAULT_CAROUSEL_SLIDES = 6;
const MAX_COVER_WORDS = 6;
const MAX_HEADLINE_WORDS = 7;
const MAX_BODY_WORDS = 25;
const RECAP_FROM_SLIDES = 6;
const MAX_CAPTION_HASHTAGS = 5;

export const carouselSlideRoleSchema = z.enum([
  "cover",
  "stake",
  "idea",
  "recap",
  "cta",
]);

export const carouselSlideCopySchema = z.object({
  role: carouselSlideRoleSchema,
  headline: z.string().trim().min(1).max(60),
  body: z.string().trim().max(180),
});

export const carouselCopySchema = z.object({
  slides: z
    .array(carouselSlideCopySchema)
    .min(MIN_CAROUSEL_SLIDES)
    .max(MAX_CAROUSEL_SLIDES),
  caption: z.string().trim().min(1).max(CAPTION_LIMIT),
});

export type CarouselSlideCopy = z.infer<typeof carouselSlideCopySchema>;
export type CarouselCopy = z.infer<typeof carouselCopySchema>;

type CarouselCopyIssuesOptions = {
  forbiddenTerms: string[];
  slideCount: number;
};

const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;

const wordLimitIssue = (label: string, text: string, maxWords: number) => {
  const words = countWords(text);

  return words > maxWords
    ? [`${label} tem ${words} palavras; use até ${maxWords}.`]
    : [];
};

export function getCarouselCopyIssues(
  { slides, caption }: CarouselCopy,
  { forbiddenTerms, slideCount }: CarouselCopyIssuesOptions,
) {
  const roles = slides.map(({ role }) => role);
  const ctaCount = roles.filter((role) => role === "cta").length;
  const usedForbiddenTerms = findMentionedTerms(
    slides.flatMap(({ headline, body }) => [headline, body]).join("\n"),
    forbiddenTerms,
  );

  return [
    ...(slides.length !== slideCount
      ? [
          `O carrossel tem ${slides.length} slides, mas foram pedidos ${slideCount}.`,
        ]
      : []),
    ...(roles[0] !== "cover" ? ["O primeiro slide precisa ser a capa."] : []),
    ...(roles.at(-1) !== "cta" ? ["O último slide precisa ser o CTA."] : []),
    ...(ctaCount > 1 ? ["Use um único CTA, no último slide."] : []),
    ...(slides.length >= RECAP_FROM_SLIDES && !roles.includes("recap")
      ? ["Com 6 ou mais slides, inclua um slide de resumo antes do CTA."]
      : []),
    ...slides.flatMap(({ role, headline, body }, index) => [
      ...(role === "cover"
        ? wordLimitIssue("A capa", headline, MAX_COVER_WORDS)
        : wordLimitIssue(
            `O título do slide ${index + 1}`,
            headline,
            MAX_HEADLINE_WORDS,
          )),
      ...wordLimitIssue(`O texto do slide ${index + 1}`, body, MAX_BODY_WORDS),
    ]),
    ...lintCaption(caption, { maxHashtags: MAX_CAPTION_HASHTAGS }).issues,
    ...(usedForbiddenTerms.length > 0
      ? [`Termos proibidos usados: ${usedForbiddenTerms.join(", ")}.`]
      : []),
  ];
}
