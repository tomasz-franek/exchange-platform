import { AccountBalance } from '../../api';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../features';
import { UserAccount } from '../../api/model/userAccount';

export interface AccountState {
  accountBalanceList: AccountBalance[];
  userAccount: UserAccount | null;
  userId: string;
}
export const selectAccountFutureState = createFeatureSelector<AccountState>(
  Features.account,
);

export const selectAccountBalanceList = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.accountBalanceList,
);

export const selectUserId = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.userId,
);

export const selectUserAccount = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.userAccount,
);
