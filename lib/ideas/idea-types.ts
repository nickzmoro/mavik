import type { ContentType, FunnelStage } from "@/lib/content/content-labels";
import type { ContentFormat, ContentGoal } from "@/lib/onboarding/constants";

export type IdeaView = {
  id: string;
  title: string;
  format: ContentFormat;
  contentType: ContentType;
  goal: ContentGoal;
  funnelStage: FunnelStage;
  audience: string | null;
  calendarDateId: string | null;
  isRecommended: boolean;
  why: string;
  howToUse: string;
  bestTime: string | null;
  steps: string[];
  captionExample: string | null;
};

export type IdeaDateView = {
  id: string;
  name: string;
  date: string;
  daysUntil: number;
  isTrend: boolean;
  ideasCount: number;
};

export type IdeasData = {
  storeName: string;
  storeSegment: string;
  businessGoal: string | null;
  ideas: IdeaView[];
  dates: IdeaDateView[];
  savedIdeaIds: string[];
  isGenerating: boolean;
};

export const emptyIdeasData: IdeasData = {
  storeName: "",
  storeSegment: "",
  businessGoal: null,
  ideas: [],
  dates: [],
  savedIdeaIds: [],
  isGenerating: false,
};
