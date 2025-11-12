/**
 * Uptime history handler
 * Returns the latest health snapshots stored in R2
 */

const DEFAULT_LIMIT = 24;

export async function handleUptime(request, env) {
  if (!env.LOG_BUCKET) {
    return new Response(
      JSON.stringify({ error: "R2 bucket not configured", entries: [] }),
      {
        status: 501,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const url = new URL(request.url);
  const limit = Math.min(
    Number(url.searchParams.get("limit") ?? DEFAULT_LIMIT) || DEFAULT_LIMIT,
    200,
  );

  const objects = await env.LOG_BUCKET.list({ prefix: "health/", limit: 500 });
  const sorted = [...(objects?.objects ?? [])].sort(
    (a, b) => new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime(),
  );

  const entries = [];
  for (const object of sorted.slice(0, limit)) {
    const file = await env.LOG_BUCKET.get(object.key);
    if (!file) continue;
    try {
      const parsed = JSON.parse(await file.text());
      entries.push(parsed);
    } catch (err) {
      console.error("Failed to parse uptime object", object.key, err);
    }
  }

  return new Response(JSON.stringify({ entries }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
