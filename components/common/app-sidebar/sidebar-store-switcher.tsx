import { ChevronsUpDown } from "lucide-react";

import { mockCurrentStore } from "@/lib/mocks/sidebar";

export function SidebarStoreSwitcher() {
  return (
    <button
      type="button"
      aria-label="Trocar de loja"
      className="relative flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-(--r-lg) border border-white/14 bg-white/8 px-2.5 py-2 text-left text-white transition-colors duration-150 hover:bg-white/14 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
    >
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#2e2a27] font-display text-sm font-semibold text-[#f4ede4]"
      >
        {mockCurrentStore.initials}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs leading-[1.4] font-medium text-(--violet-200)">
          Loja
        </span>
        <span className="truncate font-display text-sm leading-[1.3] font-semibold">
          {mockCurrentStore.name}
        </span>
      </span>
      <ChevronsUpDown
        aria-hidden="true"
        className="size-4 shrink-0 text-(--violet-200)"
      />
    </button>
  );
}
