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
  let count;
  try {
    count = validateCount(url.searchParams.get("count"));
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Invalid count" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const format = validateFormat(url.searchParams.get("format"));

  const uuids = Array.from({ length: count }, () => generateUUID(version));
  const isULID = version === "ulid";

  if (format === "text") {
    return new Response(uuids.join("\n"), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Return single UUID object for count=1, array for multiple
  if (count === 1) {
    const payload = isULID ? { ulid: uuids[0] } : { uuid: uuids[0] };
    return new Response(JSON.stringify(payload), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = isULID ? { ulids: uuids } : { uuids };
  return new Response(JSON.stringify(payload), {
    headers: { "Content-Type": "application/json" },
  });
}
