"use client";

import { useState } from "react";

import { getWeekday, parseIsoDate } from "@/lib/agenda-dates";
import {
  agendaFocusWeekdays,
  agendaMonthSettings,
  mockAgendaCampaigns,
  mockAgendaItems,
  type AgendaItem,
  type AgendaMonth,
  type AgendaStatus,
} from "@/lib/mocks/agenda";

export type AgendaView = "month" | "week" | "board";

export type ResolvedAgendaItem = Omit<AgendaItem, "status"> & {
  status: AgendaStatus;
};

export function useAgenda() {
  const [month, setMonth] = useState<AgendaMonth>("october");
  const [view, setView] = useState<AgendaView>("month");
  const [hiddenStatuses, setHiddenStatuses] = useState<AgendaStatus[]>([]);
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, AgendaStatus>
  >({});
  const [dateOverrides, setDateOverrides] = useState<Record<string, string>>(
    {},
  );
  const [addedItems, setAddedItems] = useState<AgendaItem[]>([]);
  const [isNovemberApproved, setIsNovemberApproved] = useState(false);

  const monthSettings = agendaMonthSettings[month];

  const items: ResolvedAgendaItem[] = [...mockAgendaItems, ...addedItems].map(
    (item) => {
      const baseStatus =
        item.status === "suggested"
          ? isNovemberApproved
            ? "production"
            : "idea"
          : item.status;

      return {
        ...item,
        status: statusOverrides[item.id] ?? baseStatus,
        date: dateOverrides[item.id] ?? item.date,
      };
    },
  );

  const visibleItems = items.filter(
    (item) => !hiddenStatuses.includes(item.status),
  );
  const monthItems = items.filter(
    (item) => parseIsoDate(item.date).getMonth() === monthSettings.monthIndex,
  );
  const focusItemsCount = monthItems.filter((item) =>
    agendaFocusWeekdays.includes(getWeekday(item.date)),
  ).length;
  const focusPercentage = monthItems.length
    ? Math.round((focusItemsCount / monthItems.length) * 100)
    : 0;

  const toggleStatusVisibility = (status: AgendaStatus) =>
    setHiddenStatuses((currentStatuses) =>
      currentStatuses.includes(status)
        ? currentStatuses.filter((currentStatus) => currentStatus !== status)
        : [...currentStatuses, status],
    );

  const setItemStatus = (itemId: string, status: AgendaStatus) =>
    setStatusOverrides((currentOverrides) => ({
      ...currentOverrides,
      [itemId]: status,
    }));

  const setItemDate = (itemId: string, isoDate: string) =>
    setDateOverrides((currentOverrides) => ({
      ...currentOverrides,
      [itemId]: isoDate,
    }));

  const addItem = (item: AgendaItem) => {
    setAddedItems((currentItems) => [...currentItems, item]);
    setMonth("october");
  };

  const showSuggestedPlan = () => {
    setMonth("november");
    setView("month");
    setIsNovemberApproved(false);
  };

  return {
    month,
    setMonth,
    monthSettings,
    view,
    setView,
    hiddenStatuses,
    toggleStatusVisibility,
    items,
    visibleItems,
    monthItems,
    focusPercentage,
    campaigns: mockAgendaCampaigns[month],
    isSuggestedPlan: month === "november" && !isNovemberApproved,
    approveNovemberPlan: () => setIsNovemberApproved(true),
    showSuggestedPlan,
    setItemStatus,
    setItemDate,
    addItem,
    addedItemsCount: addedItems.length,
  };
}
