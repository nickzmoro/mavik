"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ImagePlus,
  LoaderCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { AiEditorDialog } from "@/components/common/ai-editor/ai-editor-dialog";
import { IconButton } from "@/components/common/icon-button";
import { TrialLimitDialog } from "@/components/common/trial-limit-dialog";
import { Button } from "@/components/ui/button";
import { useGenerateCarouselSlide } from "@/hooks/mutations/use-generate-carousel-slide";
import { useReorderCarouselSlides } from "@/hooks/mutations/use-reorder-carousel-slides";
import { useArtQuota } from "@/hooks/use-art-quota";
import { findArtFormat } from "@/lib/art-options";
import { downloadCarouselZip } from "@/lib/carousel/download-carousel";
import type { CarouselSlideCopy } from "@/lib/carousel/carousel-copy";
import type { ArtworkDetail } from "@/lib/content/get-artwork-detail";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";

type CarouselEditorProps = {
  artworkId: string;
  carousel: NonNullable<ArtworkDetail["carousel"]>;
};

type SlideSlot = {
  position: number;
  imageUrl?: string;
  copy: CarouselSlideCopy;
};

const moveItem = <TItem,>(items: TItem[], from: number, to: number) => {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(from, 1);

  nextItems.splice(to, 0, movedItem);

  return nextItems;
};

function SlideThumbnail({
  slot,
  index,
  slideCount,
  isCurrent,
  canDrag,
  onSelect,
}: {
  slot: SlideSlot;
  index: number;
  slideCount: number;
  isCurrent: boolean;
  canDrag: boolean;
  onSelect: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({ id: slot.position, disabled: !canDrag });
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: slot.position,
  });

  return (
    <li ref={setDroppableRef} className="shrink-0">
      <button
        ref={setDraggableRef}
        type="button"
        aria-current={isCurrent ? "true" : undefined}
        aria-label={`Slide ${index + 1} de ${slideCount}`}
        onClick={onSelect}
        {...attributes}
        {...listeners}
        style={
          transform
            ? {
                transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              }
            : undefined
        }
        className={cn(
          "relative flex aspect-4/5 w-16 cursor-pointer flex-col overflow-hidden rounded-(--r-sm) border-2 bg-surface-2 p-0 transition-[border-color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none",
          isCurrent ? "border-primary" : "border-transparent",
          isOver && "border-accent",
          isDragging && "z-10 opacity-80 shadow-(--shadow-md)",
        )}
      >
        {slot.imageUrl ? (
          <Image
            src={slot.imageUrl}
            alt=""
            fill
            unoptimized
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <ImagePlus aria-hidden="true" className="m-auto size-4 text-muted" />
        )}
        <span className="absolute bottom-0.5 left-0.5 rounded-sm bg-black/55 px-1 text-[10px] font-semibold text-white tabular-nums">
          {index + 1}
        </span>
      </button>
    </li>
  );
}

export function CarouselEditor({ artworkId, carousel }: CarouselEditorProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const generateCarouselSlideMutation = useGenerateCarouselSlide();
  const reorderCarouselSlidesMutation = useReorderCarouselSlides();
  const quota = useArtQuota();
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [busyPosition, setBusyPosition] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLimitOpen, setIsLimitOpen] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [editorImageUrl, setEditorImageUrl] = useState<string>();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );
  const format = findArtFormat("carousel");
  const slideCount = carousel.copy.slides.length;
  const slots: SlideSlot[] = carousel.copy.slides.map((plannedCopy, index) => {
    const savedSlide = carousel.slides.find(
      ({ position }) => position === index + 1,
    );

    return {
      position: index + 1,
      imageUrl: savedSlide?.imageUrl,
      copy: savedSlide?.copy ?? plannedCopy,
    };
  });
  const readySlots = slots.filter((slot) => slot.imageUrl);
  const isComplete = readySlots.length === slideCount;
  const currentSlot = slots[currentIndex] ?? slots[0];

  const scrollToSlide = (index: number) => {
    const nextIndex = Math.min(Math.max(index, 0), slideCount - 1);
    const track = trackRef.current;

    setCurrentIndex(nextIndex);
    track?.scrollTo({
      left: nextIndex * track.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  const handleTrackScroll = () => {
    const track = trackRef.current;

    if (track && track.clientWidth > 0) {
      setCurrentIndex(Math.round(track.scrollLeft / track.clientWidth));
    }
  };

  const requestSlide = async (position: number, editInstruction?: string) => {
    if (quota.getQuotaError() === "limit") {
      setIsLimitOpen(true);
      return null;
    }

    setBusyPosition(position);

    try {
      const generatedSlide = await generateCarouselSlideMutation.mutateAsync({
        artworkId,
        position,
        slideCount,
        slide: slots[position - 1].copy,
        editInstruction,
      });

      quota.registerUsedArts(1);
      router.refresh();

      return generatedSlide;
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Não conseguimos gerar o slide. Tente de novo.",
      );

      return null;
    } finally {
      setBusyPosition(null);
    }
  };

  const reorder = async (from: number, to: number) => {
    if (!isComplete || from === to || to < 0 || to >= slideCount) {
      return;
    }

    const newOrder = moveItem(
      slots.map(({ position }) => position),
      from,
      to,
    );
    const result = await reorderCarouselSlidesMutation
      .mutateAsync({ artworkId, newOrder })
      .catch(() => null);

    if (!result?.isSuccess) {
      showToast(
        result?.errorMessage ??
          "Não conseguimos mudar a ordem dos slides. Tente de novo.",
      );
      return;
    }

    setCurrentIndex(to);
    router.refresh();
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      return;
    }

    reorder(
      slots.findIndex(({ position }) => position === active.id),
      slots.findIndex(({ position }) => position === over.id),
    );
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);

    try {
      await downloadCarouselZip(
        readySlots.map(({ position, imageUrl = "" }) => ({
          position,
          imageUrl,
        })),
        "carrossel.zip",
      );
      showToast(`${readySlots.length} slides baixados em .zip`);
    } catch {
      showToast("Não foi possível baixar os slides. Tente de novo.");
    } finally {
      setIsZipping(false);
    }
  };

  const openEditor = () => {
    setEditorImageUrl(currentSlot.imageUrl);
    setIsEditorOpen(true);
  };

  const handleAdjust = async (editInstruction: string) => {
    const adjustedSlide = await requestSlide(
      currentSlot.position,
      editInstruction,
    );

    if (adjustedSlide) {
      setEditorImageUrl(adjustedSlide.imageUrl);
    }

    return Boolean(adjustedSlide);
  };

  const isBusy = busyPosition !== null;

  return (
    <section aria-label="Slides do carrossel" className="flex flex-col gap-4">
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={handleTrackScroll}
          className="scrollbar-subtle flex snap-x snap-mandatory overflow-x-auto rounded-[18px] motion-safe:scroll-smooth"
        >
          {slots.map((slot, index) => (
            <div
              key={slot.position}
              aria-hidden={index !== currentIndex}
              className="relative w-full shrink-0 snap-center"
              style={{ aspectRatio: format.aspectRatio }}
            >
              {slot.imageUrl ? (
                <Image
                  src={slot.imageUrl}
                  alt={`Slide ${index + 1}: ${slot.copy.headline}`}
                  fill
                  unoptimized
                  sizes="(min-width: 768px) 480px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 bg-surface-2 p-6 text-center">
                  <p className="m-0 text-sm leading-normal text-muted">
                    Este slide não ficou pronto.
                  </p>
                  <Button
                    size="sm"
                    disabled={isBusy}
                    loading={busyPosition === slot.position}
                    onClick={() => requestSlide(slot.position)}
                  >
                    Gerar slide {index + 1}
                  </Button>
                </div>
              )}
              {busyPosition === slot.position && slot.imageUrl ? (
                <div
                  role="status"
                  className="absolute inset-0 flex items-center justify-center gap-2 bg-black/45 text-sm font-semibold text-white"
                >
                  <LoaderCircle
                    aria-hidden="true"
                    className="size-6 animate-spin motion-reduce:animate-none"
                  />
                  Gerando o slide…
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <span
          aria-live="polite"
          className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 font-display text-sm font-semibold text-white tabular-nums"
        >
          {currentIndex + 1}/{slideCount}
        </span>
        <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
          <IconButton
            label="Slide anterior"
            disabled={currentIndex === 0}
            onClick={() => scrollToSlide(currentIndex - 1)}
            className="size-10 bg-bg/85 text-text"
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            label="Próximo slide"
            disabled={currentIndex === slideCount - 1}
            onClick={() => scrollToSlide(currentIndex + 1)}
            className="size-10 bg-bg/85 text-text"
          >
            <ChevronRight />
          </IconButton>
        </div>
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <ol className="scrollbar-subtle m-0 flex list-none gap-2 overflow-x-auto p-0.5 pb-1">
          {slots.map((slot, index) => (
            <SlideThumbnail
              key={slot.position}
              slot={slot}
              index={index}
              slideCount={slideCount}
              isCurrent={index === currentIndex}
              canDrag={isComplete && !isBusy}
              onSelect={() => scrollToSlide(index)}
            />
          ))}
        </ol>
      </DndContext>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!isComplete || isBusy || currentIndex === 0}
          onClick={() => reorder(currentIndex, currentIndex - 1)}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          Mover para a esquerda
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!isComplete || isBusy || currentIndex === slideCount - 1}
          onClick={() => reorder(currentIndex, currentIndex + 1)}
        >
          Mover para a direita
          <ChevronRight aria-hidden="true" className="size-4" />
        </Button>
        {isComplete ? null : (
          <span className="text-xs leading-normal text-muted">
            Gere todos os slides para mudar a ordem.
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button disabled={!currentSlot.imageUrl || isBusy} onClick={openEditor}>
          <Sparkles aria-hidden="true" className="size-4.5" />
          Ajustar o slide {currentIndex + 1} com IA
        </Button>
        {currentSlot.position > 1 && currentSlot.imageUrl ? (
          <Button
            variant="outline"
            disabled={isBusy}
            onClick={() => requestSlide(currentSlot.position)}
          >
            <RefreshCw aria-hidden="true" className="size-4.5" />
            Gerar outro slide {currentIndex + 1}
          </Button>
        ) : null}
        <Button
          variant="ghost"
          disabled={readySlots.length === 0 || isZipping}
          loading={isZipping}
          onClick={handleDownloadZip}
        >
          {isZipping ? null : (
            <Download aria-hidden="true" className="size-4.5" />
          )}
          Baixar .zip
        </Button>
      </div>
      <AiEditorDialog
        key={`${currentSlot.position}-${isEditorOpen}`}
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        variationIndex={currentIndex}
        imageUrl={editorImageUrl}
        isAdjusting={busyPosition === currentSlot.position}
        format={format}
        onAdjust={handleAdjust}
        onDiscard={() => setIsEditorOpen(false)}
        onApprove={() => setIsEditorOpen(false)}
      />
      <TrialLimitDialog
        open={isLimitOpen}
        onOpenChange={setIsLimitOpen}
        artLimit={quota.artLimit}
      />
    </section>
  );
}
