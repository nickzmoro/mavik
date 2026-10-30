import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { getAppUrl } from "@/lib/app-url";
import { saveInstagramConnection } from "@/lib/instagram/accounts";
import {
  getInstagramApiConfig,
  getOAuthStateSecret,
} from "@/lib/instagram/config";
import {
  InstagramApiError,
  debugToken,
  exchangeCodeForToken,
  exchangeForLongLivedToken,
  getInstagramPages,
} from "@/lib/instagram/instagram-api";
import {
  OAUTH_STATE_COOKIE,
  verifyOAuthState,
} from "@/lib/instagram/oauth-state";
import { getCurrentUserId, getOwnedStore } from "@/lib/onboarding/store-access";
import {
  BRAND_TAB_PARAM,
  INSTAGRAM_RESULT_PARAM,
  routes,
  type InstagramConnectResult,
} from "@/lib/routes";

function redirectToConnections(
  request: NextRequest,
  result: InstagramConnectResult,
) {
  const url = getAppUrl(request, routes.brand);
  url.search = new URLSearchParams({
    [BRAND_TAB_PARAM]: "conexoes",
    [INSTAGRAM_RESULT_PARAM]: result,
  }).toString();

  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const cookieStore = await cookies();
  const cookieState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;

  cookieStore.delete({
    name: OAUTH_STATE_COOKIE,
    path: "/api/instagram/callback",
  });

  if (searchParams.get("error")) {
    return redirectToConnections(request, "negado");
  }

  const userId = await getCurrentUserId();
  const code = searchParams.get("code");

  if (!userId || !code) {
    return redirectToConnections(request, "erro");
  }

  const verifiedState = verifyOAuthState({
    state: searchParams.get("state"),
    cookieState,
    userId,
    secret: getOAuthStateSecret(),
  });
  const store = await getOwnedStore(userId);

  if (!verifiedState || verifiedState.storeId !== store?.id) {
    return redirectToConnections(request, "erro");
  }

  try {
    const config = getInstagramApiConfig();
    const userToken = await exchangeForLongLivedToken(
      config,
      await exchangeCodeForToken(config, code),
    );
    const [page] = await getInstagramPages(config, userToken);

    if (!page) {
      return redirectToConnections(request, "sem_conta");
    }

    const [userTokenInfo, pageTokenInfo] = await Promise.all([
      debugToken(config, userToken),
      debugToken(config, page.pageAccessToken),
    ]);

    await saveInstagramConnection({
      storeId: store.id,
      userId,
      page,
      facebookUserId: userTokenInfo.facebookUserId,
      scopes: userTokenInfo.scopes,
      expiresAt: pageTokenInfo.expiresAt,
    });
  } catch (error) {
    console.error(
      "[instagram] falha ao conectar conta",
      error instanceof InstagramApiError
        ? { status: error.status, code: error.code }
        : error instanceof Error
          ? error.name
          : "erro desconhecido",
    );
    return redirectToConnections(request, "erro");
  }

  return redirectToConnections(request, "conectado");
}
