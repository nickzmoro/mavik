import assert from "node:assert/strict";
import { test } from "node:test";

import { detectCalendarEvent, getNextOccurrence } from "./calendar-events.ts";

test("detecta Black Friday por nome e sinônimo", () => {
  assert.equal(
    detectCalendarEvent("ideias para a black friday")?.key,
    "black-friday",
  );
  assert.equal(detectCalendarEvent("promo BF")?.key, "black-friday");
  assert.equal(detectCalendarEvent("cardápio de Natal")?.key, "natal");
  assert.equal(detectCalendarEvent("Dia das Maes")?.key, "dia-das-maes");
});

test("não detecta data em tema comum", () => {
  assert.equal(detectCalendarEvent("novo bolo de cenoura"), null);
  assert.equal(detectCalendarEvent("bfoo"), null);
  assert.equal(detectCalendarEvent(""), null);
});

test("próxima ocorrência pula para o ano seguinte quando a data já passou", () => {
  const october = new Date("2026-10-29T12:00:00-03:00");

  assert.equal(getNextOccurrence("dia-das-maes", october), "2027-05-09");
  assert.equal(getNextOccurrence("black-friday", october), "2026-11-27");
  assert.equal(getNextOccurrence("natal", october), "2026-12-25");
  assert.equal(getNextOccurrence("pascoa", october), "2027-03-28");
});

test("próxima ocorrência confere com as datas semeadas no banco", () => {
  const november = new Date("2026-11-01T12:00:00-03:00");

  assert.equal(getNextOccurrence("cyber-monday", november), "2026-11-30");
  assert.equal(getNextOccurrence("carnaval", november), "2027-02-09");
  assert.equal(getNextOccurrence("dia-dos-pais", november), "2027-08-08");
  assert.equal(getNextOccurrence("dia-dos-namorados", november), "2027-06-12");
});

test("a data de hoje ainda conta como próxima ocorrência", () => {
  const christmasMorning = new Date("2026-12-25T08:00:00-03:00");

  assert.equal(getNextOccurrence("natal", christmasMorning), "2026-12-25");
});
