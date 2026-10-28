"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { contentFormatIcons } from "@/components/common/format-icons";
import { OptionTileGroup } from "@/components/common/option-tile-group";
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
import { Form, FormField } from "@/components/ui/form";
import {
  mockScheduleDays,
  mockScheduleTimes,
  schedulePreparationOptions,
  type Idea,
} from "@/lib/mocks/ideas";
import {
  scheduleIdeaFormSchema,
  type ScheduleIdeaFormValues,
} from "@/lib/validations/ideas";
import { useToast } from "@/providers/toast-provider";

const scheduleIdeaFormId = "schedule-idea-form";

const scheduleFields = [
  {
    name: "day",
    label: "Dia",
    options: mockScheduleDays,
    minTileWidth: 116,
  },
  {
    name: "time",
    label: "Horário",
    options: mockScheduleTimes,
    minTileWidth: 116,
  },
  {
    name: "preparation",
    label: "Como preparar",
    options: schedulePreparationOptions,
    minTileWidth: 220,
  },
] as const;

type ScheduleIdeaDialogProps = {
  idea: Idea;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

function ScheduleIdeaForm({
  idea,
  onScheduled,
}: {
  idea: Idea;
  onScheduled: (values: ScheduleIdeaFormValues) => void;
}) {
  const form = useForm<ScheduleIdeaFormValues>({
    resolver: zodResolver(scheduleIdeaFormSchema),
    defaultValues: { day: "Sex, 23 out", time: "18h", preparation: "agent" },
  });
  const [day, time] = useWatch({
    control: form.control,
    name: ["day", "time"],
  });
  const FormatIcon = contentFormatIcons[idea.format];

  return (
    <>
      <Form {...form}>
        <form
          id={scheduleIdeaFormId}
          noValidate
          onSubmit={form.handleSubmit(onScheduled)}
          className="scrollbar-subtle m-0 flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7"
        >
          <div className="plan flex items-center gap-3 rounded-(--r-lg) px-3.5 py-3">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-(--r-md) bg-surface-2 text-primary"
            >
              <FormatIcon className="size-4.5" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[15px] leading-[1.4] font-semibold">
                {idea.title}
              </span>
              <span className="text-[13px] leading-[1.4] text-muted">
                {idea.format} · {idea.goal} · {idea.stage}
              </span>
            </span>
          </div>
          {scheduleFields.map(({ name, label, options, minTileWidth }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <OptionTileGroup
                  id={`schedule-${name}`}
                  label={label}
                  options={options}
                  isSelected={(optionId) => optionId === field.value}
                  onToggle={field.onChange}
                  minTileWidth={minTileWidth}
                />
              )}
            />
          ))}
        </form>
      </Form>
      <DialogFooter>
        <span className="mr-auto text-[13px] leading-[1.4] text-muted">
          {day} às {time}
        </span>
        <DialogClose asChild>
          <Button variant="ghost">Cancelar</Button>
        </DialogClose>
        <Button type="submit" form={scheduleIdeaFormId}>
          <Calendar aria-hidden="true" className="size-4.5" />
          Adicionar à agenda
        </Button>
      </DialogFooter>
    </>
  );
}

export function ScheduleIdeaDialog({
  idea,
  open,
  onOpenChange,
}: ScheduleIdeaDialogProps) {
  const { showToast } = useToast();

  const handleScheduled = ({ day, time }: ScheduleIdeaFormValues) => {
    onOpenChange(false);
    showToast(`Na agenda: ${day} às ${time}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-150">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Levar para a agenda</DialogTitle>
          <DialogDescription>
            Escolha quando publicar. O agente prepara o material e você aprova
            antes.
          </DialogDescription>
        </DialogHeader>
        <ScheduleIdeaForm idea={idea} onScheduled={handleScheduled} />
      </DialogContent>
    </Dialog>
  );
}
