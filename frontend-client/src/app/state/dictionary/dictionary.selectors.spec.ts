import {
  DictionaryState,
  selectLocaleList,
  selectTimezoneList,
} from './dictionary.selectors';

describe('Dictionary Selectors', () => {
  const initialState: DictionaryState = {
    timezones: [{ name: 'UTC' }, { name: 'GMT' }],
    locales: [{ name: 'English' }, { name: 'Polish' }],
  };

  it('should select the timezone list', () => {
    const result = selectTimezoneList.projector(initialState);
    expect(result).toEqual(initialState.timezones);
  });

  it('should select the locale list', () => {
    const result = selectLocaleList.projector(initialState);
    expect(result).toEqual(initialState.locales);
  });
});
