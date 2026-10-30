import sharp from "sharp";

const VISIBLE_ALPHA = 128;
const EXAMPLE_LOGO_AREA = { left: 0.55, top: 0.78 };

const luminance = (red: number, green: number, blue: number) =>
  0.2126 * red + 0.7152 * green + 0.0722 * blue;

export function contrastScore(logoRgba: Uint8Array, backgroundRgb: Uint8Array) {
  let difference = 0;
  let visiblePixels = 0;

  for (let pixel = 0; pixel * 4 < logoRgba.length; pixel++) {
    const logoOffset = pixel * 4;
    const backgroundOffset = pixel * 3;

    if (logoRgba[logoOffset + 3] < VISIBLE_ALPHA) {
      continue;
    }

    difference += Math.abs(
      luminance(
        logoRgba[logoOffset],
        logoRgba[logoOffset + 1],
        logoRgba[logoOffset + 2],
      ) -
        luminance(
          backgroundRgb[backgroundOffset],
          backgroundRgb[backgroundOffset + 1],
          backgroundRgb[backgroundOffset + 2],
        ),
    );
    visiblePixels++;
  }

  return visiblePixels === 0 ? 0 : difference / visiblePixels;
}

// shortcut: assumes the logo sits in the bottom-right of example posts, detect it if clients place it elsewhere
export async function hideLogoArea(imageBytes: Buffer) {
  const { width = 1024, height = 1024 } = await sharp(imageBytes).metadata();
  const left = Math.round(width * EXAMPLE_LOGO_AREA.left);
  const top = Math.round(height * EXAMPLE_LOGO_AREA.top);
  const stretchedEdge = await sharp(imageBytes)
    .extract({ left: left - 1, top, width: 1, height: height - top })
    .resize({ width: width - left, height: height - top, fit: "fill" })
    .png()
    .toBuffer();

  return sharp(imageBytes)
    .composite([{ input: stretchedEdge, left, top }])
    .png()
    .toBuffer();
}
