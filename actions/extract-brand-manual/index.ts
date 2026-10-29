"use server";

import { and, desc, eq } from "drizzle-orm";
import OpenAI from "openai";

import { db } from "@/db";
import { brandAssets } from "@/db/schema";
import {
  authErrorMessages,
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { downloadBrandAsset } from "@/lib/brand/get-brand-context";
import {
  readManualGuidelines,
  saveManualRules,
  toExtractedBrandKit,
} from "@/lib/brand/manual-guidelines";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import {
  getCurrentBrandKit,
  getCurrentUserId,
  getOwnedStore,
} from "@/lib/onboarding/store-access";
import {
  formatRetryAfter,
  getBlockedRemainingMs,
  rateLimitRules,
  registerAttempt,
} from "@/lib/rate-limit";

import type { ExtractedBrandKit } from "./schema";

const manualErrorMessages = {
  notConfigured:
    "A leitura automática do manual ainda não está configurada. Preencha os campos manualmente.",
  manualMissing: "Envie o manual da marca para a leitura automática.",
  unsupportedFormat:
    "A leitura automática funciona com PDF. Preencha os campos manualmente ou envie o manual em PDF.",
  readFailed:
    "Não conseguimos ler o manual agora. Preencha os campos manualmente ou tente de novo.",
};

export async function extractBrandManual(): Promise<
  AuthActionResult<ExtractedBrandKit>
> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("[onboarding] OPENAI_API_KEY não configurada");
    return authFailure(manualErrorMessages.notConfigured);
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return authFailure(onboardingErrorMessages.sessionExpired);
  }

  const store = await getOwnedStore(userId);
  const brandKit = store ? await getCurrentBrandKit(store.id) : null;

  if (!brandKit) {
    return authFailure(onboardingErrorMessages.previousStepMissing);
  }

  const rateLimitKey = `extract-brand-manual:user:${userId}`;
  const blockedRemainingMs = await getBlockedRemainingMs([rateLimitKey]);

  if (blockedRemainingMs > 0) {
    return authFailure(
      authErrorMessages.tooManyAttempts(formatRetryAfter(blockedRemainingMs)),
    );
  }

  await registerAttempt(rateLimitKey, rateLimitRules.extractBrandManualByUser);

  const [manual] = await db
    .select()
    .from(brandAssets)
    .where(
      and(
        eq(brandAssets.brandKitId, brandKit.id),
        eq(brandAssets.kind, "manual"),
      ),
    )
    .orderBy(desc(brandAssets.createdAt))
    .limit(1);

  if (!manual) {
    return authFailure(manualErrorMessages.manualMissing);
  }

  if (manual.mimeType !== "application/pdf") {
    return authFailure(manualErrorMessages.unsupportedFormat);
  }

  try {
    const guidelines = await readManualGuidelines({
      openai: new OpenAI({ apiKey }),
      pdfBytes: await downloadBrandAsset(manual.storagePath),
      fileName: manual.label ?? "manual.pdf",
    });

    if (!guidelines) {
      return authFailure(manualErrorMessages.readFailed);
    }

    await saveManualRules(brandKit.id, guidelines);

    return authSuccess(toExtractedBrandKit(guidelines));
  } catch (error) {
    console.error("[onboarding] falha ao ler o manual da marca", error);
    return authFailure(manualErrorMessages.readFailed);
  }
}
