# Sanity CMS Schema — Serintsur

## Content Types

### 1. `service` — Service Pages

```typescript
{
  name: 'service',
  title: 'Servicio',
  type: 'document',
  fields: [
    { name: 'title', type: 'localeString', title: 'Título' },
    { name: 'slug', type: 'slug', title: 'URL Slug', options: { source: 'title.es' } },
    { name: 'description', type: 'localeText', title: 'Descripción corta' },
    { name: 'body', type: 'localeBlockContent', title: 'Contenido' },
    { name: 'icon', type: 'string', title: 'Icono (Lucide name)', description: 'e.g. "building-2", "paint-roller"' },
    { name: 'heroImage', type: 'image', title: 'Imagen principal', options: { hotspot: true } },
    { name: 'gallery', type: 'array', of: [{ type: 'image' }], title: 'Galería' },
    { name: 'features', type: 'array', of: [{ type: 'localeString' }], title: 'Características' },
    { name: 'order', type: 'number', title: 'Orden en navegación' },
    { name: 'isActive', type: 'boolean', title: 'Visible en web', initialValue: true },
    { name: 'seo', type: 'seo', title: 'SEO' },
  ],
}
```

### 2. `project` — Portfolio Projects

```typescript
{
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  fields: [
    { name: 'title', type: 'localeString', title: 'Título del proyecto' },
    { name: 'slug', type: 'slug', title: 'URL Slug', options: { source: 'title.es' } },
    { name: 'description', type: 'localeText', title: 'Descripción' },
    { name: 'body', type: 'localeBlockContent', title: 'Detalle del proyecto' },
    { name: 'service', type: 'reference', to: [{ type: 'service' }], title: 'Tipo de servicio' },
    { name: 'location', type: 'object', title: 'Ubicación', fields: [
      { name: 'city', type: 'string', title: 'Ciudad' },
      { name: 'province', type: 'string', title: 'Provincia', options: {
        list: ['Cádiz', 'Málaga', 'Sevilla'],
      }},
    ]},
    { name: 'year', type: 'number', title: 'Año' },
    { name: 'client', type: 'string', title: 'Cliente (opcional)' },
    { name: 'area', type: 'number', title: 'Superficie (m²)' },
    { name: 'duration', type: 'string', title: 'Duración (e.g. "3 meses")' },
    { name: 'status', type: 'string', title: 'Estado', options: {
      list: ['completed', 'in_progress', 'upcoming'],
    }},
    { name: 'mainImage', type: 'image', title: 'Imagen principal', options: { hotspot: true } },
    { name: 'gallery', type: 'array', of: [{ type: 'image' }], title: 'Galería de fotos' },
    { name: 'beforeAfter', type: 'object', title: 'Antes/Después', fields: [
      { name: 'before', type: 'image', title: 'Antes' },
      { name: 'after', type: 'image', title: 'Después' },
    ]},
    { name: 'featured', type: 'boolean', title: 'Destacado en home', initialValue: false },
    { name: 'order', type: 'number', title: 'Orden (para proyectos destacados)' },
    { name: 'seo', type: 'seo', title: 'SEO' },
  ],
}
```

### 3. `clientLogo` — Client Trust Bar

```typescript
{
  name: 'clientLogo',
  title: 'Logo de Cliente',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', title: 'Nombre del cliente' },
    { name: 'logo', type: 'image', title: 'Logo', options: { hotspot: true } },
    { name: 'url', type: 'url', title: 'Web del cliente (opcional)' },
    { name: 'order', type: 'number', title: 'Orden' },
    { name: 'isActive', type: 'boolean', title: 'Visible', initialValue: true },
  ],
}
```

### 4. `testimonial` — Client Testimonials (Phase 2)

```typescript
{
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  fields: [
    { name: 'author', type: 'string', title: 'Nombre' },
    { name: 'role', type: 'string', title: 'Cargo/Empresa' },
    { name: 'quote', type: 'localeText', title: 'Testimonio' },
    { name: 'rating', type: 'number', title: 'Puntuación (1-5)', validation: r => r.min(1).max(5) },
    { name: 'project', type: 'reference', to: [{ type: 'project' }], title: 'Proyecto relacionado' },
    { name: 'isActive', type: 'boolean', title: 'Visible', initialValue: true },
  ],
}
```

### 5. `siteSettings` — Global Settings (Singleton)

```typescript
{
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  fields: [
    { name: 'companyName', type: 'string', title: 'Nombre de empresa' },
    { name: 'tagline', type: 'localeString', title: 'Eslogan' },
    { name: 'phone', type: 'string', title: 'Teléfono' },
    { name: 'email', type: 'string', title: 'Email' },
    { name: 'address', type: 'text', title: 'Dirección' },
    { name: 'whatsappNumber', type: 'string', title: 'WhatsApp (con prefijo +34)' },
    { name: 'socialLinks', type: 'object', title: 'Redes sociales', fields: [
      { name: 'instagram', type: 'url' },
      { name: 'facebook', type: 'url' },
      { name: 'linkedin', type: 'url' },
      { name: 'google', type: 'url', title: 'Google Business Profile' },
    ]},
    { name: 'logo', type: 'image', title: 'Logo' },
    { name: 'logoWhite', type: 'image', title: 'Logo (versión blanca)' },
    { name: 'cif', type: 'string', title: 'CIF' },
    { name: 'stats', type: 'object', title: 'Cifras destacadas', fields: [
      { name: 'projectsCompleted', type: 'number', title: 'Proyectos completados' },
      { name: 'yearsExperience', type: 'number', title: 'Años de experiencia' },
      { name: 'teamSize', type: 'number', title: 'Tamaño del equipo' },
      { name: 'citiesCovered', type: 'number', title: 'Ciudades' },
    ]},
  ],
}
```

### 6. `page` — Generic Pages (About, etc.)

```typescript
{
  name: 'page',
  title: 'Página',
  type: 'document',
  fields: [
    { name: 'title', type: 'localeString', title: 'Título' },
    { name: 'slug', type: 'slug', title: 'URL Slug', options: { source: 'title.es' } },
    { name: 'body', type: 'localeBlockContent', title: 'Contenido' },
    { name: 'seo', type: 'seo', title: 'SEO' },
  ],
}
```

## Shared Schema Types

### `localeString` — Translated String

```typescript
{
  name: 'localeString',
  title: 'Translated String',
  type: 'object',
  fields: [
    { name: 'es', type: 'string', title: 'Español' },
    { name: 'en', type: 'string', title: 'English' },
    { name: 'de', type: 'string', title: 'Deutsch' },
  ],
}
```

### `localeText` — Translated Text (multiline)

Same as above but with `type: 'text'` fields.

### `localeBlockContent` — Translated Rich Text

Same pattern but with `type: 'array', of: [{ type: 'block' }, { type: 'image' }]` fields.

### `seo` — SEO Fields

```typescript
{
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    { name: 'metaTitle', type: 'localeString', title: 'Meta Title' },
    { name: 'metaDescription', type: 'localeText', title: 'Meta Description' },
    { name: 'ogImage', type: 'image', title: 'Open Graph Image' },
    { name: 'noIndex', type: 'boolean', title: 'No indexar', initialValue: false },
  ],
}
```

## GROQ Queries (Common)

```groq
// Featured projects for home page
*[_type == "project" && featured == true] | order(order asc) {
  title,
  slug,
  description,
  mainImage,
  service->{ title, slug },
  location,
  year,
  status
}

// All services (active, ordered)
*[_type == "service" && isActive == true] | order(order asc) {
  title,
  slug,
  description,
  icon,
  heroImage
}

// Projects filtered by service and province
*[_type == "project" && service._ref == $serviceId && location.province == $province] | order(year desc) {
  ...
}

// Site settings (singleton)
*[_type == "siteSettings"][0]
```

## Sanity Studio Customization

- Custom desk structure: group content by type (Services, Projects, Settings)
- Custom input for `localeString` — tabbed interface showing ES/EN/DE side by side
- Preview pane showing how the card/page will look
- "Traducir con IA" button on locale fields (Phase 2 — triggers Claude API)
- Dashboard widget showing recent leads from `/api/contact` (Phase 2)
