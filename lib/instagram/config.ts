import "server-only";

import { getRequiredEnv } from "@/lib/get-required-env";

import type { InstagramApiConfig } from "./instagram-api";

export const INSTAGRAM_SCOPES = [
  "instagram_basic",
  "instagram_content_publish",
  "pages_show_list",
  "pages_read_engagement",
  "business_management",
] as const;

export const getInstagramApiConfig = (): InstagramApiConfig => ({
  appId: getRequiredEnv("FACEBOOK_APP_ID", process.env.FACEBOOK_APP_ID),
  appSecret: getRequiredEnv(
    "FACEBOOK_APP_SECRET",
    process.env.FACEBOOK_APP_SECRET,
  ),
  redirectUri: getRequiredEnv(
    "INSTAGRAM_REDIRECT_URI",
    process.env.INSTAGRAM_REDIRECT_URI,
  ),
  graphVersion: process.env.GRAPH_API_VERSION ?? "v26.0",
  loginConfigId: process.env.FACEBOOK_LOGIN_CONFIG_ID || undefined,
});

export const getTokenKey = () =>
  getRequiredEnv("INSTAGRAM_TOKEN_KEY", process.env.INSTAGRAM_TOKEN_KEY);

export const getOAuthStateSecret = () =>
  getRequiredEnv("OAUTH_STATE_SECRET", process.env.OAUTH_STATE_SECRET);

export const getCronSecret = () =>
  getRequiredEnv("CRON_SECRET", process.env.CRON_SECRET);
