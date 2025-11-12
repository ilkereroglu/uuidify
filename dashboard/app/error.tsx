"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { reportClientError } from "@/lib/error-reporter";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError({
      message: error?.message ?? "Unknown dashboard error",
      stack: error?.stack,
      component: "route-error",
    });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-white">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Something went wrong
        </p>
        <h1 className="text-2xl font-semibold text-white">
          We couldn&apos;t load the dashboard
        </h1>
        <p className="text-sm text-slate-400">
          We&apos;ve logged the issue automatically. Try refreshing the page or
          come back in a few seconds.
        </p>
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
