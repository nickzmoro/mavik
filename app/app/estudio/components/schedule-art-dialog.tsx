"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

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
  mockGeneratedArt,
  studioScheduleDays,
  studioScheduleTimes,
  type ArtFormat,
} from "@/lib/mocks/studio";
import {
  scheduleArtFormSchema,
  type ScheduleArtFormValues,
} from "@/lib/validations/studio";

import { StudioArt } from "./studio-art";

const scheduleArtFormId = "schedule-art-form";

const scheduleFields = [
  { name: "day", label: "Dia", options: studioScheduleDays },
  { name: "time", label: "Horário", options: studioScheduleTimes },
] as const;

type ScheduleArtFormProps = {
  variationIndex: number;
  format: ArtFormat;
  caption: string;
  onScheduled: (values: ScheduleArtFormValues) => void;
};

function ScheduleArtForm({
  variationIndex,
  format,
  caption,
  onScheduled,
}: ScheduleArtFormProps) {
  const form = useForm<ScheduleArtFormValues>({
    resolver: zodResolver(scheduleArtFormSchema),
    defaultValues: {
      day: studioScheduleDays[0].id,
      time: studioScheduleTimes[2].id,
      caption,
    },
  });
  const [day, time] = useWatch({
    control: form.control,
    name: ["day", "time"],
  });
  const variationLabel = `Variação ${variationIndex + 1}`;

  return (
    <>
      <Form {...form}>
        <form
          id={scheduleArtFormId}
          noValidate
          onSubmit={form.handleSubmit(onScheduled)}
          className="scrollbar-subtle m-0 flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7"
        >
          <div className="plan flex items-center gap-3.5 rounded-(--r-lg) px-3.5 py-3">
            <div className="w-18 shrink-0">
              <StudioArt
                styleIndex={variationIndex}
                title={mockGeneratedArt.title}
                subtitle={mockGeneratedArt.subtitle}
                aspectRatio={format.aspectRatio}
                label={`${variationLabel}: ${mockGeneratedArt.title}`}
                className="rounded-[10px]"
              />
            </div>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[15px] leading-[1.4] font-semibold">
                {mockGeneratedArt.title}
              </span>
              <span className="text-[13px] leading-[1.4] text-muted">
                {variationLabel} · {format.name}
              </span>
            </span>
          </div>
          {scheduleFields.map(({ name, label, options }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <OptionTileGroup
                  id={`schedule-art-${name}`}
                  label={label}
                  options={options}
                  isSelected={(optionId) => optionId === field.value}
                  onToggle={field.onChange}
                  minTileWidth={120}
                  tileClassName="min-h-15"
                />
              )}
            />
          ))}
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm leading-[1.4] font-semibold">
                  Legenda
                </FormLabel>
                <FormControl>
                  <Textarea rows={3} className="min-h-0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <span className="mr-auto text-[13px] leading-[1.4] text-muted">
          {day} às {time}
        </span>
        <DialogClose asChild>
          <Button variant="ghost">Cancelar</Button>
        </DialogClose>
        <Button type="submit" form={scheduleArtFormId}>
          <Calendar aria-hidden="true" className="size-4.5" />
          Agendar post
        </Button>
      </DialogFooter>
    </>
  );
}

type ScheduleArtDialogProps = ScheduleArtFormProps & {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function ScheduleArtDialog({
  open,
  onOpenChange,
  ...formProps
}: ScheduleArtDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-160">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Aprovar e agendar</DialogTitle>
          <DialogDescription>
            A arte entra na Agenda como aprovada. Você ainda confirma antes de
            publicar.
          </DialogDescription>
        </DialogHeader>
        <ScheduleArtForm {...formProps} />
      </DialogContent>
    </Dialog>
  );
}
