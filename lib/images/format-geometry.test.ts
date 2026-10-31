import assert from "node:assert/strict";
import { test } from "node:test";

import { getArtFormatIdFromSize } from "../content/artwork-format.ts";
import { artFormats } from "../mocks/studio.ts";
import {
  getFormatCrop,
  getLogoMaxSize,
  getLogoPlacement,
  getSafeArea,
  type Box,
} from "./format-geometry.ts";

const bannerIds = artFormats
  .filter(({ kind }) => kind === "banner")
  .map(({ id }) => id);

const isInside = (inner: Box, outer: Box) =>
  inner.left >= outer.left &&
  inner.top >= outer.top &&
  inner.left + inner.width <= outer.left + outer.width &&
  inner.top + inner.height <= outer.top + outer.height;

test("getFormatCrop corta o banner do LinkedIn numa faixa 2048x512 centrada", () => {
  assert.deepEqual(getFormatCrop("banner-linkedin"), {
    left: 0,
    top: 320,
    width: 2048,
    height: 512,
  });
});

test("getFormatCrop mantém a proporção do banner de site", () => {
  const { width, height } = getFormatCrop("banner-site");

  assert.equal(width / height, 1920 / 600);
});

test("getFormatCrop de post usa o quadro inteiro", () => {
  assert.deepEqual(getFormatCrop("portrait"), {
    left: 0,
    top: 0,
    width: 1024,
    height: 1280,
  });
});

test("getSafeArea do YouTube converte 1546x423 para o quadro gerado, centrada", () => {
  assert.deepEqual(getSafeArea("banner-youtube"), {
    left: 406,
    top: 407,
    width: 1237,
    height: 338,
  });
});

test("getSafeArea fica dentro do recorte em todo banner", () => {
  for (const formatId of bannerIds) {
    assert.equal(
      isInside(getSafeArea(formatId), getFormatCrop(formatId)),
      true,
      formatId,
    );
  }
});

test("getLogoPlacement põe a logo inteira dentro da área segura em todo banner", () => {
  for (const formatId of bannerIds) {
    const safeArea = getSafeArea(formatId);
    const logo = getLogoMaxSize(formatId);
    const placement = getLogoPlacement(safeArea, logo);

    assert.equal(isInside({ ...placement, ...logo }, safeArea), true, formatId);
  }
});

test("getLogoPlacement de post mantém o canto inferior direito com margem de 5%", () => {
  assert.deepEqual(
    getLogoPlacement(getSafeArea("square"), { width: 200, height: 100 }),
    { left: 1024 - 200 - 51, top: 1024 - 100 - 51 },
  );
});

test("getArtFormatIdFromSize escolhe o formato de proporção mais próxima", () => {
  assert.equal(getArtFormatIdFromSize(1920, 600), "banner-site");
  assert.equal(getArtFormatIdFromSize(1584, 396), "banner-linkedin");
  assert.equal(getArtFormatIdFromSize(1640, 624), "banner-facebook");
  assert.equal(getArtFormatIdFromSize(2560, 1440), "banner-youtube");
  assert.equal(getArtFormatIdFromSize(1024, 1280), "portrait");
});
