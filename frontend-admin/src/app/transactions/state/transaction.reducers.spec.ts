import {initialTransactionState, transactionReducers} from './transaction.reducers';
import {selectTransactionsSuccess} from "./transaction.actions";
import {Transaction} from "../../api/model/transaction";

describe('transactionReducers', () => {
  it('should return the initial state', () => {
    const action = {type: 'UNKNOWN_ACTION'}; // An action that does not affect the state
    const state = transactionReducers(undefined, action);
    expect(state).toBe(initialTransactionState);
  });
  it('should handle selectTransactionsSuccess', () => {
    const transactions: Transaction[] = [{amount: 10, dateUTC: 'x'}];
    const action = selectTransactionsSuccess({transactions});
    const state = transactionReducers(initialTransactionState, action);

    expect(state.transactions).toEqual(transactions);
  });
});
