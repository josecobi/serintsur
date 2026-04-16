import type { UIStrings } from '~/lib/i18n';

import type { EstimatorAction, EstimatorState } from '../reducer';
import type { EstimateResult } from '../types';

interface Props {
  state: EstimatorState;
  dispatch: React.Dispatch<EstimatorAction>;
  t: UIStrings;
  result: EstimateResult;
}

export function StepResults({ state, dispatch, t, result }: Props) {
  const euros = (n: number) => n.toLocaleString('es-ES');

  const handleWhatsApp = () => {
    if (state.submit.whatsappUrl) {
      window.open(state.submit.whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="estimator-step" data-step="result">
      <h2 className="text-2xl font-semibold mb-2">{t.estimator.result.heading}</h2>
      <div className="mt-4 p-6 rounded-xl bg-gray-50 border border-gray-200">
        <div className="text-sm text-gray-600 mb-1">{t.estimator.result.priceRange}</div>
        <div className="text-3xl sm:text-4xl font-semibold">
          {euros(result.low)}€ – {euros(result.high)}€
        </div>
        <p className="mt-3 text-sm text-gray-600">{t.estimator.result.disclaimer}</p>
      </div>

      <div className="mt-4 text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {state.projectType && (
          <div>
            <strong>{t.estimator.steps.projectType}</strong>{' '}
            {t.estimator.projectTypes[state.projectType]}
          </div>
        )}
        <div>
          <strong>{t.estimator.areaLabel}:</strong> {state.area} {t.estimator.areaUnit}
        </div>
        {state.quality && (
          <div>
            <strong>{t.estimator.steps.quality}</strong> {t.estimator.quality[state.quality]}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleWhatsApp}
          disabled={!state.submit.whatsappUrl}
          className="estimator-cta-primary px-5 py-3 rounded-md bg-gray-900 text-white font-medium disabled:opacity-50"
        >
          {t.estimator.result.ctaWhatsApp}
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'RESET' })}
          className="estimator-cta-secondary px-5 py-3 rounded-md border border-gray-300 font-medium"
        >
          {t.estimator.result.startOver}
        </button>
      </div>
    </section>
  );
}
