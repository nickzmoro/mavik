"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  mockSaturdayLabels,
  storeTrafficTargetWeeks,
} from "@/lib/mocks/results";
import {
  storeTrafficFormSchema,
  type StoreTrafficFormValues,
} from "@/lib/validations/results";

const storeTrafficFormId = "store-traffic-form";

function StoreTrafficForm({
  savedSaturdaysCount,
  onSave,
}: {
  savedSaturdaysCount: number;
  onSave: (filledSaturdaysCount: number) => void;
}) {
  const form = useForm<StoreTrafficFormValues>({
    resolver: zodResolver(storeTrafficFormSchema),
    defaultValues: { saturdays: mockSaturdayLabels.map(() => "") },
  });
  const saturdays = useWatch({ control: form.control, name: "saturdays" });
  const filledSaturdaysCount = saturdays.filter(
    (value) => value.trim() !== "",
  ).length;
  const displayedCount = Math.max(filledSaturdaysCount, savedSaturdaysCount);

  return (
    <>
      <Form {...form}>
        <form
          id={storeTrafficFormId}
          noValidate
          onSubmit={form.handleSubmit(() => onSave(filledSaturdaysCount))}
          className="scrollbar-subtle m-0 flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7"
        >
          <div
            role="group"
            aria-labelledby="store-traffic-label"
            className="flex flex-col gap-2.5"
          >
            <span
              id="store-traffic-label"
              className="text-sm leading-[1.4] font-semibold"
            >
              Clientes atendidos aos sábados{" "}
              <span className="font-normal text-muted">
                (um número aproximado já ajuda)
              </span>
            </span>
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              {mockSaturdayLabels.map((saturdayLabel, saturdayIndex) => (
                <FormField
                  key={saturdayLabel}
                  control={form.control}
                  name={`saturdays.${saturdayIndex}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[13px] font-medium text-muted">
                        {saturdayLabel}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder="Ex.: 120"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
          <div className="tile flex flex-col gap-2 rounded-(--r-lg) px-3.5 py-3">
            <span className="flex items-center justify-between text-[13px] leading-[1.4] font-semibold">
              Semanas para comparar
              <span>
                {displayedCount} de {storeTrafficTargetWeeks}
              </span>
            </span>
            <Progress
              value={displayedCount}
              max={storeTrafficTargetWeeks}
              aria-label="Semanas informadas"
            />
            <span className="text-xs leading-normal text-muted">
              Com 8 sábados (4 com campanha e 4 sem), o agente consegue dizer se
              a diferença é real ou acaso.
            </span>
          </div>
        </form>
      </Form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancelar</Button>
        </DialogClose>
        <Button type="submit" form={storeTrafficFormId}>
          <Check aria-hidden="true" className="size-4.5" />
          Salvar
        </Button>
      </DialogFooter>
    </>
  );
}

type StoreTrafficDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  savedSaturdaysCount: number;
  onSave: (filledSaturdaysCount: number) => void;
};

export function StoreTrafficDialog({
  open,
  onOpenChange,
  savedSaturdaysCount,
  onSave,
}: StoreTrafficDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-140">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Informar o movimento da loja</DialogTitle>
          <DialogDescription>
            Com isso, a ligação entre posts e sábados cheios deixa de ser só
            hipótese.
          </DialogDescription>
        </DialogHeader>
        <StoreTrafficForm
          savedSaturdaysCount={savedSaturdaysCount}
          onSave={onSave}
        />
      </DialogContent>
    </Dialog>
  );
}
