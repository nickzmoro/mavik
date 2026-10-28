import {
  FileIcon,
  ImageIcon,
  LinkIcon,
  Palette,
  type LucideIcon,
} from "lucide-react";

import type { AttachmentKind } from "@/hooks/use-attachments";

export const attachmentKindIcons: Record<AttachmentKind, LucideIcon> = {
  photo: ImageIcon,
  file: FileIcon,
  material: Palette,
  link: LinkIcon,
};
