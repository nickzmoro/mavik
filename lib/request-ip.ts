import "server-only";

import { headers } from "next/headers";

const UNKNOWN_IP = "unknown";

export async function getClientIp() {
  const headerName = process.env.TRUSTED_IP_HEADER ?? "x-forwarded-for";
  const requestHeaders = await headers();
  const headerValue = requestHeaders.get(headerName);
  const clientIp = headerValue?.split(",")[0]?.trim();

  return clientIp || UNKNOWN_IP;
}
