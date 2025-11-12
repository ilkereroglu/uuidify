import { normalizeMetricsPayload } from "../../lib/observability";

type Env = {
  API_BASE_URL?: string;
};

type PagesContext<E = Record<string, unknown>> = {
  env: E;
};

export const onRequestGet = async ({ env }: PagesContext<Env>) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  const apiBase = env.API_BASE_URL ?? "https://api.uuidify.io";

  try {
    const response = await fetch(`${apiBase}/metrics`, {
      signal: controller.signal,
      headers: {
        "user-agent": "uuidify-dashboard/metrics",
      },
    });
    const payload = await response.json().catch(() => ({}));
    const normalized = normalizeMetricsPayload(payload);

    return new Response(JSON.stringify(normalized), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    const normalized = normalizeMetricsPayload({
      message:
        error instanceof Error ? error.message : "Unable to reach metrics",
    });

    return new Response(JSON.stringify(normalized), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
};
