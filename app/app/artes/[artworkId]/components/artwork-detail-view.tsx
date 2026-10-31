"use client";

import { ArrowLeft, Calendar, Download, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ScheduleArtDialog } from "@/components/common/schedule-art-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePublishArtworkNow } from "@/hooks/mutations/use-publish-artwork-now";
import { useScheduleArtwork } from "@/hooks/mutations/use-schedule-artwork";
import { findArtFormat } from "@/lib/art-options";
import { getArtFormatIdFromSize } from "@/lib/content/artwork-format";
import { artworkDisplayStatusLabels } from "@/lib/content/artwork-status";
import type { ArtworkDetail } from "@/lib/content/get-artwork-detail";
import { downloadImage } from "@/lib/download-file";
import type { ArtFormatId } from "@/lib/mocks/studio";
import { getStudioUrlForArtwork, routes } from "@/lib/routes";
import { toScheduledAt } from "@/lib/schedule-days";
import type { ScheduleArtFormValues } from "@/lib/validations/studio";
import { useToast } from "@/providers/toast-provider";

import { artworkDateFormatter } from "./artwork-date-formatter";
import { ArtworkVersions } from "./artwork-versions";

const saveFailedMessage =
  "Não conseguimos salvar agora. Confira sua internet e tente de novo.";

type ArtworkDetailViewProps = {
  artwork: ArtworkDetail;
};

export function ArtworkDetailView({ artwork }: ArtworkDetailViewProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const scheduleArtworkMutation = useScheduleArtwork();
  const publishArtworkNowMutation = usePublishArtworkNow();
  const [selectedVersion, setSelectedVersion] = useState(
    artwork.versions[0].version,
  );
  const [formatId, setFormatId] = useState<ArtFormatId>(
    artwork.format === "story" ? "story" : "portrait",
  );
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const currentVersion =
    artwork.versions.find(({ version }) => version === selectedVersion) ??
    artwork.versions[0];
  const format = findArtFormat(formatId);
  const isStory = artwork.format === "story";

  const dates = [
    { label: "Criada em", value: artwork.createdAt },
    { label: "Aprovada em", value: artwork.approvedAt },
    { label: "Agendada para", value: artwork.scheduledAt },
  ].flatMap(({ label, value }) => (value ? [{ label, value }] : []));

  const handleDownload = async () => {
    try {
      await downloadImage(
        currentVersion.imageUrl,
        `arte-versao-${currentVersion.version}.png`,
      );
      showToast("Arte baixada em PNG");
    } catch {
      showToast("Não foi possível baixar a arte");
    }
  };

  const saveApprovedArt = async (
    caption: string,
    scheduledAt: string | null,
  ) => {
    const approvedArt = {
      title: artwork.title,
      prompt: artwork.prompt,
      caption: isStory ? "" : caption,
      format: isStory ? ("story" as const) : ("post" as const),
      artworkId: artwork.id,
      contentId: artwork.contentId,
    };
    const result = await (
      scheduledAt
        ? scheduleArtworkMutation.mutateAsync({ ...approvedArt, scheduledAt })
        : publishArtworkNowMutation.mutateAsync(approvedArt)
    ).catch(() => null);

    if (!result?.isSuccess) {
      showToast(result?.errorMessage ?? saveFailedMessage);
      return;
    }

    setIsScheduleOpen(false);
    showToast(
      scheduledAt
        ? "Post agendado. Ele aparece em Próximos posts, na Início."
        : isStory
          ? "Story publicado no Instagram."
          : "Post publicado no Instagram.",
    );
    router.refresh();
  };

  const handleScheduled = ({ day, time, caption }: ScheduleArtFormValues) =>
    saveApprovedArt(caption, toScheduledAt(day, time));

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <Link
            href={routes.artworks}
            className="inline-flex min-h-9 items-center gap-1.5 self-start rounded-(--r-sm) text-sm font-semibold text-primary no-underline transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Artes
          </Link>
          <h1 className="m-0 font-display text-[26px] leading-[1.2] font-bold break-words sm:text-[32px]">
            {artwork.title}
          </h1>
        </div>
      </header>
      <div className="flex flex-wrap items-start gap-5">
        <figure className="glass m-0 flex min-w-0 flex-[1_1_360px] flex-col gap-3 rounded-3xl p-4 sm:p-5">
          <div
            className="relative mx-auto w-full max-w-120 overflow-hidden rounded-[18px]"
            style={{ aspectRatio: format.aspectRatio }}
          >
            <Image
              key={currentVersion.imageUrl}
              src={currentVersion.imageUrl}
              alt={`${artwork.title}, versão ${currentVersion.version}`}
              fill
              unoptimized
              priority
              sizes="(min-width: 768px) 480px, 100vw"
              className="object-cover"
              onLoad={({ currentTarget }) =>
                setFormatId(
                  getArtFormatIdFromSize(
                    currentTarget.naturalWidth,
                    currentTarget.naturalHeight,
                  ),
                )
              }
            />
          </div>
          <figcaption className="text-center text-xs leading-[1.4] text-muted">
            Versão {currentVersion.version}
            {currentVersion.version === artwork.versions[0].version
              ? " · atual"
              : ""}
          </figcaption>
        </figure>
        <div className="glass flex min-w-0 flex-[1_1_320px] flex-col gap-5 rounded-3xl p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {artworkDisplayStatusLabels[artwork.status]}
            </Badge>
            <Badge variant="outline">
              {format.label} · {format.ratioLabel}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setIsScheduleOpen(true)}>
              <Calendar aria-hidden="true" className="size-4.5" />
              Agendar
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download aria-hidden="true" className="size-4.5" />
              Baixar
            </Button>
            <Button variant="ghost" asChild>
              <Link href={getStudioUrlForArtwork(artwork.id)}>
                <Layers aria-hidden="true" className="size-4.5" />
                Abrir no estúdio
              </Link>
            </Button>
          </div>
          <dl className="m-0 grid gap-3 text-sm leading-normal sm:grid-cols-2">
            {dates.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <dt className="text-xs leading-[1.4] font-semibold text-muted">
                  {label}
                </dt>
                <dd className="m-0">{artworkDateFormatter.format(value)}</dd>
              </div>
            ))}
            {artwork.prompt ? (
              <div className="flex flex-col gap-0.5 sm:col-span-2">
                <dt className="text-xs leading-[1.4] font-semibold text-muted">
                  Pedido usado
                </dt>
                <dd className="m-0 break-words whitespace-pre-line">
                  {artwork.prompt}
                </dd>
              </div>
            ) : null}
            {artwork.caption ? (
              <div className="flex flex-col gap-0.5 sm:col-span-2">
                <dt className="text-xs leading-[1.4] font-semibold text-muted">
                  Legenda
                </dt>
                <dd className="m-0 break-words whitespace-pre-line">
                  {artwork.caption}
                </dd>
              </div>
            ) : null}
          </dl>
          {artwork.versions.length > 1 ? (
            <ArtworkVersions
              versions={artwork.versions}
              selectedVersion={currentVersion.version}
              onSelect={setSelectedVersion}
            />
          ) : null}
        </div>
      </div>
      <ScheduleArtDialog
        open={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        variationIndex={0}
        imageUrl={artwork.versions[0].imageUrl}
        title={artwork.title}
        format={format}
        caption={artwork.caption}
        isScheduling={scheduleArtworkMutation.isPending}
        isPublishing={publishArtworkNowMutation.isPending}
        onScheduled={handleScheduled}
        onPublishNow={(caption) => saveApprovedArt(caption, null)}
      />
    </>
  );
}
