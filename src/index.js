export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Health check
    if (path === "/") {
      return new Response("UUIDify Worker running ✅", { status: 200 });
    }

    // Generate a new UUID
    if (path === "/uuid") {
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
        return new Response("Failed to save UUID", { status: 500 });
      }

      return new Response(JSON.stringify({ uuid }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Manual log write endpoint for debugging
    if (path === "/log") {
      const body = await request.text();
      const now = new Date().toISOString();

      await env.LOG_BUCKET.put(`log-${now}.json`, body, {
        httpMetadata: { contentType: "application/json" },
      });

      return new Response("Log saved", { status: 200 });
    }

    // List all UUID entries stored in the R2 bucket
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

    // Explicit 404 for any other path
    return new Response("Not found", { status: 404 });
  },
};
