import { routes } from "./routes";

const internalOrigin = "http://mavik.internal";

export function getSafeRedirectPath(
  path: unknown,
  fallback: string = routes.authenticatedHome,
) {
  if (typeof path !== "string" || !path.startsWith("/")) {
    return fallback;
  }

  if (path.startsWith("//") || path.startsWith("/\\")) {
    return fallback;
  }

  try {
    const url = new URL(path, internalOrigin);

    if (url.origin !== internalOrigin) {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
