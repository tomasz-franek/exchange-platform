import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../../features';
import { UserAccount } from '../../api/model/userAccount';
import { UserOperation } from '../../api/model/userOperation';
import { AccountBalance } from '../../api/model/accountBalance';

export interface AccountState {
  accountBalanceList: AccountBalance[];
  userAccount: UserAccount | null;
  userOperationList: UserOperation[] | [];
  userId: string;
}

export const selectAccountFutureState = createFeatureSelector<AccountState>(
  Features.accounts
);

export const selectAccountBalanceList = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.accountBalanceList
);

export const selectUserId = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.userId
);

export const selectUserAccount = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.userAccount
);

export const selectUserOperationList = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.userOperationList
);


