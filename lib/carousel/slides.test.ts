import assert from "node:assert/strict";
import { test } from "node:test";

import { buildSlidePrompt } from "./slide-prompt.ts";
import { getSlideFileName, planSlideReorder, replaceSlide } from "./slides.ts";

const style =
  "Cream background #F4EDE4, bold condensed sans-serif headlines in #2E2A27, a thin terracotta footer bar.";

test("buildSlidePrompt repete o bloco de estilo idêntico em todas as posições", () => {
  const prompts = [2, 3, 8].map((position) =>
    buildSlidePrompt({
      style,
      slide: {
        role: "idea",
        headline: "Use farinha fina",
        body: "Ela deixa a massa leve.",
      },
      position,
      slideCount: 8,
      handle: "@padariasol",
    }),
  );

  for (const prompt of prompts) {
    assert.equal(
      prompt.startsWith(`CAROUSEL STYLE (identical on every slide):\n${style}`),
      true,
    );
  }
});

test("buildSlidePrompt numera o slide e cita o texto aprovado entre aspas", () => {
  const prompt = buildSlidePrompt({
    style,
    slide: {
      role: "idea",
      headline: "Use farinha fina",
      body: "Ela deixa a massa leve.",
    },
    position: 3,
    slideCount: 8,
    handle: "@padariasol",
  });

  assert.match(prompt, /Slide 3\/8/);
  assert.equal(prompt.includes('"Use farinha fina"'), true);
  assert.equal(prompt.includes('"Ela deixa a massa leve."'), true);
  assert.equal(prompt.includes('"3/8"'), true);
  assert.equal(prompt.includes('"@padariasol"'), true);
});

test("replaceSlide troca só a posição pedida", () => {
  const slides = [1, 2, 3, 4].map((position) => ({
    position,
    imageUrl: `slide-${position}.png`,
    version: 1,
  }));
  const updatedSlides = replaceSlide(slides, 3, {
    position: 3,
    imageUrl: "slide-3-novo.png",
    version: 2,
  });

  assert.deepEqual(updatedSlides[2], {
    position: 3,
    imageUrl: "slide-3-novo.png",
    version: 2,
  });
  assert.deepEqual(
    updatedSlides.filter(({ position }) => position !== 3),
    slides.filter(({ position }) => position !== 3),
  );
});

test("planSlideReorder diz de qual posição vem o conteúdo de cada slide", () => {
  assert.deepEqual(planSlideReorder([1, 2, 3, 4], [4, 2, 3, 1]), [
    { from: 4, to: 1 },
    { from: 2, to: 2 },
    { from: 3, to: 3 },
    { from: 1, to: 4 },
  ]);
});

test("planSlideReorder recusa ordem que não usa as mesmas posições", () => {
  assert.equal(planSlideReorder([1, 2, 3], [1, 2, 2]), null);
  assert.equal(planSlideReorder([1, 2, 3], [1, 2]), null);
});

test("getSlideFileName numera com dois dígitos", () => {
  assert.equal(getSlideFileName(3), "slide-03.png");
  assert.equal(getSlideFileName(10), "slide-10.png");
});
