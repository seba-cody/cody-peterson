// Security headers (2026-10-24, web check findings 8 and 12; Cody's go:
// "update Astro, force HTTPS, add the standard safety headers").
//
// The same set is in public/_headers for the static pages and files that
// Cloudflare serves without running the Worker. Keep the two the same.
//
// The CSP lists every source the pages use: the site's own files, the Umami
// script and its /api/send beacon on analytics.seba.health, Google Fonts,
// YouTube thumbnails on /videos/, and the Buttondown letters form. Page
// scripts are built as files (vite assetsInlineLimit 0), so scripts need no
// 'unsafe-inline'; inline style attributes on /book/ do. The buy button posts
// to /api/book-checkout and then navigates to Stripe Checkout, which a CSP
// does not restrict. Nothing frames this site.
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' https://analytics.seba.health",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://img.youtube.com",
  "connect-src 'self' https://analytics.seba.health",
  "form-action 'self' https://buttondown.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');

export const SECURITY_HEADERS: Record<string, string> = {
  // No includeSubDomains: watch.cody-peterson.com is a separate tunnel door.
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': CONTENT_SECURITY_POLICY,
};

function setAll(headers: Headers): void {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(name)) headers.set(name, value);
  }
}

// Some responses have immutable headers (Response.redirect, a fetch result);
// those get the headers on a copy that shares the same body.
export function withSecurityHeaders(response: Response): Response {
  try {
    setAll(response.headers);
    return response;
  } catch {
    const copy = new Response(response.body, response);
    setAll(copy.headers);
    return copy;
  }
}
