/**
 * API URL helpers
 *
 * Browser → /django/* (Route Handler proxies to NEXT_PUBLIC_API_URL/api/*)
 * Server  → full backend URL with Django trailing slash
 */

export function getBackendRoot() {
  return (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
}

/** Proxy prefix — must match src/app/django/[...path]/route.ts */
export const PROXY_PREFIX = "/django";

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

export function toProxyPath(pathname) {
  return pathname.replace(/\/+$/, "") || PROXY_PREFIX;
}

export function getApiBase() {
  if (typeof window !== "undefined") return PROXY_PREFIX;
  return `${getBackendRoot()}/api`;
}

/** Build API URL for fetch */
export function apiPath(segment) {
  const base = getApiBase().replace(/\/$/, "");
  const path = segment.replace(/^\//, "").replace(/\/$/, "");
  const full = `${base}/${path}`;
  if (typeof window !== "undefined") {
    const q = full.includes("?") ? full.slice(full.indexOf("?")) : "";
    const pathname = full.split("?")[0];
    return toProxyPath(pathname) + q;
  }
  return ensureTrailingSlash(full);
}

/** Normalize URL before fetch — browser always uses /django proxy paths */
export function resolveApiUrl(url) {
  const str = String(url);
  const backend = getBackendRoot();

  if (typeof window !== "undefined") {
    try {
      const parsed = new URL(str, window.location.origin);
      let { pathname, search, hash } = parsed;

      // https://kdelight.info/api/login/ → /django/login
      if (!str.startsWith("/") && str.startsWith(backend) && pathname.startsWith("/api")) {
        const sub = pathname.replace(/^\/api\/?/, "");
        return toProxyPath(`${PROXY_PREFIX}/${sub}`) + search + hash;
      }

      // /api/login or /django/login
      if (pathname.startsWith("/api")) {
        const sub = pathname.replace(/^\/api\/?/, "");
        return toProxyPath(`${PROXY_PREFIX}/${sub}`) + search + hash;
      }

      if (pathname.startsWith(PROXY_PREFIX)) {
        return toProxyPath(pathname) + search + hash;
      }
    } catch {
      // fall through
    }
  }

  if (!process.env.NEXT_PUBLIC_API_URL && str.includes("undefined")) {
    throw new Error("NEXT_PUBLIC_API_URL is not set in .env");
  }

  return ensureTrailingSlash(str);
}
