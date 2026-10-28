"use client";

import { useState } from "react";

import type { AttachmentsState } from "@/hooks/use-attachments";

import { ApprovedMaterialsDialog } from "./approved-materials-dialog";
import { attachmentCopies, type AttachmentTarget } from "./attachment-copy";
import { AttachmentMenu } from "./attachment-menu";
import { PostLinkDialog } from "./post-link-dialog";

type PickerDialog = "none" | "materials" | "link";

type AttachmentPickerProps = {
  attachments: AttachmentsState;
  target: AttachmentTarget;
  triggerClassName?: string;
};

export function AttachmentPicker({
  attachments,
  target,
  triggerClassName,
}: AttachmentPickerProps) {
  const [openDialog, setOpenDialog] = useState<PickerDialog>("none");
  const copy = attachmentCopies[target];

  const handleDialogOpenChange = (dialog: PickerDialog) => (isOpen: boolean) =>
    setOpenDialog(isOpen ? dialog : "none");

  return (
    <>
      <AttachmentMenu
        copy={copy}
        onAddFiles={attachments.addFiles}
        onOpenMaterials={() => setOpenDialog("materials")}
        onOpenLink={() => setOpenDialog("link")}
        triggerClassName={triggerClassName}
      />
      <ApprovedMaterialsDialog
        open={openDialog === "materials"}
        onOpenChange={handleDialogOpenChange("materials")}
        selectedMaterialIds={attachments.selectedMaterialIds}
        onConfirm={attachments.replaceMaterials}
        description={copy.materialsDialogDescription}
      />
      <PostLinkDialog
        open={openDialog === "link"}
        onOpenChange={handleDialogOpenChange("link")}
        onConfirm={attachments.addLink}
        description={copy.linkDialogDescription}
      />
    </>
  );
}
