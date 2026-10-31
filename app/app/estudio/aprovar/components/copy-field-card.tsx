import { LoaderCircle, RefreshCw } from "lucide-react";
import { useId } from "react";

import { Switch } from "@/components/ui/switch";

type CopyFieldCardProps = {
  title: string;
  isInArt?: boolean;
  onIsInArtChange?: (isInArt: boolean) => void;
  note?: string;
  isRegenerating: boolean;
  isRegenerateDisabled: boolean;
  onRegenerate: () => void;
  children: React.ReactNode;
};

export function CopyFieldCard({
  title,
  isInArt,
  onIsInArtChange,
  note,
  isRegenerating,
  isRegenerateDisabled,
  onRegenerate,
  children,
}: CopyFieldCardProps) {
  const titleId = useId();
  const switchId = useId();

  return (
    <section
      aria-labelledby={titleId}
      aria-busy={isRegenerating}
      className="flex flex-col gap-3 rounded-(--r-lg) border border-border bg-bg/70 p-4 dark:bg-white/4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3
          id={titleId}
          className="m-0 font-display text-sm leading-[1.4] font-semibold"
        >
          {title}
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          {onIsInArtChange ? (
            <label
              htmlFor={switchId}
              className="inline-flex min-h-9 cursor-pointer items-center gap-2 text-xs leading-[1.4] font-medium text-muted"
            >
              <Switch
                id={switchId}
                checked={isInArt}
                onCheckedChange={onIsInArtChange}
              />
              Vai na arte
            </label>
          ) : (
            <span className="text-xs leading-[1.4] font-medium text-muted">
              {note}
            </span>
          )}
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerateDisabled}
            className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border-0 bg-transparent px-2.5 text-[13px] font-semibold text-primary transition-colors duration-150 not-disabled:hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
          >
            {isRegenerating ? (
              <LoaderCircle
                aria-hidden="true"
                className="size-3.5 animate-spin motion-reduce:animate-none"
              />
            ) : (
              <RefreshCw aria-hidden="true" className="size-3.5" />
            )}
            {isRegenerating ? "Gerando…" : "Gerar outra opção"}
          </button>
        </div>
      </div>
      {children}
    </section>
  );
}
