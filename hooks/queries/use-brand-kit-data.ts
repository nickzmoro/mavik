import { useQuery } from "@tanstack/react-query";

import { getBrandKit } from "@/actions/get-brand-kit";
import type { BrandKitData } from "@/lib/brand/brand-kit-data";

export const getBrandKitDataQueryKey = () => ["brand-kit-data"] as const;

export function useBrandKitData(initialData?: BrandKitData) {
  return useQuery({
    queryKey: getBrandKitDataQueryKey(),
    queryFn: () => getBrandKit(),
    initialData,
  });
}
