import { defineConfig, sessionDrivers } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://www.cody-peterson.com',
  // Astro 7 changed the default to JSX whitespace rules, which glue words
  // together in running text. `true` keeps the lossless compression the live
  // site had on Astro 5/6.
  compressHTML: true,
  integrations: [sitemap({ filter: page => !page.includes('/book/thanks/') })],
  // `compile`: no Cloudflare Images binding (the site has no <Image> use), and
  // no session KV namespace: the site has no sessions. Bindings stay as before
  // (ASSETS and ORDER_MAIL only).
  adapter: cloudflare({
    imageService: 'compile',
    remoteBindings: false,
    configPath: './wrangler.astro.jsonc',
  }),
  session: { driver: sessionDrivers.null() },
  vite: {
    // Vite 8 minifies CSS with lightningcss, which rewrites media queries to
    // the range syntax (width>=900px) that Safari before 16.4 ignores. esbuild
    // with the Astro 5 browser targets gives the same CSS the live site had.
    build: {
      cssMinify: 'esbuild',
      // Page scripts as files, not inline: the Content-Security-Policy then
      // allows scripts from 'self' only, with no 'unsafe-inline'.
      assetsInlineLimit: 0,
      cssTarget: ['chrome87', 'edge88', 'firefox78', 'safari14'],
    },
    ssr: {
      external: ['cloudflare:email']
    }
  }
});
