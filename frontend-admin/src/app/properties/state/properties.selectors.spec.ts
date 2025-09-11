import {
  PropertyState,
  selectLocaleList,
  selectSystemPropertyResponse,
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
    systemPropertyResponse: {
      feeStrategy: 'feeStrategy',
      ratioStrategy: 'ratioStrategy',
    },
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
  it('should select the system property', () => {
    const result = selectSystemPropertyResponse.projector(initialState);
    expect(result).toEqual(initialState.systemPropertyResponse);
  });
});
