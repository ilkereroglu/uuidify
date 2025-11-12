import { handleHealth } from "../handlers/health.js";

export async function logHealthSnapshot(env) {
  if (!env.LOG_BUCKET) {
    console.warn("LOG_BUCKET binding missing; skipping cron log");
    return;
  }

  const request = new Request("https://uuidify.cron/health?format=json");
  const start = Date.now();
  const response = await handleHealth(request, env);
  const latency = Date.now() - start;
  const payload = await response.json();

  const entry = {
    ...payload,
    latencyMs: latency,
    status: response.status,
    checkedAt: payload.timestamp ?? new Date().toISOString(),
  };

  const key = `health/${entry.checkedAt}.json`;
  await env.LOG_BUCKET.put(key, JSON.stringify(entry), {
    httpMetadata: { contentType: "application/json" },
  });

  if (env.UUIDIFY_ANALYTICS) {
    await env.UUIDIFY_ANALYTICS.writeDataPoint({
      blobs: ["cron", "/health", "scheduler"],
      doubles: [entry.status, entry.latencyMs],
      indexes: [Date.now()],
    });
  }
}
