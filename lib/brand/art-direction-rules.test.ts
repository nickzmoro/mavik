import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildArtDirectionSection,
  type ArtDirectionRule,
} from "./art-direction-rules.ts";

const brandA = "brand-a";
const brandB = "brand-b";

const rules: ArtDirectionRule[] = [
  {
    brandKitId: brandA,
    rule: "Ícone sempre em laranja ou azul",
    isActive: true,
  },
  { brandKitId: brandA, rule: "Nunca usar sombra nos textos", isActive: false },
  { brandKitId: brandB, rule: "Fundo claro ou escuro", isActive: true },
];

test("regra da marca A nunca aparece no prompt da marca B", () => {
  const sectionA = buildArtDirectionSection(brandA, rules, 0) ?? "";
  const sectionB = buildArtDirectionSection(brandB, rules, 0) ?? "";

  assert.match(sectionA, /Ícone sempre em laranja ou azul/);
  assert.doesNotMatch(sectionA, /Fundo claro ou escuro/);
  assert.match(sectionB, /Fundo claro ou escuro/);
  assert.doesNotMatch(sectionB, /Ícone sempre em laranja ou azul/);
});

test("regra desativada não entra no prompt", () => {
  const section = buildArtDirectionSection(brandA, rules, 0) ?? "";

  assert.doesNotMatch(section, /Nunca usar sombra nos textos/);
});

test("sem regras ativas não gera seção", () => {
  assert.equal(buildArtDirectionSection(brandA, [{ ...rules[1] }], 0), null);
  assert.equal(buildArtDirectionSection("brand-c", rules, 0), null);
});

test("alternativas seguem a sequência dos posts, sem sorteio", () => {
  const pick = (variationIndex: number) =>
    buildArtDirectionSection(brandB, rules, variationIndex);

  assert.match(pick(0) ?? "", /with 2 alternatives use alternative 1;/);
  assert.match(pick(1) ?? "", /with 2 alternatives use alternative 2;/);
  assert.match(pick(2) ?? "", /with 2 alternatives use alternative 1;/);
  assert.match(pick(2) ?? "", /with 3 alternatives use alternative 3;/);
  assert.equal(pick(5), pick(5));
});
