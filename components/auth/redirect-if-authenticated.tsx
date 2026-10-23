import { redirect } from "next/navigation";

import { routes } from "@/lib/routes";
import { getCurrentUserClaims } from "@/lib/supabase/get-current-user-claims";

export async function RedirectIfAuthenticated() {
  const claims = await getCurrentUserClaims();

  if (claims) {
    redirect(routes.authenticatedHome);
  }

  return null;
}
