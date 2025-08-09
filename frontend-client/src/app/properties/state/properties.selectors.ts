import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../../features';
import { UserProperty } from '../../api/model/userProperty';
import { Address } from '../../api/model/address';

export interface PropertyState {
  timezones: string[];
  locales: string[];
  userProperty: UserProperty;
  userAddress: Address;
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
export const selectUserProperty = createSelector(
  selectPropertyFutureState,
  (state: PropertyState) => state.userProperty,
);
export const selectUserAddress = createSelector(
  selectPropertyFutureState,
  (state: PropertyState) => state.userAddress,
);
