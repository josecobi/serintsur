import type { UIStrings } from '~/lib/i18n';

import type { EstimatorAction, EstimatorState } from '../reducer';
import type { ContactInfo } from '../types';

interface Props {
  state: EstimatorState;
  dispatch: React.Dispatch<EstimatorAction>;
  t: UIStrings;
}

export function StepContact({ state, dispatch, t }: Props) {
  const set = (field: keyof ContactInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch({ type: 'SET_CONTACT_FIELD', field, value: e.target.value });
  };

  return (
    <fieldset className="estimator-step" data-step="contact">
      <legend className="sr-only">{t.estimator.steps.contact}</legend>
      <h2 className="text-2xl font-semibold mb-4">{t.estimator.steps.contact}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            {t.contact.fields.name}
          </span>
          <input
            type="text"
            required
            minLength={2}
            maxLength={100}
            value={state.contact.name}
            onChange={set('name')}
            placeholder={t.contact.placeholders.name}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            {t.contact.fields.phone}
          </span>
          <input
            type="tel"
            required
            minLength={6}
            maxLength={30}
            value={state.contact.phone}
            onChange={set('phone')}
            placeholder={t.contact.placeholders.phone}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            {t.contact.fields.emailOptional}
          </span>
          <input
            type="email"
            maxLength={200}
            value={state.contact.email}
            onChange={set('email')}
            placeholder={t.contact.placeholders.email}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            {t.contact.fields.message}
          </span>
          <textarea
            rows={3}
            maxLength={2000}
            value={state.contact.notes}
            onChange={set('notes')}
            placeholder={t.contact.placeholders.message}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </label>
      </div>
    </fieldset>
  );
}
