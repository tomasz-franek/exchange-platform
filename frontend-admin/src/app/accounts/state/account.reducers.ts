import {AccountState} from './account.selectors';
import {createReducer, on} from '@ngrx/store';
import {loadAccountListSuccess, loadUserListActionSuccess} from './account.actions';

export const initialAccountState: AccountState = {
  userAccounts: [],
  users: []
};

export const accountReducers = createReducer(
  initialAccountState,
  on(loadAccountListSuccess, (state, action) => {
    return {...state, userAccounts: action.userAccounts};
  }),
  on(loadUserListActionSuccess, (state, action) => {
    return {...state, users: action.users};
  })
);
