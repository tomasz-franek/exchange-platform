import {
  initialTransactionState,
  transactionReducers,
} from './transaction.reducers';
import {
  loadExchangeAccountTransactionListSuccess,
  loadSystemAccountTransactionListSuccess,
  loadTransactionListSuccess,
} from './transaction.actions';
import { Transaction } from '../../api/model/transaction';

describe('transactionReducers', () => {
  it('should return the initial state', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = transactionReducers(undefined, action);
    expect(state).toBe(initialTransactionState);
  });
  it('should handle selectTransactionsSuccess', () => {
    const transactions: Transaction[] = [{ amount: 10, dateUtc: 'x' }];
    const action = loadTransactionListSuccess({ transactions });
    const state = transactionReducers(initialTransactionState, action);

    expect(state.transactions).toEqual(transactions);
  });

  it('should handle loadExchangeAccountTransactionListSuccess', () => {
    const exchangeTransactions: Transaction[] = [{ amount: 10, dateUtc: 'x' }];
    const action = loadExchangeAccountTransactionListSuccess({
      exchangeTransactions,
    });
    const state = transactionReducers(initialTransactionState, action);

    expect(state.exchangeTransactions).toEqual(exchangeTransactions);
  });
  it('should handle loadSystemAccountTransactionListSuccess', () => {
    const systemTransactions: Transaction[] = [{ amount: 10, dateUtc: 'x' }];
    const action = loadSystemAccountTransactionListSuccess({
      systemTransactions,
    });
    const state = transactionReducers(initialTransactionState, action);

    expect(state.systemTransactions).toEqual(systemTransactions);
  });
});
