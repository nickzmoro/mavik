import assert from "node:assert/strict";
import { test } from "node:test";

import { parsePostDraft, type StoredPostDraft } from "./post-draft.ts";

const storedDraft: StoredPostDraft = {
  prompt: "Bolo de cenoura com cobertura",
  formatId: "story",
  variationCount: 2,
  copy: {
    title: { regular: "Bolo de", highlight: "cenoura" },
    subtitle: "Com cobertura de chocolate feita aqui",
    topics: [{ title: "Fresquinho", sentence: "Sai do forno toda manhã." }],
    cta: "Peça pelo direct",
  },
  artFields: ["title", "cta"],
  isApproved: true,
};

test("parsePostDraft devolve null para null, JSON quebrado e formato inválido", () => {
  assert.equal(parsePostDraft(null), null);
  assert.equal(parsePostDraft("{quebrado"), null);
  assert.equal(
    parsePostDraft(JSON.stringify({ ...storedDraft, formatId: "reel" })),
    null,
  );
});

test("parsePostDraft restaura prompt, formato, variações, textos e artFields", () => {
  assert.deepEqual(parsePostDraft(JSON.stringify(storedDraft)), storedDraft);
});
