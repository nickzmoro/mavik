import "server-only";

import { and, asc, count, eq, gte, isNull, or } from "drizzle-orm";
import type OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

import type {
  GenerateIdeasInput,
  GenerateIdeasResult,
} from "@/actions/generate-ideas/schema";
import { db } from "@/db";
import { calendarDates, ideaRequests, ideas, type stores } from "@/db/schema";
import { LUNA_MODEL } from "@/lib/ai/models";
import {
  IDEAS_SYSTEM_PROMPT,
  buildIdeasUserPrompt,
  type IdeaPromptContext,
} from "@/lib/ai/prompts/ideas";

import {
  calendarEvents,
  detectCalendarEvent,
  type CalendarEvent,
} from "./calendar-events";
import { IDEA_DATES_WINDOW_DAYS } from "./get-ideas-data";
import { getIdeaContext } from "./get-idea-context";
import {
  deleteReplaceableIdeas,
  selectRequestInProgress,
} from "./idea-queries";
import {
  buildInitialSlots,
  buildRequestSlots,
  recommendedGoalByBusinessGoal,
  type IdeaSlot,
  type SlotCalendarDate,
} from "./idea-slots";
import { planReplacement } from "./replacement-plan";
import { resolveCalendarDate } from "./resolve-calendar-date";
import {
  generatedIdeasSchema,
  validateGeneratedIdeas,
  type ValidatedIdea,
} from "./validate-idea";

type Store = typeof stores.$inferSelect;

export const ideasErrorMessages = {
  inProgress: "Já estamos criando suas ideias. Aguarde alguns segundos.",
  failed: "Não conseguimos gerar as ideias agora. Tente de novo.",
  invalidDate: "Essa data não está mais disponível. Escolha outra.",
};

const DAY_MS = 24 * 60 * 60 * 1000;

const toSaoPauloIsoDate = (date: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(
    date,
  );

const daysBetween = (fromIsoDate: string, toIsoDate: string) =>
  Math.round(
    (Date.parse(`${toIsoDate}T00:00:00Z`) -
      Date.parse(`${fromIsoDate}T00:00:00Z`)) /
      DAY_MS,
  );

const toSlotDate = (
  calendarDate: { id: string; name: string; date: string },
  today: string,
): SlotCalendarDate => ({
  ...calendarDate,
  daysUntil: daysBetween(today, calendarDate.date),
});

const visibleDatesFor = (storeId: string, today: string) =>
  and(
    or(isNull(calendarDates.storeId), eq(calendarDates.storeId, storeId)),
    gte(calendarDates.date, today),
  );

const calendarDateFields = {
  id: calendarDates.id,
  name: calendarDates.name,
  date: calendarDates.date,
};

async function findRequestDate(
  storeId: string,
  input: Extract<GenerateIdeasInput, { mode: "request" }>,
  now: Date,
) {
  const today = toSaoPauloIsoDate(now);

  if (input.calendarDateId) {
    const [calendarDate] = await db
      .select(calendarDateFields)
      .from(calendarDates)
      .where(
        and(
          eq(calendarDates.id, input.calendarDateId),
          visibleDatesFor(storeId, today),
        ),
      );

    return calendarDate ? toSlotDate(calendarDate, today) : undefined;
  }

  const event = detectCalendarEvent(input.theme);

  return event ? resolveSlotDate(storeId, event, now) : null;
}

async function resolveSlotDate(
  storeId: string,
  event: CalendarEvent,
  now: Date,
) {
  return toSlotDate(
    await resolveCalendarDate({ storeId, event, from: now }),
    toSaoPauloIsoDate(now),
  );
}

async function findNextDate(storeId: string, now: Date) {
  const today = toSaoPauloIsoDate(now);
  const [calendarDate] = await db
    .select(calendarDateFields)
    .from(calendarDates)
    .where(visibleDatesFor(storeId, today))
    .orderBy(asc(calendarDates.date))
    .limit(1);

  return calendarDate &&
    daysBetween(today, calendarDate.date) <= IDEA_DATES_WINDOW_DAYS
    ? toSlotDate(calendarDate, today)
    : null;
}

async function writeIdeas(
  openai: OpenAI,
  context: IdeaPromptContext,
  slots: IdeaSlot[],
  retryIssues?: Record<number, string[]>,
) {
  const completion = await openai.chat.completions.parse({
    model: LUNA_MODEL,
    response_format: zodResponseFormat(generatedIdeasSchema, "ideas"),
    messages: [
      { role: "system", content: IDEAS_SYSTEM_PROMPT },
      {
        role: "user",
        content: buildIdeasUserPrompt(context, slots, retryIssues),
      },
    ],
  });

  return completion.choices[0]?.message.parsed?.ideas ?? [];
}

async function writeValidatedIdeas(
  openai: OpenAI,
  context: IdeaPromptContext,
  slots: IdeaSlot[],
) {
  const firstPass = validateGeneratedIdeas({
    slots,
    generated: await writeIdeas(openai, context, slots),
    forbiddenTerms: context.forbiddenTerms,
    existingTitles: context.existingTitles,
  });
  const rejectedSlots = slots.filter(({ slot }) => firstPass.rejected[slot]);

  if (rejectedSlots.length === 0) {
    return firstPass.approved;
  }

  const secondPass = validateGeneratedIdeas({
    slots: rejectedSlots,
    generated: await writeIdeas(
      openai,
      context,
      rejectedSlots,
      firstPass.rejected,
    ),
    forbiddenTerms: context.forbiddenTerms,
    existingTitles: [
      ...context.existingTitles,
      ...firstPass.approved.map(({ title }) => title),
    ],
  });

  return [...firstPass.approved, ...secondPass.approved].sort(
    (first, second) => first.slot.slot - second.slot.slot,
  );
}

async function resolveSuggestedDate(
  storeId: string,
  approved: ValidatedIdea[],
  now: Date,
) {
  const suggestedEvent = calendarEvents.find(({ key }) =>
    approved.some(({ calendarEvent }) => calendarEvent === key),
  );

  return suggestedEvent ? resolveSlotDate(storeId, suggestedEvent, now) : null;
}

type GenerateStoreIdeasInput = {
  store: Store;
  userId: string;
  input: GenerateIdeasInput;
  openai: OpenAI;
  now: Date;
};

export async function generateStoreIdeas({
  store,
  userId,
  input,
  openai,
  now,
}: GenerateStoreIdeasInput): Promise<
  | { isSuccess: true; data: GenerateIdeasResult }
  | { isSuccess: false; errorMessage: string }
> {
  const [requestInProgress] = await selectRequestInProgress(db, store.id);

  if (requestInProgress) {
    return { isSuccess: false, errorMessage: ideasErrorMessages.inProgress };
  }

  if (input.mode === "initial") {
    const [{ total }] = await db
      .select({ total: count() })
      .from(ideas)
      .where(eq(ideas.storeId, store.id));

    if (total > 0) {
      return { isSuccess: true, data: { created: 0, missing: 0 } };
    }
  }

  const calendarDate =
    input.mode === "initial"
      ? await findNextDate(store.id, now)
      : await findRequestDate(store.id, input, now);

  if (calendarDate === undefined) {
    return { isSuccess: false, errorMessage: ideasErrorMessages.invalidDate };
  }

  const slots =
    input.mode === "initial"
      ? buildInitialSlots(calendarDate)
      : buildRequestSlots({ ...input, calendarDate });
  const [request] = await db
    .insert(ideaRequests)
    .values({
      storeId: store.id,
      requestedBy: userId,
      theme: input.mode === "request" ? input.theme || null : null,
      calendarDateId: calendarDate?.id ?? null,
      goal: input.mode === "request" ? input.goal : null,
      formats: input.mode === "request" ? input.formats : [],
      contentTypes: input.mode === "request" ? input.contentTypes : [],
      quantity: slots.length,
      status: "processando",
    })
    .returning({ id: ideaRequests.id });

  try {
    const context = {
      ...(await getIdeaContext(store, now)),
      theme: input.mode === "request" ? input.theme : undefined,
    };
    const approved = await writeValidatedIdeas(openai, context, slots);
    const suggestedDate =
      !calendarDate && input.mode === "request" && input.theme
        ? await resolveSuggestedDate(store.id, approved, now)
        : null;
    const plan = planReplacement({
      mode: input.mode,
      approvedCount: approved.length,
      requestedCount: slots.length,
    });
    const recommendedGoal = store.mainGoal
      ? recommendedGoalByBusinessGoal[store.mainGoal]
      : null;

    await db.transaction(async (transaction) => {
      if (plan.shouldDelete) {
        await deleteReplaceableIdeas(transaction, store.id);
      }

      if (approved.length > 0) {
        await transaction.insert(ideas).values(
          approved.map((idea) => ({
            storeId: store.id,
            requestId: request.id,
            calendarDateId:
              idea.slot.calendarDate?.id ??
              (idea.calendarEvent ? (suggestedDate?.id ?? null) : null),
            title: idea.title,
            format: idea.slot.format,
            contentType: idea.slot.contentType,
            goal: idea.slot.goal,
            funnelStage: idea.slot.funnelStage,
            audience: idea.audience,
            why: idea.why,
            howToUse: idea.howToUse,
            steps: idea.steps,
            captionExample: idea.captionExample,
            bestTime: idea.bestTime,
            recommended: idea.slot.goal === recommendedGoal,
            source:
              input.mode === "initial"
                ? ("biblioteca" as const)
                : ("gerada" as const),
          })),
        );
      }

      await transaction
        .update(ideaRequests)
        .set({ status: approved.length > 0 ? "concluido" : "erro" })
        .where(eq(ideaRequests.id, request.id));
    });

    return approved.length > 0
      ? {
          isSuccess: true,
          data: { created: approved.length, missing: plan.missing },
        }
      : { isSuccess: false, errorMessage: ideasErrorMessages.failed };
  } catch (error) {
    console.error("[ideas] falha ao gerar ideias", error);
    await db
      .update(ideaRequests)
      .set({ status: "erro" })
      .where(eq(ideaRequests.id, request.id));

    return { isSuccess: false, errorMessage: ideasErrorMessages.failed };
  }
}
