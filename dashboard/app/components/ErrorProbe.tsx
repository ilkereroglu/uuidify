"use client";

import { useEffect } from "react";

import { reportClientError } from "@/lib/error-reporter";

export function ErrorProbe() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      reportClientError({
        message: event.message,
        stack: event.error?.stack,
        route: window.location.pathname,
        component: "window-error",
        userAgent: navigator.userAgent,
      });
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      reportClientError({
        message: String(event.reason),
        route: window.location.pathname,
        component: "unhandled-rejection",
        userAgent: navigator.userAgent,
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
