import {createReducer, on} from '@ngrx/store';
import {PropertyState} from './properties.selectors';
import {
  getUserAddressSuccess,
  getUserPropertySuccess,
  loadLocaleListSuccess,
  loadStrategyDataSuccess,
  loadSystemCurrencyListSuccess,
  loadTimezoneListSuccess,
} from './properties.actions';
import {UserProperty} from '../../api/model/userProperty';
import {Address} from '../../api/model/address';
import {StrategyData} from '../services/strategy.data';

export const initialPropertyState: PropertyState = {
  timezones: [],
  locales: [],
  userProperty: {} as UserProperty,
  userAddress: {} as Address,
  strategyData: {} as StrategyData,
  systemCurrencyList: []
};

export const propertyReducers = createReducer(
  initialPropertyState,
  on(loadTimezoneListSuccess, (state, action) => {
    return {...state, timezones: action.timezones};
  }),
  on(loadLocaleListSuccess, (state, action) => {
    return {...state, locales: action.locales};
  }),
  on(getUserPropertySuccess, (state, action) => {
    return {...state, userProperty: action.userProperty};
  }),
  on(getUserAddressSuccess, (state, action) => {
    return {...state, userAddress: action.userAddress};
  }),
  on(loadStrategyDataSuccess, (state, action) => {
    return {...state, strategyData: action.strategyData};
  }),
  on(loadSystemCurrencyListSuccess, (state, action) => {
    return {...state, systemCurrencyList: action.systemCurrencyList};
  }),
);
