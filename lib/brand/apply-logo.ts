import "server-only";

import sharp from "sharp";

import { findArtFormat } from "@/lib/art-options";
import {
  getLogoMaxSize,
  getLogoPlacement,
  getSafeArea,
} from "@/lib/images/format-geometry";
import type { ArtFormatId } from "@/lib/mocks/studio";

import type { BrandContext } from "./get-brand-context";
import { downloadBrandAsset } from "./get-brand-context";

const LIGHT_BACKGROUND_LUMINANCE = 128;

type LogoKind = BrandContext["logos"][number]["kind"];

export async function getBackgroundLuminance(
  imageBytes: Buffer,
  area: { left: number; top: number; width: number; height: number },
) {
  const pixels = await sharp(imageBytes)
    .extract(area)
    .removeAlpha()
    .raw()
    .toBuffer();
  let luminanceSum = 0;

  for (let offset = 0; offset < pixels.length; offset += 3) {
    luminanceSum +=
      0.2126 * pixels[offset] +
      0.7152 * pixels[offset + 1] +
      0.0722 * pixels[offset + 2];
  }

  return luminanceSum / (pixels.length / 3);
}

export function pickLogoKind(backgroundLuminance: number): LogoKind {
  return backgroundLuminance >= LIGHT_BACKGROUND_LUMINANCE
    ? "logo_claro"
    : "logo_escuro";
}

async function resizeLogo(
  storagePath: string,
  maxWidth: number,
  maxHeight: number,
) {
  const bytes = await sharp(await downloadBrandAsset(storagePath), {
    density: 300,
  })
    .resize({ width: maxWidth, height: maxHeight, fit: "inside" })
    .png()
    .toBuffer();
  const { width = maxWidth, height = maxHeight } =
    await sharp(bytes).metadata();

  return { bytes, width, height };
}

export async function applyLogo(
  imageBytes: Buffer,
  logos: BrandContext["logos"],
  formatId: ArtFormatId,
) {
  if (logos.length === 0) {
    return imageBytes;
  }

  const { width = 1024 } = await sharp(imageBytes).metadata();
  const scale = width / findArtFormat(formatId).generationSize.width;
  const scaleBox = <TBox extends Record<string, number>>(box: TBox) =>
    Object.fromEntries(
      Object.entries(box).map(([key, value]) => [
        key,
        Math.round(value * scale),
      ]),
    ) as TBox;
  const safeArea = scaleBox(getSafeArea(formatId));
  const { width: maxLogoWidth, height: maxLogoHeight } = scaleBox(
    getLogoMaxSize(formatId),
  );
  const findLogo = (kind: LogoKind) => logos.find((logo) => logo.kind === kind);

  const measuredLogo = await resizeLogo(
    (findLogo("logo_claro") ?? logos[0]).storagePath,
    maxLogoWidth,
    maxLogoHeight,
  );
  const placement = getLogoPlacement(safeArea, measuredLogo);
  const backgroundLuminance = await getBackgroundLuminance(imageBytes, {
    ...placement,
    width: measuredLogo.width,
    height: measuredLogo.height,
  });
  const chosenKind = pickLogoKind(backgroundLuminance);
  const chosenLogo = findLogo(chosenKind);
  const logo =
    chosenLogo && chosenKind !== "logo_claro"
      ? await resizeLogo(chosenLogo.storagePath, maxLogoWidth, maxLogoHeight)
      : measuredLogo;

  return sharp(imageBytes)
    .composite([{ input: logo.bytes, ...getLogoPlacement(safeArea, logo) }])
    .png()
    .toBuffer();
}

const EXAMPLE_LOGO_AREA = { left: 0.55, top: 0.78 };

// shortcut: assumes the logo sits in the bottom-right of example posts, detect it if clients place it elsewhere
export async function hideLogoArea(imageBytes: Buffer) {
  const { width = 1024, height = 1024 } = await sharp(imageBytes).metadata();
  const left = Math.round(width * EXAMPLE_LOGO_AREA.left);
  const top = Math.round(height * EXAMPLE_LOGO_AREA.top);
  const blurredCorner = await sharp(imageBytes)
    .extract({ left, top, width: width - left, height: height - top })
    .blur(40)
    .png()
    .toBuffer();

  return sharp(imageBytes)
    .composite([{ input: blurredCorner, left, top }])
    .png()
    .toBuffer();
}
