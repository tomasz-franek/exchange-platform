import {
  PropertyState,
  selectLocaleList,
  selectTimezoneList,
  selectUserProperty
} from './properties.selectors';

describe('Property Selectors', () => {
  const initialState: PropertyState = {
    timezones: ['UTC', 'GMT'],
    locales: ['English', 'Polish'],
    userProperty: { language: 'EN', timezone: 'UTC', version: 0 }
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
});
