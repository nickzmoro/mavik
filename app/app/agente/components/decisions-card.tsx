import { PanelCard, PanelTextButton } from "@/components/common/panel-card";
import type { AgentPreference } from "@/lib/mocks/agent";
import { cn } from "@/lib/utils";

type DecisionsCardProps = {
  preferences: AgentPreference[];
  onOpenHistory: () => void;
};

export function DecisionsCard({
  preferences,
  onOpenHistory,
}: DecisionsCardProps) {
  return (
    <PanelCard titleId="mem-title" title="Decisões e preferências">
      {preferences.length > 0 ? (
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {preferences.map((preference) => (
            <li key={preference.id} className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  preference.isFromCurrentConversation
                    ? "bg-primary"
                    : "bg-accent dark:bg-accent/50",
                )}
              />
              <span className="flex flex-1 flex-col">
                <span className="text-sm leading-[1.4] font-medium">
                  {preference.label}
                </span>
                <span className="text-xs leading-[1.4] text-muted">
                  {preference.meta}
                </span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-0 text-[13px] leading-normal text-muted">
          Nenhuma preferência salva. O agente guarda as que você pedir nas
          conversas.
        </p>
      )}
      <PanelTextButton
        aria-haspopup="dialog"
        onClick={onOpenHistory}
        className="min-h-0 px-0"
      >
        Ver histórico completo
      </PanelTextButton>
    </PanelCard>
  );
}
