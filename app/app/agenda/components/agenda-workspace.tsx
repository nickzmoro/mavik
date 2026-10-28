"use client";

import { useState } from "react";

import { formatShortDate, getMonthName } from "@/lib/agenda-dates";
import {
  agendaStatusLabels,
  type AgendaItem,
  type AgendaStatus,
} from "@/lib/mocks/agenda";
import { useToast } from "@/providers/toast-provider";

import { useAgenda, type ResolvedAgendaItem } from "../hooks/use-agenda";
import { AgendaAgentCard } from "./agenda-agent-card";
import { AgendaCalendarCard } from "./agenda-calendar-card";
import { AgendaHeader } from "./agenda-header";
import { AgendaItemSheet } from "./agenda-item-sheet";
import { ApprovePlanDialog } from "./approve-plan-dialog";
import { CampaignsCard } from "./campaigns-card";
import { GeneratePlanDialog } from "./generate-plan-dialog";
import { MonthDistributionCard } from "./month-distribution-card";
import { NewCampaignDialog } from "./new-campaign-dialog";
import { NewContentDialog } from "./new-content-dialog";
import { PlanRationaleCard } from "./plan-rationale-card";

type AgendaDialog =
  | "none"
  | "detail"
  | "new-content"
  | "new-campaign"
  | "generate-plan"
  | "approve-plan";

const getAgentMessage = (agenda: ReturnType<typeof useAgenda>): string => {
  if (agenda.isSuggestedPlan) {
    return "Montei novembro a partir do seu objetivo: Reels na quinta para aquecer o sábado e a Black Friday como Semana Aurora, sem descontos.";
  }

  return agenda.month === "october"
    ? "Quinta tem um Reels em revisão. Se aprovar até amanhã, ele sai às 18h, antes do fim de semana."
    : "Novembro está aprovado. Vou avisar quando cada conteúdo estiver pronto para revisão.";
};

export function AgendaWorkspace() {
  const { showToast } = useToast();
  const agenda = useAgenda();
  const [activeDialog, setActiveDialog] = useState<AgendaDialog>("none");
  const [selectedItemId, setSelectedItemId] = useState(agenda.items[0].id);

  const selectedItem =
    agenda.items.find((item) => item.id === selectedItemId) ?? agenda.items[0];
  const monthName = getMonthName(agenda.monthSettings.monthIndex);

  const handleDialogOpenChange = (dialog: AgendaDialog) => (isOpen: boolean) =>
    setActiveDialog(isOpen ? dialog : "none");

  const openItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setActiveDialog("detail");
  };

  const changeItemStatus = (item: ResolvedAgendaItem, status: AgendaStatus) => {
    agenda.setItemStatus(item.id, status);
    showToast(`${item.title}: ${agendaStatusLabels[status].toLowerCase()}`);
  };

  const rescheduleItem = (isoDate: string) => {
    if (isoDate === selectedItem.date) {
      return;
    }

    agenda.setItemDate(selectedItem.id, isoDate);
    showToast(`Reagendado para ${formatShortDate(isoDate)}`);
  };

  const addItem = (item: AgendaItem) => {
    agenda.addItem(item);
    setActiveDialog("none");
    showToast(`Adicionado: ${formatShortDate(item.date)}`);
  };

  const createCampaign = (campaignName: string) => {
    setActiveDialog("none");
    showToast(`Campanha criada: ${campaignName || "Nova campanha"}`);
  };

  const finishPlanGeneration = () => {
    agenda.showSuggestedPlan();
    setActiveDialog("none");
    showToast("Plano de novembro pronto para revisão");
  };

  const approvePlan = () => {
    agenda.approveNovemberPlan();
    setActiveDialog("none");
    showToast(
      `Plano aprovado: ${agenda.monthItems.length} conteúdos em produção`,
    );
  };

  return (
    <>
      <AgendaHeader
        onNewCampaign={() => setActiveDialog("new-campaign")}
        onGeneratePlan={() => setActiveDialog("generate-plan")}
        onNewContent={() => setActiveDialog("new-content")}
      />

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <AgendaCalendarCard
          agenda={agenda}
          onOpenItem={openItem}
          onCreateContent={() => setActiveDialog("new-content")}
          onApprovePlan={() => setActiveDialog("approve-plan")}
          onMoveItem={changeItemStatus}
        />
        <aside
          aria-label="Estratégia do mês"
          className="grid min-w-0 gap-4 md:grid-cols-2 md:items-start xl:flex xl:max-w-95 xl:flex-[1_1_320px] xl:flex-col xl:items-stretch"
        >
          <PlanRationaleCard
            focusPercentage={agenda.focusPercentage}
            dateNote={agenda.monthSettings.dateNote}
            monthItemsCount={agenda.monthItems.length}
            recommendedMaximum={Math.round(
              4 * agenda.monthSettings.weeksInMonth,
            )}
          />
          <MonthDistributionCard monthItems={agenda.monthItems} />
          <CampaignsCard
            campaigns={agenda.campaigns}
            monthIndex={agenda.monthSettings.monthIndex}
            onNewCampaign={() => setActiveDialog("new-campaign")}
          />
          <AgendaAgentCard message={getAgentMessage(agenda)} />
        </aside>
      </div>

      <AgendaItemSheet
        item={selectedItem}
        open={activeDialog === "detail"}
        onOpenChange={handleDialogOpenChange("detail")}
        onChangeStatus={(status) => changeItemStatus(selectedItem, status)}
        onReschedule={rescheduleItem}
      />
      <NewContentDialog
        open={activeDialog === "new-content"}
        onOpenChange={handleDialogOpenChange("new-content")}
        nextItemNumber={agenda.addedItemsCount + 1}
        onAdd={addItem}
      />
      <NewCampaignDialog
        open={activeDialog === "new-campaign"}
        onOpenChange={handleDialogOpenChange("new-campaign")}
        onCreate={createCampaign}
      />
      <GeneratePlanDialog
        open={activeDialog === "generate-plan"}
        onOpenChange={handleDialogOpenChange("generate-plan")}
        onGenerated={finishPlanGeneration}
      />
      <ApprovePlanDialog
        open={activeDialog === "approve-plan"}
        onOpenChange={handleDialogOpenChange("approve-plan")}
        monthName={monthName}
        contentsCount={agenda.monthItems.length}
        campaignsCount={agenda.campaigns.length}
        focusPercentage={agenda.focusPercentage}
        onApprove={approvePlan}
      />
    </>
  );
}
