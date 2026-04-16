import { defineField, defineType } from 'sanity';

export const localeText = defineType({
  name: 'localeText',
  title: 'Translated Text',
  type: 'object',
  fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'text', rows: 3 }),
    defineField({ name: 'en', title: 'English', type: 'text', rows: 3, fieldset: 'translations' }),
    defineField({ name: 'de', title: 'Deutsch', type: 'text', rows: 3, fieldset: 'translations' }),
  ],
});
