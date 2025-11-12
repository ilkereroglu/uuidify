"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { reportClientError } from "@/lib/error-reporter";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    reportClientError({
      message: error?.message ?? "Unknown global error",
      stack: error?.stack,
      component: "global-error",
    });
  }, [error]);

  return (
    <html lang="en" data-theme="dark">
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-white">
        <div className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            UUIDify dashboard
          </p>
          <h1 className="text-3xl font-semibold">Unexpected error</h1>
          <p className="text-sm text-slate-400">
            The dashboard failed to render. Our team has been notified. You can
            retry or head back home.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => location.reload()}>Reload</Button>
          <Button asChild variant="ghost">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </body>
    </html>
  );
}
