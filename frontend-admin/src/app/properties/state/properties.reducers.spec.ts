import {
  getUserAddressSuccess,
  getUserPropertySuccess,
  loadLocaleListSuccess,
  loadStrategyDataSuccess,
  loadTimezoneListSuccess,
} from './properties.actions';
import { initialPropertyState, propertyReducers } from './properties.reducers';
import { UserProperty } from '../../api/model/userProperty';
import { Address } from '../../api/model/address';
import { StrategyData } from '../services/strategy.data';

describe('Property Reducers', () => {
  it('should return the initial state', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = propertyReducers(undefined, action);
    expect(state).toBe(initialPropertyState);
  });

  it('should handle loadTimezoneListSuccess', () => {
    const timezones = ['UTC', 'GMT'];
    const action = loadTimezoneListSuccess({ timezones });
    const state = propertyReducers(initialPropertyState, action);

    expect(state).toEqual({
      ...initialPropertyState,
      timezones: timezones,
    });
  });

  it('should handle loadLocaleListSuccess', () => {
    const locales = ['en', 'pl'];
    const action = loadLocaleListSuccess({ locales });
    const state = propertyReducers(initialPropertyState, action);

    expect(state).toEqual({
      ...initialPropertyState,
      locales: locales,
    });
  });

  it('should handle loadLocaleListSuccess', () => {
    const userProperty: UserProperty = {
      userId: 'userId',
      locale: 'locale',
      version: 2,
      timezone: 'timezone',
      language: 'en-US',
    };
    const action = getUserPropertySuccess({ userProperty });
    const state = propertyReducers(initialPropertyState, action);

    expect(state).toEqual({
      ...initialPropertyState,
      userProperty: userProperty,
    });
  });

  it('should handle loadLocaleListSuccess', () => {
    const userAddress = {
      id: 'id',
      userId: 'userId',
      name: 'name',
      version: 2,
      countryCode: 'countryCode',
      phone: 'phone',
      postalOffice: 'postalOffice',
      street: 'street',
      taxID: 'taxID',
      vatID: 'vatID',
      zipCode: 'zipCode',
    } as Address;
    const action = getUserAddressSuccess({ userAddress });
    const state = propertyReducers(initialPropertyState, action);

    expect(state).toEqual({
      ...initialPropertyState,
      userAddress: userAddress,
    });
  });

  it('should handle loadStrategyDataSuccess', () => {
    const strategyData = {
      feePercentage: '1',
      feeStrategy: 'feeStrategy',
      ratioStrategy: 'ratioStrategy',
    } as StrategyData;
    const action = loadStrategyDataSuccess({ strategyData });
    const state = propertyReducers(initialPropertyState, action);

    expect(state).toEqual({
      ...initialPropertyState,
      strategyData: strategyData,
    });
  });
});
