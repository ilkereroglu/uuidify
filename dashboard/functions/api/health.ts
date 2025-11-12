import { normalizeHealthPayload } from "../../lib/observability";

type Env = {
  API_BASE_URL?: string;
};

type PagesContext<E = Record<string, unknown>> = {
  env: E;
};

export const onRequestGet = async ({ env }: PagesContext<Env>) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  const startedAt = Date.now();
  const apiBase = env.API_BASE_URL ?? "https://api.uuidify.io";

  try {
    const response = await fetch(`${apiBase}/health`, {
      signal: controller.signal,
      headers: {
        "user-agent": "uuidify-dashboard/edge",
      },
    });
    const payload = await response.json().catch(() => ({}));
    const normalized = normalizeHealthPayload(payload, Date.now() - startedAt);

    return new Response(JSON.stringify(normalized), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    const normalized = normalizeHealthPayload(
      { healthy: false, message: "Upstream unreachable" },
      Date.now() - startedAt,
      error instanceof Error ? error.message : "Unable to reach API",
    );

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
