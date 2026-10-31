import assert from "node:assert/strict";
import { test } from "node:test";

import {
  carouselCopySchema,
  getCarouselCopyIssues,
  type CarouselCopy,
  type CarouselSlideCopy,
} from "./carousel-copy.ts";

const slide = (
  role: CarouselSlideCopy["role"],
  headline = "Três jeitos de servir",
  body = "Uma frase curta explica a ideia.",
): CarouselSlideCopy => ({ role, headline, body });

const caption =
  "Bolo de cenoura em três versões diferentes.\nSalve para testar no fim de semana.\n\n#bolodecenoura";

const shortCarousel: CarouselCopy = {
  slides: [
    slide("cover", "Bolo de cenoura em 3 versões"),
    slide("idea"),
    slide("cta", "Salve este post"),
  ],
  caption,
};

const options = { forbiddenTerms: [], slideCount: 3 };

test("aceita um carrossel de 3 slides cover, idea e cta", () => {
  assert.equal(carouselCopySchema.safeParse(shortCarousel).success, true);
  assert.deepEqual(getCarouselCopyIssues(shortCarousel, options), []);
});

test("o schema rejeita menos de 3 e mais de 10 slides", () => {
  assert.equal(
    carouselCopySchema.safeParse({
      ...shortCarousel,
      slides: shortCarousel.slides.slice(0, 2),
    }).success,
    false,
  );
  assert.equal(
    carouselCopySchema.safeParse({
      ...shortCarousel,
      slides: Array.from({ length: 11 }, () => slide("idea")),
    }).success,
    false,
  );
});

test("aponta quantidade de slides diferente da pedida", () => {
  assert.deepEqual(
    getCarouselCopyIssues(shortCarousel, { ...options, slideCount: 4 }),
    ["O carrossel tem 3 slides, mas foram pedidos 4."],
  );
});

test("aponta capa fora do primeiro slide e CTA fora do último", () => {
  const issues = getCarouselCopyIssues(
    {
      ...shortCarousel,
      slides: [slide("idea"), slide("cover"), slide("idea")],
    },
    options,
  );

  assert.equal(issues.includes("O primeiro slide precisa ser a capa."), true);
  assert.equal(issues.includes("O último slide precisa ser o CTA."), true);
});

test("aponta mais de um CTA", () => {
  const issues = getCarouselCopyIssues(
    {
      ...shortCarousel,
      slides: [slide("cover", "Bolo de cenoura"), slide("cta"), slide("cta")],
    },
    options,
  );

  assert.equal(issues.includes("Use um único CTA, no último slide."), true);
});

test("aponta capa com mais de 6 palavras", () => {
  const issues = getCarouselCopyIssues(
    {
      ...shortCarousel,
      slides: [
        slide("cover", "Um bolo de cenoura fofinho e muito fácil"),
        slide("idea"),
        slide("cta"),
      ],
    },
    options,
  );

  assert.equal(issues.includes("A capa tem 8 palavras; use até 6."), true);
});

test("aponta título com mais de 7 palavras e corpo com mais de 25", () => {
  const longBody = Array.from({ length: 26 }, () => "palavra").join(" ");
  const issues = getCarouselCopyIssues(
    {
      ...shortCarousel,
      slides: [
        slide("cover", "Bolo de cenoura"),
        slide("idea", "Um título longo demais para caber no slide", longBody),
        slide("cta"),
      ],
    },
    options,
  );

  assert.equal(
    issues.includes("O título do slide 2 tem 8 palavras; use até 7."),
    true,
  );
  assert.equal(
    issues.includes("O texto do slide 2 tem 26 palavras; use até 25."),
    true,
  );
});

test("exige slide de resumo a partir de 6 slides", () => {
  const sixSlides = {
    ...shortCarousel,
    slides: [
      slide("cover", "Bolo de cenoura"),
      slide("stake"),
      slide("idea"),
      slide("idea"),
      slide("idea"),
      slide("cta"),
    ],
  };

  assert.equal(
    getCarouselCopyIssues(sixSlides, { ...options, slideCount: 6 }).includes(
      "Com 6 ou mais slides, inclua um slide de resumo antes do CTA.",
    ),
    true,
  );
});

test("aponta termo proibido em qualquer slide", () => {
  assert.deepEqual(
    getCarouselCopyIssues(
      {
        ...shortCarousel,
        slides: [slide("cover", "Bolo barato"), slide("idea"), slide("cta")],
      },
      { ...options, forbiddenTerms: ["barato"] },
    ),
    ["Termos proibidos usados: barato."],
  );
});
