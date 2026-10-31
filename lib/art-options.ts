import { z } from "zod";

import {
  artFormats,
  maxVariationsPerGeneration,
  type ArtFormatId,
} from "./mocks/studio.ts";

export const artFormatIdSchema = z.enum(["square", "portrait", "story"]);

export const artOptionsSchema = z.object({
  formatId: artFormatIdSchema,
  variationCount: z.number().int().min(1).max(maxVariationsPerGeneration),
});

export type ArtOptions = z.infer<typeof artOptionsSchema>;

export const getInitialVariationCount = (remainingArts: number) =>
  Math.max(1, Math.min(maxVariationsPerGeneration, remainingArts));

export const findArtFormat = (formatId?: ArtFormatId) =>
  artFormats.find((artFormat) => artFormat.id === formatId) ?? artFormats[1];

export const formatArtCount = (count: number) =>
  count === 1 ? "1 arte" : `${count} artes`;

export const formatVariationCount = (count: number) =>
  count === 1 ? "1 variação" : `${count} variações`;
