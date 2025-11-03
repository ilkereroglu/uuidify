/**
 * UUIDify Cloudflare Worker
 * Supports UUID v1, v4, and v7 (RFC4122 / RFC9562)
 * Author: İlker Eroğlu
 */

function generateUUIDv4() {
    // RFC4122 random-based UUIDv4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  
  function generateUUIDv1() {
    // Time-based UUIDv1 (no MAC, random node for privacy)
    const now = Date.now();
    const timeLow = ((now & 0xffffffff) >>> 0).toString(16).padStart(8, '0');
    const timeMid = (((now / 0x100000000) & 0xffff) >>> 0).toString(16).padStart(4, '0');
    const timeHiAndVersion = ((((now / 0x1000000000000) & 0x0fff) | 0x1000) >>> 0).toString(16).padStart(4, '0');
    const clockSeq = (crypto.getRandomValues(new Uint8Array(2))[0] & 0x3f | 0x80).toString(16).padStart(2, '0');
    const node = Array.from(crypto.getRandomValues(new Uint8Array(6)), b => b.toString(16).padStart(2, '0')).join('');
    return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSeq}${node.slice(0, 2)}-${node.slice(2)}`;
  }
  
  function generateUUIDv7() {
    // Time-ordered UUIDv7 (based on timestamp + randomness)
    const timestamp = BigInt(Date.now());
    const unixTime = timestamp * 10000n + 0x01B21DD213814000n; // UUID epoch adjustment
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
    async fetch(request, env) {
      const start = Date.now();
      let response;
  
      try {
        const url = new URL(request.url);
        const version = (url.searchParams.get("version") || "v4").toLowerCase();
        const count = Math.min(Number(url.searchParams.get("count")) || 1, 1000);
        const format = (url.searchParams.get("format") || "json").toLowerCase();
  
        const uuids = Array.from({ length: count }, () => generateUUID(version));
  
        if (format === "text") {
          response = new Response(uuids.join("\n"), {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        } else {
          response = new Response(JSON.stringify({ uuids }), {
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch (err) {
        response = new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      // 🔹 Analytics Engine Logging
      try {
        const latency = Date.now() - start;
        const ip = request.headers.get("cf-connecting-ip") || "unknown";
        const status = response.status.toString();
        const path = new URL(request.url).pathname;
  
        env.UUIDIFY_ANALYTICS.writeDataPoint({
          blobs: [path, ip, status],
          doubles: [latency],
          indexes: [Date.now()],
        });
      } catch (logErr) {
        console.error("Analytics logging failed:", logErr);
      }
  
      return response;
    },
  };
  