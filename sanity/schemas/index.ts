import type { SchemaTypeDefinition } from 'sanity';

import { localeString } from './objects/localeString';
import { localeText } from './objects/localeText';
import { localeBlockContent } from './objects/localeBlockContent';
import { seo } from './objects/seo';

import { service } from './documents/service';
import { project } from './documents/project';
import { clientLogo } from './documents/clientLogo';
import { testimonial } from './documents/testimonial';
import { siteSettings } from './documents/siteSettings';
import { page } from './documents/page';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  localeString,
  localeText,
  localeBlockContent,
  seo,
  // Documents
  service,
  project,
  clientLogo,
  testimonial,
  siteSettings,
  page,
];
