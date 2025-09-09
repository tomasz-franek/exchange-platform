import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { StatisticEffects } from './statistic.effects';
import { ApiService } from '../../../services/api.service';
import { cold, hot } from 'jasmine-marbles';
import { HttpErrorResponse } from '@angular/common/http';
import {
  loadCurrencyStatisticAction,
  loadCurrencyStatisticFailure,
  loadCurrencyStatisticSuccess,
  loadPairStatisticAction,
  loadPairStatisticFailure,
  loadPairStatisticSuccess,
  loadUserStatisticAction,
  loadUserStatisticFailure,
  loadUserStatisticSuccess,
} from './statistic.actions';
import { UsersStatisticRequest } from '../../api/model/usersStatisticRequest';
import { UsersStatisticResponse } from '../../api/model/usersStatisticResponse';
import { CurrencyStatisticResponse } from '../../api/model/currencyStatisticResponse';
import { Pair } from '../../api/model/pair';
import { PairStatisticResponse } from '../../api/model/pairStatisticResponse';

describe('StatisticEffects', () => {
  let actions$: Actions;
  let effects: StatisticEffects;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadUsersStatistic',
      'loadCurrencyStatistics',
      'loadPairStatistics',
    ]);

    TestBed.configureTestingModule({
      providers: [
        StatisticEffects,
        provideMockActions(() => actions$),
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    effects = TestBed.inject(StatisticEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });
  describe('loadUserStatistic$', () => {
    it('should return loadUserStatisticSuccess on successful load', () => {
      const usersStatisticRequest: UsersStatisticRequest = {
        userId: '',
      };
      const action = loadUserStatisticAction({ usersStatisticRequest });
      const usersStatisticResponse = {
        all: 1,
        active: 2,
        blocked: 3,
      } as UsersStatisticResponse;
      const completion = loadUserStatisticSuccess({ usersStatisticResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', { b: usersStatisticResponse });
      apiService.loadUsersStatistic.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadUserStatistic$).toBeObservable(expected);
    });

    it('should return loadUserStatisticFailure on error', () => {
      const usersStatisticRequest: UsersStatisticRequest = {
        userId: '',
      };
      const action = loadUserStatisticAction({ usersStatisticRequest });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = loadUserStatisticFailure({ errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.loadUsersStatistic.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadUserStatistic$).toBeObservable(expected);
    });
  });

  describe('loadCurrencyStatistic$', () => {
    it('should return loadCurrencyStatisticSuccess on successful load', () => {
      const currency = 'CHF';
      const action = loadCurrencyStatisticAction({ currency });
      const currencyStatisticResponse = {
        amountInTickets: 3,
        amountTotal: 4,
      } as CurrencyStatisticResponse;
      const completion = loadCurrencyStatisticSuccess({
        currencyStatisticResponse,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', { b: currencyStatisticResponse });
      apiService.loadCurrencyStatistics.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadCurrencyStatistic$).toBeObservable(expected);
    });

    it('should return loadCurrencyStatisticFailure on error', () => {
      const currency = 'CHF';
      const action = loadCurrencyStatisticAction({ currency });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = loadCurrencyStatisticFailure({ errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.loadCurrencyStatistics.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadCurrencyStatistic$).toBeObservable(expected);
    });
  });

  describe('loadPairStatistic$', () => {
    it('should return loadPairStatisticSuccess on successful load', () => {
      const pair = Pair.ChfPln;
      const action = loadPairStatisticAction({ pair });
      const pairStatisticResponse = {
        amountTicketsBuy: 499,
        amountTicketsSell: 233,
      } as PairStatisticResponse;
      const completion = loadPairStatisticSuccess({
        pairStatisticResponse,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', { b: pairStatisticResponse });
      apiService.loadPairStatistics.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadPairStatistic$).toBeObservable(expected);
    });

    it('should return loadCurrencyStatisticFailure on error', () => {
      const pair = Pair.ChfPln;
      const action = loadPairStatisticAction({ pair });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = loadPairStatisticFailure({ errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.loadPairStatistics.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadPairStatistic$).toBeObservable(expected);
    });
  });
});
