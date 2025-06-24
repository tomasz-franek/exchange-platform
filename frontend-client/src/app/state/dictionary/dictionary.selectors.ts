import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../features';

export interface DictionaryState {
  timezones: string[];
  locales: string[];
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
