import "server-only";

import sharp from "sharp";

import type { BrandContext } from "./get-brand-context";
import { downloadBrandAsset } from "./get-brand-context";
import { contrastScore } from "./logo-image";
import {
  defaultLogoPlacement,
  getLogoOffset,
  type LogoPlacement,
} from "./logo-placement";

const LOGO_MAX_WIDTH_RATIO = 0.3;
const LOGO_MAX_HEIGHT_RATIO = 0.12;
const MARGIN_RATIO = 0.05;

type ResizedLogo = Awaited<ReturnType<typeof resizeLogo>>;

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
  placement: LogoPlacement = defaultLogoPlacement,
) {
  const symbol =
    placement.variant === "simbolo"
      ? logos.find((logo) => logo.kind === "simbolo")
      : null;
  const fullLogos = ["logo_claro", "logo_escuro"].flatMap((kind) => {
    const logo = logos.find((candidate) => candidate.kind === kind);

    return logo ? [logo] : [];
  });

  if (!symbol && fullLogos.length === 0) {
    return imageBytes;
  }

  const { width = 1024, height = 1024 } = await sharp(imageBytes).metadata();
  const maxLogoWidth = Math.round(width * LOGO_MAX_WIDTH_RATIO);
  const maxLogoHeight = Math.round(height * LOGO_MAX_HEIGHT_RATIO);
  const margin = Math.round(width * MARGIN_RATIO);
  const placeLogo = (logo: { width: number; height: number }) =>
    getLogoOffset({
      imageWidth: width,
      imageHeight: height,
      logoWidth: logo.width,
      logoHeight: logo.height,
      margin,
      position: placement.position,
    });

  const contrastWithBackground = async (logo: ResizedLogo) => {
    const area = { ...placeLogo(logo), width: logo.width, height: logo.height };
    const [logoPixels, backgroundPixels] = await Promise.all([
      sharp(logo.bytes).ensureAlpha().raw().toBuffer(),
      sharp(imageBytes).extract(area).removeAlpha().raw().toBuffer(),
    ]);

    return contrastScore(logoPixels, backgroundPixels);
  };

  const resizedLogo = async () => {
    if (symbol) {
      return resizeLogo(symbol.storagePath, maxLogoWidth, maxLogoHeight);
    }

    const candidates = await Promise.all(
      fullLogos.map((logo) =>
        resizeLogo(logo.storagePath, maxLogoWidth, maxLogoHeight),
      ),
    );
    const scores = await Promise.all(candidates.map(contrastWithBackground));

    return candidates[scores.indexOf(Math.max(...scores))];
  };

  const logo = await resizedLogo();

  return sharp(imageBytes)
    .composite([{ input: logo.bytes, ...placeLogo(logo) }])
    .png()
    .toBuffer();
}
