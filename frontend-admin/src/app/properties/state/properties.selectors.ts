import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Features} from '../../features';
import {UserProperty} from '../../api/model/userProperty';

export interface PropertyState {
  timezones: string[];
  locales: string[];
  userProperty: UserProperty,
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

export const getUserProperty = createSelector(
  selectPropertyFutureState,
  (state: PropertyState) => state.userProperty,
);

