import { Download, ImageIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

type GeneratedImageCardProps = {
  imageUrl?: string;
  isGenerating: boolean;
};

export function GeneratedImageCard({
  imageUrl,
  isGenerating,
}: GeneratedImageCardProps) {
  return (
    <section
      aria-labelledby="generated-image-title"
      className="rounded-[24px] border border-border bg-bg p-6 shadow-(--shadow-sm)"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="generated-image-title"
          className="m-0 font-display text-lg leading-[1.3] font-semibold text-text"
        >
          Sua arte
        </h2>
        {imageUrl && !isGenerating && (
          <Button asChild variant="secondary" size="sm">
            <a href={imageUrl} download="mavik-arte.png">
              <Download size={16} aria-hidden="true" />
              Baixar arte
            </a>
          </Button>
        )}
      </div>

      <div
        aria-live="polite"
        aria-busy={isGenerating}
        className="mt-5 flex aspect-[4/5] w-full max-w-[480px] items-center justify-center overflow-hidden rounded-(--r-lg) border border-border bg-surface"
      >
        {isGenerating ? (
          <div className="flex size-full animate-pulse flex-col items-center justify-center gap-2 bg-surface-2 px-6 text-center motion-reduce:animate-none">
            <p className="m-0 font-display text-base font-semibold text-text">
              Criando sua arte...
            </p>
            <p className="m-0 text-sm leading-normal text-muted">
              Leva cerca de 30 segundos.
            </p>
          </div>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt="Arte gerada a partir da sua descrição"
            width={1024}
            height={1280}
            unoptimized
            className="block size-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 px-6 text-center">
            <ImageIcon size={24} aria-hidden="true" className="text-muted" />
            <p className="m-0 text-sm leading-normal text-muted">
              Sua arte aparece aqui depois de gerada.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
