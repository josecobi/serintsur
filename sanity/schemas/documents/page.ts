import { defineField, defineType } from 'sanity';

export const page = defineType({
  name: 'page',
  title: 'Página',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'localeString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: (doc) => (doc as { title?: { es?: string } }).title?.es ?? '',
        maxLength: 96,
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'body', title: 'Contenido', type: 'localeBlockContent' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title.es', subtitle: 'slug.current' },
  },
});
