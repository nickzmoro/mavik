import type { ColorRole } from "@/lib/onboarding/constants";

export type ExtractedBrandKit = {
  colors: Partial<Record<ColorRole, string>>;
  titleFont?: string;
  bodyFont?: string;
  highlightFont?: string;
  imageStyle?: "fotografico" | "ilustrado" | "minimalista" | "3d" | "outro";
  restrictions: string[];
  filledCount: number;
};
