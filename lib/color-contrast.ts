const hexColorPattern = /^#([0-9a-f]{6})$/i;
const rgbColorPattern =
  /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;

export function parseColor(value: string) {
  const trimmedValue = value.trim();
  const hexMatch = trimmedValue.match(hexColorPattern);

  if (hexMatch) {
    return `#${hexMatch[1].toUpperCase()}`;
  }

  const rgbMatch = trimmedValue.match(rgbColorPattern);

  if (!rgbMatch) {
    return null;
  }

  const channels = rgbMatch.slice(1, 4).map(Number);

  if (channels.some((channel) => channel > 255)) {
    return null;
  }

  return `#${channels
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

const getRelativeLuminance = (hexColor: string) => {
  const channels = [1, 3, 5].map((start) => {
    const channel = parseInt(hexColor.slice(start, start + 2), 16) / 255;

    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

export function getContrastRatio(foreground: string, background: string) {
  const [lighter, darker] = [
    getRelativeLuminance(foreground),
    getRelativeLuminance(background),
  ].sort((first, second) => second - first);

  return (lighter + 0.05) / (darker + 0.05);
}

export const minimumAaContrast = 4.5;
