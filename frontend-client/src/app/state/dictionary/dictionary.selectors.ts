import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../features';
import { DictionaryTimezone } from '../../api/model/dictionaryTimezone';
import { DictionaryLocale } from '../../api/model/dictionaryLocale';

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
