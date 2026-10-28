"use client";

import { Archive, MessageCircle, Pin, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { FilterPill } from "@/components/common/filter-pill";
import { IconButton } from "@/components/common/icon-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  mockAgentConversations,
  type AgentConversation,
} from "@/lib/mocks/agent";
import { getAgentConversationRoute, routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type HistoryFilter = "all" | "pinned" | "campaigns" | "archived";

const groupOrder = [
  "Fixadas",
  "Hoje",
  "Esta semana",
  "Setembro",
  "Outubro",
  "Arquivadas",
];

const emptyStateCopy: Record<HistoryFilter, { title: string; help: string }> = {
  all: {
    title: "Nenhuma conversa ainda",
    help: "Quando você conversar com o agente, o histórico fica aqui.",
  },
  pinned: {
    title: "Nenhuma conversa fixada",
    help: "Fixe uma conversa para tê-la sempre no topo.",
  },
  campaigns: {
    title: "Nenhuma conversa ainda",
    help: "Quando você conversar com o agente, o histórico fica aqui.",
  },
  archived: {
    title: "Nada arquivado por aqui",
    help: "Conversas arquivadas aparecem aqui e podem ser restauradas.",
  },
};

const matchesFilter = (
  conversation: AgentConversation,
  filter: HistoryFilter,
) => {
  if (filter === "archived") {
    return conversation.isArchived;
  }

  if (conversation.isArchived) {
    return false;
  }

  if (filter === "pinned") {
    return conversation.isPinned;
  }

  if (filter === "campaigns") {
    return conversation.tag === "Campanha";
  }

  return true;
};

const matchesQuery = (conversation: AgentConversation, query: string) =>
  !query ||
  `${conversation.title} ${conversation.snippet} ${conversation.tag}`
    .toLowerCase()
    .includes(query);

const getGroupLabel = (
  conversation: AgentConversation,
  filter: HistoryFilter,
) => {
  if (filter === "archived") {
    return "Arquivadas";
  }

  return conversation.isPinned ? "Fixadas" : conversation.group;
};

type ConversationRowProps = {
  conversation: AgentConversation;
  isCurrent: boolean;
  onNavigate: () => void;
  onTogglePin: () => void;
  onToggleArchive: () => void;
};

function ConversationRow({
  conversation,
  isCurrent,
  onNavigate,
  onTogglePin,
  onToggleArchive,
}: ConversationRowProps) {
  return (
    <li className="flex items-center gap-0.5 rounded-2xl pr-1 transition-colors duration-150 hover:bg-hover-subtle motion-reduce:transition-none">
      <Link
        href={getAgentConversationRoute(conversation.id)}
        onClick={onNavigate}
        className="flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-[14px] px-3 py-2 text-text no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-(--r-md) bg-surface-2 text-primary"
        >
          <MessageCircle className="size-4.5" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm leading-[1.4] font-semibold">
              {conversation.title}
            </span>
            {isCurrent ? <Badge variant="secondary">Atual</Badge> : null}
          </span>
          <span className="truncate text-[13px] leading-[1.4] text-muted">
            {conversation.snippet}
          </span>
        </span>
        <span className="shrink-0 text-xs leading-[1.4] text-muted">
          {conversation.when}
        </span>
      </Link>
      <IconButton
        label={`${conversation.isPinned ? "Desafixar" : "Fixar"} ${conversation.title}`}
        aria-pressed={conversation.isPinned}
        onClick={onTogglePin}
        className={cn(conversation.isPinned && "text-primary")}
      >
        <Pin fill={conversation.isPinned ? "currentColor" : "none"} />
      </IconButton>
      <IconButton
        label={`${conversation.isArchived ? "Desarquivar" : "Arquivar"} ${conversation.title}`}
        onClick={onToggleArchive}
      >
        <Archive />
      </IconButton>
    </li>
  );
}

type ConversationHistoryDialogProps = {
  currentConversationId?: string;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function ConversationHistoryDialog({
  currentConversationId,
  open,
  onOpenChange,
}: ConversationHistoryDialogProps) {
  const [conversations, setConversations] = useState(mockAgentConversations);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<HistoryFilter>("all");

  const normalizedQuery = query.trim().toLowerCase();
  const activeConversations = conversations.filter(
    (conversation) => !conversation.isArchived,
  );

  const filters: { id: HistoryFilter; label: string; count: number }[] = [
    { id: "all", label: "Todas", count: activeConversations.length },
    {
      id: "pinned",
      label: "Fixadas",
      count: activeConversations.filter((conversation) => conversation.isPinned)
        .length,
    },
    {
      id: "campaigns",
      label: "Campanhas",
      count: activeConversations.filter(
        (conversation) => conversation.tag === "Campanha",
      ).length,
    },
    {
      id: "archived",
      label: "Arquivadas",
      count: conversations.filter((conversation) => conversation.isArchived)
        .length,
    },
  ];

  const visibleConversations = conversations.filter(
    (conversation) =>
      matchesFilter(conversation, filter) &&
      matchesQuery(conversation, normalizedQuery),
  );

  const groupedConversations = groupOrder
    .map((groupLabel) => ({
      label: groupLabel,
      items: visibleConversations.filter(
        (conversation) => getGroupLabel(conversation, filter) === groupLabel,
      ),
    }))
    .filter((group) => group.items.length > 0);

  const updateConversation = (
    conversationId: string,
    getChanges: (conversation: AgentConversation) => Partial<AgentConversation>,
  ) =>
    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, ...getChanges(conversation) }
          : conversation,
      ),
    );

  const closeDialog = () => onOpenChange(false);
  const emptyState = normalizedQuery
    ? {
        title: "Nenhuma conversa encontrada",
        help: "Tente outra palavra ou mude o filtro para ver mais conversas.",
      }
    : emptyStateCopy[filter];
  const conversationCount = visibleConversations.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-170">
        <DialogHeader>
          <DialogTitle>Conversas anteriores</DialogTitle>
          <DialogDescription>
            Retome uma conversa ou busque por um assunto.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 px-5 pt-3.5 sm:px-7">
          <div className="composer flex items-center gap-1 rounded-2xl py-1 pr-1.5 pl-3.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus">
            <Search
              aria-hidden="true"
              className="size-4.5 shrink-0 text-muted"
            />
            <Input
              type="search"
              aria-label="Buscar conversas"
              placeholder="Buscar por título ou assunto"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 border-transparent bg-transparent pl-1 not-disabled:hover:border-transparent focus-visible:border-transparent focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <IconButton label="Limpar busca" onClick={() => setQuery("")}>
                <X />
              </IconButton>
            ) : null}
          </div>
          <div
            role="group"
            aria-label="Filtrar conversas"
            className="flex flex-wrap gap-2"
          >
            {filters.map((filterOption) => (
              <FilterPill
                key={filterOption.id}
                isActive={filter === filterOption.id}
                onClick={() => setFilter(filterOption.id)}
              >
                {filterOption.label}{" "}
                <span
                  className={cn(
                    "font-medium",
                    filter === filterOption.id ? "opacity-85" : "opacity-80",
                  )}
                >
                  {filterOption.count}
                </span>
              </FilterPill>
            ))}
          </div>
        </div>

        <div className="scrollbar-subtle mt-2 min-h-0 flex-1 overflow-y-auto py-2 pr-3 pl-3 sm:max-h-100 sm:pr-4 sm:pl-5">
          {groupedConversations.map((group) => (
            <section
              key={group.label}
              aria-label={group.label}
              className="flex flex-col gap-0.5 pb-1.5"
            >
              <h3 className="m-0 px-3 pt-2.5 pb-1 text-xs leading-[1.4] font-semibold text-muted">
                {group.label}
              </h3>
              <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
                {group.items.map((conversation) => (
                  <ConversationRow
                    key={conversation.id}
                    conversation={conversation}
                    isCurrent={conversation.id === currentConversationId}
                    onNavigate={closeDialog}
                    onTogglePin={() =>
                      updateConversation(conversation.id, (current) => ({
                        isPinned: !current.isPinned,
                      }))
                    }
                    onToggleArchive={() =>
                      updateConversation(conversation.id, (current) => ({
                        isArchived: !current.isArchived,
                        isPinned: false,
                      }))
                    }
                  />
                ))}
              </ul>
            </section>
          ))}
          {conversationCount === 0 ? (
            <div className="flex flex-col items-center gap-2.5 px-6 py-10 text-center">
              <span
                aria-hidden="true"
                className="flex size-12 items-center justify-center rounded-2xl bg-surface-2 text-primary"
              >
                <Search className="size-5.5" />
              </span>
              <p className="m-0 font-display text-base leading-[1.4] font-semibold">
                {emptyState.title}
              </p>
              <p className="m-0 max-w-85 text-sm leading-normal text-muted">
                {emptyState.help}
              </p>
              {query ? (
                <Button variant="outline" onClick={() => setQuery("")}>
                  Limpar busca
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        <DialogFooter className="justify-between pr-5 pl-5 sm:pl-7">
          <span className="text-[13px] leading-[1.4] text-muted">
            {conversationCount}{" "}
            {conversationCount === 1 ? "conversa" : "conversas"}
          </span>
          <Button variant="secondary" asChild>
            <Link href={routes.agent} onClick={closeDialog}>
              <Plus aria-hidden="true" className="size-4.5" />
              Nova conversa
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
