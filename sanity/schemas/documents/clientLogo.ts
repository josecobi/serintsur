import { defineField, defineType } from 'sanity';

export const clientLogo = defineType({
  name: 'clientLogo',
  title: 'Logo de Cliente',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre del cliente',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'url', title: 'Web del cliente (opcional)', type: 'url' }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
    defineField({ name: 'isActive', title: 'Visible', type: 'boolean', initialValue: true }),
  ],
  orderings: [
    { title: 'Orden manual', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
});
