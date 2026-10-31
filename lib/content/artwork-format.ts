import type { ArtFormatId } from "../mocks/studio.ts";

export function getArtFormatIdFromSize(
  width: number,
  height: number,
): ArtFormatId {
  const ratio = height / width;

  if (ratio >= 1.6) {
    return "story";
  }

  return ratio >= 1.15 ? "portrait" : "square";
}
