import assert from "node:assert/strict";
import { test } from "node:test";

import {
  artOptionsSchema,
  formatArtCount,
  formatVariationCount,
  getInitialVariationCount,
} from "./art-options.ts";
import { artFormats, variationCountOptions } from "./mocks/studio.ts";

test("artOptionsSchema aceita todo formato e toda contagem do seletor", () => {
  for (const { id } of artFormats) {
    for (const variationCount of variationCountOptions) {
      assert.equal(
        artOptionsSchema.safeParse({ formatId: id, variationCount }).success,
        true,
      );
    }
  }
});

test("artOptionsSchema rejeita 0 e 4 variações e formato desconhecido", () => {
  assert.equal(
    artOptionsSchema.safeParse({ formatId: "portrait", variationCount: 0 })
      .success,
    false,
  );
  assert.equal(
    artOptionsSchema.safeParse({ formatId: "portrait", variationCount: 4 })
      .success,
    false,
  );
  assert.equal(
    artOptionsSchema.safeParse({ formatId: "reel", variationCount: 1 }).success,
    false,
  );
});

test("getInitialVariationCount respeita o máximo e o restante do teste", () => {
  assert.equal(getInitialVariationCount(Number.POSITIVE_INFINITY), 3);
  assert.equal(getInitialVariationCount(2), 2);
  assert.equal(getInitialVariationCount(0), 1);
});

test("formatadores de contagem usam singular e plural", () => {
  assert.equal(formatVariationCount(1), "1 variação");
  assert.equal(formatArtCount(2), "2 artes");
});
