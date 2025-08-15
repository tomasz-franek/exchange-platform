import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { TransactionEffects } from './transaction.effects';
import { ApiService } from '../../../services/api.service';
import { cold, hot } from 'jasmine-marbles';
import { HttpErrorResponse } from '@angular/common/http';
import {
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
        dateFromUTC: '',
        dateToUTC: '',
      };
      const action = loadTransactionListAction({ selectTransactionRequest });
      const transactions = [] as Transaction[];
      const completion = loadTransactionListSuccess({ transactions });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', { b: transactions });
      apiService.loadTransactionList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadUserTransactions$).toBeObservable(expected);
    });

    it('should return loadTransactionListFailure on error', () => {
      const selectTransactionRequest: SelectTransactionRequest = {
        dateFromUTC: '',
        dateToUTC: '',
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
});
