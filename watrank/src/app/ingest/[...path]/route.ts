import { NextRequest } from "next/server";

// Proxies PostHog through watrank.com/ingest so ad blockers don't drop analytics.
const API_HOST = "us.i.posthog.com";
const ASSET_HOST = "us-assets.i.posthog.com";

export const dynamic = "force-dynamic";

async function proxy(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const path = params.path.join("/");
    const host = path.startsWith("static/") ? ASSET_HOST : API_HOST;
    const { search } = new URL(request.url);
    // PostHog's endpoints expect their trailing slash (e.g. /e/), which Next strips from params.
    const trailing = request.nextUrl.pathname.endsWith("/") ? "/" : "";

    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("cookie");
    headers.delete("connection");
    // Keep the visitor's IP so PostHog's geolocation isn't Cloudflare's.
    const ip =
        request.headers.get("cf-connecting-ip") ??
        request.headers.get("x-forwarded-for");
    if (ip) headers.set("x-forwarded-for", ip);

    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    const response = await fetch(
        `https://${host}/${path}${trailing}${search}`,
        {
            method: request.method,
            headers,
            body: hasBody ? await request.arrayBuffer() : undefined,
        }
    );

    // fetch already decoded the body, so drop headers describing the encoded one.
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    return new Response(response.body, {
        status: response.status,
        headers: responseHeaders,
    });
}

export const GET = proxy;
export const POST = proxy;
export const OPTIONS = proxy;
