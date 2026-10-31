import { findMentionedTerms, lintCaption } from "../caption/lint.ts";
import {
  postCopyFieldSchema,
  type PostCopy,
  type PostCopyField,
} from "./post-copy-schema.ts";

export const MAX_CAPTION_HASHTAGS = 5;

type PostCopyIssuesOptions = {
  forbiddenTerms: string[];
  isStory: boolean;
};

export const findPlaceholders = (text: string) =>
  text.match(/\{\{[^{}]+\}\}/g) ?? [];

const getFieldTexts = (copy: PostCopy, field: PostCopyField) => {
  switch (field) {
    case "title":
      return [copy.title.regular, copy.title.highlight];
    case "topics":
      return copy.topics.flatMap((topic) => [topic.title, topic.sentence]);
    case "caption":
      return copy.caption ? [copy.caption] : [];
    default:
      return [copy[field]];
  }
};

export function getBlockingPlaceholders(
  copy: PostCopy,
  artFields: PostCopyField[],
  isStory: boolean,
) {
  const blockingFields: PostCopyField[] = isStory
    ? artFields
    : [...artFields, "caption"];

  return postCopyFieldSchema.options
    .filter((field) => blockingFields.includes(field))
    .flatMap((field) =>
      getFieldTexts(copy, field)
        .flatMap(findPlaceholders)
        .map((placeholder) => ({ field, placeholder })),
    );
}

export const getPostCopyTexts = (copy: PostCopy) =>
  postCopyFieldSchema.options.flatMap((field) => getFieldTexts(copy, field));

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
