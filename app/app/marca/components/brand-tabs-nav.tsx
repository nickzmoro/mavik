import Link from "next/link";

import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export const brandTabs = [
  { id: "empresa", label: "Empresa" },
  { id: "brand-kit", label: "Brand Kit" },
  { id: "voz", label: "Voz e público" },
  { id: "regras", label: "Regras" },
] as const;

export type BrandTabId = (typeof brandTabs)[number]["id"];

export function BrandTabsNav({ activeTab }: { activeTab: BrandTabId }) {
  return (
    <nav aria-label="Seções da marca" className="mt-6 overflow-x-auto">
      <ul className="m-0 flex w-max list-none gap-2 p-0">
        {brandTabs.map(({ id, label }) => {
          const isActive = id === activeTab;

          return (
            <li key={id}>
              <Link
                href={`${routes.brand}?aba=${id}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center rounded-full px-4 font-display text-sm font-semibold whitespace-nowrap no-underline transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none",
                  isActive
                    ? "bg-primary text-on-primary"
                    : "bg-surface-2 text-text hover:bg-(--violet-200)",
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
