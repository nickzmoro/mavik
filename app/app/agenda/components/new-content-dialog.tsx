"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Sparkles } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { OptionTileGroup } from "@/components/common/option-tile-group";
import { PillGroup } from "@/components/common/pill-group";
import { SegmentedControl } from "@/components/common/segmented-control";
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
import { getWeekday } from "@/lib/agenda-dates";
import {
  mockAgendaLibraryIdeas,
  mockNewContentSlots,
  newContentCampaignOptions,
  type AgendaItem,
} from "@/lib/mocks/agenda";
import { formatLabels, goalLabels } from "@/lib/content/content-labels";
import { contentFormats, contentGoals } from "@/lib/onboarding/constants";
import {
  newContentFormSchema,
  type NewContentFormValues,
} from "@/lib/validations/agenda";

const newContentFormId = "new-content-form";

const originOptions: {
  value: NewContentFormValues["origin"];
  label: string;
}[] = [
  { value: "library", label: "Da biblioteca de ideias" },
  { value: "blank", label: "Em branco" },
];

const getSlotHint = (isoDate: string) => {
  const weekday = getWeekday(isoDate);

  if (weekday === 4) {
    return "Quinta às 18h: o conteúdo ganha alcance antes do sábado, alinhado ao seu objetivo.";
  }

  if (weekday === 5) {
    return "Sexta de manhã: bom para conteúdos que as pessoas salvam e consultam no fim de semana.";
  }

  if (weekday === 6) {
    return "Sábado cedo: story ou post curto para quem está decidindo onde tomar café.";
  }

  return "Meio de semana: bom para atrair gente nova sem disputar com o fim de semana.";
};

const createAgendaItemFromForm = (
  values: NewContentFormValues,
  itemNumber: number,
): AgendaItem => {
  const slot =
    mockNewContentSlots.find((option) => option.id === values.slotId) ??
    mockNewContentSlots[0];
  const libraryIdea =
    mockAgendaLibraryIdeas.find((idea) => idea.id === values.libraryIdeaId) ??
    mockAgendaLibraryIdeas[0];
  const isBlank = values.origin === "blank";

  return {
    id: `added-${itemNumber}`,
    date: slot.id,
    time: slot.time,
    title: isBlank ? values.title || "Novo conteúdo" : libraryIdea.label,
    format: isBlank ? values.format : libraryIdea.format,
    goal: isBlank ? values.goal : libraryIdea.goal,
    status: "idea",
    campaign: values.campaign === "Nenhuma" ? "" : values.campaign,
    origin: isBlank ? "Criado por você" : "Biblioteca de ideias",
    caption: "",
  };
};

function NewContentForm({
  nextItemNumber,
  onAdd,
}: {
  nextItemNumber: number;
  onAdd: (item: AgendaItem) => void;
}) {
  const form = useForm<NewContentFormValues>({
    resolver: zodResolver(newContentFormSchema),
    defaultValues: {
      origin: "library",
      libraryIdeaId: mockAgendaLibraryIdeas[0].id,
      title: "",
      format: "reels",
      goal: "engajar",
      slotId: mockNewContentSlots[0].id,
      campaign: "Nenhuma",
    },
  });
  const [origin, slotId] = useWatch({
    control: form.control,
    name: ["origin", "slotId"],
  });

  const handleAddContent = (values: NewContentFormValues) =>
    onAdd(createAgendaItemFromForm(values, nextItemNumber));

  return (
    <>
      <Form {...form}>
        <form
          id={newContentFormId}
          noValidate
          onSubmit={form.handleSubmit(handleAddContent)}
          className="scrollbar-subtle m-0 flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7"
        >
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <SegmentedControl
                label="Origem"
                options={originOptions}
                value={field.value}
                onChange={field.onChange}
                className="self-start"
              />
            )}
          />

          {origin === "library" ? (
            <FormField
              control={form.control}
              name="libraryIdeaId"
              render={({ field }) => (
                <OptionTileGroup
                  id="new-content-idea"
                  label={
                    <>
                      Ideia{" "}
                      <span className="font-normal text-muted">
                        (salvas e recomendadas)
                      </span>
                    </>
                  }
                  options={mockAgendaLibraryIdeas}
                  isSelected={(optionId) => optionId === field.value}
                  onToggle={field.onChange}
                  minTileWidth={260}
                  tileClassName="min-h-15"
                />
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex.: Bastidores do novo bolo"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <PillGroup
                    id="new-content-format"
                    label="Formato"
                    options={contentFormats}
                    getLabel={(option) => formatLabels[option]}
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
                    id="new-content-goal"
                    label="Objetivo"
                    options={contentGoals}
                    getLabel={(option) => goalLabels[option]}
                    isSelected={(option) => option === field.value}
                    onToggle={field.onChange}
                  />
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="slotId"
            render={({ field }) => (
              <OptionTileGroup
                id="new-content-slot"
                label="Quando"
                options={mockNewContentSlots}
                isSelected={(optionId) => optionId === field.value}
                onToggle={field.onChange}
                minTileWidth={130}
                tileClassName="min-h-15"
              />
            )}
          />
          <FormField
            control={form.control}
            name="campaign"
            render={({ field }) => (
              <PillGroup
                id="new-content-campaign"
                label="Campanha"
                hint="(opcional)"
                options={newContentCampaignOptions}
                isSelected={(option) => option === field.value}
                onToggle={field.onChange}
              />
            )}
          />
          <p className="tile m-0 flex items-start gap-2.5 rounded-[14px] px-3.5 py-3 text-[13px] leading-normal text-muted">
            <Sparkles
              aria-hidden="true"
              className="mt-px size-4 shrink-0 text-primary"
            />
            <span>{getSlotHint(slotId)}</span>
          </p>
        </form>
      </Form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancelar</Button>
        </DialogClose>
        <Button type="submit" form={newContentFormId}>
          <Calendar aria-hidden="true" className="size-4.5" />
          Adicionar à agenda
        </Button>
      </DialogFooter>
    </>
  );
}

type NewContentDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  nextItemNumber: number;
  onAdd: (item: AgendaItem) => void;
};

export function NewContentDialog({
  open,
  onOpenChange,
  nextItemNumber,
  onAdd,
}: NewContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-170">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Novo conteúdo</DialogTitle>
          <DialogDescription>
            Comece de uma ideia da biblioteca ou do zero.
          </DialogDescription>
        </DialogHeader>
        <NewContentForm nextItemNumber={nextItemNumber} onAdd={onAdd} />
      </DialogContent>
    </Dialog>
  );
}
