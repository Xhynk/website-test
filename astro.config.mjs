import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://alexanderdemchak.com',
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    sanity({
      projectId: import.meta.env.SANITY_PROJECT_ID,
      dataset: import.meta.env.SANITY_DATASET || 'production',
      useCdn: false,
      studioBasePath: '/studio',
    }),
    react(),
    sitemap(),
  ],
});
