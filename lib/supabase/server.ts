import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { supabasePublishableKey, supabaseUrl } from "./env";
import {
  getAuthCookieOptions,
  secureCookieOptions,
  SESSION_ONLY_COOKIE,
} from "./session-cookies";

type CreateSupabaseServerClientOptions = {
  isSessionOnly?: boolean;
};

export async function createSupabaseServerClient(
  options: CreateSupabaseServerClientOptions = {},
) {
  const cookieStore = await cookies();
  const isSessionOnly =
    options.isSessionOnly ?? cookieStore.has(SESSION_ONLY_COOKIE);

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options: cookieOptions }) =>
            cookieStore.set(
              name,
              value,
              getAuthCookieOptions(value, cookieOptions, isSessionOnly),
            ),
          );
        } catch {}
      },
    },
  });
}

export async function setSessionPersistence(shouldRemember: boolean) {
  const cookieStore = await cookies();

  if (shouldRemember) {
    cookieStore.delete(SESSION_ONLY_COOKIE);
    return;
  }

  cookieStore.set(SESSION_ONLY_COOKIE, "1", secureCookieOptions);
}
