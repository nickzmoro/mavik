import { TriangleAlert } from "lucide-react";

import { findPlaceholders } from "@/lib/post-copy/validate-post-copy";

export function HighlightedText({ text }: { text: string }) {
  return text.split(/(\{\{[^{}]+\}\})/g).map((part, index) =>
    findPlaceholders(part).length > 0 ? (
      <mark
        key={`${part}-${index}`}
        className="rounded-sm bg-warning-bg px-0.5 text-warning"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export function PlaceholderHint({ texts }: { texts: string[] }) {
  const placeholders = [...new Set(texts.flatMap(findPlaceholders))];

  if (placeholders.length === 0) {
    return null;
  }

  return (
    <p className="m-0 flex items-start gap-1.5 text-xs leading-normal text-warning">
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
      Troque {placeholders.join(", ")} pelo valor real.
    </p>
  );
}
