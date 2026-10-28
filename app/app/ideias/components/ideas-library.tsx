"use client";

import { useState } from "react";

import { FilterPill } from "@/components/common/filter-pill";
import { mockIdeas } from "@/lib/mocks/ideas";
import { useToast } from "@/providers/toast-provider";

import { useIdeasLibrary } from "../hooks/use-ideas-library";
import { GenerateIdeasDialog } from "./generate-ideas-dialog";
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

export function IdeasLibrary() {
  const { showToast } = useToast();
  const library = useIdeasLibrary();
  const [activeDialog, setActiveDialog] = useState<IdeasDialog>("none");
  const [selectedIdeaId, setSelectedIdeaId] = useState(mockIdeas[0].id);
  const [generateInitialTheme, setGenerateInitialTheme] = useState("");

  const selectedIdea =
    mockIdeas.find((idea) => idea.id === selectedIdeaId) ?? mockIdeas[0];
  const ideasCount = library.visibleIdeas.length;

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

  const handleToggleSave = (ideaId: string) => {
    const isNowSaved = library.toggleSavedIdea(ideaId);

    showToast(
      isNowSaved
        ? "Ideia salva na sua biblioteca"
        : "Ideia removida dos salvos",
    );
  };

  return (
    <>
      <IdeasHeader onGenerateIdeas={() => openGenerateDialog()} />
      <IdeasSearchBar query={library.query} onQueryChange={library.setQuery} />
      <IdeasDates
        selectedDateKey={library.selectedDate?.key ?? null}
        onToggleDate={library.toggleDate}
      />

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <IdeasFilters
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

          {ideasCount > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(340px,100%),1fr))] gap-4">
              {library.visibleIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
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
              view={library.view}
              onGenerateIdeas={() =>
                openGenerateDialog(library.selectedDate?.name ?? "")
              }
              onClearAll={library.clearAll}
            />
          )}
        </section>
      </div>

      <IdeaDetailDialog
        idea={selectedIdea}
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
      <GenerateIdeasDialog
        open={activeDialog === "generate"}
        onOpenChange={handleDialogOpenChange("generate")}
        initialTheme={generateInitialTheme}
      />
      <ScheduleIdeaDialog
        idea={selectedIdea}
        open={activeDialog === "schedule"}
        onOpenChange={handleDialogOpenChange("schedule")}
      />
    </>
  );
}
