/**
 * Generate Handler
 * Generates multiple UUIDs with count and format parameters
 */

import { generateUUID } from '../utils/uuid-generator.js';
import { validateVersion, validateCount, validateFormat } from '../utils/validator.js';

/**
 * Handles UUID generation requests with count and format parameters
 * @param {Request} request - HTTP request
 * @returns {Response} Generated UUIDs response
 */
export async function handleGenerate(request) {
  const url = new URL(request.url);
  const version = validateVersion(url.searchParams.get("version"));
  const count = validateCount(url.searchParams.get("count"));
  const format = validateFormat(url.searchParams.get("format"));

  const uuids = Array.from({ length: count }, () => generateUUID(version));

  if (format === "text") {
    return new Response(uuids.join("\n"), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Return single UUID object for count=1, array for multiple
  if (count === 1) {
    return new Response(JSON.stringify({ uuid: uuids[0] }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ uuids }), {
    headers: { "Content-Type": "application/json" },
  });
}

