"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
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
import { studioScheduleTimes, type ArtFormat } from "@/lib/mocks/studio";
import {
  scheduleArtFormSchema,
  type ScheduleArtFormValues,
} from "@/lib/validations/studio";

import { getScheduleDayOptions } from "../utils/schedule-days";

const scheduleArtFormId = "schedule-art-form";

type ScheduleArtFormProps = {
  variationIndex: number;
  imageUrl?: string;
  title: string;
  format: ArtFormat;
  caption: string;
  isScheduling: boolean;
  onScheduled: (values: ScheduleArtFormValues) => void;
};

function ScheduleArtForm({
  variationIndex,
  imageUrl,
  title,
  format,
  caption,
  isScheduling,
  onScheduled,
}: ScheduleArtFormProps) {
  const [scheduleDays] = useState(() => getScheduleDayOptions());
  const scheduleFields = [
    { name: "day", label: "Dia", options: scheduleDays },
    { name: "time", label: "Horário", options: studioScheduleTimes },
  ] as const;
  const form = useForm<ScheduleArtFormValues>({
    resolver: zodResolver(scheduleArtFormSchema),
    defaultValues: {
      day: scheduleDays[0].id,
      time: studioScheduleTimes[2].id,
      caption,
    },
  });
  const [day, time] = useWatch({
    control: form.control,
    name: ["day", "time"],
  });
  const variationLabel = `Variação ${variationIndex + 1}`;
  const dayLabel =
    scheduleDays.find((scheduleDay) => scheduleDay.id === day)?.label ?? day;

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
            <div
              className="relative w-18 shrink-0 overflow-hidden rounded-[10px]"
              style={{ aspectRatio: format.aspectRatio }}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`${variationLabel} que será agendada`}
                  fill
                  unoptimized
                  sizes="72px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="line-clamp-2 text-[15px] leading-[1.4] font-semibold">
                {title}
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
          {dayLabel} às {time}
        </span>
        <DialogClose asChild>
          <Button variant="ghost" disabled={isScheduling}>
            Cancelar
          </Button>
        </DialogClose>
        <Button
          type="submit"
          form={scheduleArtFormId}
          loading={isScheduling}
          disabled={!imageUrl}
        >
          {isScheduling ? null : (
            <Calendar aria-hidden="true" className="size-4.5" />
          )}
          {isScheduling ? "Agendando…" : "Agendar post"}
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
