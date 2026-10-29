import {
  getLuminanceContrast,
  getRgbLuminance,
} from "@/lib/color-contrast";

import { LOGO_MIME_TYPES, LOGO_MIN_SIDE_PX } from "./constants";

export type CheckStatus = "ok" | "aviso" | "erro";

export const logoCheckLabels = {
  format: "Formato",
  resolution: "Resolução",
  background: "Fundo",
  margins: "Margens e proporção",
  contrast: "Contraste",
  approval: "Aprovação",
} as const;

export const logoCheckHints: Record<string, string> = {
  [logoCheckLabels.format]: "Use SVG, PNG ou WebP.",
  [logoCheckLabels.resolution]: `Resolução baixa: o ideal é ${LOGO_MIN_SIDE_PX} px ou mais no maior lado.`,
  [logoCheckLabels.background]:
    "A logo tem fundo sólido: prefira um arquivo com fundo transparente.",
  [logoCheckLabels.margins]:
    "A logo está colada nas bordas, com muito respiro ou numa proporção fora do padrão.",
  [logoCheckLabels.contrast]:
    "Pouco contraste com o fundo em que esta versão será usada.",
};

export type LogoKind = "logo_claro" | "logo_escuro" | "simbolo";

export type LogoAnalysis = {
  width: number;
  height: number;
  checks: Record<string, CheckStatus>;
};

const MAX_ANALYSIS_SIDE = 1024;
const SVG_FALLBACK_SIDE = 1000;
const OPAQUE_ALPHA = 24;
const MIN_PADDING_RATIO = 0.02;
const MAX_PADDING_RATIO = 0.3;
const MAX_ASPECT_RATIO = 6;
const MIN_CONTRAST = 3;
const LIGHT_BACKGROUND_LUMINANCE = 1;
const DARK_BACKGROUND_LUMINANCE = 0.006;

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Imagem inválida"));
    };
    image.src = objectUrl;
  });

const getResolutionStatus = (longestSide: number, isVector: boolean) => {
  if (isVector || longestSide >= LOGO_MIN_SIDE_PX) {
    return "ok";
  }

  return longestSide >= LOGO_MIN_SIDE_PX / 2 ? "aviso" : "erro";
};

const getContrastStatus = (shareWithContrast: number) =>
  shareWithContrast >= 0.6 ? "ok" : shareWithContrast >= 0.3 ? "aviso" : "erro";

function getTargetLuminances(kind: LogoKind) {
  if (kind === "logo_claro") {
    return [LIGHT_BACKGROUND_LUMINANCE];
  }

  return kind === "logo_escuro"
    ? [DARK_BACKGROUND_LUMINANCE]
    : [LIGHT_BACKGROUND_LUMINANCE, DARK_BACKGROUND_LUMINANCE];
}

function readPixels(image: HTMLImageElement) {
  const naturalWidth = image.naturalWidth || SVG_FALLBACK_SIDE;
  const naturalHeight = image.naturalHeight || SVG_FALLBACK_SIDE;
  const scale = Math.min(
    1,
    MAX_ANALYSIS_SIDE / Math.max(naturalWidth, naturalHeight),
  );
  const width = Math.max(1, Math.round(naturalWidth * scale));
  const height = Math.max(1, Math.round(naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return null;
  }

  context.drawImage(image, 0, 0, width, height);

  return {
    naturalWidth,
    naturalHeight,
    width,
    height,
    data: context.getImageData(0, 0, width, height).data,
  };
}

export async function analyzeLogo(
  file: File,
  kind: LogoKind,
): Promise<LogoAnalysis> {
  const isVector = file.type === "image/svg+xml";
  const formatStatus: CheckStatus = LOGO_MIME_TYPES.includes(file.type)
    ? "ok"
    : "erro";
  const image = await loadImage(file).catch(() => null);
  const pixels = image ? readPixels(image) : null;

  if (!image || !pixels) {
    return {
      width: 0,
      height: 0,
      checks: {
        [logoCheckLabels.format]: formatStatus,
        [logoCheckLabels.approval]: "erro",
      },
    };
  }

  const { naturalWidth, naturalHeight, width, height, data } = pixels;
  const alphaAt = (x: number, y: number) => data[(y * width + x) * 4 + 3];

  const cornerSize = Math.max(1, Math.round(Math.min(width, height) * 0.02));
  const corners = [
    [0, 0],
    [width - cornerSize, 0],
    [0, height - cornerSize],
    [width - cornerSize, height - cornerSize],
  ];
  const hasTransparentBackground = corners.every(
    ([cornerX, cornerY]) => alphaAt(cornerX, cornerY) < OPAQUE_ALPHA,
  );

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let sampledPixels = 0;
  let pixelsWithContrast = 0;
  const targetLuminances = getTargetLuminances(kind);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;

      if (data[offset + 3] < OPAQUE_ALPHA) {
        continue;
      }

      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      sampledPixels += 1;

      const pixelLuminance = getRgbLuminance(
        data[offset],
        data[offset + 1],
        data[offset + 2],
      );

      if (
        targetLuminances.some(
          (targetLuminance) =>
            getLuminanceContrast(pixelLuminance, targetLuminance) >=
            MIN_CONTRAST,
        )
      ) {
        pixelsWithContrast += 1;
      }
    }
  }

  if (sampledPixels === 0) {
    return {
      width: naturalWidth,
      height: naturalHeight,
      checks: {
        [logoCheckLabels.format]: formatStatus,
        [logoCheckLabels.approval]: "erro",
      },
    };
  }

  const contentWidth = maxX - minX + 1;
  const contentHeight = maxY - minY + 1;
  const paddingRatios = [
    minX / width,
    minY / height,
    (width - 1 - maxX) / width,
    (height - 1 - maxY) / height,
  ];
  const aspectRatio = contentWidth / contentHeight;
  const isSymbol = kind === "simbolo";
  const hasValidAspect = isSymbol
    ? aspectRatio >= 0.7 && aspectRatio <= 1.4
    : aspectRatio <= MAX_ASPECT_RATIO && aspectRatio >= 1 / MAX_ASPECT_RATIO;
  const hasValidPadding = paddingRatios.every(
    (ratio) => ratio >= MIN_PADDING_RATIO && ratio <= MAX_PADDING_RATIO,
  );

  const checks: Record<string, CheckStatus> = {
    [logoCheckLabels.format]: formatStatus,
    [logoCheckLabels.resolution]: getResolutionStatus(
      Math.max(naturalWidth, naturalHeight),
      isVector,
    ),
    [logoCheckLabels.background]: hasTransparentBackground ? "ok" : "aviso",
    [logoCheckLabels.margins]:
      hasValidAspect && hasValidPadding ? "ok" : "aviso",
    [logoCheckLabels.contrast]: getContrastStatus(
      pixelsWithContrast / sampledPixels,
    ),
  };
  const statuses = Object.values(checks);

  checks[logoCheckLabels.approval] = statuses.includes("erro")
    ? "erro"
    : statuses.includes("aviso")
      ? "aviso"
      : "ok";

  return { width: naturalWidth, height: naturalHeight, checks };
}
