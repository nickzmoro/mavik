import { FilterPill } from "@/components/common/filter-pill";

import type {
  IdeaFilterGroup,
  IdeaFilterKey,
} from "../hooks/use-ideas-library";

type IdeasFiltersProps = {
  filterGroups: IdeaFilterGroup[];
  filters: Record<IdeaFilterKey, string[]>;
  hasActiveFilters: boolean;
  onToggleFilter: (filterKey: IdeaFilterKey, option: string) => void;
  onClearFilters: () => void;
};

export function IdeasFilters({
  filterGroups,
  filters,
  hasActiveFilters,
  onToggleFilter,
  onClearFilters,
}: IdeasFiltersProps) {
  return (
    <aside
      aria-labelledby="filters-title"
      className="glass scrollbar-subtle box-border flex w-full min-w-0 flex-col gap-4.5 rounded-3xl p-5 xl:sticky xl:top-4 xl:max-h-[calc(100dvh-2rem)] xl:max-w-70 xl:flex-[1_1_240px] xl:overflow-y-auto"
    >
      <div className="flex items-center justify-between gap-2">
        <h2
          id="filters-title"
          className="m-0 font-display text-base leading-[1.4] font-semibold"
        >
          Filtros
        </h2>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="min-h-8 cursor-pointer rounded-(--r-sm) border-0 bg-transparent px-1 text-sm font-semibold text-primary transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
          >
            Limpar
          </button>
        ) : null}
      </div>
      {filterGroups.map((group) => (
        <div
          key={group.key}
          role="group"
          aria-label={group.label}
          className="flex flex-col gap-2"
        >
          <h3 className="m-0 text-xs leading-[1.4] font-semibold text-muted">
            {group.label}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {group.options.map((option) => (
              <FilterPill
                key={option.value}
                size="sm"
                isActive={filters[group.key].includes(option.value)}
                onClick={() => onToggleFilter(group.key, option.value)}
              >
                {option.label}
              </FilterPill>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
