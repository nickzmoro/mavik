import assert from "node:assert/strict";
import { test } from "node:test";

import { postCopySchema, type PostCopy } from "./post-copy-schema.ts";
import { findPlaceholders, getPostCopyIssues } from "./validate-post-copy.ts";

const validCopy: PostCopy = {
  title: { regular: "Bolo de", highlight: "cenoura" },
  subtitle: "Com cobertura de chocolate feita aqui",
  topics: [
    { title: "Fresquinho", sentence: "Sai do forno toda manhã." },
    { title: "Caseiro", sentence: "Receita da família desde 1998." },
  ],
  cta: "Peça pelo direct",
  caption:
    "Bolo de cenoura saindo agora do forno.\nA cobertura é feita aqui todo dia.\nPeça pelo direct.\n\n#bolodecenoura #confeitaria",
};

const isValid = (copy: unknown) => postCopySchema.safeParse(copy).success;

test("postCopySchema rejeita 4 tópicos", () => {
  const topic = { title: "Tópico", sentence: "Uma frase curta." };

  assert.equal(isValid({ ...validCopy, topics: [topic, topic, topic] }), true);
  assert.equal(
    isValid({ ...validCopy, topics: [topic, topic, topic, topic] }),
    false,
  );
});

test("postCopySchema rejeita textos acima do limite de cada campo", () => {
  const tooLong = (length: number) => "a".repeat(length);

  assert.equal(
    isValid({
      ...validCopy,
      title: { ...validCopy.title, regular: tooLong(31) },
    }),
    false,
  );
  assert.equal(
    isValid({
      ...validCopy,
      title: { ...validCopy.title, highlight: tooLong(31) },
    }),
    false,
  );
  assert.equal(isValid({ ...validCopy, subtitle: tooLong(91) }), false);
  assert.equal(
    isValid({
      ...validCopy,
      topics: [{ title: "Tópico", sentence: tooLong(111) }],
    }),
    false,
  );
  assert.equal(
    isValid({
      ...validCopy,
      topics: [{ title: tooLong(31), sentence: "Ok." }],
    }),
    false,
  );
  assert.equal(isValid({ ...validCopy, cta: tooLong(31) }), false);
  assert.equal(isValid({ ...validCopy, cta: tooLong(30) }), true);
});

test("postCopySchema aceita 0 tópicos e legenda ausente", () => {
  assert.equal(isValid({ ...validCopy, caption: undefined, topics: [] }), true);
});

test("postCopySchema aceita {{placeholder}} nos campos", () => {
  assert.equal(
    isValid({ ...validCopy, subtitle: "Por {{preço}} até {{data}}" }),
    true,
  );
});

test("postCopySchema aceita um único CTA em texto, não uma lista", () => {
  assert.equal(
    isValid({ ...validCopy, cta: ["Peça já", "Siga a gente"] }),
    false,
  );
});

test("findPlaceholders lista cada {{placeholder}} na ordem", () => {
  assert.deepEqual(findPlaceholders("Por {{preço}} até {{data}}"), [
    "{{preço}}",
    "{{data}}",
  ]);
  assert.deepEqual(findPlaceholders("Sem nada aqui { nem } {{}}"), []);
});

const postOptions = { forbiddenTerms: [], isStory: false };

test("getPostCopyIssues aceita texto limpo", () => {
  assert.deepEqual(getPostCopyIssues(validCopy, postOptions), []);
});

test("getPostCopyIssues aponta legenda com 2 CTAs", () => {
  const issues = getPostCopyIssues(
    {
      ...validCopy,
      caption: "Bolo de cenoura saindo agora.\nComente aqui e siga a gente.",
    },
    postOptions,
  );

  assert.equal(
    issues.some((issue) => issue.includes("chamadas para ação")),
    true,
  );
});

test("getPostCopyIssues aponta 6 hashtags e aceita 5", () => {
  const withHashtags = (count: number) => ({
    ...validCopy,
    caption: `Bolo de cenoura saindo agora.\nPeça pelo direct.\n\n${Array.from({ length: count }, (_, index) => `#bolo${index}`).join(" ")}`,
  });

  assert.deepEqual(getPostCopyIssues(withHashtags(5), postOptions), []);
  assert.equal(getPostCopyIssues(withHashtags(6), postOptions).length, 1);
});

test("getPostCopyIssues aponta primeira frase com 126 caracteres", () => {
  const issues = getPostCopyIssues(
    { ...validCopy, caption: `${"a".repeat(125)}. Fim.` },
    postOptions,
  );

  assert.equal(
    issues.some((issue) => issue.includes("primeira frase")),
    true,
  );
});

test("getPostCopyIssues aponta termo proibido em qualquer campo", () => {
  const issues = getPostCopyIssues(
    { ...validCopy, subtitle: "O bolo mais BARATO da cidade" },
    { forbiddenTerms: ["barato"], isStory: false },
  );

  assert.deepEqual(issues, ["Termos proibidos usados: barato."]);
});

test("getPostCopyIssues exige legenda fora do Story e ignora no Story", () => {
  const copyWithoutCaption = { ...validCopy, caption: undefined };

  assert.deepEqual(getPostCopyIssues(copyWithoutCaption, postOptions), [
    "Falta a legenda.",
  ]);
  assert.deepEqual(
    getPostCopyIssues(copyWithoutCaption, { ...postOptions, isStory: true }),
    [],
  );
});
