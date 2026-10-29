"use server";

import OpenAI from "openai";

import { getBrandContext } from "@/lib/brand/get-brand-context";
import { lintCaption } from "@/lib/caption/lint";
import {
  CAPTION_WRITING_RULES,
  findForbiddenTerms,
  writeLintedCaption,
} from "@/lib/caption/write-linted-caption";
import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { getCurrentUserId } from "@/lib/onboarding/store-access";
import {
  formatRetryAfter,
  getBlockedRemainingMs,
  rateLimitRules,
  registerAttempt,
} from "@/lib/rate-limit";

import {
  generatePostCaptionSchema,
  type GeneratePostCaptionInput,
} from "./schema";

const generateFailedMessage =
  "Não conseguimos gerar a legenda agora. Tente de novo.";

const CAPTION_INSTRUCTIONS = `Você é social media de uma pequena empresa brasileira e escreve a legenda do post de Instagram descrito pelo pedido do cliente e mostrado na arte anexada.
A legenda fala do produto ou serviço deste post: identifique-o no pedido e na arte e cite-o pelo nome, do jeito que as pessoas buscariam no Instagram. Nunca troque por outro produto da loja.
Nunca invente preços, descontos, prazos ou características que não estejam no pedido ou na arte.
Escreva em português do Brasil: o gancho, depois de 1 a 3 frases curtas e, no final, numa linha separada, de 3 a 5 hashtags específicas do produto e do segmento.
Siga o tom de voz, as palavras preferidas e os termos proibidos da marca. Ignore as regras visuais da marca (cores, fontes, logo, layout).
${CAPTION_WRITING_RULES}
Responda apenas com a legenda, sem aspas.

DIRETRIZES DA MARCA:
`;

function buildUserContent({
  prompt,
  imageDataUrl,
  previousCaption,
}: GeneratePostCaptionInput): OpenAI.ChatCompletionContentPart[] {
  return [
    { type: "text", text: `Pedido do cliente: ${prompt || "não informado"}` },
    ...(imageDataUrl
      ? [
          { type: "text" as const, text: "Arte do post:" },
          {
            type: "image_url" as const,
            image_url: { url: imageDataUrl, detail: "low" as const },
          },
        ]
      : []),
    ...(previousCaption
      ? [
          {
            type: "text" as const,
            text: `O cliente não gostou desta legenda, escreva outra com gancho e abordagem diferentes:\n${previousCaption}`,
          },
        ]
      : []),
  ];
}

export async function generatePostCaption(
  input: GeneratePostCaptionInput,
): Promise<AuthActionResult<{ caption: string }>> {
  const parsedInput = generatePostCaptionSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return authFailure(onboardingErrorMessages.sessionExpired);
  }

  const rateLimitKey = `generate-post-caption:user:${userId}`;
  const blockedRemainingMs = await getBlockedRemainingMs([rateLimitKey]);

  if (blockedRemainingMs > 0) {
    return authFailure(
      `Você pediu muitas legendas seguidas. Tente de novo em ${formatRetryAfter(blockedRemainingMs)}.`,
    );
  }

  await registerAttempt(rateLimitKey, rateLimitRules.generatePostCaptionByUser);

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return authFailure(generateFailedMessage);
  }

  try {
    const openai = new OpenAI({ apiKey });
    const brandContext = await getBrandContext(userId, openai);
    const forbiddenTerms = brandContext?.forbiddenTerms ?? [];
    const caption = await writeLintedCaption(
      openai,
      [
        {
          role: "system",
          content: `${CAPTION_INSTRUCTIONS}${brandContext?.guidelines ?? ""}`,
        },
        { role: "user", content: buildUserContent(parsedInput.data) },
      ],
      (caption) => {
        const usedForbiddenTerms = findForbiddenTerms(caption, forbiddenTerms);

        return [
          ...lintCaption(caption).issues,
          usedForbiddenTerms.length > 0 &&
            `Termos proibidos usados: ${usedForbiddenTerms.join(", ")}.`,
        ].filter((issue): issue is string => Boolean(issue));
      },
    );

    return caption
      ? authSuccess({ caption })
      : authFailure(generateFailedMessage);
  } catch (error) {
    console.error("[studio] falha ao gerar legenda", error);
    return authFailure(generateFailedMessage);
  }
}
