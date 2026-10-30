import sharp from "sharp";

const MIN_FEED_RATIO = 4 / 5;
const MAX_FEED_RATIO = 1.91;
const MIN_WIDTH = 320;
const MAX_WIDTH = 1440;

export async function toInstagramJpeg(image: Buffer, isStory: boolean) {
  const source = sharp(image).rotate();
  const { width = MAX_WIDTH, height = MAX_WIDTH } = await source.metadata();
  const ratio = isStory
    ? width / height
    : Math.min(Math.max(width / height, MIN_FEED_RATIO), MAX_FEED_RATIO);
  const targetWidth = Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH);

  return source
    .resize({
      width: targetWidth,
      height: Math.round(targetWidth / ratio),
      fit: "cover",
    })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
}
