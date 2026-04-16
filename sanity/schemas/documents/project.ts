import { defineArrayMember, defineField, defineType } from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título del proyecto',
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
    defineField({ name: 'description', title: 'Descripción', type: 'localeText' }),
    defineField({ name: 'body', title: 'Detalle del proyecto', type: 'localeBlockContent' }),
    defineField({
      name: 'service',
      title: 'Tipo de servicio',
      type: 'reference',
      to: [{ type: 'service' }],
    }),
    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'object',
      fields: [
        defineField({ name: 'city', title: 'Ciudad', type: 'string' }),
        defineField({
          name: 'province',
          title: 'Provincia',
          type: 'string',
          options: {
            list: [
              { title: 'Cádiz', value: 'Cádiz' },
              { title: 'Málaga', value: 'Málaga' },
              { title: 'Sevilla', value: 'Sevilla' },
            ],
            layout: 'radio',
          },
        }),
      ],
    }),
    defineField({ name: 'year', title: 'Año', type: 'number' }),
    defineField({ name: 'client', title: 'Cliente (opcional)', type: 'string' }),
    defineField({ name: 'area', title: 'Superficie (m²)', type: 'number' }),
    defineField({
      name: 'duration',
      title: 'Duración',
      type: 'string',
      description: 'e.g. "3 meses", "1 año"',
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Completado', value: 'completed' },
          { title: 'En curso', value: 'in_progress' },
          { title: 'Próximamente', value: 'upcoming' },
        ],
        layout: 'radio',
      },
      initialValue: 'completed',
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen principal',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'gallery',
      title: 'Galería de fotos',
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
      name: 'beforeAfter',
      title: 'Antes/Después',
      type: 'object',
      fields: [
        defineField({ name: 'before', title: 'Antes', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'after', title: 'Después', type: 'image', options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Destacado en home',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Orden (para proyectos destacados)',
      type: 'number',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  orderings: [
    {
      title: 'Año (reciente primero)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
    {
      title: 'Orden manual',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.es',
      city: 'location.city',
      year: 'year',
      media: 'mainImage',
    },
    prepare({ title, city, year, media }) {
      const parts = [city, year].filter(Boolean);
      return {
        title: title ?? 'Sin título',
        subtitle: parts.length > 0 ? parts.join(' · ') : undefined,
        media,
      };
    },
  },
});
