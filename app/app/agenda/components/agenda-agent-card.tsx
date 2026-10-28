"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUp, Bot, WandSparkles } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { agendaQuickEdits } from "@/lib/mocks/agenda";
import {
  agendaAgentRequestSchema,
  type AgendaAgentRequestValues,
} from "@/lib/validations/agenda";
import { useToast } from "@/providers/toast-provider";

type AgendaAgentCardProps = {
  message: string;
};

export function AgendaAgentCard({ message }: AgendaAgentCardProps) {
  const { showToast } = useToast();
  const form = useForm<AgendaAgentRequestValues>({
    resolver: zodResolver(agendaAgentRequestSchema),
    defaultValues: { request: "" },
  });

  const handleSendRequest = () => {
    form.reset();
    showToast("Pedido enviado ao agente");
  };

  return (
    <section
      aria-labelledby="ag-title"
      className="glass flex flex-col gap-3 rounded-3xl p-5"
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-accent text-(--violet-900)"
        >
          <Bot className="size-4" />
        </span>
        <h2
          id="ag-title"
          className="m-0 font-display text-base leading-[1.4] font-semibold"
        >
          Agente
        </h2>
      </div>
      <p className="m-0 text-sm leading-[1.55]">{message}</p>
      <div className="flex flex-wrap gap-1.5">
        {agendaQuickEdits.map((quickEdit) => (
          <button
            key={quickEdit}
            type="button"
            onClick={() =>
              showToast(`Pedido enviado ao agente: ${quickEdit.toLowerCase()}`)
            }
            className="chip-surface inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-[border-color,color] duration-150 hover:border-accent hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
          >
            <WandSparkles aria-hidden="true" className="size-3.5" />
            {quickEdit}
          </button>
        ))}
      </div>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(handleSendRequest)}
          className="composer m-0 flex items-center gap-1 rounded-[18px] py-1 pr-1 pl-2 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus"
        >
          <FormField
            control={form.control}
            name="request"
            render={({ field }) => (
              <FormItem className="min-w-0 flex-1">
                <FormControl>
                  <Input
                    aria-label="Pedido para o agente sobre a agenda"
                    placeholder="Ex.: troque a sexta por um Reels"
                    autoComplete="off"
                    className="border-transparent bg-transparent pl-1 not-disabled:hover:border-transparent focus-visible:border-transparent focus-visible:outline-none aria-invalid:border-transparent"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" size="icon" aria-label="Enviar pedido">
            <ArrowUp aria-hidden="true" className="size-4.5" />
          </Button>
        </form>
      </Form>
    </section>
  );
}
