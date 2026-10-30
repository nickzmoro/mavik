import "server-only";

import { and, eq, isNull, or } from "drizzle-orm";

import { db } from "@/db";
import { calendarDates } from "@/db/schema";

import { getNextOccurrence, type CalendarEvent } from "./calendar-events";

type ResolveCalendarDateInput = {
  storeId: string;
  event: CalendarEvent;
  from: Date;
};

export async function resolveCalendarDate({
  storeId,
  event,
  from,
}: ResolveCalendarDateInput) {
  const date = getNextOccurrence(event.key, from);
  const calendarDateFields = {
    id: calendarDates.id,
    name: calendarDates.name,
    date: calendarDates.date,
  };
  const [existingDate] = await db
    .select(calendarDateFields)
    .from(calendarDates)
    .where(
      and(
        or(isNull(calendarDates.storeId), eq(calendarDates.storeId, storeId)),
        eq(calendarDates.name, event.name),
        eq(calendarDates.date, date),
      ),
    )
    .limit(1);

  if (existingDate) {
    return existingDate;
  }

  const [createdDate] = await db
    .insert(calendarDates)
    .values({ storeId, name: event.name, date, kind: event.kind })
    .returning(calendarDateFields);

  return createdDate;
}
