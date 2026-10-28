import { cn } from "@/lib/utils";

type SegmentedOption<TValue extends string> = {
  value: TValue;
  label: string;
  isDisabled?: boolean;
  title?: string;
};

type SegmentedControlProps<TValue extends string> = {
  label: string;
  options: SegmentedOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  className?: string;
  itemClassName?: string;
};

export function SegmentedControl<TValue extends string>({
  label,
  options,
  value,
  onChange,
  className,
  itemClassName,
}: SegmentedControlProps<TValue>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex gap-0.5 rounded-full bg-[rgba(127,117,160,.12)] p-0.75",
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            disabled={option.isDisabled}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-9 cursor-pointer rounded-full border-0 px-3.5 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
              isActive
                ? "bg-bg font-semibold text-text shadow-[0_1px_3px_rgba(26,15,60,.15)]"
                : "bg-transparent font-medium text-muted not-disabled:hover:text-text",
              itemClassName,
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
