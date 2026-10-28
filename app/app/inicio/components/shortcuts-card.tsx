import {
  ChevronRight,
  Lightbulb,
  Megaphone,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { routes } from "@/lib/routes";

import { HomeSectionTitle } from "./home-section-title";

type Shortcut = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const shortcuts: Shortcut[] = [
  {
    title: "Post surpresa",
    description: "Sem ideia? O agente escolhe o tema.",
    href: routes.ideas,
    icon: Lightbulb,
  },
  {
    title: "Criar campanha",
    description: "Vários posts com um só objetivo.",
    href: routes.schedule,
    icon: Megaphone,
  },
  {
    title: "Falar com o agente",
    description: "Peça ajustes, ideias ou um plano.",
    href: routes.agent,
    icon: MessageCircle,
  },
];

export function ShortcutsCard() {
  return (
    <section
      aria-labelledby="shortcuts-title"
      className="glass flex flex-col gap-2 rounded-3xl px-3 pt-5 pb-3"
    >
      <HomeSectionTitle id="shortcuts-title" className="px-3 pb-1">
        Atalhos
      </HomeSectionTitle>
      {shortcuts.map(({ title, description, href, icon: Icon }) => (
        <Link
          key={title}
          href={href}
          className="flex min-h-16 items-center gap-3.5 rounded-(--r-lg) px-3 py-2 text-text no-underline transition-colors duration-150 hover:bg-white/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none dark:hover:bg-white/6"
        >
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-(--r-md) bg-white text-primary shadow-(--shadow-sm) dark:border dark:border-white/8 dark:bg-white/8 dark:shadow-none"
          >
            <Icon className="size-4.5" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm leading-[1.4] font-semibold">{title}</span>
            <span className="text-sm leading-[1.4] text-muted">
              {description}
            </span>
          </span>
          <ChevronRight
            aria-hidden="true"
            className="size-4 shrink-0 text-muted"
          />
        </Link>
      ))}
    </section>
  );
}
