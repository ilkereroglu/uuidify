/**
 * UUIDify Cloudflare Worker — birleşik sürüm
 * 
 * - UUID v1, v4, v7 üretimi
 * - R2'ye UUID kayıt/loglama
 * - /, /uuid, /list, /log endpointleri
 * - Analytics Engine metrikleri
 * 
 * Author: İlker Eroğlu
 */

function generateUUIDv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateUUIDv1() {
  const now = Date.now();
  const timeLow = ((now & 0xffffffff) >>> 0).toString(16).padStart(8, '0');
  const timeMid = (((now / 0x100000000) & 0xffff) >>> 0).toString(16).padStart(4, '0');
  const timeHiAndVersion = ((((now / 0x1000000000000) & 0x0fff) | 0x1000) >>> 0)
    .toString(16)
    .padStart(4, '0');
  const clockSeq = (crypto.getRandomValues(new Uint8Array(2))[0] & 0x3f | 0x80)
    .toString(16)
    .padStart(2, '0');
  const node = Array.from(crypto.getRandomValues(new Uint8Array(6)), b => b.toString(16).padStart(2, '0')).join('');
  return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSeq}${node.slice(0, 2)}-${node.slice(2)}`;
}

function generateUUIDv7() {
  const timestamp = BigInt(Date.now());
  const unixTime = timestamp * 10000n + 0x01B21DD213814000n;
  const timeHex = unixTime.toString(16).padStart(16, '0');
  const rand = crypto.getRandomValues(new Uint8Array(10));
  const randHex = Array.from(rand, b => b.toString(16).padStart(2, '0')).join('');
  return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-7${timeHex.slice(13, 16)}-${randHex.slice(0, 4)}-${randHex.slice(4, 16)}`;
}

function generateUUID(version = "v4") {
  switch (version) {
    case "v1":
      return generateUUIDv1();
    case "v7":
      return generateUUIDv7();
    default:
      return generateUUIDv4();
  }
}

export default {
  async fetch(request, env, ctx) {
    const start = Date.now();
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // --- Health check ---
      if (path === "/") {
        return new Response("UUIDify Worker running ✅", { status: 200 });
      }

      // --- Generate and save UUID to R2 ---
      if (path === "/uuid") {
        const version = (url.searchParams.get("version") || "v4").toLowerCase();
        const uuid = generateUUID(version);

        try {
          await env.LOG_BUCKET.put(
            `uuid-${Date.now()}.json`,
            JSON.stringify({
              uuid,
              version,
              ip: request.headers.get("CF-Connecting-IP") || "unknown",
              timestamp: new Date().toISOString(),
            }),
            { httpMetadata: { contentType: "application/json" } }
          );
        } catch (err) {
          console.error("R2 write failed:", err);
          return new Response("Failed to save UUID", { status: 500 });
        }

        return new Response(JSON.stringify({ uuid }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // --- Manual log write endpoint ---
      if (path === "/log") {
        const body = await request.text();
        const now = new Date().toISOString();

        await env.LOG_BUCKET.put(`log-${now}.json`, body, {
          httpMetadata: { contentType: "application/json" },
        });

        return new Response("Log saved", { status: 200 });
      }

      // --- List all UUIDs in the R2 bucket ---
      if (path === "/list") {
        try {
          const objects = await env.LOG_BUCKET.list();
          const uuids = [];

          for (const obj of objects.objects) {
            const file = await env.LOG_BUCKET.get(obj.key);
            if (file) {
              const data = await file.json();
              uuids.push(data.uuid);
            }
          }

          return new Response(JSON.stringify({ uuids }, null, 2), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("R2 list failed:", err);
          return new Response("Failed to list UUIDs", { status: 500 });
        }
      }

      // --- Default API behavior (for ?count, ?format) ---
      if (path === "/generate") {
        const version = (url.searchParams.get("version") || "v4").toLowerCase();
        const count = Math.min(Number(url.searchParams.get("count")) || 1, 1000);
        const format = (url.searchParams.get("format") || "json").toLowerCase();
        const uuids = Array.from({ length: count }, () => generateUUID(version));

        if (format === "text") {
          return new Response(uuids.join("\n"), {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }
        return new Response(JSON.stringify({ uuids }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // --- 404 for anything else ---
      return new Response("Not found", { status: 404 });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    } finally {
      // --- Analytics Engine Logging ---
      try {
        const latency = Date.now() - start;
        const ip = request.headers.get("cf-connecting-ip") || "unknown";
        const pathName = new URL(request.url).pathname;

        env.UUIDIFY_ANALYTICS.writeDataPoint({
          blobs: [pathName, ip],
          doubles: [latency],
          indexes: [Date.now()],
        });
      } catch (logErr) {
        console.error("Analytics logging failed:", logErr);
      }
    }
  },
};
