import assert from "node:assert/strict";
import { test } from "node:test";

import { runWithConcurrency } from "./run-with-concurrency.ts";

test("runWithConcurrency nunca passa do limite e devolve na ordem dos itens", async () => {
  let running = 0;
  let maxRunning = 0;
  const results = await runWithConcurrency(
    [1, 2, 3, 4, 5, 6, 7],
    3,
    async (item) => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await new Promise((resolve) => setTimeout(resolve, (8 - item) * 2));
      running--;
      return item * 10;
    },
  );

  assert.equal(maxRunning, 3);
  assert.deepEqual(
    results.map((result) =>
      result.status === "fulfilled" ? result.value : null,
    ),
    [10, 20, 30, 40, 50, 60, 70],
  );
});

test("runWithConcurrency continua quando um item falha", async () => {
  const results = await runWithConcurrency([1, 2, 3], 2, async (item) => {
    if (item === 2) {
      throw new Error("falhou");
    }

    return item;
  });

  assert.deepEqual(
    results.map(({ status }) => status),
    ["fulfilled", "rejected", "fulfilled"],
  );
});
