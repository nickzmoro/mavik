"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  saveOnboardingCompanyFormSchema,
  type SaveOnboardingCompanyFormValues,
} from "@/actions/save-onboarding-company/schema";
import { FormAlert } from "@/components/auth/form-alert";
import { IconInput } from "@/components/auth/icon-input";
import { OptionRadioGroup } from "@/components/common/option-radio-group";
import { TagInput } from "@/components/common/tag-input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useSaveOnboardingCompany } from "@/hooks/mutations/use-save-onboarding-company";
import {
  businessGoals,
  marketingLevels,
  MAX_PRODUCTS,
  segments,
} from "@/lib/onboarding/constants";

import { useStepFormActions } from "../hooks/use-step-form-actions";
import type { StepNavigationProps } from "../types";
import { FormSection, SectionHint } from "./form-section";
import { StepFooterActions } from "./step-footer-actions";
import { StepFrame } from "./step-frame";

const segmentsListId = "onboarding-segments";

const marketingLevelOptions = marketingLevels.map(
  ({ value, label, mode }) => ({ value, label, description: mode }),
);

export function CompanyStep({
  defaultValues,
  onContinue,
  onExit,
}: StepNavigationProps<SaveOnboardingCompanyFormValues>) {
  const saveMutation = useSaveOnboardingCompany();
  const form = useForm<SaveOnboardingCompanyFormValues>({
    resolver: zodResolver(saveOnboardingCompanyFormSchema),
    defaultValues: {
      name: "",
      segment: "",
      products: [],
      location: "",
      servesOnline: false,
      websiteUrl: "",
      instagramHandle: "",
      marketingLevel: "simples",
      ...defaultValues,
    },
  });

  const { submitAndAdvance, saveDraftAndLeave } = useStepFormActions({
    form,
    save: (values, shouldAdvance) =>
      saveMutation.mutateAsync({ ...values, shouldAdvance }),
  });

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={submitAndAdvance(onContinue)}
        className="flex flex-1 flex-col"
      >
        <StepFrame
          step={1}
          title="Conte sobre sua empresa"
          description="Um assunto por tela, sem formulário gigante. Você pode editar tudo depois."
          footer={
            <StepFooterActions
              onExit={() => saveDraftAndLeave(onExit)}
              isSubmitting={form.formState.isSubmitting}
            />
          }
        >
          <FormAlert message={form.formState.errors.root?.message} />

          <FormSection title="Sua empresa">
            <div className="grid gap-6 sm:grid-cols-2">
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
                        list={segmentsListId}
                        autoComplete="off"
                        placeholder="Busque o seu segmento"
                        {...field}
                      />
                    </FormControl>
                    <datalist id={segmentsListId}>
                      {segments.map((segment) => (
                        <option key={segment} value={segment} />
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
                <FormItem className="gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <FormLabel>O que você vende?</FormLabel>
                    <SectionHint>
                      até {MAX_PRODUCTS} produtos ou serviços
                    </SectionHint>
                  </div>
                  <FormControl>
                    <TagInput
                      values={field.value}
                      onChange={field.onChange}
                      maxItems={MAX_PRODUCTS}
                      maxLength={40}
                      placeholder="Ex.: Limpeza de pele"
                      ariaLabel="Produto ou serviço"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Onde você atende">
            <div className="grid items-start gap-6 sm:grid-cols-2">
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
                  <FormItem className="min-h-11 flex-row items-center gap-3 sm:mt-7">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">
                      Também atendo online
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title="Presença online"
            adornment={<Badge variant="outline">Opcional</Badge>}
            description="Usamos para extrair sua marca automaticamente e montar o diagnóstico."
          >
            <div className="grid gap-6 sm:grid-cols-2">
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
                      <Input
                        autoCapitalize="none"
                        placeholder="@suaempresa"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>

          <FormSection title="Qual é o seu principal objetivo?">
            <FormField
              control={form.control}
              name="mainGoal"
              render={({ field }) => (
                <FormItem>
                  <OptionRadioGroup
                    ariaLabel="Principal objetivo"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={businessGoals}
                    className="sm:grid-cols-2"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Quanto você entende de marketing?">
            <FormField
              control={form.control}
              name="marketingLevel"
              render={({ field }) => (
                <FormItem>
                  <OptionRadioGroup
                    ariaLabel="Nível de experiência"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={marketingLevelOptions}
                    className="md:grid-cols-3"
                  />
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
