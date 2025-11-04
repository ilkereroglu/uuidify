export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
  
      // Health check route
      if (url.pathname === "/") {
        return new Response("UUIDify Worker running", { status: 200 });
      }
  
      // Main UUID generation route
      if (url.pathname === "/uuid") {
        const uuid = crypto.randomUUID();
  
        // Write log entry asynchronously to R2 (non-blocking)
        ctx.waitUntil(
          env.LOG_BUCKET.put(
            `uuid-${Date.now()}.json`,
            JSON.stringify({
              uuid,
              ip: request.headers.get("CF-Connecting-IP"),
              userAgent: request.headers.get("User-Agent"),
              timestamp: new Date().toISOString(),
            }),
            {
              httpMetadata: { contentType: "application/json" },
            }
          )
        );
  
        return new Response(JSON.stringify({ uuid }), {
          headers: { "Content-Type": "application/json" },
        });
      }
  
      // Manual log write endpoint for debugging
      if (url.pathname === "/log") {
        const body = await request.text();
        const now = new Date().toISOString();
  
        await env.LOG_BUCKET.put(`log-${now}.json`, body, {
          httpMetadata: { contentType: "application/json" },
        });
  
        return new Response("Log saved", { status: 200 });
      }
  
      // 404 fallback for undefined routes
      return new Response("Not found", { status: 404 });
    },
  };
  