import assert from "node:assert/strict";
import { test } from "node:test";

import { getArtFormatIdFromSize } from "./artwork-format.ts";

test("getArtFormatIdFromSize deduz o formato pela proporção da imagem", () => {
  assert.equal(getArtFormatIdFromSize(1024, 1024), "square");
  assert.equal(getArtFormatIdFromSize(1024, 1280), "portrait");
  assert.equal(getArtFormatIdFromSize(1024, 1820), "story");
});
