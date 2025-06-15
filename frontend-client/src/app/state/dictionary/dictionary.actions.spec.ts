import { HttpErrorResponse } from '@angular/common/http';
import {
  loadLocaleListAction,
  loadLocaleListFailure,
  loadLocaleListSuccess,
  loadTimezoneListAction,
  loadTimezoneListFailure,
  loadTimezoneListSuccess,
} from './dictionary.actions';
import { DictionaryTimezone } from '../../api/model/dictionaryTimezone';

describe('Dictionary Actions', () => {
  describe('Timezone Actions', () => {
    it('should create a LoadTimezoneListAction', () => {
      const action = loadTimezoneListAction();
      expect(action.type).toBe('[Dictionary] LoadTimezoneListAction');
    });

    it('should create a LoadTimezoneListSuccess action with payload', () => {
      const timezones = [
        { name: 'UTC' },
        { name: 'GMT' },
      ] as DictionaryTimezone[];
      const action = loadTimezoneListSuccess({ timezones });
      expect(action.type).toBe('[Dictionary] LoadTimezoneListSuccess');
      expect(action.timezones).toEqual(timezones);
    });

    it('should create a LoadTimezoneListFailure action with error payload', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Not Found',
        status: 404,
      });
      const action = loadTimezoneListFailure({ error: errorResponse });
      expect(action.type).toBe('[Dictionary] LoadTimezoneListFailure');
      expect(action.error).toEqual(errorResponse);
    });
  });

  describe('Locale Actions', () => {
    it('should create a LoadLocaleListAction', () => {
      const action = loadLocaleListAction();
      expect(action.type).toBe('[Dictionary] LoadLocaleListAction');
    });

    it('should create a LoadLocaleListSuccess action with payload', () => {
      const locales = [{ name: 'EN' }, { name: 'PL' }];
      const action = loadLocaleListSuccess({ locales });
      expect(action.type).toBe('[Dictionary] LoadLocaleListSuccess');
      expect(action.locales).toEqual(locales);
    });

    it('should create a LoadLocaleListFailure action with error payload', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = loadLocaleListFailure({ error: errorResponse });
      expect(action.type).toBe('[Dictionary] LoadLocaleListFailure');
      expect(action.error).toEqual(errorResponse);
    });
  });
});
