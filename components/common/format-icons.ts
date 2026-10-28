import {
  ImageIcon,
  Layers,
  Smartphone,
  Video,
  type LucideIcon,
} from "lucide-react";

import type { IdeaFormat } from "@/lib/mocks/ideas";

export const contentFormatIcons: Record<IdeaFormat, LucideIcon> = {
  Post: ImageIcon,
  Story: Smartphone,
  Reels: Video,
  Carrossel: Layers,
};
