/**
 * Health Check Handler
 */

/**
 * Handles health check requests
 * @param {Request} request - HTTP request
 * @param {Object} env - Environment variables
 * @returns {Response} Health check response
 */
export async function handleHealth(request, env = {}) {
  const url = new URL(request.url);
  const wantsJSON = url.searchParams.get("format") === "json";

  if (!wantsJSON) {
    // Preserve plain text compatibility for existing uptime monitors
    return new Response("ok", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const payload = {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "uuidify",
    version: env.BUILD_VERSION || "dev",
    commit: env.GIT_COMMIT || "local",
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
