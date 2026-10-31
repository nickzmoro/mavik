import assert from "node:assert/strict";
import { test } from "node:test";

import sharp from "sharp";

import { artFormats } from "../mocks/studio.ts";
import { fitToFormat } from "./fit-to-format.ts";

test("fitToFormat gera exatamente o tamanho final de cada formato", async () => {
  for (const format of artFormats) {
    const generatedImage = await sharp({
      create: {
        ...format.generationSize,
        channels: 3,
        background: "#5926c8",
      },
    })
      .png()
      .toBuffer();
    const { width, height } = await sharp(
      await fitToFormat(generatedImage, format.id),
    ).metadata();

    assert.deepEqual({ width, height }, format.outputSize, format.id);
  }
});
