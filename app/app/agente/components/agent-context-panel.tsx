"use client";

import { useState } from "react";

import { mockAgentContext } from "@/lib/mocks/agent";

import { AgentContextCard } from "./agent-context-card";
import { AgentContextDialog } from "./agent-context-dialog";
import { ApprovedMaterialsCard } from "./approved-materials-card";
import { DecisionsCard } from "./decisions-card";
import { NextStepsCard } from "./next-steps-card";

export function AgentContextPanel() {
  const [context, setContext] = useState(mockAgentContext);
  const [isContextDialogOpen, setIsContextDialogOpen] = useState(false);

  const openContextDialog = () => setIsContextDialogOpen(true);

  return (
    <aside
      aria-label="Contexto do agente"
      className="scrollbar-subtle grid min-w-0 gap-4 md:grid-cols-2 md:items-start xl:flex xl:max-w-95 xl:items-stretch xl:min-h-0 xl:flex-[1_1_320px] xl:flex-col xl:overflow-y-auto"
    >
      <AgentContextCard context={context} onEdit={openContextDialog} />
      <NextStepsCard />
      <DecisionsCard
        preferences={context.preferences}
        onOpenHistory={openContextDialog}
      />
      <ApprovedMaterialsCard />
      <AgentContextDialog
        open={isContextDialogOpen}
        onOpenChange={setIsContextDialogOpen}
        context={context}
        onSave={setContext}
      />
    </aside>
  );
}
