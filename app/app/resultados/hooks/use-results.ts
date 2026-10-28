"use client";

import { useState } from "react";

import {
  mockIsInstagramConnected,
  mockTopContents,
  type DataSource,
} from "@/lib/mocks/results";

import type { ResultsMetric, ResultsPeriod } from "../utils/results-chart";

const defaultTooltipDayIndex = 24;

export function useResults() {
  const [isInstagramConnected, setIsInstagramConnected] = useState(
    mockIsInstagramConnected,
  );
  const [connectedExtraSources, setConnectedExtraSources] = useState<
    DataSource["id"][]
  >([]);
  const [period, setPeriod] = useState<ResultsPeriod>(30);
  const [metric, setMetric] = useState<ResultsMetric>("reach");
  const [tooltipDayIndex, setTooltipDayIndex] = useState(
    defaultTooltipDayIndex,
  );
  const [doneConclusionIds, setDoneConclusionIds] = useState<string[]>([]);
  const [savedSaturdaysCount, setSavedSaturdaysCount] = useState(0);
  const [selectedContentId, setSelectedContentId] = useState(
    mockTopContents[0].id,
  );
  const [selectedConclusionId, setSelectedConclusionId] = useState("c1");

  const changePeriod = (nextPeriod: ResultsPeriod) => {
    setPeriod(nextPeriod);
    setTooltipDayIndex(defaultTooltipDayIndex);
  };

  const markConclusionsDone = (conclusionIds: string[]) =>
    setDoneConclusionIds((currentIds) => [
      ...new Set([...currentIds, ...conclusionIds]),
    ]);

  const isSourceConnected = (sourceId: DataSource["id"]) =>
    sourceId === "instagram"
      ? isInstagramConnected
      : connectedExtraSources.includes(sourceId);

  const connectSource = (sourceId: DataSource["id"]) => {
    if (sourceId === "instagram") {
      setIsInstagramConnected(true);
      return;
    }

    setConnectedExtraSources((currentSources) => [...currentSources, sourceId]);
  };

  return {
    isInstagramConnected,
    period,
    changePeriod,
    metric,
    setMetric,
    tooltipDayIndex,
    setTooltipDayIndex,
    doneConclusionIds,
    markConclusionsDone,
    savedSaturdaysCount,
    setSavedSaturdaysCount,
    selectedContent:
      mockTopContents.find((content) => content.id === selectedContentId) ??
      mockTopContents[0],
    setSelectedContentId,
    selectedConclusionId,
    setSelectedConclusionId,
    isSourceConnected,
    connectSource,
  };
}
