import { addDays, parseIsoDate } from "@/lib/agenda-dates";
import {
  mockDailyReach,
  mockPublishedByDay,
  mockResultsPeriodStart,
} from "@/lib/mocks/results";

export type ResultsMetric = "reach" | "views" | "engagement";
export type ResultsPeriod = 7 | 30;

const totalDays = mockDailyReach.length;
const chartWidth = 1000;
const chartHeight = 300;
const monthAbbreviations = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];
const weekdayAbbreviations = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

const dailyViews = mockDailyReach.map((reach, index) =>
  Math.round(reach * 2.25 + (index % 5) * 15),
);
const dailyEngagement = mockDailyReach.map(
  (reach, index) =>
    +(4.6 + (reach > 600 ? 2.6 : 0) + index * 0.03 + (index % 3) * 0.2).toFixed(
      1,
    ),
);

const metricSeries: Record<
  ResultsMetric,
  { current: number[]; previous: number[]; totalLabel: string }
> = {
  reach: {
    current: mockDailyReach,
    previous: mockDailyReach.map(
      (value, index) =>
        value * 0.8 - (index % 7 === 3 ? 90 : 0) + (index % 4) * 10,
    ),
    totalLabel: "de alcance somado",
  },
  views: {
    current: dailyViews,
    previous: dailyViews.map((value, index) => value * 0.76 + (index % 3) * 20),
    totalLabel: "visualizações",
  },
  engagement: {
    current: dailyEngagement,
    previous: dailyEngagement.map(
      (value, index) => value - 1.1 - (index % 2) * 0.2,
    ),
    totalLabel: "de engajamento médio",
  },
};

const metricValueLabels: Record<ResultsMetric, string> = {
  reach: "de alcance",
  views: "visualizações",
  engagement: "de engajamento",
};

const sum = (values: number[]) =>
  values.reduce((total, value) => total + value, 0);
const average = (values: number[]) => sum(values) / values.length;

export const formatInteger = (value: number) =>
  Math.round(value).toLocaleString("pt-BR");

export const formatDecimal = (value: number) =>
  value.toFixed(1).replace(".", ",");

const formatDeltaPercentage = (current: number, previous: number) =>
  `+${Math.round((current / previous - 1) * 100)}%`;

const formatDayLabel = (dayIndex: number) => {
  const date = parseIsoDate(addDays(mockResultsPeriodStart, dayIndex));

  return `${date.getDate()} ${monthAbbreviations[date.getMonth()]}`;
};

const formatDayWithWeekday = (dayIndex: number) => {
  const date = parseIsoDate(addDays(mockResultsPeriodStart, dayIndex));

  return `${weekdayAbbreviations[date.getDay()]}, ${formatDayLabel(dayIndex)}`;
};

const formatMetricValue = (metric: ResultsMetric, value: number) =>
  metric === "engagement" ? `${formatDecimal(value)}%` : formatInteger(value);

const buildSparkline = (values: number[]) => {
  const maximum = Math.max(...values);
  const minimum = Math.min(...values);
  const range = maximum - minimum || 1;

  return values
    .map(
      (value, index) =>
        `${index ? "L" : "M"}${((index / (values.length - 1)) * 120).toFixed(1)} ${(36 - ((value - minimum) / range) * 32).toFixed(1)}`,
    )
    .join(" ");
};

export function getResultsKpis(period: ResultsPeriod) {
  const offset = totalDays - period;
  const slice = (values: number[]) => values.slice(offset);

  const reach = sum(slice(metricSeries.reach.current));
  const previousReach = sum(slice(metricSeries.reach.previous));
  const views = sum(slice(metricSeries.views.current));
  const previousViews = sum(slice(metricSeries.views.previous));
  const engagement = average(slice(metricSeries.engagement.current));
  const previousEngagement = average(slice(metricSeries.engagement.previous));
  const clicks = Math.round(reach * 0.017);
  const previousClicks = Math.round(previousReach * 0.0185);

  return [
    {
      id: "reach",
      label: "Alcance",
      value: formatInteger(reach),
      delta: formatDeltaPercentage(reach, previousReach),
      sparkline: buildSparkline(slice(mockDailyReach)),
    },
    {
      id: "views",
      label: "Visualizações",
      value: formatInteger(views),
      delta: formatDeltaPercentage(views, previousViews),
      sparkline: buildSparkline(slice(dailyViews)),
    },
    {
      id: "engagement",
      label: "Engajamento",
      value: `${formatDecimal(engagement)}%`,
      delta: `+${formatDecimal(engagement - previousEngagement)} p.p.`,
      sparkline: buildSparkline(slice(dailyEngagement)),
    },
    {
      id: "clicks",
      label: "Cliques no perfil",
      value: formatInteger(clicks),
      delta: formatDeltaPercentage(clicks, previousClicks),
      sparkline: buildSparkline(
        slice(
          mockDailyReach.map((value, index) => value * 0.017 + (index % 3)),
        ),
      ),
    },
  ] as const;
}

export type ResultsKpi = ReturnType<typeof getResultsKpis>[number];

export function getPerformanceChart(
  period: ResultsPeriod,
  metric: ResultsMetric,
  tooltipDayIndex: number,
) {
  const offset = totalDays - period;
  const series = metricSeries[metric];
  const current = series.current.slice(offset);
  const previous = series.previous.slice(offset);
  const maximum = Math.max(...current, ...previous) * 1.12;

  const getX = (index: number) => (index / (period - 1)) * chartWidth;
  const getY = (value: number) => chartHeight - (value / maximum) * chartHeight;
  const buildPath = (values: number[]) =>
    values
      .map(
        (value, index) =>
          `${index ? "L" : "M"}${getX(index).toFixed(1)} ${getY(value).toFixed(1)}`,
      )
      .join(" ");

  const linePath = buildPath(current);
  const yTicks = [0.25, 0.5, 0.75, 1].map((fraction) => {
    const value = maximum * fraction;
    const label =
      metric === "engagement"
        ? `${value.toFixed(0)}%`
        : value >= 1000
          ? `${formatDecimal(value / 1000)} mil`
          : formatInteger(value);

    return { top: 100 - fraction * 100, label };
  });

  const tickStep = period === 7 ? 1 : 5;
  const xTicks = Array.from(
    { length: Math.ceil(period / tickStep) },
    (_, tickIndex) => tickIndex * tickStep,
  ).map((index) => ({
    left: getX(index) / 10,
    label: formatDayLabel(index + offset),
  }));

  const localTooltipIndex =
    tooltipDayIndex - offset >= 0 && tooltipDayIndex - offset < period
      ? tooltipDayIndex - offset
      : period - 1;

  const points = current.flatMap((value, index) => {
    const dayIndex = index + offset;
    const publication = mockPublishedByDay[dayIndex];

    if (!publication) {
      return [];
    }

    return [
      {
        dayIndex,
        left: getX(index) / 10,
        top: getY(value) / 3,
        isActive: index === localTooltipIndex,
        ariaLabel: `${formatDayLabel(dayIndex)}: ${publication}, ${formatMetricValue(metric, value)}`,
      },
    ];
  });

  const tooltipLeft = getX(localTooltipIndex) / 10;
  const tooltipTop = getY(current[localTooltipIndex]) / 3;

  const total = metric === "engagement" ? average(current) : sum(current);
  const previousTotal =
    metric === "engagement" ? average(previous) : sum(previous);

  return {
    linePath,
    previousPath: buildPath(previous),
    areaPath: `${linePath} L${chartWidth} ${chartHeight} L0 ${chartHeight} Z`,
    yTicks: [...yTicks, { top: 100, label: "0" }],
    xTicks,
    points,
    tooltip: {
      left: tooltipLeft,
      top: tooltipTop,
      horizontalShift:
        tooltipLeft > 75 ? "-100%" : tooltipLeft < 20 ? "0%" : "-50%",
      verticalShift: tooltipTop < 40 ? "14px" : "calc(-100% - 14px)",
      date: formatDayWithWeekday(localTooltipIndex + offset),
      title: mockPublishedByDay[localTooltipIndex + offset] ?? "Sem publicação",
      value: `${formatMetricValue(metric, current[localTooltipIndex])} ${metricValueLabels[metric]}`,
    },
    total:
      metric === "engagement"
        ? `${formatDecimal(+total.toFixed(1))}%`
        : formatInteger(total),
    totalLabel: series.totalLabel,
    delta:
      metric === "engagement"
        ? `+${formatDecimal(total - previousTotal)} p.p. vs anterior`
        : `${formatDeltaPercentage(total, previousTotal)} vs período anterior`,
  };
}
