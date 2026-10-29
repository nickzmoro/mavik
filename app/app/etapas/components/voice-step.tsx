"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Plus, RefreshCw } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import {
  saveOnboardingVoiceFormSchema,
  type SaveOnboardingVoiceFormValues,
} from "@/actions/save-onboarding-voice/schema";
import type { BrandAssetKind } from "@/actions/upload-brand-asset/schema";
import { FormAlert } from "@/components/auth/form-alert";
import { TagInput } from "@/components/common/tag-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateSampleCaption } from "@/hooks/mutations/use-generate-sample-caption";
import { useSaveOnboardingVoice } from "@/hooks/mutations/use-save-onboarding-voice";
import { MAX_COMPETITORS, MAX_PERSONAS } from "@/lib/onboarding/constants";
import { buildSampleCaption } from "@/lib/onboarding/sample-caption";
import { useToast } from "@/providers/toast-provider";

import type { BrandAssetsController } from "../hooks/use-brand-assets";
import { useStepFormActions } from "../hooks/use-step-form-actions";
import type { StepNavigationProps } from "../types";
import { ExampleUploadTile } from "./example-upload-tile";
import { FormSection, SectionHint } from "./form-section";
import { PersonaCard } from "./persona-card";
import { StepFooterActions } from "./step-footer-actions";
import { StepFrame } from "./step-frame";
import { ToneSliders } from "./tone-sliders";

const emptyPersona: SaveOnboardingVoiceFormValues["personas"][number] = {
  name: "",
  age: 30,
  description: "",
  confirmed: false,
};

const exampleTiles: {
  kind: Extract<BrandAssetKind, "post_bom" | "post_ruim">;
  title: string;
  variant: "positive" | "negative";
}[] = [
  { kind: "post_bom", title: "Posts que você ama", variant: "positive" },
  { kind: "post_ruim", title: "Posts que você não quer", variant: "negative" },
];

const CAPTION_DEBOUNCE_IN_MS = 900;

type VoiceStepProps = StepNavigationProps<SaveOnboardingVoiceFormValues> & {
  brandAssets: BrandAssetsController;
  context: {
    segment: string;
    firstProduct: string;
    isRegulated: boolean;
    sampleCaption: string;
  };
};

export function VoiceStep({
  defaultValues,
  brandAssets,
  context,
  onContinue,
  onBack,
  onExit,
}: VoiceStepProps) {
  const { showToast } = useToast();
  const { assets, pendingKinds, uploadAsset, removeAsset } = brandAssets;
  const [sampleCaption, setSampleCaption] = useState(context.sampleCaption);
  const captionTimeoutRef = useRef<number>(undefined);
  const saveMutation = useSaveOnboardingVoice();
  const { mutate: requestCaption, isPending: isWritingCaption } =
    useGenerateSampleCaption();

  const form = useForm<SaveOnboardingVoiceFormValues>({
    resolver: zodResolver(saveOnboardingVoiceFormSchema),
    defaultValues: {
      tone: {
        formalCasual: 70,
        seriousFun: 45,
        technicalSimple: 80,
        educationalSales: 35,
      },
      sampleApproved: false,
      lovedTerms: [],
      forbiddenTerms: [],
      personas: [],
      differentiators: "",
      objections: "",
      competitors: Array.from({ length: MAX_COMPETITORS }, () => ""),
      ...defaultValues,
    },
  });

  const personaFields = useFieldArray({
    control: form.control,
    name: "personas",
  });

  const { submitAndAdvance, saveDraftAndLeave } = useStepFormActions({
    form,
    save: (values, shouldAdvance) =>
      saveMutation.mutateAsync({ ...values, sampleCaption, shouldAdvance }),
  });

  const sampleApproved = useWatch({
    control: form.control,
    name: "sampleApproved",
  });

  const writeSampleCaption = () => {
    const { tone, lovedTerms, forbiddenTerms } = form.getValues();
    const showCaption = (caption: string) => {
      setSampleCaption(caption);
      form.setValue("sampleApproved", false);
    };

    requestCaption(
      {
        tone,
        segment: context.segment,
        product: context.firstProduct,
        lovedTerms,
        forbiddenTerms,
      },
      {
        onSuccess: (result) =>
          showCaption(
            result.isSuccess ? result.data.caption : buildSampleCaption(tone),
          ),
        onError: () => showCaption(buildSampleCaption(tone)),
      },
    );
  };

  const writeCaptionOnMount = useEffectEvent(writeSampleCaption);

  useEffect(() => {
    if (!context.sampleCaption) {
      writeCaptionOnMount();
    }

    return () => window.clearTimeout(captionTimeoutRef.current);
  }, [context.sampleCaption]);

  const scheduleSampleCaption = () => {
    window.clearTimeout(captionTimeoutRef.current);
    captionTimeoutRef.current = window.setTimeout(
      writeSampleCaption,
      CAPTION_DEBOUNCE_IN_MS,
    );
  };

  const handleSelectExample = async (kind: BrandAssetKind, file: File) => {
    const result = await uploadAsset(kind, file);

    showToast(result.isSuccess ? "Exemplo adicionado" : result.error);
  };

  const handleRemoveExample = async (kind: BrandAssetKind, assetId: string) => {
    const result = await removeAsset(kind, assetId);

    if (!result.isSuccess) {
      showToast(result.error);
    }
  };

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={submitAndAdvance(onContinue)}
        className="flex flex-1 flex-col"
      >
        <StepFrame
          step={3}
          title="Como sua marca fala?"
          description="Ensine ao sistema como a marca fala e com quem ela fala. Você confirma tudo antes de entrar para a memória da marca."
          onBack={onBack && (() => saveDraftAndLeave(onBack))}
          footer={
            <StepFooterActions
              onExit={() => saveDraftAndLeave(onExit)}
              isSubmitting={form.formState.isSubmitting}
            />
          }
        >
          <FormAlert message={form.formState.errors.root?.message} />

          <FormSection
            title="Tom de voz"
            adornment={<SectionHint>arraste para ajustar</SectionHint>}
          >
            <ToneSliders
              control={form.control}
              onToneChange={() => {
                form.setValue("sampleApproved", false);
                scheduleSampleCaption();
              }}
            />
          </FormSection>

          <FormSection
            title="É assim que sua marca fala?"
            adornment={
              <SectionHint>legenda de exemplo no tom escolhido</SectionHint>
            }
          >
            <div className="brand-quote flex flex-wrap items-center justify-between gap-4 rounded-(--r-lg) px-5 py-4">
              <p
                role="status"
                className="m-0 min-w-0 flex-1 basis-64 font-display text-lg leading-normal font-medium"
              >
                {isWritingCaption || !sampleCaption ? (
                  <span className="animate-pulse text-muted motion-reduce:animate-none">
                    Escrevendo uma frase no tom escolhido…
                  </span>
                ) : (
                  <>“{sampleCaption}”</>
                )}
              </p>
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={sampleApproved ? "secondary" : "default"}
                  aria-pressed={sampleApproved}
                  disabled={isWritingCaption || !sampleCaption}
                  onClick={() => form.setValue("sampleApproved", true)}
                >
                  {sampleApproved ? (
                    <Check aria-hidden="true" className="size-4" />
                  ) : null}
                  {sampleApproved ? "Aprovado" : "Sim, é isso"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isWritingCaption}
                  onClick={writeSampleCaption}
                >
                  <RefreshCw aria-hidden="true" className="size-4" />
                  Gerar outra
                </Button>
              </div>
            </div>
          </FormSection>

          <FormSection title="Palavras da marca">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="lovedTerms"
                render={({ field }) => (
                  <FormItem className="gap-2">
                    <FormLabel>Palavras que amamos</FormLabel>
                    <FormControl>
                      <TagInput
                        values={field.value}
                        onChange={field.onChange}
                        maxItems={10}
                        maxLength={40}
                        placeholder="Ex.: bem-estar"
                        ariaLabel="Palavra que amamos"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="forbiddenTerms"
                render={({ field }) => (
                  <FormItem className="gap-2">
                    <FormLabel>Termos proibidos</FormLabel>
                    <FormControl>
                      <TagInput
                        variant="destructive"
                        values={field.value}
                        onChange={field.onChange}
                        maxItems={10}
                        maxLength={40}
                        placeholder="Ex.: milagre"
                        ariaLabel="Termo proibido"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {context.isRegulated ? (
              <Alert variant="warning">
                <AlertTitle>Setor regulado</AlertTitle>
                <AlertDescription>
                  Publicidade em saúde e estética tem regras próprias. Termos de
                  risco, como &quot;milagre&quot;, e promessas de resultado
                  serão sinalizados.
                </AlertDescription>
              </Alert>
            ) : null}
          </FormSection>

          <FormSection
            title="Público e personas"
            adornment={<SectionHint>até {MAX_PERSONAS}</SectionHint>}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {personaFields.fields.map((persona, index) => (
                <PersonaCard
                  key={persona.id}
                  control={form.control}
                  index={index}
                  onRemove={() => personaFields.remove(index)}
                />
              ))}
              {personaFields.fields.length < MAX_PERSONAS ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => personaFields.append(emptyPersona)}
                  className="dropzone min-h-24 self-stretch rounded-(--r-lg)"
                >
                  <Plus aria-hidden="true" className="size-4.5" />
                  Adicionar persona
                </Button>
              ) : null}
            </div>
            <p className="m-0 text-sm leading-normal text-muted">
              Revisamos personas e imagens para evitar estereótipos.
            </p>
          </FormSection>

          <FormSection title="Diferenciais e concorrência">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="differentiators"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diferenciais</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="O que faz clientes escolherem você?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="objections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objeções frequentes</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="O que faz clientes hesitarem?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium">Concorrentes</span>
                <SectionHint>até {MAX_COMPETITORS}</SectionHint>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {Array.from({ length: MAX_COMPETITORS }, (_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`competitors.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            autoCapitalize="none"
                            aria-label={`Concorrente ${index + 1}`}
                            placeholder={`@concorrente${index + 1}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Exemplos de posts"
            adornment={<Badge variant="outline">Opcional</Badge>}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {exampleTiles.map(({ kind, title, variant }) => (
                <ExampleUploadTile
                  key={kind}
                  title={title}
                  variant={variant}
                  assets={assets[kind] ?? []}
                  isUploading={pendingKinds.includes(kind)}
                  onSelectFile={(file) => handleSelectExample(kind, file)}
                  onRemoveAsset={(assetId) => handleRemoveExample(kind, assetId)}
                />
              ))}
            </div>
          </FormSection>
        </StepFrame>
      </form>
    </Form>
  );
}
