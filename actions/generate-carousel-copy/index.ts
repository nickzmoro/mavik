"use server";

import OpenAI from "openai";

import { LUNA_MODEL } from "@/lib/ai/models";
import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { getBrandContext } from "@/lib/brand/get-brand-context";
import {
  CAPTION_CLICHES,
  VISIBLE_WINDOW,
  humanizeCaption,
} from "@/lib/caption/lint";
import {
  carouselCopySchema,
  getCarouselCopyIssues,
  type CarouselCopy,
} from "@/lib/carousel/carousel-copy";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { getCurrentUserId } from "@/lib/onboarding/store-access";
import {
  formatRetryAfter,
  getBlockedRemainingMs,
  rateLimitRules,
  registerAttempt,
} from "@/lib/rate-limit";

import {
  generateCarouselCopySchema,
  type CarouselCopyField,
  type GenerateCarouselCopyInput,
  type GeneratedCarouselCopy,
} from "./schema";

const generateFailedMessage =
  "Não conseguimos escrever os slides agora. Tente de novo.";

const maxAttempts = 2;

const RECAP_RULE =
  '- penúltimo slide, role "recap": o resumo de tudo em lista curta, para salvar e compartilhar.';

const buildInstructions = (slideCount: number) =>
  [
    `Você é social media de uma pequena empresa brasileira e escreve um carrossel de Instagram com ${slideCount} slides a partir do pedido do cliente.`,
    "Responda apenas com um objeto JSON neste formato:",
    '{"slides":[{"role":"cover","headline":"...","body":"..."}],"caption":"..."}',
    `Estrutura, com exatamente ${slideCount} slides em "slides":`,
    '- slide 1, role "cover": o gancho que faz deslizar. headline com no máximo 6 palavras; body com uma linha de promessa.',
    '- slide 2, role "stake": por que isso importa, numa frase. Ele também funciona como uma segunda capa.',
    '- slides do meio, role "idea": uma ideia por slide. headline de 3 a 7 palavras; body com no máximo 25 palavras.',
    slideCount >= 6 ? RECAP_RULE : null,
    '- último slide, role "cta": uma única ação (salvar, comentar uma palavra ou seguir). Só este slide pode ter chamada para ação.',
    "Com 3 slides, use cover, idea e cta.",
    `A caption é a legenda do post: a primeira frase é o gancho e tem no máximo ${VISIBLE_WINDOW} caracteres; depois 1 a 3 frases curtas, uma única chamada para ação e, no final, numa linha separada, até 5 hashtags específicas.`,
    "Nunca invente números, preços, descontos, prazos ou datas que não estejam no pedido. Quando precisar de um deles, escreva um marcador como {{preço}} ou {{data}}.",
    `Escreva em português do Brasil, como uma pessoa: sem travessão, sem aspas curvas, sem reticências, sem emojis e sem estes clichês: ${CAPTION_CLICHES.join(", ")}.`,
    "Siga o tom de voz, as palavras preferidas, os termos proibidos e as regras da marca. Ignore as regras visuais.",
    "",
    "DIRETRIZES DA MARCA:",
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");

const describeField = (field: CarouselCopyField) =>
  field === "caption" ? "a legenda" : `o slide ${field.slide}`;

function buildUserPrompt({
  prompt,
  field,
  currentCopy,
}: GenerateCarouselCopyInput) {
  return [
    `Pedido do cliente: ${prompt}`,
    field && currentCopy
      ? `Carrossel atual:\n${JSON.stringify(currentCopy)}\nO cliente quer outra opção para ${describeField(field)}: reescreva só isso, com abordagem diferente, e devolva o resto idêntico.`
      : null,
  ]
    .filter(Boolean)
    .join("\n\n");
}

const humanizeCarouselCopy = ({
  slides,
  caption,
}: CarouselCopy): CarouselCopy => ({
  slides: slides.map((slide) => ({
    ...slide,
    headline: humanizeCaption(slide.headline),
    body: humanizeCaption(slide.body),
  })),
  caption: humanizeCaption(caption),
});

function parseGeneratedCopy(rawContent: string) {
  try {
    const parsedCopy = carouselCopySchema.safeParse(JSON.parse(rawContent));

    return parsedCopy.success
      ? { copy: humanizeCarouselCopy(parsedCopy.data) }
      : {
          issues: parsedCopy.error.issues.map(
            (issue) => `${issue.path.join(".")}: ${issue.message}`,
          ),
        };
  } catch {
    return { issues: ["A resposta não é um JSON válido."] };
  }
}

async function writeCarouselCopy(
  openai: OpenAI,
  input: GenerateCarouselCopyInput,
  userId: string,
) {
  const brandContext = await getBrandContext(userId, openai);
  const forbiddenTerms = brandContext?.forbiddenTerms ?? [];
  const conversation: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `${buildInstructions(input.slideCount)}${brandContext?.guidelines ?? ""}`,
    },
    { role: "user", content: buildUserPrompt(input) },
  ];

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const completion = await openai.chat.completions.create({
      model: LUNA_MODEL,
      response_format: { type: "json_object" },
      messages: conversation,
    });
    const rawContent = completion.choices[0]?.message.content ?? "";
    const { copy, issues } = parseGeneratedCopy(rawContent);
    const copyIssues = copy
      ? getCarouselCopyIssues(copy, {
          forbiddenTerms,
          slideCount: input.slideCount,
        })
      : issues;

    if (copy && copyIssues.length === 0) {
      return copy;
    }

    conversation.push(
      { role: "assistant", content: rawContent },
      {
        role: "user",
        content: `Carrossel reprovado:\n- ${copyIssues.join("\n- ")}\nReescreva corrigindo esses pontos e responda só com o JSON.`,
      },
    );
  }

  return null;
}

function keepOnlyField(
  generatedCopy: CarouselCopy,
  { field, currentCopy }: GenerateCarouselCopyInput,
): CarouselCopy {
  if (!field || !currentCopy) {
    return generatedCopy;
  }

  if (field === "caption") {
    return { ...currentCopy, caption: generatedCopy.caption };
  }

  return {
    ...currentCopy,
    slides: currentCopy.slides.map((slide, index) =>
      index === field.slide - 1
        ? (generatedCopy.slides[index] ?? slide)
        : slide,
    ),
  };
}

export async function generateCarouselCopy(
  input: GenerateCarouselCopyInput,
): Promise<AuthActionResult<GeneratedCarouselCopy>> {
  const parsedInput = generateCarouselCopySchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return authFailure(onboardingErrorMessages.sessionExpired);
  }

  const rateLimitKey = `generate-carousel-copy:user:${userId}`;
  const blockedRemainingMs = await getBlockedRemainingMs([rateLimitKey]);

  if (blockedRemainingMs > 0) {
    return authFailure(
      `Você pediu muitos carrosséis seguidos. Tente de novo em ${formatRetryAfter(blockedRemainingMs)}.`,
    );
  }

  await registerAttempt(
    rateLimitKey,
    rateLimitRules.generateCarouselCopyByUser,
  );

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return authFailure(generateFailedMessage);
  }

  try {
    const generatedCopy = await writeCarouselCopy(
      new OpenAI({ apiKey }),
      parsedInput.data,
      userId,
    );

    return generatedCopy
      ? authSuccess({ copy: keepOnlyField(generatedCopy, parsedInput.data) })
      : authFailure(generateFailedMessage);
  } catch (error) {
    console.error("[studio] falha ao gerar textos do carrossel", error);
    return authFailure(generateFailedMessage);
  }
}
