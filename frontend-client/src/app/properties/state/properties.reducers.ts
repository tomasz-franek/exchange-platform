import { createReducer, on } from '@ngrx/store';
import { PropertyState } from './properties.selectors';
import {
  loadLocaleListSuccess,
  loadTimezoneListSuccess,
} from './properties.actions';

export const initialPropertyState: PropertyState = {
  timezones: [],
  locales: [],
};

export const propertyReducers = createReducer(
  initialPropertyState,
  on(loadTimezoneListSuccess, (state, action) => {
    return { ...state, timezones: action.timezones };
  }),
  on(loadLocaleListSuccess, (state, action) => {
    return { ...state, locales: action.locales };
  }),
);
