/**
 * Error Handler Middleware
 * Catches and handles errors from handlers
 */

/**
 * Wraps a handler with error handling
 * @param {Function} handler - Request handler function
 * @returns {Function} Wrapped handler
 */
export function withErrorHandler(handler) {
  return async (request, env, ctx) => {
    try {
      return await handler(request, env, ctx);
    } catch (err) {
      console.error("Handler error:", err);
      return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
}

