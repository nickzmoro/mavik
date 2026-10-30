import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildInitialSlots,
  buildRequestSlots,
  funnelStageByGoal,
} from "./idea-slots.ts";

const blackFriday = {
  id: "d1",
  name: "Black Friday",
  date: "2026-11-27",
  daysUntil: 29,
};

test("mistura inicial: 4 formatos, 4 objetivos, 4 etapas e nunca 3 formatos iguais seguidos", () => {
  const slots = buildInitialSlots(null);

  assert.equal(slots.length, 9);
  assert.equal(new Set(slots.map((slot) => slot.format)).size, 4);
  assert.equal(new Set(slots.map((slot) => slot.goal)).size, 4);
  assert.equal(new Set(slots.map((slot) => slot.funnelStage)).size, 4);

  for (let index = 2; index < slots.length; index++) {
    assert.ok(
      !(
        slots[index].format === slots[index - 1].format &&
        slots[index].format === slots[index - 2].format
      ),
    );
  }

  assert.ok(
    slots.every((slot) => slot.funnelStage === funnelStageByGoal[slot.goal]),
  );
  assert.deepEqual(
    slots.map((slot) => slot.slot),
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
  );
});

test("mistura inicial liga exatamente 1 ideia à próxima data", () => {
  const slots = buildInitialSlots(blackFriday);
  const datedSlots = slots.filter((slot) => slot.calendarDate?.id === "d1");

  assert.equal(datedSlots.length, 1);
  assert.equal(datedSlots[0].goal, "vender");
});

test("pedido gera a quantidade pedida percorrendo formatos e tipos", () => {
  const slots = buildRequestSlots({
    quantity: 5,
    goal: "vender",
    formats: ["reels", "story"],
    contentTypes: ["comercial"],
    calendarDate: blackFriday,
  });

  assert.deepEqual(
    slots.map((slot) => slot.format),
    ["reels", "story", "reels", "story", "reels"],
  );
  assert.ok(
    slots.every(
      (slot) =>
        slot.goal === "vender" &&
        slot.funnelStage === "decisao" &&
        slot.contentType === "comercial" &&
        slot.calendarDate?.id === "d1",
    ),
  );
});
