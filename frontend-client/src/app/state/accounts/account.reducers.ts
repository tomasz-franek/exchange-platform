import { AccountState } from './account.selectors';
import { createReducer, on } from '@ngrx/store';
import {
  getUserAccountListSuccess,
  saveUserAccountSuccess,
} from './account.actions';

export const initialAccountState: AccountState = {
  userId: '',
  accountBalance: [],
  userAccount: null,
};

export const accountReducer = createReducer(
  initialAccountState,
  on(getUserAccountListSuccess, (state, action) => {
    return { ...state, accountBalance: action.accountBalance };
  }),
  on(saveUserAccountSuccess, (state, action) => {
    return { ...state, userAccount: action.userAccount };
  }),
);
