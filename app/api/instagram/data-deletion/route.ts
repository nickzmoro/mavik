import { NextResponse, type NextRequest } from "next/server";

import { getAppUrl } from "@/lib/app-url";
import { disconnectInstagramByFacebookUser } from "@/lib/instagram/accounts";
import { getInstagramApiConfig } from "@/lib/instagram/config";
import { parseSignedRequest } from "@/lib/instagram/signed-request";

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  const signedRequest = formData?.get("signed_request");
  const payload =
    typeof signedRequest === "string"
      ? parseSignedRequest(signedRequest, getInstagramApiConfig().appSecret)
      : null;

  if (!payload) {
    return NextResponse.json(
      { error: "signed_request inválido" },
      { status: 400 },
    );
  }

  await disconnectInstagramByFacebookUser(payload.userId);

  const confirmationCode = crypto.randomUUID();
  const statusUrl = getAppUrl(request, "/privacidade");
  statusUrl.searchParams.set("exclusao", confirmationCode);

  return NextResponse.json({
    url: statusUrl.toString(),
    confirmation_code: confirmationCode,
  });
}
