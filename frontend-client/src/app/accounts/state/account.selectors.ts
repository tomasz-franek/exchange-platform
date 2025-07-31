import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../../state/features';
import { UserAccount } from '../../api/model/userAccount';
import { UserOperation } from '../../api/model/userOperation';
import { AccountBalance } from '../../api/model/accountBalance';
import { UserProperty } from '../../api/model/userProperty';

export interface AccountState {
  accountBalanceList: AccountBalance[];
  userAccount: UserAccount | null;
  userOperationList: UserOperation[] | [];
  userProperty: UserProperty;
  userId: string;
}

export const selectAccountFutureState = createFeatureSelector<AccountState>(
  Features.accounts,
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

export const selectUserOperationList = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.userOperationList,
);

export const getUserProperty = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.userProperty,
);
