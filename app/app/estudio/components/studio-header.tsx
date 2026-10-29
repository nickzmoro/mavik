import { Bot } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockTrialUsage } from "@/lib/mocks/sidebar";
import { routes } from "@/lib/routes";

import { formatArtCount } from "../hooks/use-studio";

type StudioHeaderProps = {
  usedArts: number;
  artLimit: number;
};

export function StudioHeader({ usedArts, artLimit }: StudioHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs leading-[1.4] font-semibold text-muted">
          Criar com a sua marca
        </span>
        <h1 className="m-0 font-display text-[26px] leading-[1.2] font-bold sm:text-[32px]">
          Estúdio
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        {mockTrialUsage.isLimitEnabled ? (
          <div className="glass flex items-center gap-2.5 rounded-full px-3.5 py-2">
            <span className="text-[13px] leading-[1.4] font-semibold whitespace-nowrap">
              Teste grátis · {usedArts} de {formatArtCount(artLimit)}
            </span>
            <Progress
              value={usedArts}
              max={artLimit}
              aria-label="Artes grátis usadas"
              className="w-24"
            />
          </div>
        ) : null}
        <Button variant="ghost" asChild>
          <Link href={routes.agent}>
            <Bot aria-hidden="true" className="size-4.5" />
            Falar com o agente
          </Link>
        </Button>
      </div>
    </header>
  );
}
