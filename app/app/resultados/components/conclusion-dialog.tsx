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
import type { Conclusion } from "@/lib/mocks/results";

import { EvidenceBadge } from "./evidence-badge";
import { StrengthMeter } from "./strength-meter";

type ConclusionDialogProps = {
  conclusion: Conclusion;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onRunAction: (conclusionId: string) => void;
};

export function ConclusionDialog({
  conclusion,
  open,
  onOpenChange,
  onRunAction,
}: ConclusionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-145">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Entenda esta conclusão</DialogTitle>
          <DialogDescription>
            Como o agente chegou nela e o quanto dá para confiar.
          </DialogDescription>
        </DialogHeader>

        <div className="scrollbar-subtle flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7">
          <div className="tile flex flex-col gap-2.5 rounded-[18px] p-4">
            <EvidenceBadge
              kind={conclusion.kind}
              hasIcon={false}
              className="self-start"
            />
            <p className="m-0 font-display text-[17px] leading-[1.45] font-semibold">
              {conclusion.text}
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="m-0 text-xs leading-[1.4] font-semibold text-primary">
              Em que se baseia
            </h3>
            <p className="m-0 text-sm leading-[1.55]">{conclusion.basis}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="m-0 text-xs leading-[1.4] font-semibold text-primary">
              Força da evidência
            </h3>
            <StrengthMeter strength={conclusion.strength} size="lg" />
            <div className="flex justify-between text-xs leading-[1.4] text-muted">
              <span>Baixa</span>
              <span>Média</span>
              <span>Alta</span>
            </div>
          </div>
          <div className="plan flex flex-col gap-1.5 rounded-(--r-lg) px-4 py-3.5">
            <h3 className="m-0 text-xs leading-[1.4] font-semibold text-primary">
              {conclusion.kind === "real"
                ? "Limites deste dado"
                : "Como confirmar"}
            </h3>
            <p className="m-0 text-sm leading-[1.55]">{conclusion.limit}</p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Entendi</Button>
          </DialogClose>
          <Button onClick={() => onRunAction(conclusion.id)}>
            {conclusion.cta}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
