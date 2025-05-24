import { AccountState } from './account.selector';
import { createReducer, on } from '@ngrx/store';
import {
  loadUserAccountListSuccess,
  saveUserAccountSuccess,
} from './account.action';

export const initialAccountState: AccountState = {
  userId: '',
  accountBalanceList: [],
  userAccount: null,
};

export const accountReducer = createReducer(
  initialAccountState,
  on(loadUserAccountListSuccess, (state, action) => {
    return { ...state, accountBalance: action.accountBalance };
  }),
  on(saveUserAccountSuccess, (state, action) => {
    return { ...state, userAccount: action.userAccount };
  }),
);
