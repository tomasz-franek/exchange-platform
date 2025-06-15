import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../features';
import { DictionaryLocale, DictionaryTimezone } from '../../api';

export interface DictionaryState {
  timezones: DictionaryTimezone[];
  locales: DictionaryLocale[];
}

export const selectDictionaryFutureState =
  createFeatureSelector<DictionaryState>(Features.dictionaries);

export const selectTimezoneList = createSelector(
  selectDictionaryFutureState,
  (state: DictionaryState) => state.timezones,
);
export const selectLocaleList = createSelector(
  selectDictionaryFutureState,
  (state: DictionaryState) => state.locales,
);
