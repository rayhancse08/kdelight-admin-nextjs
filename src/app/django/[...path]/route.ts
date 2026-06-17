import { proxyToBackend } from "@/lib/proxyToBackend";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ path: string[] }> };

async function handle(req: Request, context: RouteContext) {
  const { path } = await context.params;
  return proxyToBackend(req, path);
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const PUT = handle;
export const DELETE = handle;
