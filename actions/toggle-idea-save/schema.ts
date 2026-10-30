import { z } from "zod";

export const toggleIdeaSaveSchema = z.object({
  ideaId: z.uuid(),
  isSaved: z.boolean(),
});

export type ToggleIdeaSaveInput = z.infer<typeof toggleIdeaSaveSchema>;
