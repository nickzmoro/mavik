import { z } from "zod";

export const connectInstagramSchema = z.object({});

export type ConnectInstagramInput = z.infer<typeof connectInstagramSchema>;
