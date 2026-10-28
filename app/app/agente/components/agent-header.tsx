"use client";

import { History, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

import { useAgentHistory } from "./agent-history-provider";

export function AgentHeader() {
  const { openHistory } = useAgentHistory();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs leading-[1.4] font-semibold text-muted">
          Seu agente de marketing
        </span>
        <h1 className="m-0 font-display text-[26px] leading-[1.2] font-bold sm:text-[32px]">
          Agente
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" onClick={openHistory}>
          <History aria-hidden="true" className="size-4.5" />
          Conversas anteriores
        </Button>
        <Button variant="secondary" asChild>
          <Link href={routes.agent}>
            <Plus aria-hidden="true" className="size-4.5" />
            Nova conversa
          </Link>
        </Button>
      </div>
    </header>
  );
}
