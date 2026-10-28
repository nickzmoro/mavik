"use client";

import { Paperclip } from "lucide-react";
import { useRef } from "react";

import { IconButton } from "@/components/common/icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  acceptedDocumentTypes,
  acceptedPhotoTypes,
  type AttachmentKind,
} from "@/hooks/use-attachments";

import type { AttachmentCopy } from "./attachment-copy";
import { attachmentKindIcons } from "./attachment-kind-icon";

const getMenuOptions = (
  copy: AttachmentCopy,
): { kind: AttachmentKind; title: string; description: string }[] => [
  { kind: "photo", title: "Foto", description: "Do computador ou do celular" },
  { kind: "file", title: "Arquivo", description: copy.fileDescription },
  {
    kind: "material",
    title: "Materiais aprovados",
    description: copy.materialsDescription,
  },
  { kind: "link", title: "Link de um post", description: copy.linkDescription },
];

type AttachmentMenuProps = {
  copy: AttachmentCopy;
  onAddFiles: (fileList: FileList | null, kind: "photo" | "file") => void;
  onOpenMaterials: () => void;
  onOpenLink: () => void;
  triggerClassName?: string;
};

export function AttachmentMenu({
  copy,
  onAddFiles,
  onOpenMaterials,
  onOpenLink,
  triggerClassName,
}: AttachmentMenuProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleSelectOption = (kind: AttachmentKind) => {
    const selectActions: Record<AttachmentKind, () => void> = {
      photo: () => photoInputRef.current?.click(),
      file: () => documentInputRef.current?.click(),
      material: onOpenMaterials,
      link: onOpenLink,
    };

    selectActions[kind]();
  };

  const handleFileChange =
    (kind: "photo" | "file") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onAddFiles(event.target.files, kind);
      event.target.value = "";
    };

  return (
    <>
      <input
        ref={photoInputRef}
        type="file"
        accept={acceptedPhotoTypes}
        multiple
        hidden
        tabIndex={-1}
        onChange={handleFileChange("photo")}
      />
      <input
        ref={documentInputRef}
        type="file"
        accept={acceptedDocumentTypes}
        multiple
        hidden
        tabIndex={-1}
        onChange={handleFileChange("file")}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <IconButton
            label="Anexar foto ou arquivo"
            size="lg"
            className={triggerClassName}
          >
            <Paperclip />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="start"
          alignOffset={-8}
          sideOffset={16}
          aria-label="Anexar"
          className="popover-surface flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-0.5 rounded-[20px] p-2"
        >
          <DropdownMenuLabel className="px-3 pt-2 pb-1.5">
            {copy.menuLabel}
          </DropdownMenuLabel>
          {getMenuOptions(copy).map(({ kind, title, description }) => {
            const KindIcon = attachmentKindIcons[kind];

            return (
              <DropdownMenuItem
                key={kind}
                onSelect={() => handleSelectOption(kind)}
                className="min-h-13 gap-3 rounded-[14px] py-1.5 data-highlighted:bg-hover-subtle"
              >
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-(--r-md) bg-surface-2"
                >
                  <KindIcon className="size-4.5! text-primary!" />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm leading-[1.4] font-semibold">
                    {title}
                  </span>
                  <span className="text-xs leading-[1.4] text-muted">
                    {description}
                  </span>
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
