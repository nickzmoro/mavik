"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { getColorName } from "@/lib/color";
import { parseColor } from "@/lib/color-contrast";
import type { BrandColor } from "@/lib/mocks/brand";
import {
  brandColorFormSchema,
  type BrandColorFormValues,
} from "@/lib/validations/brand";

const colorFormId = "brand-color-form";
const defaultColorHex = "#8FA98A";

function ColorForm({
  color,
  onSave,
}: {
  color: BrandColor | null;
  onSave: (name: string, hex: string) => void;
}) {
  const form = useForm<BrandColorFormValues>({
    resolver: zodResolver(brandColorFormSchema),
    defaultValues: {
      name: color?.name ?? getColorName(defaultColorHex),
      value: color?.hex ?? defaultColorHex,
    },
  });
  const colorValue = useWatch({ control: form.control, name: "value" });
  const previewHex = parseColor(colorValue) ?? color?.hex ?? defaultColorHex;

  const changeColorValue = (value: string) => {
    form.setValue("value", value, { shouldValidate: true });

    const parsedHex = parseColor(value);

    if (!parsedHex) {
      return;
    }

    const currentName = form.getValues("name").trim();
    const previousAutoName = getColorName(previewHex);

    if (currentName === "" || currentName === previousAutoName) {
      form.setValue("name", getColorName(parsedHex), { shouldValidate: true });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          id={colorFormId}
          noValidate
          onSubmit={form.handleSubmit((values) =>
            onSave(values.name, parseColor(values.value) ?? previewHex),
          )}
          className="scrollbar-subtle m-0 flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7"
        >
          <span
            aria-hidden="true"
            className="h-24 rounded-(--r-lg) border border-brand-tile-border"
            style={{ backgroundColor: previewHex }}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Nome da cor</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Ex.: Caramelo"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">HEX ou RGB</FormLabel>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    aria-label="Escolher cor no seletor"
                    value={previewHex.toLowerCase()}
                    onChange={(event) =>
                      changeColorValue(event.target.value.toUpperCase())
                    }
                    className="size-11 shrink-0 cursor-pointer rounded-(--r-md) border border-muted bg-bg p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  />
                  <FormControl>
                    <Input
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="#2B2420 ou rgb(43, 36, 32)"
                      {...field}
                      onChange={(event) => changeColorValue(event.target.value)}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancelar</Button>
        </DialogClose>
        <Button type="submit" form={colorFormId}>
          {color ? "Salvar cor" : "Adicionar cor"}
        </Button>
      </DialogFooter>
    </>
  );
}

type ColorDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  color: BrandColor | null;
  onSave: (name: string, hex: string) => void;
};

export function ColorDialog({
  open,
  onOpenChange,
  color,
  onSave,
}: ColorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-120">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>
            {color
              ? `Editar ${color.roleLabel.toLowerCase()}`
              : "Adicionar cor"}
          </DialogTitle>
          <DialogDescription>
            A IA usa só as cores da paleta. Os contrastes são recalculados na
            hora.
          </DialogDescription>
        </DialogHeader>
        <ColorForm key={color?.id ?? "new"} color={color} onSave={onSave} />
      </DialogContent>
    </Dialog>
  );
}
