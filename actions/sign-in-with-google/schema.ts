import { z } from "zod";

export const signInWithGoogleSchema = z.object({
  redirectTo: z.string().max(2048).optional(),
});

export type SignInWithGoogleInput = z.infer<typeof signInWithGoogleSchema>;
