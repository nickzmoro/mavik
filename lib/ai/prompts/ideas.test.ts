import assert from "node:assert/strict";
import { test } from "node:test";

import { buildInitialSlots } from "../../ideas/idea-slots.ts";
import {
  IDEAS_SYSTEM_PROMPT,
  buildIdeasUserPrompt,
  type IdeaPromptContext,
} from "./ideas.ts";

const emptyContext: IdeaPromptContext = {
  storeName: "Café Aurora",
  segment: "cafeteria",
  city: null,
  products: [],
  differentiators: null,
  objections: null,
  businessGoal: null,
  currentObjective: null,
  personas: [],
  tone: null,
  lovedTerms: [],
  forbiddenTerms: [],
  brandRules: [],
  existingTitles: [],
  today: "2026-10-29",
};

test("prompt omite seções vazias e lista os títulos atuais e os termos proibidos", () => {
  const prompt = buildIdeasUserPrompt(
    {
      ...emptyContext,
      existingTitles: ["Café de reunião"],
      forbiddenTerms: ["barato"],
    },
    buildInitialSlots(null),
  );

  assert.doesNotMatch(prompt, /Products:/);
  assert.doesNotMatch(prompt, /Audience personas:/);
  assert.match(prompt, /Business: Café Aurora/);
  assert.match(prompt, /Current ideas:\n- Café de reunião/);
  assert.match(prompt, /Forbidden terms: barato/);
});

test("prompt descreve cada slot, com a data e os dias até ela", () => {
  const prompt = buildIdeasUserPrompt(
    emptyContext,
    buildInitialSlots({
      id: "d1",
      name: "Black Friday",
      date: "2026-11-27",
      daysUntil: 29,
    }),
  );

  assert.match(
    prompt,
    /#2 format=story type=autoridade goal=vender stage=decisao date=Black Friday 2026-11-27 \(in 29 days\)/,
  );
  assert.match(
    prompt,
    /#0 format=reels type=educativo goal=atrair stage=descoberta\n/,
  );
});

test("retry lista só os slots reprovados com os motivos", () => {
  const prompt = buildIdeasUserPrompt(
    emptyContext,
    buildInitialSlots(null).slice(1, 2),
    { 1: ["title has 70 characters, the maximum is 60"] },
  );

  assert.match(
    prompt,
    /Fix these slots:\n#1: title has 70 characters, the maximum is 60/,
  );
});

test("system prompt cita as datas que a IA pode reconhecer", () => {
  assert.match(IDEAS_SYSTEM_PROMPT, /black-friday/);
  assert.doesNotMatch(IDEAS_SYSTEM_PROMPT, /\{\{calendarEventKeys\}\}/);
});
