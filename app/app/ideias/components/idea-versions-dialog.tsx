"use client";

import { Bookmark, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { IconButton } from "@/components/common/icon-button";
import { PillGroup } from "@/components/common/pill-group";
import { Badge } from "@/components/ui/badge";
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
  ideaFormats,
  ideaVersionApproaches,
  ideaVersionTones,
  type Idea,
  type IdeaFormat,
  type IdeaVersionTone,
} from "@/lib/mocks/ideas";
import { mockCurrentStore } from "@/lib/mocks/sidebar";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";

const versionGenerationDelayInMs = 1300;

const versionClosingNotes = [
  "Boa para repetir o tema sem cansar.",
  "Funciona bem como continuação da original.",
  "Use em outra semana do mês.",
];

type IdeaVersionsDialogProps = {
  idea: Idea;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUseVersion: () => void;
};

function IdeaVersionsContent({
  idea,
  onUseVersion,
}: Pick<IdeaVersionsDialogProps, "idea" | "onUseVersion">) {
  const { showToast } = useToast();
  const [format, setFormat] = useState<IdeaFormat>("Carrossel");
  const [tone, setTone] = useState<IdeaVersionTone>("Mais direto");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [savedVersionKeys, setSavedVersionKeys] = useState<string[]>([]);

  const hasVersions = hasGenerated && !isGenerating;

  useEffect(() => {
    if (!isGenerating) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setHasGenerated(true);
      setIsGenerating(false);
    }, versionGenerationDelayInMs);

    return () => window.clearTimeout(timeoutId);
  }, [isGenerating]);

  const versions = hasVersions
    ? ideaVersionApproaches[tone].map((approach, versionIndex) => ({
        key: `${format}-${tone}-${versionIndex}`,
        label: `V${versionIndex + 1}`,
        title: `${idea.title}, ${approach}`,
        description: `Mantém o objetivo de ${idea.goal.toLowerCase()} na etapa de ${idea.stage.toLowerCase()}, agora ${approach}. ${versionClosingNotes[versionIndex]}`,
      }))
    : [];

  const heading = isGenerating
    ? "Gerando…"
    : hasVersions
      ? `3 versões em ${format.toLowerCase()}`
      : "Pronto para gerar";

  const toggleSavedVersion = (versionKey: string) => {
    const isSaved = savedVersionKeys.includes(versionKey);

    setSavedVersionKeys((currentKeys) =>
      isSaved
        ? currentKeys.filter((currentKey) => currentKey !== versionKey)
        : [...currentKeys, versionKey],
    );

    if (!isSaved) {
      showToast("Versão salva na biblioteca");
    }
  };

  return (
    <>
      <div className="scrollbar-subtle flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7">
        <PillGroup
          id="versions-format"
          label="Formato"
          options={ideaFormats}
          isSelected={(option) => option === format}
          onToggle={setFormat}
        />
        <PillGroup
          id="versions-tone"
          label="Abordagem"
          options={ideaVersionTones}
          isSelected={(option) => option === tone}
          onToggle={setTone}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <h3 className="m-0 font-display text-base leading-[1.4] font-semibold">
            {heading}
          </h3>
          <Button
            variant="secondary"
            loading={isGenerating}
            onClick={() => setIsGenerating(true)}
          >
            {isGenerating ? null : (
              <Sparkles aria-hidden="true" className="size-4.5" />
            )}
            {hasVersions ? "Gerar de novo" : "Gerar 3 versões"}
          </Button>
        </div>

        {isGenerating ? (
          <div aria-live="polite" className="flex flex-col gap-2.5">
            <span className="text-[13px] leading-[1.4] text-muted">
              Criando versões com o contexto do {mockCurrentStore.name}…
            </span>
            {versionClosingNotes.map((note) => (
              <div
                key={note}
                className="tile h-23 animate-soft-pulse rounded-[18px] motion-reduce:animate-none"
              />
            ))}
          </div>
        ) : null}

        {hasVersions ? (
          <ul
            aria-live="polite"
            className="m-0 flex list-none flex-col gap-2.5 p-0"
          >
            {versions.map((version) => {
              const isSaved = savedVersionKeys.includes(version.key);

              return (
                <li
                  key={version.key}
                  className="tile flex flex-wrap items-start gap-3.5 rounded-[18px] py-3.5 pr-3.5 pl-4"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-(--r-md) bg-surface-2 font-display text-sm font-bold text-primary"
                  >
                    {version.label}
                  </span>
                  <span className="flex min-w-0 flex-[1_1_300px] flex-col gap-1">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[15px] leading-[1.4] font-semibold">
                        {version.title}
                      </span>
                      <Badge variant="secondary">{format}</Badge>
                    </span>
                    <span className="text-[13px] leading-normal text-muted">
                      {version.description}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <IconButton
                      label={
                        isSaved
                          ? `Remover dos salvos: ${version.label}`
                          : `Salvar versão ${version.label}`
                      }
                      aria-pressed={isSaved}
                      onClick={() => toggleSavedVersion(version.key)}
                      className={cn(
                        "size-10 [&_svg]:size-4.5",
                        isSaved && "text-primary",
                      )}
                    >
                      <Bookmark fill={isSaved ? "currentColor" : "none"} />
                    </IconButton>
                    <Button variant="outline" onClick={onUseVersion}>
                      Usar
                    </Button>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
      <DialogFooter>
        <span className="mr-auto text-[13px] leading-[1.4] text-muted">
          As versões salvas entram na sua biblioteca.
        </span>
        <DialogClose asChild>
          <Button variant="ghost">Fechar</Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}

export function IdeaVersionsDialog({
  idea,
  open,
  onOpenChange,
  onUseVersion,
}: IdeaVersionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-190">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Gerar versões</DialogTitle>
          <DialogDescription>
            A partir de “{idea.title}”. Escolha o que muda e o agente cria novas
            opções.
          </DialogDescription>
        </DialogHeader>
        <IdeaVersionsContent
          key={idea.id}
          idea={idea}
          onUseVersion={onUseVersion}
        />
      </DialogContent>
    </Dialog>
  );
}
