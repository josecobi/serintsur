import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem()
        .title('Configuración del sitio')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Configuración del sitio'),
        ),
      S.divider(),
      S.documentTypeListItem('service').title('Servicios'),
      S.documentTypeListItem('project').title('Proyectos'),
      S.documentTypeListItem('page').title('Páginas'),
      S.divider(),
      S.documentTypeListItem('clientLogo').title('Logos de clientes'),
      S.documentTypeListItem('testimonial').title('Testimonios'),
    ]);
