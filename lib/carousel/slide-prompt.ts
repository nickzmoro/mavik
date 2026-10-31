import type { CarouselSlideCopy } from "./carousel-copy.ts";

type SlidePromptInput = {
  style: string;
  slide: CarouselSlideCopy;
  position: number;
  slideCount: number;
  handle?: string;
};

export function buildSlidePrompt({
  style,
  slide,
  position,
  slideCount,
  handle,
}: SlidePromptInput) {
  const slideNumber = `${position}/${slideCount}`;
  const texts = [
    ["headline", slide.headline],
    ["body", slide.body],
    ["slide number, small, bottom-left", slideNumber],
    ["store handle, small, bottom-right", handle ?? ""],
  ].filter(([, text]) => text);

  return [
    `CAROUSEL STYLE (identical on every slide):\n${style}`,
    `Slide ${slideNumber} of the same Instagram carousel as reference image 1 (the cover). Keep exactly the same background, typography, colors, margins and footer as the cover; change only the text and the illustration for this slide.`,
    "The slide must contain ONLY these texts, in Brazilian Portuguese, copied character by character exactly as written between the quotes. Do not rewrite, translate, shorten, correct or add any word:",
    ...texts.map(([role, text]) => `- ${role}: "${text}"`),
  ].join("\n");
}
