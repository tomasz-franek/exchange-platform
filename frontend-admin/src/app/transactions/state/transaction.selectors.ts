import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Features} from '../../features';
import {Transaction} from "../../api/model/transaction";

export interface TransactionState {
  transactions: Transaction[]
}

export const selectStatisticFutureState = createFeatureSelector<TransactionState>(
    Features.transactions,
);

export const selectTransactions = createSelector(
    selectStatisticFutureState,
    (state: TransactionState) => state.transactions,
);

