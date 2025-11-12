export type HealthSnapshot = {
  healthy: boolean;
  responseTimeMs: number;
  checkedAt: string;
  statusMessage?: string;
};

export type HistoryPoint = {
  label: string;
  uptime: number;
  rpm: number;
};

export type MetricsSnapshot = {
  requestsPerMinute: number;
  uptimePercent: number;
  responseTimeMs: number;
  history: HistoryPoint[];
  statusMessage?: string;
};

const DEFAULT_REQUESTS_PER_MINUTE = 480;
const DEFAULT_RESPONSE_TIME = 42;
const DEFAULT_UPTIME = 99.9;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const buildPlaceholderHistory = (
  seed = DEFAULT_REQUESTS_PER_MINUTE,
): HistoryPoint[] =>
  Array.from({ length: 12 }).map((_, index) => {
    const rpm = Math.max(
      200,
      Math.round(
        seed +
          Math.sin(index / 2) * 60 +
          Math.random() * 40 -
          20,
      ),
    );
    return {
      label: `-${(11 - index) * 5}m`,
      uptime: clamp(99.4 + Math.random() * 0.5, 97, 100),
      rpm,
    };
  });

export const normalizeHealthPayload = (
  upstream: Record<string, unknown> | undefined,
  responseTimeMs: number,
  fallbackMessage?: string,
): HealthSnapshot => {
  const healthy =
    typeof upstream?.healthy === "boolean"
      ? (upstream.healthy as boolean)
      : upstream?.status === "ok" || upstream?.status === "healthy";

  const message =
    (typeof upstream?.message === "string" ? upstream.message : null) ??
    fallbackMessage ??
    (healthy ? "All systems nominal" : "Service degraded");

  return {
    healthy: Boolean(healthy),
    responseTimeMs: responseTimeMs || DEFAULT_RESPONSE_TIME,
    checkedAt: new Date().toISOString(),
    statusMessage: message ?? undefined,
  };
};

type UpstreamHistoryPoint = {
  timestamp?: string;
  label?: string;
  uptime?: number;
  uptime_percent?: number;
  requests_per_minute?: number;
  rpm?: number;
};

export const normalizeMetricsPayload = (
  upstream: Record<string, unknown> | undefined,
): MetricsSnapshot => {
  const requestsPerMinute =
    Number(
      upstream?.requests_per_minute ??
        upstream?.rpm ??
        upstream?.current_load,
    ) || DEFAULT_REQUESTS_PER_MINUTE;
  const uptimePercent =
    Number(upstream?.uptime_percent ?? upstream?.uptime) || DEFAULT_UPTIME;
  const responseTimeMs =
    Number(upstream?.response_time_ms ?? upstream?.latency_ms) ||
    DEFAULT_RESPONSE_TIME;

  const historySource: UpstreamHistoryPoint[] = Array.isArray(
    upstream?.history,
  )
    ? (upstream?.history as UpstreamHistoryPoint[])
    : buildPlaceholderHistory(requestsPerMinute);

  const history = historySource.map((point, index) => ({
    label:
      typeof point.timestamp === "string"
        ? new Date(point.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : point.label ?? `-${(historySource.length - index - 1) * 5}m`,
    uptime:
      Number(point.uptime ?? point.uptime_percent) ||
      clamp(uptimePercent, 0, 100),
    rpm:
      Number(point.requests_per_minute ?? point.rpm) ||
      Math.max(180, requestsPerMinute - index * 5),
  }));

  return {
    requestsPerMinute,
    uptimePercent: clamp(uptimePercent, 0, 100),
    responseTimeMs,
    history,
    statusMessage:
      typeof upstream?.message === "string"
        ? (upstream.message as string)
        : undefined,
  };
};
