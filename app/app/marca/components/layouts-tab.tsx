"use client";

import { Upload } from "lucide-react";
import Image from "next/image";

import { FileUploadButton } from "@/components/common/file-upload-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  layoutElements,
  layoutFlowSteps,
  type LayoutElementId,
  type SavedLayout,
} from "@/lib/mocks/brand";

import type { UploadedFile } from "../hooks/use-brand-kit";
import { BrandCard, BrandSmallText } from "./brand-card";
import { BrandMark } from "./brand-mark";

const maxBalancedFixedElements = 2;

const thumbnailShapes: Record<SavedLayout["thumbnail"], string> = {
  product: "right-1 bottom-1 size-3 rounded-[3px]",
  story: "inset-x-1.5 top-2 h-2 rounded-[3px] bg-[#C9A27A]!",
  carousel: "top-2.5 left-1.5 h-1.5 w-7.5 rounded-[3px]",
};

const summarizeFixedElements = (
  layoutModes: Record<LayoutElementId, boolean>,
) => {
  const fixedLabels = layoutElements
    .filter((element) => layoutModes[element.id])
    .map((element) => element.label.split(":")[0].toLowerCase());

  if (fixedLabels.length === 0) {
    return "Tudo flexível";
  }

  const summary =
    fixedLabels.length === 1
      ? fixedLabels[0]
      : `${fixedLabels.slice(0, -1).join(", ")} e ${fixedLabels.at(-1)}`;

  return `${summary.charAt(0).toUpperCase()}${summary.slice(1)} ${fixedLabels.length === 1 ? "fixo" : "fixos"}`;
};

function LayoutPostPreview({ postImage }: { postImage: UploadedFile | null }) {
  return (
    <div className="relative aspect-4/5 overflow-hidden rounded-[18px] bg-[#2B2420]">
      {postImage ? (
        <Image
          src={postImage.url}
          alt="Post enviado para virar layout"
          fill
          unoptimized
          sizes="300px"
          className="object-cover"
        />
      ) : (
        <>
          <span className="absolute inset-y-0 left-0 w-4.5 bg-[#C9A27A]" />
          <span className="absolute top-[54%] right-5 bottom-5 left-8.5 rounded-(--r-md) bg-linear-160/srgb from-[#C9A27A] to-[#6E4B33]" />
          <span className="absolute top-8.5 right-15 left-8.5 font-(family-name:--font-dm-serif) text-[28px] leading-[1.1] text-[#F3ECE2]">
            Novo blend de outono
          </span>
        </>
      )}
      <span className="absolute top-6.5 right-13 left-7 h-18.5 rounded-lg border-[1.5px] border-dashed border-[#F3ECE2]" />
      <span className="absolute top-26 left-8.5 rounded-md bg-[#F3ECE2] px-1.5 py-0.5 text-[11px] font-semibold text-[#1F1A17]">
        Título
      </span>
      <span className="absolute right-3.5 bottom-3.5 size-13.5 rounded-lg border-[1.5px] border-dashed border-[#8FA98A]" />
      <BrandMark
        size="xs"
        background="#F3ECE2"
        color="#2B2420"
        className="absolute right-5.5 bottom-5.5"
      />
    </div>
  );
}

type LayoutsTabProps = {
  layoutModes: Record<LayoutElementId, boolean>;
  postImage: UploadedFile | null;
  savedLayouts: SavedLayout[];
  onToggleMode: (elementId: LayoutElementId, isFixed: boolean) => void;
  onUploadPost: (file: File) => void;
  onSave: (summary: string) => void;
  onDiscard: () => void;
};

export function LayoutsTab({
  layoutModes,
  postImage,
  savedLayouts,
  onToggleMode,
  onUploadPost,
  onSave,
  onDiscard,
}: LayoutsTabProps) {
  const fixedCount = Object.values(layoutModes).filter(Boolean).length;
  const hasHealthyVariation = fixedCount <= maxBalancedFixedElements;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <BrandCard
        titleId="layouts-title"
        title="Layouts de marca"
        hint="Envie um post que quer padronizar. A IA extrai a estrutura e você decide o que é fixo e o que varia."
        action={
          <FileUploadButton
            accept="image/jpeg,image/png,image/webp"
            variant="outline"
            onFileSelected={onUploadPost}
          >
            <Upload aria-hidden="true" className="size-4.5" />
            Enviar novo layout
          </FileUploadButton>
        }
      >
        <ol className="m-0 flex list-none flex-wrap gap-2 p-0">
          {layoutFlowSteps.map((step, stepIndex) => (
            <li
              key={step}
              className="inline-flex items-center gap-2 rounded-full bg-brand-selected py-1.5 pr-3 pl-1.5 text-[13px]"
            >
              <span className="flex size-5.5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-on-primary">
                {stepIndex + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <div className="grid items-start gap-6 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
          <div className="mx-auto flex w-full max-w-75 flex-col gap-2.5">
            <LayoutPostPreview postImage={postImage} />
            <BrandSmallText>
              {postImage
                ? `Enviado: ${postImage.fileName}`
                : "Fixo: logo no canto inferior direito e faixa lateral."}
            </BrandSmallText>
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <b className="font-display text-base font-semibold">
              Como a IA lê este layout
            </b>
            <div className="flex flex-col gap-2.5">
              {layoutElements.map((element) => {
                const isFixed = layoutModes[element.id];

                return (
                  <div
                    key={element.id}
                    className="brand-tile flex flex-wrap items-center gap-3 rounded-[18px] py-2.5 pr-2.5 pl-4 text-sm"
                  >
                    <span className="min-w-0 flex-1">{element.label}</span>
                    <div
                      role="group"
                      aria-label={`Comportamento: ${element.label}`}
                      className="inline-flex gap-1 rounded-full bg-brand-selected p-1"
                    >
                      <Button
                        size="sm"
                        variant={isFixed ? "default" : "ghost"}
                        aria-pressed={isFixed}
                        onClick={() => onToggleMode(element.id, true)}
                      >
                        Fixo
                      </Button>
                      <Button
                        size="sm"
                        variant={isFixed ? "ghost" : "secondary"}
                        aria-pressed={!isFixed}
                        onClick={() => onToggleMode(element.id, false)}
                      >
                        Flexível
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <Alert variant="warning">
              <AlertTitle>
                {hasHealthyVariation ? "Variação ainda boa" : "Pouca variação"}
              </AlertTitle>
              <AlertDescription>
                {fixedCount} de {layoutElements.length} elementos estão fixos.{" "}
                {hasHealthyVariation
                  ? "Se fixar mais, as artes podem ficar parecidas demais."
                  : "As artes podem ficar parecidas demais. Deixe algo flexível."}
              </AlertDescription>
            </Alert>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => onSave(summarizeFixedElements(layoutModes))}
              >
                Salvar como layout de marca
              </Button>
              <Button variant="ghost" onClick={onDiscard}>
                Descartar
              </Button>
            </div>
          </div>
        </div>
      </BrandCard>

      <BrandCard
        titleId="saved-layouts-title"
        title="Seus layouts"
        action={
          <BrandSmallText>
            {savedLayouts.length}{" "}
            {savedLayouts.length === 1 ? "salvo" : "salvos"}
          </BrandSmallText>
        }
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-3.5">
          {savedLayouts.map((layout) => (
            <div
              key={layout.id}
              className="brand-tile flex items-center gap-3 rounded-[18px] p-3 text-sm"
            >
              <span
                aria-hidden="true"
                className="relative h-15 w-12 shrink-0 rounded-lg bg-[#2B2420]"
              >
                <span
                  className={`absolute bg-[#F3ECE2] ${thumbnailShapes[layout.thumbnail]}`}
                />
              </span>
              <span className="min-w-0">
                <b className="block truncate font-semibold">{layout.name}</b>
                <small className="block text-xs text-muted">
                  {layout.summary}
                </small>
              </span>
            </div>
          ))}
        </div>
      </BrandCard>
    </div>
  );
}
