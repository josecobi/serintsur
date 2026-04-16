/**
 * Price matrix for the estimator.
 *
 * Numbers are €/m² ranges — ⚠️ NEEDS CALIBRATION WITH JORGE before launch.
 * Values mirror `docs/ai-integrations.md`; if Jorge revises that file, update
 * this file in the same commit so the matrix stays in sync.
 *
 * The result is a non-binding ballpark shown alongside a prominent disclaimer
 * ("we need to visit to give an exact quote"). The real purpose of this tool
 * is lead qualification — a visitor who completes 5 steps is a warm lead.
 */

import type { LocationKey, ProjectTypeKey, QualityKey, EstimateResult } from './types';

/** €/m² low–high ranges per project type × quality tier. */
export const PRICE_MATRIX: Record<ProjectTypeKey, Record<QualityKey, [number, number]>> = {
  renovation: {
    basic: [400, 600],
    mid: [600, 900],
    high: [900, 1400],
    premium: [1400, 2200],
  },
  facade: {
    basic: [80, 120],
    mid: [120, 200],
    high: [200, 350],
    premium: [350, 550],
  },
  construction: {
    basic: [800, 1100],
    mid: [1100, 1500],
    high: [1500, 2200],
    premium: [2200, 3500],
  },
  maintenance: {
    basic: [30, 50],
    mid: [50, 80],
    high: [80, 130],
    premium: [130, 200],
  },
};

/** Location cost multipliers. Marbella/Málaga skew high; rural Cádiz baseline. */
export const LOCATION_MULTIPLIER: Record<LocationKey, number> = {
  jerez: 1.0,
  cadiz: 1.05,
  chiclana: 1.0,
  puertoSantaMaria: 1.0,
  rota: 1.02,
  sanlucar: 1.0,
  sanFernando: 1.0,
  malaga: 1.15,
  estepona: 1.12,
  marbella: 1.25,
  sevilla: 1.1,
  other: 1.08,
};

/** Area slider bounds (m²). Sliders use this range; manual input can override. */
export const AREA_MIN = 20;
export const AREA_MAX = 1000;
export const AREA_DEFAULT = 100;

/**
 * Round to the nearest 100€. Estimate precision doesn't warrant finer grain —
 * showing "€54,732" would imply accuracy we don't have.
 */
function roundToHundred(n: number): number {
  return Math.round(n / 100) * 100;
}

export function calculateEstimate(
  projectType: ProjectTypeKey,
  quality: QualityKey,
  area: number,
  location: LocationKey,
): EstimateResult {
  const [lowPerSqm, highPerSqm] = PRICE_MATRIX[projectType][quality];
  const multiplier = LOCATION_MULTIPLIER[location];
  return {
    low: roundToHundred(lowPerSqm * area * multiplier),
    high: roundToHundred(highPerSqm * area * multiplier),
  };
}
