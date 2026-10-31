import type { ArtFormat } from "@/lib/mocks/studio";
import type { PostCopy, PostCopyField } from "@/lib/post-copy/post-copy-schema";

import { HighlightedText } from "./placeholder-highlight";

type CopyArtPreviewProps = {
  copy: PostCopy;
  artFields: PostCopyField[];
  format: ArtFormat;
};

export function CopyArtPreview({
  copy,
  artFields,
  format,
}: CopyArtPreviewProps) {
  const isInArt = (field: PostCopyField) => artFields.includes(field);
  const hasArtText = artFields.length > 0;

  return (
    <figure className="m-0 flex flex-col gap-2">
      <div
        style={{ aspectRatio: format.aspectRatio }}
        className="relative mx-auto flex w-full max-w-72 flex-col justify-between gap-3 overflow-hidden rounded-(--r-lg) bg-primary-brand p-5 text-white shadow-[0_8px_24px_rgba(26,15,60,.10)]"
      >
        <div className="flex flex-col gap-2">
          {isInArt("title") ? (
            <p className="m-0 font-display text-xl leading-[1.15] break-words">
              <span className="font-normal">
                <HighlightedText text={copy.title.regular} />
              </span>{" "}
              <span className="font-bold text-(--violet-200)">
                <HighlightedText text={copy.title.highlight} />
              </span>
            </p>
          ) : null}
          {isInArt("subtitle") ? (
            <p className="m-0 text-xs leading-normal break-words text-white/85">
              <HighlightedText text={copy.subtitle} />
            </p>
          ) : null}
          {isInArt("topics") && copy.topics.length > 0 ? (
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {copy.topics.map((topic, index) => (
                <li
                  key={index}
                  className="text-[11px] leading-[1.4] break-words text-white/85"
                >
                  <strong className="font-semibold text-white">
                    <HighlightedText text={topic.title} />
                  </strong>{" "}
                  <HighlightedText text={topic.sentence} />
                </li>
              ))}
            </ul>
          ) : null}
          {hasArtText ? null : (
            <p className="m-0 text-xs leading-normal text-white/75">
              Nenhum texto vai na arte. Ligue “Vai na arte” em algum campo.
            </p>
          )}
        </div>
        {isInArt("cta") ? (
          <span className="self-start rounded-full bg-white px-3 py-1.5 text-xs font-semibold break-words text-primary-brand">
            <HighlightedText text={copy.cta} />
          </span>
        ) : null}
      </div>
      <figcaption className="text-center text-xs leading-[1.4] text-muted">
        Prévia simples dos textos. Cores, foto e layout vêm da sua marca.
      </figcaption>
    </figure>
  );
}
