export type GenerationMode = "initial" | "request";

type PlanReplacementInput = {
  mode: GenerationMode;
  approvedCount: number;
  requestedCount: number;
};

export const planReplacement = ({
  mode,
  approvedCount,
  requestedCount,
}: PlanReplacementInput) => ({
  shouldDelete: mode === "request" && approvedCount > 0,
  missing: Math.max(0, requestedCount - approvedCount),
});
