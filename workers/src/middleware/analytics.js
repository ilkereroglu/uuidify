/**
 * Analytics Middleware
 * Logs request metrics to Cloudflare Analytics Engine
 */

/**
 * Wraps a handler with analytics logging
 * @param {Function} handler - Request handler function
 * @param {Object} env - Environment variables
 * @returns {Function} Wrapped handler
 */
export function withAnalytics(handler, env) {
  return async (request, envContext, ctx) => {
    const start = Date.now();
    try {
      const response = await handler(request, envContext, ctx);
      return response;
    } finally {
      try {
        const latency = Date.now() - start;
        const ip = request.headers.get("cf-connecting-ip") || "unknown";
        const pathName = new URL(request.url).pathname;

        if (env.UUIDIFY_ANALYTICS) {
          env.UUIDIFY_ANALYTICS.writeDataPoint({
            blobs: [pathName, ip],
            doubles: [latency],
            indexes: [Date.now()],
          });
        }
      } catch (logErr) {
        console.error("Analytics logging failed:", logErr);
      }
    }
  };
}

