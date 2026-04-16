import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { schemaTypes } from './sanity/schemas';
import { structure } from './sanity/structure';

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.SANITY_PROJECT_ID ?? 'placeholder';
const dataset = process.env.SANITY_STUDIO_DATASET ?? process.env.SANITY_DATASET ?? 'production';

// Singleton document types — exactly one instance per dataset, enforced via desk + action filter.
const SINGLETONS = ['siteSettings'];

export default defineConfig({
  name: 'serintsur',
  title: 'Serintsur CMS',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType)
        ? input.filter(({ action }) => action !== 'duplicate' && action !== 'delete')
        : input,
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter((item) => !SINGLETONS.includes(item.templateId))
        : prev,
  },
});
