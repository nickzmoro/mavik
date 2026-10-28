"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bot } from "lucide-react";
import { useForm } from "react-hook-form";

import { mockCurrentStore } from "@/lib/mocks/sidebar";
import {
  agentMessageFormSchema,
  type AgentMessageFormValues,
} from "@/lib/validations/agent";

import { AgentComposer } from "./agent-composer";
import { AgentEmptyState } from "./agent-empty-state";

type AgentChatProps = {
  welcomeTitle: React.ReactNode;
};

export function AgentChat({ welcomeTitle }: AgentChatProps) {
  const form = useForm<AgentMessageFormValues>({
    resolver: zodResolver(agentMessageFormSchema),
    defaultValues: { message: "" },
  });

  const handlePickStarter = (starter: string) => {
    form.setValue("message", starter);
    form.setFocus("message");
  };

  return (
    <section
      aria-labelledby="chat-title"
      className="glass flex min-h-[min(760px,calc(100dvh-7rem))] min-w-0 flex-col overflow-hidden rounded-3xl xl:min-h-0 xl:flex-[2_1_520px]"
    >
      <div className="flex items-center gap-3 border-b border-text/10 px-5 py-4">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-accent text-(--violet-900)"
        >
          <Bot className="size-5" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <h2
            id="chat-title"
            className="m-0 font-display text-base leading-[1.4] font-semibold"
          >
            Nova conversa
          </h2>
          <span className="flex items-center gap-1.5 text-xs leading-[1.4] font-medium text-muted">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full bg-success"
            />
            <span className="truncate">
              Usando o contexto do {mockCurrentStore.name}
            </span>
          </span>
        </div>
      </div>

      <div className="scrollbar-subtle flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-8 sm:px-6">
        <AgentEmptyState
          welcomeTitle={welcomeTitle}
          onPickStarter={handlePickStarter}
        />
      </div>

      <AgentComposer form={form} />
    </section>
  );
}
