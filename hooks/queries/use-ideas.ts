import { useQuery } from "@tanstack/react-query";

import { getIdeas } from "@/actions/get-ideas";
import type { IdeasData } from "@/lib/ideas/idea-types";

const GENERATING_REFETCH_MS = 5000;

export const getIdeasQueryKey = () => ["ideas"] as const;

export function useIdeas(initialData: IdeasData) {
  return useQuery({
    queryKey: getIdeasQueryKey(),
    queryFn: () => getIdeas(),
    initialData,
    refetchInterval: (query) =>
      query.state.data?.isGenerating ? GENERATING_REFETCH_MS : false,
  });
}
