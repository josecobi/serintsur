import type { UIStrings } from '~/lib/i18n';

import type { EstimatorAction, EstimatorState } from '../reducer';
import type { QualityKey } from '../types';

interface Props {
  state: EstimatorState;
  dispatch: React.Dispatch<EstimatorAction>;
  t: UIStrings;
}

const QUALITIES: ReadonlyArray<{ key: QualityKey; priceGlyph: string }> = [
  { key: 'basic', priceGlyph: '€' },
  { key: 'mid', priceGlyph: '€€' },
  { key: 'high', priceGlyph: '€€€' },
  { key: 'premium', priceGlyph: '€€€€' },
];

export function StepQuality({ state, dispatch, t }: Props) {
  return (
    <fieldset className="estimator-step" data-step="quality">
      <legend className="sr-only">{t.estimator.steps.quality}</legend>
      <h2 className="text-2xl font-semibold mb-2">{t.estimator.steps.quality}</h2>
      <div className="flex flex-col gap-3 mt-4">
        {QUALITIES.map(({ key, priceGlyph }) => {
          const selected = state.quality === key;
          const name = t.estimator.quality[key];
          const descKey = `${key}Desc` as `${QualityKey}Desc`;
          const desc = t.estimator.quality[descKey];
          return (
            <button
              key={key}
              type="button"
              aria-pressed={selected}
              onClick={() => dispatch({ type: 'SET_QUALITY', value: key })}
              className={
                'estimator-quality text-left p-4 rounded-xl border-2 transition flex items-center gap-4 ' +
                (selected
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-400')
              }
            >
              <span
                aria-hidden="true"
                className={
                  'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ' +
                  (selected ? 'border-gray-900' : 'border-gray-300')
                }
              >
                {selected && <span className="w-2 h-2 rounded-full bg-gray-900" />}
              </span>
              <span className="flex-1">
                <span className="block font-medium">{name}</span>
                <span className="block text-sm text-gray-600">{desc}</span>
              </span>
              <span className="text-sm font-medium text-gray-500" aria-hidden="true">
                {priceGlyph}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
