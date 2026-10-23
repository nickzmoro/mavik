import { routes } from "./routes";

export function getAuthRedirectUrl(nextPath: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const redirectUrl = new URL(routes.authConfirm, siteUrl);
  redirectUrl.searchParams.set("next", nextPath);

  return redirectUrl.toString();
}
