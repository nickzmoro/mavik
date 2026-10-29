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

const namedColors: { name: string; hex: string }[] = [
  { name: "Preto", hex: "#000000" },
  { name: "Grafite", hex: "#2F2F2F" },
  { name: "Cinza-chumbo", hex: "#4A4A4A" },
  { name: "Cinza", hex: "#808080" },
  { name: "Cinza-claro", hex: "#C0C0C0" },
  { name: "Gelo", hex: "#EEF0F2" },
  { name: "Branco", hex: "#FFFFFF" },
  { name: "Off-white", hex: "#FAF7F0" },
  { name: "Creme", hex: "#F3ECE2" },
  { name: "Bege", hex: "#E8D5B7" },
  { name: "Areia", hex: "#D9C3A0" },
  { name: "Caramelo", hex: "#C68E4E" },
  { name: "Marrom-claro", hex: "#A0703C" },
  { name: "Marrom", hex: "#6F4E37" },
  { name: "Café", hex: "#3B2A22" },
  { name: "Chocolate", hex: "#3D1F12" },
  { name: "Vinho", hex: "#722F37" },
  { name: "Bordô", hex: "#800020" },
  { name: "Vermelho", hex: "#D32F2F" },
  { name: "Vermelho-vivo", hex: "#FF1F1F" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Salmão", hex: "#FA8072" },
  { name: "Pêssego", hex: "#FFCBA4" },
  { name: "Laranja", hex: "#FF8C00" },
  { name: "Terracota", hex: "#C65D3B" },
  { name: "Mostarda", hex: "#D4A017" },
  { name: "Dourado", hex: "#D4AF37" },
  { name: "Amarelo", hex: "#FFD600" },
  { name: "Amarelo-claro", hex: "#FFF59D" },
  { name: "Verde-limão", hex: "#A8E10C" },
  { name: "Verde-neon", hex: "#39FF14" },
  { name: "Verde", hex: "#2E9E44" },
  { name: "Verde-folha", hex: "#4CAF50" },
  { name: "Sálvia", hex: "#8FA98A" },
  { name: "Verde-oliva", hex: "#6B7A3A" },
  { name: "Verde-musgo", hex: "#4A5D23" },
  { name: "Verde-escuro", hex: "#1B4D2E" },
  { name: "Menta", hex: "#98E2C6" },
  { name: "Turquesa", hex: "#30D5C8" },
  { name: "Azul-petróleo", hex: "#1F5F6B" },
  { name: "Azul-céu", hex: "#87CEEB" },
  { name: "Azul-bebê", hex: "#BFE1F6" },
  { name: "Azul", hex: "#1E6FD9" },
  { name: "Azul-royal", hex: "#2B4FD8" },
  { name: "Azul-marinho", hex: "#1B2A4A" },
  { name: "Azul-noite", hex: "#0D1530" },
  { name: "Índigo", hex: "#3F3D9E" },
  { name: "Lavanda", hex: "#B9A7E0" },
  { name: "Lilás", hex: "#C8A2C8" },
  { name: "Roxo", hex: "#6A1B9A" },
  { name: "Violeta", hex: "#8F4FD8" },
  { name: "Ameixa", hex: "#5E2750" },
  { name: "Magenta", hex: "#D6247A" },
  { name: "Fúcsia", hex: "#E91E8C" },
  { name: "Rosa", hex: "#F06292" },
  { name: "Rosa-claro", hex: "#F8BBD0" },
  { name: "Rosa-bebê", hex: "#FADADD" },
];

function getColorDistance(firstHex: string, secondHex: string) {
  const [firstRed, firstGreen, firstBlue] = hexToRgb(firstHex);
  const [secondRed, secondGreen, secondBlue] = hexToRgb(secondHex);
  const meanRed = (firstRed + secondRed) / 2;
  const red = firstRed - secondRed;
  const green = firstGreen - secondGreen;
  const blue = firstBlue - secondBlue;

  return (
    (2 + meanRed / 256) * red ** 2 +
    4 * green ** 2 +
    (2 + (255 - meanRed) / 256) * blue ** 2
  );
}

export function getColorName(hex: string) {
  return namedColors.reduce((closest, color) =>
    getColorDistance(hex, color.hex) < getColorDistance(hex, closest.hex)
      ? color
      : closest,
  ).name;
}
