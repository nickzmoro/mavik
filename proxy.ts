import { NextResponse, type NextRequest } from "next/server";

import { getAppUrl } from "@/lib/app-url";
import { authRoutes, protectedRoutes, routes } from "@/lib/routes";
import { PASSWORD_RECOVERY_COOKIE } from "@/lib/supabase/password-recovery-cookie";
import { updateSession } from "@/lib/supabase/proxy";

function matchesRoute(pathname: string, routeList: readonly string[]) {
  return routeList.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function redirectWithCookies(
  request: NextRequest,
  sessionResponse: NextResponse,
  pathname: string,
  searchParams?: Record<string, string>,
) {
  const url = getAppUrl(request, pathname);
  url.search = new URLSearchParams(searchParams).toString();

  const redirectResponse = NextResponse.redirect(url);
  sessionResponse.cookies
    .getAll()
    .forEach((cookie) => redirectResponse.cookies.set(cookie));

  return redirectResponse;
}

export async function proxy(request: NextRequest) {
  const { response, isAuthenticated } = await updateSession(request);
  const { pathname, search } = request.nextUrl;

  if (matchesRoute(pathname, [routes.resetPassword])) {
    const hasRecoveryToken = request.nextUrl.searchParams.has("token_hash");
    const hasRecoverySession =
      isAuthenticated && request.cookies.has(PASSWORD_RECOVERY_COOKIE);

    if (!hasRecoveryToken && !hasRecoverySession) {
      return redirectWithCookies(request, response, routes.recoverPassword, {
        erro: "link-expirado",
      });
    }

    return response;
  }

  if (!isAuthenticated && matchesRoute(pathname, protectedRoutes)) {
    return redirectWithCookies(request, response, routes.login, {
      next: `${pathname}${search}`,
    });
  }

  if (isAuthenticated && matchesRoute(pathname, authRoutes)) {
    return redirectWithCookies(request, response, routes.authenticatedHome);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|llms.txt|.*\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
