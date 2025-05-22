import { AccountBalance } from '../../api';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../features';

export interface AccountState {
  accountBalance: AccountBalance[];
  userId: number;
}
export const selectAccountFutureState = createFeatureSelector<AccountState>(
  Features.accounts,
);

export const getAccountBalance = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.accountBalance,
);

export const getUserId = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.userId,
);
