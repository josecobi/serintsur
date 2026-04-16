/**
 * Pure helpers for deriving filter options and applying filter state.
 *
 * Separated from the React component so the logic is trivially testable and
 * can be reused (e.g. for a future "related projects" widget).
 */

import type { Province } from '~/lib/sanity';

import type { ProjectCardData, ProjectFilterValue } from './types';

export interface ServiceOption {
  id: string;
  title: string;
  slug: string;
}

export function getServiceOptions(projects: ProjectCardData[]): ServiceOption[] {
  const seen = new Map<string, ServiceOption>();
  for (const p of projects) {
    if (!p.serviceId || !p.serviceTitle || seen.has(p.serviceId)) continue;
    seen.set(p.serviceId, {
      id: p.serviceId,
      title: p.serviceTitle,
      slug: p.serviceSlug ?? '',
    });
  }
  return [...seen.values()].sort((a, b) => a.title.localeCompare(b.title, 'es'));
}

export function getProvinceOptions(projects: ProjectCardData[]): Province[] {
  const seen = new Set<Province>();
  for (const p of projects) {
    if (p.province) seen.add(p.province);
  }
  return [...seen].sort();
}

export function getYearOptions(projects: ProjectCardData[]): number[] {
  const seen = new Set<number>();
  for (const p of projects) {
    if (typeof p.year === 'number') seen.add(p.year);
  }
  return [...seen].sort((a, b) => b - a);
}

export function applyFilter(
  projects: ProjectCardData[],
  filter: ProjectFilterValue,
): ProjectCardData[] {
  return projects.filter((p) => {
    if (filter.serviceId && p.serviceId !== filter.serviceId) return false;
    if (filter.province && p.province !== filter.province) return false;
    if (filter.year && p.year !== filter.year) return false;
    return true;
  });
}
