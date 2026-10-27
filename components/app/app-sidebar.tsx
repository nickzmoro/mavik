import {
  BarChart3,
  Bot,
  CalendarDays,
  House,
  Layers,
  Lightbulb,
  Palette,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
};

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Menu",
    items: [
      { href: routes.authenticatedHome, label: "Início", icon: House },
      { label: "Agente", icon: Bot },
      { label: "Ideias", icon: Lightbulb },
      { href: routes.studio, label: "Estúdio", icon: Layers },
      { label: "Calendário", icon: CalendarDays },
      { label: "Resultados", icon: BarChart3 },
      { href: routes.brand, label: "Marca", icon: Palette },
    ],
  },
];

const itemClassName =
  "flex min-h-11 items-center gap-3 rounded-(--r-md) px-3 text-sm font-medium whitespace-nowrap no-underline";

export function AppSidebar({ activeHref }: { activeHref: string }) {
  return (
    <aside className="flex items-center gap-4 rounded-[24px] bg-primary-brand p-4 text-white shadow-(--shadow-md) lg:sticky lg:top-4 lg:h-[calc(100vh-32px)] lg:flex-col lg:items-stretch lg:gap-8 lg:overflow-y-auto lg:p-5">
      <Link
        href={routes.authenticatedHome}
        className="flex-none rounded-(--r-sm) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Image
          src="/mavik-logo-dark.webp"
          alt="Mavik"
          width={2843}
          height={735}
          className="block h-7 w-auto"
        />
      </Link>

      <nav
        aria-label="Menu principal"
        className="flex min-w-0 flex-1 gap-1 overflow-x-auto lg:flex-col lg:gap-6 lg:overflow-visible"
      >
        {navGroups.map((group) => (
          <div key={group.title} className="flex gap-1 lg:flex-col">
            <p className="m-0 mb-2 hidden px-3 text-xs leading-[1.4] font-medium text-white/70 lg:block">
              {group.title}
            </p>
            <ul className="m-0 flex list-none gap-1 p-0 lg:flex-col">
              {group.items.map(({ href, label, icon: Icon }) => {
                const isActive = href === activeHref;

                return (
                  <li key={label}>
                    {href ? (
                      <Link
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          itemClassName,
                          "text-white/85 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none",
                          isActive && "bg-white/15 font-semibold text-white",
                        )}
                      >
                        <Icon size={20} aria-hidden="true" />
                        <span className="sr-only sm:not-sr-only">{label}</span>
                      </Link>
                    ) : (
                      <span
                        aria-disabled="true"
                        className={cn(
                          itemClassName,
                          "cursor-not-allowed text-white/50",
                        )}
                      >
                        <Icon size={20} aria-hidden="true" />
                        <span className="sr-only sm:not-sr-only">{label}</span>
                        <span className="ml-auto hidden rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/70 sm:inline">
                          Em breve
                        </span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
