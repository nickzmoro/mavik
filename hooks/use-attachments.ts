"use client";

import { useState } from "react";

import type { ApprovedMaterial } from "@/lib/mocks/agent";

export type AttachmentKind = "photo" | "file" | "material" | "link";

export type Attachment = {
  id: string;
  name: string;
  kind: AttachmentKind;
  kindLabel: string;
  materialId?: string;
  file?: File;
};

export const maxAttachments = 10;
const maxFileSizeInBytes = 20 * 1024 * 1024;

export const acceptedPhotoTypes = "image/jpeg,image/png,image/webp,image/heic";
export const acceptedDocumentTypes = ".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt";

const documentKindLabels: Record<string, string> = {
  pdf: "PDF",
  doc: "Documento",
  docx: "Documento",
  txt: "Documento",
  xls: "Planilha",
  xlsx: "Planilha",
  csv: "Planilha",
};

const getFileExtension = (fileName: string) =>
  fileName.split(".").pop()?.toLowerCase() ?? "";

const isAcceptedFile = (file: File, kind: "photo" | "file") =>
  kind === "photo"
    ? acceptedPhotoTypes.split(",").includes(file.type)
    : getFileExtension(file.name) in documentKindLabels;

const createAttachmentId = () => crypto.randomUUID();

const formatLinkName = (url: string) => {
  const parsedUrl = new URL(url);

  return `${parsedUrl.hostname.replace(/^www\./, "")}${parsedUrl.pathname}`.replace(
    /\/$/,
    "",
  );
};

export function useAttachments(initialAttachments: Attachment[] = []) {
  const [attachments, setAttachments] =
    useState<Attachment[]>(initialAttachments);
  const [errorMessage, setErrorMessage] = useState("");

  const remainingSlots = maxAttachments - attachments.length;

  const addFiles = (fileList: FileList | null, kind: "photo" | "file") => {
    const files = Array.from(fileList ?? []);

    if (files.length === 0) {
      return;
    }

    const acceptedFiles = files.filter(
      (file) => isAcceptedFile(file, kind) && file.size <= maxFileSizeInBytes,
    );
    const filesToAdd = acceptedFiles.slice(0, Math.max(remainingSlots, 0));

    if (acceptedFiles.length < files.length) {
      setErrorMessage(
        kind === "photo"
          ? "Use fotos em JPG, PNG, WEBP ou HEIC com até 20 MB."
          : "Use arquivos PDF, Word, Excel, CSV ou TXT com até 20 MB.",
      );
    } else if (filesToAdd.length < acceptedFiles.length) {
      setErrorMessage(`Você pode anexar até ${maxAttachments} itens por vez.`);
    } else {
      setErrorMessage("");
    }

    setAttachments((currentAttachments) => [
      ...currentAttachments,
      ...filesToAdd.map((file) => ({
        id: createAttachmentId(),
        name: file.name,
        kind,
        file,
        kindLabel:
          kind === "photo"
            ? "Foto"
            : documentKindLabels[getFileExtension(file.name)],
      })),
    ]);
  };

  const replaceMaterials = (materials: ApprovedMaterial[]) => {
    setErrorMessage("");
    setAttachments((currentAttachments) => {
      const otherAttachments = currentAttachments.filter(
        (attachment) => attachment.kind !== "material",
      );
      const availableSlots = maxAttachments - otherAttachments.length;

      return [
        ...otherAttachments,
        ...materials.slice(0, availableSlots).map((material) => ({
          id: createAttachmentId(),
          name: material.title,
          kind: "material" as const,
          kindLabel: "Material aprovado",
          materialId: material.id,
        })),
      ];
    });
  };

  const addLink = (url: string) => {
    if (remainingSlots <= 0) {
      setErrorMessage(`Você pode anexar até ${maxAttachments} itens por vez.`);
      return;
    }

    setErrorMessage("");
    setAttachments((currentAttachments) => [
      ...currentAttachments,
      {
        id: createAttachmentId(),
        name: formatLinkName(url),
        kind: "link",
        kindLabel: "Link de post",
      },
    ]);
  };

  const removeAttachment = (attachmentId: string) => {
    setErrorMessage("");
    setAttachments((currentAttachments) =>
      currentAttachments.filter((attachment) => attachment.id !== attachmentId),
    );
  };

  const clearAttachments = () => {
    setErrorMessage("");
    setAttachments([]);
  };

  const selectedMaterialIds = attachments.flatMap((attachment) =>
    attachment.materialId ? [attachment.materialId] : [],
  );

  return {
    attachments,
    errorMessage,
    selectedMaterialIds,
    addFiles,
    replaceMaterials,
    addLink,
    removeAttachment,
    clearAttachments,
  };
}

export type AttachmentsState = ReturnType<typeof useAttachments>;
