import {TransactionState} from './transaction.selectors';
import {createReducer, on} from '@ngrx/store';
import {selectTransactionsSuccess} from "./transaction.actions";

export const initialTransactionState: TransactionState = {
  transactions: []
};

export const transactionReducers = createReducer(
    initialTransactionState,
    on(selectTransactionsSuccess, (state, action) => {
      return {...state, transactions: action.transactions};
    })
);
