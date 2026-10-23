import "server-only";

import { createSupabaseServerClient } from "./server";

export async function getCurrentUserClaims() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();

  return data?.claims ?? null;
}
