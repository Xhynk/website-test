import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

export default defineConfig({
  name: 'alexanderdemchak',
  title: 'Alexander Demchak',
  projectId: import.meta.env.SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'placeholder',
  dataset: import.meta.env.SANITY_DATASET || process.env.SANITY_DATASET || 'production',
  plugins: [structureTool()],
  schema: {
    types: [],
  },
});
