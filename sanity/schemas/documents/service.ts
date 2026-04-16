import { defineArrayMember, defineField, defineType } from 'sanity';

export const service = defineType({
  name: 'service',
  title: 'Servicio',
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
    defineField({
      name: 'description',
      title: 'Descripción corta',
      type: 'localeText',
    }),
    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'localeBlockContent',
    }),
    defineField({
      name: 'icon',
      title: 'Icono',
      type: 'string',
      description: 'Lucide icon name — e.g. "building-2", "paint-roller", "hammer"',
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen principal',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'gallery',
      title: 'Galería',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        }),
      ],
    }),
    defineField({
      name: 'features',
      title: 'Características',
      type: 'array',
      of: [defineArrayMember({ type: 'localeString' })],
    }),
    defineField({
      name: 'order',
      title: 'Orden en navegación',
      type: 'number',
    }),
    defineField({
      name: 'isActive',
      title: 'Visible en web',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  orderings: [
    {
      title: 'Orden manual',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title.es', subtitle: 'description.es', media: 'heroImage' },
  },
});
