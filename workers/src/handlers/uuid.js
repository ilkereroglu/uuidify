/**
 * UUID Generation Handler
 * Generates UUIDs and saves them to R2 storage
 */

import { generateUUID } from '../utils/uuid-generator.js';
import { validateVersion } from '../utils/validator.js';

/**
 * Handles UUID generation requests
 * @param {Request} request - HTTP request
 * @param {Object} env - Environment variables
 * @returns {Response} UUID response
 */
export async function handleUUID(request, env) {
  const url = new URL(request.url);
  const version = validateVersion(url.searchParams.get("version"));
  const uuid = generateUUID(version);

  // Save to R2 if LOG_BUCKET is available
  if (env.LOG_BUCKET) {
    try {
      await env.LOG_BUCKET.put(
        `uuid-${Date.now()}.json`,
        JSON.stringify({
          uuid,
          version,
          ip: request.headers.get("CF-Connecting-IP") || "unknown",
          timestamp: new Date().toISOString(),
        }),
        { httpMetadata: { contentType: "application/json" } }
      );
    } catch (err) {
      console.error("R2 write failed:", err);
      return new Response(JSON.stringify({ error: "Failed to save UUID" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ uuid }), {
    headers: { "Content-Type": "application/json" },
  });
}

