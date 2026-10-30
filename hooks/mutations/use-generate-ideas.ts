import { useMutation, useQueryClient } from "@tanstack/react-query";

import { generateIdeas } from "@/actions/generate-ideas";
import { getIdeasQueryKey } from "@/hooks/queries/use-ideas";

export const getGenerateIdeasMutationKey = () => ["generate-ideas"] as const;

export function useGenerateIdeas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getGenerateIdeasMutationKey(),
    mutationFn: generateIdeas,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: getIdeasQueryKey() }),
  });
}
