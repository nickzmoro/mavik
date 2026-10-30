import type { ContentFormat, ContentGoal } from "@/lib/onboarding/constants";

export const contentTypes = [
  "educativo",
  "comercial",
  "institucional",
  "autoridade",
] as const;

export type ContentType = (typeof contentTypes)[number];

export const funnelStages = [
  "descoberta",
  "consideracao",
  "decisao",
  "fidelizacao",
] as const;

export type FunnelStage = (typeof funnelStages)[number];

export const formatLabels: Record<ContentFormat, string> = {
  post: "Post",
  story: "Story",
  reels: "Reels",
  carrossel: "Carrossel",
};

export const goalLabels: Record<ContentGoal, string> = {
  atrair: "Atrair",
  engajar: "Engajar",
  vender: "Vender",
  fidelizar: "Fidelizar",
};

export const contentTypeLabels: Record<ContentType, string> = {
  educativo: "Educativo",
  comercial: "Comercial",
  institucional: "Institucional",
  autoridade: "Autoridade",
};

export const funnelStageLabels: Record<FunnelStage, string> = {
  descoberta: "Descoberta",
  consideracao: "Consideração",
  decisao: "Decisão",
  fidelizacao: "Fidelização",
};
