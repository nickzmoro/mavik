"use client";

import { Upload } from "lucide-react";
import Image from "next/image";

import { FileUploadButton } from "@/components/common/file-upload-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  layoutElements,
  layoutFlowSteps,
  type BrandColor,
  type LayoutElementId,
  type LayoutModes,
  type SavedLayout,
} from "@/lib/mocks/brand";
import { cn } from "@/lib/utils";

import type { UploadedFile } from "../hooks/use-brand-kit";
import { BrandCard, BrandSmallText } from "./brand-card";
import { BrandMark } from "./brand-mark";

const maxBalancedFixedElements = 2;

const neutralLayoutColors = {
  base: "#3A3A3C",
  secondary: "#8E8E93",
  light: "#F2F2F7",
  accent: "#AEAEB2",
};

type LayoutColors = typeof neutralLayoutColors;

const getLayoutColors = (palette: BrandColor[]): LayoutColors => {
  const findHex = (role: BrandColor["role"]) =>
    palette.find((color) => color.role === role)?.hex;

  return {
    base: findHex("primary") ?? neutralLayoutColors.base,
    secondary: findHex("secondary") ?? neutralLayoutColors.secondary,
    light: findHex("background") ?? neutralLayoutColors.light,
    accent: findHex("accent") ?? neutralLayoutColors.accent,
  };
};

const summarizeFixedElements = (layoutModes: LayoutModes) => {
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

type LayoutPostPreviewProps = {
  postImage: UploadedFile | null;
  colors: LayoutColors;
  logoUrl?: string;
};

function LayoutPostPreview({
  postImage,
  colors,
  logoUrl,
}: LayoutPostPreviewProps) {
  return (
    <div
      className="relative aspect-4/5 overflow-hidden rounded-[18px]"
      style={{ backgroundColor: colors.base }}
    >
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
          <span
            className="absolute top-[54%] right-5 bottom-5 left-8.5 rounded-(--r-md)"
            style={{
              backgroundImage: `linear-gradient(160deg, ${colors.secondary}, ${colors.base})`,
            }}
          />
          <span
            className="absolute top-8.5 right-15 left-8.5 font-(family-name:--font-dm-serif) text-[28px] leading-[1.1]"
            style={{ color: colors.light }}
          >
            Título do post
          </span>
        </>
      )}
      <span
        className="absolute top-6.5 right-13 left-7 h-18.5 rounded-lg border-[1.5px] border-dashed"
        style={{ borderColor: colors.light }}
      />
      <span
        className="absolute top-26 left-8.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold"
        style={{ backgroundColor: colors.light, color: colors.base }}
      >
        Título
      </span>
      <span
        className="absolute right-3.5 bottom-3.5 size-13.5 rounded-lg border-[1.5px] border-dashed"
        style={{ borderColor: colors.accent }}
      />
      <BrandMark
        size="xs"
        background={colors.light}
        logoUrl={logoUrl}
        className="absolute right-5.5 bottom-5.5"
      />
    </div>
  );
}

type LayoutsTabProps = {
  palette: BrandColor[];
  logoUrl?: string;
  layoutModes: LayoutModes;
  postImage: UploadedFile | null;
  savedLayouts: SavedLayout[];
  editingLayoutId: string | null;
  onToggleMode: (elementId: LayoutElementId, isFixed: boolean) => void;
  onUploadPost: (file: File) => void;
  onSave: () => void;
  onDiscard: () => void;
  onOpenLayout: (layout: SavedLayout) => void;
  onRemoveLayout: (layoutId: string) => void;
};

export function LayoutsTab({
  palette,
  logoUrl,
  layoutModes,
  postImage,
  savedLayouts,
  editingLayoutId,
  onToggleMode,
  onUploadPost,
  onSave,
  onDiscard,
  onOpenLayout,
  onRemoveLayout,
}: LayoutsTabProps) {
  const colors = getLayoutColors(palette);
  const editingLayout = savedLayouts.find(
    (layout) => layout.id === editingLayoutId,
  );
  const fixedCount = Object.values(layoutModes).filter(Boolean).length;
  const hasHealthyVariation = fixedCount <= maxBalancedFixedElements;

  const getPreviewHint = () => {
    if (editingLayout) {
      return `Editando ${editingLayout.name}. As mudanças são salvas na hora.`;
    }

    return postImage
      ? `Enviado: ${postImage.fileName}`
      : "Prévia com as cores da sua paleta.";
  };

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
            <LayoutPostPreview
              postImage={postImage}
              colors={colors}
              logoUrl={logoUrl}
            />
            <BrandSmallText>{getPreviewHint()}</BrandSmallText>
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
                        variant={isFixed ? "ghost" : "default"}
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
              {editingLayout ? (
                <Button variant="outline" onClick={onDiscard}>
                  Criar novo layout
                </Button>
              ) : (
                <>
                  <Button onClick={onSave}>Salvar como layout de marca</Button>
                  <Button variant="outline" onClick={onDiscard}>
                    Descartar
                  </Button>
                </>
              )}
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
        {savedLayouts.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-3.5">
            {savedLayouts.map((layout) => (
              <div
                key={layout.id}
                className={cn(
                  "brand-tile flex items-center gap-2 rounded-[18px] p-3 text-sm",
                  layout.id === editingLayoutId &&
                    "border-primary bg-brand-selected",
                )}
              >
                <button
                  type="button"
                  aria-label={`Abrir ${layout.name}`}
                  onClick={() => onOpenLayout(layout)}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-left text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <span
                    aria-hidden="true"
                    className="relative h-15 w-12 shrink-0 overflow-hidden rounded-lg"
                    style={{ backgroundColor: colors.base }}
                  >
                    <span
                      className="absolute inset-x-1 bottom-1 h-6 rounded-[3px]"
                      style={{ backgroundColor: colors.secondary }}
                    />
                    <span
                      className="absolute right-1 bottom-1 size-3 rounded-[3px]"
                      style={{ backgroundColor: colors.light }}
                    />
                  </span>
                  <span className="min-w-0">
                    <b className="block truncate font-semibold">
                      {layout.name}
                    </b>
                    <small className="block text-xs text-muted">
                      {summarizeFixedElements(layout.layoutModes)}
                    </small>
                  </span>
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={`Remover ${layout.name}`}
                  onClick={() => onRemoveLayout(layout.id)}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <BrandSmallText>
            Nenhum layout salvo ainda. Envie um post e salve como layout de
            marca.
          </BrandSmallText>
        )}
      </BrandCard>
    </div>
  );
}
