import { findMentionedTerms, lintCaption } from "../caption/lint.ts";
import type { PostCopy } from "./post-copy-schema.ts";

export const MAX_CAPTION_HASHTAGS = 5;

type PostCopyIssuesOptions = {
  forbiddenTerms: string[];
  isStory: boolean;
};

export const findPlaceholders = (text: string) =>
  text.match(/\{\{[^{}]+\}\}/g) ?? [];

export const getPostCopyTexts = (copy: PostCopy) => [
  copy.title.regular,
  copy.title.highlight,
  copy.subtitle,
  ...copy.topics.flatMap((topic) => [topic.title, topic.sentence]),
  copy.cta,
  ...(copy.caption ? [copy.caption] : []),
];

function getCaptionIssues(caption: string | undefined, isStory: boolean) {
  if (isStory) {
    return [];
  }

  return caption
    ? lintCaption(caption, { maxHashtags: MAX_CAPTION_HASHTAGS }).issues
    : ["Falta a legenda."];
}

export function getPostCopyIssues(
  copy: PostCopy,
  { forbiddenTerms, isStory }: PostCopyIssuesOptions,
) {
  const usedForbiddenTerms = findMentionedTerms(
    getPostCopyTexts(copy).join("\n"),
    forbiddenTerms,
  );

  return [
    ...getCaptionIssues(copy.caption, isStory),
    ...(usedForbiddenTerms.length > 0
      ? [`Termos proibidos usados: ${usedForbiddenTerms.join(", ")}.`]
      : []),
  ];
}
