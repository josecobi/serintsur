/**
 * POST to `/api/estimate`, translating component-local keys to the Spanish
 * enum slugs the endpoint expects.
 *
 * The server owns validation; this function is a thin mapping + fetch wrapper.
 */

import type { Locale } from '~/lib/i18n';

import type { EstimateResult, LocationKey, ProjectTypeKey, QualityKey } from './types';

const PROJECT_TYPE_SLUG: Record<ProjectTypeKey, string> = {
  renovation: 'reforma_integral',
  facade: 'rehabilitacion_fachada',
  construction: 'construccion_nueva',
  maintenance: 'mantenimiento',
};

const QUALITY_SLUG: Record<QualityKey, string> = {
  basic: 'basica',
  mid: 'media',
  high: 'alta',
  premium: 'premium',
};

/** Human-readable location labels (Spanish; these travel to Jorge's WhatsApp). */
const LOCATION_LABEL: Record<LocationKey, string> = {
  jerez: 'Jerez de la Frontera',
  cadiz: 'Cádiz',
  chiclana: 'Chiclana',
  puertoSantaMaria: 'El Puerto de Santa María',
  rota: 'Rota',
  sanlucar: 'Sanlúcar de Barrameda',
  sanFernando: 'San Fernando',
  malaga: 'Málaga',
  estepona: 'Estepona',
  marbella: 'Marbella',
  sevilla: 'Sevilla',
  other: 'Otra ubicación',
};

export interface SubmitEstimatePayload {
  projectType: ProjectTypeKey;
  quality: QualityKey;
  area: number;
  location: LocationKey;
  /** Required when `location === 'other'`; ignored otherwise. */
  otherLocationLabel: string;
  result: EstimateResult;
  contact: {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
  };
  language: Locale;
}

export interface SubmitEstimateResponse {
  success: true;
  whatsappUrl: string;
  emailSent: boolean;
}

export interface SubmitEstimateError {
  error: string;
  code: number;
  issues?: Array<{ path: string; message: string }>;
}

export async function submitEstimate(
  payload: SubmitEstimatePayload,
): Promise<SubmitEstimateResponse> {
  const locationText =
    payload.location === 'other' && payload.otherLocationLabel.trim()
      ? `Otra: ${payload.otherLocationLabel.trim()}`
      : LOCATION_LABEL[payload.location];

  const body = {
    name: payload.contact.name.trim(),
    phone: payload.contact.phone.trim(),
    email: payload.contact.email?.trim() || undefined,
    projectType: PROJECT_TYPE_SLUG[payload.projectType],
    area: payload.area,
    quality: QUALITY_SLUG[payload.quality],
    location: locationText,
    priceLow: payload.result.low,
    priceHigh: payload.result.high,
    language: payload.language,
    notes: payload.contact.notes?.trim() || undefined,
  };

  const response = await fetch('/api/estimate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as SubmitEstimateError | null;
    throw new Error(err?.error ?? `Request failed (${response.status})`);
  }

  return (await response.json()) as SubmitEstimateResponse;
}
