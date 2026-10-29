"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { fontNameSchema } from "@/actions/save-onboarding-brand-kit/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  getFontFamilyStyle,
  useGoogleFontStatus,
} from "../hooks/use-google-font-status";

const fontDialogSchema = z.object({ fontName: fontNameSchema });

type FontDialogValues = z.infer<typeof fontDialogSchema>;

type FontDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  initialValue: string;
  onConfirm: (fontName: string) => void;
};

export function FontDialog({
  open,
  onOpenChange,
  title,
  initialValue,
  onConfirm,
}: FontDialogProps) {
  const form = useForm<FontDialogValues>({
    resolver: zodResolver(fontDialogSchema),
    defaultValues: { fontName: initialValue },
  });
  const fontName = useWatch({ control: form.control, name: "fontName" });
  const status = useGoogleFontStatus(fontName, 500);

  useEffect(() => {
    if (open) {
      form.reset({ fontName: initialValue });
    }
  }, [open, initialValue, form]);

  const handleSubmit = form.handleSubmit(({ fontName: confirmedName }) =>
    onConfirm(confirmedName.trim()),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-130">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Digite o nome da fonte que a sua marca usa. A IA não lê arquivos de
            fonte: ela usa o nome para imitar o estilo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            onSubmit={(event) => {
              event.stopPropagation();
              handleSubmit(event);
            }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="scrollbar-subtle flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7">
              <FormField
                control={form.control}
                name="fontName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da fonte</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Ex.: Montserrat"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div
                role="status"
                className="tile flex min-h-28 flex-col justify-center gap-2 rounded-(--r-lg) p-4"
              >
                {status === "idle" ? (
                  <p className="m-0 text-sm text-muted">
                    Digite o nome para ver a prévia, se for do Google Fonts.
                  </p>
                ) : null}
                {status === "checking" ? (
                  <p className="m-0 text-sm text-muted">
                    Procurando no Google Fonts…
                  </p>
                ) : null}
                {status === "google" ? (
                  <>
                    <Badge variant="success" className="self-start">
                      Google Fonts
                    </Badge>
                    <span
                      className="text-3xl leading-[1.2]"
                      style={{
                        fontFamily: getFontFamilyStyle(fontName.trim(), status),
                      }}
                    >
                      Aa Çã É
                    </span>
                    <span
                      className="text-base leading-normal"
                      style={{
                        fontFamily: getFontFamilyStyle(fontName.trim(), status),
                      }}
                    >
                      Assim o texto da sua marca vai aparecer.
                    </span>
                  </>
                ) : null}
                {status === "nome" ? (
                  <Alert variant="warning">
                    <AlertDescription>
                      Não encontramos essa fonte no Google Fonts, então não há
                      prévia. Tudo bem: guardamos o nome e a IA imita o estilo.
                    </AlertDescription>
                  </Alert>
                ) : null}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Usar esta fonte</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
