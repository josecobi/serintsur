/**
 * Estimator — multi-step quote form.
 *
 * Orchestrator only: owns `useReducer`, routes between steps, computes the
 * estimate from the price matrix when the user reaches the result screen,
 * and POSTs to `/api/estimate`. All visual primitives (step cards, buttons,
 * progress bar) are intentionally minimal — the Designer restyles via the
 * `estimator-*` data attributes and class hooks.
 */

import { useMemo, useReducer } from 'react';

import { getStrings, type Locale } from '~/lib/i18n';

import { submitEstimate } from './api';
import { calculateEstimate } from './priceMatrix';
import { canAdvance, initialState, reducer, type Step } from './reducer';
import { StepArea } from './steps/StepArea';
import { StepContact } from './steps/StepContact';
import { StepLocation } from './steps/StepLocation';
import { StepProjectType } from './steps/StepProjectType';
import { StepQuality } from './steps/StepQuality';
import { StepResults } from './steps/StepResults';

export interface EstimatorProps {
  /** Page locale — drives UI strings and the `language` field sent to `/api/estimate`. */
  language: Locale;
}

const TOTAL_STEPS = 5;

export default function Estimator({ language }: EstimatorProps) {
  const t = useMemo(() => getStrings(language), [language]);
  const [state, dispatch] = useReducer(reducer, initialState);

  // Computed once we have all four matrix inputs. Everything before the
  // contact step guarantees these, but we guard anyway so TS stays happy.
  const result = useMemo(() => {
    if (!state.projectType || !state.quality || !state.location) return null;
    return calculateEstimate(state.projectType, state.quality, state.area, state.location);
  }, [state.projectType, state.quality, state.location, state.area]);

  const handleSubmit = async () => {
    if (!state.projectType || !state.quality || !state.location || !result) return;
    dispatch({ type: 'SUBMIT_START' });
    try {
      const response = await submitEstimate({
        projectType: state.projectType,
        quality: state.quality,
        area: state.area,
        location: state.location,
        otherLocationLabel: state.otherLocationLabel,
        result,
        contact: {
          name: state.contact.name,
          phone: state.contact.phone,
          email: state.contact.email,
          notes: state.contact.notes,
        },
        language,
      });
      dispatch({ type: 'SUBMIT_SUCCESS', whatsappUrl: response.whatsappUrl });
    } catch (err) {
      const message = err instanceof Error ? err.message : t.estimator.result.disclaimer;
      dispatch({ type: 'SUBMIT_ERROR', message });
    }
  };

  const isResult = state.step === 'result';
  const progressStep: Step = isResult ? 5 : state.step;
  const submitting = state.submit.status === 'submitting';

  return (
    <div className="estimator mx-auto max-w-2xl p-4 sm:p-6">
      {!isResult && (
        <div className="mb-6">
          <div className="flex gap-1">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => {
              const stepIndex = (i + 1) as Step;
              const active = stepIndex <= progressStep;
              return (
                <div
                  key={stepIndex}
                  className={
                    'h-1.5 flex-1 rounded-full transition ' +
                    (active ? 'bg-gray-900' : 'bg-gray-200')
                  }
                />
              );
            })}
          </div>
          <div className="mt-2 text-xs text-gray-600">
            {t.estimator.stepLabel} {progressStep} {t.estimator.of} {TOTAL_STEPS}
          </div>
        </div>
      )}

      <div className="estimator-card bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        {state.step === 1 && <StepProjectType state={state} dispatch={dispatch} t={t} />}
        {state.step === 2 && <StepArea state={state} dispatch={dispatch} t={t} />}
        {state.step === 3 && <StepQuality state={state} dispatch={dispatch} t={t} />}
        {state.step === 4 && <StepLocation state={state} dispatch={dispatch} t={t} />}
        {state.step === 5 && <StepContact state={state} dispatch={dispatch} t={t} />}
        {isResult && result && (
          <StepResults state={state} dispatch={dispatch} t={t} result={result} />
        )}

        {state.submit.status === 'error' && state.submit.errorMessage && (
          <div
            role="alert"
            className="mt-4 p-3 rounded-md border border-red-300 bg-red-50 text-sm text-red-800"
          >
            {state.submit.errorMessage}
          </div>
        )}

        {!isResult && (
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => dispatch({ type: 'PREV_STEP' })}
              disabled={state.step === 1 || submitting}
              className="estimator-nav-prev px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50"
            >
              {t.estimator.prev}
            </button>
            {typeof state.step === 'number' && state.step < 5 ? (
              <button
                type="button"
                onClick={() => dispatch({ type: 'NEXT_STEP' })}
                disabled={!canAdvance(state)}
                className="estimator-nav-next px-5 py-2 rounded-md bg-gray-900 text-white disabled:opacity-50"
              >
                {t.estimator.next}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canAdvance(state) || submitting}
                className="estimator-nav-submit px-5 py-2 rounded-md bg-gray-900 text-white disabled:opacity-50"
              >
                {submitting ? t.contact.submitting : t.estimator.getEstimate}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
