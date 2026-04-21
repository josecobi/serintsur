import { createClient, type ClientConfig, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { PortableTextBlock } from '@portabletext/types';

import { DEFAULT_LOCALE, type Locale } from './i18n';

// Re-exported so callers can `import { Locale } from '~/lib/sanity'` without jumping files.
export { DEFAULT_LOCALE, type Locale };

// ─────────────────────────────────────────────────────────────────────────────
// Client
// ─────────────────────────────────────────────────────────────────────────────

const config: ClientConfig = {
  projectId: import.meta.env.SANITY_PROJECT_ID || 'placeholder',
  dataset: import.meta.env.SANITY_DATASET || 'production',
  apiVersion: import.meta.env.SANITY_API_VERSION || '2025-01-01',
  // CDN for public reads during static build. Preview mode bypasses via createPreviewClient.
  useCdn: true,
  // Token only needed for drafts / preview / writes. Omit for public reads.
  token: import.meta.env.SANITY_TOKEN || undefined,
  perspective: 'published',
};

export const sanity: SanityClient = createClient(config);

/**
 * Preview client — bypasses CDN, includes drafts. Use for preview routes only.
 * Requires SANITY_TOKEN with viewer perspective access.
 */
export const sanityPreview: SanityClient = createClient({
  ...config,
  useCdn: false,
  perspective: 'previewDrafts',
});

// ─────────────────────────────────────────────────────────────────────────────
// Image URL builder
// ─────────────────────────────────────────────────────────────────────────────

const builder = imageUrlBuilder(sanity);

export function urlForImage(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max');
}

/**
 * Null-safe image URL builder. Returns `undefined` when the source is missing,
 * the image field exists but has no uploaded asset (`asset: null` /
 * `asset._ref` undefined — a real editor state in Sanity), or the underlying
 * `@sanity/image-url` library fails for any other reason (malformed ref,
 * unparseable dimensions, etc.).
 *
 * Prefer this over bare `urlForImage(...)` at render sites; the raw builder
 * is still exported for chained transforms that don't fit this helper's shape.
 */
export function safeImageUrl(
  source: SanityImage | undefined | null,
  width?: number,
): string | undefined {
  // Fast path: most "missing image" cases are caught here without touching
  // the builder at all.
  if (!source || !source.asset) return undefined;
  // Asset can be a bare reference (`{_ref, _type}`) or a fully dereferenced
  // asset (`{_id, ...}` via GROQ `asset->{...}`). Accept either.
  const asset = source.asset as { _ref?: string; _id?: string };
  if (!asset._ref && !asset._id) return undefined;

  // Belt-and-suspenders: `@sanity/image-url` has edge cases (malformed refs,
  // unparseable dimensions) where it throws "Unable to resolve image URL from
  // source (null)" even when the source *looks* valid. A missing image is
  // always preferable to a crashed page.
  try {
    let pipeline = urlForImage(source);
    if (width !== undefined) pipeline = pipeline.width(width);
    return pipeline.url();
  } catch (error) {
    console.warn('[safeImageUrl] failed to build URL:', error);
    return undefined;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Locale helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Pick the value for `locale` from a locale* object, falling back to Spanish. */
export function pickLocale<T>(
  field: Partial<Record<Locale, T>> | undefined,
  locale: Locale,
): T | undefined {
  if (!field) return undefined;
  return field[locale] ?? field[DEFAULT_LOCALE];
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared types (mirror the Sanity schemas in sanity/schemas/)
// ─────────────────────────────────────────────────────────────────────────────

export interface LocaleString {
  es?: string;
  en?: string;
  de?: string;
}

export interface LocaleText extends LocaleString {}

export interface LocaleBlockContent {
  es?: PortableTextBlock[];
  en?: PortableTextBlock[];
  de?: PortableTextBlock[];
}

export interface SanityImage {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
  caption?: string;
}

export interface SanitySlug {
  current: string;
}

export interface SeoFields {
  metaTitle?: LocaleString;
  metaDescription?: LocaleText;
  ogImage?: SanityImage;
  noIndex?: boolean;
}

export interface Service {
  _id: string;
  _type: 'service';
  title: LocaleString;
  slug: SanitySlug;
  description?: LocaleText;
  body?: LocaleBlockContent;
  icon?: string;
  heroImage?: SanityImage;
  gallery?: SanityImage[];
  features?: LocaleString[];
  order?: number;
  isActive: boolean;
  seo?: SeoFields;
}

export type Province = 'Cádiz' | 'Málaga' | 'Sevilla';
export type ProjectStatus = 'completed' | 'in_progress' | 'upcoming';

export interface ProjectLocation {
  city?: string;
  province?: Province;
}

export interface Project {
  _id: string;
  _type: 'project';
  title: LocaleString;
  slug: SanitySlug;
  description?: LocaleText;
  body?: LocaleBlockContent;
  service?: { _ref: string; _type: 'reference' } | ServiceRef;
  location?: ProjectLocation;
  year?: number;
  client?: string;
  area?: number;
  duration?: string;
  status?: ProjectStatus;
  mainImage?: SanityImage;
  gallery?: SanityImage[];
  beforeAfter?: { before?: SanityImage; after?: SanityImage };
  featured?: boolean;
  order?: number;
  seo?: SeoFields;
}

/** Dereferenced service on a project (via GROQ `service->{...}`). */
export interface ServiceRef {
  _id: string;
  title: LocaleString;
  slug: SanitySlug;
  icon?: string;
}

export interface ClientLogo {
  _id: string;
  _type: 'clientLogo';
  name: string;
  logo: SanityImage;
  url?: string;
  logoVariant?: 'light' | 'dark';
  showName?: boolean;
  order?: number;
  isActive: boolean;
}

export interface Testimonial {
  _id: string;
  _type: 'testimonial';
  author: string;
  role?: string;
  quote: LocaleText;
  rating?: number;
  project?: { _ref: string; _type: 'reference' };
  isActive: boolean;
}

export interface SiteSettings {
  _id: string;
  _type: 'siteSettings';
  companyName?: string;
  tagline?: LocaleString;
  phone?: string;
  email?: string;
  address?: string;
  whatsappNumber?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    google?: string;
  };
  logo?: SanityImage;
  logoWhite?: SanityImage;
  heroImage?: SanityImage;
  cif?: string;
  stats?: {
    projectsCompleted?: number;
    yearsExperience?: number;
    teamSize?: number;
    citiesCovered?: number;
  };
}

export interface Page {
  _id: string;
  _type: 'page';
  title: LocaleString;
  slug: SanitySlug;
  body?: LocaleBlockContent;
  seo?: SeoFields;
}

// ─────────────────────────────────────────────────────────────────────────────
// GROQ query fragments
// ─────────────────────────────────────────────────────────────────────────────

const SERVICE_REF_PROJECTION = `{ _id, title, slug, icon }`;
const SEO_PROJECTION = `{ metaTitle, metaDescription, ogImage, noIndex }`;

const SERVICE_CARD_PROJECTION = `{
  _id,
  title,
  slug,
  description,
  icon,
  heroImage,
  order
}`;

const PROJECT_CARD_PROJECTION = `{
  _id,
  title,
  slug,
  description,
  mainImage,
  year,
  status,
  location,
  "service": service->${SERVICE_REF_PROJECTION}
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Query helpers
// ─────────────────────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanity.fetch<SiteSettings | null>(`*[_type == "siteSettings"][0]`);
}

export async function getActiveServices(): Promise<Service[]> {
  return sanity.fetch<Service[]>(
    `*[_type == "service" && isActive == true] | order(order asc) ${SERVICE_CARD_PROJECTION}`,
  );
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return sanity.fetch<Service | null>(
    `*[_type == "service" && slug.current == $slug][0]{
      ...,
      "seo": seo${SEO_PROJECTION}
    }`,
    { slug },
  );
}

export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  return sanity.fetch<Project[]>(
    `*[_type == "project" && featured == true] | order(order asc, year desc) [0...$limit] ${PROJECT_CARD_PROJECTION}`,
    { limit },
  );
}

export interface ProjectFilters {
  serviceId?: string;
  province?: Province;
  year?: number;
}

export async function getProjects(filters: ProjectFilters = {}): Promise<Project[]> {
  const conditions = ['_type == "project"'];
  const params: Record<string, unknown> = {};

  if (filters.serviceId) {
    conditions.push('service._ref == $serviceId');
    params.serviceId = filters.serviceId;
  }
  if (filters.province) {
    conditions.push('location.province == $province');
    params.province = filters.province;
  }
  if (filters.year) {
    conditions.push('year == $year');
    params.year = filters.year;
  }

  const query = `*[${conditions.join(' && ')}] | order(year desc, order asc) ${PROJECT_CARD_PROJECTION}`;
  return sanity.fetch<Project[]>(query, params);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return sanity.fetch<Project | null>(
    `*[_type == "project" && slug.current == $slug][0]{
      ...,
      "service": service->${SERVICE_REF_PROJECTION},
      "seo": seo${SEO_PROJECTION}
    }`,
    { slug },
  );
}

export async function getAllProjectSlugs(): Promise<string[]> {
  return sanity.fetch<string[]>(`*[_type == "project" && defined(slug.current)].slug.current`);
}

export async function getAllServiceSlugs(): Promise<string[]> {
  return sanity.fetch<string[]>(
    `*[_type == "service" && isActive == true && defined(slug.current)].slug.current`,
  );
}

export async function getActiveClientLogos(): Promise<ClientLogo[]> {
  return sanity.fetch<ClientLogo[]>(
    `*[_type == "clientLogo" && isActive == true] | order(order asc) { _id, name, logo, url, logoVariant, showName, order }`,
  );
}

export async function getActiveTestimonials(): Promise<Testimonial[]> {
  return sanity.fetch<Testimonial[]>(
    `*[_type == "testimonial" && isActive == true] { _id, author, role, quote, rating, project }`,
  );
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  return sanity.fetch<Page | null>(
    `*[_type == "page" && slug.current == $slug][0]{
      ...,
      "seo": seo${SEO_PROJECTION}
    }`,
    { slug },
  );
}
