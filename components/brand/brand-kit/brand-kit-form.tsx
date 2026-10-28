"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  saveOnboardingBrandKitFormSchema,
  type SaveOnboardingBrandKitFormValues,
} from "@/actions/save-onboarding-brand-kit/schema";
import type { BrandAssetKind } from "@/actions/upload-brand-asset/schema";
import { FormAlert } from "@/components/auth/form-alert";
import { OnboardingFooter } from "@/components/onboarding/onboarding-footer";
import { OnboardingSection } from "@/components/onboarding/onboarding-section";
import { RequirementBadge } from "@/components/onboarding/requirement-badge";
import { SideNote } from "@/components/onboarding/side-note";
import { TagInput } from "@/components/onboarding/tag-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupCardItem } from "@/components/ui/radio-group";
import { useSaveOnboardingBrandKit } from "@/hooks/mutations/use-save-onboarding-brand-kit";
import { useOnboardingAutosave } from "@/hooks/use-onboarding-autosave";
import { connectionFailure } from "@/lib/auth-action-result";
import { fontFamilies, imageStyles } from "@/lib/onboarding/constants";
import type { UploadedBrandAsset } from "@/lib/onboarding/get-step-data";
import {
  suggestPalette,
  type LogoAnalysis,
  type LogoCheckId,
  type LogoCheckStatus,
} from "@/lib/onboarding/logo-analysis";
import { cn } from "@/lib/utils";

import { BrandPreview } from "./brand-preview";
import { FontPicker } from "./font-picker";
import { LogoChecksRow } from "./logo-checks-row";
import { LogoUploadCard } from "./logo-upload-card";
import { ManualUpload } from "./manual-upload";
import { NativeSelect } from "./native-select";
import { PaletteEditor } from "./palette-editor";

type LogoKind = Exclude<BrandAssetKind, "manual">;
type LogoChecks = Partial<Record<LogoCheckId, LogoCheckStatus>>;

const statusSeverity: Record<LogoCheckStatus, number> = {
  ok: 0,
  aviso: 1,
  erro: 2,
};

function mergeLogoChecks(checksList: LogoChecks[]) {
  return checksList.reduce<LogoChecks>((mergedChecks, checks) => {
    (Object.entries(checks) as [LogoCheckId, LogoCheckStatus][]).forEach(
      ([checkId, status]) => {
        const currentStatus = mergedChecks[checkId];

        if (
          !currentStatus ||
          statusSeverity[status] > statusSeverity[currentStatus]
        ) {
          mergedChecks[checkId] = status;
        }
      },
    );

    return mergedChecks;
  }, {});
}

type BrandKitFormProps = {
  storeName: string;
  products: string[];
  defaultValues: SaveOnboardingBrandKitFormValues;
  isSettings?: boolean;
  uploadedAssets: Partial<Record<BrandAssetKind, UploadedBrandAsset>>;
};

export function BrandKitForm({
  storeName,
  products,
  defaultValues,
  isSettings = false,
  uploadedAssets: initialAssets,
}: BrandKitFormProps) {
  const router = useRouter();
  const saveBrandKitMutation = useSaveOnboardingBrandKit();
  const [uploadedAssets, setUploadedAssets] = useState(initialAssets);
  const [pendingChecks, setPendingChecks] = useState<
    Partial<Record<LogoKind, LogoChecks>>
  >({});
  const [lightLogoFile, setLightLogoFile] = useState<File>();
  const [logoColors, setLogoColors] = useState<string[]>([]);

  const form = useForm<SaveOnboardingBrandKitFormValues>({
    resolver: zodResolver(saveOnboardingBrandKitFormSchema),
    defaultValues,
  });

  const autosaveStatus = useOnboardingAutosave({
    form,
    schema: saveOnboardingBrandKitFormSchema,
    save: (values) =>
      saveBrandKitMutation.mutateAsync({ ...values, shouldAdvance: false }),
  });

  const [source, colors, titleFont, bodyFont] = useWatch({
    control: form.control,
    name: ["source", "colors", "titleFont", "bodyFont"],
  });

  const requiredLogoKinds: LogoKind[] = ["logo_claro", "logo_escuro"];
  const logoChecks = mergeLogoChecks(
    requiredLogoKinds.map(
      (kind) => pendingChecks[kind] ?? uploadedAssets[kind]?.checks ?? {},
    ),
  );
  const areRequiredLogosApproved = requiredLogoKinds.every(
    (kind) => uploadedAssets[kind] && !pendingChecks[kind],
  );

  const handleLogoUploaded =
    (kind: LogoKind) => (asset: UploadedBrandAsset, file: File) => {
      setUploadedAssets((assets) => ({ ...assets, [kind]: asset }));
      setPendingChecks((checks) => ({ ...checks, [kind]: undefined }));

      if (kind === "logo_claro") {
        setLightLogoFile(file);
      }
    };

  const handleLogoAnalyzed =
    (kind: LogoKind) => (analysis: LogoAnalysis | null) => {
      setPendingChecks((checks) => ({
        ...checks,
        [kind]: analysis?.checks ?? {},
      }));

      if (kind === "logo_claro" && analysis) {
        setLogoColors(analysis.dominantColors);
      }
    };

  const handleContinue = async (values: SaveOnboardingBrandKitFormValues) => {
    const result = await saveBrandKitMutation
      .mutateAsync({ ...values, shouldAdvance: !isSettings })
      .catch(connectionFailure);

    if (!result.isSuccess) {
      form.setError("root", { message: result.errorMessage });
      return;
    }

    if (result.data.redirectTo) {
      router.push(result.data.redirectTo);
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(handleContinue)}
        className="m-0 mt-8"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-8">
            <FormAlert message={form.formState.errors.root?.message} />

            <OnboardingSection title="Como você quer começar?">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        aria-label="Como você quer começar"
                        value={field.value}
                        onValueChange={field.onChange}
                        className="sm:grid-cols-2"
                      >
                        <RadioGroupCardItem value="upload_manual">
                          <span className="font-medium">
                            Tenho manual de marca ou arquivos
                          </span>
                          <span className="text-xs text-muted">
                            Envie logos, fontes e o manual (PDF ou ZIP). Você
                            confere e ajusta os campos.
                          </span>
                        </RadioGroupCardItem>
                        <RadioGroupCardItem value="guiado">
                          <span className="font-medium">
                            Não tenho nada definido
                          </span>
                          <span className="text-xs text-muted">
                            Modo guiado: a partir da sua logo, sugerimos a
                            paleta. Você escolhe as fontes e o estilo.
                          </span>
                        </RadioGroupCardItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              {source === "upload_manual" && (
                <ManualUpload
                  uploadedFileName={uploadedAssets.manual?.fileName}
                />
              )}
            </OnboardingSection>

            <OnboardingSection
              title="Logos"
              aside={
                <span className="text-sm text-muted">
                  SVG (ideal) ou PNG transparente, mínimo de 1000 px
                </span>
              }
            >
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <LogoUploadCard
                  kind="logo_claro"
                  title="Para fundo claro"
                  helper="A versão colorida da sua logo."
                  requirement="obrigatorio"
                  background="claro"
                  uploaded={uploadedAssets.logo_claro}
                  onUploaded={handleLogoUploaded("logo_claro")}
                  onAnalyzed={handleLogoAnalyzed("logo_claro")}
                />
                <LogoUploadCard
                  kind="logo_escuro"
                  title="Para fundo escuro"
                  helper="Sem essa versão? Geramos uma branca por processamento de imagem, não por IA."
                  requirement="obrigatorio"
                  background="escuro"
                  uploaded={uploadedAssets.logo_escuro}
                  onUploaded={handleLogoUploaded("logo_escuro")}
                  onAnalyzed={handleLogoAnalyzed("logo_escuro")}
                  whiteVersionSource={lightLogoFile}
                />
                <LogoUploadCard
                  kind="simbolo"
                  title="Símbolo ou ícone"
                  helper="Para selos e perfil. Precisa ficar legível a 24 px."
                  requirement="recomendado"
                  background="claro"
                  uploaded={uploadedAssets.simbolo}
                  onUploaded={handleLogoUploaded("simbolo")}
                  onAnalyzed={() => undefined}
                />
              </div>
            </OnboardingSection>

            <OnboardingSection
              title="Validações automáticas"
              aside={
                <span className="text-sm text-muted">
                  antes de gerar qualquer arte
                </span>
              }
            >
              <LogoChecksRow
                checks={logoChecks}
                isApproved={areRequiredLogosApproved}
              />
              <p className="m-0 text-sm text-muted">
                As logos são obrigatórias para criar a primeira arte. Você pode
                continuar agora e enviar depois.
              </p>
            </OnboardingSection>

            <OnboardingSection
              title="Paleta de cores"
              description="Clique numa cor para trocar ou digite o HEX."
              aside={<RequirementBadge requirement="obrigatorio" />}
            >
              <PaletteEditor
                suggestedPalette={
                  logoColors.length > 0 ? suggestPalette(logoColors) : null
                }
              />
            </OnboardingSection>

            <OnboardingSection
              title="Fontes"
              aside={<span className="text-sm text-muted">Google Fonts</span>}
            >
              <FontPicker />
            </OnboardingSection>

            <OnboardingSection
              title="Estilo de imagem"
              description="Como as fotos e ilustrações das artes devem parecer."
              aside={<RequirementBadge requirement="recomendado" />}
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
                      {imageStyles.map((style) => {
                        const isSelected = field.value === style.value;

                        return (
                          <button
                            key={style.value}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() =>
                              field.onChange(
                                isSelected ? undefined : style.value,
                              )
                            }
                            className={cn(
                              "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border px-4 font-display text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none",
                              isSelected
                                ? "border-primary bg-surface-2 text-text"
                                : "border-muted bg-bg text-text hover:bg-surface-2",
                            )}
                          >
                            {isSelected && (
                              <Check size={16} aria-hidden="true" />
                            )}
                            {style.label}
                          </button>
                        );
                      })}
                    </div>
                  </FormItem>
                )}
              />
            </OnboardingSection>

            <OnboardingSection
              title="Opcionais"
              aside={<RequirementBadge requirement="opcional" />}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="highlightFont"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Fonte de destaque · selos, preços e chamadas
                      </FormLabel>
                      <FormControl>
                        <NativeSelect {...field}>
                          <option value="">Usar a fonte dos títulos</option>
                          {fontFamilies.map((family) => (
                            <option key={family} value={family}>
                              {family}
                            </option>
                          ))}
                        </NativeSelect>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-text">
                    Versões monocromáticas
                  </span>
                  <p className="m-0 flex min-h-11 items-center text-sm text-muted">
                    {uploadedAssets.logo_escuro?.isGenerated
                      ? "Versão branca pronta, gerada da sua logo."
                      : "Geradas por processamento de imagem quando você precisar."}
                  </p>
                </div>
              </div>
              <FormField
                control={form.control}
                name="restrictions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      O que evitar · cores, elementos e termos
                    </FormLabel>
                    <FormControl>
                      <TagInput
                        value={field.value}
                        onChange={field.onChange}
                        maxTags={15}
                        addLabel="Adicionar"
                        placeholder="Ex.: fundo preto"
                        variant="danger"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </OnboardingSection>
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-(--r-lg) border border-border bg-bg p-5 shadow-(--shadow-md)">
              <p className="m-0 font-display text-lg font-semibold text-text">
                Prévia ao vivo
              </p>
              <p className="m-0 mt-1 mb-4 text-sm text-muted">
                Posts de exemplo com a sua marca. Atualiza a cada mudança.
              </p>
              <BrandPreview
                storeName={storeName}
                products={products}
                colors={colors}
                titleFont={titleFont}
                bodyFont={bodyFont}
                lightLogoUrl={uploadedAssets.logo_claro?.url}
                darkLogoUrl={uploadedAssets.logo_escuro?.url}
              />
            </div>
            <SideNote title="Sua logo está segura">
              <p>
                O original fica guardado com uma impressão digital (hash) e nada
                é alterado. Logo com fundo ou sobras é detectada e avisada.
              </p>
            </SideNote>
          </aside>
        </div>

        <OnboardingFooter
          autosaveStatus={
            form.formState.isSubmitSuccessful && autosaveStatus === "idle"
              ? "saved"
              : autosaveStatus
          }
          secondaryActions={isSettings ? false : undefined}
          isSubmitting={form.formState.isSubmitting}
          submitLabel={
            isSettings ? "Salvar alterações" : "Está certo! Continuar"
          }
        />
      </form>
    </Form>
  );
}
