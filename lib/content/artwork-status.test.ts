import assert from "node:assert/strict";
import { test } from "node:test";

import { getArtworkDisplayStatus } from "./artwork-status.ts";

const now = new Date("2026-10-30T12:00:00Z");
const tomorrow = new Date("2026-10-31T12:00:00Z");
const yesterday = new Date("2026-10-29T12:00:00Z");

test("getArtworkDisplayStatus devolve agendada para conteúdo aprovado no futuro", () => {
  assert.equal(
    getArtworkDisplayStatus({
      artworkStatus: "aprovada",
      contentStatus: "aprovado",
      scheduledAt: tomorrow,
      now,
    }),
    "agendada",
  );
});

test("getArtworkDisplayStatus devolve publicada para conteúdo publicado", () => {
  assert.equal(
    getArtworkDisplayStatus({
      artworkStatus: "aprovada",
      contentStatus: "publicado",
      scheduledAt: yesterday,
      now,
    }),
    "publicada",
  );
});

test("getArtworkDisplayStatus usa o status da arte sem conteúdo ou com data passada", () => {
  assert.equal(
    getArtworkDisplayStatus({
      artworkStatus: "rascunho",
      contentStatus: null,
      scheduledAt: null,
      now,
    }),
    "rascunho",
  );
  assert.equal(
    getArtworkDisplayStatus({
      artworkStatus: "aprovada",
      contentStatus: "aprovado",
      scheduledAt: yesterday,
      now,
    }),
    "aprovada",
  );
});
