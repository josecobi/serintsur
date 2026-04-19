import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  // Singleton: prevent multiple instances via desk structure (see sanity/structure.ts).
  fields: [
    defineField({
      name: 'companyName',
      title: 'Nombre de empresa',
      type: 'string',
      initialValue: 'Serintsur Multiservicios S.L.',
    }),
    defineField({ name: 'tagline', title: 'Eslogan', type: 'localeString' }),
    defineField({ name: 'phone', title: 'Teléfono', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'address', title: 'Dirección', type: 'text', rows: 3 }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp (con prefijo, p.ej. 34655634800)',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Redes sociales',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
        defineField({ name: 'google', title: 'Google Business Profile', type: 'url' }),
      ],
    }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'logoWhite',
      title: 'Logo (versión blanca)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen del hero (portada)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' }),
      ],
    }),
    defineField({ name: 'cif', title: 'CIF', type: 'string', initialValue: 'B11945391' }),
    defineField({
      name: 'stats',
      title: 'Cifras destacadas',
      type: 'object',
      fields: [
        defineField({ name: 'projectsCompleted', title: 'Proyectos completados', type: 'number' }),
        defineField({ name: 'yearsExperience', title: 'Años de experiencia', type: 'number' }),
        defineField({ name: 'teamSize', title: 'Tamaño del equipo', type: 'number' }),
        defineField({ name: 'citiesCovered', title: 'Ciudades', type: 'number' }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Configuración del sitio' }),
  },
});
