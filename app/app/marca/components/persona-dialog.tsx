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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Persona } from "@/lib/mocks/brand";
import {
  personaFormSchema,
  type PersonaFormValues,
} from "@/lib/validations/brand";

const personaFormId = "persona-form";

function PersonaForm({
  persona,
  onSave,
}: {
  persona: Persona | null;
  onSave: (persona: Persona) => void;
}) {
  const form = useForm<PersonaFormValues>({
    resolver: zodResolver(personaFormSchema),
    defaultValues: {
      name: persona?.name ?? "",
      age: persona ? String(persona.age) : "",
      description: persona?.description ?? "",
    },
  });

  const handleSave = (values: PersonaFormValues) =>
    onSave({
      id: persona?.id ?? crypto.randomUUID(),
      name: values.name,
      age: Number(values.age),
      description: values.description,
    });

  return (
    <>
      <Form {...form}>
        <form
          id={personaFormId}
          noValidate
          onSubmit={form.handleSubmit(handleSave)}
          className="scrollbar-subtle m-0 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7"
        >
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px]">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Nome</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Ex.: Júlia"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Idade</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="Ex.: 28"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Quem é</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Ex.: Trabalha perto e passa no café antes do expediente."
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
        <Button type="submit" form={personaFormId}>
          {persona ? "Salvar persona" : "Adicionar persona"}
        </Button>
      </DialogFooter>
    </>
  );
}

type PersonaDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  persona: Persona | null;
  onSave: (persona: Persona) => void;
};

export function PersonaDialog({
  open,
  onOpenChange,
  persona,
  onSave,
}: PersonaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-130">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>
            {persona ? "Editar persona" : "Nova persona"}
          </DialogTitle>
          <DialogDescription>
            A IA escreve pensando nestas pessoas. Até 3 personas.
          </DialogDescription>
        </DialogHeader>
        <PersonaForm
          key={persona?.id ?? "new"}
          persona={persona}
          onSave={onSave}
        />
      </DialogContent>
    </Dialog>
  );
}
