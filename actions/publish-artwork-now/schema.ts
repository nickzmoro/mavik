import { z } from "zod";

import {
  approvedArtworkSchema,
  hasArtwork,
  hasCaptionWhenPost,
} from "@/actions/schedule-artwork/schema";

export const publishArtworkNowSchema = approvedArtworkSchema
  .refine(hasArtwork.check, hasArtwork.options)
  .refine(hasCaptionWhenPost.check, hasCaptionWhenPost.options);

export type PublishArtworkNowInput = z.infer<typeof publishArtworkNowSchema>;
