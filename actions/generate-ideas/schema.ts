import { z } from "zod";

import { contentTypes } from "@/lib/content/content-labels";
import { contentFormats, contentGoals } from "@/lib/onboarding/constants";

export const MAX_REQUESTED_IDEAS = 12;

export const generateIdeasSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("initial") }),
  z.object({
    mode: z.literal("request"),
    theme: z.string().trim().max(80),
    calendarDateId: z.uuid().nullable(),
    goal: z.enum(contentGoals),
    formats: z.array(z.enum(contentFormats)).min(1),
    contentTypes: z.array(z.enum(contentTypes)).min(1),
    quantity: z.number().int().min(1).max(MAX_REQUESTED_IDEAS),
  }),
]);

export type GenerateIdeasInput = z.infer<typeof generateIdeasSchema>;

export type GenerateIdeasResult = { created: number; missing: number };
