import { FilterPill } from "@/components/common/filter-pill";

type PillGroupProps<TOption extends string | number> = {
  id: string;
  label: string;
  hint?: string;
  options: readonly TOption[];
  isSelected: (option: TOption) => boolean;
  onToggle: (option: TOption) => void;
  getLabel?: (option: TOption) => string;
  errorMessage?: string;
};

export function PillGroup<TOption extends string | number>({
  id,
  label,
  hint,
  options,
  isSelected,
  onToggle,
  getLabel = String,
  errorMessage,
}: PillGroupProps<TOption>) {
  return (
    <div role="group" aria-labelledby={id} className="flex flex-col gap-2">
      <span id={id} className="text-sm leading-[1.4] font-semibold">
        {label}
        {hint ? (
          <>
            {" "}
            <span className="font-normal text-muted">{hint}</span>
          </>
        ) : null}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <FilterPill
            key={option}
            size="lg"
            className="px-3.5"
            isActive={isSelected(option)}
            onClick={() => onToggle(option)}
          >
            {getLabel(option)}
          </FilterPill>
        ))}
      </div>
      {errorMessage ? (
        <p role="alert" className="m-0 text-sm leading-normal text-danger">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
