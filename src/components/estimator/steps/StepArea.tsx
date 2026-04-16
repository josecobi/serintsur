import type { UIStrings } from '~/lib/i18n';

import { AREA_MAX, AREA_MIN } from '../priceMatrix';
import type { EstimatorAction, EstimatorState } from '../reducer';

interface Props {
  state: EstimatorState;
  dispatch: React.Dispatch<EstimatorAction>;
  t: UIStrings;
}

export function StepArea({ state, dispatch, t }: Props) {
  const handleChange = (value: number) => {
    const clamped = Math.max(AREA_MIN, Math.min(AREA_MAX, Math.round(value)));
    dispatch({ type: 'SET_AREA', value: clamped });
  };

  return (
    <fieldset className="estimator-step" data-step="area">
      <legend className="sr-only">{t.estimator.steps.area}</legend>
      <h2 className="text-2xl font-semibold mb-2">{t.estimator.steps.area}</h2>
      <div className="mt-6">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-sm text-gray-600">{t.estimator.areaLabel}</span>
          <span className="text-3xl font-semibold">
            {state.area} <span className="text-base font-normal">{t.estimator.areaUnit}</span>
          </span>
        </div>
        <input
          type="range"
          min={AREA_MIN}
          max={AREA_MAX}
          step={1}
          value={state.area}
          onChange={(e) => handleChange(Number(e.target.value))}
          aria-label={t.estimator.areaLabel}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>
            {AREA_MIN} {t.estimator.areaUnit}
          </span>
          <span>
            {AREA_MAX} {t.estimator.areaUnit}
          </span>
        </div>
        <label className="block mt-4 text-sm">
          <span className="block mb-1 text-gray-700">{t.estimator.areaLabel}</span>
          <input
            type="number"
            min={AREA_MIN}
            max={AREA_MAX}
            value={state.area}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 w-32"
          />
        </label>
      </div>
    </fieldset>
  );
}
