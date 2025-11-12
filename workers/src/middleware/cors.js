const LOCAL_ORIGINS = new Set([
  "http://localhost:3000",
  "http://localhost:4173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:8787",
]);

const BASE_DOMAIN = "uuidify.io";

const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-requested-with",
  Vary: "Origin",
});

const isAllowedOrigin = (origin) => {
  if (!origin) return false;
  if (LOCAL_ORIGINS.has(origin)) return true;
  try {
    const { hostname, protocol } = new URL(origin);
    if (!["https:", "http:"].includes(protocol)) {
      return false;
    }
    return hostname === BASE_DOMAIN || hostname.endsWith(`.${BASE_DOMAIN}`);
  } catch {
    return false;
  }
};

export function withCors(handler) {
  return async (request, env, ctx) => {
    const origin = request.headers.get("Origin");
    const allowOrigin = origin && isAllowedOrigin(origin) ? origin : null;

    if (request.method === "OPTIONS") {
    const headers = allowOrigin
        ? corsHeaders(allowOrigin)
        : {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, x-requested-with",
          };

      return new Response(null, {
        status: 204,
        headers: {
          ...headers,
          "Cache-Control": "max-age=86400",
        },
      });
    }

    const response = await handler(request, env, ctx);
    if (allowOrigin) {
      Object.entries(corsHeaders(allowOrigin)).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
    if (!response.headers.has("Cache-Control")) {
      response.headers.set("Cache-Control", "no-store, max-age=0");
    }
    return response;
  };
}
