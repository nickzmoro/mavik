"use server";

import OpenAI from "openai";

import { LUNA_MODEL } from "@/lib/ai/models";
import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { getCurrentUserId } from "@/lib/onboarding/store-access";
import { buildSampleCaption } from "@/lib/onboarding/sample-caption";
import {
  getBlockedRemainingMs,
  rateLimitRules,
  registerAttempt,
} from "@/lib/rate-limit";

import {
  generateSampleCaptionSchema,
  type GenerateSampleCaptionInput,
  type GeneratedSampleCaption,
} from "./schema";

const MAX_CAPTION_LENGTH = 220;

const CAPTION_INSTRUCTIONS = `Você escreve a legenda de exemplo de um post de Instagram para uma pequena empresa brasileira.
Escreva em português do Brasil, em no máximo 2 frases curtas, seguindo o tom indicado.
A legenda precisa funcionar para qualquer produto ou serviço do segmento: seja genérico e nunca prometa resultados, nunca cite preços, descontos, prazos ou números, sem hashtags e sem emojis.
Use no máximo uma das palavras preferidas, se combinar naturalmente. Nunca use nenhum dos termos proibidos.
Responda apenas com a legenda, sem aspas.`;

const describeScale = (value: number, low: string, high: string) =>
  value <= 35
    ? low
    : value >= 65
      ? high
      : `equilibrado entre ${low} e ${high}`;

function buildUserPrompt({
  tone,
  segment,
  product,
  lovedTerms,
  forbiddenTerms,
}: GenerateSampleCaptionInput) {
  return [
    `Segmento: ${segment || "não informado"}`,
    product && `Um dos produtos ou serviços: ${product}`,
    `Tom: ${describeScale(tone.formalCasual, "formal", "descontraído")}; ${describeScale(tone.seriousFun, "sério", "divertido")}; ${describeScale(tone.technicalSimple, "técnico", "simples")}; ${describeScale(tone.educationalSales, "educativo", "vendedor")}.`,
    lovedTerms.length > 0 && `Palavras preferidas: ${lovedTerms.join(", ")}`,
    forbiddenTerms.length > 0 &&
      `Termos proibidos: ${forbiddenTerms.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");
}

const containsForbiddenTerm = (caption: string, forbiddenTerms: string[]) =>
  forbiddenTerms.some((term) =>
    caption.toLowerCase().includes(term.toLowerCase()),
  );

async function writeCaptionWithAi(input: GenerateSampleCaptionInput) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const completion = await new OpenAI({ apiKey }).chat.completions.create({
      model: LUNA_MODEL,
      messages: [
        { role: "system", content: CAPTION_INSTRUCTIONS },
        { role: "user", content: buildUserPrompt(input) },
      ],
    });
    const caption = completion.choices[0]?.message.content
      ?.trim()
      .replace(/^["“]|["”]$/g, "");

    return caption &&
      caption.length <= MAX_CAPTION_LENGTH &&
      !containsForbiddenTerm(caption, input.forbiddenTerms)
      ? caption
      : null;
  } catch (error) {
    console.error("[onboarding] falha ao gerar a frase de exemplo", error);
    return null;
  }
}

export async function generateSampleCaption(
  input: GenerateSampleCaptionInput,
): Promise<AuthActionResult<GeneratedSampleCaption>> {
  const parsedInput = generateSampleCaptionSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return authFailure(onboardingErrorMessages.sessionExpired);
  }

  const rateLimitKey = `generate-sample-caption:user:${userId}`;
  const isBlocked = (await getBlockedRemainingMs([rateLimitKey])) > 0;

  if (!isBlocked) {
    await registerAttempt(
      rateLimitKey,
      rateLimitRules.generateSampleCaptionByUser,
    );
  }

  const generatedCaption = isBlocked
    ? null
    : await writeCaptionWithAi(parsedInput.data);

  return authSuccess({
    caption: generatedCaption ?? buildSampleCaption(parsedInput.data.tone),
    isGenerated: generatedCaption !== null,
  });
}
