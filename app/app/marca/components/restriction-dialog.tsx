"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { PillGroup } from "@/components/common/pill-group";
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
import { parseColor } from "@/lib/color-contrast";
import { restrictionTypes, type RestrictionType } from "@/lib/mocks/brand";
import {
  restrictionFormSchema,
  type RestrictionFormValues,
} from "@/lib/validations/brand";

const restrictionFormId = "restriction-form";

const valuePlaceholders: Record<RestrictionType, string> = {
  Cores: "Ex.: Laranja neon",
  Elementos: "Ex.: Moldura de foto",
  Estilos: "Ex.: Colagem",
};

function RestrictionForm({
  onAdd,
}: {
  onAdd: (type: RestrictionType, value: string, hex: string | null) => void;
}) {
  const form = useForm<RestrictionFormValues>({
    resolver: zodResolver(restrictionFormSchema),
    defaultValues: { type: "Elementos", value: "", color: "#FF6A00" },
  });
  const [type, color] = useWatch({
    control: form.control,
    name: ["type", "color"],
  });

  return (
    <>
      <Form {...form}>
        <form
          id={restrictionFormId}
          noValidate
          onSubmit={form.handleSubmit((values) =>
            onAdd(values.type, values.value, parseColor(values.color)),
          )}
          className="scrollbar-subtle m-0 flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7"
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <PillGroup
                id="restriction-type"
                label="Tipo"
                options={restrictionTypes}
                isSelected={(option) => option === field.value}
                onToggle={field.onChange}
              />
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  {type === "Cores" ? "Nome da cor" : "O que evitar"}
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder={valuePlaceholders[type]}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {type === "Cores" ? (
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">HEX ou RGB</FormLabel>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      aria-label="Escolher cor no seletor"
                      value={(parseColor(color) ?? "#FF6A00").toLowerCase()}
                      onChange={(event) =>
                        form.setValue(
                          "color",
                          event.target.value.toUpperCase(),
                          {
                            shouldValidate: true,
                          },
                        )
                      }
                      className="size-11 shrink-0 cursor-pointer rounded-(--r-md) border border-muted bg-bg p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    />
                    <FormControl>
                      <Input autoComplete="off" spellCheck={false} {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
        </form>
      </Form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancelar</Button>
        </DialogClose>
        <Button type="submit" form={restrictionFormId}>
          Adicionar restrição
        </Button>
      </DialogFooter>
    </>
  );
}

type RestrictionDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAdd: (type: RestrictionType, value: string, hex: string | null) => void;
};

export function RestrictionDialog({
  open,
  onOpenChange,
  onAdd,
}: RestrictionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-130">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Adicionar restrição</DialogTitle>
          <DialogDescription>
            Vira uma regra obrigatória: a IA não gera arte com isso. Termos
            proibidos ficam na aba Voz.
          </DialogDescription>
        </DialogHeader>
        <RestrictionForm onAdd={onAdd} />
      </DialogContent>
    </Dialog>
  );
}
