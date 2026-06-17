/**
 * All API calls go directly to NEXT_PUBLIC_API_URL (Django REST API).
 * Example: https://kdelight.info/api/login/
 */

export function getBackendRoot() {
  return (process.env.NEXT_PUBLIC_API_URL ?? "https://kdelight.info").replace(/\/$/, "");
}

export function getApiBase() {
  return `${getBackendRoot()}/api`;
}

/** Django APPEND_SLASH */
export function ensureTrailingSlash(url) {
  const [beforeHash, hash] = url.split("#");
  const [pathname, query] = beforeHash.split("?");
  if (!pathname.endsWith("/")) {
    const q = query ? `?${query}` : "";
    const h = hash ? `#${hash}` : "";
    return `${pathname}/${q}${h}`;
  }
  return url;
}

/** Build full API URL, e.g. apiPath("login") → https://kdelight.info/api/login/ */
export function apiPath(segment) {
  const base = getApiBase().replace(/\/$/, "");
  const path = segment.replace(/^\//, "").replace(/\/$/, "");
  const full = `${base}/${path}`;
  const q = full.includes("?") ? full.slice(full.indexOf("?")) : "";
  const pathname = full.split("?")[0];
  return ensureTrailingSlash(pathname) + q;
}

/** Normalize any API URL to the full backend address */
export function resolveApiUrl(url) {
  const str = String(url);
  const backend = getBackendRoot();

  if (!process.env.NEXT_PUBLIC_API_URL && str.includes("undefined")) {
    throw new Error("NEXT_PUBLIC_API_URL is not set in .env");
  }

  try {
    const origin = typeof window !== "undefined" ? window.location.origin : backend;
    const parsed = new URL(str, origin);
    const { pathname, search, hash } = parsed;

    if (pathname.startsWith("/api") || str.startsWith(backend)) {
      const apiPathname = pathname.startsWith("/api") ? pathname : parsed.pathname;
      return ensureTrailingSlash(`${backend}${apiPathname}`) + search + hash;
    }
  } catch {
    // fall through
  }

  return ensureTrailingSlash(str);
}
