import OpenAI, { APIError, toFile } from "openai";
import { NextResponse } from "next/server";

import { LUNA_MODEL } from "@/lib/ai/models";
import { applyLogo, hideLogoArea } from "@/lib/brand/apply-logo";
import {
  defaultLogoPlacement,
  describeLogoArea,
  logoPositions,
  logoVariants,
  parseLogoPlacement,
  type LogoPlacement,
} from "@/lib/brand/logo-placement";
import {
  downloadBrandAsset,
  getBrandContext,
  type BrandContext,
} from "@/lib/brand/get-brand-context";
import { saveArtworkDraft } from "@/lib/content/save-artwork-draft";
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
const imageFormats = {
  square: {
    size: "1024x1024",
    contentFormat: "post",
    description: "a 1:1 square Instagram feed post",
  },
  portrait: {
    size: "1024x1280",
    contentFormat: "post",
    description: "a 4:5 Instagram feed post",
  },
  story: {
    size: "1152x2048",
    contentFormat: "story",
    description:
      "a 9:16 vertical Instagram story that fills the whole frame from top to bottom",
  },
} as const;

const FEED_EXAMPLES_IN_STORY =
  "The approved posts are feed posts: rebuild their layout for the tall vertical frame (stack the elements vertically and let the photo fill the height), never place a smaller feed post in the middle of the story.";

function describeFormat(
  format: GenerateImageInput["format"],
  brandContext: BrandContext | null,
) {
  const isAdaptingFeedExamples =
    format === "story" &&
    Boolean(brandContext?.goodExamples.length) &&
    !brandContext?.hasStoryExamples;

  return [
    `Format: ${imageFormats[format].description}.`,
    isAdaptingFeedExamples && FEED_EXAMPLES_IN_STORY,
  ]
    .filter(Boolean)
    .join(" ");
}

const photoAngles = [
  "straight-on at eye level",
  "three-quarter view from about 45 degrees",
  "close-up that fills the photo area with the product details",
];

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

const BRAND_POST_INSTRUCTIONS = `You are the senior art director of the brand described below, writing the prompt for GPT Image to create an Instagram post in the format given below.
The attached brand manual (PDF) is the governing principle of every post: its colors, typography, layout, graphic elements and image style are mandatory, even when the user's request suggests otherwise. The user's request only defines the subject and the message.
The attached approved posts are the template for this post: describe their layout precisely (grid, where the photo, headline, secondary text and call to action sit, proportions, margins, shapes, textures, typography weight, size and case, color of each element) and reproduce it as closely as possible, changing only the content. Avoid the style of the attached rejected posts.
Everything listed under "PROIBIDO NA ARTE" is forbidden and overrides the approved posts: if an approved post contains a forbidden color, element, text or style, leave it out or replace it with an allowed brand color.
The "ART DIRECTION RULES" section, when present, was written by this brand's owner and applies only to this brand: follow every rule in it, above the generic style guidance and the approved posts. Only an explicit request from the user for this specific post (or a "PROIBIDO NA ARTE" item) overrides one of these rules.
Write a detailed prompt that specifies: the layout copied from the approved posts and the manual; the exact brand colors by name and HEX for background, shapes and text (no colors outside the brand palette); the look of the typography (describe the brand fonts' style, weight and case, since the image model cannot load font files); the image style; and the mood of the brand's tone of voice.
Include a short headline in Brazilian Portuguese (up to 8 words), never using forbidden terms, and quote every piece of text exactly.
Only add a call to action, button, badge, seal or contact line if the approved posts have one (in the same position, size, shape and colors as in them) or if an ART DIRECTION RULE asks for it (in the position and with the text the rule gives). Otherwise never invent buttons or calls to action such as "Descubra mais", "Saiba mais" or "Compre agora", and never use accent colors that the approved posts do not use.
When a product photo is attached, that exact product is the hero of the post: describe it precisely (shape, colors, labels, packaging) and never replace it with another product or with the products shown in the example posts.
Never draw, describe or invent any logo, symbol, monogram, wordmark, and never write the brand name in the image or in your prompt: the official logo file is placed afterwards by the system in the corner you choose in "logoPosition", so tell the image model to keep that corner clean.
Choose "logoPosition" and "logoVariant" for this post's format: follow any ART DIRECTION RULE about the logo for this format (for example a different corner, or the symbol/icon instead of the full logo). With no such rule, use "bottom-right" and "logo".
Put the final English prompt for GPT Image in "prompt", as a single paragraph with no preamble, quotes or explanations.

BRAND GUIDELINES:
`;

const EDIT_INSTRUCTIONS = `
THIS IS AN EDIT OF AN EXISTING POST: the attached "Versão anterior do post" image is the post already approved as the base.
Describe that post faithfully (layout, composition, photo, colors, typography, headline text and graphic elements) and keep all of it unchanged, applying ONLY the change requested in "Ajuste pedido".
Keep the exact same headline text unless the requested change asks to alter it.`;

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
  {
    prompt,
    referenceImage,
    editInstruction,
    format,
    variationIndex,
  }: GenerateImageInput,
  brandContext: BrandContext | null,
  brandFiles: BrandFiles,
) {
  const systemPrompt = brandContext
    ? [
        `${BRAND_POST_INSTRUCTIONS}${brandContext.guidelines}`,
        describeFormat(format, brandContext),
        !editInstruction &&
          `Photo for this variation: show the product ${photoAngles[variationIndex % photoAngles.length]}, keeping the approved layout.`,
        brandFiles.goodExamples.length > 0 && buildColorVariation(brandContext),
      ]
        .filter(Boolean)
        .join("\n")
    : `${PROMPT_WRITER_INSTRUCTIONS}\n${describeFormat(format, null)}`;

  const completion = await openai.chat.completions.create({
    model: LUNA_MODEL,
    ...(brandContext ? { response_format: writtenPromptFormat } : {}),
    messages: [
      {
        role: "system",
        content: editInstruction
          ? `${systemPrompt}\n${EDIT_INSTRUCTIONS}`
          : systemPrompt,
      },
      {
        role: "user",
        content: [
          { type: "text", text: `Pedido do cliente: ${prompt}` },
          ...(editInstruction
            ? [
                {
                  type: "text" as const,
                  text: `Ajuste pedido: ${editInstruction}`,
                },
              ]
            : []),
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
                {
                  type: "text" as const,
                  text: editInstruction
                    ? "Versão anterior do post:"
                    : "Foto do produto:",
                },
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

  const content = completion.choices[0]?.message.content?.trim();

  if (!content || !brandContext) {
    return content
      ? { prompt: content, logoPlacement: defaultLogoPlacement }
      : null;
  }

  try {
    const written = JSON.parse(content) as {
      prompt?: unknown;
    } & LogoPlacementOutput;

    return typeof written.prompt === "string" && written.prompt.trim()
      ? {
          prompt: written.prompt.trim(),
          logoPlacement: parseLogoPlacement({
            position: written.logoPosition,
            variant: written.logoVariant,
          }),
        }
      : null;
  } catch {
    return null;
  }
}

type LogoPlacementOutput = { logoPosition?: unknown; logoVariant?: unknown };

const writtenPromptFormat = {
  type: "json_schema" as const,
  json_schema: {
    name: "image_prompt",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["prompt", "logoPosition", "logoVariant"],
      properties: {
        prompt: { type: "string" },
        logoPosition: { type: "string", enum: [...logoPositions] },
        logoVariant: { type: "string", enum: [...logoVariants] },
      },
    },
  },
};

function buildColorVariation(brandContext: BrandContext) {
  const isAlternateVariation =
    brandContext.primaryHex && brandContext.variationIndex % 2 === 1;

  return isAlternateVariation
    ? `Color variation for this post: keep exactly the same layout as the approved posts, but the sections that are white or light in them (such as the lower panel) must use the brand primary color ${brandContext.primaryHex}, with text and details in white or another contrasting brand color.`
    : "Color variation for this post: keep exactly the same color distribution as the approved posts, including the white or light sections (such as the lower panel).";
}

function buildEditGuardrail(editInstruction: string) {
  return `Reference image 1 is the previous version of this post. Recreate it as faithfully as possible, with the same layout, composition, photo, colors, typography, text and graphic elements, applying only this change: ${editInstruction}`;
}

function buildImageGuardrails(
  brandContext: BrandContext | null,
  exampleCount: number,
  hasReferenceImage: boolean,
  format: GenerateImageInput["format"],
  logoPlacement: LogoPlacement,
  editInstruction?: string,
) {
  const formatGuardrail = describeFormat(format, brandContext);

  if (!brandContext) {
    return [
      formatGuardrail,
      editInstruction && buildEditGuardrail(editInstruction),
    ]
      .filter(Boolean)
      .join(" ");
  }

  const firstExampleIndex = hasReferenceImage ? 2 : 1;
  const lastExampleIndex = firstExampleIndex + exampleCount - 1;

  return [
    formatGuardrail,
    editInstruction && buildEditGuardrail(editInstruction),
    hasReferenceImage &&
      !editInstruction &&
      "Reference image 1 is the product photo: this exact product must be the main subject of the post, reproduced faithfully (same shape, colors, labels and packaging). Do not replace it with any other product.",
    exampleCount > 0 &&
      `Reference images ${firstExampleIndex} to ${lastExampleIndex} are approved posts of this brand and the template for this post: closely replicate their layout, element placement, proportions, typography style, graphic elements and color usage, changing only the products, photos and text. Do not copy their logos. ${buildColorVariation(brandContext)}`,
    hasReferenceImage &&
      !editInstruction &&
      exampleCount > 0 &&
      `The products, food, packaging and photos inside reference images ${firstExampleIndex} to ${lastExampleIndex} must not appear in this post: those images only show the layout. The only product in this post is the one from reference image 1.`,
    brandContext.colorHexes.length > 0 &&
      `Use only the brand colors ${brandContext.colorHexes.join(", ")} for backgrounds, shapes and text. No other colors in graphic elements.`,
    brandContext.restrictions.length > 0 &&
      `Strictly forbidden in this image, even if present in the reference posts: ${brandContext.restrictions.join("; ")}.`,
    `Never draw any logo, logotype, symbol, monogram, wordmark or brand name anywhere in the image. Keep ${describeLogoArea(logoPlacement)} empty of text and graphics: the official logo is added there afterwards.`,
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

async function toPreviousPostFile(referenceImage: string) {
  const [, base64] = referenceImage.split(",");

  return toFile(
    await hideLogoArea(Buffer.from(base64, "base64")),
    "versao-anterior.png",
    { type: "image/png" },
  );
}

async function generateImage(
  openai: OpenAI,
  imagePrompt: string,
  referenceImages: Awaited<ReturnType<typeof toFile>>[],
  format: GenerateImageInput["format"],
) {
  const imageOptions = {
    model: IMAGE_MODEL,
    prompt: imagePrompt,
    size: imageFormats[format].size,
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
    const { referenceImage, editInstruction, format, variationIndex } =
      parsedInput.data;
    const brandContext = await getBrandContext(claims.sub, openai, {
      variationOffset: variationIndex,
      contentFormat: imageFormats[format].contentFormat,
    });
    const downloadedBrandFiles = await downloadBrandFiles(brandContext);
    const brandFiles = editInstruction
      ? { ...downloadedBrandFiles, goodExamples: [], badExamples: [] }
      : downloadedBrandFiles;
    const written = await writeImagePrompt(
      openai,
      parsedInput.data,
      brandContext,
      brandFiles,
    );

    if (!written) {
      return errorResponse(errorMessages.emptyResult, 502);
    }

    const referenceImages = await Promise.all([
      ...(referenceImage
        ? [
            editInstruction
              ? toPreviousPostFile(referenceImage)
              : toReferenceFile(referenceImage),
          ]
        : []),
      ...brandFiles.goodExamples.map(async (example, index) =>
        toFile(await hideLogoArea(example.bytes), `exemplo-${index + 1}.png`, {
          type: "image/png",
        }),
      ),
    ]);
    const imagePrompt = [
      brandContext
        ? removeBrandName(written.prompt, brandContext.brandName)
        : written.prompt,
      buildImageGuardrails(
        brandContext,
        brandFiles.goodExamples.length,
        Boolean(referenceImage),
        format,
        written.logoPlacement,
        editInstruction,
      ),
    ]
      .filter(Boolean)
      .join("\n\n");
    const imageBase64 = await generateImage(
      openai,
      imagePrompt,
      referenceImages,
      format,
    );

    if (!imageBase64) {
      return errorResponse(errorMessages.emptyResult, 502);
    }

    const generatedImage = Buffer.from(imageBase64, "base64");
    const finalImage = brandContext
      ? await applyLogo(
          generatedImage,
          brandContext.logos,
          written.logoPlacement,
        ).catch((error) => {
          console.error("Logo overlay failed", error);
          return generatedImage;
        })
      : generatedImage;
    const artworkId = await saveArtworkDraft({
      userId: claims.sub,
      image: finalImage,
      prompt: editInstruction
        ? `${parsedInput.data.prompt}\n\nAjuste: ${editInstruction}`
        : parsedInput.data.prompt,
      format: imageFormats[format].contentFormat,
    });

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${finalImage.toString("base64")}`,
      artworkId,
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
