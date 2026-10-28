"use client";

import { Bot } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { mockAgentSuggestion } from "@/lib/mocks/home";
import { routes } from "@/lib/routes";

export function AgentSuggestionCard() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <section
      aria-labelledby="agent-title"
      className="relative isolate flex flex-wrap items-center gap-4 overflow-hidden rounded-3xl border border-[rgba(179,144,250,.35)] bg-[rgba(239,232,253,.6)] px-6 py-5 shadow-(--glass-shadow) backdrop-blur-[24px] backdrop-saturate-160 dark:border-[rgba(179,144,250,.38)] dark:bg-[rgba(179,144,250,.12)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_12px_32px_rgba(89,38,200,.22)] dark:backdrop-saturate-140"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-45 -left-15 -z-10 hidden size-70 rounded-full bg-(--violet-500) opacity-35 blur-[80px] dark:block"
      />
      <span
        aria-hidden="true"
        className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-white text-primary shadow-(--shadow-sm) dark:bg-accent dark:text-(--violet-900) dark:shadow-none"
      >
        <Bot className="size-5" />
      </span>
      <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-0.5">
        <span className="text-xs leading-[1.4] font-semibold text-primary">
          Sugestão do agente
        </span>
        <h2
          id="agent-title"
          className="m-0 font-display text-base leading-[1.4] font-semibold"
        >
          {mockAgentSuggestion.title}
        </h2>
        <p className="m-0 text-sm leading-normal text-muted">
          {mockAgentSuggestion.description}
        </p>
      </div>
      <div className="flex flex-wrap gap-1">
        <Button variant="outline" asChild>
          <Link href={routes.ideas}>Revisar ideias</Link>
        </Button>
        <Button variant="ghost" onClick={() => setIsVisible(false)}>
          Depois
        </Button>
      </div>
    </section>
  );
}
