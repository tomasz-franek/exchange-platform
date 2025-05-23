import { AccountBalance } from '../../api';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../features';
import { UserAccount } from '../../api/model/userAccount';

export interface AccountState {
  accountBalance: AccountBalance[];
  userAccount: UserAccount | null;
  userId: string;
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

export const getUserAccount = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.userAccount,
);
