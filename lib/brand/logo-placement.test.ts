import assert from "node:assert/strict";
import { test } from "node:test";

import {
  defaultLogoPlacement,
  getLogoOffset,
  parseLogoPlacement,
} from "./logo-placement.ts";

const storyLogo = {
  imageWidth: 1152,
  imageHeight: 2048,
  logoWidth: 200,
  logoHeight: 100,
  margin: 58,
};

test("logo no canto inferior direito encosta no rodapé, sem flutuar", () => {
  assert.deepEqual(getLogoOffset({ ...storyLogo, position: "bottom-right" }), {
    left: 894,
    top: 1890,
  });
});

test("logo no canto superior direito fica no topo", () => {
  assert.deepEqual(getLogoOffset({ ...storyLogo, position: "top-right" }), {
    left: 894,
    top: 58,
  });
});

test("logo nos cantos da esquerda usa a margem", () => {
  assert.deepEqual(getLogoOffset({ ...storyLogo, position: "bottom-left" }), {
    left: 58,
    top: 1890,
  });
  assert.deepEqual(getLogoOffset({ ...storyLogo, position: "top-left" }), {
    left: 58,
    top: 58,
  });
});

test("parseLogoPlacement aceita valores válidos e cai no padrão nos inválidos", () => {
  assert.deepEqual(
    parseLogoPlacement({ position: "top-right", variant: "simbolo" }),
    { position: "top-right", variant: "simbolo" },
  );
  assert.deepEqual(
    parseLogoPlacement({ position: "meio", variant: "x" }),
    defaultLogoPlacement,
  );
  assert.deepEqual(parseLogoPlacement(null), defaultLogoPlacement);
});
