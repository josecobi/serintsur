/**
 * Server-side mapper: Sanity `Project[]` → client-safe `ProjectCardData[]`.
 *
 * Runs in Astro pages (import.meta.env is server-scoped there) so the Sanity
 * image URL builder and the locale fallback chain stay off the client bundle.
 */

import {
  pickLocale,
  urlForImage,
  type Locale,
  type Project,
  type ServiceRef,
} from '~/lib/sanity';

import type { ProjectCardData } from './types';

const CARD_IMAGE_WIDTH = 800;

export function projectsToCardData(
  projects: Project[],
  locale: Locale,
): ProjectCardData[] {
  return projects.map((project) => {
    const title = pickLocale(project.title, locale) ?? '';
    const description = pickLocale(project.description, locale);
    const service = isServiceRef(project.service) ? project.service : undefined;
    const serviceTitle = service ? pickLocale(service.title, locale) : undefined;
    const imageUrl = project.mainImage
      ? urlForImage(project.mainImage).width(CARD_IMAGE_WIDTH).url()
      : undefined;

    return {
      id: project._id,
      title,
      slug: project.slug.current,
      description: description ?? undefined,
      imageUrl,
      imageAlt: project.mainImage?.alt ?? title,
      year: project.year,
      status: project.status,
      city: project.location?.city,
      province: project.location?.province,
      serviceId: service?._id,
      serviceTitle,
      serviceSlug: service?.slug.current,
    };
  });
}

function isServiceRef(
  service: Project['service'] | undefined,
): service is ServiceRef {
  // A bare `{ _ref, _type }` reference means the GROQ query didn't dereference.
  // Only ServiceRef has `title` — safe discriminator.
  return !!service && 'title' in service;
}
