import OpenAI, { APIError, toFile } from "openai";
import { NextResponse } from "next/server";

import { IMAGE_PROMPT_MODEL } from "@/lib/ai/models";
import { applyLogo, hideLogoArea } from "@/lib/brand/apply-logo";
import {
  downloadBrandAsset,
  getBrandContext,
  type BrandContext,
} from "@/lib/brand/get-brand-context";
import {
  appendArtworkVersion,
  getLatestArtworkRender,
} from "@/lib/content/artwork-versions";
import { saveArtworkDraft } from "@/lib/content/save-artwork-draft";
import {
  buildApprovedCopyInstruction,
  replaceHeadlineRule,
} from "@/lib/post-copy/approved-copy";
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
      "a 9:16 vertical Instagram story. Keep the top 14% and the bottom 20% of the frame free of text and graphics",
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
  artworkNotFound:
    "Não encontramos essa arte. Abra de novo pela lista de artes.",
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

function isRateLimitExempt(userId: string) {
  return (process.env.IMAGE_RATE_LIMIT_EXEMPT_USER_IDS ?? "")
    .split(",")
    .map((exemptUserId) => exemptUserId.trim())
    .includes(userId);
}

function errorResponse(errorMessage: string, status: number) {
  return NextResponse.json({ errorMessage }, { status });
}

const HEADLINE_RULE =
  "Include a short headline in Brazilian Portuguese (up to 8 words), never using forbidden terms, and quote every piece of text exactly.";

const APPROVED_COPY_RULE =
  "The client approved the texts below. They replace the headline and call to action rules: place them in the template's text areas, in this order, adding text areas only when the template has fewer, and quote them in your prompt exactly as written.";

const BRAND_POST_INSTRUCTIONS = `You are the senior art director of the brand described below, writing the prompt for GPT Image to create an Instagram post in the format given below.
The attached brand manual (PDF) is the governing principle of every post: its colors, typography, layout, graphic elements and image style are mandatory, even when the user's request suggests otherwise. The user's request only defines the subject and the message.
The first attached approved post is the TEMPLATE for this post; the other approved posts only show the brand style. Study the template and describe its layout as a precise spec: the position and size of every element as a percentage of the frame (photo area, headline, secondary text, call to action, panels and shapes), margins and alignment, number of text lines, typography weight, size and case, textures, and the HEX color of every background, panel, shape and text. Reproduce that spec exactly, changing only the product, the photo and the text. Never mix in layouts from the other approved posts. Avoid the style of the attached rejected posts.
Everything listed under "PROIBIDO NA ARTE" is forbidden and overrides the approved posts: if an approved post contains a forbidden color, element, text or style, leave it out or replace it with an allowed brand color.
The "ART DIRECTION RULES" section, when present, was written by this brand's owner and applies only to this brand: follow every rule in it, above the generic style guidance and the approved posts. Only an explicit request from the user for this specific post (or a "PROIBIDO NA ARTE" item) overrides one of these rules.
Write a detailed prompt that specifies: the template's layout spec, element by element; the exact brand colors by name and HEX for background, shapes and text (no colors outside the brand palette); the look of the typography (describe the brand fonts' style, weight and case, since the image model cannot load font files); the image style; and the mood of the brand's tone of voice.
${HEADLINE_RULE}
Only add a call to action, button, badge or seal if the template has one, in the same position, size, shape and colors as in it. Never invent buttons or calls to action such as "Descubra mais", "Saiba mais" or "Compre agora", and never use accent colors that the template does not use.
When a product photo is attached, that exact product is the hero of the post: describe it precisely (shape, colors, labels, packaging) and never replace it with another product or with the products shown in the example posts.
Never draw, describe or invent any logo, symbol, monogram, wordmark, and never write the brand name in the image or in your prompt: the official logo file is placed afterwards in the bottom-right corner, so keep that area clean.
Output ONLY the final English prompt for GPT Image, in a single paragraph, with no preamble, quotes or explanations.

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
  approvedCopyInstruction: string,
) {
  const brandPostInstructions = approvedCopyInstruction
    ? replaceHeadlineRule(
        BRAND_POST_INSTRUCTIONS,
        HEADLINE_RULE,
        `${APPROVED_COPY_RULE}\n${approvedCopyInstruction}`,
      )
    : BRAND_POST_INSTRUCTIONS;
  const systemPrompt = brandContext
    ? [
        `${brandPostInstructions}${brandContext.guidelines}`,
        describeFormat(format, brandContext),
        !editInstruction &&
          `Photo for this variation: show the product ${photoAngles[variationIndex % photoAngles.length]}, keeping the template layout and the size and position of its photo area.`,
      ]
        .filter(Boolean)
        .join("\n")
    : [
        PROMPT_WRITER_INSTRUCTIONS,
        describeFormat(format, null),
        approvedCopyInstruction,
      ]
        .filter(Boolean)
        .join("\n");

  const completion = await openai.chat.completions.create({
    model: IMAGE_PROMPT_MODEL,
    temperature: 0.2,
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
                  text: "Post aprovado que é o molde desta arte (copie a estrutura exatamente):",
                },
                ...toImageParts(brandFiles.goodExamples.slice(0, 1), "high"),
              ]
            : []),
          ...(brandFiles.goodExamples.length > 1
            ? [
                {
                  type: "text" as const,
                  text: "Outros posts aprovados (só referência de estilo, não misture os layouts):",
                },
                ...toImageParts(brandFiles.goodExamples.slice(1), "low"),
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

  return completion.choices[0]?.message.content?.trim();
}

function putTemplateFirst<T>(examples: T[], variationIndex: number) {
  if (examples.length === 0) {
    return examples;
  }

  const templateIndex = variationIndex % examples.length;

  return [
    ...examples.slice(templateIndex),
    ...examples.slice(0, templateIndex),
  ];
}

function buildEditGuardrail(editInstruction: string) {
  return `Reference image 1 is the previous version of this post. Recreate it as faithfully as possible, with the same layout, composition, photo, colors, typography, text and graphic elements, applying only this change: ${editInstruction}`;
}

function buildImageGuardrails(
  brandContext: BrandContext | null,
  exampleCount: number,
  hasReferenceImage: boolean,
  format: GenerateImageInput["format"],
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
      `Reference image ${firstExampleIndex} is the approved template for this post: replicate its exact layout, the position and size of every element, proportions, margins, typography style and case, graphic elements and the color of every area, changing only the product, photo and text.`,
    exampleCount > 1 &&
      `Reference images ${firstExampleIndex + 1} to ${lastExampleIndex} are other approved posts of this brand: use them only for the brand style and never mix their layouts into this post.`,
    exampleCount > 0 && "Do not copy the logos of the reference posts.",
    hasReferenceImage &&
      !editInstruction &&
      exampleCount > 0 &&
      `The products, food, packaging and photos inside reference images ${firstExampleIndex} to ${lastExampleIndex} must not appear in this post: those images only show the layout. The only product in this post is the one from reference image 1.`,
    brandContext.colorHexes.length > 0 &&
      `Use only the brand colors ${brandContext.colorHexes.join(", ")} for backgrounds, shapes and text. No other colors in graphic elements.`,
    brandContext.restrictions.length > 0 &&
      `Strictly forbidden in this image, even if present in the reference posts: ${brandContext.restrictions.join("; ")}.`,
    `Never draw any logo, logotype, symbol, monogram, wordmark or brand name anywhere in the image. Keep the bottom-right corner (30% of the width, 15% of the height) empty of text and graphics: the official logo is added there afterwards.`,
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

  if (!isRateLimitExempt(claims.sub)) {
    const userKey = `generate-image:user:${claims.sub}`;
    const blockedRemainingMs = await getBlockedRemainingMs([userKey]);

    if (blockedRemainingMs > 0) {
      return errorResponse(
        errorMessages.tooManyAttempts(formatRetryAfter(blockedRemainingMs)),
        429,
      );
    }

    await registerAttempt(userKey, generateImageRateLimitRule);
  }

  const editedArtworkId = parsedInput.data.editInstruction
    ? parsedInput.data.artworkId
    : undefined;
  const openai = new OpenAI({ apiKey });

  try {
    const storedRender = editedArtworkId
      ? await getLatestArtworkRender(claims.sub, editedArtworkId)
      : null;

    if (editedArtworkId && !storedRender) {
      return errorResponse(errorMessages.artworkNotFound, 404);
    }

    const imageInput = storedRender
      ? {
          ...parsedInput.data,
          referenceImage: `data:image/png;base64,${storedRender.toString("base64")}`,
        }
      : parsedInput.data;
    const {
      referenceImage,
      editInstruction,
      format,
      variationIndex,
      approvedCopy,
    } = imageInput;
    const approvedCopyInstruction = editInstruction
      ? ""
      : buildApprovedCopyInstruction(approvedCopy ?? []);
    const brandContext = await getBrandContext(claims.sub, openai, {
      variationOffset: variationIndex,
      contentFormat: imageFormats[format].contentFormat,
    });
    const downloadedBrandFiles = await downloadBrandFiles(brandContext);
    const brandFiles = editInstruction
      ? { ...downloadedBrandFiles, goodExamples: [], badExamples: [] }
      : {
          ...downloadedBrandFiles,
          goodExamples: putTemplateFirst(
            downloadedBrandFiles.goodExamples,
            brandContext?.variationIndex ?? 0,
          ),
        };
    const writtenPrompt = await writeImagePrompt(
      openai,
      imageInput,
      brandContext,
      brandFiles,
      approvedCopyInstruction,
    );

    if (!writtenPrompt) {
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
        ? removeBrandName(writtenPrompt, brandContext.brandName)
        : writtenPrompt,
      buildImageGuardrails(
        brandContext,
        brandFiles.goodExamples.length,
        Boolean(referenceImage),
        format,
        editInstruction,
      ),
      approvedCopyInstruction,
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
      ? await applyLogo(generatedImage, brandContext.logos).catch((error) => {
          console.error("Logo overlay failed", error);
          return generatedImage;
        })
      : generatedImage;
    const savedArtwork =
      editedArtworkId && editInstruction
        ? await appendArtworkVersion({
            userId: claims.sub,
            artworkId: editedArtworkId,
            image: finalImage,
            editInstruction,
          })
        : await saveArtworkDraft({
            userId: claims.sub,
            image: finalImage,
            prompt: editInstruction
              ? `${parsedInput.data.prompt}\n\nAjuste: ${editInstruction}`
              : parsedInput.data.prompt,
            format: imageFormats[format].contentFormat,
          }).then((artworkId) =>
            artworkId ? { artworkId, version: 1 } : null,
          );

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${finalImage.toString("base64")}`,
      artworkId: savedArtwork?.artworkId,
      version: savedArtwork?.version,
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
