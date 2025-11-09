/**
 * List Handler
 * Lists all UUIDs in the R2 bucket
 */

/**
 * Handles list requests
 * @param {Request} request - HTTP request
 * @param {Object} env - Environment variables
 * @returns {Response} List of UUIDs
 */
export async function handleList(request, env) {
  if (!env.LOG_BUCKET) {
    return new Response(JSON.stringify({ error: "R2 bucket not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const objects = await env.LOG_BUCKET.list();
    const uuids = [];

    for (const obj of objects.objects) {
      try {
        const file = await env.LOG_BUCKET.get(obj.key);
        if (file) {
          const data = await file.json();
          if (data.uuid) {
            uuids.push(data.uuid);
          }
        }
      } catch (err) {
        console.error(`Error reading ${obj.key}:`, err);
        // Continue with other objects
      }
    }

    return new Response(JSON.stringify({ uuids }, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("R2 list failed:", err);
    return new Response(JSON.stringify({ error: "Failed to list UUIDs" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

