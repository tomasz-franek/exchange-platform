import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { TransactionEffects } from './transaction.effects';
import { ApiService } from '../../../services/api.service';
import { cold, hot } from 'jasmine-marbles';
import { HttpErrorResponse } from '@angular/common/http';
import {
  loadExchangeAccountTransactionListAction,
  loadExchangeAccountTransactionListFailure,
  loadExchangeAccountTransactionListSuccess,
  loadSystemAccountTransactionListAction,
  loadSystemAccountTransactionListFailure,
  loadSystemAccountTransactionListSuccess,
  loadTransactionListAction,
  loadTransactionListFailure,
  loadTransactionListSuccess,
} from './transaction.actions';
import { Transaction } from '../../api/model/transaction';
import { SelectTransactionRequest } from '../../api/model/selectTransactionRequest';

describe('TransactionEffects', () => {
  let actions$: Actions;
  let effects: TransactionEffects;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadTransactionList',
      'loadExchangeAccountTransactionList',
      'loadSystemAccountTransactionList',
    ]);

    TestBed.configureTestingModule({
      providers: [
        TransactionEffects,
        provideMockActions(() => actions$),
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    effects = TestBed.inject(TransactionEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });
  describe('loadUserTransactions$', () => {
    it('should return loadTransactionListSuccess on successful load', () => {
      const selectTransactionRequest: SelectTransactionRequest = {
        dateFromUtc: '',
        dateToUtc: '',
      };
      const action = loadTransactionListAction({ selectTransactionRequest });
      const transactions = [
        { dateUtc: '1', amount: 1 },
        { dateUtc: '2', amount: 2 },
      ];
      const completion = loadTransactionListSuccess({ transactions });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', { b: transactions });
      apiService.loadTransactionList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadUserTransactions$).toBeObservable(expected);
    });

    it('should return loadTransactionListFailure on error', () => {
      const selectTransactionRequest: SelectTransactionRequest = {
        dateFromUtc: '',
        dateToUtc: '',
      };
      const action = loadTransactionListAction({ selectTransactionRequest });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = loadTransactionListFailure({
        errorResponse,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.loadTransactionList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadUserTransactions$).toBeObservable(expected);
    });
  });

  describe('loadSystemAccountTransaction$', () => {
    it('should return loadSystemAccountTransactionListSuccess on successful load', () => {
      const selectTransactionRequest: SelectTransactionRequest = {
        dateFromUtc: '',
        dateToUtc: '',
      };
      const action = loadSystemAccountTransactionListAction({
        selectTransactionRequest,
      });
      const systemTransactions = [
        { dateUtc: '3', amount: 3 },
        { dateUtc: '4', amount: 4 },
      ] as Transaction[];
      const completion = loadSystemAccountTransactionListSuccess({
        systemTransactions,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', { b: systemTransactions });
      apiService.loadSystemAccountTransactionList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadSystemAccountTransaction$).toBeObservable(expected);
    });

    it('should return loadSystemAccountTransactionListFailure on error', () => {
      const selectTransactionRequest: SelectTransactionRequest = {
        dateFromUtc: '',
        dateToUtc: '',
      };
      const action = loadSystemAccountTransactionListAction({
        selectTransactionRequest,
      });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = loadSystemAccountTransactionListFailure({
        errorResponse,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.loadSystemAccountTransactionList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadSystemAccountTransaction$).toBeObservable(expected);
    });
  });

  describe('loadExchangeAccountTransaction$', () => {
    it('should return loadExchangeAccountTransactionListSuccess on successful load', () => {
      const selectTransactionRequest: SelectTransactionRequest = {
        dateFromUtc: '',
        dateToUtc: '',
      };
      const action = loadExchangeAccountTransactionListAction({
        selectTransactionRequest,
      });
      const exchangeTransactions = [
        { dateUtc: '3', amount: 3 },
        { dateUtc: '4', amount: 4 },
      ] as Transaction[];
      const completion = loadExchangeAccountTransactionListSuccess({
        exchangeTransactions,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', { b: exchangeTransactions });
      apiService.loadExchangeAccountTransactionList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadExchangeAccountTransaction$).toBeObservable(expected);
    });

    it('should return loadExchangeAccountTransactionListFailure on error', () => {
      const selectTransactionRequest: SelectTransactionRequest = {
        dateFromUtc: '',
        dateToUtc: '',
      };
      const action = loadExchangeAccountTransactionListAction({
        selectTransactionRequest,
      });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = loadExchangeAccountTransactionListFailure({
        errorResponse,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.loadExchangeAccountTransactionList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadExchangeAccountTransaction$).toBeObservable(expected);
    });
  });
});
