import {
  loadExchangeAccountTransactionListFailure,
  loadExchangeAccountTransactionListSuccess,
  loadSystemAccountTransactionListFailure,
  loadSystemAccountTransactionListSuccess,
  loadTransactionListAction,
  loadTransactionListFailure,
  loadTransactionListSuccess,
} from './transaction.actions';
import { SelectTransactionRequest } from '../../api/model/selectTransactionRequest';
import { HttpErrorResponse } from '@angular/common/http';
import { Transaction } from '../../api/model/transaction';

describe('Transaction Actions', () => {
  describe('loadTransactionListAction', () => {
    it('should create an action to load transaction list', () => {
      const selectTransactionRequest: SelectTransactionRequest = {
        dateFromUtc: '',
        dateToUtc: '',
      };
      const action = loadTransactionListAction({ selectTransactionRequest });
      expect(action.type).toBe('[Transaction] Select Transactions');
      expect(action.selectTransactionRequest).toEqual(selectTransactionRequest);
    });
  });

  describe('loadTransactionListSuccess', () => {
    it('should create an action to load transaction list', () => {
      const transactions: Transaction[] = [
        { amount: 10, dateUtc: 'date1' },
        { amount: 20, dateUtc: 'date2' },
      ];
      const action = loadTransactionListSuccess({ transactions });
      expect(action.type).toBe('[Transaction] Load Transaction List Success');
      expect(action.transactions).toEqual(transactions);
    });
  });

  describe('loadTransactionListFailure', () => {
    it('should create an action for failed loading of transaction list', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Error message',
        status: 404,
      });
      const action = loadTransactionListFailure({ errorResponse });
      expect(action.type).toBe('[Transaction] Load Transaction List Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('loadSystemAccountTransactionListSuccess', () => {
    it('should create an action to load system account transaction list', () => {
      const systemTransactions: Transaction[] = [
        { amount: 10, dateUtc: 'date1' },
        { amount: 20, dateUtc: 'date2' },
      ];
      const action = loadSystemAccountTransactionListSuccess({
        systemTransactions,
      });
      expect(action.type).toBe(
        '[Transaction] Load System Account List Success',
      );
      expect(action.systemTransactions).toEqual(systemTransactions);
    });
  });

  describe('loadSystemAccountTransactionListFailure', () => {
    it('should create an action for failed loading system account of transaction list', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Error message',
        status: 404,
      });
      const action = loadSystemAccountTransactionListFailure({ errorResponse });
      expect(action.type).toBe(
        '[Transaction] Load System Account List Failure',
      );
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('loadExchangeAccountTransactionListSuccess', () => {
    it('should create an action to load exchange account transaction list', () => {
      const exchangeTransactions: Transaction[] = [
        { amount: 10, dateUtc: 'date1' },
        { amount: 20, dateUtc: 'date2' },
      ];
      const action = loadExchangeAccountTransactionListSuccess({
        exchangeTransactions,
      });
      expect(action.type).toBe(
        '[Transaction] Load Exchange Account List Success',
      );
      expect(action.exchangeTransactions).toEqual(exchangeTransactions);
    });
  });

  describe('loadExchangeAccountTransactionListFailure', () => {
    it('should create an action for failed loading exchange account of transaction list', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Error message',
        status: 404,
      });
      const action = loadExchangeAccountTransactionListFailure({
        errorResponse,
      });
      expect(action.type).toBe(
        '[Transaction] Load Exchange Account List Failure',
      );
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });
});
