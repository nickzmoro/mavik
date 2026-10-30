import { Calendar } from "lucide-react";

import { contentFormatIcons } from "@/components/common/format-icons";
import { formatShortDate } from "@/lib/agenda-dates";
import { formatLabels } from "@/lib/content/content-labels";
import type { IdeaDateView } from "@/lib/ideas/idea-types";
import type { ContentFormat } from "@/lib/onboarding/constants";
import { cn } from "@/lib/utils";

export const getIdeaDateLabel = (ideaDate: IdeaDateView) =>
  ideaDate.isTrend
    ? "Tendência do setor"
    : `${ideaDate.name} · ${formatShortDate(ideaDate.date)}`;

export function IdeaTagChip({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "chip-surface inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.75 text-xs leading-[1.4] font-medium",
        className,
      )}
      {...props}
    />
  );
}

export function IdeaFormatChip({ format }: { format: ContentFormat }) {
  const FormatIcon = contentFormatIcons[format];

  return (
    <IdeaTagChip className="font-semibold text-text">
      <FormatIcon aria-hidden="true" className="size-3.5" />
      {formatLabels[format]}
    </IdeaTagChip>
  );
}

export function IdeaDateChip({
  ideaDate,
  hasIcon = true,
}: {
  ideaDate: IdeaDateView;
  hasIcon?: boolean;
}) {
  return (
    <span className="date-chip inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.75 text-xs leading-[1.4] font-semibold">
      {hasIcon ? <Calendar aria-hidden="true" className="size-3" /> : null}
      {getIdeaDateLabel(ideaDate)}
    </span>
  );
}
