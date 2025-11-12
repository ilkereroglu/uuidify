"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { HistoryPoint } from "@/lib/observability";

type MetricsChartProps = {
  history?: HistoryPoint[];
};

export function MetricsChart({ history = [] }: MetricsChartProps) {
  return (
    <Card className="border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-950/40">
      <CardHeader>
        <CardTitle className="text-base text-slate-300">
          Uptime & Request Volume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-56 w-full">
          <ResponsiveContainer>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="uptime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis
                stroke="#94a3b8"
                tickFormatter={(value) => `${value}%`}
                domain={[95, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Area
                type="monotone"
                dataKey="uptime"
                stroke="#38bdf8"
                fillOpacity={1}
                fill="url(#uptime)"
                name="Uptime %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer>
            <BarChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Legend
                wrapperStyle={{
                  color: "#94a3b8",
                }}
              />
              <Bar dataKey="rpm" fill="#22d3ee" name="Requests / min" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
