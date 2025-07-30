import {loadTransactionListAction} from "./transaction.actions";
import {SelectTransactionRequest} from "../../api/model/selectTransactionRequest";

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
});
