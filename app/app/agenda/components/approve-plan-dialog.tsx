"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type ApprovePlanDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  monthName: string;
  contentsCount: number;
  campaignsCount: number;
  focusPercentage: number;
  onApprove: () => void;
};

export function ApprovePlanDialog({
  open,
  onOpenChange,
  monthName,
  contentsCount,
  campaignsCount,
  focusPercentage,
  onApprove,
}: ApprovePlanDialogProps) {
  const planStats = [
    { label: "Conteúdos", value: contentsCount },
    { label: "Campanhas", value: campaignsCount },
    { label: "Na quinta a sábado", value: `${focusPercentage}%` },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-130">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Aprovar o plano de {monthName}?</DialogTitle>
          <DialogDescription>
            Os conteúdos passam para “Em produção” e o agente começa a preparar
            artes e legendas.
          </DialogDescription>
        </DialogHeader>
        <div className="scrollbar-subtle flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7">
          <dl className="tile m-0 grid grid-cols-3 gap-3 rounded-(--r-lg) px-4 py-3.5 text-center">
            {planStats.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs leading-[1.4] text-muted">{label}</dt>
                <dd className="m-0 font-display text-2xl leading-[1.2] font-bold">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="flex items-start gap-2.5">
            <Checkbox id="approve-plan-notify" defaultChecked />
            <Label
              htmlFor="approve-plan-notify"
              className="cursor-pointer leading-normal font-normal"
            >
              Me avisar quando cada conteúdo estiver pronto para revisão
            </Label>
          </div>
          <p className="m-0 text-[13px] leading-normal text-muted">
            Nada é publicado sem a sua aprovação final, conteúdo por conteúdo.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Revisar mais</Button>
          </DialogClose>
          <Button onClick={onApprove}>
            <Check aria-hidden="true" className="size-4.5" />
            Aprovar plano
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
