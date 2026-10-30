"use client";

import { useEffect, useRef, useState } from "react";

import { FilterPill } from "@/components/common/filter-pill";
import { useGenerateIdeas } from "@/hooks/mutations/use-generate-ideas";
import type { IdeasData } from "@/lib/ideas/idea-types";
import { useToast } from "@/providers/toast-provider";

import { useIdeasLibrary } from "../hooks/use-ideas-library";
import {
  GenerateIdeasDialog,
  GeneratingIdeasState,
} from "./generate-ideas-dialog";
import { IdeaCard } from "./idea-card";
import { IdeaDetailDialog } from "./idea-detail-dialog";
import { IdeaVersionsDialog } from "./idea-versions-dialog";
import { IdeasDates } from "./ideas-dates";
import { IdeasEmptyState } from "./ideas-empty-state";
import { IdeasFilters } from "./ideas-filters";
import { IdeasHeader } from "./ideas-header";
import { IdeasSearchBar } from "./ideas-search-bar";
import { ScheduleIdeaDialog } from "./schedule-idea-dialog";

type IdeasDialog = "none" | "detail" | "versions" | "generate" | "schedule";

const INITIAL_IDEAS_COUNT = 9;

type IdeasLibraryProps = {
  initialData: IdeasData;
  datesWindowDays: number;
};

export function IdeasLibrary({
  initialData,
  datesWindowDays,
}: IdeasLibraryProps) {
  const { showToast } = useToast();
  const library = useIdeasLibrary(initialData);
  const generateIdeasMutation = useGenerateIdeas();
  const hasRequestedInitialIdeasRef = useRef(false);
  const [activeDialog, setActiveDialog] = useState<IdeasDialog>("none");
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [generateInitialTheme, setGenerateInitialTheme] = useState("");

  const { data } = library;
  const selectedIdea = data.ideas.find((idea) => idea.id === selectedIdeaId);
  const findIdeaDate = (calendarDateId: string | null) =>
    data.dates.find((date) => date.id === calendarDateId) ?? null;
  const ideasCount = library.visibleIdeas.length;
  const isGeneratingInitialIdeas =
    data.ideas.length === 0 &&
    (data.isGenerating || generateIdeasMutation.isPending);
  const shouldGenerateInitialIdeas =
    data.ideas.length === 0 && !data.isGenerating;

  useEffect(() => {
    if (!shouldGenerateInitialIdeas || hasRequestedInitialIdeasRef.current) {
      return;
    }

    hasRequestedInitialIdeasRef.current = true;
    generateIdeasMutation.mutate(
      { mode: "initial" },
      {
        onSuccess: (result) => {
          if (!result.isSuccess) {
            showToast(result.errorMessage);
          }
        },
        onError: () =>
          showToast("Não conseguimos gerar as ideias agora. Tente de novo."),
      },
    );
  }, [generateIdeasMutation, shouldGenerateInitialIdeas, showToast]);

  const openIdeaDialog = (ideaId: string, dialog: IdeasDialog) => {
    setSelectedIdeaId(ideaId);
    setActiveDialog(dialog);
  };

  const openGenerateDialog = (initialTheme = "") => {
    setGenerateInitialTheme(initialTheme);
    setActiveDialog("generate");
  };

  const handleDialogOpenChange = (dialog: IdeasDialog) => (isOpen: boolean) =>
    setActiveDialog(isOpen ? dialog : "none");

  const handleToggleSave = (ideaId: string) =>
    library.toggleSavedIdea(ideaId, ({ isSaved, errorMessage }) =>
      showToast(
        errorMessage ??
          (isSaved
            ? "Ideia salva na sua biblioteca"
            : "Ideia removida dos salvos"),
      ),
    );

  return (
    <>
      <IdeasHeader onGenerateIdeas={() => openGenerateDialog()} />
      <IdeasSearchBar query={library.query} onQueryChange={library.setQuery} />
      <IdeasDates
        dates={data.dates}
        windowDays={datesWindowDays}
        selectedDateId={library.selectedDate?.id ?? null}
        onToggleDate={library.toggleDate}
      />

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <IdeasFilters
          filterGroups={library.filterGroups}
          filters={library.filters}
          hasActiveFilters={library.hasActiveFilters}
          onToggleFilter={library.toggleFilter}
          onClearFilters={library.clearFilters}
        />

        <section
          aria-labelledby="list-title"
          className="flex min-w-0 flex-col gap-3.5 xl:flex-[999_1_560px]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div role="group" aria-label="Ver" className="flex flex-wrap gap-2">
              {library.viewOptions.map((viewOption) => (
                <FilterPill
                  key={viewOption.id}
                  isActive={library.view === viewOption.id}
                  onClick={() => library.setView(viewOption.id)}
                >
                  {viewOption.label}
                </FilterPill>
              ))}
            </div>
            <span
              id="list-title"
              className="text-sm leading-[1.4] font-medium text-muted"
            >
              {ideasCount === 1 ? "1 ideia" : `${ideasCount} ideias`}
            </span>
          </div>

          {isGeneratingInitialIdeas ? (
            <div className="glass rounded-3xl">
              <GeneratingIdeasState
                quantity={INITIAL_IDEAS_COUNT}
                storeName={data.storeName}
              />
            </div>
          ) : ideasCount > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(340px,100%),1fr))] gap-4">
              {library.visibleIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  ideaDate={findIdeaDate(idea.calendarDateId)}
                  isSaved={library.savedIdeaIds.includes(idea.id)}
                  onToggleSave={() => handleToggleSave(idea.id)}
                  onOpenDetail={() => openIdeaDialog(idea.id, "detail")}
                  onOpenVersions={() => openIdeaDialog(idea.id, "versions")}
                  onUse={() => openIdeaDialog(idea.id, "schedule")}
                />
              ))}
            </div>
          ) : (
            <IdeasEmptyState
              selectedDate={library.selectedDate}
              storeName={data.storeName}
              hasIdeas={data.ideas.length > 0}
              view={library.view}
              onGenerateIdeas={() =>
                openGenerateDialog(library.selectedDate?.name ?? "")
              }
              onClearAll={library.clearAll}
            />
          )}
        </section>
      </div>

      {selectedIdea ? (
        <>
          <IdeaDetailDialog
            idea={selectedIdea}
            ideaDate={findIdeaDate(selectedIdea.calendarDateId)}
            isSaved={library.savedIdeaIds.includes(selectedIdea.id)}
            onToggleSave={() => handleToggleSave(selectedIdea.id)}
            open={activeDialog === "detail"}
            onOpenChange={handleDialogOpenChange("detail")}
            onOpenVersions={() => setActiveDialog("versions")}
            onUse={() => setActiveDialog("schedule")}
          />
          <IdeaVersionsDialog
            idea={selectedIdea}
            open={activeDialog === "versions"}
            onOpenChange={handleDialogOpenChange("versions")}
            onUseVersion={() => setActiveDialog("schedule")}
          />
          <ScheduleIdeaDialog
            idea={selectedIdea}
            open={activeDialog === "schedule"}
            onOpenChange={handleDialogOpenChange("schedule")}
          />
        </>
      ) : null}
      <GenerateIdeasDialog
        open={activeDialog === "generate"}
        onOpenChange={handleDialogOpenChange("generate")}
        initialTheme={generateInitialTheme}
        dates={data.dates}
        storeName={data.storeName}
      />
    </>
  );
}
