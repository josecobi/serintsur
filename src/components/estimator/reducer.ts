/**
 * Estimator state machine.
 *
 * Per `docs/agents/backend.md`, the estimator uses `useReducer` (not
 * `useState`) so the step transitions are explicit and easy to reason about.
 */

import { AREA_DEFAULT } from './priceMatrix';
import type {
  ContactInfo,
  LocationKey,
  ProjectTypeKey,
  QualityKey,
  SubmitState,
} from './types';

export type Step = 1 | 2 | 3 | 4 | 5 | 'result';

export interface EstimatorState {
  step: Step;
  projectType: ProjectTypeKey | null;
  area: number;
  quality: QualityKey | null;
  location: LocationKey | null;
  /** Free-text populated only when location === 'other'. Empty otherwise. */
  otherLocationLabel: string;
  contact: ContactInfo;
  submit: SubmitState;
}

export const initialState: EstimatorState = {
  step: 1,
  projectType: null,
  area: AREA_DEFAULT,
  quality: null,
  location: null,
  otherLocationLabel: '',
  contact: { name: '', phone: '', email: '', notes: '' },
  submit: { status: 'idle' },
};

export type EstimatorAction =
  | { type: 'SET_PROJECT_TYPE'; value: ProjectTypeKey }
  | { type: 'SET_AREA'; value: number }
  | { type: 'SET_QUALITY'; value: QualityKey }
  | { type: 'SET_LOCATION'; value: LocationKey }
  | { type: 'SET_OTHER_LOCATION_LABEL'; value: string }
  | { type: 'SET_CONTACT_FIELD'; field: keyof ContactInfo; value: string }
  | { type: 'GO_TO_STEP'; step: Step }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; whatsappUrl: string }
  | { type: 'SUBMIT_ERROR'; message: string }
  | { type: 'RESET' };

export function reducer(state: EstimatorState, action: EstimatorAction): EstimatorState {
  switch (action.type) {
    case 'SET_PROJECT_TYPE':
      return { ...state, projectType: action.value };
    case 'SET_AREA':
      return { ...state, area: action.value };
    case 'SET_QUALITY':
      return { ...state, quality: action.value };
    case 'SET_LOCATION':
      return {
        ...state,
        location: action.value,
        // Clear freetext when switching away from "other".
        otherLocationLabel: action.value === 'other' ? state.otherLocationLabel : '',
      };
    case 'SET_OTHER_LOCATION_LABEL':
      return { ...state, otherLocationLabel: action.value };
    case 'SET_CONTACT_FIELD':
      return {
        ...state,
        contact: { ...state.contact, [action.field]: action.value },
      };
    case 'GO_TO_STEP':
      return { ...state, step: action.step };
    case 'NEXT_STEP':
      return { ...state, step: nextStep(state.step) };
    case 'PREV_STEP':
      return { ...state, step: prevStep(state.step) };
    case 'SUBMIT_START':
      return { ...state, submit: { status: 'submitting' } };
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        step: 'result',
        submit: { status: 'success', whatsappUrl: action.whatsappUrl },
      };
    case 'SUBMIT_ERROR':
      return {
        ...state,
        submit: { status: 'error', errorMessage: action.message },
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function nextStep(step: Step): Step {
  if (step === 'result') return 'result';
  if (step === 5) return 'result';
  return (step + 1) as Step;
}

function prevStep(step: Step): Step {
  if (step === 'result') return 5;
  if (step === 1) return 1;
  return (step - 1) as Step;
}

// ─────────────────────────────────────────────────────────────────────────────
// Guards — can this step proceed to the next?
// ─────────────────────────────────────────────────────────────────────────────

export function canAdvance(state: EstimatorState): boolean {
  switch (state.step) {
    case 1:
      return state.projectType !== null;
    case 2:
      return state.area > 0;
    case 3:
      return state.quality !== null;
    case 4:
      if (state.location === null) return false;
      if (state.location === 'other') return state.otherLocationLabel.trim().length > 0;
      return true;
    case 5:
      return (
        state.contact.name.trim().length >= 2 &&
        state.contact.phone.trim().length >= 6
      );
    default:
      return false;
  }
}
