const LOG_ENDPOINT = "https://api.uuidify.io/log";

export function reportDocError(payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    const body = JSON.stringify({
      source: 'docs',
      timestamp: new Date().toISOString(),
      ...payload,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(LOG_ENDPOINT, body);
      return;
    }

    fetch(LOG_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      mode: 'cors',
    });
  } catch (error) {
    console.error('Docs error reporter failed', error);
  }
}
