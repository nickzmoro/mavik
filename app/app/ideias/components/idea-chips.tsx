import { Calendar } from "lucide-react";

import { contentFormatIcons } from "@/components/common/format-icons";
import {
  mockIdeaDates,
  type IdeaDateKey,
  type IdeaFormat,
} from "@/lib/mocks/ideas";
import { cn } from "@/lib/utils";

export const getIdeaDateLabel = (dateKey: IdeaDateKey) => {
  const ideaDate = mockIdeaDates.find((date) => date.key === dateKey);

  if (!ideaDate) {
    return "";
  }

  return ideaDate.isTrend
    ? "Tendência do setor"
    : `${ideaDate.name} · ${ideaDate.day}`;
};

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

export function IdeaFormatChip({ format }: { format: IdeaFormat }) {
  const FormatIcon = contentFormatIcons[format];

  return (
    <IdeaTagChip className="font-semibold text-text">
      <FormatIcon aria-hidden="true" className="size-3.5" />
      {format}
    </IdeaTagChip>
  );
}

export function IdeaDateChip({
  dateKey,
  hasIcon = true,
}: {
  dateKey: IdeaDateKey;
  hasIcon?: boolean;
}) {
  return (
    <span className="date-chip inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.75 text-xs leading-[1.4] font-semibold">
      {hasIcon ? <Calendar aria-hidden="true" className="size-3" /> : null}
      {getIdeaDateLabel(dateKey)}
    </span>
  );
}
