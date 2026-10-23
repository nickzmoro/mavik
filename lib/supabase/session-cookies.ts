import type { CookieOptions } from "@supabase/ssr";

export const SESSION_ONLY_COOKIE = "mavik-session-only";

export const secureCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} satisfies CookieOptions;

export function getAuthCookieOptions(
  value: string,
  options: CookieOptions,
  isSessionOnly: boolean,
): CookieOptions {
  const hardenedOptions: CookieOptions = {
    ...options,
    ...secureCookieOptions,
  };

  if (!isSessionOnly || value === "") {
    return hardenedOptions;
  }

  delete hardenedOptions.maxAge;
  delete hardenedOptions.expires;

  return hardenedOptions;
}
