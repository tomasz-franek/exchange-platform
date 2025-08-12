import { Actions } from '@ngrx/effects';

import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { cold, hot } from 'jasmine-marbles';
import { CurrencyRate } from '../../api';
import { RateEffects } from './rate.effects';
import { ApiService } from '../../../services/api/api.service';
import { loadCurrencyRateListAction, loadCurrencyRateListActionSuccess } from './rate.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('RateEffects', () => {
  let effects: RateEffects;
  let actions$: Actions;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadCurrencyRates',
      'loadUnicodeLocalesList'
    ]);
    TestBed.configureTestingModule({
      providers: [
        RateEffects,
        provideMockActions(() => actions$),
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    effects = TestBed.inject(RateEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should return loadCurrencyRateListActionSuccess on successful loadCurrencyRates', () => {
    const currencyRates = [
      { pair: 'EUR_PLN', buyRate: 1, buyAmount: 2, sellRate: 2, sellAmount: 4 },
      { pair: 'EUR_USD', buyRate: 1, buyAmount: 2, sellRate: 2, sellAmount: 4 }
    ] as CurrencyRate[];

    const action = loadCurrencyRateListAction();
    const outcome = loadCurrencyRateListActionSuccess({ currencyRates });

    actions$ = hot('-a', { a: action });
    apiService.loadCurrencyRates.and.returnValue(of(currencyRates) as any);
    const expected = cold('-c', { c: outcome });
    expect(effects.loadCurrencyRateList$).toBeObservable(expected);
  });

  it('should return loadCurrencyRateListActionFailure on failed loadCurrencyRates', () => {
    const errorResponse = new HttpErrorResponse({});
    apiService.loadCurrencyRates.and.returnValue(
      throwError(() => errorResponse)
    );
    actions$ = of(loadCurrencyRateListAction());

    effects.loadCurrencyRateList$.subscribe((action) => {
      expect(action).toEqual({
        type: '[RATE] Load currency rate list Failure',
        errorResponse
      });
      expect(apiService.loadCurrencyRates).toHaveBeenCalled();
    });
  });
});
