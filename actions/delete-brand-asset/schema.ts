import { z } from "zod";

export const deleteBrandAssetSchema = z.object({
  assetId: z.uuid(),
});

export type DeleteBrandAssetInput = z.infer<typeof deleteBrandAssetSchema>;
