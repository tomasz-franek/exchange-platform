import {HttpErrorResponse} from '@angular/common/http';
import {
  getUserPropertyAction,
  getUserPropertyFailure,
  getUserPropertySuccess,
  loadLocaleListAction,
  loadLocaleListFailure,
  loadLocaleListSuccess,
  loadTimezoneListAction,
  loadTimezoneListFailure,
  loadTimezoneListSuccess,
  saveUserPropertyAction,
  saveUserPropertyFailure,
  saveUserPropertySuccess,
} from './properties.actions';
import {UserProperty} from '../../api/model/userProperty';

describe('Property Actions', () => {
  describe('Timezone Actions', () => {
    it('should create a LoadTimezoneListAction', () => {
      const action = loadTimezoneListAction();
      expect(action.type).toBe('[Property] Load Timezone List Action');
    });

    it('should create a LoadTimezoneListSuccess action with payload', () => {
      const timezones = ['UTC', 'GMT'] as string[];
      const action = loadTimezoneListSuccess({timezones});
      expect(action.type).toBe('[Property] Load Timezone List Success');
      expect(action.timezones).toEqual(timezones);
    });

    it('should create a LoadTimezoneListFailure action with error payload', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Not Found',
        status: 404,
      });
      const action = loadTimezoneListFailure({errorResponse});
      expect(action.type).toBe('[Property] Load Timezone List Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('Locale Actions', () => {
    it('should create a LoadLocaleListAction', () => {
      const action = loadLocaleListAction();
      expect(action.type).toBe('[Property] Load Locale List Action');
    });

    it('should create a LoadLocaleListSuccess action with payload', () => {
      const locales = ['EN', 'PL'];
      const action = loadLocaleListSuccess({locales});
      expect(action.type).toBe('[Property] Load Locale List Success');
      expect(action.locales).toEqual(locales);
    });

    it('should create a LoadLocaleListFailure action with error payload', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = loadLocaleListFailure({errorResponse});
      expect(action.type).toBe('[Property] Load Locale List Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('UserProperty Actions', () => {
    it('should create a getUserPropertyAction', () => {
      const action = getUserPropertyAction();
      expect(action.type).toBe('[Property] Get User Property Action');
    });

    it('should create a getUserPropertySuccess action with payload', () => {
      const userProperty: UserProperty = {
        userId: 'userId',
        locale: 'locale',
        version: 2,
        timezone: 'timezone',
        language: 'en-US',
      };
      const action = getUserPropertySuccess({userProperty});
      expect(action.type).toBe('[Property] Get User Property Success');
      expect(action.userProperty).toEqual(userProperty);
    });

    it('should create a getUserPropertyFailure action with error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = getUserPropertyFailure({errorResponse});
      expect(action.type).toBe('[Property] Get User Property Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('SaveUserProperty Actions', () => {
    const userProperty: UserProperty = {
      userId: 'userId',
      locale: 'locale',
      version: 2,
      timezone: 'timezone',
      language: 'en-US',
    };
    it('should create a saveUserPropertyAction', () => {
      const action = saveUserPropertyAction({userProperty});
      expect(action.type).toBe('[Property] Save User Property Action');
    });

    it('should create a saveUserPropertySuccess action with payload', () => {
      const action = saveUserPropertySuccess();
      expect(action.type).toBe('[Property] Save User Property Success');
    });

    it('should create a saveUserPropertyFailure action with error payload', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = saveUserPropertyFailure({errorResponse});
      expect(action.type).toBe('[Property] Save User Property Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });
});
