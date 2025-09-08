import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../../features';
import { Transaction } from '../../api/model/transaction';

export interface TransactionState {
  transactions: Transaction[];
  systemTransactions: Transaction[];
  exchangeTransactions: Transaction[];
}

export const selectStatisticFutureState =
  createFeatureSelector<TransactionState>(Features.transactions);

export const selectTransactions = createSelector(
  selectStatisticFutureState,
  (state: TransactionState) => state.transactions,
);

export const selectSystemTransactions = createSelector(
  selectStatisticFutureState,
  (state: TransactionState) => state.systemTransactions,
);
export const selectExchangeTransactions = createSelector(
  selectStatisticFutureState,
  (state: TransactionState) => state.exchangeTransactions,
);
