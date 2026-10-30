import assert from "node:assert/strict";
import { test } from "node:test";

import sharp from "sharp";

import { contrastScore, hideLogoArea } from "./logo-image.ts";

const solidRgb = (pixels: number, value: number) =>
  new Uint8Array(pixels * 3).fill(value);

const solidRgba = (pixels: number, value: number, alpha = 255) => {
  const rgba = new Uint8Array(pixels * 4);

  for (let index = 0; index < pixels; index++) {
    rgba.set([value, value, value, alpha], index * 4);
  }

  return rgba;
};

test("logo branca em fundo branco tem contraste quase zero", () => {
  assert.ok(contrastScore(solidRgba(16, 255), solidRgb(16, 250)) < 10);
});

test("logo escura em fundo branco tem contraste alto", () => {
  assert.ok(contrastScore(solidRgba(16, 20), solidRgb(16, 250)) > 200);
});

test("pixels transparentes da logo não contam no contraste", () => {
  assert.equal(contrastScore(solidRgba(16, 0, 0), solidRgb(16, 255)), 0);
});

test("esconder a logo do exemplo mantém a linha do rodapé até a borda", async () => {
  const width = 100;
  const height = 100;
  const white = { r: 255, g: 255, b: 255 };
  const image = await sharp({
    create: { width, height, channels: 3, background: white },
  })
    .composite([
      {
        input: {
          create: {
            width,
            height: 3,
            channels: 3,
            background: { r: 0, g: 0, b: 255 },
          },
        },
        left: 0,
        top: 92,
      },
      {
        input: {
          create: {
            width: 20,
            height: 10,
            channels: 3,
            background: { r: 255, g: 0, b: 0 },
          },
        },
        left: 75,
        top: 80,
      },
    ])
    .png()
    .toBuffer();

  const { data } = await sharp(await hideLogoArea(image))
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixelAt = (x: number, y: number) =>
    Array.from(data.subarray((y * width + x) * 3, (y * width + x) * 3 + 3));

  assert.deepEqual(pixelAt(97, 93), [0, 0, 255]);
  assert.deepEqual(pixelAt(85, 85), [255, 255, 255]);
});
