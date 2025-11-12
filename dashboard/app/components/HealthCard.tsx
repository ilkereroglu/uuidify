"use client";

import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type HealthCardProps = {
  healthy?: boolean;
  responseTimeMs?: number;
  checkedAt?: string;
  statusMessage?: string;
};

export function HealthCard({
  healthy,
  responseTimeMs,
  checkedAt,
  statusMessage,
}: HealthCardProps) {
  const Icon =
    healthy === undefined ? Loader2 : healthy ? CheckCircle2 : AlertTriangle;
  const statusText =
    healthy === undefined ? "Checking" : healthy ? "Healthy" : "Degraded";
  const badgeClass =
    healthy === undefined
      ? "bg-slate-500/30 text-slate-200"
      : healthy
        ? "bg-emerald-500/20 text-emerald-300"
        : "bg-amber-500/20 text-amber-200";
  return (
    <Card className="h-full border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-900/20">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <CardTitle className="text-base text-slate-300">API Health</CardTitle>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
        >
          <Icon className="h-4 w-4" />
          {statusText}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-3xl font-semibold text-white">
          {responseTimeMs !== undefined ? `${responseTimeMs.toFixed(0)} ms` : "—"}
        </p>
        <p className="text-sm text-slate-400">
          {statusMessage || "Edge health check proxied through Cloudflare"}
        </p>
        {checkedAt && (
          <p className="text-xs text-slate-500">
            Updated {new Date(checkedAt).toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
