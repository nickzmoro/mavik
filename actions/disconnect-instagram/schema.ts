import { z } from "zod";

export const disconnectInstagramSchema = z.object({});

export type DisconnectInstagramInput = z.infer<
  typeof disconnectInstagramSchema
>;
