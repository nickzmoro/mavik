"use client";

import { Ban, CircleAlert, Heart, X } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";

import type { PostExampleKind } from "@/actions/upload-brand-asset/schema";
import { Button } from "@/components/ui/button";
import { useDeleteBrandAsset } from "@/hooks/mutations/use-delete-brand-asset";
import { useUploadBrandAsset } from "@/hooks/mutations/use-upload-brand-asset";
import { connectionFailure } from "@/lib/auth-action-result";
import {
  MAX_POST_EXAMPLES,
  POST_EXAMPLE_MIME_TYPES,
} from "@/lib/onboarding/constants";
import type { PostExample } from "@/lib/onboarding/get-step-data";

const panels: {
  kind: PostExampleKind;
  title: string;
  helper: string;
  icon: typeof Heart;
  iconClassName: string;
}[] = [
  {
    kind: "post_bom",
    title: "Posts que você ama",
    helper: "As artes novas seguem o layout, as cores e o estilo destes posts.",
    icon: Heart,
    iconClassName: "text-success",
  },
  {
    kind: "post_ruim",
    title: "Posts que você não quer",
    helper: "Evitamos o estilo destes posts.",
    icon: Ban,
    iconClassName: "text-danger",
  },
];

function PostExamplePanel({
  panel,
  examples,
  onChange,
}: {
  panel: (typeof panels)[number];
  examples: PostExample[];
  onChange: (examples: PostExample[]) => void;
}) {
  const inputId = useId();
  const uploadMutation = useUploadBrandAsset();
  const deleteMutation = useDeleteBrandAsset();
  const [errorMessage, setErrorMessage] = useState<string>();
  const Icon = panel.icon;
  const hasReachedLimit = examples.length >= MAX_POST_EXAMPLES;

  const uploadFiles = async (files: File[]) => {
    setErrorMessage(undefined);
    let currentExamples = examples;

    for (const file of files.slice(0, MAX_POST_EXAMPLES - examples.length)) {
      const result = await uploadMutation
        .mutateAsync({ kind: panel.kind, file, isGenerated: false, checks: {} })
        .catch(connectionFailure);

      if (!result.isSuccess) {
        setErrorMessage(result.errorMessage);
        break;
      }

      currentExamples = [
        ...currentExamples,
        {
          id: result.data.id,
          kind: panel.kind,
          url: result.data.url,
          fileName: result.data.fileName,
        },
      ];
      onChange(currentExamples);
    }
  };

  const removeExample = async (example: PostExample) => {
    setErrorMessage(undefined);
    const result = await deleteMutation
      .mutateAsync({ assetId: example.id })
      .catch(connectionFailure);

    if (!result.isSuccess) {
      setErrorMessage(result.errorMessage);
      return;
    }

    onChange(examples.filter(({ id }) => id !== example.id));
  };

  return (
    <div className="flex flex-col gap-3 rounded-(--r-lg) border border-border bg-bg p-4 shadow-(--shadow-sm)">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <Icon
            size={18}
            aria-hidden="true"
            className={`mt-0.5 flex-none ${panel.iconClassName}`}
          />
          <div>
            <p className="m-0 text-sm font-semibold text-text">{panel.title}</p>
            <p className="m-0 text-xs text-muted">
              {panel.helper} PNG, JPG ou WebP · até {MAX_POST_EXAMPLES}
            </p>
          </div>
        </div>
        <input
          id={inputId}
          type="file"
          multiple
          accept={POST_EXAMPLE_MIME_TYPES.join(",")}
          className="sr-only"
          disabled={uploadMutation.isPending || hasReachedLimit}
          onChange={(event) => {
            uploadFiles(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
        <Button asChild size="sm" variant="outline">
          <label
            htmlFor={inputId}
            aria-disabled={uploadMutation.isPending || hasReachedLimit}
          >
            {uploadMutation.isPending ? "Enviando..." : "Enviar"}
          </label>
        </Button>
      </div>

      {examples.length > 0 && (
        <ul className="m-0 grid list-none grid-cols-3 gap-2 p-0 sm:grid-cols-5">
          {examples.map((example) => (
            <li key={example.id} className="relative">
              <Image
                src={example.url}
                alt={`Exemplo: ${example.fileName}`}
                width={160}
                height={200}
                unoptimized
                className="aspect-[4/5] w-full rounded-(--r-sm) border border-border object-cover"
              />
              <button
                type="button"
                aria-label={`Remover ${example.fileName}`}
                disabled={deleteMutation.isPending}
                onClick={() => removeExample(example)}
                className="absolute top-1 right-1 flex size-7 cursor-pointer items-center justify-center rounded-full border-0 bg-bg/90 text-text shadow-(--shadow-sm) hover:bg-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {errorMessage && (
        <p role="alert" className="m-0 flex gap-1.5 text-sm text-text">
          <CircleAlert
            size={16}
            aria-hidden="true"
            className="mt-0.5 flex-none text-danger"
          />
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export function PostExamples({
  initialExamples,
}: {
  initialExamples: PostExample[];
}) {
  const [examples, setExamples] = useState(initialExamples);

  return (
    <div className="grid gap-4">
      {panels.map((panel) => (
        <PostExamplePanel
          key={panel.kind}
          panel={panel}
          examples={examples.filter(({ kind }) => kind === panel.kind)}
          onChange={(panelExamples) =>
            setExamples((currentExamples) => [
              ...currentExamples.filter(({ kind }) => kind !== panel.kind),
              ...panelExamples,
            ])
          }
        />
      ))}
    </div>
  );
}
