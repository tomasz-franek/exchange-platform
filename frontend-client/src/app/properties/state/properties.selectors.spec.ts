import {
  PropertyState,
  selectLocaleList,
  selectSystemCurrencyList,
  selectTimezoneList,
  selectUserAddress,
  selectUserProperty
} from './properties.selectors';

describe('Property Selectors', () => {
  const initialState: PropertyState = {
    timezones: ['UTC', 'GMT'],
    locales: ['English', 'Polish'],
    userProperty: { language: 'EN', timezone: 'UTC', version: 0 },
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
      zipCode: 'zipCode'
    },
    systemCurrencyList: [
      {
        id: 1,
        currency: 'USD',
        minimumExchange: 3
      },
      {
        id: 2,
        currency: 'EUR',
        minimumExchange: 3
      }
    ]
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
  it('should select system currency list', () => {
    const result = selectSystemCurrencyList.projector(initialState);
    expect(result).toEqual(initialState.systemCurrencyList);
  });
});
