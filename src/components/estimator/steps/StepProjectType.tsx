import type { UIStrings } from '~/lib/i18n';

import type { EstimatorAction, EstimatorState } from '../reducer';
import type { ProjectTypeKey } from '../types';

interface Props {
  state: EstimatorState;
  dispatch: React.Dispatch<EstimatorAction>;
  t: UIStrings;
}

const OPTIONS: ReadonlyArray<{ key: ProjectTypeKey; icon: string }> = [
  { key: 'renovation', icon: '🔨' },
  { key: 'facade', icon: '🏢' },
  { key: 'construction', icon: '🏗️' },
  { key: 'maintenance', icon: '🔧' },
];

export function StepProjectType({ state, dispatch, t }: Props) {
  return (
    <fieldset className="estimator-step" data-step="project-type">
      <legend className="sr-only">{t.estimator.steps.projectType}</legend>
      <h2 className="text-2xl font-semibold mb-2">{t.estimator.steps.projectType}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {OPTIONS.map((opt) => {
          const selected = state.projectType === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              aria-pressed={selected}
              onClick={() => dispatch({ type: 'SET_PROJECT_TYPE', value: opt.key })}
              className={
                'estimator-option text-left p-5 rounded-xl border-2 transition ' +
                (selected
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-400')
              }
            >
              <span className="block text-2xl mb-2" aria-hidden="true">
                {opt.icon}
              </span>
              <span className="block font-medium">
                {t.estimator.projectTypes[opt.key]}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
