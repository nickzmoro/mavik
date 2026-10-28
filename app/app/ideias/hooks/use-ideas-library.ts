"use client";

import { useState } from "react";

import {
  ideaAudiences,
  ideaFormats,
  ideaGoals,
  ideaStages,
  ideaTypes,
  mockIdeaDates,
  mockIdeas,
  mockInitiallySavedIdeaIds,
  type Idea,
  type IdeaDateKey,
} from "@/lib/mocks/ideas";

export type IdeasView = "all" | "recommended" | "saved";

export type IdeaFilterKey = "goal" | "format" | "type" | "audience" | "stage";

type IdeaFilters = Record<IdeaFilterKey, string[]>;

export const ideaFilterGroups: {
  key: IdeaFilterKey;
  label: string;
  options: readonly string[];
}[] = [
  { key: "goal", label: "Objetivo", options: ideaGoals },
  { key: "format", label: "Formato", options: ideaFormats },
  { key: "type", label: "Tipo de conteúdo", options: ideaTypes },
  { key: "audience", label: "Público", options: ideaAudiences },
  { key: "stage", label: "Etapa de compra", options: ideaStages },
];

const emptyFilters: IdeaFilters = {
  goal: [],
  format: [],
  type: [],
  audience: [],
  stage: [],
};

const matchesFilters = (idea: Idea, filters: IdeaFilters) =>
  (Object.keys(filters) as IdeaFilterKey[]).every(
    (filterKey) =>
      filters[filterKey].length === 0 ||
      filters[filterKey].includes(idea[filterKey]),
  );

const matchesQuery = (idea: Idea, query: string) =>
  !query ||
  `${idea.title} ${idea.why} ${idea.how} ${idea.format} ${idea.type}`
    .toLowerCase()
    .includes(query);

export function useIdeasLibrary() {
  const [query, setQuery] = useState("");
  const [selectedDateKey, setSelectedDateKey] = useState<IdeaDateKey | null>(
    null,
  );
  const [view, setView] = useState<IdeasView>("all");
  const [filters, setFilters] = useState<IdeaFilters>(emptyFilters);
  const [savedIdeaIds, setSavedIdeaIds] = useState<string[]>(
    mockInitiallySavedIdeaIds,
  );

  const normalizedQuery = query.trim().toLowerCase();

  const visibleIdeas = mockIdeas.filter((idea) => {
    if (view === "saved" && !savedIdeaIds.includes(idea.id)) {
      return false;
    }

    if (view === "recommended" && !idea.isRecommended) {
      return false;
    }

    if (selectedDateKey && idea.dateKey !== selectedDateKey) {
      return false;
    }

    return matchesFilters(idea, filters) && matchesQuery(idea, normalizedQuery);
  });

  const viewOptions: { id: IdeasView; label: string }[] = [
    { id: "all", label: `Todas · ${mockIdeas.length}` },
    {
      id: "recommended",
      label: `Para você · ${mockIdeas.filter((idea) => idea.isRecommended).length}`,
    },
    { id: "saved", label: `Salvas · ${savedIdeaIds.length}` },
  ];

  const hasActiveFilters = Object.values(filters).some(
    (selectedOptions) => selectedOptions.length > 0,
  );

  const selectedDate =
    mockIdeaDates.find((date) => date.key === selectedDateKey) ?? null;

  const toggleFilter = (filterKey: IdeaFilterKey, option: string) =>
    setFilters((currentFilters) => ({
      ...currentFilters,
      [filterKey]: currentFilters[filterKey].includes(option)
        ? currentFilters[filterKey].filter(
            (selectedOption) => selectedOption !== option,
          )
        : [...currentFilters[filterKey], option],
    }));

  const toggleDate = (dateKey: IdeaDateKey) =>
    setSelectedDateKey((currentDateKey) =>
      currentDateKey === dateKey ? null : dateKey,
    );

  const toggleSavedIdea = (ideaId: string) => {
    const isSaved = savedIdeaIds.includes(ideaId);

    setSavedIdeaIds((currentIds) =>
      isSaved
        ? currentIds.filter((currentId) => currentId !== ideaId)
        : [...currentIds, ideaId],
    );

    return !isSaved;
  };

  const clearFilters = () => setFilters(emptyFilters);

  const clearAll = () => {
    setFilters(emptyFilters);
    setSelectedDateKey(null);
    setQuery("");
    setView("all");
  };

  return {
    query,
    setQuery,
    view,
    setView,
    viewOptions,
    filters,
    toggleFilter,
    hasActiveFilters,
    clearFilters,
    clearAll,
    selectedDate,
    toggleDate,
    savedIdeaIds,
    toggleSavedIdea,
    visibleIdeas,
  };
}
