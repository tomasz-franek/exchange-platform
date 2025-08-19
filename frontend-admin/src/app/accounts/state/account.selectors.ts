import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../../features';
import { UserAccount } from '../../api/model/userAccount';
import { UserData } from '../../api/model/userData';
import { SystemAccountOperation } from '../../api/model/systemAccountOperation';

export interface AccountState {
  userAccounts: UserAccount[];
  users: UserData[];
  systemAccounts: UserAccount[];
  systemAccountOperations: SystemAccountOperation[];
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

export const selectSystemAccountOperationList = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.systemAccountOperations,
);
