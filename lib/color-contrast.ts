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

export function getRgbLuminance(red: number, green: number, blue: number) {
  const [linearRed, linearGreen, linearBlue] = [red, green, blue].map(
    (value) => {
      const channel = value / 255;

      return channel <= 0.03928
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    },
  );

  return 0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue;
}

const getRelativeLuminance = (hexColor: string) =>
  getRgbLuminance(
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  );

export function getLuminanceContrast(
  firstLuminance: number,
  secondLuminance: number,
) {
  const [lighter, darker] = [firstLuminance, secondLuminance].sort(
    (first, second) => second - first,
  );

  return (lighter + 0.05) / (darker + 0.05);
}

export function getContrastRatio(foreground: string, background: string) {
  return getLuminanceContrast(
    getRelativeLuminance(foreground),
    getRelativeLuminance(background),
  );
}

export const minimumAaContrast = 4.5;
