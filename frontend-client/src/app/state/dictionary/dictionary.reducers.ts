import { createReducer, on } from '@ngrx/store';
import { DictionaryState } from './dictionary.selectors';
import {
  loadLocaleListSuccess,
  loadTimezoneListSuccess,
} from './dictionary.actions';

export const initialDictionaryState: DictionaryState = {
  timezones: [],
  locales: [],
};

export const dictionaryReducers = createReducer(
  initialDictionaryState,
  on(loadTimezoneListSuccess, (state, action) => {
    return { ...state, timezones: action.timezones };
  }),
  on(loadLocaleListSuccess, (state, action) => {
    return { ...state, locales: action.locales };
  }),
);
