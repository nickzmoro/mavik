import sharp from "sharp";

import { findArtFormat } from "../art-options.ts";
import type { ArtFormatId } from "../mocks/studio.ts";
import { getFormatCrop } from "./format-geometry.ts";

export async function fitToFormat(image: Buffer, formatId: ArtFormatId) {
  const { outputSize } = findArtFormat(formatId);

  return sharp(image)
    .extract(getFormatCrop(formatId))
    .resize({ ...outputSize, fit: "fill" })
    .png()
    .toBuffer();
}
