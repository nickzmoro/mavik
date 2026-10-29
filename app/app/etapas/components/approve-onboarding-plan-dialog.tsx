"use client";

import { Check } from "lucide-react";

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

type ApproveOnboardingPlanDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  contentsCount: number;
  formatsCount: number;
  isApproving: boolean;
  onApprove: () => void;
};

export function ApproveOnboardingPlanDialog({
  open,
  onOpenChange,
  contentsCount,
  formatsCount,
  isApproving,
  onApprove,
}: ApproveOnboardingPlanDialogProps) {
  const planStats = [
    { label: "Conteúdos", value: contentsCount },
    { label: "Formatos", value: formatsCount },
    { label: "Período", value: "30 dias" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-130">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Aprovar o plano de 30 dias?</DialogTitle>
          <DialogDescription>
            As pautas entram na sua Agenda como ideias, prontas para virar
            artes. Você ainda pode ajustar cada uma depois.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4.5 px-5 pt-4.5 pb-5 sm:px-7">
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
          <p className="m-0 text-[13px] leading-normal text-muted">
            Nada é publicado sem a sua aprovação final, conteúdo por conteúdo.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Revisar mais</Button>
          </DialogClose>
          <Button loading={isApproving} onClick={onApprove}>
            <Check aria-hidden="true" className="size-4.5" />
            Aprovar plano
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
