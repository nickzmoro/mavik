import { Check } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";
import { studioPlans } from "@/lib/mocks/studio";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

import { formatArtCount } from "../hooks/use-studio";

type TrialLimitDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  artLimit: number;
};

export function TrialLimitDialog({
  open,
  onOpenChange,
  artLimit,
}: TrialLimitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-150">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Você usou suas {artLimit} artes grátis</DialogTitle>
          <DialogDescription>
            As artes que você criou continuam salvas. Para criar novas, escolha
            um plano.
          </DialogDescription>
        </DialogHeader>
        <div className="scrollbar-subtle flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7">
          <div className="tile flex flex-col gap-2 rounded-(--r-lg) px-3.5 py-3">
            <span className="flex justify-between gap-2 text-[13px] leading-[1.4] font-semibold">
              Teste grátis
              <span>
                {artLimit} de {formatArtCount(artLimit)}
              </span>
            </span>
            <Progress
              value={artLimit}
              max={artLimit}
              aria-label="Artes grátis usadas"
            />
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] gap-3">
            {studioPlans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "flex flex-col gap-2 rounded-[20px] p-4.5",
                  plan.badge ? "plan" : "tile",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-display text-[17px] leading-[1.3] font-semibold">
                    {plan.name}
                  </span>
                  {plan.badge ? (
                    <Badge variant="secondary">{plan.badge}</Badge>
                  ) : null}
                </span>
                <span className="font-display text-2xl leading-[1.2] font-bold">
                  {plan.price}
                  <span className="text-[13px] font-medium text-muted">
                    /mês
                  </span>
                </span>
                <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-sm leading-[1.45]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <Check
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-success"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Agora não</Button>
          </DialogClose>
          <Button asChild>
            <Link href={routes.plans}>Ver planos</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
