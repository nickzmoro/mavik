import { NextResponse, type NextRequest } from "next/server";

import { getAppUrl } from "@/lib/app-url";
import { getPostAuthRoute } from "@/lib/onboarding/get-post-auth-route";
import { routes } from "@/lib/routes";
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import {
  createSupabaseServerClient,
  setSessionPersistence,
} from "@/lib/supabase/server";

function redirectToLoginWithError(request: NextRequest, errorCode: string) {
  const errorUrl = getAppUrl(request, routes.login);
  errorUrl.searchParams.set("erro", errorCode);

  return NextResponse.redirect(errorUrl);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const providerError = searchParams.get("error");
  const code = searchParams.get("code");

  if (providerError === "access_denied") {
    return redirectToLoginWithError(request, "google-cancelado");
  }

  if (providerError || !code) {
    console.error("[auth] erro no retorno do Google", {
      error: providerError,
      description: searchParams.get("error_description"),
    });

    return redirectToLoginWithError(request, "google-falhou");
  }

  const supabase = await createSupabaseServerClient({ isSessionOnly: false });
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth] erro ao concluir login com Google", {
      code: error.code,
      status: error.status,
      message: error.message,
    });

    return redirectToLoginWithError(request, "google-falhou");
  }

  await setSessionPersistence(true);

  const nextPath = searchParams.get("next");
  const { data: claimsData } = await supabase.auth.getClaims();
  const destination = nextPath
    ? getSafeRedirectPath(nextPath)
    : await getPostAuthRoute(claimsData?.claims.sub);

  return NextResponse.redirect(getAppUrl(request, destination));
}
