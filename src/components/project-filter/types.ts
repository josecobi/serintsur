/**
 * Project-filter types.
 *
 * `ProjectCardData` is the client-safe, flat shape that lives in the React
 * bundle. Astro pages call `projectsToCardData` (in `./mapper.ts`) to convert
 * the richer Sanity `Project` documents into this shape at render time —
 * that keeps `SANITY_PROJECT_ID` server-only and image URL building out of
 * the client bundle.
 */

import type { ProjectStatus, Province } from '~/lib/sanity';

export interface ProjectCardData {
  id: string;
  /** Pre-resolved to the page locale; falls back to Spanish. */
  title: string;
  slug: string;
  /** Pre-resolved to the page locale; optional. */
  description?: string;
  /** Pre-built Sanity CDN URL (already sized + auto-format). */
  imageUrl?: string;
  imageAlt?: string;
  year?: number;
  status?: ProjectStatus;
  city?: string;
  province?: Province;
  serviceId?: string;
  serviceTitle?: string;
  serviceSlug?: string;
}

export interface ProjectFilterValue {
  serviceId: string | null;
  province: Province | null;
  year: number | null;
}

export const EMPTY_FILTER: ProjectFilterValue = {
  serviceId: null,
  province: null,
  year: null,
};
