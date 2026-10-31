import OpenAI, { APIError, toFile } from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";

import { IMAGE_MODEL, IMAGE_PROMPT_MODEL } from "@/lib/ai/models";
import { findArtFormat } from "@/lib/art-options";
import { applyLogo, hideLogoArea } from "@/lib/brand/apply-logo";
import { getBrandContext } from "@/lib/brand/get-brand-context";
import {
  carouselSlideCopySchema,
  MAX_CAROUSEL_SLIDES,
  MIN_CAROUSEL_SLIDES,
} from "@/lib/carousel/carousel-copy";
import { buildSlidePrompt } from "@/lib/carousel/slide-prompt";
import {
  getCarouselCover,
  getSlideImage,
  saveCarouselStyle,
  upsertSlide,
} from "@/lib/content/artwork-slides";
import { fitToFormat } from "@/lib/images/fit-to-format";
import {
  formatRetryAfter,
  getBlockedRemainingMs,
  registerAttempt,
  type RateLimitRule,
} from "@/lib/rate-limit";
import { getCurrentUserClaims } from "@/lib/supabase/get-current-user-claims";

export const maxDuration = 180;

const HOUR_MS = 60 * 60 * 1000;
const carouselSlideRateLimitRule: RateLimitRule = {
  limit: 40,
  windowMs: HOUR_MS,
  blockMs: HOUR_MS,
  maxBlockMs: 24 * HOUR_MS,
};

const carouselSlideSchema = z
  .object({
    artworkId: z.uuid(),
    position: z.number().int().min(1).max(MAX_CAROUSEL_SLIDES),
    slideCount: z
      .number()
      .int()
      .min(MIN_CAROUSEL_SLIDES)
      .max(MAX_CAROUSEL_SLIDES),
    slide: carouselSlideCopySchema,
    editInstruction: z.string().trim().min(1).max(300).optional(),
  })
  .refine((input) => input.position > 1 || input.editInstruction, {
    error: "A capa só pode ser ajustada com um pedido de ajuste.",
    path: ["position"],
  })
  .refine((input) => input.position <= input.slideCount, {
    error: "Esse slide não existe neste carrossel.",
    path: ["position"],
  });

const errorMessages = {
  invalidRequest: "Confira os dados do slide e tente de novo.",
  unauthorized: "Sua sessão expirou. Entre de novo para gerar artes.",
  notConfigured:
    "A geração de artes ainda não está configurada. Fale com o suporte.",
  coverNotFound: "Não encontramos a capa deste carrossel. Gere a capa de novo.",
  slideNotFound: "Não encontramos esse slide. Gere o slide de novo.",
  tooManyAttempts: (retryAfter: string) =>
    `Você gerou muitos slides seguidos. Tente de novo em ${retryAfter}.`,
  failed: "Não conseguimos gerar o slide desta vez. Tente de novo.",
};

const STYLE_WRITER_INSTRUCTIONS =
  "You describe the visual style of an Instagram carousel cover so other slides can match it exactly. Describe, in one compact English paragraph: the background (color HEX, texture, shapes), the typography (style, weight, case, size hierarchy and color HEX of headline and body), the color palette with HEX values, where the text block sits, margins, the footer or bottom bar, and the illustration or photo style. Do not describe the specific words, the product or any logo. Output only the paragraph.";

const errorResponse = (errorMessage: string, status: number) =>
  NextResponse.json({ errorMessage }, { status });

async function describeCoverStyle(openai: OpenAI, cover: Buffer) {
  const completion = await openai.chat.completions.create({
    model: IMAGE_PROMPT_MODEL,
    temperature: 0.1,
    messages: [
      { role: "system", content: STYLE_WRITER_INSTRUCTIONS },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${cover.toString("base64")}`,
              detail: "high",
            },
          },
        ],
      },
    ],
  });

  return completion.choices[0]?.message.content?.trim() ?? "";
}

const toPngFile = async (image: Buffer, name: string) =>
  toFile(await hideLogoArea(image), name, { type: "image/png" });

export async function POST(request: Request) {
  const claims = await getCurrentUserClaims();

  if (!claims) {
    return errorResponse(errorMessages.unauthorized, 401);
  }

  const parsedInput = carouselSlideSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsedInput.success) {
    return errorResponse(errorMessages.invalidRequest, 400);
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return errorResponse(errorMessages.notConfigured, 500);
  }

  const rateLimitKey = `generate-carousel-slide:user:${claims.sub}`;
  const blockedRemainingMs = await getBlockedRemainingMs([rateLimitKey]);

  if (blockedRemainingMs > 0) {
    return errorResponse(
      errorMessages.tooManyAttempts(formatRetryAfter(blockedRemainingMs)),
      429,
    );
  }

  await registerAttempt(rateLimitKey, carouselSlideRateLimitRule);

  const { artworkId, position, slideCount, slide, editInstruction } =
    parsedInput.data;
  const openai = new OpenAI({ apiKey });

  try {
    const cover = await getCarouselCover(claims.sub, artworkId);

    if (!cover) {
      return errorResponse(errorMessages.coverNotFound, 404);
    }

    const currentSlide = editInstruction
      ? await getSlideImage(artworkId, position)
      : null;

    if (editInstruction && !currentSlide) {
      return errorResponse(errorMessages.slideNotFound, 404);
    }

    const style =
      cover.style || (await describeCoverStyle(openai, cover.image));

    if (!cover.style && style) {
      await saveCarouselStyle(cover.versionId, style);
    }

    const brandContext = await getBrandContext(claims.sub, openai);
    const prompt = [
      buildSlidePrompt({ style, slide, position, slideCount }),
      currentSlide &&
        `Reference image 2 is the current version of this slide. Recreate it faithfully, applying only this change: ${editInstruction}`,
      "Never draw any logo, symbol or brand name: the official logo is placed afterwards in the bottom-right corner, so keep that corner clean.",
    ]
      .filter(Boolean)
      .join("\n\n");
    const { generationSize } = findArtFormat("carousel");
    const response = await openai.images.edit({
      model: IMAGE_MODEL,
      prompt,
      size: `${generationSize.width}x${generationSize.height}`,
      quality: "high",
      output_format: "png",
      image: [
        await toPngFile(cover.image, "capa.png"),
        ...(currentSlide
          ? [await toPngFile(currentSlide, "slide-atual.png")]
          : []),
      ],
    });
    const imageBase64 = response.data?.[0]?.b64_json;

    if (!imageBase64) {
      return errorResponse(errorMessages.failed, 502);
    }

    const generatedImage = Buffer.from(imageBase64, "base64");
    const imageWithLogo = brandContext
      ? await applyLogo(generatedImage, brandContext.logos, "carousel").catch(
          () => generatedImage,
        )
      : generatedImage;
    const finalImage = await fitToFormat(imageWithLogo, "carousel");
    const savedSlide = await upsertSlide({
      storeId: cover.storeId,
      artworkId,
      position,
      image: finalImage,
      copy: slide,
    });

    if (!savedSlide) {
      return errorResponse(errorMessages.failed, 502);
    }

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${finalImage.toString("base64")}`,
      position: savedSlide.position,
      version: savedSlide.version,
    });
  } catch (error) {
    console.error(
      "[carrossel] falha ao gerar slide",
      error instanceof APIError ? error.status : error,
    );
    return errorResponse(errorMessages.failed, 502);
  }
}
