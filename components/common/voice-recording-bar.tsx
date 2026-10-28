import { Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const waveBars = [
  { height: "40%", delay: "0s" },
  { height: "80%", delay: ".1s" },
  { height: "55%", delay: ".2s" },
  { height: "100%", delay: ".3s" },
  { height: "65%", delay: ".15s" },
  { height: "90%", delay: ".25s" },
  { height: "45%", delay: ".05s" },
  { height: "75%", delay: ".35s" },
  { height: "60%", delay: ".2s" },
  { height: "95%", delay: ".1s" },
  { height: "50%", delay: ".3s" },
  { height: "70%", delay: "0s" },
  { height: "40%", delay: ".2s" },
  { height: "85%", delay: ".15s" },
];

type VoiceRecordingBarProps = {
  elapsedLabel: string;
  onCancel: () => void;
  onFinish: () => void;
  className?: string;
};

export function VoiceRecordingBar({
  elapsedLabel,
  onCancel,
  onFinish,
  className,
}: VoiceRecordingBarProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 rounded-(--r-lg) bg-surface-2 py-1.5 pr-1.5 pl-3.5",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="size-2.5 shrink-0 animate-rec-pulse rounded-full bg-danger motion-reduce:animate-none"
      />
      <span className="text-sm leading-[1.4] font-semibold">
        Ouvindo…{" "}
        <span className="font-medium text-muted tabular-nums">
          {elapsedLabel}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="flex h-7 min-w-10 flex-1 items-center gap-0.75 overflow-hidden"
      >
        {waveBars.map(({ height, delay }, index) => (
          <span
            key={index}
            className="block w-1 shrink-0 animate-voice-wave rounded-xs bg-primary motion-reduce:animate-none"
            style={{ height, animationDelay: delay }}
          />
        ))}
      </span>
      <div className="flex items-center gap-1">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={onFinish}>
          <Square aria-hidden="true" className="size-4" />
          Usar fala
        </Button>
      </div>
    </div>
  );
}
