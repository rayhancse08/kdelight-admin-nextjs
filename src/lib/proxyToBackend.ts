function getBackendRoot() {
  return (process.env.NEXT_PUBLIC_API_URL ?? "https://kdelight.info").replace(/\/$/, "");
}

export function buildBackendUrl(pathSegments: string[], search: string) {
  const joined = pathSegments.filter(Boolean).join("/");
  const base = joined ? `${getBackendRoot()}/api/${joined}/` : `${getBackendRoot()}/api/`;
  return search ? `${base}?${search}` : base;
}

/** Server-side proxy to Django REST API (works on Vercel — no external rewrites). */
export async function proxyToBackend(req: Request, pathSegments: string[]) {
  const url = new URL(req.url);
  const backendUrl = buildBackendUrl(pathSegments, url.searchParams.toString());

  const headers = new Headers();
  const auth = req.headers.get("authorization");
  if (auth) headers.set("Authorization", auth);

  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "follow",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  try {
    const upstream = await fetch(backendUrl, init);
    const body = await upstream.arrayBuffer();

    const responseHeaders = new Headers();
    const upstreamType = upstream.headers.get("content-type");
    if (upstreamType) responseHeaders.set("Content-Type", upstreamType);

    return new Response(body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("[django proxy]", backendUrl, err);
    return Response.json(
      {
        detail: `Could not reach backend at ${getBackendRoot()}. ${err instanceof Error ? err.message : "Network error"}`,
      },
      { status: 502 },
    );
  }
}
