export type InstagramApiConfig = {
  appId: string;
  appSecret: string;
  redirectUri: string;
  graphVersion: string;
  loginConfigId?: string;
  fetch?: typeof fetch;
};

export type InstagramPage = {
  pageId: string;
  pageAccessToken: string;
  igUserId: string;
  username: string;
};

export class InstagramApiError extends Error {
  readonly status: number;
  readonly code?: number;

  constructor(message: string, status: number, code?: number) {
    super(message);
    this.name = "InstagramApiError";
    this.status = status;
    this.code = code;
  }

  get isInvalidToken() {
    return this.code === 190;
  }
}

type GraphErrorBody = { error?: { message?: string; code?: number } };

const graphUrl = (
  { graphVersion }: Pick<InstagramApiConfig, "graphVersion">,
  path: string,
  params: Record<string, string>,
) => {
  const url = new URL(`https://graph.facebook.com/${graphVersion}${path}`);
  url.search = new URLSearchParams(params).toString();

  return url;
};

async function requestJson<T>(
  config: Pick<InstagramApiConfig, "fetch">,
  url: URL,
  init?: RequestInit,
): Promise<T> {
  const response = await (config.fetch ?? fetch)(url, init);
  const body = (await response.json().catch(() => ({}))) as T & GraphErrorBody;

  if (!response.ok || body.error) {
    throw new InstagramApiError(
      body.error?.message ?? "Falha na API da Meta",
      response.status,
      body.error?.code,
    );
  }

  return body;
}

const appAccessToken = ({ appId, appSecret }: InstagramApiConfig) =>
  `${appId}|${appSecret}`;

export function buildAuthorizeUrl(
  config: Pick<
    InstagramApiConfig,
    "appId" | "redirectUri" | "graphVersion" | "loginConfigId"
  >,
  scopes: readonly string[],
  state: string,
) {
  const url = new URL(
    `https://www.facebook.com/${config.graphVersion}/dialog/oauth`,
  );
  url.search = new URLSearchParams({
    client_id: config.appId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    state,
    ...(config.loginConfigId
      ? { config_id: config.loginConfigId }
      : { scope: scopes.join(",") }),
  }).toString();

  return url;
}

export async function exchangeCodeForToken(
  config: InstagramApiConfig,
  code: string,
) {
  const { access_token } = await requestJson<{ access_token: string }>(
    config,
    graphUrl(config, "/oauth/access_token", {
      client_id: config.appId,
      client_secret: config.appSecret,
      redirect_uri: config.redirectUri,
      code,
    }),
  );

  return access_token;
}

export async function exchangeForLongLivedToken(
  config: InstagramApiConfig,
  userToken: string,
) {
  const { access_token } = await requestJson<{ access_token: string }>(
    config,
    graphUrl(config, "/oauth/access_token", {
      grant_type: "fb_exchange_token",
      client_id: config.appId,
      client_secret: config.appSecret,
      fb_exchange_token: userToken,
    }),
  );

  return access_token;
}

export async function getInstagramPages(
  config: InstagramApiConfig,
  longLivedUserToken: string,
): Promise<InstagramPage[]> {
  const { data } = await requestJson<{
    data: {
      id: string;
      access_token?: string;
      instagram_business_account?: { id: string; username?: string };
    }[];
  }>(
    config,
    graphUrl(config, "/me/accounts", {
      fields: "id,access_token,instagram_business_account{id,username}",
      access_token: longLivedUserToken,
    }),
  );

  return data.flatMap(
    ({ id, access_token, instagram_business_account: igAccount }) =>
      access_token && igAccount
        ? [
            {
              pageId: id,
              pageAccessToken: access_token,
              igUserId: igAccount.id,
              username: igAccount.username ?? "",
            },
          ]
        : [],
  );
}

export async function debugToken(config: InstagramApiConfig, token: string) {
  const { data } = await requestJson<{
    data: {
      is_valid: boolean;
      user_id?: string;
      expires_at?: number;
      data_access_expires_at?: number;
      scopes?: string[];
    };
  }>(
    config,
    graphUrl(config, "/debug_token", {
      input_token: token,
      access_token: appAccessToken(config),
    }),
  );
  const toDate = (seconds?: number) =>
    seconds ? new Date(seconds * 1000) : null;

  return {
    isValid: data.is_valid,
    facebookUserId: data.user_id ?? null,
    scopes: data.scopes ?? [],
    expiresAt: getEffectiveExpiry(
      toDate(data.expires_at),
      toDate(data.data_access_expires_at),
    ),
  };
}

export function getEffectiveExpiry(
  tokenExpiresAt: Date | null,
  dataAccessExpiresAt: Date | null,
) {
  const dates = [tokenExpiresAt, dataAccessExpiresAt].filter(
    (date): date is Date => date !== null,
  );

  return dates.length > 0
    ? new Date(Math.min(...dates.map((date) => date.getTime())))
    : null;
}

export async function revokeAppPermissions(
  config: InstagramApiConfig,
  facebookUserId: string,
) {
  await requestJson(
    config,
    graphUrl(config, `/${facebookUserId}/permissions`, {
      access_token: appAccessToken(config),
    }),
    { method: "DELETE" },
  );
}

export type MediaToPublish = {
  igUserId: string;
  accessToken: string;
  imageUrl: string;
  caption: string;
  isStory: boolean;
  isAiGenerated: boolean;
};

export type PublishedMedia = { mediaId: string; permalink: string | null };

export class PublishingLimitError extends Error {
  constructor() {
    super("Limite de publicações do Instagram atingido");
    this.name = "PublishingLimitError";
  }
}

const formBody = (params: Record<string, string>) => ({
  method: "POST",
  body: new URLSearchParams(params),
});

export async function getPublishingQuota(
  config: Pick<InstagramApiConfig, "graphVersion" | "fetch">,
  igUserId: string,
  accessToken: string,
) {
  const { data } = await requestJson<{
    data: { quota_usage?: number; config?: { quota_total?: number } }[];
  }>(
    config,
    graphUrl(config, `/${igUserId}/content_publishing_limit`, {
      fields: "quota_usage,config",
      access_token: accessToken,
    }),
  );
  const [quota] = data;

  return {
    used: quota?.quota_usage ?? 0,
    total: quota?.config?.quota_total ?? null,
  };
}

export async function publishImage(
  config: Pick<InstagramApiConfig, "graphVersion" | "fetch">,
  media: MediaToPublish,
  {
    pollIntervalMs = 3000,
    maxPolls = 20,
    wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
  } = {},
): Promise<PublishedMedia> {
  const { igUserId, accessToken } = media;
  const quota = await getPublishingQuota(config, igUserId, accessToken);

  if (quota.total !== null && quota.used >= quota.total) {
    throw new PublishingLimitError();
  }

  const { id: containerId } = await requestJson<{ id: string }>(
    config,
    graphUrl(config, `/${igUserId}/media`, {}),
    formBody({
      image_url: media.imageUrl,
      access_token: accessToken,
      ...(media.isStory
        ? { media_type: "STORIES" }
        : { caption: media.caption }),
      ...(media.isAiGenerated ? { is_ai_generated: "true" } : {}),
    }),
  );

  for (let poll = 0; ; poll++) {
    const { status_code } = await requestJson<{ status_code?: string }>(
      config,
      graphUrl(config, `/${containerId}`, {
        fields: "status_code",
        access_token: accessToken,
      }),
    );

    if (status_code === "FINISHED") {
      break;
    }

    if (status_code === "ERROR" || status_code === "EXPIRED") {
      throw new InstagramApiError(`Container ${status_code}`, 400);
    }

    if (poll + 1 >= maxPolls) {
      throw new InstagramApiError("Container não ficou pronto a tempo", 408);
    }

    await wait(pollIntervalMs);
  }

  const { id: mediaId } = await requestJson<{ id: string }>(
    config,
    graphUrl(config, `/${igUserId}/media_publish`, {}),
    formBody({ creation_id: containerId, access_token: accessToken }),
  );
  const { permalink } = await requestJson<{ permalink?: string }>(
    config,
    graphUrl(config, `/${mediaId}`, {
      fields: "permalink",
      access_token: accessToken,
    }),
  ).catch(() => ({ permalink: undefined }));

  return { mediaId, permalink: permalink ?? null };
}
