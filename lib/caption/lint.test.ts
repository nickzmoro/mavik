import assert from "node:assert/strict";
import { test } from "node:test";

import { humanizeCaption, lintCaption } from "./lint.ts";

test("humanizeCaption remove invisíveis, travessão e aspas curvas", () => {
  assert.equal(
    humanizeCaption("Café​ fresco — todo dia às 7h. “Vem” …"),
    'Café fresco, todo dia às 7h. "Vem" ...',
  );
  assert.equal(humanizeCaption("De 5 – 10 itens"), "De 5-10 itens");
  assert.equal(humanizeCaption("Pronto —."), "Pronto.");
});

test("lintCaption aprova legenda limpa", () => {
  const result = lintCaption(
    "Pão de fermentação natural sai às 7h na Padaria Sol.\nPassa aqui cedo.\n\n#padaria #paofresco",
    { searchTerms: ["pão de fermentação natural"] },
  );

  assert.deepEqual(result, { isValid: true, issues: [] });
});

test("lintCaption reprova primeira frase maior que a janela", () => {
  const { isValid, issues } = lintCaption(`${"a".repeat(130)}. Fim.`);

  assert.equal(isValid, false);
  assert.match(issues[0], /primeira frase tem 131/);
});

test("lintCaption reprova hashtags demais, no início e na janela", () => {
  assert.equal(lintCaption("#padaria Pão fresco.").isValid, false);
  assert.match(
    lintCaption(
      `Pão fresco #padaria. ${"Sai às 7h. ".repeat(12)}`,
    ).issues.join(),
    /hashtag nos primeiros/,
  );
  assert.match(
    lintCaption(
      `${"Pão fresco. ".repeat(12)}\n#a #b #c #d #e #f`,
    ).issues.join(),
    /6 hashtags/,
  );
  assert.match(
    lintCaption("Pão fresco. #padaria", { maxHashtags: 0 }).issues.join(),
    /o máximo é 0/,
  );
});

test("lintCaption reprova mais de uma chamada para ação", () => {
  const { issues } = lintCaption(
    "Pão fresco às 7h. Comenta PAO e segue a gente.",
  );

  assert.match(issues.join(), /2 chamadas para ação/);
  assert.equal(lintCaption("Pão fresco às 7h. Comenta PAO.").isValid, true);
});

test("lintCaption reprova clichês sem depender de acento ou caixa", () => {
  const { issues } = lintCaption("DESCUBRA MAIS. Um sabor imperdivel.");

  assert.match(issues.join(), /Clichês proibidos: descubra, imperdível/);
  assert.equal(lintCaption("Redescubra o pão.").isValid, true);
});

test("lintCaption reprova quando nenhum termo de busca aparece", () => {
  const { issues } = lintCaption("Pão fresco às 7h.", {
    searchTerms: ["confeitaria"],
  });

  assert.match(issues.join(), /Nenhum termo de busca/);
});
