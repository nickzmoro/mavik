import {
  Bot,
  Calendar,
  ChartColumn,
  House,
  Images,
  Layers,
  Lightbulb,
  Palette,
  type LucideIcon,
} from "lucide-react";

import { routes } from "@/lib/routes";
import { mockAgentSuggestionsCount } from "@/lib/mocks/sidebar";

export type SidebarNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badgeCount?: number;
  badgeLabel?: string;
};

export type SidebarNavGroup = {
  label?: string;
  items: SidebarNavItem[];
};

export const sidebarNavGroups: SidebarNavGroup[] = [
  {
    items: [{ label: "Início", href: routes.authenticatedHome, icon: House }],
  },
  {
    label: "Criar",
    items: [
      {
        label: "Agente",
        href: routes.agent,
        icon: Bot,
        badgeCount: mockAgentSuggestionsCount,
        badgeLabel: `${mockAgentSuggestionsCount} sugestões novas`,
      },
      { label: "Ideias", href: routes.ideas, icon: Lightbulb },
      { label: "Estúdio", href: routes.studio, icon: Layers },
      { label: "Artes", href: routes.artworks, icon: Images },
    ],
  },
  {
    label: "Planejar",
    items: [
      { label: "Agenda", href: routes.schedule, icon: Calendar },
      { label: "Resultados", href: routes.results, icon: ChartColumn },
    ],
  },
  {
    label: "Sua loja",
    items: [{ label: "Marca", href: routes.brand, icon: Palette }],
  },
];
