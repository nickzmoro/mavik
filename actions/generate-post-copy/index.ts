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
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { getCurrentUserId } from "@/lib/onboarding/store-access";
import {
  MAX_POST_COPY_TOPICS,
  postCopySchema,
  type PostCopy,
} from "@/lib/post-copy/post-copy-schema";
import {
  MAX_CAPTION_HASHTAGS,
  getPostCopyIssues,
} from "@/lib/post-copy/validate-post-copy";
import {
  formatRetryAfter,
  getBlockedRemainingMs,
  rateLimitRules,
  registerAttempt,
} from "@/lib/rate-limit";

import {
  generatePostCopySchema,
  type GeneratedPostCopy,
  type GeneratePostCopyInput,
} from "./schema";

const generateFailedMessage =
  "Não conseguimos escrever os textos agora. Tente de novo.";

const maxAttempts = 2;

const fieldLabels = {
  title: "o título (parte fina e parte em destaque)",
  subtitle: "o subtítulo",
  topics: "os tópicos",
  cta: "a chamada para ação",
  caption: "a legenda",
} as const;

const buildInstructions = (
  isStory: boolean,
) => `Você é social media de uma pequena empresa brasileira e escreve os textos de um post de Instagram a partir do pedido do cliente.
Responda apenas com um objeto JSON neste formato:
{"title":{"regular":"parte fina do título","highlight":"parte do título em destaque"},"subtitle":"...","topics":[{"title":"...","sentence":"..."}],"cta":"..."${isStory ? "" : ',"caption":"..."'}}
Limites: title.regular e title.highlight até 30 caracteres cada; subtitle até 90; até ${MAX_POST_COPY_TOPICS} tópicos, cada um com title até 30 e sentence (uma frase) até 110; cta até 30 e com uma única chamada para ação.
${
  isStory
    ? "É um Story: não escreva legenda e não inclua o campo caption."
    : `A caption é a legenda: a primeira frase é o gancho e tem no máximo ${VISIBLE_WINDOW} caracteres; depois 1 a 3 frases curtas, uma única chamada para ação e, no final, numa linha separada, até ${MAX_CAPTION_HASHTAGS} hashtags específicas.`
}
Nunca invente números, preços, descontos, prazos ou datas que não estejam no pedido. Quando o texto precisar de um deles, escreva um marcador como {{preço}}, {{desconto}} ou {{data}}.
Escreva em português do Brasil, como uma pessoa: sem travessão, sem aspas curvas, sem reticências, sem emojis e sem estes clichês: ${CAPTION_CLICHES.join(", ")}.
Siga o tom de voz, as palavras preferidas, os termos proibidos e as regras da marca. Ignore as regras visuais (cores, fontes, logo, layout).

DIRETRIZES DA MARCA:
`;

function buildUserPrompt({
  prompt,
  field,
  currentCopy,
}: GeneratePostCopyInput) {
  return [
    `Pedido do cliente: ${prompt}`,
    field && currentCopy
      ? `Textos atuais:\n${JSON.stringify(currentCopy)}\nO cliente quer outra opção para ${fieldLabels[field]}: reescreva só esse campo, com abordagem diferente, e devolva os outros campos idênticos.`
      : null,
  ]
    .filter(Boolean)
    .join("\n\n");
}

const humanizePostCopy = (copy: PostCopy): PostCopy => ({
  title: {
    regular: humanizeCaption(copy.title.regular),
    highlight: humanizeCaption(copy.title.highlight),
  },
  subtitle: humanizeCaption(copy.subtitle),
  topics: copy.topics.map((topic) => ({
    title: humanizeCaption(topic.title),
    sentence: humanizeCaption(topic.sentence),
  })),
  cta: humanizeCaption(copy.cta),
  caption: copy.caption ? humanizeCaption(copy.caption) : undefined,
});

function parseGeneratedCopy(rawContent: string, isStory: boolean) {
  try {
    const parsedCopy = postCopySchema.safeParse(JSON.parse(rawContent));

    if (!parsedCopy.success) {
      return {
        issues: parsedCopy.error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`,
        ),
      };
    }

    const copy = humanizePostCopy(parsedCopy.data);

    return { copy: isStory ? { ...copy, caption: undefined } : copy };
  } catch {
    return { issues: ["A resposta não é um JSON válido."] };
  }
}

async function writePostCopy(
  openai: OpenAI,
  input: GeneratePostCopyInput,
  userId: string,
) {
  const isStory = input.formatId === "story";
  const brandContext = await getBrandContext(userId, openai, {
    contentFormat: isStory ? "story" : "post",
  });
  const forbiddenTerms = brandContext?.forbiddenTerms ?? [];
  const conversation: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `${buildInstructions(isStory)}${brandContext?.guidelines ?? ""}`,
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
    const { copy, issues } = parseGeneratedCopy(rawContent, isStory);
    const copyIssues = copy
      ? getPostCopyIssues(copy, { forbiddenTerms, isStory })
      : issues;

    if (copy && copyIssues.length === 0) {
      return copy;
    }

    conversation.push(
      { role: "assistant", content: rawContent },
      {
        role: "user",
        content: `Textos reprovados:\n- ${copyIssues.join("\n- ")}\nReescreva corrigindo esses pontos e responda só com o JSON.`,
      },
    );
  }

  return null;
}

const keepOnlyField = (
  generatedCopy: PostCopy,
  { field, currentCopy }: GeneratePostCopyInput,
): PostCopy =>
  field && currentCopy
    ? { ...currentCopy, [field]: generatedCopy[field] }
    : generatedCopy;

export async function generatePostCopy(
  input: GeneratePostCopyInput,
): Promise<AuthActionResult<GeneratedPostCopy>> {
  const parsedInput = generatePostCopySchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return authFailure(onboardingErrorMessages.sessionExpired);
  }

  const rateLimitKey = `generate-post-copy:user:${userId}`;
  const blockedRemainingMs = await getBlockedRemainingMs([rateLimitKey]);

  if (blockedRemainingMs > 0) {
    return authFailure(
      `Você pediu muitos textos seguidos. Tente de novo em ${formatRetryAfter(blockedRemainingMs)}.`,
    );
  }

  await registerAttempt(rateLimitKey, rateLimitRules.generatePostCopyByUser);

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return authFailure(generateFailedMessage);
  }

  try {
    const generatedCopy = await writePostCopy(
      new OpenAI({ apiKey }),
      parsedInput.data,
      userId,
    );

    return generatedCopy
      ? authSuccess({ copy: keepOnlyField(generatedCopy, parsedInput.data) })
      : authFailure(generateFailedMessage);
  } catch (error) {
    console.error("[studio] falha ao gerar textos do post", error);
    return authFailure(generateFailedMessage);
  }
}
