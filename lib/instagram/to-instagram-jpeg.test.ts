import assert from "node:assert/strict";
import { test } from "node:test";

import sharp from "sharp";

import { toInstagramJpeg } from "./to-instagram-jpeg.ts";

const png = (width: number, height: number) =>
  sharp({
    create: { width, height, channels: 4, background: "#1d4ed8" },
  })
    .png()
    .toBuffer();

test("toInstagramJpeg gera JPEG dentro das proporções do feed", async () => {
  const cases = [
    { size: [1024, 1280], expected: [1024, 1280] },
    { size: [1000, 2000], expected: [1000, 1250] },
    { size: [3000, 1000], expected: [1440, 754] },
    { size: [200, 200], expected: [320, 320] },
  ];

  for (const { size, expected } of cases) {
    const jpeg = await toInstagramJpeg(await png(size[0], size[1]), false);
    const { format, width, height } = await sharp(jpeg).metadata();

    assert.deepEqual([format, width, height], ["jpeg", ...expected]);
  }
});

test("toInstagramJpeg mantém a proporção do story", async () => {
  const jpeg = await toInstagramJpeg(await png(1080, 1920), true);
  const { width, height } = await sharp(jpeg).metadata();

  assert.deepEqual([width, height], [1080, 1920]);
});
