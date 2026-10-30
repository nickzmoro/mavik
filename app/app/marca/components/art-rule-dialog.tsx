"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";
import {
  artRuleFormSchema,
  type ArtRuleFormValues,
} from "@/lib/validations/brand";

const artRuleFormId = "art-rule-form";

type ArtRuleDialogProps = {
  isOpen: boolean;
  initialRule?: string;
  isSaving: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (rule: string) => void;
};

function ArtRuleForm({
  initialRule,
  isSaving,
  onSave,
}: Omit<ArtRuleDialogProps, "isOpen" | "onOpenChange">) {
  const form = useForm<ArtRuleFormValues>({
    resolver: zodResolver(artRuleFormSchema),
    defaultValues: { rule: initialRule ?? "" },
  });

  return (
    <>
      <Form {...form}>
        <form
          id={artRuleFormId}
          noValidate
          onSubmit={form.handleSubmit((values) => onSave(values.rule))}
          className="m-0 px-5 pt-4.5 pb-5 sm:px-7"
        >
          <FormField
            control={form.control}
            name="rule"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Regra</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    autoFocus
                    placeholder="Ex.: Alternar o fundo entre claro e escuro a cada post"
                    {...field}
                  />
                </FormControl>
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
        <Button type="submit" form={artRuleFormId} disabled={isSaving}>
          {isSaving ? "Salvando…" : "Salvar regra"}
        </Button>
      </DialogFooter>
    </>
  );
}

export function ArtRuleDialog({
  isOpen,
  initialRule,
  isSaving,
  onOpenChange,
  onSave,
}: ArtRuleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-120">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>
            {initialRule ? "Editar regra" : "Nova regra de direção de arte"}
          </DialogTitle>
          <DialogDescription>
            Vale só para a sua marca. A IA segue esta regra em toda arte nova.
          </DialogDescription>
        </DialogHeader>
        {isOpen ? (
          <ArtRuleForm
            key={initialRule ?? "new"}
            initialRule={initialRule}
            isSaving={isSaving}
            onSave={onSave}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
