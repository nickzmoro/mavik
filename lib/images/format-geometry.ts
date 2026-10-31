import { findArtFormat } from "../art-options.ts";
import type { ArtFormatId } from "../mocks/studio.ts";

export type Box = { left: number; top: number; width: number; height: number };

type Size = { width: number; height: number };

const BANNER_SAFE_INSET_RATIO = 0.06;
const BANNER_LOGO_MAX_RATIO = { width: 0.18, height: 0.3 };
const POST_LOGO_MAX_RATIO = { width: 0.3, height: 0.12 };
const LOGO_MARGIN_RATIO = 0.05;

const centerIn = (outer: Box, size: Size): Box => ({
  left: outer.left + Math.round((outer.width - size.width) / 2),
  top: outer.top + Math.round((outer.height - size.height) / 2),
  ...size,
});

export function getFormatCrop(formatId: ArtFormatId): Box {
  const { generationSize, outputSize } = findArtFormat(formatId);
  const frame = { left: 0, top: 0, ...generationSize };
  const outputRatio = outputSize.width / outputSize.height;
  const generationRatio = generationSize.width / generationSize.height;

  return centerIn(
    frame,
    outputRatio >= generationRatio
      ? {
          width: generationSize.width,
          height: Math.round(generationSize.width / outputRatio),
        }
      : {
          width: Math.round(generationSize.height * outputRatio),
          height: generationSize.height,
        },
  );
}

export function getSafeArea(formatId: ArtFormatId): Box {
  const { kind, outputSize, safeAreaSize } = findArtFormat(formatId);
  const crop = getFormatCrop(formatId);

  if (kind !== "banner") {
    return crop;
  }

  if (safeAreaSize) {
    const scale = crop.width / outputSize.width;

    return centerIn(crop, {
      width: Math.round(safeAreaSize.width * scale),
      height: Math.round(safeAreaSize.height * scale),
    });
  }

  return centerIn(crop, {
    width: Math.round(crop.width * (1 - 2 * BANNER_SAFE_INSET_RATIO)),
    height: Math.round(crop.height * (1 - 2 * BANNER_SAFE_INSET_RATIO)),
  });
}

export function getLogoMaxSize(formatId: ArtFormatId): Size {
  const { kind, generationSize } = findArtFormat(formatId);

  if (kind === "banner") {
    const safeArea = getSafeArea(formatId);

    return {
      width: Math.round(safeArea.width * BANNER_LOGO_MAX_RATIO.width),
      height: Math.round(safeArea.height * BANNER_LOGO_MAX_RATIO.height),
    };
  }

  return {
    width: Math.round(generationSize.width * POST_LOGO_MAX_RATIO.width),
    height: Math.round(generationSize.height * POST_LOGO_MAX_RATIO.height),
  };
}

export function getLogoPlacement(
  safeArea: Box,
  logo: Size,
  marginRatio = LOGO_MARGIN_RATIO,
) {
  const margin = Math.round(safeArea.width * marginRatio);

  return {
    left: safeArea.left + safeArea.width - logo.width - margin,
    top: safeArea.top + safeArea.height - logo.height - margin,
  };
}
