import { z } from "zod";

import {
  agendaWeekdayLabels,
  campaignCommercialDates,
  newContentCampaignOptions,
  planLibraryUsageOptions,
  planMonthOptions,
} from "@/lib/mocks/agenda";
import { ideaFormats, ideaGoals } from "@/lib/mocks/ideas";

export const agendaAgentRequestSchema = z.object({
  request: z.string().trim().min(1).max(500),
});

export type AgendaAgentRequestValues = z.infer<typeof agendaAgentRequestSchema>;

export const newContentFormSchema = z.object({
  origin: z.enum(["library", "blank"]),
  libraryIdeaId: z.string(),
  title: z.string().trim().max(120, "Use até 120 caracteres."),
  format: z.enum(ideaFormats),
  goal: z.enum(ideaGoals),
  slotId: z.string().min(1, "Escolha quando publicar."),
  campaign: z.enum(newContentCampaignOptions),
});

export type NewContentFormValues = z.infer<typeof newContentFormSchema>;

export const newCampaignFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Dê um nome para a campanha.")
      .max(80, "Use até 80 caracteres."),
    startDate: z.iso.date("Escolha a data de início."),
    endDate: z.iso.date("Escolha a data de fim."),
    commercialDate: z.enum(campaignCommercialDates),
    goal: z.enum(ideaGoals),
    formats: z
      .array(z.enum(ideaFormats))
      .min(1, "Escolha pelo menos um formato."),
    isAutoDistributed: z.boolean(),
  })
  .refine((values) => values.endDate >= values.startDate, {
    path: ["endDate"],
    message: "O fim precisa ser depois do início.",
  });

export type NewCampaignFormValues = z.infer<typeof newCampaignFormSchema>;

export const generatePlanFormSchema = z.object({
  month: z.enum(planMonthOptions),
  frequency: z.string().min(1),
  focusDays: z
    .array(z.enum(agendaWeekdayLabels))
    .min(1, "Escolha pelo menos um dia de foco."),
  dates: z.array(z.string()),
  libraryUsage: z.enum(planLibraryUsageOptions),
});

export type GeneratePlanFormValues = z.infer<typeof generatePlanFormSchema>;
