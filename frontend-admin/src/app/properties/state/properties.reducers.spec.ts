import {
  getUserPropertySuccess,
  loadLocaleListSuccess,
  loadTimezoneListSuccess,
} from './properties.actions';
import {initialPropertyState, propertyReducers} from './properties.reducers';
import {UserProperty} from '../../api/model/userProperty';

describe('Property Reducers', () => {
  it('should return the initial state', () => {
    const action = {type: 'UNKNOWN_ACTION'};
    const state = propertyReducers(undefined, action);
    expect(state).toBe(initialPropertyState);
  });

  it('should handle loadTimezoneListSuccess', () => {
    const timezones = ['UTC', 'GMT'];
    const action = loadTimezoneListSuccess({timezones});
    const state = propertyReducers(initialPropertyState, action);

    expect(state).toEqual({
      ...initialPropertyState,
      timezones: timezones,
    });
  });

  it('should handle loadLocaleListSuccess', () => {
    const locales = ['en', 'pl'];
    const action = loadLocaleListSuccess({locales});
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
    const action = getUserPropertySuccess({userProperty});
    const state = propertyReducers(initialPropertyState, action);

    expect(state).toEqual({
      ...initialPropertyState,
      userProperty: userProperty,
    });
  });
});
