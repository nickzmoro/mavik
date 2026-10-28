"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockDataSources, type DataSource } from "@/lib/mocks/results";
import { cn } from "@/lib/utils";

import { EvidenceBadge } from "./evidence-badge";

type DataSourcesDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isSourceConnected: (sourceId: DataSource["id"]) => boolean;
  onConnect: (source: DataSource) => void;
  onManage: (source: DataSource) => void;
};

export function DataSourcesDialog({
  open,
  onOpenChange,
  isSourceConnected,
  onConnect,
  onManage,
}: DataSourcesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-155">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Fontes de dados</DialogTitle>
          <DialogDescription>
            Quanto mais fontes, menos hipóteses. A Mavik só lê, nunca publica
            sem a sua aprovação.
          </DialogDescription>
        </DialogHeader>

        <ul className="scrollbar-subtle m-0 flex min-h-0 flex-1 list-none flex-col gap-2.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7">
          {mockDataSources.map((source) => {
            const isConnected = isSourceConnected(source.id);

            return (
              <li
                key={source.id}
                className="tile flex flex-wrap items-center gap-3.5 rounded-[18px] p-3.5"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-[14px] font-display text-[15px] font-bold",
                    source.badgeClassName,
                  )}
                >
                  {source.abbreviation}
                </span>
                <span className="flex min-w-0 flex-[1_1_220px] flex-col gap-0.5">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[15px] leading-[1.4] font-semibold">
                      {source.name}
                    </span>
                    <EvidenceBadge
                      kind={isConnected ? "real" : "none"}
                      label={isConnected ? "Conectado" : "Não conectado"}
                      hasIcon={false}
                      className="px-2 py-0.5"
                    />
                  </span>
                  <span className="text-[13px] leading-[1.45] text-muted">
                    {isConnected && source.connectedDescription
                      ? source.connectedDescription
                      : source.description}
                  </span>
                </span>
                <Button
                  variant={isConnected ? "ghost" : "default"}
                  onClick={() =>
                    isConnected ? onManage(source) : onConnect(source)
                  }
                >
                  {isConnected ? "Gerenciar" : "Conectar"}
                </Button>
              </li>
            );
          })}
        </ul>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
