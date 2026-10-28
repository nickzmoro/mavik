import { Bot, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

type IdeasHeaderProps = {
  onGenerateIdeas: () => void;
};

export function IdeasHeader({ onGenerateIdeas }: IdeasHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs leading-[1.4] font-semibold text-muted">
          Biblioteca de ideias
        </span>
        <h1 className="m-0 font-display text-[26px] leading-[1.2] font-bold sm:text-[32px]">
          Ideias
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href={routes.agent}>
            <Bot aria-hidden="true" className="size-4.5" />
            Pedir ao agente
          </Link>
        </Button>
        <Button onClick={onGenerateIdeas}>
          <Sparkles aria-hidden="true" className="size-4.5" />
          Gerar novas ideias
        </Button>
      </div>
    </header>
  );
}
