import { useQuery } from "@tanstack/react-query";

import { getRecentArtworks } from "@/actions/get-recent-artworks";

export const getRecentArtworksQueryKey = () => ["recent-artworks"] as const;

export function useRecentArtworks() {
  return useQuery({
    queryKey: getRecentArtworksQueryKey(),
    queryFn: () => getRecentArtworks(),
  });
}
