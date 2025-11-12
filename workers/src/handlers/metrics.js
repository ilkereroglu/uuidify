/**
 * Metrics Handler
 * Returns basic uptime + throughput samples for dashboard + status clients.
 * Later we can replace this with real analytics aggregation.
 */

const buildHistory = (seed) =>
  Array.from({ length: 12 }).map((_, index) => {
    const timestamp = new Date(Date.now() - index * 5 * 60 * 1000).toISOString();
    const rpm =
      seed +
      Math.round(Math.sin(index / 2) * 60 + Math.random() * 40 - 20);
    return {
      checkedAt: timestamp,
      status: rpm > 350 ? "healthy" : "degraded",
      latencyMs: Math.max(30, 40 + Math.random() * 15),
      uptime: 99.9,
      rpm: Math.max(200, rpm),
    };
  });

export async function handleMetrics() {
  const requestsPerMinute = Math.max(
    200,
    Math.round(420 + Math.sin(Date.now() / 60_000) * 80),
  );
  const responseTimeMs = Math.round(40 + Math.random() * 20);
  const uptimePercent = 99.9;
  const history = buildHistory(requestsPerMinute);

  return new Response(
    JSON.stringify({
      requestsPerMinute,
      responseTimeMs,
      uptimePercent,
      history: history.map((point) => ({
        label: new Date(point.checkedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        uptime: point.uptime,
        rpm: point.rpm,
      })),
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    },
  );
}
