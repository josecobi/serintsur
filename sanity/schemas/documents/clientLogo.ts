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
    defineField({
      name: 'logoVariant',
      title: 'Variante del logo',
      type: 'string',
      options: {
        list: [
          { title: 'Oscuro sobre transparente (normal)', value: 'dark' },
          { title: 'Blanco sobre transparente (invertir para fondo claro)', value: 'light' },
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
      description: 'Usa "blanco" si el logo tiene letras blancas sobre fondo transparente (p.ej. Norauto).',
    }),
    defineField({
      name: 'showName',
      title: 'Mostrar nombre debajo del logo',
      type: 'boolean',
      initialValue: false,
      description: 'Actívalo cuando el logo sea difícil de leer a tamaño pequeño (p.ej. Covijerez).',
    }),
    defineField({
      name: 'logoSize',
      title: 'Tamaño del logo',
      type: 'string',
      options: {
        list: [
          { title: 'Pequeño (32px)', value: 'sm' },
          { title: 'Normal (48px)', value: 'md' },
          { title: 'Grande (64px)', value: 'lg' },
          { title: 'Muy grande (80px)', value: 'xl' },
        ],
        layout: 'radio',
      },
      initialValue: 'md',
      description: 'Ajusta si el logo aparece demasiado pequeño o grande respecto al resto.',
    }),
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
