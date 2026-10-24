import { defineMiddleware } from 'astro:middleware';
import { withSecurityHeaders } from './lib/security-headers';

// Every response the Worker builds (/api/*, not-found pages) gets the security
// headers. Prerendered pages are static files: public/_headers covers those.
export const onRequest = defineMiddleware(async (_context, next) => {
  return withSecurityHeaders(await next());
});
