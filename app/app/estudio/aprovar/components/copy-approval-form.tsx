"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { RoundSendButton } from "@/components/common/round-send-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useGeneratePostCopy } from "@/hooks/mutations/use-generate-post-copy";
import { findArtFormat, hasCaption } from "@/lib/art-options";
import {
  MAX_POST_COPY_TOPICS,
  postCopySchema,
  type PostCopy,
  type PostCopyField,
} from "@/lib/post-copy/post-copy-schema";
import { getBlockingPlaceholders } from "@/lib/post-copy/validate-post-copy";
import { routes } from "@/lib/routes";
import { usePostDraft, type PostDraft } from "@/providers/post-draft-provider";
import { useToast } from "@/providers/toast-provider";

import { CopyArtPreview } from "./copy-art-preview";
import { CopyFieldCard } from "./copy-field-card";
import { CopyOptionsSummary } from "./copy-options-summary";
import { PlaceholderHint } from "./placeholder-highlight";

const fieldLabels: Record<PostCopyField, string> = {
  title: "Título",
  subtitle: "Subtítulo",
  topics: "Tópicos",
  cta: "Chamada para ação",
  caption: "Legenda",
};

const regenerateFailedMessage =
  "Não conseguimos gerar outra opção agora. Tente de novo.";

type CopyApprovalFormProps = {
  draft: PostDraft & { copy: PostCopy };
  hasLostAttachments: boolean;
};

export function CopyApprovalForm({
  draft,
  hasLostAttachments,
}: CopyApprovalFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { updateDraft } = usePostDraft();
  const generatePostCopyMutation = useGeneratePostCopy();
  const [artFields, setArtFields] = useState(draft.artFields);
  const [regeneratingField, setRegeneratingField] =
    useState<PostCopyField | null>(null);
  const form = useForm<PostCopy>({
    resolver: zodResolver(postCopySchema),
    defaultValues: draft.copy,
  });
  const topics = useFieldArray({ control: form.control, name: "topics" });
  const values = useWatch({ control: form.control }) as PostCopy;
  const format = findArtFormat(draft.formatId);
  const withCaption = hasCaption(format);
  const blockingPlaceholders = getBlockingPlaceholders(
    values,
    artFields,
    withCaption,
  );

  const saveCopy = useEffectEvent((nextValues: PostCopy) => {
    const parsedCopy = postCopySchema.safeParse(nextValues);

    if (parsedCopy.success) {
      updateDraft({ copy: parsedCopy.data });
    }
  });

  useEffect(() => saveCopy(values), [values]);

  const changeArtField = (field: PostCopyField) => (isInArt: boolean) => {
    const nextArtFields = isInArt
      ? [...artFields, field]
      : artFields.filter((artField) => artField !== field);

    setArtFields(nextArtFields);
    updateDraft({ artFields: nextArtFields });
  };

  const regenerateField = async (field: PostCopyField) => {
    const currentCopy = postCopySchema.safeParse(form.getValues());

    setRegeneratingField(field);

    const result = await generatePostCopyMutation
      .mutateAsync({
        prompt: draft.prompt,
        formatId: draft.formatId,
        field,
        currentCopy: currentCopy.success ? currentCopy.data : draft.copy,
      })
      .catch(() => null);

    setRegeneratingField(null);

    if (!result?.isSuccess) {
      showToast(result?.errorMessage ?? regenerateFailedMessage);
      return;
    }

    if (field === "topics") {
      topics.replace(result.data.copy.topics);
      return;
    }

    form.setValue(field, result.data.copy[field], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleApprove = (copy: PostCopy) => {
    if (withCaption && !copy.caption) {
      form.setError("caption", { message: "Escreva a legenda do post." });
      return;
    }

    if (blockingPlaceholders.length > 0) {
      return;
    }

    updateDraft({
      copy: withCaption ? copy : { ...copy, caption: undefined },
      artFields,
      isApproved: true,
    });
    router.push(routes.studio);
  };

  const fieldCardProps = (field: PostCopyField) => ({
    title: fieldLabels[field],
    isRegenerating: regeneratingField === field,
    isRegenerateDisabled: regeneratingField !== null,
    onRegenerate: () => regenerateField(field),
    ...(field === "caption"
      ? { note: "Só na legenda do post" }
      : {
          isInArt: artFields.includes(field),
          onIsInArtChange: changeArtField(field),
        }),
  });

  return (
    <div className="flex flex-wrap items-start gap-5">
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(handleApprove)}
          aria-label="Textos do post"
          className="glass m-0 flex min-w-0 flex-[1_1_480px] flex-col gap-4 rounded-3xl p-4 sm:p-5"
        >
          {hasLostAttachments ? (
            <Alert variant="warning">
              <AlertDescription>
                A página recarregou e os anexos se perderam.{" "}
                <Link
                  href={routes.authenticatedHome}
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  Anexe a foto de novo na Início
                </Link>{" "}
                para usar no post.
              </AlertDescription>
            </Alert>
          ) : null}
          <CopyFieldCard {...fieldCardProps("title")}>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title.regular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parte fina</FormLabel>
                    <FormControl>
                      <Input maxLength={30} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title.highlight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parte em destaque</FormLabel>
                    <FormControl>
                      <Input maxLength={30} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <PlaceholderHint
              texts={[values.title.regular, values.title.highlight]}
            />
          </CopyFieldCard>
          <CopyFieldCard {...fieldCardProps("subtitle")}>
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Subtítulo</FormLabel>
                  <FormControl>
                    <Textarea rows={2} maxLength={90} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PlaceholderHint texts={[values.subtitle]} />
          </CopyFieldCard>
          <CopyFieldCard {...fieldCardProps("topics")}>
            {topics.fields.map((topic, index) => (
              <div
                key={topic.id}
                className="flex flex-col gap-2 border-b border-border pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`topics.${index}.title`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Tópico {index + 1}</FormLabel>
                        <FormControl>
                          <Input maxLength={30} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remover tópico ${index + 1}`}
                    onClick={() => topics.remove(index)}
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                  </Button>
                </div>
                <FormField
                  control={form.control}
                  name={`topics.${index}.sentence`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">
                        Frase do tópico {index + 1}
                      </FormLabel>
                      <FormControl>
                        <Textarea rows={2} maxLength={110} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            {topics.fields.length < MAX_POST_COPY_TOPICS ? (
              <Button
                type="button"
                variant="ghost"
                className="self-start"
                onClick={() => topics.append({ title: "", sentence: "" })}
              >
                <Plus aria-hidden="true" className="size-4" />
                Adicionar tópico
              </Button>
            ) : null}
            <PlaceholderHint
              texts={values.topics.flatMap((topic) => [
                topic.title,
                topic.sentence,
              ])}
            />
          </CopyFieldCard>
          <CopyFieldCard {...fieldCardProps("cta")}>
            <FormField
              control={form.control}
              name="cta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Chamada para ação</FormLabel>
                  <FormControl>
                    <Input maxLength={30} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PlaceholderHint texts={[values.cta]} />
          </CopyFieldCard>
          {withCaption ? (
            <CopyFieldCard {...fieldCardProps("caption")}>
              <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Legenda</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        maxLength={2200}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <PlaceholderHint texts={[values.caption ?? ""]} />
            </CopyFieldCard>
          ) : null}
          {blockingPlaceholders.length > 0 ? (
            <p
              role="status"
              className="m-0 text-sm leading-normal text-warning"
            >
              Para aprovar, troque{" "}
              {blockingPlaceholders
                .map(
                  ({ field, placeholder }) =>
                    `${placeholder} em ${fieldLabels[field]}`,
                )
                .join(", ")}{" "}
              pelo valor real.
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
                Aprovar e gerar arte
              </span>
              <RoundSendButton
                label="Aprovar e gerar arte"
                disabled={
                  blockingPlaceholders.length > 0 || regeneratingField !== null
                }
              />
            </div>
          </div>
        </form>
      </Form>
      <aside
        aria-label="Prévia e resumo"
        className="glass flex min-w-0 flex-[1_1_300px] flex-col gap-5 rounded-3xl p-4 sm:p-5"
      >
        <CopyArtPreview copy={values} artFields={artFields} format={format} />
        <CopyOptionsSummary
          prompt={draft.prompt}
          format={format}
          variationCount={draft.variationCount}
        />
      </aside>
    </div>
  );
}
