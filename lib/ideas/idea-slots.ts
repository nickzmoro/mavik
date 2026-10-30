import type { ContentType, FunnelStage } from "@/lib/content/content-labels";
import type {
  BusinessGoal,
  ContentFormat,
  ContentGoal,
} from "@/lib/onboarding/constants";

export type SlotCalendarDate = {
  id: string;
  name: string;
  date: string;
  daysUntil: number;
};

export type IdeaSlot = {
  slot: number;
  format: ContentFormat;
  contentType: ContentType;
  goal: ContentGoal;
  funnelStage: FunnelStage;
  calendarDate: SlotCalendarDate | null;
};

export const funnelStageByGoal: Record<ContentGoal, FunnelStage> = {
  atrair: "descoberta",
  engajar: "consideracao",
  vender: "decisao",
  fidelizar: "fidelizacao",
};

export const recommendedGoalByBusinessGoal: Record<BusinessGoal, ContentGoal> =
  {
    vender_mais: "vender",
    ganhar_seguidores: "atrair",
    divulgar_lancamento: "engajar",
    gerar_contatos: "vender",
  };

const initialFormats: ContentFormat[] = [
  "reels",
  "carrossel",
  "story",
  "reels",
  "post",
  "carrossel",
  "reels",
  "story",
  "post",
];

const initialGoals: ContentGoal[] = [
  "atrair",
  "engajar",
  "vender",
  "fidelizar",
  "atrair",
  "vender",
  "engajar",
  "fidelizar",
  "vender",
];

const initialContentTypes: ContentType[] = [
  "educativo",
  "comercial",
  "autoridade",
  "institucional",
];

const INITIAL_DATED_SLOT = 2;

const toSlot = (
  slot: number,
  format: ContentFormat,
  contentType: ContentType,
  goal: ContentGoal,
  calendarDate: SlotCalendarDate | null,
): IdeaSlot => ({
  slot,
  format,
  contentType,
  goal,
  funnelStage: funnelStageByGoal[goal],
  calendarDate,
});

export const buildInitialSlots = (nextDate: SlotCalendarDate | null) =>
  initialFormats.map((format, index) =>
    toSlot(
      index,
      format,
      initialContentTypes[index % initialContentTypes.length],
      initialGoals[index],
      index === INITIAL_DATED_SLOT ? nextDate : null,
    ),
  );

type BuildRequestSlotsInput = {
  quantity: number;
  goal: ContentGoal;
  formats: ContentFormat[];
  contentTypes: ContentType[];
  calendarDate: SlotCalendarDate | null;
};

export const buildRequestSlots = ({
  quantity,
  goal,
  formats,
  contentTypes,
  calendarDate,
}: BuildRequestSlotsInput) =>
  Array.from({ length: quantity }, (_, index) =>
    toSlot(
      index,
      formats[index % formats.length],
      contentTypes[index % contentTypes.length],
      goal,
      calendarDate,
    ),
  );
