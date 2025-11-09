/**
 * Health Check Handler
 */

/**
 * Handles health check requests
 * @param {Request} request - HTTP request
 * @returns {Response} Health check response
 */
export async function handleHealth(request) {
  return new Response("UUIDify Worker running ✅", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

