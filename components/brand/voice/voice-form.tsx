"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

import {
  saveOnboardingVoiceFormSchema,
  type SaveOnboardingVoiceFormValues,
} from "@/actions/save-onboarding-voice/schema";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSaveOnboardingVoice } from "@/hooks/mutations/use-save-onboarding-voice";
import { useOnboardingAutosave } from "@/hooks/use-onboarding-autosave";
import { connectionFailure } from "@/lib/auth-action-result";
import { MAX_COMPETITORS } from "@/lib/onboarding/constants";
import type { PostExample } from "@/lib/onboarding/get-step-data";
import { buildSampleCaption } from "@/lib/onboarding/sample-caption";

import { PersonaCards } from "./persona-cards";
import { PostExamples } from "./post-examples";
import { ToneSliders } from "./tone-sliders";
import { VoicePreviewCard } from "./voice-preview-card";

type VoiceFormProps = {
  isRegulated: boolean;
  firstProduct?: string;
  defaultValues: SaveOnboardingVoiceFormValues;
  isSettings?: boolean;
  postExamples: PostExample[];
};

export function VoiceForm({
  isRegulated,
  firstProduct,
  defaultValues,
  postExamples,
  isSettings = false,
}: VoiceFormProps) {
  const router = useRouter();
  const saveVoiceMutation = useSaveOnboardingVoice();

  const form = useForm<SaveOnboardingVoiceFormValues>({
    resolver: zodResolver(saveOnboardingVoiceFormSchema),
    defaultValues,
  });

  const tone = useWatch({ control: form.control, name: "tone" });
  const sampleCaption = buildSampleCaption(tone, firstProduct);

  const autosaveStatus = useOnboardingAutosave({
    form,
    schema: saveOnboardingVoiceFormSchema,
    save: (values) =>
      saveVoiceMutation.mutateAsync({
        ...values,
        sampleCaption: buildSampleCaption(values.tone, firstProduct),
        shouldAdvance: false,
      }),
  });

  const handleContinue = async (values: SaveOnboardingVoiceFormValues) => {
    const result = await saveVoiceMutation
      .mutateAsync({ ...values, sampleCaption, shouldAdvance: !isSettings })
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

            <div id="tone-of-voice" className="scroll-mt-8">
              <OnboardingSection
                title="Tom de voz"
                aside={
                  <span className="text-sm text-muted">
                    arraste para ajustar
                  </span>
                }
              >
                <ToneSliders />
              </OnboardingSection>
            </div>

            <OnboardingSection title="Palavras da marca">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="lovedTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Palavras que amamos</FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value}
                          onChange={field.onChange}
                          maxTags={10}
                          addLabel="Adicionar"
                          placeholder="Ex.: cuidado"
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
                    <FormItem>
                      <FormLabel>Termos proibidos</FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value}
                          onChange={field.onChange}
                          maxTags={10}
                          addLabel="Adicionar"
                          placeholder="Ex.: barato"
                          variant="danger"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {isRegulated && (
                <SideNote title="Setor regulado" variant="warning">
                  <p>
                    Publicidade em saúde e estética tem regras próprias. Termos
                    de risco, como &quot;milagre&quot;, e promessas de resultado
                    serão sinalizados.
                  </p>
                </SideNote>
              )}
            </OnboardingSection>

            <OnboardingSection
              title="Público e personas"
              aside={
                <span className="text-sm text-muted">
                  até 3 · edite ou confirme
                </span>
              }
            >
              <PersonaCards />
              <p className="m-0 text-sm text-muted">
                Descreva pessoas reais que compram de você. Evite estereótipos:
                só a idade e o que elas buscam já ajudam muito.
              </p>
            </OnboardingSection>

            <OnboardingSection title="Diferenciais e concorrência">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="differentiators"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diferenciais</FormLabel>
                      <FormControl>
                        <Textarea
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
                          placeholder="O que faz clientes hesitarem?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
                <legend className="flex w-full justify-between p-0 text-sm font-medium text-text">
                  Concorrentes
                  <span className="font-normal text-muted">
                    até {MAX_COMPETITORS}
                  </span>
                </legend>
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
              </fieldset>
            </OnboardingSection>

            <OnboardingSection
              title="Exemplos de posts"
              aside={<RequirementBadge requirement="opcional" />}
            >
              <PostExamples initialExamples={postExamples} />
            </OnboardingSection>
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
            <VoicePreviewCard sampleCaption={sampleCaption} />
            <SideNote title="Você está no controle">
              <p>Nada entra na memória da marca sem sua confirmação.</p>
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
          submitLabel={isSettings ? "Salvar alterações" : "Continuar"}
        />
      </form>
    </Form>
  );
}
