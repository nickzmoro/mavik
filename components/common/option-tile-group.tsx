import { cn } from "@/lib/utils";

export type OptionTile = {
  id: string;
  label: string;
  description: string;
};

type OptionTileGroupProps = {
  id: string;
  label: React.ReactNode;
  options: OptionTile[];
  isSelected: (optionId: string) => boolean;
  onToggle: (optionId: string) => void;
  minTileWidth: number;
  tileClassName?: string;
};

export function OptionTileGroup({
  id,
  label,
  options,
  isSelected,
  onToggle,
  minTileWidth,
  tileClassName,
}: OptionTileGroupProps) {
  return (
    <div role="group" aria-labelledby={id} className="flex flex-col gap-2">
      <span id={id} className="text-sm leading-[1.4] font-semibold">
        {label}
      </span>
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(min(${minTileWidth}px, 100%), 1fr))`,
        }}
      >
        {options.map((option) => {
          const isOptionSelected = isSelected(option.id);

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isOptionSelected}
              onClick={() => onToggle(option.id)}
              className={cn(
                "tile flex min-h-16 cursor-pointer flex-col items-start gap-0.5 rounded-(--r-lg) px-3.5 py-2.5 text-left text-text transition-[border-color,background-color] duration-150 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none",
                isOptionSelected &&
                  "border-primary shadow-[inset_0_0_0_1px_var(--primary)] hover:border-primary",
                tileClassName,
              )}
            >
              <span className="text-sm leading-[1.4] font-semibold">
                {option.label}
              </span>
              <span
                className={cn(
                  "text-xs leading-[1.4]",
                  isOptionSelected ? "text-primary" : "text-muted",
                )}
              >
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
