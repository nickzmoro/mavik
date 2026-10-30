import { Flag } from "lucide-react";

import { formatLabels, goalLabels } from "@/lib/content/content-labels";
import { contentFormatIcons } from "@/components/common/format-icons";
import { formatShortDate } from "@/lib/agenda-dates";
import { agendaStatusLabels } from "@/lib/mocks/agenda";
import { cn } from "@/lib/utils";

import type { ResolvedAgendaItem } from "../hooks/use-agenda";
import { agendaStatusCardClassNames } from "./agenda-status-styles";

type AgendaItemCardProps = Omit<React.ComponentProps<"button">, "children"> & {
  item: ResolvedAgendaItem;
  variant: "compact" | "detailed";
  detailedMeta?: "status" | "date";
};

export const getAgendaItemAriaLabel = (item: ResolvedAgendaItem) =>
  `${item.title}, ${formatLabels[item.format]}, ${formatShortDate(item.date)} às ${item.time}, ${agendaStatusLabels[item.status]}`;

export function AgendaItemCard({
  item,
  variant,
  detailedMeta = "status",
  className,
  type = "button",
  ...props
}: AgendaItemCardProps) {
  const FormatIcon = contentFormatIcons[item.format];
  const statusLabel = agendaStatusLabels[item.status];

  return (
    <button
      type={type}
      aria-label={getAgendaItemAriaLabel(item)}
      className={cn(
        "flex w-full min-w-0 cursor-pointer flex-col items-stretch text-left transition-[transform,box-shadow] duration-120 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(26,15,60,.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        agendaStatusCardClassNames[item.status],
        variant === "compact"
          ? "gap-px rounded-[10px] px-2 py-1.25"
          : "gap-1.5 rounded-[14px] px-3 py-2.5",
        className,
      )}
      {...props}
    >
      {variant === "compact" ? (
        <>
          <span className="flex min-w-0 items-center gap-1.25 text-xs leading-[1.35] font-semibold">
            <FormatIcon aria-hidden="true" className="size-3 shrink-0" />
            <span className="min-w-0 truncate">{item.title}</span>
          </span>
          <span className="text-[11px] leading-[1.35] font-medium">
            {item.time} · {statusLabel}
          </span>
        </>
      ) : (
        <>
          <span className="flex items-center justify-between gap-1.5 text-xs leading-[1.3] font-semibold">
            <span className="inline-flex items-center gap-1.25">
              <FormatIcon aria-hidden="true" className="size-3.25 shrink-0" />
              {formatLabels[item.format]}
            </span>
            <span>{item.time}</span>
          </span>
          <span className="text-sm leading-[1.35] font-semibold">
            {item.title}
          </span>
          <span className="text-xs leading-[1.4] font-medium">
            {detailedMeta === "status"
              ? statusLabel
              : formatShortDate(item.date)}{" "}
            · {goalLabels[item.goal]}
          </span>
          {item.campaign ? (
            <span className="flex items-center gap-1.25 text-xs leading-[1.35] font-medium">
              <Flag aria-hidden="true" className="size-3 shrink-0" />
              {item.campaign}
            </span>
          ) : null}
        </>
      )}
    </button>
  );
}
