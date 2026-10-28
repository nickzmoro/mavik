"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

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
import { useAttachments } from "@/hooks/use-attachments";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import {
  aiEditIdeas,
  mockGeneratedArt,
  type ArtFormat,
} from "@/lib/mocks/studio";
import {
  aiEditFormSchema,
  type AiEditFormValues,
} from "@/lib/validations/studio";
import { useToast } from "@/providers/toast-provider";

import { BrandAssuranceNote } from "./brand-assurance-note";
import { RoundSendButton } from "./round-send-button";
import { StudioArt } from "./studio-art";
import {
  composerTextareaClassName,
  StudioComposerShell,
} from "./studio-composer-shell";

const pluralize = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

function AiEditForm({ onApply }: { onApply: (editText: string) => void }) {
  const form = useForm<AiEditFormValues>({
    resolver: zodResolver(aiEditFormSchema),
    defaultValues: { instruction: "" },
  });
  const instruction = useWatch({ control: form.control, name: "instruction" });
  const attachments = useAttachments();
  const recording = useSpeechRecognition((transcript) =>
    form.setValue(
      "instruction",
      `${form.getValues("instruction")} ${transcript}`.trim(),
    ),
  );

  const handleApplyEdit = ({ instruction: editText }: AiEditFormValues) => {
    onApply(editText);
    form.reset({ instruction: "" });
    attachments.clearAttachments();
  };

  return (
    <>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(handleApplyEdit)}
          className="m-0"
        >
          <FormField
            control={form.control}
            name="instruction"
            render={({ field }) => (
              <FormItem className="gap-2">
                <FormLabel className="text-sm leading-[1.4] font-semibold">
                  O que você quer mudar?
                </FormLabel>
                <StudioComposerShell
                  className="rounded-[20px]"
                  attachments={attachments}
                  recording={recording}
                  micLabel="Falar o ajuste"
                  actions={
                    <RoundSendButton
                      label="Enviar ajuste"
                      disabled={instruction.trim().length === 0}
                    />
                  }
                >
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Ex.: deixe o título maior e use a foto do balcão"
                      className={composerTextareaClassName}
                      {...field}
                    />
                  </FormControl>
                </StudioComposerShell>
                <FormMessage className="px-4" />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="flex flex-col gap-2">
        <span className="text-xs leading-[1.4] font-semibold text-muted">
          Ideias rápidas
        </span>
        <div className="flex flex-wrap gap-2">
          {aiEditIdeas.map((idea) => (
            <button
              key={idea}
              type="button"
              onClick={() => form.setValue("instruction", idea)}
              className="chip-surface min-h-9 cursor-pointer rounded-full px-3 text-[13px] font-medium transition-[border-color,color] duration-150 hover:border-accent hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
            >
              {idea}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

type AiEditorDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  variationIndex: number;
  format: ArtFormat;
  onApprove: () => void;
};

export function AiEditorDialog({
  open,
  onOpenChange,
  variationIndex,
  format,
  onApprove,
}: AiEditorDialogProps) {
  const { showToast } = useToast();
  const [appliedEdits, setAppliedEdits] = useState<string[]>([]);
  const [savedVersions, setSavedVersions] = useState(0);
  const variationLabel = `Variação ${variationIndex + 1}`;

  const versionNote = [
    variationLabel,
    appliedEdits.length > 0
      ? pluralize(appliedEdits.length, "ajuste", "ajustes")
      : null,
    savedVersions > 0
      ? pluralize(savedVersions, "versão salva", "versões salvas")
      : "o original fica guardado",
  ]
    .filter(Boolean)
    .join(" · ");

  const handleApplyEdit = (editText: string) => {
    setAppliedEdits((currentEdits) => [...currentEdits, editText]);
    showToast(`Ajuste aplicado: "${editText}"`);
  };

  const handleSaveVersion = () => {
    setSavedVersions((currentVersions) => currentVersions + 1);
    showToast("Versão salva");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-280">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Ajustar com a IA</DialogTitle>
          <DialogDescription>
            Diga o que mudar e a IA refaz a arte a partir desta versão. O
            original fica guardado.
          </DialogDescription>
        </DialogHeader>
        <div className="scrollbar-subtle flex min-h-0 flex-1 flex-wrap items-start gap-7 overflow-y-auto px-5 pt-4 pb-5 sm:px-7">
          <div className="mx-auto w-full max-w-100 min-w-0 flex-[1_1_300px]">
            <StudioArt
              styleIndex={variationIndex}
              title={mockGeneratedArt.title}
              subtitle={mockGeneratedArt.subtitle}
              aspectRatio={format.aspectRatio}
              label={`${variationLabel}: ${mockGeneratedArt.title}`}
              className="rounded-[18px]"
            />
          </div>
          <div className="flex min-w-[min(260px,100%)] flex-[1_1_340px] flex-col gap-4.5">
            <AiEditForm onApply={handleApplyEdit} />
            {appliedEdits.length > 0 ? (
              <div className="flex flex-col gap-2">
                <span className="text-xs leading-[1.4] font-semibold text-muted">
                  Ajustes feitos
                </span>
                <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
                  {appliedEdits.map((editText, index) => (
                    <li
                      key={`${editText}-${index}`}
                      className="tile flex items-center gap-2.5 rounded-[14px] px-3.5 py-2.5 text-sm leading-[1.4]"
                    >
                      <Check
                        aria-hidden="true"
                        className="size-4 shrink-0 text-success"
                      />
                      {editText}
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
            <BrandAssuranceNote>
              A IA muda só o que você pedir. Logo, cores e fontes continuam
              seguindo a sua marca.
            </BrandAssuranceNote>
          </div>
        </div>
        <DialogFooter>
          <span className="mr-auto text-[13px] leading-[1.4] text-muted">
            {versionNote}
          </span>
          <DialogClose asChild>
            <Button variant="ghost">Descartar alterações</Button>
          </DialogClose>
          <Button variant="outline" onClick={handleSaveVersion}>
            Salvar versão
          </Button>
          <Button onClick={onApprove}>
            <Check aria-hidden="true" className="size-4.5" />
            Aprovar arte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
