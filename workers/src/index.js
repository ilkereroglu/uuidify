/**
 * UUIDify Cloudflare Worker — Main Entry Point
 * 
 * Modular worker implementation with:
 * - UUID v1, v4, v7 generation
 * - R2 storage for UUID logging
 * - Multiple endpoints: /, /health, /uuid, /list, /log
 * - Analytics Engine metrics
 * 
 * Author: İlker Eroğlu
 */

import { handleUUID } from './handlers/uuid.js';
import { handleHealth } from './handlers/health.js';
import { handleLog } from './handlers/log.js';
import { handleList } from './handlers/list.js';
import { handleGenerate } from './handlers/generate.js';
import { withAnalytics } from './middleware/analytics.js';
import { withErrorHandler } from './middleware/error-handler.js';

// Route mapping
const routes = {
  "/": handleGenerate,      // Main UUID generation endpoint (default v4)
  "/health": handleHealth,  // Health check endpoint
  "/uuid": handleUUID,      // UUID with R2 logging
  "/log": handleLog,        // Manual log write
  "/list": handleList,      // List UUIDs from R2
};

/**
 * Main fetch handler
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const handler = routes[path];

    // Return 404 for unknown routes
    if (!handler) {
      return new Response("Not found", { status: 404 });
    }

    // Wrap handler with error handling and analytics
    const wrappedHandler = withAnalytics(
      withErrorHandler(handler),
      env
    );

    return wrappedHandler(request, env, ctx);
  },
};

