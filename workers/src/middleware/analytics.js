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
    let response;

    try {
      response = await handler(request, envContext, ctx);
      return response;
    } finally {
      const latency = Date.now() - start;
      const url = new URL(request.url);
      const status = response?.status ?? 500;
      const colo = request.cf?.colo || "unknown";

      const logEntry = {
        timestamp: new Date().toISOString(),
        method: request.method,
        path: url.pathname,
        status,
        duration_ms: latency,
        colo,
      };

      const dataset = envContext?.UUIDIFY_ANALYTICS || env?.UUIDIFY_ANALYTICS;
      const logTask = async () => {
        try {
          console.info("[analytics]", JSON.stringify(logEntry));
          if (dataset) {
            await dataset.writeDataPoint({
              blobs: [logEntry.method, logEntry.path, logEntry.colo],
              doubles: [logEntry.status, logEntry.duration_ms],
              indexes: [Date.now()],
            });
          }
        } catch (logErr) {
          console.error("Analytics logging failed:", logErr);
        }
      };

      if (ctx?.waitUntil) {
        ctx.waitUntil(logTask());
      } else {
        logTask();
      }
    }
  };
}
