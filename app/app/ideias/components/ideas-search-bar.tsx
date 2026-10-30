import { Search, X } from "lucide-react";
import Link from "next/link";

import { IconButton } from "@/components/common/icon-button";
import { Input } from "@/components/ui/input";
import { getOnboardingStepRoute } from "@/lib/routes";

type IdeasSearchBarProps = {
  query: string;
  storeSegment: string;
  businessGoal: string | null;
  onQueryChange: (query: string) => void;
};

export function IdeasSearchBar({
  query,
  storeSegment,
  businessGoal,
  onQueryChange,
}: IdeasSearchBarProps) {
  const contextChips = [storeSegment, businessGoal].filter(
    (chip): chip is string => Boolean(chip),
  );

  return (
    <section
      aria-label="Busca e contexto"
      className="glass flex flex-wrap items-center gap-3 rounded-3xl p-3"
    >
      <div className="composer flex min-w-0 flex-[1_1_340px] items-center gap-1 rounded-2xl py-1 pr-1.5 pl-3.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus">
        <Search aria-hidden="true" className="size-4.5 shrink-0 text-muted" />
        <Input
          type="search"
          aria-label="Buscar ideias"
          placeholder="Buscar ideias por tema, formato ou palavra"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="min-w-0 flex-1 border-transparent bg-transparent pl-1 not-disabled:hover:border-transparent focus-visible:border-transparent focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query ? (
          <IconButton label="Limpar busca" onClick={() => onQueryChange("")}>
            <X />
          </IconButton>
        ) : null}
      </div>
      {contextChips.length > 0 ? (
        <div className="flex flex-[1_1_360px] flex-wrap items-center gap-1.5 px-1.5">
          <span className="mr-0.5 text-xs leading-[1.4] font-medium text-muted">
            Ideias para:
          </span>
          {contextChips.map((chip) => (
            <span
              key={chip}
              className="chip-surface rounded-full px-2.5 py-1 text-[13px] leading-[1.4] font-medium"
            >
              {chip}
            </span>
          ))}
          <Link
            href={getOnboardingStepRoute(1)}
            className="ml-1 rounded-(--r-sm) text-sm leading-[1.4] font-semibold text-primary no-underline transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
          >
            Ajustar
          </Link>
        </div>
      ) : null}
    </section>
  );
}
