export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
  
      // Health check route
      if (url.pathname === "/") {
        return new Response("UUIDify Worker running", { status: 200 });
      }
  
      if (url.pathname === "/uuid") {
        const uuid = crypto.randomUUID();
      
        try {
          await env.LOG_BUCKET.put(
            `uuid-${Date.now()}.json`,
            JSON.stringify({
              uuid,
              ip: request.headers.get("CF-Connecting-IP"),
              timestamp: new Date().toISOString(),
            }),
            {
              httpMetadata: { contentType: "application/json" },
            }
          );
        } catch (err) {
          console.error("R2 write failed:", err);
        }
      
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
  