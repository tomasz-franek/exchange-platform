import {selectTransactionsAction} from "./transaction.actions";
import {SelectTransactionRequest} from "../../api";

describe('Transaction Actions', () => {
  describe('selectTransactionsAction', () => {
    it('should create an action to select transactions', () => {
      const selectTransactionRequest: SelectTransactionRequest = {
        dateFromUTC: '', dateToUTC: ''
      };
      const action = selectTransactionsAction({selectTransactionRequest});
      expect(action.type).toBe('[Transaction] Select Transactions');
      expect(action.selectTransactionRequest).toEqual(selectTransactionRequest);
    });
  });
});
