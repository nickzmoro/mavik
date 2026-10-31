"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { RoundSendButton } from "@/components/common/round-send-button";
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
import type { CarouselCopyField } from "@/actions/generate-carousel-copy/schema";
import { useGenerateCarouselCopy } from "@/hooks/mutations/use-generate-carousel-copy";
import {
  carouselCopySchema,
  type CarouselCopy,
  type CarouselSlideCopy,
} from "@/lib/carousel/carousel-copy";
import { findPlaceholders } from "@/lib/post-copy/validate-post-copy";
import { routes } from "@/lib/routes";
import { usePostDraft, type PostDraft } from "@/providers/post-draft-provider";
import { useToast } from "@/providers/toast-provider";

import { CopyFieldCard } from "./copy-field-card";
import { PlaceholderHint } from "./placeholder-highlight";

const roleLabels: Record<CarouselSlideCopy["role"], string> = {
  cover: "Capa",
  stake: "Por que importa",
  idea: "Ideia",
  recap: "Resumo",
  cta: "Chamada para ação",
};

const regenerateFailedMessage =
  "Não conseguimos gerar outra opção agora. Tente de novo.";

const getFieldKey = (field: CarouselCopyField) =>
  field === "caption" ? "caption" : `slide-${field.slide}`;

type CarouselCopyFormProps = {
  draft: PostDraft & { carouselCopy: CarouselCopy };
};

export function CarouselCopyForm({ draft }: CarouselCopyFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { updateDraft } = usePostDraft();
  const generateCarouselCopyMutation = useGenerateCarouselCopy();
  const [regeneratingField, setRegeneratingField] = useState<string | null>(
    null,
  );
  const form = useForm<CarouselCopy>({
    resolver: zodResolver(carouselCopySchema),
    defaultValues: draft.carouselCopy,
  });
  const values = useWatch({ control: form.control }) as CarouselCopy;
  const slideCount = draft.carouselCopy.slides.length;
  const placeholders = [
    ...new Set(
      [
        ...values.slides.flatMap(({ headline, body }) => [headline, body]),
        values.caption,
      ].flatMap(findPlaceholders),
    ),
  ];

  const saveCopy = useEffectEvent((nextValues: CarouselCopy) => {
    const parsedCopy = carouselCopySchema.safeParse(nextValues);

    if (parsedCopy.success) {
      updateDraft({ carouselCopy: parsedCopy.data });
    }
  });

  useEffect(() => saveCopy(values), [values]);

  const regenerateField = async (field: CarouselCopyField) => {
    const currentCopy = carouselCopySchema.safeParse(form.getValues());

    setRegeneratingField(getFieldKey(field));

    const result = await generateCarouselCopyMutation
      .mutateAsync({
        prompt: draft.prompt,
        slideCount,
        field,
        currentCopy: currentCopy.success
          ? currentCopy.data
          : draft.carouselCopy,
      })
      .catch(() => null);

    setRegeneratingField(null);

    if (!result?.isSuccess) {
      showToast(result?.errorMessage ?? regenerateFailedMessage);
      return;
    }

    if (field === "caption") {
      form.setValue("caption", result.data.copy.caption, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    form.setValue(
      `slides.${field.slide - 1}`,
      result.data.copy.slides[field.slide - 1],
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const handleApprove = (carouselCopy: CarouselCopy) => {
    if (placeholders.length > 0) {
      return;
    }

    updateDraft({ carouselCopy, isApproved: true });
    router.push(routes.studio);
  };

  const fieldCardProps = (
    field: CarouselCopyField,
    title: string,
    note: string,
  ) => ({
    title,
    note,
    isRegenerating: regeneratingField === getFieldKey(field),
    isRegenerateDisabled: regeneratingField !== null,
    onRegenerate: () => regenerateField(field),
  });

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(handleApprove)}
        aria-label="Textos do carrossel"
        className="glass m-0 flex flex-col gap-4 rounded-3xl p-4 sm:p-5"
      >
        <p className="m-0 text-sm leading-normal text-muted">
          {slideCount} slides · {draft.variationCount}{" "}
          {draft.variationCount === 1 ? "versão" : "versões"} da capa. Os textos
          entram na arte exatamente como estiverem aqui.
        </p>
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {draft.carouselCopy.slides.map((slide, index) => (
            <li key={index}>
              <CopyFieldCard
                {...fieldCardProps(
                  { slide: index + 1 },
                  `${index + 1}/${slideCount} · ${roleLabels[slide.role]}`,
                  "Vai na arte",
                )}
              >
                <FormField
                  control={form.control}
                  name={`slides.${index}.headline`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input maxLength={60} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`slides.${index}.body`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto</FormLabel>
                      <FormControl>
                        <Textarea rows={2} maxLength={180} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <PlaceholderHint
                  texts={[
                    values.slides[index]?.headline ?? "",
                    values.slides[index]?.body ?? "",
                  ]}
                />
              </CopyFieldCard>
            </li>
          ))}
        </ol>
        <CopyFieldCard
          {...fieldCardProps("caption", "Legenda", "Só na legenda do post")}
        >
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Legenda</FormLabel>
                <FormControl>
                  <Textarea rows={6} maxLength={2200} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PlaceholderHint texts={[values.caption]} />
        </CopyFieldCard>
        {placeholders.length > 0 ? (
          <p role="status" className="m-0 text-sm leading-normal text-warning">
            Para aprovar, troque {placeholders.join(", ")} pelo valor real.
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" asChild>
            <Link href={routes.authenticatedHome}>
              <ArrowLeft aria-hidden="true" className="size-4.5" />
              Voltar para a Início
            </Link>
          </Button>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="font-display text-sm font-semibold"
            >
              Aprovar e gerar a capa
            </span>
            <RoundSendButton
              label="Aprovar e gerar a capa"
              disabled={placeholders.length > 0 || regeneratingField !== null}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
