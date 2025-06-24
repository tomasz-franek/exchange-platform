import {
  loadLocaleListSuccess,
  loadTimezoneListSuccess,
} from './dictionary.actions';
import {
  dictionaryReducers,
  initialDictionaryState,
} from './dictionary.reducers';

describe('Dictionary Reducers', () => {
  it('should return the initial state', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = dictionaryReducers(undefined, action);
    expect(state).toBe(initialDictionaryState);
  });

  it('should handle loadTimezoneListSuccess', () => {
    const timezones = ['UTC', 'GMT'];
    const action = loadTimezoneListSuccess({ timezones });
    const state = dictionaryReducers(initialDictionaryState, action);

    expect(state).toEqual({
      ...initialDictionaryState,
      timezones: timezones,
    });
  });

  it('should handle loadLocaleListSuccess', () => {
    const locales = ['en', 'pl'];
    const action = loadLocaleListSuccess({ locales });
    const state = dictionaryReducers(initialDictionaryState, action);

    expect(state).toEqual({
      ...initialDictionaryState,
      locales: locales,
    });
  });
});
