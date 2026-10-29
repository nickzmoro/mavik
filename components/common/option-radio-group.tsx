import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export type RadioOption = {
  value: string;
  label: string;
  description?: string;
};

type OptionRadioGroupProps = {
  value: string | undefined;
  onValueChange: (value: string) => void;
  options: readonly RadioOption[];
  ariaLabel: string;
  className?: string;
};

export function OptionRadioGroup({
  value,
  onValueChange,
  options,
  ariaLabel,
  className,
}: OptionRadioGroupProps) {
  return (
    <RadioGroup
      value={value ?? ""}
      onValueChange={onValueChange}
      aria-label={ariaLabel}
      className={cn("gap-3", className)}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className="tile flex min-h-14 cursor-pointer items-center gap-3 rounded-(--r-md) px-4 py-3 text-[15px] leading-normal transition-[border-color,background-color] duration-150 hover:border-accent has-data-[state=checked]:border-primary has-data-[state=checked]:bg-brand-selected has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus motion-reduce:transition-none"
        >
          <RadioGroupItem value={option.value} />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span>{option.label}</span>
            {option.description ? (
              <small className="text-[13px] leading-[1.4] text-muted">
                {option.description}
              </small>
            ) : null}
          </span>
        </label>
      ))}
    </RadioGroup>
  );
}
