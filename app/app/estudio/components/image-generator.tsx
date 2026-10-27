"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { FormAlert } from "@/components/auth/form-alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateImage } from "@/hooks/mutations/use-generate-image";
import { readFileAsDataUrl } from "@/lib/read-file-as-data-url";
import { STUDIO_PAUTA_PARAM } from "@/lib/routes";
import {
  generateImageFormSchema,
  type GenerateImageFormValues,
} from "@/lib/validations/image-generation";

import { GeneratedImageCard } from "./generated-image-card";
import { ReferenceImagePicker } from "./reference-image-picker";

const promptStarters = [
  {
    label: "Produto em destaque",
    prompt:
      "Uma arte destacando nosso produto principal, com fundo limpo e iluminação suave.",
  },
  {
    label: "Promoção da semana",
    prompt:
      "Uma arte anunciando a promoção da semana, com clima alegre e cores chamativas.",
  },
  {
    label: "Bastidores",
    prompt:
      "Uma arte mostrando os bastidores da loja, com clima acolhedor e real.",
  },
  {
    label: "Dica para clientes",
    prompt:
      "Uma arte com uma dica útil para nossos clientes, visual leve e organizado.",
  },
];

export function ImageGenerator() {
  const searchParams = useSearchParams();
  const generateImageMutation = useGenerateImage();
  const isGenerating = generateImageMutation.isPending;

  const form = useForm<GenerateImageFormValues>({
    resolver: zodResolver(generateImageFormSchema),
    defaultValues: {
      prompt: searchParams.get(STUDIO_PAUTA_PARAM) ?? "",
      referenceImage: undefined,
    },
  });

  const handleGenerate = async ({
    prompt,
    referenceImage,
  }: GenerateImageFormValues) => {
    const referenceImageDataUrl = referenceImage
      ? await readFileAsDataUrl(referenceImage).catch(() => null)
      : undefined;

    if (referenceImageDataUrl === null) {
      form.setError("referenceImage", {
        message: "Não conseguimos ler essa foto. Envie outra.",
      });
      return;
    }

    generateImageMutation.mutate({
      prompt,
      referenceImage: referenceImageDataUrl,
    });
  };

  const handleStarterSelect = (prompt: string) => {
    form.setValue("prompt", prompt, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setFocus("prompt");
  };

  return (
    <div className="flex flex-col gap-6">
      <section
        aria-labelledby="image-generator-title"
        className="rounded-[24px] border border-border bg-bg p-6 shadow-(--shadow-sm) sm:p-8"
      >
        <h2
          id="image-generator-title"
          className="m-0 font-display text-2xl leading-[1.25] font-semibold text-text"
        >
          O que a sua loja vai contar hoje?
        </h2>
        <p className="m-0 mt-2 text-base leading-[1.6] text-muted">
          Descreva a ideia com suas palavras. Se quiser, envie uma foto para a
          arte seguir o seu produto.
        </p>

        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(handleGenerate)}
            className="m-0 mt-6 flex flex-col gap-5"
          >
            <FormAlert message={generateImageMutation.error?.message} />

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da arte</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex.: uma arte com a foto do nosso novo bolo"
                      disabled={isGenerating}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm leading-normal text-muted">
                Comece por:
              </span>
              {promptStarters.map(({ label, prompt }) => (
                <Button
                  key={label}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-border font-sans font-medium"
                  disabled={isGenerating}
                  onClick={() => handleStarterSelect(prompt)}
                >
                  {label}
                </Button>
              ))}
            </div>

            <FormField
              control={form.control}
              name="referenceImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto de referência (opcional)</FormLabel>
                  <ReferenceImagePicker
                    file={field.value}
                    onFileChange={field.onChange}
                    disabled={isGenerating}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="brand"
              className="self-end"
              loading={isGenerating}
            >
              {!isGenerating && <Sparkles size={18} aria-hidden="true" />}
              {isGenerating ? "Gerando arte..." : "Gerar arte"}
            </Button>
          </form>
        </Form>
      </section>

      <GeneratedImageCard
        imageUrl={generateImageMutation.data?.imageUrl}
        isGenerating={isGenerating}
      />
    </div>
  );
}
