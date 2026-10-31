import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildApprovedCopyInstruction,
  replaceHeadlineRule,
  toApprovedCopyEntries,
} from "./approved-copy.ts";
import type { PostCopy } from "./post-copy-schema.ts";

const copy: PostCopy = {
  title: { regular: "Bolo de", highlight: "cenoura" },
  subtitle: "Com cobertura de chocolate",
  topics: [{ title: "Fresquinho", sentence: "Sai do forno toda manhã." }],
  cta: "Peça pelo direct",
  caption: "Legenda que nunca vai na arte.",
};

test("toApprovedCopyEntries respeita artFields e nunca inclui legenda", () => {
  assert.deepEqual(toApprovedCopyEntries(copy, ["title", "cta", "caption"]), [
    { role: "headline", text: "Bolo de" },
    { role: "headline-highlight", text: "cenoura" },
    { role: "cta", text: "Peça pelo direct" },
  ]);
});

test("toApprovedCopyEntries mantém a ordem título, subtítulo, tópicos, CTA", () => {
  assert.deepEqual(
    toApprovedCopyEntries(copy, ["cta", "topics", "subtitle", "title"]).map(
      ({ role }) => role,
    ),
    [
      "headline",
      "headline-highlight",
      "subtitle",
      "topic-title",
      "topic-text",
      "cta",
    ],
  );
});

test("buildApprovedCopyInstruction contém cada texto idêntico entre aspas", () => {
  const trickyText = 'Bolo "da vó" — R$ 10 ✨ {{x}} $& á';
  const instruction = buildApprovedCopyInstruction([
    { role: "headline", text: trickyText },
    { role: "cta", text: "Peça já" },
  ]);

  assert.equal(instruction.includes(`- headline: "${trickyText}"`), true);
  assert.equal(instruction.includes('- cta: "Peça já"'), true);
  assert.match(instruction, /Do not rewrite, translate, shorten/);
});

test("buildApprovedCopyInstruction devolve vazio sem entradas", () => {
  assert.equal(buildApprovedCopyInstruction([]), "");
});

test("replaceHeadlineRule mantém $$ e $& do texto aprovado", () => {
  const instruction = buildApprovedCopyInstruction([
    { role: "cta", text: "Só R$$ 5 $& hoje" },
  ]);

  assert.equal(
    replaceHeadlineRule("Antes. REGRA. Depois.", "REGRA", instruction),
    `Antes. ${instruction}. Depois.`,
  );
});
