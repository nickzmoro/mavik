"use server";

import { authSuccess, type AuthActionResult } from "@/lib/auth-action-result";
import { routes } from "@/lib/routes";
import {
  createSupabaseServerClient,
  setSessionPersistence,
} from "@/lib/supabase/server";

export async function signOut(): Promise<
  AuthActionResult<{ redirectTo: string }>
> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  await setSessionPersistence(true);

  return authSuccess({ redirectTo: routes.login });
}
