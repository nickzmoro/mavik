import "server-only";

import { connection } from "next/server";

import { createSupabaseServerClient } from "./server";

export async function getCurrentUserClaims() {
  await connection();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();

  return data?.claims ?? null;
}
