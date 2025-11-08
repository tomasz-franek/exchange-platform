import { TransactionState } from './transaction.selectors';
import { createReducer, on } from '@ngrx/store';
import {
  loadExchangeAccountTransactionListSuccess,
  loadSystemAccountTransactionListSuccess,
  loadTransactionListSuccess,
} from './transaction.actions';

export const initialTransactionState: TransactionState = {
  transactions: [],
  systemTransactions: [],
  exchangeTransactions: [],
};

export const transactionReducers = createReducer(
  initialTransactionState,
  on(loadTransactionListSuccess, (state, action) => {
    return { ...state, transactions: action.transactions };
  }),
  on(loadSystemAccountTransactionListSuccess, (state, action) => {
    return { ...state, systemTransactions: action.systemTransactions };
  }),
  on(loadExchangeAccountTransactionListSuccess, (state, action) => {
    return { ...state, exchangeTransactions: action.exchangeTransactions };
  }),
);
