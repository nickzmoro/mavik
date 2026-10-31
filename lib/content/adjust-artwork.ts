import type { ArtFormatId } from "../mocks/studio.ts";
import type { GenerateImageInput } from "../validations/image-generation.ts";

export type ArtworkAdjustment = {
  artworkId?: string;
  imageDataUrl?: string;
  prompt: string;
  editInstruction: string;
  formatId: ArtFormatId;
  variationIndex: number;
};

export function toAdjustImageInput({
  artworkId,
  imageDataUrl,
  prompt,
  editInstruction,
  formatId,
  variationIndex,
}: ArtworkAdjustment): GenerateImageInput {
  return {
    prompt,
    editInstruction,
    format: formatId,
    variationIndex,
    ...(artworkId ? { artworkId } : { referenceImage: imageDataUrl }),
  };
}

export const getVersionsToDiscard = (versions: number[], keepVersion: number) =>
  versions.filter((version) => version > keepVersion);
