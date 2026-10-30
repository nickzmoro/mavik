import assert from "node:assert/strict";
import { test } from "node:test";

import {
  InstagramApiError,
  PublishingLimitError,
  buildAuthorizeUrl,
  debugToken,
  exchangeForLongLivedToken,
  getEffectiveExpiry,
  getInstagramPages,
  publishImage,
} from "./instagram-api.ts";
import {
  OAUTH_STATE_TTL_MS,
  createOAuthState,
  verifyOAuthState,
} from "./oauth-state.ts";
import { isAuthorizedCronRequest } from "./cron-auth.ts";
import { parseSignedRequest } from "./signed-request.ts";
import { decryptToken, encryptToken } from "./token-crypto.ts";

const secret = "segredo-de-teste";
const now = Date.UTC(2026, 9, 29, 12);
const day = 24 * 60 * 60 * 1000;

const createState = () =>
  createOAuthState({ userId: "user-1", storeId: "store-1", secret, now });

test("verifyOAuthState aceita o state igual ao cookie, assinado e no prazo", () => {
  const state = createState();

  assert.deepEqual(
    verifyOAuthState({
      state,
      cookieState: state,
      userId: "user-1",
      secret,
      now,
    }),
    { storeId: "store-1" },
  );
});

test("verifyOAuthState recusa state diferente do cookie, adulterado, expirado ou de outro usuário", () => {
  const state = createState();
  const [payload] = state.split(".");
  const forged = `${Buffer.from(
    JSON.stringify({
      nonce: "x",
      userId: "user-1",
      storeId: "store-2",
      expiresAt: now + 1000,
    }),
  ).toString("base64url")}.${state.split(".")[1]}`;
  const verify = (overrides: Partial<Parameters<typeof verifyOAuthState>[0]>) =>
    verifyOAuthState({
      state,
      cookieState: state,
      userId: "user-1",
      secret,
      now,
      ...overrides,
    });

  assert.equal(verify({ cookieState: undefined }), null);
  assert.equal(verify({ state: null }), null);
  assert.equal(verify({ cookieState: createState() }), null);
  assert.equal(verify({ state: forged, cookieState: forged }), null);
  assert.equal(
    verify({ state: `${payload}.`, cookieState: `${payload}.` }),
    null,
  );
  assert.equal(verify({ secret: "outro-segredo" }), null);
  assert.equal(verify({ userId: "user-2" }), null);
  assert.equal(verify({ now: now + OAUTH_STATE_TTL_MS }), null);
});

test("encryptToken e decryptToken fazem ida e volta e detectam adulteração", () => {
  const key = Buffer.alloc(32, 7).toString("base64");
  const encrypted = encryptToken("IGQV-token-secreto", key);

  assert.ok(!encrypted.includes("IGQV"));
  assert.notEqual(encrypted, encryptToken("IGQV-token-secreto", key));
  assert.equal(decryptToken(encrypted, key), "IGQV-token-secreto");

  const [version, iv, tag, data] = encrypted.split(":");
  const tampered = [version, iv, tag, `A${data.slice(1)}`].join(":");
  assert.throws(() => decryptToken(tampered, key));
  assert.throws(() =>
    decryptToken(encrypted, Buffer.alloc(32, 8).toString("base64")),
  );
  assert.throws(() => encryptToken("x", Buffer.alloc(16).toString("base64")));
});

const apiConfig = {
  appId: "app-id",
  appSecret: "app-secret",
  redirectUri: "https://mavik.test/api/instagram/callback",
  graphVersion: "v26.0",
};

const fakeFetchReturning = (body: unknown, status = 200) => {
  const requestedUrls: URL[] = [];
  const fakeFetch = (async (url: URL) => {
    requestedUrls.push(url);
    return Response.json(body, { status });
  }) as typeof fetch;

  return { requestedUrls, fakeFetch };
};

test("buildAuthorizeUrl usa config_id quando existe e scope quando não", () => {
  const withScope = buildAuthorizeUrl(apiConfig, ["instagram_basic"], "st");
  const withConfig = buildAuthorizeUrl(
    { ...apiConfig, loginConfigId: "cfg-1" },
    ["instagram_basic"],
    "st",
  );

  assert.equal(
    withScope.origin + withScope.pathname,
    "https://www.facebook.com/v26.0/dialog/oauth",
  );
  assert.equal(withScope.searchParams.get("scope"), "instagram_basic");
  assert.equal(withScope.searchParams.get("config_id"), null);
  assert.equal(withConfig.searchParams.get("config_id"), "cfg-1");
  assert.equal(withConfig.searchParams.get("scope"), null);
  assert.equal(withConfig.searchParams.get("state"), "st");
});

test("exchangeForLongLivedToken usa fb_exchange_token", async () => {
  const { requestedUrls, fakeFetch } = fakeFetchReturning({
    access_token: "longo",
    token_type: "bearer",
    expires_in: 5183944,
  });

  assert.equal(
    await exchangeForLongLivedToken(
      { ...apiConfig, fetch: fakeFetch },
      "curto",
    ),
    "longo",
  );
  assert.equal(requestedUrls[0].pathname, "/v26.0/oauth/access_token");
  assert.equal(
    requestedUrls[0].searchParams.get("grant_type"),
    "fb_exchange_token",
  );
  assert.equal(requestedUrls[0].searchParams.get("fb_exchange_token"), "curto");
});

test("getInstagramPages devolve só páginas com Instagram profissional", async () => {
  const { fakeFetch } = fakeFetchReturning({
    data: [
      { id: "page-sem-ig", access_token: "t1" },
      {
        id: "page-1",
        access_token: "token-da-pagina",
        instagram_business_account: { id: "17841", username: "padaria" },
      },
    ],
  });

  assert.deepEqual(
    await getInstagramPages({ ...apiConfig, fetch: fakeFetch }, "longo"),
    [
      {
        pageId: "page-1",
        pageAccessToken: "token-da-pagina",
        igUserId: "17841",
        username: "padaria",
      },
    ],
  );
});

test("debugToken usa a menor data entre expiração do token e do acesso a dados", async () => {
  const tokenExpiry = Math.floor(now / 1000) + 60 * 86400;
  const dataExpiry = Math.floor(now / 1000) + 90 * 86400;
  const { requestedUrls, fakeFetch } = fakeFetchReturning({
    data: {
      is_valid: true,
      user_id: "fb-user",
      expires_at: tokenExpiry,
      data_access_expires_at: dataExpiry,
      scopes: ["instagram_basic"],
    },
  });

  const info = await debugToken({ ...apiConfig, fetch: fakeFetch }, "x");

  assert.equal(
    requestedUrls[0].searchParams.get("access_token"),
    "app-id|app-secret",
  );
  assert.deepEqual(info, {
    isValid: true,
    facebookUserId: "fb-user",
    scopes: ["instagram_basic"],
    expiresAt: new Date(tokenExpiry * 1000),
  });
});

test("getEffectiveExpiry trata token de página sem expiração", () => {
  const dataExpiry = new Date(now + 90 * day);

  assert.equal(getEffectiveExpiry(null, null), null);
  assert.deepEqual(getEffectiveExpiry(null, dataExpiry), dataExpiry);
});

test("erro 190 da Graph API vira token inválido sem vazar o token", async () => {
  const { fakeFetch } = fakeFetchReturning(
    { error: { message: "Error validating access token", code: 190 } },
    400,
  );

  await assert.rejects(
    getInstagramPages({ ...apiConfig, fetch: fakeFetch }, "token-secreto"),
    (error: unknown) =>
      error instanceof InstagramApiError &&
      error.isInvalidToken &&
      !error.message.includes("token-secreto"),
  );
});

test("parseSignedRequest valida a assinatura HMAC da Meta", async () => {
  const { createHmac } = await import("node:crypto");
  const payload = Buffer.from(
    JSON.stringify({ algorithm: "HMAC-SHA256", user_id: "17841" }),
  ).toString("base64url");
  const signature = createHmac("sha256", "app-secret")
    .update(payload)
    .digest("base64url");

  assert.deepEqual(
    parseSignedRequest(`${signature}.${payload}`, "app-secret"),
    {
      userId: "17841",
    },
  );
  assert.equal(parseSignedRequest(`${signature}.${payload}`, "outro"), null);
  assert.equal(parseSignedRequest("lixo", "app-secret"), null);
});

test("isAuthorizedCronRequest só aceita o Bearer exato", () => {
  assert.equal(isAuthorizedCronRequest("Bearer s3gredo", "s3gredo"), true);
  assert.equal(isAuthorizedCronRequest("Bearer errado", "s3gredo"), false);
  assert.equal(isAuthorizedCronRequest(null, "s3gredo"), false);
});

const fakeGraph = (statusCodes: string[], quota = { used: 0, total: 100 }) => {
  const calls: { path: string; body: URLSearchParams | null }[] = [];
  const fakeFetch = (async (url: URL, init?: RequestInit) => {
    const path = url.pathname.replace("/v26.0", "");
    const body = (init?.body as URLSearchParams | undefined) ?? null;
    calls.push({ path, body });

    if (path.endsWith("/content_publishing_limit")) {
      return Response.json({
        data: [
          { quota_usage: quota.used, config: { quota_total: quota.total } },
        ],
      });
    }

    if (path === "/ig-1/media") {
      return Response.json({ id: "container-1" });
    }

    if (path === "/container-1") {
      return Response.json({ status_code: statusCodes.shift() });
    }

    if (path === "/ig-1/media_publish") {
      return Response.json({ id: "media-1" });
    }

    return Response.json({ permalink: "https://instagram.com/p/abc" });
  }) as typeof fetch;

  return { calls, fakeFetch };
};

const media = {
  igUserId: "ig-1",
  accessToken: "token-pagina",
  imageUrl: "https://storage.test/arte.jpg",
  caption: "Legenda do post",
  isStory: false,
  isAiGenerated: true,
};
const noWait = { wait: async () => {} };

test("publishImage espera o container ficar FINISHED antes de publicar", async () => {
  const { calls, fakeFetch } = fakeGraph(["IN_PROGRESS", "FINISHED"]);

  const published = await publishImage(
    { ...apiConfig, fetch: fakeFetch },
    media,
    noWait,
  );

  assert.deepEqual(published, {
    mediaId: "media-1",
    permalink: "https://instagram.com/p/abc",
  });
  assert.deepEqual(
    calls.map(({ path }) => path),
    [
      "/ig-1/content_publishing_limit",
      "/ig-1/media",
      "/container-1",
      "/container-1",
      "/ig-1/media_publish",
      "/media-1",
    ],
  );
  const containerBody = calls[1].body;
  assert.equal(containerBody?.get("caption"), "Legenda do post");
  assert.equal(containerBody?.get("is_ai_generated"), "true");
  assert.equal(calls[4].body?.get("creation_id"), "container-1");
});

test("publishImage manda story sem legenda", async () => {
  const { calls, fakeFetch } = fakeGraph(["FINISHED"]);

  await publishImage(
    { ...apiConfig, fetch: fakeFetch },
    { ...media, isStory: true, isAiGenerated: false },
    noWait,
  );

  const containerBody = calls[1].body;
  assert.equal(containerBody?.get("media_type"), "STORIES");
  assert.equal(containerBody?.has("caption"), false);
  assert.equal(containerBody?.has("is_ai_generated"), false);
});

test("publishImage não publica com container em erro, demorado ou sem cota", async () => {
  const failing = fakeGraph(["ERROR"]);
  await assert.rejects(
    publishImage({ ...apiConfig, fetch: failing.fakeFetch }, media, noWait),
    InstagramApiError,
  );

  const slow = fakeGraph(["IN_PROGRESS", "IN_PROGRESS"]);
  await assert.rejects(
    publishImage({ ...apiConfig, fetch: slow.fakeFetch }, media, {
      ...noWait,
      maxPolls: 2,
    }),
    InstagramApiError,
  );

  const limited = fakeGraph([], { used: 100, total: 100 });
  await assert.rejects(
    publishImage({ ...apiConfig, fetch: limited.fakeFetch }, media, noWait),
    PublishingLimitError,
  );

  for (const { calls } of [failing, slow, limited]) {
    assert.equal(
      calls.some(({ path }) => path.endsWith("/media_publish")),
      false,
    );
  }
});
