import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { of, throwError } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import {
  loadLocaleListAction,
  loadLocaleListFailure,
  loadLocaleListSuccess,
  loadTimezoneListAction,
  loadTimezoneListFailure,
  loadTimezoneListSuccess,
} from './dictionary.actions';
import { DictionaryEffects } from './dictionary.effects';
import { ApiService } from '../../../services/api.service';

describe('DictionaryEffects', () => {
  let effects: DictionaryEffects;
  let actions$: Actions;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadTimezoneList',
      'loadUnicodeLocalesList',
    ]);

    TestBed.configureTestingModule({
      providers: [
        DictionaryEffects,
        provideMockActions(() => actions$),
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    effects = TestBed.inject(DictionaryEffects);
    actions$ = TestBed.inject(Actions);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
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
        status: 404,
      });
      const action = loadTimezoneListAction();
      const outcome = loadTimezoneListFailure({ errorResponse });

      actions$ = of(action);
      apiService.loadTimezoneList.and.returnValue(
        throwError(() => errorResponse),
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
        status: 500,
      });
      const action = loadLocaleListAction();
      const outcome = loadLocaleListFailure({ errorResponse });

      actions$ = of(action);
      apiService.loadUnicodeLocalesList.and.returnValue(
        throwError(() => errorResponse),
      );

      effects.loadLocales$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });
  });
});
