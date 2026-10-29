import "server-only";

import { routes } from "@/lib/routes";

import { getOwnedStore } from "./store-access";

export async function getPostAuthRoute(userId: string | undefined) {
  if (!userId) {
    return routes.authenticatedHome;
  }

  const store = await getOwnedStore(userId);

  return store ? routes.authenticatedHome : routes.onboarding;
}
