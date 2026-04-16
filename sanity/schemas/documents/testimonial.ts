import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Nombre',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'role', title: 'Cargo / Empresa', type: 'string' }),
    defineField({
      name: 'quote',
      title: 'Testimonio',
      type: 'localeText',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Puntuación (1-5)',
      type: 'number',
      validation: (r) => r.min(1).max(5).integer(),
    }),
    defineField({
      name: 'project',
      title: 'Proyecto relacionado',
      type: 'reference',
      to: [{ type: 'project' }],
    }),
    defineField({ name: 'isActive', title: 'Visible', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'role' },
  },
});
