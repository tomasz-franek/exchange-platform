import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Actions} from '@ngrx/effects';
import {TransactionEffects} from './transaction.effects';
import {ApiService} from '../../services/api.service';
import {cold, hot} from 'jasmine-marbles';
import {HttpErrorResponse} from '@angular/common/http';
import {
  selectTransactionsAction,
  selectTransactionsFailure,
  selectTransactionsSuccess
} from "./transaction.actions";
import {Transaction} from "../../api/model/transaction";
import {SelectTransactionRequest} from "../../api/model/selectTransactionRequest";

describe('TransactionEffects', () => {
  let actions$: Actions;
  let effects: TransactionEffects;
  let apiService: jasmine.SpyObj<ApiService>;


  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'selectTransactions',
    ]);

    TestBed.configureTestingModule({
      providers: [
        TransactionEffects,
        provideMockActions(() => actions$),
        {provide: ApiService, useValue: apiServiceSpy},
      ],
    });

    effects = TestBed.inject(TransactionEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });
  describe('selectUserTransactions', () => {
    it('should return selectTransactionsSuccess on successful load', () => {
      const selectTransactionRequest: SelectTransactionRequest = {
        dateFromUTC: '', dateToUTC: '',
      };
      const action = selectTransactionsAction({selectTransactionRequest});
      const transactions = [] as Transaction[];
      const completion = selectTransactionsSuccess({transactions});

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: transactions});
      apiService.selectTransactions.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.selectUserTransactions$).toBeObservable(expected);
    });

    it('should return selectTransactionsFailure on error', () => {
      const selectTransactionRequest: SelectTransactionRequest = {
        dateFromUTC: '', dateToUTC: '',
      };
      const action = selectTransactionsAction({selectTransactionRequest});
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = selectTransactionsFailure({
        error: errorResponse,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.selectTransactions.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.selectUserTransactions$).toBeObservable(expected);
    });
  });
});

