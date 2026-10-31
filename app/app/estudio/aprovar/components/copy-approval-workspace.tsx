"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useGenerateCarouselCopy } from "@/hooks/mutations/use-generate-carousel-copy";
import { useGeneratePostCopy } from "@/hooks/mutations/use-generate-post-copy";
import { findArtFormat } from "@/lib/art-options";
import { DEFAULT_CAROUSEL_SLIDES } from "@/lib/carousel/carousel-copy";
import { routes } from "@/lib/routes";
import { usePostDraft } from "@/providers/post-draft-provider";

import { CarouselCopyForm } from "./carousel-copy-form";
import { CopyApprovalForm } from "./copy-approval-form";

const generateFailedMessage =
  "Não conseguimos escrever os textos agora. Tente de novo.";

function CopyLoadingState() {
  return (
    <div
      aria-busy="true"
      className="glass flex flex-col gap-4 rounded-3xl p-4 sm:p-5"
    >
      <p role="status" className="m-0 text-sm leading-normal text-muted">
        Escrevendo os textos com a voz da sua marca…
      </p>
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex flex-col gap-2.5 rounded-(--r-lg) border border-border p-4"
        >
          <span className="h-3.5 w-28 animate-pulse rounded-full bg-text/10 motion-reduce:animate-none" />
          <span className="h-11 w-full animate-pulse rounded-(--r-md) bg-text/10 motion-reduce:animate-none" />
        </div>
      ))}
    </div>
  );
}

export function CopyApprovalWorkspace() {
  const router = useRouter();
  const { draft, isHydrated, hasLostAttachments, updateDraft } = usePostDraft();
  const generatePostCopyMutation = useGeneratePostCopy();
  const generateCarouselCopyMutation = useGenerateCarouselCopy();
  const hasRequestedCopyRef = useRef(false);
  const isMountedRef = useRef(true);
  const [errorMessage, setErrorMessage] = useState("");
  const hasDraft = Boolean(draft);
  const isCarousel = draft
    ? findArtFormat(draft.formatId).kind === "carousel"
    : false;
  const hasCopy = Boolean(isCarousel ? draft?.carouselCopy : draft?.copy);

  const requestCopy = async () => {
    if (!draft) {
      return;
    }

    const result = await (
      isCarousel
        ? generateCarouselCopyMutation
            .mutateAsync({
              prompt: draft.prompt,
              slideCount: draft.slideCount ?? DEFAULT_CAROUSEL_SLIDES,
            })
            .then((carouselResult) =>
              carouselResult.isSuccess
                ? {
                    isSuccess: true as const,
                    changes: { carouselCopy: carouselResult.data.copy },
                  }
                : carouselResult,
            )
        : generatePostCopyMutation
            .mutateAsync({ prompt: draft.prompt, formatId: draft.formatId })
            .then((postResult) =>
              postResult.isSuccess
                ? {
                    isSuccess: true as const,
                    changes: { copy: postResult.data.copy },
                  }
                : postResult,
            )
    ).catch(() => null);

    if (!isMountedRef.current) {
      return;
    }

    if (!result?.isSuccess) {
      setErrorMessage(result?.errorMessage ?? generateFailedMessage);
      return;
    }

    updateDraft(result.changes);
  };
  const requestFirstCopy = useEffectEvent(() => requestCopy());

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!hasDraft) {
      router.replace(routes.authenticatedHome);
      return;
    }

    if (!hasCopy && !hasRequestedCopyRef.current) {
      hasRequestedCopyRef.current = true;
      requestFirstCopy();
    }
  }, [isHydrated, hasDraft, hasCopy, router]);

  const retry = () => {
    setErrorMessage("");
    requestCopy();
  };

  const renderContent = () => {
    if (errorMessage) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Os textos não ficaram prontos</AlertTitle>
          <AlertDescription className="flex flex-col items-start gap-3">
            {errorMessage}
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={retry}>
                Tentar de novo
              </Button>
              <Button variant="ghost" asChild>
                <Link href={routes.authenticatedHome}>
                  <ArrowLeft aria-hidden="true" className="size-4.5" />
                  Voltar para a Início
                </Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    if (isCarousel && draft?.carouselCopy) {
      return (
        <CarouselCopyForm
          draft={{ ...draft, carouselCopy: draft.carouselCopy }}
        />
      );
    }

    if (!draft?.copy) {
      return <CopyLoadingState />;
    }

    return (
      <CopyApprovalForm
        draft={{ ...draft, copy: draft.copy }}
        hasLostAttachments={hasLostAttachments}
      />
    );
  };

  return (
    <>
      <header className="flex flex-col gap-0.5">
        <span className="text-xs leading-[1.4] font-semibold text-muted">
          Antes da arte
        </span>
        <h1 className="m-0 font-display text-[26px] leading-[1.2] font-bold sm:text-[32px]">
          Aprove os textos
        </h1>
        <p className="m-0 max-w-[75ch] text-sm leading-normal text-muted">
          Edite o que quiser. A arte usa os textos exatamente como estiverem
          aqui, e nada é publicado sem a sua aprovação.
        </p>
      </header>
      {renderContent()}
    </>
  );
}
