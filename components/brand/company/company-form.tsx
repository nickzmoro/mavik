"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

import {
  saveOnboardingCompanyFormSchema,
  type SaveOnboardingCompanyFormValues,
} from "@/actions/save-onboarding-company/schema";
import { FormAlert } from "@/components/auth/form-alert";
import { IconInput } from "@/components/auth/icon-input";
import { OnboardingFooter } from "@/components/onboarding/onboarding-footer";
import { OnboardingSection } from "@/components/onboarding/onboarding-section";
import { RequirementBadge } from "@/components/onboarding/requirement-badge";
import { SideNote } from "@/components/onboarding/side-note";
import { TagInput } from "@/components/onboarding/tag-input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupCardItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useSaveOnboardingCompany } from "@/hooks/mutations/use-save-onboarding-company";
import { useOnboardingAutosave } from "@/hooks/use-onboarding-autosave";
import { connectionFailure } from "@/lib/auth-action-result";
import {
  businessGoals,
  isRegulatedSegment,
  marketingLevels,
  MAX_PRODUCTS,
  segments,
} from "@/lib/onboarding/constants";

const SEGMENT_LIST_ID = "onboarding-segments";

export function CompanyForm({
  defaultValues,
  isSettings = false,
}: {
  defaultValues: Partial<SaveOnboardingCompanyFormValues>;
  isSettings?: boolean;
}) {
  const router = useRouter();
  const saveCompanyMutation = useSaveOnboardingCompany();

  const form = useForm<SaveOnboardingCompanyFormValues>({
    resolver: zodResolver(saveOnboardingCompanyFormSchema),
    defaultValues,
  });

  const autosaveStatus = useOnboardingAutosave({
    form,
    schema: saveOnboardingCompanyFormSchema,
    save: (values) =>
      saveCompanyMutation.mutateAsync({ ...values, shouldAdvance: false }),
  });

  const segment = useWatch({ control: form.control, name: "segment" });

  const handleContinue = async (values: SaveOnboardingCompanyFormValues) => {
    const result = await saveCompanyMutation
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
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex flex-col gap-8">
            <FormAlert message={form.formState.errors.root?.message} />

            <OnboardingSection title="Sua empresa">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da empresa</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="organization"
                          placeholder="Ex.: Studio Aurora"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="segment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Segmento</FormLabel>
                      <FormControl>
                        <IconInput
                          icon={Search}
                          list={SEGMENT_LIST_ID}
                          placeholder="Busque seu segmento"
                          {...field}
                        />
                      </FormControl>
                      <datalist id={SEGMENT_LIST_ID}>
                        {segments.map((segmentOption) => (
                          <option key={segmentOption} value={segmentOption} />
                        ))}
                      </datalist>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="products"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <FormLabel>O que você vende?</FormLabel>
                      <span className="text-sm text-muted">
                        até {MAX_PRODUCTS} produtos ou serviços
                      </span>
                    </div>
                    <FormControl>
                      <TagInput
                        value={field.value ?? []}
                        onChange={field.onChange}
                        maxTags={MAX_PRODUCTS}
                        addLabel="Adicionar"
                        placeholder="Ex.: Limpeza de pele"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </OnboardingSection>

            <OnboardingSection title="Onde você atende">
              <div className="grid items-end gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade e estado</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="address-level2"
                          placeholder="Ex.: Bauru, SP"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="servesOnline"
                  render={({ field }) => (
                    <FormItem className="min-h-11 flex-row items-center gap-3">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer font-normal">
                        Também atendo online
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </OnboardingSection>

            <OnboardingSection
              title="Presença online"
              aside={<RequirementBadge requirement="opcional" />}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          inputMode="url"
                          autoComplete="url"
                          placeholder="www.suaempresa.com.br"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagramHandle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="@suaempresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="m-0 text-sm leading-normal text-muted">
                Usamos para conhecer sua marca e montar o diagnóstico. Se
                preferir, deixe em branco e pule por agora.
              </p>
            </OnboardingSection>

            <OnboardingSection title="Qual é o seu principal objetivo?">
              <FormField
                control={form.control}
                name="mainGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        aria-label="Principal objetivo"
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        className="sm:grid-cols-2"
                      >
                        {businessGoals.map((goal) => (
                          <RadioGroupCardItem key={goal.value} value={goal.value}>
                            {goal.label}
                          </RadioGroupCardItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </OnboardingSection>

            <OnboardingSection title="Quanto você entende de marketing?">
              <FormField
                control={form.control}
                name="marketingLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        aria-label="Quanto você entende de marketing"
                        value={field.value}
                        onValueChange={field.onChange}
                        className="sm:grid-cols-3"
                      >
                        {marketingLevels.map((level) => (
                          <RadioGroupCardItem key={level.value} value={level.value}>
                            {level.label}
                            <span className="text-xs text-muted">
                              {level.mode}
                            </span>
                          </RadioGroupCardItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Você pode trocar entre o Modo Simples e o Avançado a
                      qualquer momento.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </OnboardingSection>
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
            <SideNote title="Por que perguntamos?" variant="card">
              <p>
                Cada resposta deixa suas artes mais parecidas com a sua marca.
              </p>
              <p className="mt-3">
                <strong>Nível de experiência</strong> define se você usa o Modo
                Simples ou o Avançado.
              </p>
              <p className="mt-3">
                <strong>Site e Instagram</strong> ajudam a conhecer cores,
                fontes e estilo, e entram no diagnóstico.
              </p>
            </SideNote>
            {isRegulatedSegment(segment ?? "") && (
              <SideNote
                title="Segmento com regras de publicidade"
                variant="warning"
              >
                <p>
                  {segment} segue normas próprias. Vamos avisar quando um texto
                  precisar de cuidado.
                </p>
              </SideNote>
            )}
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
