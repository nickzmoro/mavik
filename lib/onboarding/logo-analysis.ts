import {
  contrastRatio,
  hexToRgb,
  mixColors,
  rgbToHex,
  saturation,
} from "@/lib/color";

import { LOGO_MIME_TYPES, LOGO_MIN_SIDE_PX, type ColorRole } from "./constants";

export const logoCheckLabels = {
  formato: "Formato",
  resolucao: "Resolução",
  fundo: "Fundo",
  margens: "Margens e proporção",
  contraste: "Contraste",
} as const;

export type LogoCheckId = keyof typeof logoCheckLabels;
export type LogoCheckStatus = "ok" | "aviso" | "erro";
export type LogoBackground = "claro" | "escuro";

export type LogoAnalysis = {
  width: number;
  height: number;
  checks: Record<LogoCheckId, LogoCheckStatus>;
  messages: Partial<Record<LogoCheckId, string>>;
  dominantColors: string[];
};

const backgroundHex: Record<LogoBackground, string> = {
  claro: "#FFFFFF",
  escuro: "#1B1530",
};

const ANALYSIS_SIZE = 256;
const OPAQUE_ALPHA = 250;
const VISIBLE_ALPHA = 16;

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Não conseguimos abrir essa imagem."));
    };
    image.src = objectUrl;
  });
}

function getImageSize(image: HTMLImageElement, isSvg: boolean) {
  const width = image.naturalWidth || (isSvg ? LOGO_MIN_SIDE_PX : 0);
  const height = image.naturalHeight || (isSvg ? LOGO_MIN_SIDE_PX : 0);

  return { width, height };
}

function drawToCanvas(image: HTMLImageElement, width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    throw new Error("Seu navegador não permite analisar a imagem.");
  }

  context.drawImage(image, 0, 0, width, height);

  return { canvas, context };
}

export async function analyzeLogo(
  file: File,
  background: LogoBackground,
): Promise<LogoAnalysis> {
  const isSvg = file.type === "image/svg+xml";
  const checks: LogoAnalysis["checks"] = {
    formato: LOGO_MIME_TYPES.includes(file.type) ? "ok" : "erro",
    resolucao: "ok",
    fundo: "ok",
    margens: "ok",
    contraste: "ok",
  };
  const messages: LogoAnalysis["messages"] = {};

  if (checks.formato === "erro") {
    messages.formato = "Formato não suportado. Envie SVG ou PNG.";
    return { width: 0, height: 0, checks, messages, dominantColors: [] };
  }

  const image = await loadImage(file);
  const { width, height } = getImageSize(image, isSvg);

  if (!isSvg && Math.max(width, height) < LOGO_MIN_SIDE_PX) {
    checks.resolucao = "erro";
    messages.resolucao =
      "Logo pequena. Envie uma versão maior para manter a nitidez.";
  }

  const scale = ANALYSIS_SIZE / Math.max(width, height, 1);
  const canvasWidth = Math.max(1, Math.round(width * scale));
  const canvasHeight = Math.max(1, Math.round(height * scale));
  const { context } = drawToCanvas(image, canvasWidth, canvasHeight);
  const { data: pixels } = context.getImageData(
    0,
    0,
    canvasWidth,
    canvasHeight,
  );

  let borderPixels = 0;
  let opaqueBorderPixels = 0;
  let minX = canvasWidth;
  let minY = canvasHeight;
  let maxX = -1;
  let maxY = -1;
  let totalWeight = 0;
  const colorSum = [0, 0, 0];
  const colorBuckets = new Map<string, number>();

  for (let y = 0; y < canvasHeight; y += 1) {
    for (let x = 0; x < canvasWidth; x += 1) {
      const offset = (y * canvasWidth + x) * 4;
      const alpha = pixels[offset + 3];
      const isBorder =
        x === 0 || y === 0 || x === canvasWidth - 1 || y === canvasHeight - 1;

      if (isBorder) {
        borderPixels += 1;
        opaqueBorderPixels += alpha >= OPAQUE_ALPHA ? 1 : 0;
      }

      if (alpha < VISIBLE_ALPHA) {
        continue;
      }

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);

      const weight = alpha / 255;
      totalWeight += weight;
      colorSum[0] += pixels[offset] * weight;
      colorSum[1] += pixels[offset + 1] * weight;
      colorSum[2] += pixels[offset + 2] * weight;

      const bucket = rgbToHex(
        [
          Math.round(pixels[offset] / 32) * 32,
          Math.round(pixels[offset + 1] / 32) * 32,
          Math.round(pixels[offset + 2] / 32) * 32,
        ].map((channel) => Math.min(channel, 255)) as [number, number, number],
      );
      colorBuckets.set(bucket, (colorBuckets.get(bucket) ?? 0) + 1);
    }
  }

  if (borderPixels > 0 && opaqueBorderPixels / borderPixels > 0.9) {
    checks.fundo = "erro";
    messages.fundo = "Essa logo tem fundo. Envie uma versão transparente.";
  }

  if (maxX >= 0) {
    const horizontalSpare = 1 - (maxX - minX + 1) / canvasWidth;
    const verticalSpare = 1 - (maxY - minY + 1) / canvasHeight;

    if (
      checks.fundo === "ok" &&
      (horizontalSpare > 0.3 || verticalSpare > 0.3)
    ) {
      checks.margens = "aviso";
      messages.margens =
        "Tem bastante espaço vazio em volta. Recorte as sobras para a logo aparecer maior.";
    }
  }

  if (totalWeight > 0 && checks.fundo === "ok") {
    const averageHex = rgbToHex(
      colorSum.map((channel) => channel / totalWeight) as [
        number,
        number,
        number,
      ],
    );

    if (contrastRatio(averageHex, backgroundHex[background]) < 3) {
      checks.contraste = "aviso";
      messages.contraste =
        background === "escuro"
          ? "Pouco contraste no fundo escuro. Quer usar uma versão branca?"
          : "Pouco contraste no fundo claro. Envie uma versão mais escura.";
    }
  }

  const dominantColors = [...colorBuckets.entries()]
    .sort((first, second) => second[1] - first[1])
    .map(([hex]) => hex)
    .slice(0, 6);

  return { width, height, checks, messages, dominantColors };
}

export async function createWhiteLogo(file: File) {
  const image = await loadImage(file);
  const { width, height } = getImageSize(image, file.type === "image/svg+xml");
  const scale = Math.min(1, 2000 / Math.max(width, height, 1));
  const { canvas, context } = drawToCanvas(
    image,
    Math.round(width * scale),
    Math.round(height * scale),
  );
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  for (let offset = 0; offset < imageData.data.length; offset += 4) {
    imageData.data[offset] = 255;
    imageData.data[offset + 1] = 255;
    imageData.data[offset + 2] = 255;
  }

  context.putImageData(imageData, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );

  if (!blob) {
    throw new Error("Não conseguimos gerar a versão branca.");
  }

  return {
    file: new File([blob], "logo-branca.png", { type: "image/png" }),
    width: canvas.width,
    height: canvas.height,
  };
}

export function suggestPalette(
  dominantColors: string[],
): Record<ColorRole, string> | null {
  const brandColors = dominantColors.filter((hex) => {
    const luminanceContrast = contrastRatio(hex, "#FFFFFF");

    return luminanceContrast > 1.3 && contrastRatio(hex, "#000000") > 1.5;
  });
  const primary =
    [...brandColors].sort(
      (first, second) => saturation(second) - saturation(first),
    )[0] ?? dominantColors[0];

  if (!primary) {
    return null;
  }

  const secondary =
    brandColors.find(
      (hex) => hex !== primary && contrastRatio(hex, primary) > 1.5,
    ) ?? mixColors(primary, "#FFFFFF", 0.65);
  const [red, green, blue] = hexToRgb(primary);

  return {
    primaria: primary,
    secundaria: secondary,
    destaque: rgbToHex(
      [255 - red, 255 - green, 255 - blue].map((channel) =>
        Math.min(255, channel * 0.7 + 60),
      ) as [number, number, number],
    ),
    fundo: mixColors(primary, "#FFFFFF", 0.95),
    texto: mixColors(primary, "#000000", 0.82),
  };
}
