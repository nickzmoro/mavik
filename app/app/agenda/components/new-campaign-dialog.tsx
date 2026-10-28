"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Flag, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";

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
import { Switch } from "@/components/ui/switch";
import { campaignCommercialDates } from "@/lib/mocks/agenda";
import { ideaFormats, ideaGoals } from "@/lib/mocks/ideas";
import { toggleArrayItem } from "@/lib/toggle-array-item";
import {
  newCampaignFormSchema,
  type NewCampaignFormValues,
} from "@/lib/validations/agenda";

const newCampaignFormId = "new-campaign-form";

const dateFields = [
  { name: "startDate", label: "Início" },
  { name: "endDate", label: "Fim" },
] as const;

function NewCampaignForm({
  onCreate,
}: {
  onCreate: (campaignName: string) => void;
}) {
  const form = useForm<NewCampaignFormValues>({
    resolver: zodResolver(newCampaignFormSchema),
    defaultValues: {
      name: "Semana Aurora",
      startDate: "2026-11-24",
      endDate: "2026-11-28",
      commercialDate: "Black Friday",
      goal: "Vender",
      formats: ["Reels", "Post", "Story"],
      isAutoDistributed: true,
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          id={newCampaignFormId}
          noValidate
          onSubmit={form.handleSubmit((values) => onCreate(values.name))}
          className="scrollbar-subtle m-0 flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  Nome da campanha
                </FormLabel>
                <FormControl>
                  <Input autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap gap-3">
            {dateFields.map(({ name, label }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem className="min-w-0 flex-[1_1_180px]">
                    <FormLabel className="font-semibold">{label}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormField
            control={form.control}
            name="commercialDate"
            render={({ field }) => (
              <PillGroup
                id="campaign-commercial-date"
                label="Data comercial"
                hint="(opcional)"
                options={campaignCommercialDates}
                isSelected={(option) => option === field.value}
                onToggle={field.onChange}
              />
            )}
          />
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <PillGroup
                id="campaign-goal"
                label="Objetivo"
                options={ideaGoals}
                isSelected={(option) => option === field.value}
                onToggle={field.onChange}
              />
            )}
          />
          <FormField
            control={form.control}
            name="formats"
            render={({ field, fieldState }) => (
              <PillGroup
                id="campaign-formats"
                label="Formatos"
                hint="(um ou mais)"
                options={ideaFormats}
                isSelected={(option) => field.value.includes(option)}
                onToggle={(option) =>
                  field.onChange(toggleArrayItem(field.value, option))
                }
                errorMessage={fieldState.error?.message}
              />
            )}
          />
          <FormField
            control={form.control}
            name="isAutoDistributed"
            render={({ field }) => (
              <div className="tile flex items-center gap-3.5 rounded-(--r-lg) px-3.5 py-3">
                <span className="flex flex-1 flex-col">
                  <span
                    id="campaign-auto-label"
                    className="text-sm leading-[1.4] font-semibold"
                  >
                    O agente distribui os conteúdos
                  </span>
                  <span className="text-xs leading-[1.4] text-muted">
                    Pelos seus dias de foco e sem conflitar com o que já está na
                    agenda
                  </span>
                </span>
                <Switch
                  aria-labelledby="campaign-auto-label"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
          <p className="tile m-0 flex items-start gap-2.5 rounded-[14px] px-3.5 py-3 text-[13px] leading-normal text-muted">
            <Sparkles
              aria-hidden="true"
              className="mt-px size-4 shrink-0 text-primary"
            />
            <span>
              Sem descontos em destaque, como você prefere. A campanha vai
              mostrar a experiência do Aurora.
            </span>
          </p>
        </form>
      </Form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancelar</Button>
        </DialogClose>
        <Button type="submit" form={newCampaignFormId}>
          <Flag aria-hidden="true" className="size-4.5" />
          Criar campanha
        </Button>
      </DialogFooter>
    </>
  );
}

type NewCampaignDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCreate: (campaignName: string) => void;
};

export function NewCampaignDialog({
  open,
  onOpenChange,
  onCreate,
}: NewCampaignDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-160">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Nova campanha</DialogTitle>
          <DialogDescription>
            Agrupe conteúdos com um objetivo e um período.
          </DialogDescription>
        </DialogHeader>
        <NewCampaignForm onCreate={onCreate} />
      </DialogContent>
    </Dialog>
  );
}
