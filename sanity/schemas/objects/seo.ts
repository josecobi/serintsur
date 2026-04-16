import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'localeString',
      description: 'Aim for 50–60 characters. Falls back to page title.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'localeText',
      description: 'Aim for 150–160 characters.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: { hotspot: true },
      description: '1200x630 recommended. Falls back to page hero image.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
