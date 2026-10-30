"use client";

import { useState } from "react";

import { useToggleIdeaSave } from "@/hooks/mutations/use-toggle-idea-save";
import { useIdeas } from "@/hooks/queries/use-ideas";
import {
  contentTypeLabels,
  formatLabels,
  funnelStageLabels,
  goalLabels,
} from "@/lib/content/content-labels";
import type { IdeasData, IdeaView } from "@/lib/ideas/idea-types";

export type IdeasView = "all" | "recommended" | "saved";

export type IdeaFilterKey =
  "goal" | "format" | "contentType" | "audience" | "funnelStage";

type IdeaFilters = Record<IdeaFilterKey, string[]>;

export type IdeaFilterGroup = {
  key: IdeaFilterKey;
  label: string;
  options: { value: string; label: string }[];
};

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const emptyFilters: IdeaFilters = {
  goal: [],
  format: [],
  contentType: [],
  audience: [],
  funnelStage: [],
};

const matchesFilters = (idea: IdeaView, filters: IdeaFilters) =>
  (Object.keys(filters) as IdeaFilterKey[]).every(
    (filterKey) =>
      filters[filterKey].length === 0 ||
      filters[filterKey].includes(idea[filterKey] ?? ""),
  );

const matchesQuery = (idea: IdeaView, query: string) =>
  !query ||
  `${idea.title} ${idea.why} ${idea.howToUse} ${formatLabels[idea.format]} ${contentTypeLabels[idea.contentType]}`
    .toLowerCase()
    .includes(query);

export function useIdeasLibrary(initialData: IdeasData) {
  const { data = initialData } = useIdeas(initialData);
  const toggleIdeaSaveMutation = useToggleIdeaSave();
  const [query, setQuery] = useState("");
  const [selectedDateId, setSelectedDateId] = useState<string | null>(null);
  const [view, setView] = useState<IdeasView>("all");
  const [filters, setFilters] = useState<IdeaFilters>(emptyFilters);

  const normalizedQuery = query.trim().toLowerCase();
  const audiences = [
    ...new Set(
      data.ideas.flatMap((idea) => (idea.audience ? [idea.audience] : [])),
    ),
  ];
  const filterGroups: IdeaFilterGroup[] = [
    { key: "goal", label: "Objetivo", options: toOptions(goalLabels) },
    { key: "format", label: "Formato", options: toOptions(formatLabels) },
    {
      key: "contentType",
      label: "Tipo de conteúdo",
      options: toOptions(contentTypeLabels),
    },
    ...(audiences.length > 0
      ? [
          {
            key: "audience" as const,
            label: "Público",
            options: audiences.map((audience) => ({
              value: audience,
              label: audience,
            })),
          },
        ]
      : []),
    {
      key: "funnelStage",
      label: "Etapa de compra",
      options: toOptions(funnelStageLabels),
    },
  ];

  const visibleIdeas = data.ideas.filter((idea) => {
    if (view === "saved" && !data.savedIdeaIds.includes(idea.id)) {
      return false;
    }

    if (view === "recommended" && !idea.isRecommended) {
      return false;
    }

    if (selectedDateId && idea.calendarDateId !== selectedDateId) {
      return false;
    }

    return matchesFilters(idea, filters) && matchesQuery(idea, normalizedQuery);
  });

  const viewOptions: { id: IdeasView; label: string }[] = [
    { id: "all", label: `Todas · ${data.ideas.length}` },
    {
      id: "recommended",
      label: `Para você · ${data.ideas.filter((idea) => idea.isRecommended).length}`,
    },
    { id: "saved", label: `Salvas · ${data.savedIdeaIds.length}` },
  ];

  const hasActiveFilters = Object.values(filters).some(
    (selectedOptions) => selectedOptions.length > 0,
  );

  const selectedDate =
    data.dates.find((date) => date.id === selectedDateId) ?? null;

  const toggleFilter = (filterKey: IdeaFilterKey, option: string) =>
    setFilters((currentFilters) => ({
      ...currentFilters,
      [filterKey]: currentFilters[filterKey].includes(option)
        ? currentFilters[filterKey].filter(
            (selectedOption) => selectedOption !== option,
          )
        : [...currentFilters[filterKey], option],
    }));

  const toggleDate = (dateId: string) =>
    setSelectedDateId((currentDateId) =>
      currentDateId === dateId ? null : dateId,
    );

  const toggleSavedIdea = (
    ideaId: string,
    onDone: (result: { isSaved: boolean; errorMessage?: string }) => void,
  ) => {
    const isSaved = !data.savedIdeaIds.includes(ideaId);

    toggleIdeaSaveMutation.mutate(
      { ideaId, isSaved },
      {
        onSuccess: () => onDone({ isSaved }),
        onError: (error) => onDone({ isSaved, errorMessage: error.message }),
      },
    );
  };

  const clearFilters = () => setFilters(emptyFilters);

  const clearAll = () => {
    setFilters(emptyFilters);
    setSelectedDateId(null);
    setQuery("");
    setView("all");
  };

  return {
    data,
    query,
    setQuery,
    view,
    setView,
    viewOptions,
    filterGroups,
    filters,
    toggleFilter,
    hasActiveFilters,
    clearFilters,
    clearAll,
    selectedDate,
    toggleDate,
    savedIdeaIds: data.savedIdeaIds,
    toggleSavedIdea,
    visibleIdeas,
  };
}
