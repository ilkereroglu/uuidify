// RFC 4122 compliant UUIDv4 generator
function generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  
  export default {
    async fetch(request, env, ctx) {
      try {
        const url = new URL(request.url);
        const count = Math.min(Number(url.searchParams.get("count")) || 1, 1000);
        const format = (url.searchParams.get("format") || "json").toLowerCase();
  
        // Generate the requested number of UUIDs
        const uuids = Array.from({ length: count }, () => generateUUIDv4());
  
        // Choose response format
        if (format === "text") {
          return new Response(uuids.join("\n"), {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }
  
        return new Response(JSON.stringify({ uuids }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    },
  };
  