/**
 * Cloudflare Worker - UUIDify Edge Proxy
 * Bu worker, Cloudflare edge üzerinden gelen istekleri Go backend'ine yönlendirir.
 */

export default {
    async fetch(request, env, ctx) {
      try {
        const url = new URL(request.url);
        const target = `${env.GO_API_URL}${url.pathname}${url.search}`;
        const res = await fetch(target, {
          method: request.method,
          headers: request.headers,
        });
  
        // Response'u pass-through döndürüyoruz
        return new Response(res.body, res);
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    },
  };
  