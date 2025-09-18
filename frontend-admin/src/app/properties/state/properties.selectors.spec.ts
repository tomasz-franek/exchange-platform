import {
  PropertyState,
  selectLocaleList,
  selectStrategyData,
  selectSystemCurrencyList,
  selectTimezoneList,
  selectUserAddress,
  selectUserProperty,
} from './properties.selectors';

describe('Property Selectors', () => {
  const initialState: PropertyState = {
    timezones: ['UTC', 'GMT'],
    locales: ['English', 'Polish'],
    userProperty: {
      userId: 'userId',
      version: 1,
      language: 'language',
      locale: 'locale',
      timezone: 'UTC',
    },
    userAddress: {
      id: 'id',
      userId: 'userId',
      name: 'name',
      version: 2,
      countryCode: 'countryCode',
      phone: 'phone',
      city: 'city',
      street: 'street',
      taxID: 'taxID',
      vatID: 'vatID',
      zipCode: 'zipCode',
    },
    strategyData: {
      feePercentage: '1',
      feeStrategy: 'feeStrategy',
      ratioStrategy: 'ratioStrategy',
    },
    systemCurrencyList: [{
      id: 1,
      minimumExchange: 3,
      currency: 'EUR'
    },
      {
        id: 2,
        minimumExchange: 4,
        currency: 'PLN'
      }]
  };

  it('should select the timezone list', () => {
    const result = selectTimezoneList.projector(initialState);
    expect(result).toEqual(initialState.timezones);
  });

  it('should select the locale list', () => {
    const result = selectLocaleList.projector(initialState);
    expect(result).toEqual(initialState.locales);
  });
  it('should select the user property', () => {
    const result = selectUserProperty.projector(initialState);
    expect(result).toEqual(initialState.userProperty);
  });
  it('should select the user address', () => {
    const result = selectUserAddress.projector(initialState);
    expect(result).toEqual(initialState.userAddress);
  });
  it('should select the strategy data', () => {
    const result = selectStrategyData.projector(initialState);
    expect(result).toEqual(initialState.strategyData);
  });
  it('should select the strategy data', () => {
    const result = selectSystemCurrencyList.projector(initialState);
    expect(result).toEqual(initialState.systemCurrencyList);
  });

});
