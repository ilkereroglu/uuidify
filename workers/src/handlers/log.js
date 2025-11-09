/**
 * Log Handler
 * Manual log write endpoint
 */

/**
 * Handles log write requests
 * @param {Request} request - HTTP request
 * @param {Object} env - Environment variables
 * @returns {Response} Log save response
 */
export async function handleLog(request, env) {
  if (!env.LOG_BUCKET) {
    return new Response(JSON.stringify({ error: "R2 bucket not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.text();
    const now = new Date().toISOString();

    await env.LOG_BUCKET.put(`log-${now}.json`, body, {
      httpMetadata: { contentType: "application/json" },
    });

    return new Response("Log saved", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    console.error("Log write failed:", err);
    return new Response(JSON.stringify({ error: "Failed to save log" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

