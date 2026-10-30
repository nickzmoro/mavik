import assert from "node:assert/strict";
import { test } from "node:test";

import { buildRequestSlots } from "./idea-slots.ts";
import {
  findSimilarTitle,
  validateGeneratedIdeas,
  type GeneratedIdea,
} from "./validate-idea.ts";

const twoSlots = buildRequestSlots({
  quantity: 2,
  goal: "vender",
  formats: ["reels"],
  contentTypes: ["comercial"],
  calendarDate: null,
});

const ideaForSlot = (
  slot: number,
  overrides: Partial<GeneratedIdea> = {},
): GeneratedIdea => ({
  slot,
  title:
    slot === 0 ? "Pão de queijo saindo às 7h" : "Cold brew pronto em 12 horas",
  why: "Mostra o produto real no horário em que o público passa na porta.",
  how_to_use: "Grave no balcão com luz natural.",
  steps: ["Close do forno abrindo.", "Bandeja no balcão.", "Convite final."],
  caption_example:
    "Pão de queijo quentinho às 7h no balcão da Aurora.\n\nPassa aqui antes do trabalho.\n\n#paodequeijo #cafeteria",
  best_time: "Terça, 7h",
  audience: null,
  calendar_event: null,
  ...overrides,
});

const validate = (
  generated: GeneratedIdea[],
  { forbiddenTerms = [] as string[], existingTitles = [] as string[] } = {},
) =>
  validateGeneratedIdeas({
    slots: twoSlots,
    generated,
    forbiddenTerms,
    existingTitles,
  });

test("aprova ideias corretas e mantém o slot fixado pelo código", () => {
  const { approved, rejected } = validate([ideaForSlot(0), ideaForSlot(1)]);

  assert.deepEqual(rejected, {});
  assert.equal(approved.length, 2);
  assert.equal(approved[0].slot.format, "reels");
  assert.equal(approved[0].slot.goal, "vender");
});

test("reprova legenda com primeira frase acima de 125 caracteres", () => {
  const longFirstSentence = `${"Pão de queijo ".repeat(10)}quentinho.`;
  const { rejected } = validate([
    ideaForSlot(0, { caption_example: longFirstSentence }),
    ideaForSlot(1),
  ]);

  assert.match(rejected[0].join(), /primeira frase/);
});

test("reprova legenda com 2 CTAs", () => {
  const { rejected } = validate([
    ideaForSlot(0, {
      caption_example:
        "Pão de queijo às 7h no balcão.\n\nComente QUERO e siga a Aurora.",
    }),
    ideaForSlot(1),
  ]);

  assert.match(rejected[0].join(), /chamadas para ação/);
});

test("reprova legenda com 6 hashtags", () => {
  const { rejected } = validate([
    ideaForSlot(0, {
      caption_example: "Pão de queijo às 7h no balcão.\n\n#a #b #c #d #e #f",
    }),
    ideaForSlot(1),
  ]);

  assert.match(rejected[0].join(), /6 hashtags/);
});

test("reprova termo proibido em qualquer campo, sem acento", () => {
  const { rejected } = validate(
    [ideaForSlot(0, { why: "O mais barato do bairro." }), ideaForSlot(1)],
    { forbiddenTerms: ["Baráto"] },
  );

  assert.match(rejected[0].join(), /forbidden term/);
});

test("reprova título com clichê ou acima de 60 caracteres", () => {
  const { rejected } = validate([
    ideaForSlot(0, { title: "Você sabia que nosso pão é fresco?" }),
    ideaForSlot(1, { title: "x".repeat(61) }),
  ]);

  assert.match(rejected[0].join(), /cliché/);
  assert.match(rejected[1].join(), /61 characters/);
});

test("reprova título parecido com ideia existente", () => {
  assert.equal(
    findSimilarTitle("3 sinais de que seu café é fresco", [
      "3 sinais de que o seu café é fresco",
    ]),
    "3 sinais de que o seu café é fresco",
  );
  assert.equal(
    findSimilarTitle("Cold brew pronto em 12 horas", ["Pão de queijo às 7h"]),
    null,
  );

  const { rejected } = validate([ideaForSlot(0), ideaForSlot(1)], {
    existingTitles: ["Pão de queijo saindo as 7h"],
  });

  assert.match(rejected[0].join(), /similar/);
});

test("reprova a segunda de duas ideias parecidas na mesma leva", () => {
  const { approved, rejected } = validate([
    ideaForSlot(0),
    ideaForSlot(1, { title: "Pão de queijo saindo às 7h!" }),
  ]);

  assert.equal(approved.length, 1);
  assert.match(rejected[1].join(), /similar/);
});

test("limpa travessão, aspas curvas e invisíveis antes de validar", () => {
  const { approved } = validate([
    ideaForSlot(0, {
      title: "Pão de queijo — saindo às 7h​",
      why: "Mostra o “produto” real.",
    }),
    ideaForSlot(1),
  ]);

  assert.equal(approved[0].title, "Pão de queijo, saindo às 7h");
  assert.equal(approved[0].why, 'Mostra o "produto" real.');
});

test("reprova why com mais de 2 frases e steps vazio", () => {
  const { rejected } = validate([
    ideaForSlot(0, { why: "Um. Dois. Três." }),
    ideaForSlot(1, { steps: [] }),
  ]);

  assert.match(rejected[0].join(), /why/);
  assert.match(rejected[1].join(), /steps/);
});

test("slot ausente ou repetido vira reprovado com motivo", () => {
  const { approved, rejected } = validate([ideaForSlot(0), ideaForSlot(0)]);

  assert.equal(approved.length, 1);
  assert.deepEqual(Object.keys(rejected), ["1"]);
  assert.match(rejected[1].join(), /missing/);
});
