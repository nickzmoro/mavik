import { addDays, parseIsoDate } from "@/lib/agenda-dates";
import type { PlanItem } from "@/lib/onboarding/thirty-day-plan";

import type { ResolvedAgendaItem } from "@/app/app/agenda/hooks/use-agenda";

export const PLAN_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

export const toPlanAgendaItems = (
  planItems: PlanItem[],
  startDate: string,
): ResolvedAgendaItem[] =>
  planItems.map((item) => ({
    id: `plan-${item.day}`,
    date: addDays(startDate, item.day - 1),
    time: "10h",
    title: item.title,
    format: item.format ?? "post",
    goal: item.goal ?? "engajar",
    status: "idea",
    campaign: "",
    origin: "Plano de 30 dias",
    caption: "",
  }));

export const getPlanDayFromDate = (startDate: string, isoDate: string) =>
  Math.round(
    (parseIsoDate(isoDate).getTime() - parseIsoDate(startDate).getTime()) /
      DAY_MS,
  ) + 1;
