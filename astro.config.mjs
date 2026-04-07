import { defineConfig, sessionDrivers } from 'astro/config';
import { loadEnv } from 'vite';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

const env = loadEnv(import.meta.env.MODE, process.cwd(), '');

export default defineConfig({
  site: 'https://alexanderdemchak.com',
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  session: {
    driver: sessionDrivers.lruCache(),
  },
  integrations: [
    sanity({
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET || 'production',
      useCdn: false,
      studioBasePath: '/studio',
    }),
    react(),
    sitemap(),
  ],
});
