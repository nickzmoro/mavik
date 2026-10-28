"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { FilterPill } from "@/components/common/filter-pill";
import { IconButton } from "@/components/common/icon-button";
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
import { Textarea } from "@/components/ui/textarea";
import { agentToneOptions, type AgentContext } from "@/lib/mocks/agent";
import {
  agentContextFormSchema,
  type AgentContextFormValues,
} from "@/lib/validations/agent";

const agentContextFormId = "agent-context-form";

const textFields = [
  { name: "business", label: "Negócio" },
  { name: "audience", label: "Público" },
  { name: "goal", label: "Objetivo" },
] as const;

type AgentContextDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  context: AgentContext;
  onSave: (context: AgentContext) => void;
};

function AgentContextForm({
  context,
  onSave,
}: Pick<AgentContextDialogProps, "context" | "onSave">) {
  const form = useForm<AgentContextFormValues>({
    resolver: zodResolver(agentContextFormSchema),
    defaultValues: context,
  });
  const preferences = useWatch({ control: form.control, name: "preferences" });

  const removePreference = (preferenceId: string) =>
    form.setValue(
      "preferences",
      preferences.filter((preference) => preference.id !== preferenceId),
      { shouldDirty: true },
    );

  return (
    <>
      <Form {...form}>
        <form
          id={agentContextFormId}
          noValidate
          onSubmit={form.handleSubmit(onSave)}
          className="scrollbar-subtle m-0 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pt-4 pb-2 sm:px-7"
        >
          {textFields.map(({ name, label }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">{label}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem className="gap-2">
                <span
                  id="agent-tone-label"
                  className="text-sm leading-[1.4] font-semibold"
                >
                  Tom de voz
                </span>
                <div
                  role="group"
                  aria-labelledby="agent-tone-label"
                  className="flex flex-wrap gap-2"
                >
                  {agentToneOptions.map((tone) => (
                    <FilterPill
                      key={tone}
                      size="lg"
                      isActive={field.value === tone}
                      onClick={() => field.onChange(tone)}
                    >
                      {tone}
                    </FilterPill>
                  ))}
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalContext"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  Mais contexto{" "}
                  <span className="font-normal text-muted">(opcional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Ex.: horários, diferenciais, o que evitar"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-1.5">
            <h3 className="m-0 text-sm leading-[1.4] font-semibold">
              Preferências salvas
            </h3>
            {preferences.length > 0 ? (
              <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                {preferences.map((preference) => (
                  <li
                    key={preference.id}
                    className="tile flex items-center gap-2.5 rounded-[14px] py-1.5 pr-1.5 pl-3.5"
                  >
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-sm leading-[1.4] font-medium">
                        {preference.label}
                      </span>
                      <span className="text-xs leading-[1.4] text-muted">
                        {preference.meta}
                      </span>
                    </span>
                    <IconButton
                      label={`Remover: ${preference.label}`}
                      onClick={() => removePreference(preference.id)}
                    >
                      <X />
                    </IconButton>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="m-0 text-[13px] leading-normal text-muted">
                Nenhuma preferência salva. O agente guarda as que você pedir nas
                conversas.
              </p>
            )}
          </div>
        </form>
      </Form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancelar</Button>
        </DialogClose>
        <Button type="submit" form={agentContextFormId}>
          Salvar alterações
        </Button>
      </DialogFooter>
    </>
  );
}

export function AgentContextDialog({
  open,
  onOpenChange,
  context,
  onSave,
}: AgentContextDialogProps) {
  const handleSave = (updatedContext: AgentContext) => {
    onSave(updatedContext);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-150">
        <DialogHeader>
          <DialogTitle>O que o agente sabe</DialogTitle>
          <DialogDescription>
            Quanto mais claro, melhores as sugestões. Você muda quando quiser.
          </DialogDescription>
        </DialogHeader>
        <AgentContextForm context={context} onSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
}
