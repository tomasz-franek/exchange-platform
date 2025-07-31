import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../../features';

export interface PropertyState {
  timezones: string[];
  locales: string[];
}

export const selectPropertyFutureState = createFeatureSelector<PropertyState>(
  Features.properties,
);

export const selectTimezoneList = createSelector(
  selectPropertyFutureState,
  (state: PropertyState) => state.timezones,
);
export const selectLocaleList = createSelector(
  selectPropertyFutureState,
  (state: PropertyState) => state.locales,
);
