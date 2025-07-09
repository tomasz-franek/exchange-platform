import {initialTransactionState, transactionReducers} from './transaction.reducers';

describe('transactionReducers', () => {
  it('should return the initial state when no action is passed', () => {
    const newState = transactionReducers(undefined, {
      type: '',
    });
    expect(newState).toEqual(initialTransactionState);
  });
});
