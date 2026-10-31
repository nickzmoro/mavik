import { artFormats, type ArtFormatId } from "../mocks/studio.ts";

const ratioDistance = (
  width: number,
  height: number,
  size: { width: number; height: number },
) => Math.abs(Math.log(width / height) - Math.log(size.width / size.height));

export function getArtFormatIdFromSize(
  width: number,
  height: number,
): ArtFormatId {
  return artFormats.reduce((closest, format) =>
    ratioDistance(width, height, format.outputSize) <
    ratioDistance(width, height, closest.outputSize)
      ? format
      : closest,
  ).id;
}
