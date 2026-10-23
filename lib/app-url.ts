import type { NextRequest } from "next/server";

export function getAppUrl(request: NextRequest, path: string) {
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (!host) {
    return new URL(path, request.url);
  }

  const protocol =
    request.headers.get("x-forwarded-proto") ??
    request.nextUrl.protocol.replace(":", "");

  return new URL(path, `${protocol}://${host}`);
}
