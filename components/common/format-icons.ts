import {
  ImageIcon,
  Layers,
  Smartphone,
  Video,
  type LucideIcon,
} from "lucide-react";

import type { ContentFormat } from "@/lib/onboarding/constants";

export const contentFormatIcons: Record<ContentFormat, LucideIcon> = {
  post: ImageIcon,
  story: Smartphone,
  reels: Video,
  carrossel: Layers,
};
