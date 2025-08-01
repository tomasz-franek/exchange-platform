import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { of, throwError } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
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
  saveUserPropertySuccess
} from './properties.actions';
import { PropertiesEffects } from './properties.effects';
import { ApiService } from '../../../services/api/api.service';
import { cold, hot } from 'jasmine-marbles';
import { UserProperty } from '../../api/model/userProperty';
import { ToastrService } from 'ngx-toastr';

describe('PropertiesEffects', () => {
  let effects: PropertiesEffects;
  let actions$: Actions;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadTimezoneList',
      'loadUnicodeLocalesList',
      'getUserProperty',
      'saveUserProperty'
    ]);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
      'info',
      'error'
    ]);

    TestBed.configureTestingModule({
      providers: [
        PropertiesEffects,
        provideMockActions(() => actions$),
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy }
      ]
    });

    effects = TestBed.inject(PropertiesEffects);
    actions$ = TestBed.inject(Actions);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastrService = TestBed.inject(
      ToastrService
    ) as jasmine.SpyObj<ToastrService>;
  });

  describe('loadTimezones$', () => {
    it('should return a LoadTimezoneListSuccess action, with timezones, on success', () => {
      const timezones = ['UTC', 'GMT'];
      const action = loadTimezoneListAction();
      const outcome = loadTimezoneListSuccess({ timezones });

      actions$ = of(action);
      apiService.loadTimezoneList.and.returnValue(of(timezones));

      effects.loadTimezones$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });

    it('should return a LoadTimezoneListFailure action, on error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Not Found',
        status: 404
      });
      const action = loadTimezoneListAction();
      const outcome = loadTimezoneListFailure({ errorResponse });

      actions$ = of(action);
      apiService.loadTimezoneList.and.returnValue(
        throwError(() => errorResponse)
      );

      effects.loadTimezones$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });
  });

  describe('loadLocales$', () => {
    it('should return a LoadLocaleListSuccess action, with locales, on success', () => {
      const locales = ['English', 'Polish'];
      const action = loadLocaleListAction();
      const outcome = loadLocaleListSuccess({ locales });

      actions$ = of(action);
      apiService.loadUnicodeLocalesList.and.returnValue(of(locales));

      effects.loadLocales$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });

    it('should return a LoadLocaleListFailure action, on error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500
      });
      const action = loadLocaleListAction();
      const outcome = loadLocaleListFailure({ errorResponse });

      actions$ = of(action);
      apiService.loadUnicodeLocalesList.and.returnValue(
        throwError(() => errorResponse)
      );

      effects.loadLocales$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });
  });
  describe('saveUserProperty$', () => {
    it('should return saveUserPropertySuccess on successful withdrawal', () => {
      const userProperty = {
        id: '1',
        currency: 'CHF',
        version: 0,
        language: 'en',
        timezone: 'UTC'
      } as UserProperty;
      const action = saveUserPropertyAction({ userProperty });
      const completion = saveUserPropertySuccess();

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', { b: userProperty });
      apiService.saveUserProperty.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveUserProperty$).toBeObservable(expected);
    });
    it('should return saveUserPropertyFailure on error', () => {
      const userProperty = {
        id: '1',
        currency: 'CHF',
        version: 0,
        language: 'en',
        timezone: 'UTC'
      } as UserProperty;
      const action = saveUserPropertyAction({ userProperty });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = saveUserPropertyFailure({ errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.saveUserProperty.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveUserProperty$).toBeObservable(expected);
    });
  });

  describe('getUserProperty$', () => {
    it('should return getUserPropertySuccess on successful get properties', () => {
      const userProperty = {
        id: '1',
        currency: 'CHF',
        version: 0,
        language: 'en',
        timezone: 'UTC'
      } as UserProperty;
      const action = getUserPropertyAction();
      const completion = getUserPropertySuccess({ userProperty });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', {
        b: {
          id: '1',
          currency: 'CHF',
          version: 0,
          language: 'en',
          timezone: 'UTC'
        }
      });
      apiService.getUserProperty.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.getUserProperty$).toBeObservable(expected);
    });

    it('should return getUserPropertyFailure on error', () => {
      const action = getUserPropertyAction();
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = getUserPropertyFailure({ errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.getUserProperty.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.getUserProperty$).toBeObservable(expected);
    });
  });
});
