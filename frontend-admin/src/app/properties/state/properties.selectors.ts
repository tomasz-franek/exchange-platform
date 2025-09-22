import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Features} from '../../features';
import {UserProperty} from '../../api/model/userProperty';
import {Address} from '../../api/model/address';
import {StrategyData} from '../services/strategy.data';
import {SystemCurrency} from '../../api/model/systemCurrency';

export interface PropertyState {
  timezones: string[];
  locales: string[];
  userProperty: UserProperty;
  userAddress: Address;
  strategyData: StrategyData;
  systemCurrencyList: SystemCurrency[];
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

export const selectStrategyData = createSelector(
  selectPropertyFutureState,
  (state: PropertyState) => state.strategyData,
);

export const selectSystemCurrencyList = createSelector(
  selectPropertyFutureState,
  (state: PropertyState) => state.systemCurrencyList,
);
