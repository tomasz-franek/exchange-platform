import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Features} from '../../features';
import {UserAccount} from '../../api/model/userAccount';
import {UserData} from '../../api/model/userData';

export interface AccountState {
  userAccounts: UserAccount[]
  users: UserData[]
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
)

