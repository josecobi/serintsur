import type { UIStrings } from '~/lib/i18n';

import type { EstimatorAction, EstimatorState } from '../reducer';
import type { LocationKey } from '../types';

interface Props {
  state: EstimatorState;
  dispatch: React.Dispatch<EstimatorAction>;
  t: UIStrings;
}

/**
 * City names are intentionally language-neutral (Cádiz is Cádiz everywhere).
 * Only the "other" chip label switches by locale.
 */
const LOCATIONS: ReadonlyArray<{ key: LocationKey; label: string }> = [
  { key: 'jerez', label: 'Jerez de la Frontera' },
  { key: 'cadiz', label: 'Cádiz' },
  { key: 'puertoSantaMaria', label: 'El Puerto de Santa María' },
  { key: 'chiclana', label: 'Chiclana' },
  { key: 'sanFernando', label: 'San Fernando' },
  { key: 'rota', label: 'Rota' },
  { key: 'sanlucar', label: 'Sanlúcar' },
  { key: 'malaga', label: 'Málaga' },
  { key: 'marbella', label: 'Marbella' },
  { key: 'estepona', label: 'Estepona' },
  { key: 'sevilla', label: 'Sevilla' },
];

export function StepLocation({ state, dispatch, t: _t }: Props) {
  const otherSelected = state.location === 'other';

  return (
    <fieldset className="estimator-step" data-step="location">
      <legend className="sr-only">Location</legend>
      <h2 className="text-2xl font-semibold mb-2">¿Dónde está el proyecto?</h2>
      <div className="flex flex-wrap gap-2 mt-4">
        {LOCATIONS.map(({ key, label }) => {
          const selected = state.location === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={selected}
              onClick={() => dispatch({ type: 'SET_LOCATION', value: key })}
              className={
                'estimator-chip px-4 py-2 rounded-full border-2 text-sm transition ' +
                (selected
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 hover:border-gray-400')
              }
            >
              {label}
            </button>
          );
        })}
        <button
          type="button"
          aria-pressed={otherSelected}
          onClick={() => dispatch({ type: 'SET_LOCATION', value: 'other' })}
          className={
            'estimator-chip px-4 py-2 rounded-full border-2 text-sm transition ' +
            (otherSelected
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-200 hover:border-gray-400')
          }
        >
          Otra ubicación
        </button>
      </div>
      {otherSelected && (
        <label className="block mt-4">
          <span className="block text-sm text-gray-700 mb-1">Ciudad</span>
          <input
            type="text"
            value={state.otherLocationLabel}
            onChange={(e) =>
              dispatch({ type: 'SET_OTHER_LOCATION_LABEL', value: e.target.value })
            }
            placeholder="Ej: Toledo"
            className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-sm"
          />
        </label>
      )}
    </fieldset>
  );
}
