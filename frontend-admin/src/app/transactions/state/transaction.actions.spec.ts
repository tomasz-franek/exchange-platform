import {
  loadTransactionListAction,
  loadTransactionListFailure,
  loadTransactionListSuccess
} from "./transaction.actions";
import {SelectTransactionRequest} from "../../api/model/selectTransactionRequest";
import {HttpErrorResponse} from '@angular/common/http';
import {Transaction} from '../../api/model/transaction';

describe('Transaction Actions', () => {
  describe('loadTransactionListAction', () => {
    it('should create an action to load transaction list', () => {
      const selectTransactionRequest: SelectTransactionRequest = {
        dateFromUTC: '', dateToUTC: ''
      };
      const action = loadTransactionListAction({selectTransactionRequest});
      expect(action.type).toBe('[Transaction] Select Transactions');
      expect(action.selectTransactionRequest).toEqual(selectTransactionRequest);
    });
  });

  describe('loadTransactionListSuccess', () => {
    it('should create an action to load transaction list', () => {
      const transactions: Transaction[] = [
        {amount: 10, dateUTC: 'date1'},
        {amount: 20, dateUTC: 'date2'}
      ]
      const action = loadTransactionListSuccess({transactions});
      expect(action.type).toBe('[Transaction] Load Transaction List Success');
      expect(action.transactions).toEqual(transactions);
    });
  });

  describe('loadTransactionListFailure', () => {
    it('should create an action for failed loading of transaction list', () => {
      const errorResponse = new HttpErrorResponse({error: 'Error message', status: 404});
      const action = loadTransactionListFailure({errorResponse});
      expect(action.type).toBe('[Transaction] Load Transaction List Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });
});
