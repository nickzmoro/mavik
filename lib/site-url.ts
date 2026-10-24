import { routes } from "./routes";

function getSiteUrlWithNext(path: string, nextPath: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const redirectUrl = new URL(path, siteUrl);
  redirectUrl.searchParams.set("next", nextPath);

  return redirectUrl.toString();
}

export function getAuthRedirectUrl(nextPath: string) {
  return getSiteUrlWithNext(routes.authConfirm, nextPath);
}

export function getOAuthCallbackUrl(nextPath: string) {
  return getSiteUrlWithNext(routes.authCallback, nextPath);
}
