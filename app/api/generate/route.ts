import OpenAI, { APIError, toFile } from "openai";
import { NextResponse } from "next/server";

import { applyLogo, hideLogoArea } from "@/lib/brand/apply-logo";
import {
  downloadBrandAsset,
  getBrandContext,
  type BrandContext,
} from "@/lib/brand/get-brand-context";
import {
  formatRetryAfter,
  getBlockedRemainingMs,
  registerAttempt,
  type RateLimitRule,
} from "@/lib/rate-limit";
import { getCurrentUserClaims } from "@/lib/supabase/get-current-user-claims";
import {
  generateImageSchema,
  type GenerateImageInput,
} from "@/lib/validations/image-generation";

const IMAGE_MODEL = "gpt-image-2.5-flare";
const HOUR_MS = 60 * 60 * 1000;
const generateImageRateLimitRule: RateLimitRule = {
  limit: 10,
  windowMs: HOUR_MS,
  blockMs: HOUR_MS,
  maxBlockMs: 24 * HOUR_MS,
};
const INSTAGRAM_FEED_SIZE = "1024x1280";

export const maxDuration = 180;

const PROMPT_WRITER_INSTRUCTIONS = `You are an expert prompt engineer for GPT Image, creating social media art for small businesses.
Analyze the user's request (written in Portuguese) and the attached reference photo, if any.
Describe the subject, composition, lighting, colors, style and mood needed to fulfill the request.
When a reference photo is attached, it will also be given to the image model: tell it to keep the product or subject from the reference image faithful (shape, colors, details) and describe the new scene around it.
The image must contain no text, letters, logos, signs or labels, unless the user explicitly asks for text; in that case, quote the exact text in Brazilian Portuguese.
Output ONLY the final English prompt for GPT Image, in a single paragraph, with no preamble, quotes or explanations.`;

const errorMessages = {
  notConfigured:
    "A geração de artes ainda não está configurada. Fale com o suporte.",
  unauthorized: "Sua sessão expirou. Entre de novo para gerar artes.",
  invalidInput: "Confira a descrição e a foto e tente de novo.",
  contentPolicy:
    "Não conseguimos gerar essa arte. Ajuste a descrição e tente de novo.",
  providerUnavailable:
    "O serviço de geração de artes está instável agora. Tente de novo em alguns minutos.",
  emptyResult: "Não conseguimos gerar a arte desta vez. Tente de novo.",
  tooManyAttempts: (retryAfter: string) =>
    `Você gerou muitas artes seguidas. Tente de novo em ${retryAfter}.`,
};

function errorResponse(errorMessage: string, status: number) {
  return NextResponse.json({ errorMessage }, { status });
}

const BRAND_POST_INSTRUCTIONS = `You are the senior art director of the brand described below, writing the prompt for GPT Image to create a 4:5 Instagram feed post.
The attached brand manual (PDF) is the governing principle of every post: its colors, typography, layout, graphic elements and image style are mandatory, even when the user's request suggests otherwise. The user's request only defines the subject and the message.
The attached approved posts show how this brand's posts must look: reproduce their layout structure, typography style, color usage and graphic elements as closely as possible, with new content. Avoid the style of the attached rejected posts.
Write a detailed prompt that specifies: the layout copied from the approved posts and the manual; the exact brand colors by name and HEX for background, shapes and text (no colors outside the brand palette); the look of the typography (describe the brand fonts' style, weight and case, since the image model cannot load font files); the image style; and the mood of the brand's tone of voice.
Include a short headline in Brazilian Portuguese (up to 8 words, plus an optional short call to action), never using forbidden terms, and quote every piece of text exactly.
When a product photo is attached, that exact product is the hero of the post: describe it precisely (shape, colors, labels, packaging) and never replace it with another product or with the products shown in the example posts.
Never draw, describe or invent any logo, symbol, monogram, wordmark, and never write the brand name in the image or in your prompt: the official logo file is placed afterwards in the bottom-right corner, so keep that area clean.
Output ONLY the final English prompt for GPT Image, in a single paragraph, with no preamble, quotes or explanations.

BRAND GUIDELINES:
`;

type BrandFile = { bytes: Buffer; mimeType: string; label: string };

type BrandFiles = {
  manual?: BrandFile;
  goodExamples: BrandFile[];
  badExamples: BrandFile[];
};

async function downloadBrandFiles(
  brandContext: BrandContext | null,
): Promise<BrandFiles> {
  if (!brandContext) {
    return { goodExamples: [], badExamples: [] };
  }

  const download = (file: BrandContext["goodExamples"][number]) =>
    downloadBrandAsset(file.storagePath)
      .then((bytes) => ({ ...file, bytes }))
      .catch((error) => {
        console.error("Brand file download failed", error);
        return null;
      });

  const [manual, goodExamples, badExamples] = await Promise.all([
    brandContext.manual ? download(brandContext.manual) : null,
    Promise.all(brandContext.goodExamples.map(download)),
    Promise.all(brandContext.badExamples.map(download)),
  ]);

  return {
    manual: manual ?? undefined,
    goodExamples: goodExamples.filter((file) => file !== null),
    badExamples: badExamples.filter((file) => file !== null),
  };
}

function toDataUrl({ bytes, mimeType }: BrandFile) {
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

function toImageParts(files: BrandFile[], detail: "high" | "low") {
  return files.map((file) => ({
    type: "image_url" as const,
    image_url: { url: toDataUrl(file), detail },
  }));
}

async function writeImagePrompt(
  openai: OpenAI,
  { prompt, referenceImage }: GenerateImageInput,
  brandContext: BrandContext | null,
  brandFiles: BrandFiles,
) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: brandContext
          ? `${BRAND_POST_INSTRUCTIONS}${brandContext.guidelines}`
          : PROMPT_WRITER_INSTRUCTIONS,
      },
      {
        role: "user",
        content: [
          { type: "text", text: `Pedido do cliente: ${prompt}` },
          ...(brandFiles.manual
            ? [
                {
                  type: "text" as const,
                  text: "Manual da marca (princípio obrigatório):",
                },
                {
                  type: "file" as const,
                  file: {
                    filename: brandFiles.manual.label,
                    file_data: toDataUrl(brandFiles.manual),
                  },
                },
              ]
            : []),
          ...(brandFiles.goodExamples.length > 0
            ? [
                {
                  type: "text" as const,
                  text: "Posts aprovados da marca (siga este padrão):",
                },
                ...toImageParts(brandFiles.goodExamples, "high"),
              ]
            : []),
          ...(brandFiles.badExamples.length > 0
            ? [
                {
                  type: "text" as const,
                  text: "Posts que a marca não quer (evite este estilo):",
                },
                ...toImageParts(brandFiles.badExamples, "low"),
              ]
            : []),
          ...(referenceImage
            ? [
                { type: "text" as const, text: "Foto do produto:" },
                {
                  type: "image_url" as const,
                  image_url: { url: referenceImage, detail: "high" as const },
                },
              ]
            : []),
        ],
      },
    ],
  });

  return completion.choices[0]?.message.content?.trim();
}

function buildImageGuardrails(
  brandContext: BrandContext | null,
  exampleCount: number,
  hasReferenceImage: boolean,
) {
  if (!brandContext) {
    return "";
  }

  const firstExampleIndex = hasReferenceImage ? 2 : 1;
  const lastExampleIndex = firstExampleIndex + exampleCount - 1;

  return [
    hasReferenceImage &&
      "Reference image 1 is the product photo: this exact product must be the main subject of the post, reproduced faithfully (same shape, colors, labels and packaging). Do not replace it with any other product.",
    exampleCount > 0 &&
      `Reference images ${firstExampleIndex} to ${lastExampleIndex} are approved posts of this brand, used only as a style guide: match their layout structure, typography style, graphic elements and color usage, but do not copy their products, photos, text or logos.`,
    brandContext.colorHexes.length > 0 &&
      `Use only the brand colors ${brandContext.colorHexes.join(", ")} for backgrounds, shapes and text. No other colors in graphic elements.`,
    "Never draw any logo, logotype, symbol, monogram, wordmark or brand name anywhere in the image. Keep the bottom-right corner (30% of the width, 15% of the height) empty of text and graphics: the official logo is added there afterwards.",
  ]
    .filter(Boolean)
    .join(" ");
}

function removeBrandName(prompt: string, brandName: string) {
  const escapedName = brandName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return prompt.replace(new RegExp(escapedName, "gi"), "the brand");
}

function toReferenceFile(referenceImage: string) {
  const [header, base64] = referenceImage.split(",");
  const type = header.slice("data:".length, header.indexOf(";"));

  return toFile(Buffer.from(base64, "base64"), "reference", { type });
}

async function generateImage(
  openai: OpenAI,
  imagePrompt: string,
  referenceImages: Awaited<ReturnType<typeof toFile>>[],
) {
  const imageOptions = {
    model: IMAGE_MODEL,
    prompt: imagePrompt,
    size: INSTAGRAM_FEED_SIZE,
    quality: "high",
    output_format: "png",
  } as const;

  const response =
    referenceImages.length > 0
      ? await openai.images.edit({ ...imageOptions, image: referenceImages })
      : await openai.images.generate(imageOptions);

  return response.data?.[0]?.b64_json;
}

function isContentPolicyError(error: APIError) {
  return (
    error.code === "moderation_blocked" ||
    error.code === "content_policy_violation" ||
    error.code === "content_filter"
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("OPENAI_API_KEY is not set");
    return errorResponse(errorMessages.notConfigured, 500);
  }

  const claims = await getCurrentUserClaims();

  if (!claims?.sub) {
    return errorResponse(errorMessages.unauthorized, 401);
  }

  const parsedInput = generateImageSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsedInput.success) {
    return errorResponse(
      parsedInput.error.issues[0]?.message ?? errorMessages.invalidInput,
      400,
    );
  }

  const userKey = `generate-image:user:${claims.sub}`;
  const blockedRemainingMs = await getBlockedRemainingMs([userKey]);

  if (blockedRemainingMs > 0) {
    return errorResponse(
      errorMessages.tooManyAttempts(formatRetryAfter(blockedRemainingMs)),
      429,
    );
  }

  await registerAttempt(userKey, generateImageRateLimitRule);

  const openai = new OpenAI({ apiKey });

  try {
    const brandContext = await getBrandContext(claims.sub, openai);
    const brandFiles = await downloadBrandFiles(brandContext);
    const { referenceImage } = parsedInput.data;
    const writtenPrompt = await writeImagePrompt(
      openai,
      parsedInput.data,
      brandContext,
      brandFiles,
    );

    if (!writtenPrompt) {
      return errorResponse(errorMessages.emptyResult, 502);
    }

    const referenceImages = await Promise.all([
      ...(referenceImage ? [toReferenceFile(referenceImage)] : []),
      ...brandFiles.goodExamples.map(async (example, index) =>
        toFile(await hideLogoArea(example.bytes), `exemplo-${index + 1}.png`, {
          type: "image/png",
        }),
      ),
    ]);
    const imagePrompt = [
      brandContext
        ? removeBrandName(writtenPrompt, brandContext.brandName)
        : writtenPrompt,
      buildImageGuardrails(
        brandContext,
        brandFiles.goodExamples.length,
        Boolean(referenceImage),
      ),
    ]
      .filter(Boolean)
      .join("\n\n");
    const imageBase64 = await generateImage(
      openai,
      imagePrompt,
      referenceImages,
    );

    if (!imageBase64) {
      return errorResponse(errorMessages.emptyResult, 502);
    }

    const generatedImage = Buffer.from(imageBase64, "base64");
    const finalImage = brandContext
      ? await applyLogo(generatedImage, brandContext.logos).catch((error) => {
          console.error("Logo overlay failed", error);
          return generatedImage;
        })
      : generatedImage;

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${finalImage.toString("base64")}`,
    });
  } catch (error) {
    if (error instanceof APIError) {
      console.error("OpenAI request failed", error.status, error.code);

      if (isContentPolicyError(error)) {
        return errorResponse(errorMessages.contentPolicy, 422);
      }

      if (error.status === 401) {
        return errorResponse(errorMessages.notConfigured, 500);
      }

      return errorResponse(errorMessages.providerUnavailable, 502);
    }

    console.error("Image generation failed", error);
    return errorResponse(errorMessages.providerUnavailable, 502);
  }
}
