import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Note: @sanity/astro integration will be configured in a later task
// when Sanity Studio is set up. For now, we use @sanity/client directly.

export default defineConfig({
  site: 'https://alexanderdemchak.com',
  output: 'static',
  integrations: [
    react(),
    sitemap(),
  ],
});
