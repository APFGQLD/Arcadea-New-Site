import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from '../../studio/schemas';

export const studioConfig = defineConfig({
  name: 'default',
  title: 'Arcadea CMS',
  basePath: '/studio',
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'b6pkfjxp',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
