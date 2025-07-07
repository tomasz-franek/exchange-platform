import {AccountState} from './account.selectors';
import {createReducer, on} from '@ngrx/store';
import {loadAccountListSuccess} from './account.actions';

export const initialAccountState: AccountState = {
  userAccounts: []
};

export const accountReducers = createReducer(
  initialAccountState,
  on(loadAccountListSuccess, (state, action) => {
    return {...state, userAccounts: action.userAccounts};
  })
);
