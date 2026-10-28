"use client";

import { useState } from "react";

import {
  mockConclusions,
  storeTrafficTargetWeeks,
  type DataSource,
} from "@/lib/mocks/results";
import { useToast } from "@/providers/toast-provider";

import { useResults } from "../hooks/use-results";
import { getResultsKpis } from "../utils/results-chart";
import { AudienceActivityCard } from "./audience-activity-card";
import { BreakdownCards } from "./breakdown-cards";
import { ConclusionDialog } from "./conclusion-dialog";
import { ContentDetailDialog } from "./content-detail-dialog";
import { DataSourcesDialog } from "./data-sources-dialog";
import { KpiCards } from "./kpi-cards";
import { NextActionsSection } from "./next-actions-section";
import { PerformanceChartCard } from "./performance-chart-card";
import { PlainSummaryCard } from "./plain-summary-card";
import { ReadingGuide } from "./reading-guide";
import { ReportSheet } from "./report-sheet";
import { ResultsEmptyState } from "./results-empty-state";
import { ResultsHeader } from "./results-header";
import { StoreTrafficDialog } from "./store-traffic-dialog";
import { TopContentsCard } from "./top-contents-card";

type ResultsDialog =
  "none" | "report" | "content" | "conclusion" | "sources" | "store-traffic";

const conclusionActionToasts = {
  agenda: "Adicionado à agenda como ideia",
  keep: "Mantido na agenda",
  test: "Teste criado na agenda",
} as const;

export function ResultsWorkspace() {
  const { showToast } = useToast();
  const results = useResults();
  const [activeDialog, setActiveDialog] = useState<ResultsDialog>("none");

  const kpis = getResultsKpis(results.period);
  const periodLabel =
    results.period === 7 ? "Últimos 7 dias" : "Últimos 30 dias";
  const periodRangeLabel =
    results.period === 7
      ? "14 a 20 de outubro"
      : "21 de setembro a 20 de outubro";

  const handleDialogOpenChange = (dialog: ResultsDialog) => (isOpen: boolean) =>
    setActiveDialog(isOpen ? dialog : "none");

  const openConclusion = (conclusionId: string) => {
    results.setSelectedConclusionId(conclusionId);
    setActiveDialog("conclusion");
  };

  const openContent = (contentId: string) => {
    results.setSelectedContentId(contentId);
    setActiveDialog("content");
  };

  const runConclusionAction = (conclusionId: string) => {
    const conclusion = mockConclusions[conclusionId];

    if (conclusion.action === "store-traffic") {
      setActiveDialog("store-traffic");
      return;
    }

    results.markConclusionsDone([conclusionId]);
    setActiveDialog("none");
    showToast(conclusionActionToasts[conclusion.action]);
  };

  const connectInstagram = () => {
    results.connectSource("instagram");
    showToast("Instagram conectado. Os dados chegam em até 24 horas.");
  };

  const connectSource = (source: DataSource) => {
    results.connectSource(source.id);

    if (source.id === "instagram") {
      setActiveDialog("none");
      showToast("Instagram conectado. Os dados chegam em até 24 horas.");
      return;
    }

    showToast(`${source.name} conectado`);
  };

  const saveStoreTraffic = (filledSaturdaysCount: number) => {
    results.setSavedSaturdaysCount(filledSaturdaysCount);
    setActiveDialog("none");
    showToast(
      filledSaturdaysCount
        ? `${filledSaturdaysCount} sábados salvos. Faltam ${storeTrafficTargetWeeks - filledSaturdaysCount} para comparar.`
        : "Nada para salvar ainda",
    );
  };

  const sendActionsToAgenda = () => {
    results.markConclusionsDone(["c1", "c4", "c5"]);
    setActiveDialog("none");
    showToast("3 ações levadas para a agenda");
  };

  return (
    <>
      <ResultsHeader
        period={results.period}
        hasData={results.isInstagramConnected}
        onPeriodChange={results.changePeriod}
        onOpenSources={() => setActiveDialog("sources")}
        onOpenReport={() => setActiveDialog("report")}
      />
      <ReadingGuide hasData={results.isInstagramConnected} />

      {results.isInstagramConnected ? (
        <div className="flex flex-col gap-5">
          <KpiCards kpis={kpis} onExplain={() => openConclusion("c1")} />
          <div className="flex flex-wrap items-stretch gap-5">
            <PerformanceChartCard
              period={results.period}
              periodLabel={periodLabel}
              metric={results.metric}
              tooltipDayIndex={results.tooltipDayIndex}
              onMetricChange={results.setMetric}
              onSelectDay={results.setTooltipDayIndex}
            />
            <PlainSummaryCard
              periodLabel={periodLabel}
              onExplain={openConclusion}
              onOpenReport={() => setActiveDialog("report")}
            />
          </div>
          <BreakdownCards />
          <div className="flex flex-wrap items-stretch gap-5">
            <TopContentsCard onOpenContent={openContent} />
            <AudienceActivityCard />
          </div>
          <NextActionsSection
            doneConclusionIds={results.doneConclusionIds}
            hasSavedStoreTraffic={results.savedSaturdaysCount > 0}
            onExplain={openConclusion}
            onRunAction={runConclusionAction}
          />
        </div>
      ) : (
        <ResultsEmptyState
          onConnectInstagram={connectInstagram}
          onOpenSources={() => setActiveDialog("sources")}
        />
      )}

      <ReportSheet
        open={activeDialog === "report"}
        onOpenChange={handleDialogOpenChange("report")}
        periodRangeLabel={periodRangeLabel}
        kpis={kpis}
        onExplain={openConclusion}
        onShare={() => showToast("Link do relatório copiado")}
        onDownload={() => showToast("PDF gerado")}
        onSendActionsToAgenda={sendActionsToAgenda}
      />
      <ContentDetailDialog
        content={results.selectedContent}
        open={activeDialog === "content"}
        onOpenChange={handleDialogOpenChange("content")}
        onExplain={openConclusion}
        onRepeatInAgenda={() => {
          setActiveDialog("none");
          showToast("Formato repetido como ideia na agenda");
        }}
      />
      <ConclusionDialog
        conclusion={mockConclusions[results.selectedConclusionId]}
        open={activeDialog === "conclusion"}
        onOpenChange={handleDialogOpenChange("conclusion")}
        onRunAction={runConclusionAction}
      />
      <DataSourcesDialog
        open={activeDialog === "sources"}
        onOpenChange={handleDialogOpenChange("sources")}
        isSourceConnected={results.isSourceConnected}
        onConnect={connectSource}
        onManage={(source) => showToast(`${source.name}: conexão ativa`)}
      />
      <StoreTrafficDialog
        open={activeDialog === "store-traffic"}
        onOpenChange={handleDialogOpenChange("store-traffic")}
        savedSaturdaysCount={results.savedSaturdaysCount}
        onSave={saveStoreTraffic}
      />
    </>
  );
}
