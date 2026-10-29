"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import type { ExtractedBrandKit } from "@/actions/extract-brand-manual/schema";
import {
  saveOnboardingBrandKitFormSchema,
  type SaveOnboardingBrandKitFormValues,
} from "@/actions/save-onboarding-brand-kit/schema";
import type { BrandAssetKind } from "@/actions/upload-brand-asset/schema";
import { FormAlert } from "@/components/auth/form-alert";
import { FilterPill } from "@/components/common/filter-pill";
import { OptionRadioGroup } from "@/components/common/option-radio-group";
import { TagInput } from "@/components/common/tag-input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useExtractBrandManual } from "@/hooks/mutations/use-extract-brand-manual";
import { useSaveOnboardingBrandKit } from "@/hooks/mutations/use-save-onboarding-brand-kit";
import { connectionFailure } from "@/lib/auth-action-result";
import { getContrastRatio, minimumAaContrast } from "@/lib/color-contrast";
import { logoCheckLabels } from "@/lib/onboarding/analyze-logo";
import {
  colorRoles,
  DEFAULT_BODY_FONT,
  DEFAULT_TITLE_FONT,
  defaultBrandColors,
  imageStyles,
  LOGO_MIME_TYPES,
  MAX_RESTRICTIONS,
} from "@/lib/onboarding/constants";
import { useToast } from "@/providers/toast-provider";

import type { BrandAssetsController } from "../hooks/use-brand-assets";
import { useStepFormActions } from "../hooks/use-step-form-actions";
import type { StepNavigationProps } from "../types";
import { ColorSwatchField } from "./color-swatch-field";
import { FontCard } from "./font-card";
import { FormSection, SectionHint } from "./form-section";
import { LogoUploadTile } from "./logo-upload-tile";
import { LogoValidations } from "./logo-validations";
import { ManualDropzone } from "./manual-dropzone";
import { StepFooterActions } from "./step-footer-actions";
import { StepFrame } from "./step-frame";

const sourceOptions = [
  {
    value: "upload_manual",
    label: "Tenho manual de marca ou arquivos",
    description:
      "Envie logos e o manual (PDF ou ZIP). O PDF é lido e preenche os campos; você só confirma.",
  },
  {
    value: "guiado",
    label: "Não tenho nada definido",
    description:
      "Modo guiado: escolha as cores, as fontes e o estilo da sua marca nos campos abaixo.",
  },
];

const logoTiles: {
  kind: Extract<BrandAssetKind, "logo_claro" | "logo_escuro" | "simbolo">;
  title: string;
  requirement: "Obrigatório" | "Recomendado";
  emptyLabel: string;
  previewClassName: string;
}[] = [
  {
    kind: "logo_claro",
    title: "Para fundo claro",
    requirement: "Obrigatório",
    emptyLabel: "SVG ou PNG transparente",
    previewClassName: "bg-white text-neutral-600",
  },
  {
    kind: "logo_escuro",
    title: "Para fundo escuro",
    requirement: "Obrigatório",
    emptyLabel: "SVG ou PNG transparente",
    previewClassName: "bg-[#2b1b1f] text-neutral-300",
  },
  {
    kind: "simbolo",
    title: "Símbolo ou ícone",
    requirement: "Recomendado",
    emptyLabel: "SVG ou PNG quadrado",
    previewClassName: "bg-transparent",
  },
];

const logoAccept = LOGO_MIME_TYPES.join(",");

type BrandKitStepProps = StepNavigationProps<SaveOnboardingBrandKitFormValues> & {
  brandAssets: BrandAssetsController;
};

export function BrandKitStep({
  defaultValues,
  brandAssets,
  onContinue,
  onBack,
  onExit,
}: BrandKitStepProps) {
  const { showToast } = useToast();
  const { assets, pendingKinds, uploadAsset, removeAsset } = brandAssets;
  const [isReadingManual, setIsReadingManual] = useState(false);
  const saveMutation = useSaveOnboardingBrandKit();
  const extractMutation = useExtractBrandManual();

  const form = useForm<SaveOnboardingBrandKitFormValues>({
    resolver: zodResolver(saveOnboardingBrandKitFormSchema),
    defaultValues: {
      source: "upload_manual",
      colors: defaultBrandColors,
      titleFont: DEFAULT_TITLE_FONT,
      bodyFont: DEFAULT_BODY_FONT,
      highlightFont: "",
      fontSources: { titulo: "google", paragrafo: "google", destaque: "google" },
      licenseConfirmed: false,
      restrictions: [],
      ...defaultValues,
    },
  });

  const { submitAndAdvance, saveDraftAndLeave } = useStepFormActions({
    form,
    save: (values, shouldAdvance) =>
      saveMutation.mutateAsync({ ...values, shouldAdvance }),
  });

  const [source, colors] = useWatch({
    control: form.control,
    name: ["source", "colors"],
  });
  const hasAccessibleContrast =
    getContrastRatio(colors.texto, colors.fundo) >= minimumAaContrast;

  const handleLogoSelected = async (kind: BrandAssetKind, file: File) => {
    const result = await uploadAsset(kind, file);

    showToast(
      !result.isSuccess
        ? result.error
        : result.item.checks[logoCheckLabels.approval] === "ok"
          ? "Logo aprovada"
          : "Logo enviada, com avisos. Veja as validações abaixo.",
    );
  };

  const handleLogoRemoved = async (kind: BrandAssetKind, assetId: string) => {
    const result = await removeAsset(kind, assetId);

    if (!result.isSuccess) {
      showToast(result.error);
    }
  };

  const applyExtractedKit = (extractedKit: ExtractedBrandKit) => {
    const setOptions = { shouldDirty: true, shouldValidate: true };

    colorRoles.forEach(({ value: role }) => {
      const hex = extractedKit.colors[role];

      if (hex) {
        form.setValue(`colors.${role}`, hex, setOptions);
      }
    });

    if (extractedKit.titleFont) {
      form.setValue("titleFont", extractedKit.titleFont, setOptions);
    }

    if (extractedKit.bodyFont) {
      form.setValue("bodyFont", extractedKit.bodyFont, setOptions);
    }

    if (extractedKit.highlightFont) {
      form.setValue("highlightFont", extractedKit.highlightFont, setOptions);
    }

    if (extractedKit.imageStyle) {
      form.setValue("imageStyle", extractedKit.imageStyle, setOptions);
    }

    if (extractedKit.restrictions.length > 0) {
      form.setValue(
        "restrictions",
        Array.from(
          new Set([
            ...form.getValues("restrictions"),
            ...extractedKit.restrictions,
          ]),
        ).slice(0, MAX_RESTRICTIONS),
        setOptions,
      );
    }
  };

  const handleManualSelected = async (file: File) => {
    const uploadResult = await uploadAsset("manual", file);

    if (!uploadResult.isSuccess) {
      showToast(uploadResult.error);
      return;
    }

    setIsReadingManual(true);

    const extractResult = await extractMutation
      .mutateAsync()
      .catch(connectionFailure)
      .finally(() => setIsReadingManual(false));

    if (!extractResult.isSuccess) {
      showToast(extractResult.errorMessage);
      return;
    }

    applyExtractedKit(extractResult.data);
    showToast(
      extractResult.data.filledCount > 0
        ? `Preenchemos ${extractResult.data.filledCount} campos com o manual. Confira antes de continuar.`
        : "Não encontramos cores, fontes ou estilo no manual. Preencha os campos manualmente.",
    );
  };

  const manualBusyLabel = isReadingManual
    ? "Lendo o manual da marca…"
    : pendingKinds.includes("manual")
      ? "Enviando o manual…"
      : null;

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={submitAndAdvance(onContinue)}
        className="flex flex-1 flex-col"
      >
        <StepFrame
          step={2}
          title="Monte seu Brand Kit"
          description="A base de tudo. Pedimos só o mínimo para liberar o Estúdio; o resto vem aos poucos."
          onBack={onBack && (() => saveDraftAndLeave(onBack))}
          footer={
            <StepFooterActions
              submitLabel="Está certo! Continuar"
              onExit={() => saveDraftAndLeave(onExit)}
              isSubmitting={form.formState.isSubmitting}
            />
          }
        >
          <FormAlert message={form.formState.errors.root?.message} />

          <FormSection title="Como você quer começar?">
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <OptionRadioGroup
                    ariaLabel="Como começar o Brand Kit"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={sourceOptions}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {source === "upload_manual" ? (
              <ManualDropzone
                asset={assets.manual?.[0]}
                busyLabel={manualBusyLabel}
                onSelectFile={handleManualSelected}
              />
            ) : null}
          </FormSection>

          <FormSection
            title="Logos"
            adornment={
              <SectionHint>
                SVG (ideal) ou PNG transparente, mínimo de 1000 px
              </SectionHint>
            }
          >
            <div className="grid gap-4 md:grid-cols-3">
              {logoTiles.map(({ kind, ...tile }) => {
                const asset = assets[kind]?.[0];

                return (
                  <LogoUploadTile
                    key={kind}
                    {...tile}
                    accept={logoAccept}
                    asset={asset}
                    isUploading={pendingKinds.includes(kind)}
                    onSelectFile={(file) => handleLogoSelected(kind, file)}
                    onRemove={() => asset && handleLogoRemoved(kind, asset.id)}
                  />
                );
              })}
            </div>
          </FormSection>

          <FormSection
            title="Validações automáticas"
            adornment={<SectionHint>antes de gerar qualquer arte</SectionHint>}
          >
            <LogoValidations
              logos={logoTiles.map(({ kind, title }) => ({
                title: `Logo ${title.toLowerCase()}`,
                asset: assets[kind]?.[0],
              }))}
            />
          </FormSection>

          <FormSection
            title="Paleta de cores"
            adornment={<Badge variant="secondary">Obrigatório</Badge>}
            description="Clique numa cor para trocar ou digite o código HEX."
          >
            <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-5">
              {colorRoles.map(({ value, label }) => (
                <ColorSwatchField
                  key={value}
                  control={form.control}
                  role={value}
                  label={label}
                />
              ))}
            </div>
            <div>
              {hasAccessibleContrast ? (
                <Badge variant="success">Contraste AA ok</Badge>
              ) : (
                <Badge variant="warning">
                  Pouco contraste entre texto e fundo
                </Badge>
              )}
            </div>
          </FormSection>

          <FormSection
            title="Fontes"
            adornment={<SectionHint>Google Fonts ou só o nome</SectionHint>}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="titleFont"
                render={({ field }) => (
                  <FormItem>
                    <FontCard
                      label="Títulos"
                      requirement="Obrigatório"
                      value={field.value}
                      defaultValue={DEFAULT_TITLE_FONT}
                      onChange={field.onChange}
                      onSourceResolved={(fontSource) =>
                        form.setValue("fontSources.titulo", fontSource)
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bodyFont"
                render={({ field }) => (
                  <FormItem>
                    <FontCard
                      label="Parágrafos"
                      requirement="Obrigatório"
                      value={field.value}
                      defaultValue={DEFAULT_BODY_FONT}
                      onChange={field.onChange}
                      onSourceResolved={(fontSource) =>
                        form.setValue("fontSources.paragrafo", fontSource)
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="highlightFont"
                render={({ field }) => (
                  <FormItem>
                    <FontCard
                      label="Destaque"
                      requirement="Opcional"
                      emptyDescription="Para selos, preços e chamadas."
                      value={field.value}
                      onChange={field.onChange}
                      onSourceResolved={(fontSource) =>
                        form.setValue("fontSources.destaque", fontSource)
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="licenseConfirmed"
              render={({ field }) => (
                <FormItem>
                  <div className="flex min-h-11 items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer font-normal">
                      Confirmo que tenho o direito de uso destas fontes.
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection
            title="Estilo de imagem"
            adornment={<Badge variant="warning">Recomendado</Badge>}
          >
            <FormField
              control={form.control}
              name="imageStyle"
              render={({ field }) => (
                <FormItem>
                  <div
                    role="group"
                    aria-label="Estilo de imagem"
                    className="flex flex-wrap gap-2"
                  >
                    {imageStyles.map(({ value, label }) => {
                      const isActive = field.value === value;

                      return (
                        <FilterPill
                          key={value}
                          size="lg"
                          isActive={isActive}
                          onClick={() =>
                            field.onChange(isActive ? undefined : value)
                          }
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {isActive ? (
                              <Check aria-hidden="true" className="size-4" />
                            ) : null}
                            {label}
                          </span>
                        </FilterPill>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection
            title="Opcionais"
            adornment={<Badge variant="outline">Adicione quando quiser</Badge>}
          >
            <FormField
              control={form.control}
              name="restrictions"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel>
                    O que evitar{" "}
                    <span className="font-normal text-muted">
                      · cores, elementos e termos
                    </span>
                  </FormLabel>
                  <FormControl>
                    <TagInput
                      values={field.value}
                      onChange={field.onChange}
                      maxItems={MAX_RESTRICTIONS}
                      maxLength={60}
                      placeholder="Ex.: fundo preto"
                      ariaLabel="O que evitar"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>
        </StepFrame>
      </form>
    </Form>
  );
}
