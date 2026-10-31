import "server-only";

import { and, asc, eq, inArray, isNull, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { calendarDates, ideaSaves } from "@/db/schema";
import { businessGoals } from "@/lib/onboarding/constants";
import { getCurrentUserId, getOwnedStore } from "@/lib/onboarding/store-access";

import { selectRequestInProgress, selectStoreIdeas } from "./idea-queries";
import { emptyIdeasData, type IdeasData } from "./idea-types";

export const IDEA_DATES_WINDOW_DAYS = 70;

const todayInSaoPaulo = sql`(now() at time zone 'America/Sao_Paulo')::date`;

export async function getIdeasData(): Promise<IdeasData> {
  const userId = await getCurrentUserId();
  const store = userId ? await getOwnedStore(userId) : null;

  if (!userId || !store) {
    return emptyIdeasData;
  }

  const [storeIdeas, dates, [requestInProgress]] = await Promise.all([
    selectStoreIdeas(db, store.id),
    db
      .select({
        id: calendarDates.id,
        name: calendarDates.name,
        date: calendarDates.date,
        kind: calendarDates.kind,
        daysUntil: sql<number>`(${calendarDates.date} - ${todayInSaoPaulo})::int`,
      })
      .from(calendarDates)
      .where(
        and(
          or(
            isNull(calendarDates.storeId),
            eq(calendarDates.storeId, store.id),
          ),
          sql`${calendarDates.date} between ${todayInSaoPaulo} and ${todayInSaoPaulo} + ${sql.raw(String(IDEA_DATES_WINDOW_DAYS))}`,
        ),
      )
      .orderBy(asc(calendarDates.date)),
    selectRequestInProgress(db, store.id),
  ]);
  const savedRows = storeIdeas.length
    ? await db
        .select({ ideaId: ideaSaves.ideaId })
        .from(ideaSaves)
        .where(
          and(
            eq(ideaSaves.userId, userId),
            inArray(
              ideaSaves.ideaId,
              storeIdeas.map((idea) => idea.id),
            ),
          ),
        )
    : [];

  return {
    storeName: store.name,
    storeSegment: store.segment,
    businessGoal:
      businessGoals.find(({ value }) => value === store.mainGoal)?.label ??
      null,
    ideas: storeIdeas.flatMap(({ format, ...idea }) =>
      format === "banner"
        ? []
        : [
            {
              id: idea.id,
              title: idea.title,
              format,
              contentType: idea.contentType,
              goal: idea.goal,
              funnelStage: idea.funnelStage,
              audience: idea.audience,
              calendarDateId: idea.calendarDateId,
              isRecommended: idea.recommended,
              why: idea.why,
              howToUse: idea.howToUse,
              bestTime: idea.bestTime,
              steps: Array.isArray(idea.steps) ? idea.steps.map(String) : [],
              captionExample: idea.captionExample,
            },
          ],
    ),
    dates: dates.map((calendarDate) => ({
      id: calendarDate.id,
      name: calendarDate.name,
      date: calendarDate.date,
      daysUntil: calendarDate.daysUntil,
      isTrend: calendarDate.kind === "tendencia",
      ideasCount: storeIdeas.filter(
        (idea) => idea.calendarDateId === calendarDate.id,
      ).length,
    })),
    savedIdeaIds: savedRows.map(({ ideaId }) => ideaId),
    isGenerating: Boolean(requestInProgress),
  };
}
