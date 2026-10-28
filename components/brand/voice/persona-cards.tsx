"use client";

import { Check, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import type { SaveOnboardingVoiceFormValues } from "@/actions/save-onboarding-voice/schema";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MAX_PERSONAS } from "@/lib/onboarding/constants";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name.trim().slice(0, 2).toUpperCase() || "?";
}

export function PersonaCards() {
  const form = useFormContext<SaveOnboardingVoiceFormValues>();
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "personas",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const personas = useWatch({ control: form.control, name: "personas" });

  const finishEditing = async (index: number) => {
    const isValid = await form.trigger(`personas.${index}`);

    if (isValid) {
      setEditingIndex(null);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {fields.map((persona, index) => {
        const currentPersona = personas[index] ?? persona;

        return (
          <div
            key={persona.id}
            className={cn(
              "flex flex-col gap-3 rounded-(--r-lg) border bg-bg p-4 shadow-(--shadow-sm)",
              currentPersona.confirmed ? "border-primary" : "border-border",
            )}
          >
            {editingIndex === index ? (
              <>
                <div className="grid grid-cols-[1fr_80px] gap-2">
                  <FormField
                    control={form.control}
                    name={`personas.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex.: Mariana" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`personas.${index}.age`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idade</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="numeric"
                            {...field}
                            onChange={(event) =>
                              field.onChange(event.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`personas.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        O que ela busca e o que a faz hesitar
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-20"
                          placeholder="Ex.: Trabalha fora, quer cuidar da pele sem perder tempo."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => finishEditing(index)}
                  >
                    Salvar persona
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      remove(index);
                      setEditingIndex(null);
                    }}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Remover
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-10 flex-none items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-primary"
                  >
                    {getInitials(currentPersona.name)}
                  </span>
                  <p className="m-0 font-semibold text-text">
                    {currentPersona.name}, {currentPersona.age}
                  </p>
                </div>
                <p className="m-0 flex-1 text-sm leading-normal text-muted">
                  {currentPersona.description || "Sem descrição ainda."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={currentPersona.confirmed ? "default" : "secondary"}
                    aria-pressed={currentPersona.confirmed}
                    onClick={() =>
                      update(index, {
                        ...currentPersona,
                        confirmed: !currentPersona.confirmed,
                      })
                    }
                  >
                    {currentPersona.confirmed && (
                      <Check size={16} aria-hidden="true" />
                    )}
                    {currentPersona.confirmed ? "Confirmada" : "Confirmar"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingIndex(index)}
                  >
                    Editar
                  </Button>
                </div>
              </>
            )}
          </div>
        );
      })}

      {fields.length < MAX_PERSONAS && editingIndex === null && (
        <button
          type="button"
          onClick={() => {
            append({ name: "", age: 30, description: "", confirmed: true });
            setEditingIndex(fields.length);
          }}
          className="flex min-h-40 cursor-pointer items-center justify-center gap-2 rounded-(--r-lg) border border-dashed border-muted bg-surface font-display text-sm font-semibold text-text transition-colors duration-150 hover:border-primary hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
        >
          <Plus size={18} aria-hidden="true" />
          Adicionar persona
        </button>
      )}
    </div>
  );
}
