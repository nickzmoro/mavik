import { PanelCard, PanelTextButton } from "@/components/common/panel-card";
import type { AgentContext } from "@/lib/mocks/agent";

type AgentContextCardProps = {
  context: AgentContext;
  onEdit: () => void;
};

export function AgentContextCard({ context, onEdit }: AgentContextCardProps) {
  const contextRows = [
    { label: "Negócio", value: context.business },
    { label: "Público", value: context.audience },
    { label: "Tom", value: context.tone },
    { label: "Objetivo", value: context.goal },
  ];

  return (
    <PanelCard
      titleId="ctx-title"
      title="O que o agente sabe"
      className="gap-3.5"
      action={
        <PanelTextButton aria-haspopup="dialog" onClick={onEdit}>
          Editar
        </PanelTextButton>
      }
    >
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-2.5 text-sm leading-[1.45]">
        {contextRows.map(({ label, value }) => (
          <div key={label} className="contents">
            <dt className="text-muted">{label}</dt>
            <dd className="m-0 font-medium wrap-break-word">{value}</dd>
          </div>
        ))}
      </dl>
    </PanelCard>
  );
}
