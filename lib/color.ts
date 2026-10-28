type Rgb = [number, number, number];

export function hexToRgb(hex: string): Rgb {
  const value = Number.parseInt(hex.replace("#", ""), 16);

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export function rgbToHex([red, green, blue]: Rgb) {
  return `#${[red, green, blue]
    .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

function relativeLuminance(rgb: Rgb) {
  const [red, green, blue] = rgb.map((channel) => {
    const normalized = channel / 255;

    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(firstHex: string, secondHex: string) {
  const firstLuminance = relativeLuminance(hexToRgb(firstHex));
  const secondLuminance = relativeLuminance(hexToRgb(secondHex));
  const [lighter, darker] = [firstLuminance, secondLuminance].sort(
    (first, second) => second - first,
  );

  return (lighter + 0.05) / (darker + 0.05);
}

export function mixColors(firstHex: string, secondHex: string, weight: number) {
  const first = hexToRgb(firstHex);
  const second = hexToRgb(secondHex);

  return rgbToHex(
    first.map(
      (channel, index) => channel * (1 - weight) + second[index] * weight,
    ) as Rgb,
  );
}

export function saturation(hex: string) {
  const [red, green, blue] = hexToRgb(hex);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);

  return max === 0 ? 0 : (max - min) / max;
}

export function readableTextColor(backgroundHex: string) {
  return contrastRatio(backgroundHex, "#FFFFFF") >= 4.5 ? "#FFFFFF" : "#1B1530";
}
