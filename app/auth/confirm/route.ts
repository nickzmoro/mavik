import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { getAppUrl } from "@/lib/app-url";
import { routes } from "@/lib/routes";
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const allowedOtpTypes = new Set<EmailOtpType>(["email", "signup"]);

function isAllowedOtpType(type: string | null): type is EmailOtpType {
  return type !== null && allowedOtpTypes.has(type as EmailOtpType);
}

async function confirmEmail(searchParams: URLSearchParams) {
  const supabase = await createSupabaseServerClient();
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return !error;
  }

  if (tokenHash && isAllowedOtpType(type)) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    return !error;
  }

  return false;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const redirectPath = getSafeRedirectPath(searchParams.get("next"));

  if (await confirmEmail(searchParams)) {
    return NextResponse.redirect(getAppUrl(request, redirectPath));
  }

  const errorUrl = getAppUrl(request, routes.login);
  errorUrl.searchParams.set("erro", "link-invalido");

  return NextResponse.redirect(errorUrl);
}
