import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../../features';
import { UserAccount } from '../../api/model/userAccount';
import { UserData } from '../../api/model/userData';
import { AccountOperation } from '../../api/model/accountOperation';
import { AccountAmountResponse } from '../../api/model/accountAmountResponse';

export interface AccountState {
  userAccounts: UserAccount[];
  users: UserData[];
  systemAccounts: UserAccount[];
  accountOperations: AccountOperation[];
  accountAmountResponse: AccountAmountResponse;
}

export const selectAccountFutureState = createFeatureSelector<AccountState>(
  Features.accounts,
);

export const selectUserAccountsList = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.userAccounts,
);

export const selectUserList = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.users,
);

export const selectSystemAccountList = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.systemAccounts,
);

export const selectAccountOperationList = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.accountOperations,
);

export const selectAccountAmountResponse = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.accountAmountResponse,
);
