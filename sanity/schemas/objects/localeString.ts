import { defineField, defineType } from 'sanity';

export const localeString = defineType({
  name: 'localeString',
  title: 'Translated String',
  type: 'object',
  fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'string' }),
    defineField({ name: 'en', title: 'English', type: 'string', fieldset: 'translations' }),
    defineField({ name: 'de', title: 'Deutsch', type: 'string', fieldset: 'translations' }),
  ],
});
