import assert from "node:assert/strict";
import { test } from "node:test";

import { getVersionsToDiscard, toAdjustImageInput } from "./adjust-artwork.ts";

const adjustment = {
  prompt: "Bolo de cenoura",
  editInstruction: "Deixe o título maior",
  formatId: "portrait" as const,
  variationIndex: 1,
};

test("toAdjustImageInput usa o artworkId e não manda a imagem quando a arte está salva", () => {
  assert.deepEqual(
    toAdjustImageInput({
      ...adjustment,
      artworkId: "6f1c2b0e-7a51-4d3e-9a51-1b8e2a6c9d10",
      imageDataUrl: "data:image/png;base64,AAAA",
    }),
    {
      prompt: "Bolo de cenoura",
      editInstruction: "Deixe o título maior",
      format: "portrait",
      variationIndex: 1,
      artworkId: "6f1c2b0e-7a51-4d3e-9a51-1b8e2a6c9d10",
    },
  );
});

test("toAdjustImageInput manda a imagem quando a arte não foi salva", () => {
  assert.deepEqual(
    toAdjustImageInput({
      ...adjustment,
      imageDataUrl: "data:image/png;base64,AAAA",
    }),
    {
      prompt: "Bolo de cenoura",
      editInstruction: "Deixe o título maior",
      format: "portrait",
      variationIndex: 1,
      referenceImage: "data:image/png;base64,AAAA",
    },
  );
});

test("getVersionsToDiscard devolve só as versões depois da que foi aberta", () => {
  assert.deepEqual(getVersionsToDiscard([1, 2, 3, 4], 2), [3, 4]);
  assert.deepEqual(getVersionsToDiscard([1, 2, 3, 4], 4), []);
});
