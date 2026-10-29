import type { EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { getAppUrl } from "@/lib/app-url";
import { getPostAuthRoute } from "@/lib/onboarding/get-post-auth-route";
import { routes } from "@/lib/routes";
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import {
  PASSWORD_RECOVERY_COOKIE,
  passwordRecoveryCookieOptions,
} from "@/lib/supabase/password-recovery-cookie";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const allowedOtpTypes = new Set<EmailOtpType>(["email", "signup", "recovery"]);

function isAllowedOtpType(type: string | null): type is EmailOtpType {
  return type !== null && allowedOtpTypes.has(type as EmailOtpType);
}

async function verifyEmailLink(searchParams: URLSearchParams) {
  const supabase = await createSupabaseServerClient();
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return { isVerified: !error, supabase };
  }

  if (tokenHash && isAllowedOtpType(type)) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    return { isVerified: !error, supabase };
  }

  return { isVerified: false, supabase };
}

function redirectToPath(request: NextRequest, path: string) {
  return NextResponse.redirect(getAppUrl(request, path));
}

function redirectWithLinkError(request: NextRequest, path: string) {
  const errorUrl = getAppUrl(request, path);
  errorUrl.searchParams.set("erro", "link-invalido");

  return NextResponse.redirect(errorUrl);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const redirectPath = getSafeRedirectPath(searchParams.get("next"));
  const isPasswordRecovery =
    searchParams.get("type") === "recovery" ||
    redirectPath === routes.resetPassword;

  const { isVerified, supabase } = await verifyEmailLink(searchParams);

  if (isVerified && isPasswordRecovery) {
    const cookieStore = await cookies();
    cookieStore.set(PASSWORD_RECOVERY_COOKIE, "1", passwordRecoveryCookieOptions);

    return redirectToPath(request, routes.resetPassword);
  }

  if (isVerified) {
    const { data: claimsData } = await supabase.auth.getClaims();

    return redirectToPath(
      request,
      searchParams.get("next")
        ? redirectPath
        : await getPostAuthRoute(claimsData?.claims.sub),
    );
  }

  if (isPasswordRecovery) {
    return redirectWithLinkError(request, routes.recoverPassword);
  }

  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    return redirectToPath(request, routes.authenticatedHome);
  }

  return redirectWithLinkError(request, routes.login);
}
