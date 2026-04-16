/**
 * ProjectFilter — client island for the /proyectos page.
 *
 * Hydrates with server-mapped `ProjectCardData[]` (see `./mapper.ts`) and owns
 * only the filter state + derived visible list. Card visuals are intentionally
 * minimal — Designer will restyle via the `.project-filter-*` class hooks.
 */

import { useMemo, useReducer } from 'react';

import { getStrings, interpolate, type Locale } from '~/lib/i18n';

import {
  applyFilter,
  getProvinceOptions,
  getServiceOptions,
  getYearOptions,
} from './filters';
import {
  EMPTY_FILTER,
  type ProjectCardData,
  type ProjectFilterValue,
} from './types';
import type { Province } from '~/lib/sanity';

export interface ProjectFilterProps {
  projects: ProjectCardData[];
  language: Locale;
}

type FilterAction =
  | { type: 'SET_SERVICE'; value: string | null }
  | { type: 'SET_PROVINCE'; value: Province | null }
  | { type: 'SET_YEAR'; value: number | null }
  | { type: 'RESET' };

function reducer(state: ProjectFilterValue, action: FilterAction): ProjectFilterValue {
  switch (action.type) {
    case 'SET_SERVICE':
      return { ...state, serviceId: action.value };
    case 'SET_PROVINCE':
      return { ...state, province: action.value };
    case 'SET_YEAR':
      return { ...state, year: action.value };
    case 'RESET':
      return EMPTY_FILTER;
  }
}

export default function ProjectFilter({ projects, language }: ProjectFilterProps) {
  const t = useMemo(() => getStrings(language), [language]);
  const [filter, dispatch] = useReducer(reducer, EMPTY_FILTER);

  // Options derive from the full project list so users see every dimension,
  // not just the ones that survived the current filter (avoids dead-ends).
  const serviceOptions = useMemo(() => getServiceOptions(projects), [projects]);
  const provinceOptions = useMemo(() => getProvinceOptions(projects), [projects]);
  const yearOptions = useMemo(() => getYearOptions(projects), [projects]);

  const visible = useMemo(() => applyFilter(projects, filter), [projects, filter]);

  const hasActiveFilter =
    filter.serviceId !== null || filter.province !== null || filter.year !== null;

  return (
    <div className="project-filter-root">
      <div className="project-filter-controls flex flex-wrap gap-3 mb-6">
        <label className="project-filter-control flex flex-col text-sm">
          <span className="text-gray-600 mb-1">{t.projectFilter.byService}</span>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 bg-white min-w-[180px]"
            value={filter.serviceId ?? ''}
            onChange={(e) =>
              dispatch({ type: 'SET_SERVICE', value: e.target.value || null })
            }
          >
            <option value="">{t.projectFilter.all}</option>
            {serviceOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>

        <label className="project-filter-control flex flex-col text-sm">
          <span className="text-gray-600 mb-1">{t.projectFilter.byProvince}</span>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 bg-white min-w-[160px]"
            value={filter.province ?? ''}
            onChange={(e) =>
              dispatch({
                type: 'SET_PROVINCE',
                value: (e.target.value as Province) || null,
              })
            }
          >
            <option value="">{t.projectFilter.all}</option>
            {provinceOptions.map((p) => (
              <option key={p} value={p}>
                {t.provinces[p]}
              </option>
            ))}
          </select>
        </label>

        <label className="project-filter-control flex flex-col text-sm">
          <span className="text-gray-600 mb-1">{t.projectFilter.byYear}</span>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 bg-white min-w-[120px]"
            value={filter.year ?? ''}
            onChange={(e) =>
              dispatch({
                type: 'SET_YEAR',
                value: e.target.value ? Number(e.target.value) : null,
              })
            }
          >
            <option value="">{t.projectFilter.all}</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        {hasActiveFilter && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'RESET' })}
            className="project-filter-reset self-end text-sm text-gray-600 hover:text-gray-900 underline px-2 py-2"
          >
            {t.projectFilter.reset}
          </button>
        )}
      </div>

      <div
        className="project-filter-count text-sm text-gray-600 mb-4"
        aria-live="polite"
      >
        {interpolate(t.projectFilter.resultsCount, { count: visible.length })}
      </div>

      {visible.length === 0 ? (
        <div className="project-filter-empty text-gray-600 border border-dashed border-gray-300 rounded-lg p-8 text-center">
          {t.projectFilter.noResults}
        </div>
      ) : (
        <ul className="project-filter-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((project) => (
            <li key={project.id} className="project-filter-card">
              <ProjectCard project={project} t={t} language={language} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: ProjectCardData;
  t: ReturnType<typeof getStrings>;
  language: Locale;
}

function ProjectCard({ project, t, language }: ProjectCardProps) {
  const href = `/${language}/proyectos/${project.slug}`;
  const locationLabel = [project.city, project.province && t.provinces[project.province]]
    .filter(Boolean)
    .join(', ');

  return (
    <a
      href={href}
      className="project-filter-card-link group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-900 transition-colors"
    >
      <div className="project-filter-card-media aspect-[4/3] bg-gray-100 overflow-hidden">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.imageAlt ?? project.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
          />
        ) : null}
      </div>
      <div className="project-filter-card-body p-4">
        <h3 className="project-filter-card-title font-semibold text-base mb-1 line-clamp-2">
          {project.title}
        </h3>
        <div className="project-filter-card-meta text-xs text-gray-500 flex flex-wrap gap-x-2 gap-y-1">
          {project.serviceTitle && (
            <span className="project-filter-card-service">{project.serviceTitle}</span>
          )}
          {locationLabel && (
            <>
              <span aria-hidden="true">·</span>
              <span className="project-filter-card-location">{locationLabel}</span>
            </>
          )}
          {project.year && (
            <>
              <span aria-hidden="true">·</span>
              <span className="project-filter-card-year">{project.year}</span>
            </>
          )}
          {project.status && (
            <>
              <span aria-hidden="true">·</span>
              <span className="project-filter-card-status">
                {t.status[project.status]}
              </span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}
