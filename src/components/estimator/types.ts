/**
 * Estimator types shared across steps, reducer, and price matrix.
 *
 * UI keys (ProjectTypeKey, QualityKey, LocationKey) are the in-component
 * identifiers — they drive i18n lookups and state. When we submit to the
 * server, `src/components/estimator/api.ts` maps these to the Spanish enum
 * slugs the `/api/estimate` endpoint expects.
 */

export type ProjectTypeKey = 'renovation' | 'facade' | 'construction' | 'maintenance';

export type QualityKey = 'basic' | 'mid' | 'high' | 'premium';

export type LocationKey =
  | 'jerez'
  | 'cadiz'
  | 'chiclana'
  | 'puertoSantaMaria'
  | 'rota'
  | 'sanlucar'
  | 'sanFernando'
  | 'malaga'
  | 'estepona'
  | 'marbella'
  | 'sevilla'
  | 'other';

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export interface EstimateResult {
  low: number;
  high: number;
}

export interface SubmitState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  /** WhatsApp deep link returned by `/api/estimate` on success. */
  whatsappUrl?: string;
  /** Human-readable error surfaced to the UI on failure. */
  errorMessage?: string;
}
