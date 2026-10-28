import { RotateCcw } from "lucide-react";

import type { StudioState } from "../hooks/use-studio";
import { GuidedProgress } from "./guided-progress";
import { GuidedQuestions } from "./guided-questions";
import { StartModePicker } from "./start-mode-picker";
import { StudioPromptForm } from "./studio-prompt-form";

const getSectionTitle = (studio: StudioState) => {
  if (studio.mode === "free") {
    return "Descreva a arte do seu jeito";
  }

  return studio.isGuidedComplete ? "Revise e envie" : "Vamos montar juntos";
};

type StudioRequestPanelProps = {
  studio: StudioState;
};

export function StudioRequestPanel({ studio }: StudioRequestPanelProps) {
  const isGuided = studio.mode === "guided";

  return (
    <section
      aria-label="Pedido"
      className="glass flex min-w-0 flex-[1_1_480px] flex-col gap-4 rounded-3xl p-4 sm:p-5"
    >
      {studio.mode === null ? (
        <StartModePicker onPick={studio.pickMode} />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="m-0 font-display text-base leading-[1.4] font-semibold">
              {getSectionTitle(studio)}
            </h2>
            <button
              type="button"
              onClick={studio.restart}
              className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-(--r-sm) border-0 bg-transparent px-2 text-[13px] font-semibold text-muted transition-colors duration-150 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
            >
              <RotateCcw aria-hidden="true" className="size-3.5" />
              Recomeçar
            </button>
          </div>
          {isGuided ? (
            <GuidedProgress
              step={studio.guidedStep}
              answers={studio.guidedAnswers}
              onEditAnswer={studio.editAnswer}
            />
          ) : null}
          {isGuided && !studio.isGuidedComplete ? (
            <GuidedQuestions studio={studio} />
          ) : (
            <StudioPromptForm
              key={`${studio.mode}-${studio.guidedStep}`}
              studio={studio}
              defaultPrompt={isGuided ? studio.guidedPrompt : ""}
            />
          )}
        </>
      )}
    </section>
  );
}
