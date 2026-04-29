import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://www.cody-peterson.com',
  integrations: [sitemap()],
  adapter: cloudflare()
});