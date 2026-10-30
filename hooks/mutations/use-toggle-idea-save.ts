import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toggleIdeaSave } from "@/actions/toggle-idea-save";
import type { ToggleIdeaSaveInput } from "@/actions/toggle-idea-save/schema";
import { getIdeasQueryKey } from "@/hooks/queries/use-ideas";
import type { IdeasData } from "@/lib/ideas/idea-types";

export const getToggleIdeaSaveMutationKey = () => ["toggle-idea-save"] as const;

export function useToggleIdeaSave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getToggleIdeaSaveMutationKey(),
    mutationFn: async (input: ToggleIdeaSaveInput) => {
      const result = await toggleIdeaSave(input);

      if (!result.isSuccess) {
        throw new Error(result.errorMessage);
      }
    },
    onMutate: async ({ ideaId, isSaved }) => {
      await queryClient.cancelQueries({ queryKey: getIdeasQueryKey() });

      const previousData =
        queryClient.getQueryData<IdeasData>(getIdeasQueryKey());

      queryClient.setQueryData<IdeasData>(getIdeasQueryKey(), (currentData) =>
        currentData
          ? {
              ...currentData,
              savedIdeaIds: isSaved
                ? [...new Set([...currentData.savedIdeaIds, ideaId])]
                : currentData.savedIdeaIds.filter((id) => id !== ideaId),
            }
          : currentData,
      );

      return { previousData };
    },
    onError: (_error, _input, context) =>
      queryClient.setQueryData(getIdeasQueryKey(), context?.previousData),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: getIdeasQueryKey() }),
  });
}
