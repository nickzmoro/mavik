import assert from "node:assert/strict";
import { test } from "node:test";

import { planReplacement } from "./replacement-plan.ts";

test("pedido com ideias aprovadas substitui as atuais", () => {
  assert.deepEqual(
    planReplacement({ mode: "request", approvedCount: 4, requestedCount: 6 }),
    { shouldDelete: true, missing: 2 },
  );
});

test("nenhuma ideia aprovada nunca apaga as atuais", () => {
  assert.deepEqual(
    planReplacement({ mode: "request", approvedCount: 0, requestedCount: 6 }),
    { shouldDelete: false, missing: 6 },
  );
});

test("geração inicial nunca apaga nada", () => {
  assert.deepEqual(
    planReplacement({ mode: "initial", approvedCount: 9, requestedCount: 9 }),
    { shouldDelete: false, missing: 0 },
  );
});
