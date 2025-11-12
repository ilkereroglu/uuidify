const LOG_ENDPOINT =
  process.env.NEXT_PUBLIC_ERROR_ENDPOINT || "https://api.uuidify.io/log";

type ErrorPayload = {
  message: string;
  stack?: string;
  route?: string;
  userAgent?: string;
  component?: string;
};

export async function reportClientError(payload: ErrorPayload) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({
      source: "dashboard",
      timestamp: new Date().toISOString(),
      ...payload,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(LOG_ENDPOINT, body);
      return;
    }

    await fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      mode: "cors",
    });
  } catch (error) {
    console.error("error reporter failed", error);
  }
}
