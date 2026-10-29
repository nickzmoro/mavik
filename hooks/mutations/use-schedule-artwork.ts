import { useMutation } from "@tanstack/react-query";

import { scheduleArtwork } from "@/actions/schedule-artwork";

export const getScheduleArtworkMutationKey = () =>
  ["schedule-artwork"] as const;

export function useScheduleArtwork() {
  return useMutation({
    mutationKey: getScheduleArtworkMutationKey(),
    mutationFn: scheduleArtwork,
  });
}
