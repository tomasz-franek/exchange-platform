import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Features} from '../../features';
import {UserAccount} from '../../api/model/userAccount';

export interface AccountState {
  userAccounts: UserAccount[]
}

export const selectAccountFutureState = createFeatureSelector<AccountState>(
  Features.accounts,
);

export const selectUserAccountsList = createSelector(
  selectAccountFutureState,
  (state: AccountState) => state.userAccounts,
);

