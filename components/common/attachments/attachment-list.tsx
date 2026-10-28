import { X } from "lucide-react";

import { IconButton } from "@/components/common/icon-button";
import type { Attachment } from "@/hooks/use-attachments";
import { cn } from "@/lib/utils";

import { attachmentKindIcons } from "./attachment-kind-icon";

type AttachmentListProps = {
  attachments: Attachment[];
  errorMessage?: string;
  onRemove: (attachmentId: string) => void;
  className?: string;
};

export function AttachmentList({
  attachments,
  errorMessage,
  onRemove,
  className,
}: AttachmentListProps) {
  if (attachments.length === 0 && !errorMessage) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {attachments.length > 0 ? (
        <ul
          aria-label="Anexos"
          className="m-0 flex list-none flex-wrap gap-2 p-0"
        >
          {attachments.map((attachment) => {
            const KindIcon = attachmentKindIcons[attachment.kind];

            return (
              <li
                key={attachment.id}
                className="chip-surface flex max-w-65 min-w-0 items-center gap-2 rounded-[14px] p-1"
              >
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-surface-2 text-primary"
                >
                  <KindIcon className="size-4" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[13px] leading-[1.3] font-semibold text-text">
                    {attachment.name}
                  </span>
                  <span className="text-xs leading-[1.3] text-muted">
                    {attachment.kindLabel}
                  </span>
                </span>
                <IconButton
                  size="sm"
                  label={`Remover anexo ${attachment.name}`}
                  onClick={() => onRemove(attachment.id)}
                >
                  <X />
                </IconButton>
              </li>
            );
          })}
        </ul>
      ) : null}
      {errorMessage ? (
        <p role="alert" className="m-0 text-sm leading-normal text-danger">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
