"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  normalizeHealthPayload,
  normalizeMetricsPayload,
  type HealthSnapshot,
  type MetricsSnapshot,
} from "@/lib/observability";
import { HealthCard } from "./HealthCard";
import { MetricsChart } from "./MetricsChart";

const REFRESH_PRESETS = [
  { label: "Off", value: 0 },
  { label: "15s", value: 15_000 },
  { label: "30s", value: 30_000 },
  { label: "1m", value: 60_000 },
  { label: "5m", value: 300_000 },
];

const DEFAULT_INTERVAL = Number(
  process.env.NEXT_PUBLIC_DEFAULT_REFRESH_INTERVAL ?? 30_000,
);

const API_REMOTE_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.uuidify.io"
).replace(/\/$/, "");
const API_LOCAL_BASE = (
  process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL ?? "http://localhost:8787"
).replace(/\/$/, "");
const getNow = () =>
  typeof performance === "undefined" ? Date.now() : performance.now();

type FetchState<T> = {
  data?: T;
  error?: string;
};

export function DashboardContent() {
  const [health, setHealth] = useState<FetchState<HealthSnapshot>>({});
  const [metrics, setMetrics] = useState<FetchState<MetricsSnapshot>>({});
  const [intervalMs, setIntervalMs] = useState(() => DEFAULT_INTERVAL);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const buildApiUrl = useCallback((path: string) => {
    if (
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    ) {
      return `${API_LOCAL_BASE}${path}`;
    }
    return `${API_REMOTE_BASE}${path}`;
  }, []);

  const ensureHealthShape = useCallback(
    (payload: unknown, duration = 0) => {
      if (
        payload &&
        typeof payload === "object" &&
        "healthy" in payload &&
        "checkedAt" in payload
      ) {
        return payload as HealthSnapshot;
      }
      return normalizeHealthPayload(
        payload as Record<string, unknown>,
        duration,
      );
    },
    [],
  );

  const ensureMetricsShape = useCallback((payload: unknown) => {
    if (
      payload &&
      typeof payload === "object" &&
      "requestsPerMinute" in payload &&
      "history" in payload
    ) {
      return payload as MetricsSnapshot;
    }
    return normalizeMetricsPayload(payload as Record<string, unknown>);
  }, []);

  const fetchWithTiming = useCallback(
    async <T,>(
      path: string,
      normalizer: (payload: unknown, duration?: number) => T,
    ): Promise<T> => {
      const target = buildApiUrl(path);
      const started = getNow();
      const response = await fetch(target, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Unable to reach ${target} (${response.status})`);
      }
      const payload = await response.json();
      const duration = getNow() - started;
      return normalizer(payload, duration);
    },
    [buildApiUrl],
  );

  const fetchSnapshot = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [healthRes, metricsRes] = await Promise.all([
        fetchWithTiming("/health?format=json", ensureHealthShape),
        fetchWithTiming("/metrics", (payload) =>
          ensureMetricsShape(payload),
        ),
      ]);
      setHealth({ data: healthRes });
      setMetrics({ data: metricsRes });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to reach API";
      console.error("[dashboard] fetchSnapshot failed", error);
      setHealth((prev) => ({ ...prev, error: message }));
      setMetrics((prev) => ({ ...prev, error: message }));
    } finally {
      setIsRefreshing(false);
    }
  }, [ensureHealthShape, ensureMetricsShape, fetchWithTiming]);

  useEffect(() => {
    fetchSnapshot();
  }, [fetchSnapshot]);

  useEffect(() => {
    if (!intervalMs) return undefined;
    const id = setInterval(fetchSnapshot, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, fetchSnapshot]);

  const statBlocks = useMemo(() => {
    const rpm = metrics.data?.requestsPerMinute ?? 480;
    const uptime = metrics.data?.uptimePercent ?? 99.9;
    const latency =
      metrics.data?.responseTimeMs ?? health.data?.responseTimeMs ?? 42;
    return [
      {
        label: "Requests / minute",
        value: rpm.toLocaleString(),
        subtext: "Edge-estimated throughput",
      },
      {
        label: "Uptime",
        value: `${uptime.toFixed(2)}%`,
        subtext: "Rolling 30d target",
      },
      {
        label: "Response time",
        value: `${latency.toFixed(0)} ms`,
        subtext: "P95 latency (placeholder)",
      },
    ];
  }, [health.data?.responseTimeMs, metrics.data]);

  const lastUpdated = useMemo(() => {
    if (health.data?.checkedAt) {
      return new Date(health.data.checkedAt).toLocaleTimeString();
    }
    const label = metrics.data?.history?.at(-1)?.label;
    return label ?? undefined;
  }, [health.data?.checkedAt, metrics.data?.history]);

  return (
    <main className="flex-1 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <div className="container space-y-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-400">
              Realtime Overview
            </p>
            <h1 className="text-3xl font-semibold text-white">
              UUIDify API observability
            </h1>
            <p className="text-sm text-slate-400">
              Monitoring edge health, uptime, and throughput for dashboard.uuidify.io
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Auto refresh
            </label>
            <select
              className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
              value={String(intervalMs)}
              onChange={(event) => setIntervalMs(Number(event.target.value))}
            >
              {REFRESH_PRESETS.map((preset) => (
                <option key={preset.value} value={preset.value.toString()}>
                  {preset.label}
                </option>
              ))}
            </select>
            <Button
              onClick={fetchSnapshot}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCcw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
        {(health.error || metrics.error) && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {health.error || metrics.error}
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <HealthCard
              healthy={health.data?.healthy}
              responseTimeMs={health.data?.responseTimeMs}
              checkedAt={health.data?.checkedAt}
              statusMessage={health.data?.statusMessage}
            />
          </div>
          <Card className="border-white/10 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-base text-slate-300">
                Snapshot
              </CardTitle>
              <CardDescription className="text-xs">
                Updated {lastUpdated ?? "recently"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {statBlocks.map((block) => (
                <div key={block.label}>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {block.label}
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    {block.value}
                  </p>
                  <p className="text-xs text-slate-500">{block.subtext}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <MetricsChart history={metrics.data?.history} />
      </div>
    </main>
  );
}
