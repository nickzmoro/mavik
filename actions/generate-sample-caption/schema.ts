import { z } from "zod";

import { saveOnboardingVoiceFormSchema } from "@/actions/save-onboarding-voice/schema";

export const generateSampleCaptionSchema = z.object({
  tone: saveOnboardingVoiceFormSchema.shape.tone,
  segment: z.string().trim().max(80),
  product: z.string().trim().max(40),
  lovedTerms: saveOnboardingVoiceFormSchema.shape.lovedTerms,
  forbiddenTerms: saveOnboardingVoiceFormSchema.shape.forbiddenTerms,
});

export type GenerateSampleCaptionInput = z.infer<
  typeof generateSampleCaptionSchema
>;

export type GeneratedSampleCaption = {
  caption: string;
  isGenerated: boolean;
};
