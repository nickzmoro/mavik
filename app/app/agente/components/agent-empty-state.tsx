"use client";

import {
  Bot,
  Calendar,
  ChartColumn,
  Lightbulb,
  MessageCircle,
  Target,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { mockAgentConversations } from "@/lib/mocks/agent";
import { mockCurrentStore } from "@/lib/mocks/sidebar";
import { getAgentConversationRoute } from "@/lib/routes";

import { useAgentHistory } from "./agent-history-provider";

type ConversationStarter = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const conversationStarters: ConversationStarter[] = [
  {
    title: "O que postar esta semana?",
    description: "Ideias de posts para os próximos dias",
    icon: Calendar,
  },
  {
    title: "Monte um plano para dezembro",
    description: "Campanha com datas e formatos",
    icon: Lightbulb,
  },
  {
    title: "Como me diferenciar da concorrência?",
    description: "O que só o Aurora tem para contar",
    icon: Target,
  },
  {
    title: "Analisar os resultados de setembro",
    description: "O que funcionou e vale repetir",
    icon: ChartColumn,
  },
];

const recentConversations = mockAgentConversations
  .filter((conversation) => conversation.group === "Hoje")
  .slice(0, 2);

type AgentEmptyStateProps = {
  welcomeTitle: React.ReactNode;
  onPickStarter: (starter: string) => void;
};

export function AgentEmptyState({
  welcomeTitle,
  onPickStarter,
}: AgentEmptyStateProps) {
  const { openHistory } = useAgentHistory();

  return (
    <div className="my-auto flex w-full flex-col items-center gap-8">
      <div className="flex max-w-130 flex-col items-center gap-3.5 text-center">
        <span
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-[22px] bg-accent text-(--violet-900) shadow-[0_12px_28px_rgba(89,38,200,.25)]"
        >
          <Bot className="size-7.5" />
        </span>
        {welcomeTitle}
        <p className="m-0 text-[15px] leading-[1.6] text-muted">
          Eu conheço o {mockCurrentStore.name} e cuido do planejamento de
          conteúdo. Peça uma ideia, um plano ou uma análise. Nada é publicado
          sem a sua aprovação.
        </p>
      </div>

      <div className="grid w-full max-w-160 grid-cols-1 gap-3 sm:grid-cols-2">
        {conversationStarters.map(({ title, description, icon: Icon }) => (
          <button
            key={title}
            type="button"
            onClick={() => onPickStarter(title)}
            className="tile flex min-h-22 cursor-pointer items-start gap-3 rounded-[20px] p-4 text-left text-text transition-[border-color,background-color,transform] duration-150 hover:-translate-y-px hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-(--r-md) bg-surface-2 text-primary"
            >
              <Icon className="size-5" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-sm leading-[1.4] font-semibold">
                {title}
              </span>
              <span className="text-[13px] leading-[1.4] text-muted">
                {description}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="flex w-full max-w-160 flex-col gap-1">
        <div className="flex items-center justify-between gap-3 px-3">
          <h3 className="m-0 text-xs leading-[1.4] font-semibold text-muted">
            Continue de onde parou
          </h3>
          <button
            type="button"
            onClick={openHistory}
            className="min-h-8 cursor-pointer rounded-(--r-sm) border-0 bg-transparent px-1 text-sm font-semibold text-primary transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
          >
            Ver todas
          </button>
        </div>
        {recentConversations.map((conversation) => (
          <Link
            key={conversation.id}
            href={getAgentConversationRoute(conversation.id)}
            className="flex min-h-12 items-center gap-3 rounded-[14px] px-3 py-1.5 text-text no-underline transition-colors duration-150 hover:bg-hover-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
          >
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-surface-2 text-primary"
            >
              <MessageCircle className="size-4" />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm leading-[1.4] font-medium">
              {conversation.title}
            </span>
            <span className="shrink-0 text-xs leading-[1.4] text-muted">
              {conversation.group}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
